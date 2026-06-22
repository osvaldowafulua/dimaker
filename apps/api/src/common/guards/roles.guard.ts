import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@dimaker/shared-types';
import { DatabaseService } from '../database/database.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const req = context.switchToHttp().getRequest<{ user?: { sub: string } }>();
    if (!req.user?.sub) throw new ForbiddenException();

    const { rows } = await this.db.query<{ role: string }>(
      `SELECT role FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [req.user.sub],
    );
    if (!rows[0] || !roles.includes(rows[0].role as UserRole)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
