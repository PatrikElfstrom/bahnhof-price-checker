FROM denoland/deno:alpine

# Install jq and curl
RUN apk add --no-cache jq curl

ARG CRON_SCHEDULE
# RUN echo "$CRON_SCHEDULE deno run --allow-net --allow-sys --allow-env --allow-run --allow-read /app/main.ts" >> /var/spool/cron/crontabs/root
RUN echo "$CRON_SCHEDULE deno run --allow-net --allow-sys --allow-env --allow-run --allow-read /app/test.ts" >> /var/spool/cron/crontabs/root

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY * ./

RUN deno cache main.ts

CMD ["/usr/sbin/crond", "-f"]
