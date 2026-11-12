import { Module } from '@nestjs/common';
import { PhdServiceController } from './phd-service.controller.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { NcsModule } from './ncs/ncs.module.js';
import { SupervisorModule } from './supervisor/supervisor.module.js';
import { ProgressModule } from './progress/progress.module.js';
import { DecisionModule } from './decision/decision.module.js';
import { PhdCronModule } from './cron/phd-cron.module.js';
import { GraduationAssessmentModule } from './graduation-assessment/graduation-assessment.module.js';
import { ChangeRequestModule } from './change-request/change-request.module.js';
import { ThesisModule } from './thesis/thesis.module.js';
import { AuditModule } from './audit/audit.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, NcsModule, SupervisorModule, ProgressModule, DecisionModule, PhdCronModule, GraduationAssessmentModule, ChangeRequestModule, ThesisModule, AuditModule],
  controllers: [PhdServiceController],
})
export class PhdServiceModule { }
