import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DOCUMENT_SERVICE, PHD_SERVICE } from '../common/constants/service.js';
import { DocumentsController } from './document.controller.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: DOCUMENT_SERVICE,
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('DOCUMENT_SERVICE_HOST', '127.0.0.1'),
            port: Number(c.get('DOCUMENT_SERVICE_PORT', 3003)),
          },
        }),
      },
      {
        name: PHD_SERVICE,
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('PHD_SERVICE_HOST', '127.0.0.1'),
            port: Number(c.get('PHD_SERVICE_PORT', 3002)),
          },
        }),
      },
    ]),
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule { }