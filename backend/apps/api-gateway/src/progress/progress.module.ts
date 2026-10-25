import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PHD_SERVICE } from '../common/constants/service.js';
import { ProgressController } from './progress.controller.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
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
  controllers: [ProgressController],
})
export class ProgressModule { }