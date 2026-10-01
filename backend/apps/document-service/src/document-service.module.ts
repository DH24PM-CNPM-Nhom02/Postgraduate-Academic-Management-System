import { Module } from '@nestjs/common';
import { DocumentServiceController } from './document-service.controller.js';
import { DocumentServiceService } from './document-service.service.js';

@Module({
  imports: [],
  controllers: [DocumentServiceController],
  providers: [DocumentServiceService],
})
export class DocumentServiceModule {}
