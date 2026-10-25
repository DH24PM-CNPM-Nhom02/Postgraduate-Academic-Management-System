import { Module } from '@nestjs/common';
// import { PhdServiceController } from './phd-service.controller.js';
// import { PhdServiceService } from './phd-service.service.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { NcsModule } from './ncs/ncs.module.js';
import { SupervisorModule } from './supervisor/supervisor.module.js';
import { ProgressModule } from './progress/progress.module.js';
import { DecisionModule } from './decision/decision.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, NcsModule, SupervisorModule, ProgressModule, DecisionModule],
  // controllers: [PhdServiceController],
  // providers: [PhdServiceService],
})
export class PhdServiceModule { }
