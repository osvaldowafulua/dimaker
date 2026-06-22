import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      'postgresql://dimaker:dimaker@localhost:5433/dimaker',
  });

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ) {
    return this.pool.query<T>(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
