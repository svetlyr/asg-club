# asg-club

Custom merch shop. Bun monorepo, two apps:

- **`apps/frontend`** — Astro static site. Catalogue + order form.
- **`apps/server`** — Bun.serve API + Telegram bot + SQLite. Order pipeline and PayPal invoicing.

## Stack

TypeScript 7 · Bun workspaces · Biome (lint + format) · Drizzle/SQLite · Grammy · Astro

## Getting started

```bash
bun install

bun run dev:frontend   # astro on :4321
bun run dev:server     # api + bot on :3000
```

Server needs `apps/server/.env` — see `apps/server/.env.example`.

## Commands

```bash
bun run check       # biome lint + format check
bun run fix         # biome autofix
bun run typecheck   # tsc + astro check across workspaces
bun run up          # bump all deps to latest
```

## Deploy

Server ships as a single compiled binary in a distroless image:

```bash
docker compose up --build -d
```

SQLite lives in `./data/orders.db` (bind-mounted, must be writable by uid 1001).
Backup = copy that file. Put a reverse proxy (Caddy/nginx/Cloudflare) in front for
TLS — the PayPal webhook requires HTTPS.

Frontend is a static build (`bun run --filter=frontend build`) — host `apps/frontend/dist`.
