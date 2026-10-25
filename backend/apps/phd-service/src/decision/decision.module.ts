import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DecisionController } from './decision.controller.js';
import { DecisionService } from './decision.service.js';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'DOCUMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DOCUMENT_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.DOCUMENT_SERVICE_PORT ?? 3003),
        },
      },
    ]),
  ],
  controllers: [DecisionController],
  providers: [DecisionService],
})
export class DecisionModule {}