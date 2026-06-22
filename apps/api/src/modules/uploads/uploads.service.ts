import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { QueueName } from '@dimaker/shared-types';
import { DatabaseService } from '../../common/database/database.service';
import { QueueService } from '../../common/queue/queue.service';
import { RedisService } from '../../common/redis/redis.service';
import { StorageService } from '../../common/storage/storage.service';
import { assertAllowedUpload } from '../../common/validation/upload-validation';

@Injectable()
export class UploadsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly queues: QueueService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
  ) {}

  async presign(creatorId: string, mimeType: string, byteSize: number) {
    try {
      assertAllowedUpload(mimeType, byteSize);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }

    const uploadId = randomUUID();
    const storageKey = `uploads/${creatorId}/${uploadId}`;
    const uploadUrl = await this.storage.presignUpload(storageKey, mimeType);

    await this.db.query(
      `INSERT INTO uploads (id, creator_id, storage_key, mime_type, byte_size, status)
       VALUES ($1, $2, $3, $4, $5, 'queued')`,
      [uploadId, creatorId, storageKey, mimeType, byteSize],
    );

    return { uploadId, storageKey, uploadUrl, method: 'PUT' };
  }

  async complete(uploadId: string, creatorId: string) {
    const lockKey = this.redis.key('lock', 'upload', uploadId);
    const locked = await this.redis.client.set(lockKey, '1', 'EX', 600, 'NX');
    if (!locked) return { status: 'already_processing' };

    await this.queues.enqueue(QueueName.MediaScan, 'scan', { uploadId, creatorId });
    return { status: 'queued' };
  }
}
