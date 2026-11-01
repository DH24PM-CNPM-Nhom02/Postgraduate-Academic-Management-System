import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DecisionController } from './decision.controller.js';
import { DecisionService } from './decision.service.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    ClientsModule.register([
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DOCUMENT_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.DOCUMENT_SERVICE_PORT ?? 3003),
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
        },
      }
    ]),
  ],
  controllers: [DecisionController],
  providers: [DecisionService],
})
export class DecisionModule { }