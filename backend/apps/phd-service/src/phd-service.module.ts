import { Module } from '@nestjs/common';
// import { PhdServiceController } from './phd-service.controller.js';
// import { PhdServiceService } from './phd-service.service.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { NcsModule } from './ncs/ncs.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, NcsModule],
  // controllers: [PhdServiceController],
  // providers: [PhdServiceService],
})
export class PhdServiceModule {}
