export enum UserRole {
  Buyer = 'buyer',
  Creator = 'creator',
  Moderator = 'moderator',
  Admin = 'admin',
}

export enum AssetType {
  Psd = 'psd',
  Mockup = 'mockup',
  Vector = 'vector',
  Template = 'template',
  Other = 'other',
}

export enum AssetStatus {
  Draft = 'draft',
  Processing = 'processing',
  Published = 'published',
  Rejected = 'rejected',
  Archived = 'archived',
}

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Refunded = 'refunded',
  PartiallyRefunded = 'partially_refunded',
}

export enum QueueName {
  MediaScan = 'media.scan',
  MediaPreview = 'media.preview',
  MediaWatermark = 'media.watermark',
  SearchIndex = 'search.index',
  AiEmbed = 'ai.embed',
  EmailSend = 'email.send',
  StripeWebhook = 'stripe.webhook',
}

export interface PlatformCommissionConfig {
  defaultBps: number;
  minPayoutCents: number;
}

export const DEFAULT_COMMISSION: PlatformCommissionConfig = {
  defaultBps: 3000,
  minPayoutCents: 50,
};

export function calcSplit(
  grossCents: number,
  commissionBps: number,
): { platformFeeCents: number; creatorPayoutCents: number } {
  const platformFeeCents = Math.floor((grossCents * commissionBps) / 10_000);
  const creatorPayoutCents = grossCents - platformFeeCents;
  return { platformFeeCents, creatorPayoutCents };
}
