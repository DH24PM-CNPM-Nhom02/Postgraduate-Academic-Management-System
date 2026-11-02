import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { GraduationAssessmentService } from './graduation-assessment.service.js';
import { GraduationAssessmentController } from './graduation-assessment.controller.js';

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
      }
    ]),
  ],
  controllers: [GraduationAssessmentController],
  providers: [GraduationAssessmentService],
})
export class GraduationAssessmentModule { }