import { configJson, defaultHomeserverUrl } from '../fileModels/config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  base_url: Value.text({
    name: i18n('Homeserver URL'),
    description: i18n(
      'HTTPS base URL for any Matrix homeserver that implements the Matrix Client-Server API.',
    ),
    required: true,
    default: defaultHomeserverUrl,
    patterns: [
      {
        regex: 'https://[^\\s]+',
        description: i18n('Must be a valid HTTPS URL'),
      },
    ],
    minLength: null,
    maxLength: 2048,
    placeholder: i18n('e.g. https://matrix.example.com'),
  }),
})

export const configureDefaultHomeserver = sdk.Action.withInput(
  'configure-default-homeserver',
  {
    name: i18n('Configure Default Homeserver'),
    description: i18n(
      'Set the Matrix homeserver that Element Web shows by default at sign-in.',
    ),
    warning: i18n(
      'If Element Web is running, it restarts to apply this change. Existing Matrix accounts and messages are not modified.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async () => ({
    base_url:
      (await configJson
        .read((config) => config.default_server_config['m.homeserver'].base_url)
        .once()) ?? defaultHomeserverUrl,
  }),
  async ({ effects, input }) => {
    try {
      const homeserverUrl = new URL(input.base_url)
      if (homeserverUrl.protocol !== 'https:' || !homeserverUrl.hostname) {
        throw new Error()
      }
    } catch {
      throw new Error(i18n('Must be a valid HTTPS URL'))
    }

    await configJson.merge(effects, {
      default_server_config: {
        'm.homeserver': { base_url: input.base_url },
      },
    })
    await sdk.restart(effects)

    return {
      version: '1',
      title: i18n('Default Homeserver Updated'),
      message: i18n(
        'Element Web will show this homeserver by default. People can still choose another homeserver at sign-in.',
      ),
      result: null,
    }
  },
)
