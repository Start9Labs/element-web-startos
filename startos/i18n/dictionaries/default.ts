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
  'Set the Matrix homeserver Element Web shows by default at sign-in, and whether people may sign in to a different one.': 9,
  'If Element Web is running, it restarts to apply this change. Existing Matrix accounts and messages are not modified.': 10,
  'Default Homeserver Updated': 11,
  'Element Web will show this homeserver by default. People can still choose another homeserver at sign-in.': 12,
  'Allow Other Homeservers': 13,
  'Let people sign in to a homeserver other than the one above. Turn this off to restrict Element Web to your own Matrix server.': 14,
  'Element Web will use this homeserver only. The sign-in screen no longer offers a custom homeserver.': 15,
  'Push Notifications': 16,
  'Deliver notifications to phones and desktops while Element Web is closed. Each person still turns notifications on in Element and allows them in their browser.': 17,
  Off: 18,
  On: 19,
  'Contact Email': 20,
  'Web push requires a contact address for whoever runs this gateway. Nothing checks it and nobody using Element Web sees it. Keep the placeholder unless you want to be reachable about this server.': 21,
  'Must be an email address': 22,
  'A homeserver on this StartOS server': 23,
  Homeserver: 24,
  'Where the homeserver that delivers the notifications runs. A homeserver elsewhere reaches this server only through a public domain: add one to the Push Gateway interface first, then choose it here.': 25,
  'Configure Push Notifications': 26,
  'Turn push notifications on or off, and choose how your homeserver reaches the push gateway.': 27,
  'If Element Web is running, it restarts to apply this change.': 28,
  'Push Notifications Updated': 29,
  'Push notifications are on. Each person turns them on in Element under Settings, Notifications, and allows them when the browser asks.': 30,
  'Push notifications are off. A browser that had them on stops receiving them; its registration stays on the homeserver until that session signs out.': 31,
  'The public domain chosen for push notifications is gone. Choose another homeserver location.': 33,
  'Push Gateway': 34,
  'Where a Matrix homeserver delivers push notifications for Element Web. A homeserver that is not on this StartOS server reaches it through a public domain added here.': 35,
  'The push gateway is ready': 36,
  'The push gateway is not ready': 37,
  "Push notifications cannot reach the default homeserver over this server's network: it is not the Synapse on this server. Point the default homeserver at Synapse here, or add a public domain to the Push Gateway interface and choose it as the homeserver location.": 38,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
