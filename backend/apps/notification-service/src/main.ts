import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3003),
      },
    },
  );
  await app.listen();
}
await bootstrap();
