# AGENTS.md

> Structural map for AI agents. Keep factual. Update on structural changes.

## Project Overview

ASG Club monorepo: Astro client + Elysia server + Payload CMS. Details: `.ai-factory/DESCRIPTION.md`.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Bun
- **Client:** Astro 5 + SolidJS + Tailwind v3 + valibot + `@modular-forms/solid`
- **Server:** Elysia + Drizzle + Postgres + Grammy (Telegram) + nodemailer + google-spreadsheet
- **CMS:** Payload 3 + Next 15 + Postgres + S3 storage
- **Infra:** Docker (`Dockerfile.{server,cms,migrations}`, `compose.yaml`)

## Project Structure

```
asg-club/
├── apps/
│   ├── client/    # Astro + Solid
│   │   └── src/{api,components,hooks,layouts,pages,schemas,stores,styles,types,utils}
│   ├── server/    # Elysia API + Drizzle migrations
│   │   ├── src/
│   │   └── drizzle/
│   └── cms/       # Payload 3 on Next 15
│       └── src/{app,collections,migrations,components,server,utils}
├── .ai-factory/   # AI agent context
├── .claude/       # Claude Code skills/agents
├── scripts/
├── compose.yaml
├── Dockerfile.{server,cms,migrations}
├── eslint.config.mjs
├── prettier.config.mjs
├── tsconfig.json
└── package.json   # Bun workspaces root
```

## Key Entry Points

| File | Purpose |
| ---- | ------- |
| `apps/client/src/pages/` | Astro routes |
| `apps/server/src/index.ts` | Elysia API entry |
| `apps/cms/src/app/` | Payload/Next app |
| `compose.yaml` | Local stack (server, cms, migrations) |
| `package.json` (root) | Bun workspaces |

## Documentation

| Document | Path | Description |
| -------- | ---- | ----------- |
| README | `README.md` | Project landing |

## AI Context Files

| File | Purpose |
| ---- | ------- |
| `AGENTS.md` | This map |
| `.ai-factory/DESCRIPTION.md` | Spec / stack |
| `.ai-factory/ARCHITECTURE.md` | Architecture + dependency rules |
| `.ai-factory/rules/base.md` | Detected conventions |
| `.ai-factory/config.yaml` | AI Factory config |

## Agent Rules

- Decompose chained git commands — never combine with `&&`.
  - Incorrect: `git checkout master && git pull`
  - Correct: first `git checkout master`, then `git pull origin master`
- Default git base branch: `master`.
- No cross-app imports between `apps/*`.
- Migrations: `apps/server/drizzle/` (Drizzle), `apps/cms/src/migrations/` (Payload).
