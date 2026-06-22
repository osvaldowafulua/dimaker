import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { calcSplit, DEFAULT_COMMISSION } from '@dimaker/shared-types';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class StripeService {
  readonly client: Stripe;

  constructor(private readonly db: DatabaseService) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn('STRIPE_SECRET_KEY not set — Stripe calls will fail');
    }
    this.client = new Stripe(key ?? 'sk_test_placeholder', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  get platformFeeBps(): number {
    return Number(process.env.STRIPE_PLATFORM_FEE_BPS ?? DEFAULT_COMMISSION.defaultBps);
  }

  async createConnectOnboardingLink(userId: string) {
    const { rows } = await this.db.query<{
      stripe_connect_account_id: string | null;
      handle: string;
    }>(
      `SELECT cp.stripe_connect_account_id, cp.handle
       FROM creator_profiles cp WHERE cp.user_id = $1`,
      [userId],
    );
    if (!rows[0]) {
      throw new BadRequestException('Creator profile required');
    }

    let accountId = rows[0].stripe_connect_account_id;
    if (!accountId) {
      const account = await this.client.accounts.create({
        type: 'express',
        metadata: { dimaker_user_id: userId, handle: rows[0].handle },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;
      await this.db.query(
        `UPDATE creator_profiles SET stripe_connect_account_id = $1, updated_at = now()
         WHERE user_id = $2`,
        [accountId, userId],
      );
    }

    const link = await this.client.accountLinks.create({
      account: accountId,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL!,
      return_url: process.env.STRIPE_CONNECT_RETURN_URL!,
      type: 'account_onboarding',
    });
    return { url: link.url, accountId };
  }

  async createCheckoutSession(input: {
    userId: string;
    orderId: string;
    lineItems: Array<{
      name: string;
      unitAmountCents: number;
      quantity: number;
      creatorStripeAccountId: string;
      creatorPayoutCents: number;
      platformFeeCents: number;
    }>;
    successUrl: string;
    cancelUrl: string;
  }) {
    const session = await this.client.checkout.sessions.create({
      mode: 'payment',
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: { order_id: input.orderId, user_id: input.userId },
      line_items: input.lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: item.unitAmountCents,
          product_data: { name: item.name },
        },
      })),
      payment_intent_data: {
        transfer_group: input.orderId,
      },
    });

    await this.db.query(
      `UPDATE orders SET stripe_checkout_session_id = $1, updated_at = now() WHERE id = $2`,
      [session.id, input.orderId],
    );

    return session;
  }

  resolveCommissionBps(override: number | null): number {
    return override ?? this.platformFeeBps;
  }

  computeSplit(grossCents: number, commissionBps: number) {
    return calcSplit(grossCents, commissionBps);
  }

  async createTransferForOrderItem(input: {
    orderId: string;
    orderItemId: string;
    creatorStripeAccountId: string;
    creatorPayoutCents: number;
    chargeId: string;
  }) {
    if (input.creatorPayoutCents < DEFAULT_COMMISSION.minPayoutCents) {
      return null;
    }
    const transfer = await this.client.transfers.create({
      amount: input.creatorPayoutCents,
      currency: 'usd',
      destination: input.creatorStripeAccountId,
      transfer_group: input.orderId,
      metadata: { order_item_id: input.orderItemId },
      source_transaction: input.chargeId,
    });
    await this.db.query(
      `UPDATE order_items SET stripe_transfer_id = $1 WHERE id = $2`,
      [transfer.id, input.orderItemId],
    );
    return transfer;
  }
}
