import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PresignDto } from './dto/presign.dto';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post('presign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  presign(@CurrentUser() user: { sub: string }, @Body() dto: PresignDto) {
    return this.uploads.presign(user.sub, dto.mimeType, dto.byteSize);
  }

  @Post(':id/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  complete(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.uploads.complete(id, user.sub);
  }
}
