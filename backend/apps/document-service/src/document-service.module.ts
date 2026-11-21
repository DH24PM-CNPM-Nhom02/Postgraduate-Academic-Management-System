import { Module } from '@nestjs/common';
import { DocumentServiceController } from './document-service.controller.js';
import { DocumentServiceService } from './document-service.service.js';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    ClientsModule.registerAsync([
      {
        name: 'PHD_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('PHD_SERVICE_HOST', '127.0.0.1'),
            port: Number(config.get('PHD_SERVICE_PORT', 3002)),
          },
        }),
      },
    ]),
  ],
  controllers: [DocumentServiceController],
  providers: [DocumentServiceService],
})
export class DocumentServiceModule {}
