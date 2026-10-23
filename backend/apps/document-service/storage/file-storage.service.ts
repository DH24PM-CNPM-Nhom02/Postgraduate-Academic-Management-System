import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileStorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow<string>(
      'SEAWEED_S3_BUCKET',
    );

    this.s3 = new S3Client({
      endpoint: config.getOrThrow<string>(
        'SEAWEED_S3_ENDPOINT',
      ),
      region: config.get<string>(
        'SEAWEED_S3_REGION',
        'us-east-1',
      ),
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.getOrThrow<string>(
          'SEAWEED_S3_ACCESS_KEY',
        ),
        secretAccessKey: config.getOrThrow<string>(
          'SEAWEED_S3_SECRET_KEY',
        ),
      },
    });
  }

  async upload(
    objectKey: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: buffer,
        ContentType: mimeType,
      }),
    );
  }

  async download(objectKey: string): Promise<Buffer> {
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }),
    );

    if (!result.Body) {
      throw new Error('Không có nội dung file');
    }

    return Buffer.from(
      await result.Body.transformToByteArray(),
    );
  }

  async delete(objectKey: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }),
    );
  }
}