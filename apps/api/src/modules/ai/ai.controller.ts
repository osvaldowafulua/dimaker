import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@dimaker/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Get('similar/:assetId')
  similar(@Param('assetId') assetId: string) {
    return this.ai.visualSearch(assetId);
  }

  @Post('assets/:assetId/embed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Creator, UserRole.Admin)
  embed(@Param('assetId') assetId: string) {
    return this.ai.enqueueEmbedding(assetId);
  }
}
