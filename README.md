# Dimaker

Premium creative assets marketplace — PSDs, mockups, vectors, templates, portfolios, and Stripe Connect payouts.

## Stack

- **Web:** Next.js 15, Tailwind, Framer Motion
- **API:** NestJS, JWT, Swagger, Stripe Connect
- **Workers:** BullMQ + Redis
- **DB:** PostgreSQL 16 + pgvector
- **Search:** Meilisearch (local via Docker)

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm docker:up
# Postgres exposed on host port 5433 (avoids local PG conflicts)
# wait for postgres healthy, then:
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Monorepo

| Package | Description |
|---------|-------------|
| `apps/web` | Public marketplace UI |
| `apps/api` | REST API `/api/v1` |
| `apps/workers` | Background job processors |
| `packages/db` | SQL migrations |
| `packages/shared-types` | Enums, queue names, commission math |
| `packages/ui` | Design tokens / Tailwind preset |

## API highlights

- `POST /api/v1/auth/register` · `POST /api/v1/auth/login`
- `GET /api/v1/assets` · `GET /api/v1/creators/:handle/assets/:slug`
- `POST /api/v1/checkout` · `POST /api/v1/webhooks/stripe`
- `POST /api/v1/commerce/connect/onboarding`
- `POST /api/v1/uploads/presign` · `POST /api/v1/uploads/:id/complete`
- `POST /api/v1/assets/:assetVersionId/download`

Documentation: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/MODULES.md`](docs/MODULES.md), [`docs/M2-stripe-connect-bullmq.md`](docs/M2-stripe-connect-bullmq.md).

### All modules (M0–M12)

The platform scaffold includes media workers (Sharp), S3/MinIO signed URLs, Meilisearch, AI visual similarity (pgvector), subscriptions, social feed, admin moderation, RBAC, CI/CD, and K8s manifests. See [`docs/MODULES.md`](docs/MODULES.md).
