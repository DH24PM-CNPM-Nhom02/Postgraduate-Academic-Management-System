import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module.js';
import { RpcToHttpFilter } from './common/filters/rpc-to-http.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  
  app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.useGlobalFilters(new RpcToHttpFilter());
  
  app.enableCors();

  await app.listen(Number(process.env.API_GATEWAY_PORT ?? 8080));
}
bootstrap();
