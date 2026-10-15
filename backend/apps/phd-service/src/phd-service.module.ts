import { Module } from '@nestjs/common';
// import { PhdServiceController } from './phd-service.controller.js';
// import { PhdServiceService } from './phd-service.service.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { NcsModule } from './ncs/ncs.module.js';
import { EvaluationModule } from './evaluation/evaluation.module.js';
import { SupervisorModule } from './supervisor/supervisor.module.js';
import { ChangeRequestModule } from './change-request/change-request.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    NcsModule,
    EvaluationModule,
    SupervisorModule,
    ChangeRequestModule,
  ],
})
export class PhdServiceModule {}

