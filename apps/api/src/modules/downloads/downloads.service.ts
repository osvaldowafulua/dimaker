import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import { DatabaseService } from '../../common/database/database.service';
import { RedisService } from '../../common/redis/redis.service';
import { StorageService } from '../../common/storage/storage.service';

@Injectable()
export class DownloadsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
  ) {}

  async issueDownloadToken(
    userId: string,
    assetVersionId: string,
    meta?: { ip?: string; userAgent?: string },
  ) {
    const { rows } = await this.db.query<{ id: string }>(
      `SELECT e.id FROM entitlements e
       WHERE e.user_id = $1 AND e.asset_version_id = $2 AND e.revoked_at IS NULL
         AND (e.expires_at IS NULL OR e.expires_at > now())
         AND (e.download_limit IS NULL OR e.downloads_used < e.download_limit)`,
      [userId, assetVersionId],
    );
    if (!rows[0]) {
      throw new ForbiddenException('No active entitlement for this asset version');
    }

    const { rows: files } = await this.db.query<{ storage_key: string }>(
      `SELECT storage_key FROM asset_files
       WHERE asset_version_id = $1 AND kind = 'original'`,
      [assetVersionId],
    );
    if (!files[0]) throw new NotFoundException('Original file not found');

    const nonce = randomBytes(16).toString('hex');
    const redisKey = this.redis.key('download', userId, assetVersionId);
    await this.redis.client.setex(redisKey, 300, nonce);

    const ipHash = meta?.ip
      ? createHash('sha256').update(meta.ip).digest('hex')
      : null;
    const uaHash = meta?.userAgent
      ? createHash('sha256').update(meta.userAgent).digest('hex')
      : null;

    await this.db.query(
      `INSERT INTO download_events (user_id, asset_version_id, entitlement_id, nonce, ip_hash, user_agent_hash)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, assetVersionId, rows[0].id, nonce, ipHash, uaHash],
    );
    await this.db.query(
      `UPDATE entitlements SET downloads_used = downloads_used + 1 WHERE id = $1`,
      [rows[0].id],
    );

    const url = await this.storage.presignDownload(files[0].storage_key, 120);
    return { url, expiresInSeconds: 120, nonce };
  }
}
