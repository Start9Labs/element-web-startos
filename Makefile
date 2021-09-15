ELEMENT_SRC := $(shell find ./element-web/src)
VERSION := $(shell yq e ".version" manifest.yaml)

.DELETE_ON_ERROR:

all: verify

element-web.s9pk: manifest.yaml assets/compat/config_spec.yaml assets/compat/config_rules.yaml image.tar instructions.md
	embassy-sdk pack

verify:
	embassy-sdk verify element-web.s9pk

install: element-web.s9pk
	embassy-cli pacakge install element-web.s9pk

instructions.md: README.md
	cp README.md instructions.md

image.tar: Dockerfile docker_entrypoint.sh element-web/webapp
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/element-web/main:$(VERSION) --platform=linux/arm/v7 -o type=docker,dest=image.tar .

element-web/webapp: element-web/node_modules $(ELEMENT_SRC) element-web/config.json
	NODE_OPTIONS=--max-old-space-size=2048 npm --prefix element-web run build

element-web/node_modules: element-web/package.json
	cd element-web && yarn install

element-web/config.json: element-web/config.sample.json
	cat element-web/config.sample.json | jq ".default_theme = \"dark\"" > element-web/config.json.tmp && mv element-web/config.json.tmp element-web/config.json
	cat element-web/config.json | jq "del(.default_server_config[\"m.identity_server\"])" > element-web/config.json.tmp && mv element-web/config.json.tmp element-web/config.json