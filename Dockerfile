FROM alpine:3.13

RUN apk update
RUN apk add \
    tini \
    nginx \
    yq \
    jq

ADD ./element-web/webapp /var/www
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh

WORKDIR /root

RUN mkdir /run/nginx

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
