import { configurePushNotifications } from '../actions/configurePushNotifications'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  bridgeGateway,
  getPushDomainUrls,
  pushGatewayMissingTask,
} from '../utils'

export const watchPush = sdk.setupOnInit(async (effects) => {
  const push = await storeJson.read((s) => s.push).const(effects)
  const domainUrls = await getPushDomainUrls(effects).const()
  if (
    push?.enabled &&
    push.gateway !== bridgeGateway &&
    !domainUrls.includes(push.gateway)
  ) {
    await sdk.action.createOwnTask(
      effects,
      configurePushNotifications,
      'important',
      {
        replayId: pushGatewayMissingTask,
        reason: i18n(
          'The public domain chosen for push notifications is gone. Choose another homeserver location.',
        ),
      },
    )
  } else {
    await sdk.action.clearTask(effects, pushGatewayMissingTask)
  }
})
