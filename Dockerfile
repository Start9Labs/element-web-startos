FROM alpine:3.13

RUN apk update
RUN apk add \
    tini \
    nginx \
    wget \
    jq

RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_arm.tar.gz -O - |\
    tar xz && mv yq_linux_arm /usr/bin/yq

ADD ./element-web/webapp /var/www
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh

WORKDIR /root

RUN mkdir /run/nginx

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
