import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PhdServiceModule } from './phd-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PhdServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.PHD_SERVICE_HOST ?? '0.0.0.0',
        port: Number(process.env.PHD_SERVICE_PORT ?? 3002),
      },
    },
  );
  await app.listen();
}
await bootstrap();
