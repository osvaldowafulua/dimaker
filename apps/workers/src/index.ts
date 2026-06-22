import { Worker } from 'bullmq';
import { QueueName } from '@dimaker/shared-types';
import { createMediaScanProcessor } from './processors/media-scan.processor';
import { createMediaPreviewProcessor } from './processors/media-preview.processor';
import { createMediaWatermarkProcessor } from './processors/media-watermark.processor';
import { createSearchIndexProcessor } from './processors/search-index.processor';
import { createEmailProcessor } from './processors/email.processor';
import { createAiEmbedProcessor } from './processors/ai-embed.processor';
import { createOutboxPublisher } from './processors/outbox.publisher';
import { redisConnection } from './redis-connection';

const connection = redisConnection();

const workers: Worker[] = [
  new Worker(QueueName.MediaScan, createMediaScanProcessor(), { connection }),
  new Worker(QueueName.MediaPreview, createMediaPreviewProcessor(), { connection }),
  new Worker(QueueName.MediaWatermark, createMediaWatermarkProcessor(), { connection }),
  new Worker(QueueName.SearchIndex, createSearchIndexProcessor(), { connection }),
  new Worker(QueueName.AiEmbed, createAiEmbedProcessor(), { connection }),
  new Worker(QueueName.EmailSend, createEmailProcessor(), { connection }),
];

createOutboxPublisher();

console.log(`[workers] listening: ${Object.values(QueueName).join(', ')}`);

async function shutdown() {
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
