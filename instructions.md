# Element Web (Start9 fork)

## Documentation

- [Element Web documentation](https://web-docs.element.dev/) — official guidance for signing in, messaging, rooms, calls, encryption, and the full `config.json` reference.
- [What the Start9 fork changes](https://github.com/Start9Labs/element-web/blob/master/docs/fork.md) — the phone layout, installing the app, and push notifications.

## What you get on StartOS

The **Matrix Client** interface opens a self-hosted Element Web application. It can connect to Synapse or any other compatible Matrix homeserver, including a remote provider. It fits a phone screen, can be installed to the home screen like an app, and — once push notifications are on — delivers notifications while the app is closed.

The **Configure Default Homeserver** action chooses which server appears by default at sign-in, and whether people may sign in to a different one instead.

The **Configure Push Notifications** action turns push notifications off or on for everyone who uses this Element Web, and tells the package where your homeserver runs. Push is on from the start for a homeserver on this same StartOS server.

## Getting set up

1. If you want to use a homeserver other than the default, run **Configure Default Homeserver** and enter its HTTPS base URL. For Synapse on StartOS, use the HTTPS address chosen for Synapse's **Homeserver** interface.
2. Start Element Web.
3. Open the **Matrix Client** interface.
4. Sign in with an account from your Matrix homeserver, or create one if that homeserver allows registration.

The homeserver URL must be reachable from each person's browser. Element Web runs in the browser and connects to the homeserver directly.

## Using Element Web

### Matrix Client

Use the web interface for chats, rooms, file sharing, voice and video calls, and encrypted conversations. Your account and messages remain on your Matrix homeserver rather than in this package.

On a phone, the client shows one screen at a time — the room list, a room, or a room's details — with a back button in the room header. To install it as an app, use the browser's install option (Chrome and Edge on Android or desktop) or **Share → Add to Home Screen** in Safari on iOS.

### Notifications on your phone or desktop

Push notifications are available unless the administrator has turned them off. Each person turns them on for themselves in Element under **Settings → Notifications** and allows notifications when the browser asks. From then on, messages arrive as notifications while Element Web is closed, and tapping one opens the room. On iOS this works only for an Element Web that has been added to the Home Screen; open Element Web over an HTTPS address (a StartOS `.local` address with the server's certificate trusted, or a domain), since browsers do not run notifications on a plain `http://` page.

### Configure Default Homeserver

Run this action when you want the sign-in screen to lead users to a different homeserver. A running Element Web service restarts to load the new URL; a stopped service uses it on the next start. This does not move accounts or messages between servers.

Turn off **Allow Other Homeservers** to point everyone at your own server only — the sign-in screen then stops offering the choice of a different one. Leave it on if people using this Element Web have accounts elsewhere. It is a convenience, not a security boundary: anyone already signed in to another server stays signed in, and someone typing a full Matrix ID such as `@name:other-server.org` on the password form can still be sent to that server. To keep people off other servers for certain, restrict them on the homeserver itself.

### Configure Push Notifications

Run this action to turn push notifications off or back on, to change the contact email, or to tell the package where your homeserver runs. A running Element Web restarts to apply the change.

**Contact Email** goes to the push services (Apple, Google, Mozilla) with every notification, as the contact for this server's push gateway; web push requires one. Nothing checks it, nobody using Element Web sees it, and it would only ever be used if a push service needed to reach whoever runs the gateway — which, for a private server, does not happen. You have two options: keep the placeholder, `push@element-web.invalid`, which can never be delivered anywhere and gives the push services no address of yours; or enter your own address, if you want them to be able to contact you. For a private, self-hosted server we recommend keeping the placeholder.

**Homeserver** tells the package where the homeserver that delivers the notifications runs. **A homeserver on this StartOS server** is right for Synapse on StartOS. If your homeserver runs elsewhere — a hosted provider, or a server of your own on another machine — it can only reach this server through a public domain: add one to the **Push Gateway** interface first, then run the action again and choose that domain here. If that domain is later removed, StartOS asks you to run the action again and choose another.

Notifications pass through the push services run by Apple, Google, Mozilla and Microsoft on their way to each browser. The message contents are encrypted for the browser before they leave this server, but those services can see that a notification was sent and when. Turn push off if that is not acceptable for your deployment.

Turning push off stops new notifications at once. Anyone who had them on should also turn notifications off in Element's settings, which removes their registration from the homeserver.
