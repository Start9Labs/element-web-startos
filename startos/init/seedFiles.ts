import { configJson } from '../fileModels/config.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await configJson.merge(effects, {})
})
