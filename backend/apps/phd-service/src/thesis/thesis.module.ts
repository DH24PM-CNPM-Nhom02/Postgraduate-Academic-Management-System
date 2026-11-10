import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ThesisController } from './thesis.controller.js';
import { ThesisService } from './thesis.service.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}
