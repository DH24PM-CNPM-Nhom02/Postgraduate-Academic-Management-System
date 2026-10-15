import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module.js';
import { RpcToHttpFilter } from './common/filters/rpc-to-http.filter.js';
import { AuditInterceptor } from './common/interceptors/audit.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  
  app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.useGlobalFilters(new RpcToHttpFilter());
  app.useGlobalInterceptors(new AuditInterceptor());
  
  app.enableCors();

  // Thiết lập tài liệu Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Postgraduate Academic Management System - API Gateway')
    .setDescription('Hệ thống Quản lý Học vụ Sau đại học - Sprint 5: Module Evaluation & PhD Management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(Number(process.env.API_GATEWAY_PORT ?? 8080));
}
bootstrap();
