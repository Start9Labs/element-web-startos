import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  bridgeGateway,
  getPushDomainUrls,
  placeholderContactEmail,
} from '../utils'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  push: Value.union({
    name: i18n('Push Notifications'),
    description: i18n(
      'Deliver notifications to phones and desktops while Element Web is closed. Each person still turns notifications on in Element and allows them in their browser.',
    ),
    default: 'on',
    variants: Variants.of({
      off: { name: i18n('Off'), spec: InputSpec.of({}) },
      on: {
        name: i18n('On'),
        spec: InputSpec.of({
          contact_email: Value.text({
            name: i18n('Contact Email'),
            description: i18n(
              'Sent with every notification to the push service (Apple, Google, Mozilla) as the contact for this gateway, which web push requires. Nothing verifies it, and it is only ever used if a push service needs to reach whoever runs the gateway. For a private server, keep the placeholder: it gives the push services no address of yours. Enter your own address only if you want them to be able to contact you.',
            ),
            required: true,
            default: placeholderContactEmail,
            inputmode: 'email',
            patterns: [
              {
                regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
                description: i18n('Must be an email address'),
              },
            ],
          }),
          gateway: Value.dynamicSelect(async ({ effects }) => {
            const values: Record<string, string> = {
              [bridgeGateway]: i18n('A homeserver on this StartOS server'),
            }
            for (const url of await getPushDomainUrls(effects).once()) {
              values[url] = url
            }
            return {
              name: i18n('Homeserver'),
              description: i18n(
                'Where the homeserver that delivers the notifications runs. A homeserver elsewhere reaches this server only through a public domain: add one to the Push Gateway interface first, then choose it here.',
              ),
              default: bridgeGateway,
              values,
            }
          }),
        }),
      },
    }),
  }),
})

export const configurePushNotifications = sdk.Action.withInput(
  'configure-push-notifications',
  {
    name: i18n('Configure Push Notifications'),
    description: i18n(
      'Turn push notifications on or off, and choose how your homeserver reaches the push gateway.',
    ),
    warning: i18n(
      'If Element Web is running, it restarts to apply this change.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async () => {
    const push = await storeJson.read((s) => s.push).once()
    const value = {
      contact_email: push?.contactEmail ?? placeholderContactEmail,
      gateway: push?.gateway ?? bridgeGateway,
    }
    return {
      push: push?.enabled
        ? { selection: 'on' as const, value }
        : { selection: 'off' as const, value: {}, other: { on: value } },
    }
  },
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      push:
        input.push.selection === 'on'
          ? {
              enabled: true,
              contactEmail: input.push.value.contact_email,
              gateway: input.push.value.gateway,
            }
          : { enabled: false },
    })

    return {
      version: '1',
      title: i18n('Push Notifications Updated'),
      message:
        input.push.selection === 'on'
          ? i18n(
              'Push notifications are on. Each person turns them on in Element under Settings, Notifications, and allows them when the browser asks.',
            )
          : i18n(
              'Push notifications are off. A browser that had them on stops receiving them; its registration stays on the homeserver until that session signs out.',
            ),
      result: null,
    }
  },
)
