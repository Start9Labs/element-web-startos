# Element Web

## Documentation

- [Element Web documentation](https://web-docs.element.dev/) — official guidance for signing in, messaging, rooms, calls, encryption, and the full `config.json` reference.

## What you get on StartOS

The **Matrix Client** interface opens a self-hosted Element Web application. It can connect to Synapse or any other compatible Matrix homeserver, including a remote provider.

The **Configure Default Homeserver** action chooses which server appears by default at sign-in, and whether people may sign in to a different one instead.

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

Turn off **Allow Other Homeservers** to point everyone at your own server only — the sign-in screen then stops offering the choice of a different one. Leave it on if people using this Element Web have accounts elsewhere. It is a convenience, not a security boundary: anyone already signed in to another server stays signed in, and someone typing a full Matrix ID such as `@name:other-server.org` on the password form can still be sent to that server. To keep people off other servers for certain, restrict them on the homeserver itself.
