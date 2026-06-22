import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, QueueOptions } from 'bullmq';
import { QueueName } from '@dimaker/shared-types';
@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly queues = new Map<string, Queue>();

  private connection(): { host: string; port: number; password?: string } {
    const url = new URL(process.env.REDIS_URL ?? 'redis://localhost:6379');
    return {
      host: url.hostname,
      port: Number(url.port) || 6379,
      password: url.password || undefined,
    };
  }

  get(name: QueueName | string, opts?: Partial<QueueOptions>): Queue {
    const key = String(name);
    if (!this.queues.has(key)) {
      this.queues.set(
        key,
        new Queue(key, { connection: this.connection(), ...opts }),
      );
    }
    return this.queues.get(key)!;
  }

  async enqueue<T extends Record<string, unknown>>(
    name: QueueName | string,
    jobName: string,
    data: T,
    opts?: { delay?: number; jobId?: string },
  ) {
    const queue = this.get(name);
    return queue.add(jobName, data, {
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      ...opts,
    });
  }

  async onModuleDestroy() {
    await Promise.all([...this.queues.values()].map((q) => q.close()));
  }
}
