import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { ProgressModule } from '../progress/progress.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PhdCronService } from './phd-cron.service.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    NotificationModule,
    ProgressModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
        },
      },
    ]),
  ],
  providers: [PhdCronService],
  exports: [PhdCronService],
})
export class PhdCronModule { }
