FROM denoland/deno:alpine

# Install jq and curl
RUN apk add --no-cache jq curl

ARG CRON_SCHEDULE
RUN echo "$CRON_SCHEDULE run --allow-net --allow-sys --allow-env /app/bahnhof.ts" > /etc/crontabs/root

WORKDIR /app

USER deno

COPY src/deps.ts .
RUN deno cache deps.ts

COPY src/* ./

RUN deno cache bahnhof.ts

CMD ["/usr/sbin/crond", "-f"]
