# Architecture

## Pattern

Static client + decoupled API server + headless CMS. Shared Postgres.

```
[Visitor] → client (Astro static)
[Visitor] → server (Elysia) → Postgres / Telegram / Sheets / Email
[Editor]  → cms (Payload/Next) → Postgres / S3
```

## Modules

| Module | Owns |
| ------ | ---- |
| `apps/client` | Public UI, forms |
| `apps/server` | API, bot, mail, sheets export |
| `apps/cms` | Content admin, media (S3) |

## Dependency Rules

- No cross-app imports between `apps/*`.
- Client talks to server via HTTP only.
- Schema migrations live in `apps/server/drizzle` and `apps/cms/src/migrations`.
- Secrets in env only (compose + per-app `.env`).
