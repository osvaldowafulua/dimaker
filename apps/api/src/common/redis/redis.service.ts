import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client = new Redis(
    process.env.REDIS_URL ?? 'redis://localhost:6379',
    { maxRetriesPerRequest: null },
  );

  key(...parts: string[]) {
    return `dm:${parts.join(':')}`;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
