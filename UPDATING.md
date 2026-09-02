# Updating the upstream version

Element Web is packaged from the official prebuilt `vectorim/element-web` image. The image tag is pinned in `startos/manifest/index.ts` and the matching StartOS package version lives in `startos/versions/current.ts`.

## Determining the upstream version

Read the latest stable upstream release:

```bash
gh release view --repo element-hq/element-web --json tagName,publishedAt,url
```

Confirm that the same tag exists on Docker Hub and includes both `amd64` and `arm64` images:

```bash
TAG=$(gh release view --repo element-hq/element-web --json tagName --jq .tagName)
curl -fsSL "https://hub.docker.com/v2/repositories/vectorim/element-web/tags/$TAG" \
  | jq '{tag: .name, architectures: [.images[].architecture] | unique}'
docker buildx imagetools inspect "vectorim/element-web:$TAG"
```

Review the upstream release notes and compare the image's `apps/web/Dockerfile`, `apps/web/config.sample.json`, and `apps/web/docker/` directory against the currently packaged release. Verify the default user, entrypoint, `ELEMENT_WEB_PORT` behavior, and `/app/config.json` handling rather than assuming they remain unchanged. The StartOS package sets the internal listener to unprivileged port 8080.

## Applying the bump

1. Change `images.element-web.source.dockerTag` in `startos/manifest/index.ts` to the stable upstream tag.
2. Update `version` in `startos/versions/current.ts` to the same upstream version without its leading `v`, reset the StartOS revision to `0`, and summarize the user-relevant upstream changes in every locale.
3. Keep the latest version in `current.ts`. Spin the outgoing version into a historical file only when its `current.ts` carries a migration.
4. Run `npm ci`, `npm run prettier`, `npm run check`, `npm run build`, and `make`.
5. Install the package, open the Matrix Client interface, sign in to a homeserver, change the default homeserver, and confirm the restarted client serves the new `config.json`.
