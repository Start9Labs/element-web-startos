import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const vapidPem = FileHelper.string({
  base: sdk.volumes.config,
  subpath: 'sygnal/vapid.pem',
})
