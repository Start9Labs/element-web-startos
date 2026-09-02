import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'element-web',
  title: 'Element Web',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/element-web-startos',
  upstreamRepo: 'https://github.com/element-hq/element-web',
  marketingUrl: 'https://element.io/',
  donationUrl: null,
  description: { short, long },
  volumes: ['config'],
  images: {
    'element-web': {
      source: { dockerTag: 'vectorim/element-web:v1.12.27' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
