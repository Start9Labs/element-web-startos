import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  notifyPath,
  pushHostId,
  pushInterfaceId,
  pushPort,
  uiPort,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const web = sdk.MultiHost.of(effects, 'web')
  const origin = await web.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: 80,
  })

  const matrixClient = sdk.createInterface(effects, {
    name: i18n('Matrix Client'),
    id: 'matrix-client',
    description: i18n('Open the Element Web Matrix client'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const push = sdk.MultiHost.of(effects, pushHostId)
  const pushOrigin = await push.bindPort(pushPort, { protocol: 'http' })

  const pushGateway = sdk.createInterface(effects, {
    name: i18n('Push Gateway'),
    id: pushInterfaceId,
    description: i18n(
      'Where a Matrix homeserver delivers push notifications for Element Web. A homeserver that is not on this StartOS server reaches it through a public domain added here.',
    ),
    type: 'api',
    masked: true,
    schemeOverride: null,
    username: null,
    path: notifyPath,
    query: {},
  })

  return [
    await origin.export([matrixClient]),
    await pushOrigin.export([pushGateway]),
  ]
})
