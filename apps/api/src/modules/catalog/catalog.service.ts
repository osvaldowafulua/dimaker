import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class CatalogService {
  constructor(private readonly db: DatabaseService) {}

  async listPublished(limit = 24, offset = 0) {
    const { rows } = await this.db.query(
      `SELECT a.id, a.slug, a.title, a.asset_type, a.published_at, a.view_count,
              cp.handle AS creator_handle, u.display_name AS creator_name
       FROM assets a
       JOIN creator_profiles cp ON cp.user_id = a.creator_id
       JOIN users u ON u.id = cp.user_id
       WHERE a.status = 'published' AND a.deleted_at IS NULL
       ORDER BY a.published_at DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows;
  }

  async getByCreatorSlug(creatorHandle: string, assetSlug: string) {
    const { rows } = await this.db.query(
      `SELECT a.*, cp.handle, u.display_name
       FROM assets a
       JOIN creator_profiles cp ON cp.user_id = a.creator_id
       JOIN users u ON u.id = cp.user_id
       WHERE cp.handle = $1 AND a.slug = $2 AND a.deleted_at IS NULL`,
      [creatorHandle.toLowerCase(), assetSlug],
    );
    if (!rows[0]) throw new NotFoundException('Asset not found');
    return rows[0];
  }
}
