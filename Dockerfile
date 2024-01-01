FROM node:lts-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Install jq and curl
RUN apk add --no-cache jq curl

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY src/* ./

ARG CRON_SCHEDULE
RUN echo "$CRON_SCHEDULE node /app/bahnhof.mjs" > /etc/crontabs/root

CMD ["/usr/sbin/crond", "-f"]
