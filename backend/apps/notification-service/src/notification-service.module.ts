import { Module } from '@nestjs/common';
import { NotificationController } from './notification-service.controller.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification-service.service.js';
import { NotificationCleanup } from './notification-service.cleanup.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationCleanup],
})
export class NotificationServiceModule { }
