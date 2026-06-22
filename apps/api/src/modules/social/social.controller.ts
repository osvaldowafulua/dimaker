import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SocialService } from './social.service';

@ApiTags('social')
@Controller()
export class SocialController {
  constructor(private readonly social: SocialService) {}

  @Post('follows/:handle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  follow(@CurrentUser() user: { sub: string }, @Param('handle') handle: string) {
    return this.social.follow(user.sub, handle);
  }

  @Get('feed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  feed(@CurrentUser() user: { sub: string }) {
    return this.social.feed(user.sub);
  }
}
