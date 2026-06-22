import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { StripeService } from '../commerce/stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly stripe: StripeService,
  ) {}

  listPlans() {
    return this.db
      .query(
        `SELECT id, code, name, monthly_download_quota, price_cents, currency
         FROM subscription_plans WHERE is_active = true`,
      )
      .then((r) => r.rows);
  }

  async createBillingCheckout(userId: string, planCode: string, urls: { successUrl: string; cancelUrl: string }) {
    const { rows } = await this.db.query<{ stripe_price_id: string }>(
      `SELECT stripe_price_id FROM subscription_plans WHERE code = $1 AND is_active`,
      [planCode],
    );
    if (!rows[0]) throw new Error('Plan not found');

    const { rows: users } = await this.db.query<{ stripe_customer_id: string | null; email: string }>(
      `SELECT stripe_customer_id, email::text FROM users WHERE id = $1`,
      [userId],
    );
    let customerId = users[0]?.stripe_customer_id;
    if (!customerId) {
      const customer = await this.stripe.client.customers.create({
        email: users[0]?.email,
        metadata: { dimaker_user_id: userId },
      });
      customerId = customer.id;
      await this.db.query(
        `UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
        [customerId, userId],
      );
    }

    const session = await this.stripe.client.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: rows[0].stripe_price_id, quantity: 1 }],
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
      metadata: { user_id: userId, plan_code: planCode },
    });
    return { checkoutUrl: session.url };
  }
}
