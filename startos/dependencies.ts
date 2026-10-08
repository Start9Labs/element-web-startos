import { sdk } from './sdk'

const synapse = sdk.Dependency.optional('synapse', {
  description:
    'A homeserver on this server, which push notifications reach without any public domain',
  metadata: {
    title: 'Synapse',
    icon: 'https://raw.githubusercontent.com/Start9Labs/synapse-startos/419c08bede61f713c09ef8be5a02d43ff6183c53/icon.svg',
  },
  // First release whose ip_range_whitelist admits the bridge the push gateway is reached on.
  versionRange: '>=1.161.0:1',
  kind: 'exists',
  enabled: async () => false,
})

export const dependencies = sdk.Dependencies.of().addDependency(synapse)
