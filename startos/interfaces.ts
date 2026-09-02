import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

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

  return [await origin.export([matrixClient])]
})
