import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  moderationQueue() {
    return this.db.query(
      `SELECT r.id, r.reason, r.created_at, a.title, a.id AS asset_id
       FROM reports r
       JOIN assets a ON a.id = r.asset_id
       WHERE r.status = 'open'
       ORDER BY r.created_at ASC
       LIMIT 50`,
    ).then((r) => r.rows);
  }

  async setAssetStatus(
    assetId: string,
    status: string,
    moderatorId: string,
    note?: string,
  ) {
    await this.db.query(
      `UPDATE assets SET status = $1::asset_status, updated_at = now() WHERE id = $2`,
      [status, assetId],
    );
    await this.db.query(
      `INSERT INTO moderation_actions (moderator_id, asset_id, action, note)
       VALUES ($1, $2, $3, $4)`,
      [moderatorId, assetId, `status:${status}`, note ?? null],
    );
    return { ok: true };
  }
}
