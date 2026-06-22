import type { Job } from 'bullmq';
import { pool } from '../lib/db';

/** Placeholder embedding: production should call CLIP/OpenAI vision API */
function placeholderEmbedding(dim = 1024): string {
  const values = Array.from({ length: dim }, (_, i) =>
    Number(((Math.sin(i * 0.1) + 1) / 2).toFixed(6)),
  );
  return `[${values.join(',')}]`;
}

export function createAiEmbedProcessor() {
  return async (job: Job<{ assetId: string }>) => {
    const { assetId } = job.data;
    const vector = placeholderEmbedding();
    await pool.query(
      `INSERT INTO asset_embeddings (asset_id, model, embedding)
       VALUES ($1, 'placeholder-v1', $2::vector)
       ON CONFLICT (asset_id) DO UPDATE SET embedding = EXCLUDED.embedding, model = EXCLUDED.model`,
      [assetId, vector],
    );
    console.log(`[ai.embed] asset=${assetId}`);
    return { ok: true };
  };
}
