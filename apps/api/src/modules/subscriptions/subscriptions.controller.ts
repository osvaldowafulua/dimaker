import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptions: SubscriptionsService) {}

  @Get('plans')
  plans() {
    return this.subscriptions.listPlans();
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  checkout(
    @CurrentUser() user: { sub: string },
    @Body() body: { planCode: string; successUrl: string; cancelUrl: string },
  ) {
    return this.subscriptions.createBillingCheckout(user.sub, body.planCode, {
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    });
  }
}
