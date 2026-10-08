import { NestFactory } from '@nestjs/core';
import { PhdServiceModule } from './phd-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(PhdServiceModule);
  await app.listen(Number(process.env.port ?? 3000));
}
await bootstrap();
