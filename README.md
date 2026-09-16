<p align="center">
  <img src="icon.svg" alt="Element Web Logo" width="21%">
</p>

# Element Web (Start9 fork) on StartOS

> Everything not listed in this document should behave the same as upstream Element Web.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

This package runs [Start9's fork of Element Web](https://github.com/Start9Labs/element-web) on StartOS: an upstream Element Web release with a phone layout, installation to the home screen, web push notifications, and a reload prompt for a page left open across an update. Push notifications need a gateway the homeserver can post to, so the package also runs [Sygnal](https://github.com/matrix-org/sygnal) beside the client. The administrator chooses any compatible Matrix homeserver as the default and turns push on or off.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package runs two images on x86_64 and aarch64. The `element-web` subcontainer runs `ghcr.io/start9labs/element-web`, the fork's `e2ee` build: upstream's Dockerfile, so the image's default entrypoint prepares the runtime configuration and launches unprivileged nginx, with StartOS setting `ELEMENT_WEB_PORT=8080`. The `sygnal` subcontainer runs the upstream `matrixdotorg/sygnal` image with `SYGNAL_CONF=/config/sygnal.yaml`, and exists only while push notifications are on.

The fork's `e2ee` line keeps upstream's handling of end-to-end encryption. Its other line, keyless mode for a homeserver that force-disables encryption, is not what this package ships.

## Volume and Data Layout

The `config` volume holds everything the package owns:

| Path                       | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `config/config.json`       | Element Web's configuration, mounted read-only over the image's `/app/config.json` |
| `config/store.json`        | Push notification settings                                                        |
| `config/sygnal/vapid.pem`  | The VAPID private key, mounted read-only into the `sygnal` subcontainer at `/data` |

The upstream entrypoint copies `config.json` to `/tmp/element-web-config/config.json` before nginx starts serving the client. Sygnal's own `sygnal.yaml` is generated on every start and written to the `sygnal` subcontainer's rootfs, never to the volume.

Element Web is a static browser client. Matrix account data and messages live on the selected homeserver, while each browser keeps its own local session and encryption state.

## File Models

`config/config.json` is a JSON file model mounted over the image's own `/app/config.json`, so it is the entire file Element Web loads — the image's copy is replaced, not merged into. Element's compiled-in defaults still cover most of the keys the file omits; the few they do not are listed under [Limitations and Differences](#limitations-and-differences).

Init seeds the file from the model's defaults and repairs any of them that is missing or holds the wrong type: `default_server_config.m.homeserver.base_url` set to Matrix.org, `disable_custom_urls` `false`, `disable_phone_login` `true`, `embedded_pages.login_for_welcome` `true`, and `setting_defaults."UIFeature.identityServer"` `false`. The first two belong to the administrator: **Configure Default Homeserver** is the only thing that rewrites them, so a value it set survives every restart. The other three are package defaults for a self-hosted deployment; a hand edit survives, and a hand-added key the model does not name is left alone. `web_push` is derived: `main` writes it on every start from the push settings and the VAPID key, and removes it when push is off, so a hand edit to it does not survive.

Because the upstream entrypoint copies the configuration to `/tmp/element-web-config/` at launch and nginx serves it from there, a change to `config.json` takes effect only after a restart. **Configure Default Homeserver** restarts a running service after writing the file; a change to the push settings restarts it through `main`.

`config/store.json` holds the package's own state for push notifications: whether push is on, the contact email, and which gateway address the homeserver uses (`bridge`, or a public domain's push URL). Init seeds it with push on, the contact set to the placeholder `push@element-web.invalid` (an RFC 2606 reserved domain, so it can never be delivered anywhere), and the bridge as the gateway; **Configure Push Notifications** is the only thing that rewrites it.

`config/sygnal/vapid.pem` is the P-256 VAPID private key, generated by init when the file does not exist and never rewritten. Its public half is derived from it on every start and published to browsers as `web_push.application_server_key`, and the fork resubscribes a browser whose subscription was made under a different key, so deleting the file rotates the key at the cost of every existing subscription.

## Dependencies

None. Element Web communicates from the user's browser with any Matrix homeserver that implements the standard Client-Server API; it does not require a specific StartOS homeserver package.

Push notifications do involve the homeserver in one direction: it posts each notification to this package's push gateway. A homeserver on the same StartOS server reaches the gateway over the container bridge at the address `main` resolves for it. Synapse blocks private address ranges for outbound requests by default, so a Synapse whose `ip_range_whitelist` does not admit the bridge gateway silently drops every push; the StartOS Synapse package admits it.

## Network Access and Interfaces

The `matrix-client` interface is an unmasked HTTP `ui` interface on internal port 8080, with port 80 preferred externally. It serves the Element Web application; the browser then connects directly to the configured homeserver over HTTPS.

The `push-gateway` interface is a masked HTTP `api` interface on internal port 5000, on its own host (`push`), with the path `/_matrix/push/v1/notify`. Nothing a person uses lives there; it exists so that a homeserver running elsewhere can be given a public domain to post to, and so that a homeserver on this server can reach the bound port over the container bridge. It answers only while push is on.

Sygnal makes outbound connections to the browsers' push services — `fcm.googleapis.com`, `*.push.apple.com`, `updates.push.services.mozilla.com` and `*.notify.windows.com` — and to nothing else; `allowed_endpoints` in its generated configuration is fixed to that list.

## Installation and First-Run Flow

Init creates the Element Web configuration with the upstream Matrix.org endpoint as the default, seeds `store.json` with push on against a homeserver on this server, and generates the VAPID key, so the first start already runs Sygnal and offers push to browsers. The administrator may replace the homeserver before or after the first start, and people signing in may still choose another homeserver.

No account or credential is created by this package. Registration, authentication, rooms, messages, and account recovery are provided by the selected homeserver.

## Actions

**Configure Default Homeserver** should be run when this Element Web instance should lead users to a different Matrix server, including Synapse or another homeserver hosted on StartOS, or when the administrator wants sign-in restricted to that one server. It rewrites `default_server_config.m.homeserver.base_url` and `disable_custom_urls` in `config.json`; a running client restarts in a few seconds, while a stopped client uses the setting on its next start. It is safe to repeat and does not modify Matrix accounts, messages, or the homeserver itself.

Turning off its **Allow Other Homeservers** toggle writes `disable_custom_urls: true`, which removes the server picker from the sign-in and registration screens. Two limits are worth knowing before treating it as a hard boundary: sessions already signed in to another homeserver keep working until they sign out, and upstream's legacy password form still performs its own `.well-known` lookup when someone enters a full Matrix ID, so it can still reach a different server. Enforce the boundary at the homeserver, not here.

**Configure Push Notifications** turns web push on or off. On carries a contact email, which Sygnal sends to the push services as the VAPID contact for this gateway in every push request and which nobody using Element Web sees — nothing verifies it, and the placeholder is the right value for a private server, since a real address only tells the push services who runs it — and a homeserver location: **A homeserver on this StartOS server**, which resolves to the push gateway's container-bridge address, or one of the public domains added to the **Push Gateway** interface, for a homeserver running elsewhere. The action rewrites `store.json`; `main` then rewrites `web_push` in `config.json`, generates `sygnal.yaml`, and starts or stops the `sygnal` daemon, restarting a running service. It is safe to repeat. Turning push on is what makes Element offer working notifications while the app is closed; each person still turns notifications on in Element and allows them in the browser, and only then does the browser subscribe and register a pusher with the homeserver. Turning push off removes `web_push` and stops Sygnal, but the fork cannot unregister a pusher it no longer has configuration for, so a browser's registration stays on the homeserver until that session signs out. Changing the homeserver location while push stays on applies to browsers that turn notifications on afterwards; a browser already registered keeps the previous gateway address until it turns notifications off and on again in Element.

## Tasks

Init watches the push settings: when push is on with a public domain as the homeserver location and that domain is no longer on the **Push Gateway** interface, it raises an `important` task with the replay key `element-web:push-gateway-missing` pointing at **Configure Push Notifications**, and clears it once the location is valid again. While that task stands, `main` omits `web_push` from `config.json`, so browsers stop being offered push until a location is chosen. It does not block startup.

## Health Checks

The `element-web` daemon readiness check verifies that nginx is listening on port 8080. A persistent failure means the image entrypoint could not prepare the runtime configuration or nginx exited; inspect the `element-web` subcontainer logs and confirm `config/config.json` is readable.

The `sygnal` daemon readiness check, present only while push is on, fetches `http://127.0.0.1:5000/health`. A persistent failure means Sygnal refused its configuration — most likely the VAPID key file is missing or not a valid EC private key, which its log reports as a `PushkinSetupException` — or the process exited; inspect the `sygnal` subcontainer logs.

## Backups and Restore

Backups snapshot the `config` volume wholesale: the selected default homeserver and other Element Web settings, the push settings, and the VAPID key, so a restore keeps every browser's push subscription valid. Restoring does not restore Matrix account data, which remains on the homeserver, or browser-local sessions and encryption state.

## Limitations and Differences

1. This package provides the web client only; a Matrix homeserver must be available separately.
2. The user's browser connects to the homeserver directly, so the configured URL must be reachable and trusted by every browser using Element Web.
3. StartOS backups preserve package configuration, not browser-local login sessions or encryption keys.
4. Push notifications travel through the browser vendors' push services (Google, Apple, Mozilla, Microsoft). Sygnal encrypts each notification's content for the browser, but the services see that a push happened and when, and this server needs outbound internet access to reach them.
5. Push requires Element Web to be open over HTTPS — a StartOS `.local` address with the server's root CA trusted, or a domain — because browsers only run a service worker in a secure context. On iOS, notifications reach only an Element Web that has been added to the Home Screen.
6. Push notifications reach a homeserver running elsewhere only through a public domain on the **Push Gateway** interface; a LAN or Tor address cannot be chosen as the homeserver location.
7. The package serves its own `config.json` in place of the one in the upstream image. Element's compiled-in defaults cover most of what that file set, but three of its settings have no such fallback: `map_style_url`, so location sharing fails with a map-not-configured error unless the homeserver advertises a tile server in its `.well-known`; `m.identity_server`, so there is no default identity server for email or phone lookup unless the homeserver advertises one; and `room_directory.servers`, so the public room directory offers only the homeserver the user signed in to.
8. Phone-number sign-in and identity-server features are off by default (`disable_phone_login`, `UIFeature.identityServer`), because a self-hosted homeserver rarely provides an identity server for them; upstream's welcome page is skipped in favour of the sign-in form.

---

## Quick Reference for AI Consumers

```yaml
package_id: element-web
images:
  element-web: ghcr.io/start9labs/element-web
  sygnal: matrixdotorg/sygnal
architectures: [x86_64, aarch64]
subcontainers: [element-web, sygnal]
volumes:
  config:
    config.json: /app/config.json (element-web, file mount)
    store.json: package state, not mounted
    sygnal/: /data (sygnal, read-only)
file_models:
  - config/config.json
  - config/store.json
  - config/sygnal/vapid.pem
startos_managed_env_vars:
  - ELEMENT_WEB_PORT
  - SYGNAL_CONF
dependencies: none
interfaces:
  matrix-client: { type: ui, host: web, port: 8080 }
  push-gateway: { type: api, host: push, port: 5000, path: /_matrix/push/v1/notify }
actions:
  - configure-default-homeserver
  - configure-push-notifications
tasks:
  - element-web:push-gateway-missing (important, while the chosen domain is gone)
health_checks:
  - element-web
  - sygnal (while push is on)
```
