import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PHD_SERVICE } from '../common/constants/service.js';
import { GraduationController } from './graduation.controller.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ClientsModule.register([
            {
                name: PHD_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: process.env.PHD_SERVICE_HOST ?? '127.0.0.1',
                    port: Number(process.env.PHD_SERVICE_PORT ?? 3002),
                },
            },
        ])
    ],
    controllers: [GraduationController],
})
export class GraduationModule { }