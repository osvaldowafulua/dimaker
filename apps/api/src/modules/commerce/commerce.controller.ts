import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from './orders.service';
import { StripeService } from './stripe.service';
import { StripeWebhookService } from './stripe-webhook.service';

@ApiTags('commerce')
@Controller()
export class CommerceController {
  constructor(
    private readonly stripe: StripeService,
    private readonly orders: OrdersService,
    private readonly webhooks: StripeWebhookService,
  ) {}

  @Post('commerce/connect/onboarding')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async connectOnboarding(@CurrentUser() user: { sub: string }) {
    return this.stripe.createConnectOnboardingLink(user.sub);
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async checkout(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateCheckoutDto,
  ) {
    const { orderId } = await this.orders.createPendingOrder(user.sub, dto.items);
    const rows = await this.orders.getOrderLineItemsForCheckout(orderId);

    const session = await this.stripe.createCheckoutSession({
      userId: user.sub,
      orderId,
      successUrl: dto.successUrl,
      cancelUrl: dto.cancelUrl,
      lineItems: rows.map((r: (typeof rows)[number]) => ({
        name: r.title,
        unitAmountCents: Number(r.unit_price_cents),
        quantity: 1,
        creatorStripeAccountId: r.stripe_connect_account_id,
        creatorPayoutCents: Number(r.creator_payout_cents),
        platformFeeCents: Number(r.platform_fee_cents),
      })),
    });

    return { orderId, checkoutUrl: session.url };
  }

  @Post('webhooks/stripe')
  @Throttle({ default: { limit: 200, ttl: 60_000 } })
  async stripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.webhooks.constructEvent(req.rawBody ?? Buffer.from(''), signature);
    await this.webhooks.handle(event);
    return { received: true };
  }
}
