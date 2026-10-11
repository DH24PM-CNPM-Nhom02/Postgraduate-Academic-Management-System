import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST ?? '0.0.0.0',
        port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
      },
    },
  );
  await app.listen();
}
await bootstrap();
