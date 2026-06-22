import type { Job } from 'bullmq';
import { QueueName } from '@dimaker/shared-types';
import { Queue } from 'bullmq';
import { pool } from '../lib/db';
import { redisConnection } from '../redis-connection';

export function createMediaScanProcessor() {
  const previewQueue = new Queue(QueueName.MediaPreview, {
    connection: redisConnection(),
  });

  return async (job: Job<{ uploadId: string; creatorId: string }>) => {
    const { uploadId } = job.data;
    console.log(`[media.scan] upload=${uploadId}`);

    await pool.query(
      `UPDATE uploads SET status = 'running' WHERE id = $1`,
      [uploadId],
    );

    // Stub: mark clean (integrate ClamAV in production)
    await pool.query(
      `UPDATE uploads SET status = 'succeeded', completed_at = now() WHERE id = $1`,
      [uploadId],
    );

    await previewQueue.add('preview', { uploadId });
    return { ok: true };
  };
}
