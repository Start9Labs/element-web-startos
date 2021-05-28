ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))
ELEMENT_SRC := $(shell find ./element-web/src)

.DELETE_ON_ERROR:

all: element-web.s9pk

install: element-web.s9pk
	appmgr install element-web.s9pk

element-web.s9pk: manifest.yaml config_spec.yaml config_rules.yaml image.tar instructions.md $(ASSET_PATHS)
	appmgr -vv pack $(shell pwd) -o element-web.s9pk
	appmgr -vv verify element-web.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: Dockerfile docker_entrypoint.sh element-web/webapp
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/element-web --platform=linux/arm/v7 -o type=docker,dest=image.tar .

element-web/webapp: element-web/node_modules $(ELEMENT_SRC) element-web/config.json
	NODE_OPTIONS=--max-old-space-size=2048 npm --prefix element-web run build

element-web/node_modules: element-web/package.json
	cd element-web && yarn install

element-web/config.json: element-web/config.sample.json
	cat element-web/config.sample.json | jq ".default_theme = \"dark\"" > element-web/config.json