import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'element-web',
  title: 'Element Web (Start9 fork)',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/element-web-startos',
  upstreamRepo: 'https://github.com/Start9Labs/element-web',
  marketingUrl:
    'https://github.com/Start9Labs/element-web/blob/master/docs/fork.md',
  donationUrl: null,
  description: { short, long },
  volumes: ['config'],
  images: {
    'element-web': {
      source: {
        dockerTag: 'ghcr.io/start9labs/element-web:v1.12.27-start9-e2ee.1',
      },
      arch: ['x86_64', 'aarch64'],
    },
    sygnal: {
      source: { dockerTag: 'matrixdotorg/sygnal:v0.15.1' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
