# Element Web

## Documentation

- [Element Web user guide](https://web-docs.element.dev/) — official guidance for signing in, messaging, rooms, calls, and encryption.
- [Element Web configuration](https://github.com/element-hq/element-web/blob/develop/docs/config.md) — upstream reference for `config.json` settings.

## What you get on StartOS

The **Matrix Client** interface opens a self-hosted Element Web application. It can connect to Synapse or any other compatible Matrix homeserver, including a remote provider.

The **Configure Default Homeserver** action chooses which server appears by default at sign-in. People can still choose another homeserver from Element Web.

## Getting set up

1. If you want to use a homeserver other than the default, run **Configure Default Homeserver** and enter its HTTPS base URL. For Synapse on StartOS, use the HTTPS address chosen for Synapse's **Homeserver** interface.
2. Start Element Web.
3. Open the **Matrix Client** interface.
4. Sign in with an account from your Matrix homeserver, or create one if that homeserver allows registration.

The homeserver URL must be reachable from each person's browser. Element Web runs in the browser and connects to the homeserver directly.

## Using Element Web

### Matrix Client

Use the web interface for chats, rooms, file sharing, voice and video calls, and encrypted conversations. Your account and messages remain on your Matrix homeserver rather than in this package.

### Configure Default Homeserver

Run this action when you want the sign-in screen to lead users to a different homeserver. A running Element Web service restarts to load the new URL; a stopped service uses it on the next start. This does not move accounts or messages between servers.
