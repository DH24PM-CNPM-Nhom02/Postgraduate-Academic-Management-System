import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ChangeRequestController } from './change-request.controller.js';
import { ChangeRequestService } from './change-request.service.js';

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
  controllers: [ChangeRequestController],
  providers: [ChangeRequestService],
  exports: [ChangeRequestService],
})
export class ChangeRequestModule {}
