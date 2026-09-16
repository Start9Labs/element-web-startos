import { generateKeyPairSync } from 'node:crypto'
import { configJson } from '../fileModels/config.json'
import { storeJson } from '../fileModels/store.json'
import { vapidPem } from '../fileModels/vapid.pem'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await configJson.merge(effects, {})
  await storeJson.merge(effects, {})
  if ((await vapidPem.read().once()) === null) {
    await vapidPem.write(
      effects,
      generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' },
      }).privateKey,
    )
  }
})
