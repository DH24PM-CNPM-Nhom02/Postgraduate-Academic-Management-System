import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller.js';
import { ApiGatewayService } from './api-gateway.service.js';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { NcsModule } from './ncs/ncs.module.js';
import { EvaluationModule } from './evaluation/evaluation.module.js';
import { SupervisorModule } from './supervisor/supervisor.module.js';
import { ChangeRequestModule } from './change-request/change-request.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    NcsModule,
    EvaluationModule,
    SupervisorModule,
    ChangeRequestModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
        },
      },
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DOCUMENT_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.DOCUMENT_SERVICE_PORT ?? 3002),
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3003),
        },
      },
      {
        name: 'PHD_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PHD_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.PHD_SERVICE_PORT ?? 3004),
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
