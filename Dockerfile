FROM denoland/deno:alpine

WORKDIR /app

USER deno

# Install jq and curl
RUN apk add --no-cache jq curl

COPY src/deps.ts .
RUN deno cache deps.ts

COPY src/* ./

RUN deno cache bahnhof.ts

ARG CRON_SCHEDULE
RUN echo "$CRON_SCHEDULE run --allow-net --allow-sys --allow-env /app/bahnhof.ts" > /etc/crontabs/root

CMD ["/usr/sbin/crond", "-f"]
