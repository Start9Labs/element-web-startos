import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) =>
  sdk.Daemons.of(effects).addDaemon('element-web', {
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
  }),
)
