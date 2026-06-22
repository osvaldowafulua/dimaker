import type { Job } from 'bullmq';
import { MeiliSearch } from 'meilisearch';
import { pool } from '../lib/db';

const meili = new MeiliSearch({
  host: process.env.MEILI_HOST ?? 'http://localhost:7700',
  apiKey: process.env.MEILI_API_KEY ?? 'dimaker_dev_master_key',
});

export function createSearchIndexProcessor() {
  return async (job: Job<{ assetId: string }>) => {
    const { assetId } = job.data;
    const { rows } = await pool.query<{
      id: string;
      title: string;
      description: string | null;
      asset_type: string;
      creator_handle: string;
    }>(
      `SELECT a.id, a.title, a.description, a.asset_type::text, cp.handle AS creator_handle
       FROM assets a
       JOIN creator_profiles cp ON cp.user_id = a.creator_id
       WHERE a.id = $1`,
      [assetId],
    );
    const asset = rows[0];
    if (!asset) return { skipped: true };

    const index = meili.index('assets');
    await index.addDocuments([
      {
        id: asset.id,
        title: asset.title,
        description: asset.description ?? '',
        asset_type: asset.asset_type,
        creator_handle: asset.creator_handle,
        tags: [],
        licenses: ['personal'],
      },
    ]);
    console.log(`[search.index] asset=${assetId}`);
    return { ok: true };
  };
}
