import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DownloadsService } from './downloads.service';

@ApiTags('downloads')
@Controller('assets')
export class DownloadsController {
  constructor(private readonly downloads: DownloadsService) {}

  @Post(':assetVersionId/download')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Throttle({ download: { limit: 30, ttl: 60_000 } })
  download(
    @CurrentUser() user: { sub: string },
    @Param('assetVersionId') assetVersionId: string,
  ) {
    return this.downloads.issueDownloadToken(user.sub, assetVersionId);
  }
}
