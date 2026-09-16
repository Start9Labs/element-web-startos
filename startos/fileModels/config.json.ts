import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const defaultHomeserverUrl = 'https://matrix-client.matrix.org'

const homeserverShape = z.looseObject({
  base_url: z.string().catch(defaultHomeserverUrl),
})

const serverConfigShape = z.looseObject({
  'm.homeserver': homeserverShape.catch(() => homeserverShape.parse({})),
})

const embeddedPagesShape = z.looseObject({
  login_for_welcome: z.boolean().catch(true),
})

const settingDefaultsShape = z.looseObject({
  'UIFeature.identityServer': z.boolean().catch(false),
})

const shape = z.looseObject({
  default_server_config: serverConfigShape.catch(() =>
    serverConfigShape.parse({}),
  ),
  disable_custom_urls: z.boolean().catch(false),
  disable_phone_login: z.boolean().catch(true),
  embedded_pages: embeddedPagesShape.catch(() => embeddedPagesShape.parse({})),
  setting_defaults: settingDefaultsShape.catch(() =>
    settingDefaultsShape.parse({}),
  ),
  web_push: z
    .object({
      gateway_url: z.string(),
      app_id: z.string(),
      application_server_key: z.string(),
      homeservers: z.array(z.string()).optional(),
    })
    .optional()
    .catch(undefined),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.config, subpath: 'config.json' },
  shape,
)
