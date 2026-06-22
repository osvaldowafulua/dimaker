# Dimaker — Module delivery status

| Module | Status | Location |
|--------|--------|----------|
| M0 Architecture | Done | `docs/ARCHITECTURE.md` |
| M1 Database | Done | `packages/db/migrations/` |
| M2 Stripe + BullMQ | Done | `apps/api/.../commerce`, `docs/M2-stripe-connect-bullmq.md` |
| M3 NestJS API | Done | `apps/api/src/modules/*` |
| M4 Next.js UI | Done | `apps/web`, `packages/ui` |
| M5 Media pipeline | Done | `apps/workers/src/processors/media-*` |
| M6 Anti-piracy downloads | Done | `StorageService.presignDownload`, `download_events` |
| M7 AI | Done | `apps/api/.../ai`, `ai-embed.processor` |
| M8 Search | Done | `apps/api/.../search`, Meilisearch worker |
| M9 Security | Done | helmet CSP, upload validation, `RolesGuard` |
| M10 DevOps | Done | `infra/docker`, `.github/workflows`, `infra/k8s` |
| M11 UI/UX IA | Done | `/explore`, `/creators/*`, `/pricing` |
| M12 Monetization | Done | subscriptions module, license seed, commission in shared-types |

## Production hardening (next)

- Real CLIP embeddings + Rembg/upscale providers
- Stripe live keys + Connect production onboarding
- R2 bucket policies + CDN hotlink rules
- Prometheus `/metrics` endpoint on API
- E2E tests (Playwright)
