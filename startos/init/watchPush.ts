import { configurePushNotifications } from '../actions/configurePushNotifications'
import { configJson } from '../fileModels/config.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  bridgeGateway,
  getPushDomainUrls,
  getSynapseHostnames,
  pushGatewayMissingTask,
  pushHomeserverRemoteTask,
  urlHostname,
} from '../utils'

export const watchPush = sdk.setupOnInit(async (effects) => {
  const push = await storeJson.read((s) => s.push).const(effects)
  const domainUrls = await getPushDomainUrls(effects).const()
  const homeserverUrl = await configJson
    .read((c) => c.default_server_config['m.homeserver'].base_url)
    .const(effects)
  const synapseHostnames = await getSynapseHostnames(effects).const()

  if (
    push?.enabled &&
    push.gateway === bridgeGateway &&
    !synapseHostnames?.includes(urlHostname(homeserverUrl ?? '') ?? '')
  ) {
    await sdk.action.createOwnTask(
      effects,
      configurePushNotifications,
      'important',
      {
        replayId: pushHomeserverRemoteTask,
        reason: i18n(
          "Push notifications cannot reach the default homeserver over this server's network: it is not the Synapse on this server. Point the default homeserver at Synapse here, or add a public domain to the Push Gateway interface and choose it as the homeserver location.",
        ),
      },
    )
  } else {
    await sdk.action.clearTask(effects, pushHomeserverRemoteTask)
  }

  if (
    push?.enabled &&
    push.gateway !== bridgeGateway &&
    !domainUrls.includes(push.gateway)
  ) {
    await sdk.action.createOwnTask(
      effects,
      configurePushNotifications,
      'important',
      {
        replayId: pushGatewayMissingTask,
        reason: i18n(
          'The public domain chosen for push notifications is gone. Choose another homeserver location.',
        ),
      },
    )
  } else {
    await sdk.action.clearTask(effects, pushGatewayMissingTask)
  }
})
