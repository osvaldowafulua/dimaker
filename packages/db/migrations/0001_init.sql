-- Dimaker marketplace core schema (M1)
-- PostgreSQL 16+ | pgvector, citext, pg_trgm

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE user_role AS ENUM ('buyer', 'creator', 'moderator', 'admin');
CREATE TYPE asset_type AS ENUM ('psd', 'mockup', 'vector', 'template', 'other');
CREATE TYPE asset_status AS ENUM ('draft', 'processing', 'published', 'rejected', 'archived');
CREATE TYPE file_kind AS ENUM ('original', 'preview', 'thumbnail', 'watermarked');
CREATE TYPE license_scope AS ENUM ('personal', 'commercial', 'extended');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE media_job_status AS ENUM ('queued', 'running', 'succeeded', 'failed');
CREATE TYPE moderation_status AS ENUM ('open', 'resolved', 'dismissed');

CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              CITEXT NOT NULL,
  password_hash      TEXT,
  role               user_role NOT NULL DEFAULT 'buyer',
  display_name       TEXT,
  avatar_storage_key TEXT,
  stripe_customer_id TEXT UNIQUE,
  email_verified_at  TIMESTAMPTZ,
  last_login_at      TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at         TIMESTAMPTZ,
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id) WHERE revoked_at IS NULL;

CREATE TABLE creator_profiles (
  user_id                   UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  handle                    CITEXT NOT NULL,
  headline                  TEXT,
  bio                       TEXT,
  website_url               TEXT,
  stripe_connect_account_id TEXT UNIQUE,
  connect_charges_enabled   BOOLEAN NOT NULL DEFAULT false,
  connect_payouts_enabled   BOOLEAN NOT NULL DEFAULT false,
  commission_bps_override   SMALLINT CHECK (commission_bps_override BETWEEN 0 AND 5000),
  total_sales_cents         BIGINT NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT creator_handle_unique UNIQUE (handle)
);

CREATE TABLE assets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id       UUID NOT NULL REFERENCES creator_profiles(user_id),
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  asset_type       asset_type NOT NULL,
  status           asset_status NOT NULL DEFAULT 'draft',
  rejection_reason TEXT,
  published_at     TIMESTAMPTZ,
  featured_at      TIMESTAMPTZ,
  view_count       BIGINT NOT NULL DEFAULT 0,
  download_count   BIGINT NOT NULL DEFAULT 0,
  like_count       BIGINT NOT NULL DEFAULT 0,
  version          INT NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ,
  CONSTRAINT assets_creator_slug_unique UNIQUE (creator_id, slug)
);

CREATE TABLE asset_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id       UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  changelog      TEXT,
  is_current     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT asset_versions_unique UNIQUE (asset_id, version_number)
);
CREATE UNIQUE INDEX idx_asset_versions_current ON asset_versions(asset_id) WHERE is_current = true;

CREATE TABLE asset_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_version_id  UUID NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
  kind              file_kind NOT NULL,
  storage_key       TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  byte_size         BIGINT NOT NULL CHECK (byte_size > 0),
  width             INT,
  height            INT,
  checksum_sha256   CHAR(64) NOT NULL,
  perceptual_hash   TEXT,
  virus_scan_status TEXT NOT NULL DEFAULT 'pending',
  virus_scanned_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT asset_files_version_kind_unique UNIQUE (asset_version_id, kind)
);

CREATE TABLE tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug  CITEXT NOT NULL UNIQUE,
  label TEXT NOT NULL
);

CREATE TABLE asset_tags (
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  tag_id   UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, tag_id)
);

CREATE TABLE license_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  scope       license_scope NOT NULL,
  name        TEXT NOT NULL,
  description TEXT
);

CREATE TABLE asset_license_offers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  license_type_id UUID NOT NULL REFERENCES license_types(id),
  price_cents     BIGINT NOT NULL CHECK (price_cents >= 0),
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT asset_license_offers_unique UNIQUE (asset_id, license_type_id)
);

CREATE TABLE orders (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID NOT NULL REFERENCES users(id),
  status                     order_status NOT NULL DEFAULT 'pending',
  currency                   CHAR(3) NOT NULL DEFAULT 'USD',
  subtotal_cents             BIGINT NOT NULL DEFAULT 0,
  discount_cents             BIGINT NOT NULL DEFAULT 0,
  tax_cents                  BIGINT NOT NULL DEFAULT 0,
  total_cents                BIGINT NOT NULL DEFAULT 0,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id   TEXT UNIQUE,
  paid_at                    TIMESTAMPTZ,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  asset_id             UUID NOT NULL REFERENCES assets(id),
  asset_version_id     UUID NOT NULL REFERENCES asset_versions(id),
  license_type_id      UUID NOT NULL REFERENCES license_types(id),
  unit_price_cents     BIGINT NOT NULL,
  platform_fee_cents   BIGINT NOT NULL DEFAULT 0,
  creator_payout_cents BIGINT NOT NULL DEFAULT 0,
  stripe_transfer_id   TEXT,
  creator_id           UUID NOT NULL REFERENCES creator_profiles(user_id)
);

CREATE TABLE entitlements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  order_item_id    UUID UNIQUE REFERENCES order_items(id),
  asset_id         UUID NOT NULL REFERENCES assets(id),
  asset_version_id UUID NOT NULL REFERENCES asset_versions(id),
  license_type_id  UUID NOT NULL REFERENCES license_types(id),
  source           TEXT NOT NULL DEFAULT 'purchase',
  granted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at       TIMESTAMPTZ,
  revoked_at       TIMESTAMPTZ,
  download_limit   INT,
  downloads_used   INT NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX idx_entitlements_active_unique
  ON entitlements(user_id, asset_version_id, license_type_id)
  WHERE revoked_at IS NULL;

CREATE TABLE subscription_plans (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   TEXT NOT NULL UNIQUE,
  name                   TEXT NOT NULL,
  stripe_price_id        TEXT NOT NULL UNIQUE,
  monthly_download_quota INT NOT NULL,
  price_cents            BIGINT NOT NULL,
  currency               CHAR(3) NOT NULL DEFAULT 'USD',
  is_active              BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE subscriptions (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID NOT NULL REFERENCES users(id),
  plan_id                    UUID NOT NULL REFERENCES subscription_plans(id),
  status                     subscription_status NOT NULL,
  stripe_subscription_id     TEXT NOT NULL UNIQUE,
  current_period_start       TIMESTAMPTZ NOT NULL,
  current_period_end         TIMESTAMPTZ NOT NULL,
  downloads_used_this_period INT NOT NULL DEFAULT 0,
  canceled_at                TIMESTAMPTZ,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (creator_id, slug)
);

CREATE TABLE collection_assets (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  asset_id      UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, asset_id)
);

CREATE TABLE follows (
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE asset_likes (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id   UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id   UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  parent_id  UUID REFERENCES comments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE uploads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   UUID NOT NULL REFERENCES creator_profiles(user_id),
  asset_id     UUID REFERENCES assets(id),
  storage_key  TEXT NOT NULL,
  mime_type    TEXT NOT NULL,
  byte_size    BIGINT NOT NULL,
  status       media_job_status NOT NULL DEFAULT 'queued',
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media_jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id        UUID REFERENCES uploads(id),
  asset_version_id UUID REFERENCES asset_versions(id),
  job_type         TEXT NOT NULL,
  status           media_job_status NOT NULL DEFAULT 'queued',
  attempts         INT NOT NULL DEFAULT 0,
  last_error       TEXT,
  payload          JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at      TIMESTAMPTZ
);

CREATE TABLE stripe_webhook_events (
  id           TEXT PRIMARY KEY,
  type         TEXT NOT NULL,
  processed_at TIMESTAMPTZ,
  payload      JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE integration_outbox (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT NOT NULL,
  aggregate_id   UUID NOT NULL,
  event_type     TEXT NOT NULL,
  payload        JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at   TIMESTAMPTZ
);
CREATE INDEX idx_outbox_unpublished ON integration_outbox(created_at) WHERE published_at IS NULL;

CREATE TABLE asset_embeddings (
  asset_id   UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
  model      TEXT NOT NULL DEFAULT 'clip-vit-b32',
  embedding  vector(1024) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_asset_embeddings_hnsw ON asset_embeddings USING hnsw (embedding vector_cosine_ops);

CREATE TABLE download_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  asset_version_id UUID NOT NULL REFERENCES asset_versions(id),
  entitlement_id   UUID REFERENCES entitlements(id),
  nonce            TEXT NOT NULL,
  ip_hash          CHAR(64),
  user_agent_hash  CHAR(64),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_download_events_user_time ON download_events(user_id, created_at DESC);

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  asset_id    UUID NOT NULL REFERENCES assets(id),
  reason      TEXT NOT NULL,
  details     TEXT,
  status      moderation_status NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE moderation_actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES users(id),
  asset_id     UUID NOT NULL REFERENCES assets(id),
  action       TEXT NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO license_types (code, scope, name, description) VALUES
  ('personal', 'personal', 'Personal', 'Non-commercial personal use'),
  ('commercial', 'commercial', 'Commercial', 'Commercial projects per ToS'),
  ('extended', 'extended', 'Extended', 'Extended commercial rights per ToS');

CREATE INDEX idx_assets_published_feed ON assets(published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_assets_creator_status ON assets(creator_id, status);
CREATE INDEX idx_assets_title_trgm ON assets USING gin (title gin_trgm_ops);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_entitlements_user ON entitlements(user_id) WHERE revoked_at IS NULL;

COMMIT;
