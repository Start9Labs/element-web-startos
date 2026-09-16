# Updating the upstream version

Element Web is packaged from the `e2ee` build of [Start9's fork](https://github.com/Start9Labs/element-web), published as `ghcr.io/start9labs/element-web`. The image tag is pinned in `startos/manifest/index.ts` and the matching StartOS package version lives in `startos/versions/current.ts`. Sygnal is packaged from the upstream `matrixdotorg/sygnal` image, pinned in the same manifest.

## Determining the upstream version

The fork tags an `e2ee` release as `v<upstream>-start9-e2ee.<n>`; its `AGENTS.md` § Releasing describes how one is cut. List them and confirm the image for the newest was published for both `amd64` and `arm64`:

```bash
git ls-remote --tags https://github.com/Start9Labs/element-web 'v*-start9-e2ee.*'
docker buildx imagetools inspect ghcr.io/start9labs/element-web:<tag>
```

A new upstream Element Web release reaches this package only once the fork has merged it and tagged an `e2ee` build; do not switch the package to `vectorim/element-web` to get there sooner. Read the fork's `docs/fork.md` for changes to the configuration keys the package writes (`web_push`, `disable_phone_login`), and upstream's release notes for the rest.

For Sygnal, read the latest release and confirm the tag exists on Docker Hub for both architectures:

```bash
gh release view --repo matrix-org/sygnal --json tagName,publishedAt,url
docker buildx imagetools inspect matrixdotorg/sygnal:<tag>
```

Check that the WebPush pushkin's understood configuration (`sygnal/webpushpushkin.py`, `UNDERSTOOD_CONFIG_FIELDS`) still covers what `startos/main.ts` generates.

## Applying the bump

1. Change `images.element-web.source.dockerTag` in `startos/manifest/index.ts` to the fork's new `e2ee` tag, or `images.sygnal.source.dockerTag` to Sygnal's.
2. Update `version` in `startos/versions/current.ts`: the first three components are the upstream Element Web version, the fourth is the fork's release number (`v1.12.27-start9-e2ee.1` → `1.12.27.1`), and the StartOS revision after the colon resets to `0` when the Element Web version moves. A Sygnal-only bump raises the StartOS revision instead. Summarize the user-relevant changes in every locale.
3. Keep the latest version in `current.ts`. Spin the outgoing version into a historical file only when its `current.ts` carries a migration.
4. Run `npm ci`, `npm run prettier`, `npm run check`, `npm run build`, and `make`.
5. Install the package, open the Matrix Client interface, sign in to a homeserver, change the default homeserver and confirm the restarted client serves the new `config.json`, then turn push notifications on, enable notifications in Element on a phone, and confirm a message sent while the app is closed arrives as a notification.
