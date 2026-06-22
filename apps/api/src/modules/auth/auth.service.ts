import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    const attempt = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return timingSafeEqual(attempt, expected);
  }

  async register(email: string, password: string, displayName?: string) {
    const passwordHash = this.hashPassword(password);
    const { rows } = await this.db.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3) RETURNING id`,
      [email.toLowerCase(), passwordHash, displayName ?? null],
    );
    return this.issueTokens(rows[0].id, email);
  }

  async login(email: string, password: string) {
    const { rows } = await this.db.query<{ id: string; password_hash: string }>(
      `SELECT id, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email.toLowerCase()],
    );
    const user = rows[0];
    if (!user?.password_hash || !this.verifyPassword(password, user.password_hash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.db.query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [user.id]);
    return this.issueTokens(user.id, email);
  }

  private async issueTokens(userId: string, email: string) {
    const accessToken = await this.jwt.signAsync({ sub: userId, email });
    const refreshRaw = randomBytes(48).toString('hex');
    const tokenHash = createHash('sha256').update(refreshRaw).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)`,
      [userId, tokenHash, expiresAt],
    );
    return { accessToken, refreshToken: refreshRaw };
  }

  async refresh(refreshToken: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const { rows } = await this.db.query<{ user_id: string; email: string }>(
      `SELECT rt.user_id, u.email::text AS email
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.revoked_at IS NULL AND rt.expires_at > now()`,
      [tokenHash],
    );
    if (!rows[0]) throw new UnauthorizedException('Invalid refresh token');
    return this.issueTokens(rows[0].user_id, rows[0].email);
  }
}
