import { Module } from '@nestjs/common';
import { CommerceController } from './commerce.controller';
import { StripeService } from './stripe.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { OrdersService } from './orders.service';

@Module({
  controllers: [CommerceController],
  providers: [StripeService, StripeWebhookService, OrdersService],
  exports: [StripeService, OrdersService],
})
export class CommerceModule {}
