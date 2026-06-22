import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class SocialService {
  constructor(private readonly db: DatabaseService) {}

  async follow(followerId: string, creatorHandle: string) {
    await this.db.query(
      `INSERT INTO follows (follower_id, following_id)
       SELECT $1, cp.user_id FROM creator_profiles cp WHERE cp.handle = $2
       ON CONFLICT DO NOTHING`,
      [followerId, creatorHandle.toLowerCase()],
    );
    return { ok: true };
  }

  async feed(userId: string, limit = 20) {
    const { rows } = await this.db.query(
      `SELECT a.id, a.title, a.slug, a.published_at, cp.handle AS creator_handle
       FROM follows f
       JOIN creator_profiles cp ON cp.user_id = f.following_id
       JOIN assets a ON a.creator_id = cp.user_id
       WHERE f.follower_id = $1 AND a.status = 'published'
       ORDER BY a.published_at DESC NULLS LAST
       LIMIT $2`,
      [userId, limit],
    );
    return rows;
  }
}
