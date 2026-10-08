import { NestFactory } from '@nestjs/core';
import { DocumentServiceModule } from './document-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(DocumentServiceModule);
  await app.listen(Number(process.env.port ?? 3000));
}
await bootstrap();
