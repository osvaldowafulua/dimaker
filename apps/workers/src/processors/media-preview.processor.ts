import type { Job } from 'bullmq';
import sharp from 'sharp';
import { QueueName } from '@dimaker/shared-types';
import { Queue } from 'bullmq';
import { pool } from '../lib/db';
import { getObjectBuffer, putObject } from '../lib/s3';
import { redisConnection } from '../redis-connection';

export function createMediaPreviewProcessor() {
  const watermarkQueue = new Queue(QueueName.MediaWatermark, {
    connection: redisConnection(),
  });

  return async (job: Job<{ uploadId: string }>) => {
    const { uploadId } = job.data;
    const { rows } = await pool.query<{
      storage_key: string;
      creator_id: string;
      mime_type: string;
    }>(`SELECT storage_key, creator_id, mime_type FROM uploads WHERE id = $1`, [
      uploadId,
    ]);
    const upload = rows[0];
    if (!upload) return { skipped: true };

    if (!upload.mime_type.startsWith('image/')) {
      console.log(`[media.preview] skip non-image ${upload.mime_type}`);
      return { skipped: true };
    }

    const buffer = await getObjectBuffer(upload.storage_key);
    const thumb = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const thumbKey = upload.storage_key.replace(/^uploads\//, 'previews/') + '.webp';
    await putObject(thumbKey, thumb, 'image/webp');

    await watermarkQueue.add('watermark', { uploadId, previewKey: thumbKey });
    return { previewKey: thumbKey };
  };
}
