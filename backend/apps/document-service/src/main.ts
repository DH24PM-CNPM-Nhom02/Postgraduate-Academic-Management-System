import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentServiceModule } from './document-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DocumentServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.DOCUMENT_SERVICE_HOST ?? '0.0.0.0',
        port: Number(process.env.DOCUMENT_SERVICE_PORT ?? 3003),
      },
    },
  );
  await app.listen();
}
await bootstrap();
