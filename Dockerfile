# syntax=docker/dockerfile:1

FROM oven/bun:debian AS base
WORKDIR /usr/src/app

# * Install all dependencies
FROM base AS install
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/

RUN --mount=type=cache,target=/root/.bun/install/cache <<EOF
    set -e
    apt-get update
    apt-get install -y --no-install-recommends python3 build-essential
    bun install -g node-gyp
    bun install --frozen-lockfile
EOF

# * Build server
FROM base AS build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

RUN bun run --filter=server build

# * Install prod dependencies
FROM install AS prod_deps
RUN bun install --production

# * Prod image
FROM oven/bun:slim
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prod_deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/server/dist ./dist

EXPOSE 3000
CMD ["bun", "./dist/index.js"]
