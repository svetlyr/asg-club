# ASG Club

Bun monorepo. Three apps:

- `apps/client` — Astro static site + SolidJS islands + Tailwind v3.
- `apps/server` — Elysia API + Drizzle ORM + Postgres. Telegram bot (Grammy), email (nodemailer), Google Sheets export.
- `apps/cms` — Payload CMS 3 on Next.js 15 + Postgres + S3 storage.

## Tech Stack

- TS, Bun workspaces, Drizzle (Postgres).
- Containerized: `Dockerfile.{server,cms,migrations}` + `compose.yaml`.
- Shared ESLint flat config + Prettier at root.
