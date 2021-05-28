#!/bin/sh

set -e

export HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')

HOMESERVER_ADDRESS=$(yq e ".homeserver.address" /root/start9/config.yaml)

HOMESERVER_IP=$(yq e ".homeserver.ip" /root/start9/config.yaml)
if [ "${HOMESERVER_IP}" = "null" ]; then
HOMESERVER_IP=""
fi

if [ -z "${HOMESERVER_IP}" ]; then
if [ "$(yq e ".homeserver.ssl" /root/start9/config.yaml)" = "true" ]; then
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].base_url = \"https://${HOMESERVER_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json
else
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].base_url = \"http://${HOMESERVER_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json
fi
else
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].base_url = \"http://${TOR_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json
fi
cat /var/www/config.json | jq ".default_server_config[\"m.homeserver\"].server_name = \"${HOMESERVER_ADDRESS}\"" > /var/www/config.json.tmp && mv /var/www/config.json.tmp /var/www/config.json

echo "" > /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
server_names_hash_bucket_size 128;
server {
    listen 80;
    root /var/www;
EOT
echo "    server_name ${TOR_ADDRESS};" >> /etc/nginx/conf.d/default.conf

if [ -n "${HOMESERVER_IP}" ]; then
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
    location ~* ^(\/_matrix|\/_synapse\/client) {
EOT
echo "    proxy_pass https://${HOMESERVER_IP}:8448;" >> /etc/nginx/conf.d/default.conf
cat >> /etc/nginx/conf.d/default.conf <<"EOT"
        proxy_ssl_verify off;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;

        # Nginx by default only allows file uploads up to 1M in size
        # Increase client_max_body_size to match max_upload_size defined in homeserver.yaml
        client_max_body_size 50M;
    }
EOT
fi

echo "}" >> /etc/nginx/conf.d/default.conf

exec tini nginx -g "daemon off;"

