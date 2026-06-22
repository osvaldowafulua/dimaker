import { Queue } from 'bullmq';
import { QueueName } from '@dimaker/shared-types';
import { pool } from '../lib/db';
import { redisConnection } from '../redis-connection';

export function createOutboxPublisher(): NodeJS.Timeout {
  const searchQ = new Queue(QueueName.SearchIndex, { connection: redisConnection() });
  const aiQ = new Queue(QueueName.AiEmbed, { connection: redisConnection() });

  return setInterval(async () => {
    try {
      const { rows } = await pool.query<{
        id: string;
        event_type: string;
        aggregate_id: string;
      }>(
        `SELECT id, event_type, aggregate_id::text FROM integration_outbox
         WHERE published_at IS NULL ORDER BY created_at LIMIT 50`,
      );
      for (const row of rows) {
        if (row.event_type === 'asset.published') {
          await searchQ.add('index', { assetId: row.aggregate_id });
          await aiQ.add('embed', { assetId: row.aggregate_id });
        }
        await pool.query(
          `UPDATE integration_outbox SET published_at = now() WHERE id = $1`,
          [row.id],
        );
      }
    } catch (err) {
      console.error('[outbox] error', err);
    }
  }, 5000);
}
