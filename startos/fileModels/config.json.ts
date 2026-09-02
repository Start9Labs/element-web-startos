import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const defaultHomeserverUrl = 'https://matrix-client.matrix.org'

const homeserverShape = z.looseObject({
  base_url: z.string().catch(defaultHomeserverUrl),
})

const serverConfigShape = z.looseObject({
  'm.homeserver': homeserverShape.catch(() => homeserverShape.parse({})),
})

const shape = z.looseObject({
  default_server_config: serverConfigShape.catch(() =>
    serverConfigShape.parse({}),
  ),
  disable_custom_urls: z.literal(false).catch(false),
})

export const configJson = FileHelper.json(
  { base: sdk.volumes.config, subpath: 'config.json' },
  shape,
)
