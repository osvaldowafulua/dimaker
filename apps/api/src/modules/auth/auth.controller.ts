import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.displayName);
  }

  @Post('login')
  @Throttle({ auth: { limit: 20, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @Throttle({ auth: { limit: 30, ttl: 60_000 } })
  refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }
}
