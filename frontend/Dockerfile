# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# CRA reads REACT_APP_* at build time
ARG REACT_APP_BACKEND_URL=""
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Yarn via Corepack (package.json declares yarn@1.x)
RUN corepack enable

COPY package.json /app/package.json
COPY craco.config.js /app/craco.config.js
COPY tailwind.config.js /app/tailwind.config.js
COPY postcss.config.js /app/postcss.config.js
COPY jsconfig.json /app/jsconfig.json

# Install deps (no lockfile present)
RUN yarn install --network-timeout 600000

COPY public /app/public
COPY src /app/src
COPY components.json /app/components.json
COPY plugins /app/plugins

RUN yarn build


# Runtime stage (static)
FROM nginx:1.25-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
