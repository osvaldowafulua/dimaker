import type { Job } from 'bullmq';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { QueueName } from '@dimaker/shared-types';
import { Queue } from 'bullmq';
import { pool } from '../lib/db';
import { getObjectBuffer, putObject } from '../lib/s3';
import { redisConnection } from '../redis-connection';

export function createMediaWatermarkProcessor() {
  const searchQueue = new Queue(QueueName.SearchIndex, {
    connection: redisConnection(),
  });

  return async (job: Job<{ uploadId: string; previewKey: string }>) => {
    const { uploadId, previewKey } = job.data;
    const buffer = await getObjectBuffer(previewKey);

    const watermarked = await sharp(buffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width="800" height="200"><text x="50%" y="50%" font-size="48" fill="rgba(255,255,255,0.35)" text-anchor="middle" font-family="sans-serif">DIMAKER</text></svg>`,
          ),
          gravity: 'center',
        },
      ])
      .webp({ quality: 80 })
      .toBuffer();

    const wmKey = previewKey.replace('/previews/', '/watermarked/');
    await putObject(wmKey, watermarked, 'image/webp');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: up } = await client.query<{ creator_id: string }>(
        `SELECT creator_id FROM uploads WHERE id = $1`,
        [uploadId],
      );
      if (!up[0]) return;

      const assetRes = await client.query<{ id: string }>(
        `INSERT INTO assets (creator_id, slug, title, asset_type, status, published_at)
         VALUES ($1, $2, $3, 'other', 'published', now()) RETURNING id`,
        [up[0].creator_id, `upload-${uploadId.slice(0, 8)}`, `Upload ${uploadId.slice(0, 8)}`],
      );
      const assetId = assetRes.rows[0].id;
      const verRes = await client.query<{ id: string }>(
        `INSERT INTO asset_versions (asset_id, version_number, is_current)
         VALUES ($1, 1, true) RETURNING id`,
        [assetId],
      );
      const versionId = verRes.rows[0].id;
      const checksum = createHash('sha256').update(watermarked).digest('hex');

      await client.query(
        `INSERT INTO asset_files (asset_version_id, kind, storage_key, mime_type, byte_size, checksum_sha256, virus_scan_status, virus_scanned_at)
         VALUES ($1,'watermarked',$2,'image/webp',$3,$4,'clean',now())`,
        [versionId, wmKey, watermarked.length, checksum],
      );

      await client.query(
        `INSERT INTO integration_outbox (aggregate_type, aggregate_id, event_type, payload)
         VALUES ('asset',$1,'asset.published',jsonb_build_object('assetId',$1::text))`,
        [assetId],
      );
      await client.query('COMMIT');

      await searchQueue.add('index', { assetId });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return { wmKey };
  };
}
