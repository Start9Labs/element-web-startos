import { sdk } from '../sdk'
import { configureDefaultHomeserver } from './configureDefaultHomeserver'
import { configurePushNotifications } from './configurePushNotifications'

export const actions = sdk.Actions.of()
  .addAction(configureDefaultHomeserver)
  .addAction(configurePushNotifications)
