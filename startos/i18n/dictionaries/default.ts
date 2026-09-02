export const DEFAULT_LANG = 'en_US'

const dict = {
  'Matrix Client': 0,
  'Open the Element Web Matrix client': 1,
  'Element Web is ready': 2,
  'Element Web is not ready': 3,
  'Homeserver URL': 4,
  'HTTPS base URL for any Matrix homeserver that implements the Matrix Client-Server API.': 5,
  'Must be a valid HTTPS URL': 6,
  'e.g. https://matrix.example.com': 7,
  'Configure Default Homeserver': 8,
  'Set the Matrix homeserver that Element Web shows by default at sign-in.': 9,
  'If Element Web is running, it restarts to apply this change. Existing Matrix accounts and messages are not modified.': 10,
  'Default Homeserver Updated': 11,
  'Element Web will show this homeserver by default. People can still choose another homeserver at sign-in.': 12,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
