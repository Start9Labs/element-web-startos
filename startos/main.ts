import { configJson } from './fileModels/config.json'
import { storeJson } from './fileModels/store.json'
import { vapidPem } from './fileModels/vapid.pem'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bridgeGateway,
  getPushDomainUrls,
  getSynapseHostnames,
  notifyPath,
  pushAppId,
  pushHostId,
  pushPort,
  uiPort,
  urlHostname,
  vapidPublicKey,
} from './utils'

const pushEndpoints = [
  'fcm.googleapis.com',
  '*.push.apple.com',
  'updates.push.services.mozilla.com',
  '*.notify.windows.com',
]

export const main = sdk.setupMain(async ({ effects }) => {
  // Both keys Configure Default Homeserver writes, so the service restarts on either.
  const homeserver = await configJson
    .read((c) => ({
      base_url: c.default_server_config['m.homeserver'].base_url,
      disable_custom_urls: c.disable_custom_urls,
    }))
    .const(effects)
  const push = await storeJson.read((s) => s.push).const(effects)
  const pem = await vapidPem.read().const(effects)
  const bridge = await sdk.host
    .getBridgeAddress(effects, {
      hostId: pushHostId,
      internalPort: pushPort,
      ssl: false,
    })
    .const()
  const domainUrls = await getPushDomainUrls(effects).const()
  const synapseHostnames = await getSynapseHostnames(effects).const()

  const pushActive = !!push?.enabled && !!pem
  const homeserverOnThisServer =
    !!homeserver &&
    !!synapseHostnames?.includes(urlHostname(homeserver.base_url) ?? '')
  const gatewayUrl = !pushActive
    ? undefined
    : push.gateway === bridgeGateway
      ? homeserverOnThisServer && bridge && `http://${bridge}${notifyPath}`
      : domainUrls.find((url) => url === push.gateway)

  await configJson.merge(effects, {
    web_push:
      pushActive && gatewayUrl
        ? {
            gateway_url: gatewayUrl,
            app_id: pushAppId,
            application_server_key: vapidPublicKey(pem),
            homeservers:
              push.gateway === bridgeGateway
                ? (synapseHostnames ?? undefined)
                : undefined,
          }
        : undefined,
  })

  const daemons = sdk.Daemons.of(effects).addDaemon('element-web', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'element-web' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'config',
        subpath: 'config.json',
        mountpoint: '/app/config.json',
        readonly: true,
        type: 'file',
      }),
      'element-web',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      env: { ELEMENT_WEB_PORT: String(uiPort) },
    },
    ready: {
      display: i18n('Matrix Client'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('Element Web is ready'),
          errorMessage: i18n('Element Web is not ready'),
        }),
    },
    requires: [],
  })

  if (!pushActive) return daemons

  const sygnal = sdk.SubContainer.of(
    effects,
    { imageId: 'sygnal' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'config',
      subpath: 'sygnal',
      mountpoint: '/data',
      readonly: true,
    }),
    'sygnal',
  )
  await sygnal.writeFile(
    '/config/sygnal.yaml',
    JSON.stringify({
      http: { bind_addresses: ['0.0.0.0'], port: pushPort },
      log: {
        setup: {
          version: 1,
          formatters: {
            normal: {
              format: '%(asctime)s %(levelname)-5s %(name)s %(message)s',
            },
          },
          handlers: {
            stdout: {
              class: 'logging.StreamHandler',
              formatter: 'normal',
              stream: 'ext://sys.stdout',
            },
          },
          root: { handlers: ['stdout'], level: 'INFO' },
          disable_existing_loggers: false,
        },
        access: { x_forwarded_for: true },
      },
      apps: {
        [pushAppId]: {
          type: 'webpush',
          vapid_private_key: '/data/vapid.pem',
          vapid_contact_email: push.contactEmail,
          allowed_endpoints: pushEndpoints,
        },
      },
    }),
  )

  return daemons.addDaemon('sygnal', {
    subcontainer: sygnal,
    exec: {
      command: ['python', '-m', 'sygnal.sygnal'],
      env: { SYGNAL_CONF: '/config/sygnal.yaml' },
    },
    ready: {
      display: i18n('Push Gateway'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://127.0.0.1:${pushPort}/health`,
          {
            successMessage: i18n('The push gateway is ready'),
            errorMessage: i18n('The push gateway is not ready'),
          },
        ),
    },
    requires: [],
  })
})
