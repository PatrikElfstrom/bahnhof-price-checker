FROM denoland/deno:alpine

# Install jq and curl
RUN apk add --no-cache jq curl

ARG CRON_SCHEDULE
RUN echo "$CRON_SCHEDULE deno run --allow-net --allow-sys --allow-env --allow-run /app/bahnhof.ts" >> /var/spool/cron/crontabs/root
RUN echo "* * * * * deno run --allow-net --allow-sys --allow-env --allow-run /app/test.ts" >> /var/spool/cron/crontabs/root

WORKDIR /app

# USER deno

COPY src/deps.ts .
RUN deno cache deps.ts

COPY src/* ./

RUN deno cache bahnhof.ts

CMD ["/usr/sbin/crond", "-f"]
