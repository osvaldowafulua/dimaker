import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { StripeService } from './stripe.service';

export interface CheckoutLineInput {
  assetId: string;
  assetVersionId: string;
  licenseTypeId: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly stripe: StripeService,
  ) {}

  async createPendingOrder(userId: string, lines: CheckoutLineInput[]) {
    const client = await this.db.pool.connect();
    try {
      await client.query('BEGIN');

      const order = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, status) VALUES ($1, 'pending') RETURNING id`,
        [userId],
      );
      const orderId = order.rows[0].id;
      let subtotal = 0;

      for (const line of lines) {
        const { rows } = await client.query<{
          price_cents: string;
          creator_id: string;
          title: string;
          commission_bps_override: number | null;
          stripe_connect_account_id: string | null;
          connect_charges_enabled: boolean;
        }>(
          `SELECT alo.price_cents, a.creator_id, a.title,
                  cp.commission_bps_override, cp.stripe_connect_account_id,
                  cp.connect_charges_enabled
           FROM asset_license_offers alo
           JOIN assets a ON a.id = alo.asset_id
           JOIN creator_profiles cp ON cp.user_id = a.creator_id
           WHERE alo.asset_id = $1 AND alo.license_type_id = $2 AND alo.is_active`,
          [line.assetId, line.licenseTypeId],
        );
        const offer = rows[0];
        if (!offer?.stripe_connect_account_id || !offer.connect_charges_enabled) {
          throw new NotFoundException('Creator not ready to receive payments');
        }

        const gross = Number(offer.price_cents);
        const bps = this.stripe.resolveCommissionBps(offer.commission_bps_override);
        const { platformFeeCents, creatorPayoutCents } = this.stripe.computeSplit(gross, bps);

        await client.query(
          `INSERT INTO order_items (
            order_id, asset_id, asset_version_id, license_type_id,
            unit_price_cents, platform_fee_cents, creator_payout_cents, creator_id
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            orderId,
            line.assetId,
            line.assetVersionId,
            line.licenseTypeId,
            gross,
            platformFeeCents,
            creatorPayoutCents,
            offer.creator_id,
          ],
        );
        subtotal += gross;
      }

      await client.query(
        `UPDATE orders SET subtotal_cents = $1, total_cents = $1, updated_at = now() WHERE id = $2`,
        [subtotal, orderId],
      );
      await client.query('COMMIT');
      return { orderId, subtotalCents: subtotal };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getOrderLineItemsForCheckout(orderId: string) {
    const { rows } = await this.db.query<{
      unit_price_cents: string;
      title: string;
      stripe_connect_account_id: string;
      creator_payout_cents: string;
      platform_fee_cents: string;
    }>(
      `SELECT oi.unit_price_cents, a.title, cp.stripe_connect_account_id,
              oi.creator_payout_cents, oi.platform_fee_cents
       FROM order_items oi
       JOIN assets a ON a.id = oi.asset_id
       JOIN creator_profiles cp ON cp.user_id = oi.creator_id
       WHERE oi.order_id = $1`,
      [orderId],
    );
    return rows;
  }

  async markPaid(orderId: string, paymentIntentId: string) {
    const client = await this.db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE orders SET status = 'paid', stripe_payment_intent_id = $1, paid_at = now(), updated_at = now()
         WHERE id = $2`,
        [paymentIntentId, orderId],
      );

      const items = await client.query<{
        id: string;
        user_id: string;
        asset_id: string;
        asset_version_id: string;
        license_type_id: string;
      }>(
        `SELECT oi.id, o.user_id, oi.asset_id, oi.asset_version_id, oi.license_type_id
         FROM order_items oi
         JOIN orders o ON o.id = oi.order_id
         WHERE oi.order_id = $1`,
        [orderId],
      );

      for (const item of items.rows) {
        await client.query(
          `INSERT INTO entitlements (user_id, order_item_id, asset_id, asset_version_id, license_type_id, source)
           VALUES ($1,$2,$3,$4,$5,'purchase')
           ON CONFLICT DO NOTHING`,
          [
            item.user_id,
            item.id,
            item.asset_id,
            item.asset_version_id,
            item.license_type_id,
          ],
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
