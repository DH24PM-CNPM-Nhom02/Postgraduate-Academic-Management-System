import { Module } from '@nestjs/common';
import { PhdServiceController } from './phd-service.controller.js';
import { PhdServiceService } from './phd-service.service.js';

@Module({
  imports: [],
  controllers: [PhdServiceController],
  providers: [PhdServiceService],
})
export class PhdServiceModule {}
