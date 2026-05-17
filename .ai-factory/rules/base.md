# Base Rules

> Auto-detected from codebase. Edit as needed.

## Naming

- Files: kebab-case / camelCase (`serviceDetailsForm.tsx`)
- Components: PascalCase (Solid `.tsx`, Astro `.astro`)
- Vars/functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Module Structure

- `apps/client/src/{api,assets,components,hooks,layouts,pages,schemas,stores,styles,types,utils}`
- `apps/server/src` (Elysia), `apps/server/drizzle` (migrations)
- `apps/cms/src/{app,collections,migrations,components,server,utils}`

## TS

- Strict. `@total-typescript/ts-reset` via `reset.d.ts`. Shared root `tsconfig.json`.

## Lint / Format

- ESLint flat (`eslint.config.mjs`) + Prettier (`prettier.config.mjs`) with astro + tailwind plugins.

## Validation

- `valibot` (client forms via `@modular-forms/solid`).
- `zod` (cms), `drizzle-typebox` (server).

## Build / Runtime

- Bun workspaces. Per-app `bun run dev` / `build`.
- Server compiled to single binary via `bun build --compile`.
- CMS via Next 15 turbopack.

## DB

- Drizzle ORM, Postgres. `drizzle-kit` (alias `dk`).

## Errors / Logging

- No central logger. `console.*` and per-framework error handling.
