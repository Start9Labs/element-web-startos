import { createPublicKey } from 'node:crypto'
import { T } from '@start9labs/start-sdk'
import {
  homeserverHostId,
  homeserverInterfaceId,
} from 'synapse-startos/startos/interfaces'
import { manifest as synapseManifest } from 'synapse-startos/startos/manifest'
import { sdk } from './sdk'

export const uiPort = 8080
export const pushPort = 5000
export const pushHostId = 'push'
export const pushInterfaceId = 'push-gateway'
export const pushAppId = 'com.start9.element-web'
export const notifyPath = '/_matrix/push/v1/notify'
export const bridgeGateway = 'bridge'
export const placeholderContactEmail = 'push@element-web.invalid'
export const pushGatewayMissingTask = 'element-web:push-gateway-missing'
export const pushHomeserverRemoteTask = 'element-web:push-homeserver-remote'

export const vapidPublicKey = (pem: string) =>
  createPublicKey(pem)
    .export({ type: 'spki', format: 'der' })
    .subarray(-65)
    .toString('base64url')

export const getPushDomainUrls = (effects: T.Effects) =>
  sdk.host.getOwn(effects, pushHostId, (host) =>
    host
      ? (Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === pushInterfaceId)
          ?.addressInfo.filter({ kind: 'domain', visibility: 'public' })
          .format() ?? [])
      : [],
  )

export const getSynapseHostnames = (effects: T.Effects) =>
  sdk.host.get(
    effects,
    { packageId: synapseManifest.id, hostId: homeserverHostId },
    (host) =>
      host
        ? (Object.values(host.bindings)
            .flatMap((b) => Object.values(b.interfaces))
            .find((i) => i.id === homeserverInterfaceId)
            ?.addressInfo.hostnames.map((h) => h.hostname) ?? [])
        : null,
  )

export const urlHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^\[(.*)\]$/, '$1')
  } catch {
    return null
  }
}
