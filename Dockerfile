FROM denoland/deno:alpine

RUN apk add --no-cache jq curl

ARG CRON_SCHEDULE
RUN echo "$CRON_SCHEDULE deno run --allow-net --allow-sys --allow-env --allow-run --allow-read /app/main.ts" >> /var/spool/cron/crontabs/root

WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts

COPY * ./

RUN chmod +x *.sh

RUN deno cache main.ts

CMD ["/usr/sbin/crond", "-f"]
