import { Injectable } from '@nestjs/common';
import { QueueName } from '@dimaker/shared-types';
import { DatabaseService } from '../../common/database/database.service';
import { QueueService } from '../../common/queue/queue.service';

@Injectable()
export class AiService {
  constructor(
    private readonly db: DatabaseService,
    private readonly queues: QueueService,
  ) {}

  async enqueueEmbedding(assetId: string) {
    await this.queues.enqueue(QueueName.AiEmbed, 'embed', { assetId });
    return { queued: true };
  }

  async visualSearch(assetId: string, limit = 12) {
    const { rows } = await this.db.query<{ embedding: string }>(
      `SELECT embedding::text FROM asset_embeddings WHERE asset_id = $1`,
      [assetId],
    );
    if (!rows[0]) return [];

    const { rows: similar } = await this.db.query(
      `SELECT a.id, a.title, a.slug, cp.handle AS creator_handle,
              1 - (ae.embedding <=> $1::vector) AS score
       FROM asset_embeddings ae
       JOIN assets a ON a.id = ae.asset_id
       JOIN creator_profiles cp ON cp.user_id = a.creator_id
       WHERE a.status = 'published' AND ae.asset_id != $2
       ORDER BY ae.embedding <=> $1::vector
       LIMIT $3`,
      [rows[0].embedding, assetId, limit],
    );
    return similar;
  }
}
