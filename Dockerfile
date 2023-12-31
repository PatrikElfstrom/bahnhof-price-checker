FROM alpine:latest

WORKDIR /app

# Installs latest Chromium (100) package.
# RUN apk add --no-cache nodejs npm

COPY package*.json ./

# RUN npm ci --omit=dev

COPY bahnhof.mjs ./

# CMD [  ]

#EXPOSE 3000
