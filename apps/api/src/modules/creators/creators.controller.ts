import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatorsService } from './creators.service';

@ApiTags('creators')
@Controller('creators')
export class CreatorsController {
  constructor(private readonly creators: CreatorsService) {}

  @Get(':handle')
  get(@Param('handle') handle: string) {
    return this.creators.getByHandle(handle);
  }

  @Post('register')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  register(
    @CurrentUser() user: { sub: string },
    @Body() body: { handle: string; headline?: string },
  ) {
    return this.creators.registerProfile(user.sub, body.handle, body.headline);
  }
}
