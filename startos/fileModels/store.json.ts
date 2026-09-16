import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { bridgeGateway, placeholderContactEmail } from '../utils'

const pushShape = z.object({
  enabled: z.boolean().catch(true),
  contactEmail: z.string().catch(placeholderContactEmail),
  gateway: z.string().catch(bridgeGateway),
})

const shape = z.object({
  push: pushShape.catch(() => pushShape.parse({})),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.config, subpath: 'store.json' },
  shape,
)
