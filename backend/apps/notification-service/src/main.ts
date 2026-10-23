import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NOTIFICATION_SERVICE_HOST ?? '0.0.0.0',
        port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3004),
      },
    },
  );
  await app.listen();
}
await bootstrap();
