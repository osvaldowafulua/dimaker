import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class SearchService {
  private readonly client: MeiliSearch;
  readonly indexName = 'assets';

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILI_HOST ?? 'http://localhost:7700',
      apiKey: process.env.MEILI_API_KEY ?? 'dimaker_dev_master_key',
    });
  }

  async search(q: string, filters?: { type?: string; license?: string }) {
    const index = this.client.index(this.indexName);
    const filter: string[] = [];
    if (filters?.type) filter.push(`asset_type = "${filters.type}"`);
    if (filters?.license) filter.push(`licenses = "${filters.license}"`);

    return index.search(q, {
      filter: filter.length ? filter.join(' AND ') : undefined,
      limit: 24,
    });
  }

  async indexAsset(doc: Record<string, unknown>) {
    const index = this.client.index(this.indexName);
    await index.addDocuments([doc]);
  }

  async ensureIndex() {
    try {
      await this.client.createIndex(this.indexName, { primaryKey: 'id' });
      await this.client.index(this.indexName).updateFilterableAttributes([
        'asset_type',
        'licenses',
        'creator_handle',
      ]);
      await this.client.index(this.indexName).updateSearchableAttributes([
        'title',
        'description',
        'tags',
      ]);
    } catch {
      /* index may exist */
    }
  }
}
