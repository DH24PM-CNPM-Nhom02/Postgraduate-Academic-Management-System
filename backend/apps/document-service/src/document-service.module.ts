import { Module } from '@nestjs/common';
import { DocumentServiceController } from './document-service.controller.js';
import { DocumentServiceService } from './document-service.service.js';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [DocumentServiceController],
  providers: [DocumentServiceService],
})
export class DocumentServiceModule {}
