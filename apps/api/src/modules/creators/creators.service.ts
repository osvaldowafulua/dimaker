import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class CreatorsService {
  constructor(private readonly db: DatabaseService) {}

  async registerProfile(userId: string, handle: string, headline?: string) {
    try {
      await this.db.query(
        `INSERT INTO creator_profiles (user_id, handle, headline)
         VALUES ($1, $2, $3)`,
        [userId, handle.toLowerCase(), headline ?? null],
      );
      await this.db.query(
        `UPDATE users SET role = 'creator' WHERE id = $1`,
        [userId],
      );
      return { handle: handle.toLowerCase() };
    } catch {
      throw new ConflictException('Handle already taken');
    }
  }

  getByHandle(handle: string) {
    return this.db
      .query(
        `SELECT cp.*, u.display_name, u.avatar_storage_key
         FROM creator_profiles cp
         JOIN users u ON u.id = cp.user_id
         WHERE cp.handle = $1`,
        [handle.toLowerCase()],
      )
      .then((r) => r.rows[0] ?? null);
  }
}
