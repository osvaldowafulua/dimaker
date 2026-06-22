import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  readonly bucket: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    this.bucket = process.env.S3_BUCKET ?? 'dimaker-assets';
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'us-east-1',
      endpoint,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'dimaker',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'dimaker_secret',
      },
    });
  }

  async presignUpload(key: string, mimeType: string, expiresIn = 900) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async presignDownload(key: string, expiresIn = 120) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  publicPreviewUrl(key: string) {
    const base = process.env.S3_PUBLIC_BASE_URL;
    if (base) return `${base.replace(/\/$/, '')}/${key}`;
    return null;
  }
}
