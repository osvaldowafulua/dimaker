# Dimaker Architecture (Phase 0)

See the Cursor plan for diagrams. This repo implements:

- **M1** — `packages/db/migrations/0001_init.sql`
- **M2** — `apps/api/src/modules/commerce/*`, `docs/M2-stripe-connect-bullmq.md`, `apps/workers`
- **M3** — NestJS modular API under `apps/api/src/modules`
- **M4** — Next.js shell under `apps/web` + `@dimaker/ui` tokens

## Local development

```bash
pnpm install
pnpm docker:up
pnpm db:migrate
pnpm dev
```

Services:

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |
| Meilisearch | http://localhost:7700 |
