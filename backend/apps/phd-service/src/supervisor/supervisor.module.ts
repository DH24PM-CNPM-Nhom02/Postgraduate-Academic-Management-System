import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SupervisorController } from './supervisor.controller.js';
import { SupervisorService } from './supervisor.service.js';
import { ThesisService } from './thesis.service.js';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('NOTIFICATION_SERVICE_HOST', '127.0.0.1'),
            port: Number(c.get('NOTIFICATION_SERVICE_PORT', 3003)),
          },
        }),
      },
    ]),
  ],
  controllers: [SupervisorController],
  providers: [SupervisorService, ThesisService],
  exports: [SupervisorService, ThesisService],
})
export class SupervisorModule {}
