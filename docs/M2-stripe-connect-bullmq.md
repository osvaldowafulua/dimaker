# M2 — Stripe Connect & BullMQ

## Commission split

Default platform fee: **3000 bps (30%)**, overridable per creator via `creator_profiles.commission_bps_override`.

```typescript
platformFeeCents = floor(grossCents * commissionBps / 10_000)
creatorPayoutCents = grossCents - platformFeeCents
```

Implemented in `@dimaker/shared-types` (`calcSplit`) and `StripeService.computeSplit`.

## Connect onboarding (Express)

1. Creator calls `POST /api/v1/commerce/connect/onboarding` (JWT).
2. API creates Stripe Express account if missing, stores `stripe_connect_account_id`.
3. Returns Account Link URL for onboarding.
4. Webhook `account.updated` sets `connect_charges_enabled` / `connect_payouts_enabled`.

## Checkout flow

1. `POST /api/v1/checkout` with line items → pending `orders` + `order_items` with split amounts.
2. Stripe Checkout Session created with `metadata.order_id`.
3. Webhook `checkout.session.completed` → `orders.status = paid`, `entitlements` inserted.
4. Transfers created per `order_item` via `stripe.transfers.create` with `source_transaction` = charge.

## Webhook idempotency

- All events stored in `stripe_webhook_events` by Stripe event `id`.
- Duplicate deliveries are ignored.
- Processed timestamp set after handler success.

## BullMQ queues

| Queue | Producer | Worker |
|-------|----------|--------|
| `media.scan` | Upload complete | Virus scan |
| `media.preview` | After scan | Thumbnails |
| `search.index` | Asset published | Meilisearch |
| `email.send` | Order paid | Receipt email |
| `ai.embed` | Asset published | pgvector embedding |

Redis prefix: `dm:` for cache keys; BullMQ uses queue name as-is.

## Refunds

`charge.refunded` → order `refunded`, entitlements `revoked_at = now()`.
