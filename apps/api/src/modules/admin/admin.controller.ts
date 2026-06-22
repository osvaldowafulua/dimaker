import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@dimaker/shared-types';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Moderator, UserRole.Admin)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('queue')
  queue() {
    return this.admin.moderationQueue();
  }

  @Patch('assets/:id/status')
  setStatus(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() body: { status: string; note?: string },
  ) {
    return this.admin.setAssetStatus(id, body.status, user.sub, body.note);
  }
}
