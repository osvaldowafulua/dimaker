import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { QueueName } from '@dimaker/shared-types';
import { DatabaseService } from '../../common/database/database.service';
import { QueueService } from '../../common/queue/queue.service';
import { OrdersService } from './orders.service';
import { StripeService } from './stripe.service';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly stripe: StripeService,
    private readonly orders: OrdersService,
    private readonly queues: QueueService,
  ) {}

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    return this.stripe.client.webhooks.constructEvent(payload, signature, secret);
  }

  async handle(event: Stripe.Event) {
    const { rows } = await this.db.query(
      `SELECT 1 FROM stripe_webhook_events WHERE id = $1`,
      [event.id],
    );
    if (rows.length > 0) {
      this.logger.debug(`duplicate webhook ${event.id}`);
      return;
    }

    await this.db.query(
      `INSERT INTO stripe_webhook_events (id, type, payload) VALUES ($1, $2, $3)`,
      [event.id, event.type, JSON.stringify(event)],
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'charge.refunded':
        await this.onChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'account.updated':
        await this.onAccountUpdated(event.data.object as Stripe.Account);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.onSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        this.logger.debug(`unhandled event ${event.type}`);
    }

    await this.db.query(
      `UPDATE stripe_webhook_events SET processed_at = now() WHERE id = $1`,
      [event.id],
    );
  }

  private async onCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.order_id;
    if (!orderId || session.payment_status !== 'paid') return;

    const pi =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;
    if (!pi) return;

    await this.orders.markPaid(orderId, pi);

    const chargeId = await this.resolveChargeId(pi);
    if (chargeId) {
      await this.dispatchCreatorTransfers(orderId, chargeId);
    }

    await this.queues.enqueue(QueueName.EmailSend, 'order.receipt', {
      orderId,
      sessionId: session.id,
    });
  }

  private async resolveChargeId(paymentIntentId: string): Promise<string | null> {
    const pi = await this.stripe.client.paymentIntents.retrieve(paymentIntentId, {
      expand: ['latest_charge'],
    });
    const charge = pi.latest_charge;
    if (!charge) return null;
    return typeof charge === 'string' ? charge : charge.id;
  }

  private async dispatchCreatorTransfers(orderId: string, chargeId: string) {
    const { rows } = await this.db.query<{
      id: string;
      creator_payout_cents: string;
      stripe_connect_account_id: string;
    }>(
      `SELECT oi.id, oi.creator_payout_cents, cp.stripe_connect_account_id
       FROM order_items oi
       JOIN creator_profiles cp ON cp.user_id = oi.creator_id
       WHERE oi.order_id = $1 AND oi.stripe_transfer_id IS NULL`,
      [orderId],
    );

    for (const row of rows) {
      if (!row.stripe_connect_account_id) continue;
      await this.stripe.createTransferForOrderItem({
        orderId,
        orderItemId: row.id,
        creatorStripeAccountId: row.stripe_connect_account_id,
        creatorPayoutCents: Number(row.creator_payout_cents),
        chargeId,
      });
    }
  }

  private async onChargeRefunded(charge: Stripe.Charge) {
    const orderId = charge.transfer_group;
    if (!orderId) return;
    await this.db.query(
      `UPDATE orders SET status = 'refunded', updated_at = now() WHERE id = $1`,
      [orderId],
    );
    await this.db.query(
      `UPDATE entitlements SET revoked_at = now()
       WHERE order_item_id IN (SELECT id FROM order_items WHERE order_id = $1)`,
      [orderId],
    );
  }

  private async onAccountUpdated(account: Stripe.Account) {
    await this.db.query(
      `UPDATE creator_profiles SET
         connect_charges_enabled = $1,
         connect_payouts_enabled = $2,
         updated_at = now()
       WHERE stripe_connect_account_id = $3`,
      [
        account.charges_enabled ?? false,
        account.payouts_enabled ?? false,
        account.id,
      ],
    );
  }

  private async onSubscriptionUpdated(sub: Stripe.Subscription) {
    const userId = sub.metadata?.user_id;
    if (!userId) return;
    const { rows } = await this.db.query<{ id: string }>(
      `SELECT id FROM subscription_plans WHERE stripe_price_id = $1`,
      [sub.items.data[0]?.price?.id],
    );
    if (!rows[0]) return;

    await this.db.query(
      `INSERT INTO subscriptions (
        user_id, plan_id, status, stripe_subscription_id,
        current_period_start, current_period_end
      ) VALUES ($1,$2,$3::subscription_status,$4,to_timestamp($5),to_timestamp($6))
      ON CONFLICT (stripe_subscription_id) DO UPDATE SET
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        updated_at = now()`,
      [
        userId,
        rows[0].id,
        sub.status,
        sub.id,
        sub.current_period_start,
        sub.current_period_end,
      ],
    );
  }

  private async onSubscriptionDeleted(sub: Stripe.Subscription) {
    await this.db.query(
      `UPDATE subscriptions SET status = 'canceled', canceled_at = now(), updated_at = now()
       WHERE stripe_subscription_id = $1`,
      [sub.id],
    );
  }
}
