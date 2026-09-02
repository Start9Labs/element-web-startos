<p align="center">
  <img src="icon.svg" alt="Element Web Logo" width="21%">
</p>

# Element Web on StartOS

> Everything not listed in this document should behave the same as upstream Element Web.
> If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation section of
> `instructions.md` for links.

This package runs the [Element Web](https://github.com/element-hq/element-web) Matrix client on StartOS and lets the administrator choose any compatible Matrix homeserver as its default.

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

The package runs the unmodified upstream `vectorim/element-web` image on x86_64 and aarch64. The `element-web` subcontainer uses the image's default entrypoint, which prepares runtime configuration and launches unprivileged nginx. StartOS sets `ELEMENT_WEB_PORT=8080` so that nginx binds an unprivileged internal port.

## Volume and Data Layout

The `config` volume stores `config.json`. That file is mounted read-only at `/app/config.json`; the upstream entrypoint copies it to `/tmp/element-web-config/config.json` before nginx starts serving the client.

Element Web is a static browser client. Matrix account data and messages live on the selected homeserver, while each browser keeps its own local session and encryption state.

## File Models

The package owns `config/config.json` as a JSON file model. Init merges schema defaults into it, preserving unmodeled upstream keys while enforcing an HTTPS default homeserver entry and keeping custom homeserver selection available at sign-in.

The **Configure Default Homeserver** action changes only `default_server_config.m.homeserver.base_url`. Because the upstream entrypoint copies configuration at launch, the action restarts a running Element Web service after writing the file; a stopped service applies it on its next start. A hand edit survives unless it conflicts with a modeled value; changes made while the service is running take effect after a restart.

## Dependencies

None. Element Web communicates from the user's browser with any Matrix homeserver that implements the standard Client-Server API; it does not require a specific StartOS homeserver package.

## Network Access and Interfaces

The `matrix-client` interface is an unmasked HTTP `ui` interface on internal port 8080, with port 80 preferred externally. It serves the Element Web application; the browser then connects directly to the configured homeserver over HTTPS.

## Installation and First-Run Flow

Init creates the Element Web configuration with the upstream Matrix.org endpoint as the default. The administrator may replace it before or after the first start, and people signing in may still choose another homeserver.

No account or credential is created by this package. Registration, authentication, rooms, messages, and account recovery are provided by the selected homeserver.

## Actions

**Configure Default Homeserver** should be run when this Element Web instance should lead users to a different Matrix server, including Synapse or another homeserver hosted on StartOS. It rewrites one URL in `config.json`; a running client restarts in a few seconds, while a stopped client uses the setting on its next start. It is safe to repeat and does not modify Matrix accounts, messages, or the homeserver itself.

## Tasks

None. The package never blocks startup on a user prompt.

## Health Checks

The `element-web` daemon readiness check verifies that nginx is listening on port 8080. A persistent failure means the image entrypoint could not prepare the runtime configuration or nginx exited; inspect the `element-web` subcontainer logs and confirm `config/config.json` is readable.

## Backups and Restore

Backups snapshot the `config` volume wholesale, preserving the selected default homeserver and unmodeled Element Web settings. Restoring does not restore Matrix account data, which remains on the homeserver, or browser-local sessions and encryption state.

## Limitations and Differences

1. This package provides the web client only; a Matrix homeserver must be available separately.
2. The user's browser connects to the homeserver directly, so the configured URL must be reachable and trusted by every browser using Element Web.
3. StartOS backups preserve package configuration, not browser-local login sessions or encryption keys.

---

## Quick Reference for AI Consumers

```yaml
package_id: element-web
image: vectorim/element-web
architectures: [x86_64, aarch64]
subcontainers: [element-web]
volumes:
  config: /app/config.json
file_models:
  - config/config.json
startos_managed_env_vars:
  - ELEMENT_WEB_PORT
dependencies: none
interfaces:
  matrix-client: { type: ui, port: 8080 }
actions:
  - configure-default-homeserver
tasks: []
health_checks:
  - element-web
```
