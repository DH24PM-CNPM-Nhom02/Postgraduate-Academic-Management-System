import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProgressController } from './progress.controller.js';
import { ProgressService } from './progress.service.js';
import { DeadlineService } from './deadline.service.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        ClientsModule.register([
            {
                name: 'DOCUMENT_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.DOCUMENT_SERVICE_HOST ?? '127.0.0.1',
                    port: Number(process.env.DOCUMENT_SERVICE_PORT ?? 3003),
                },
            },
            {
                name: 'NOTIFICATION_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.NOTIFICATION_SERVICE_HOST ?? '127.0.0.1',
                    port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3004),
                },
            },
        ])
    ],
    controllers: [ProgressController],
    providers: [ProgressService, DeadlineService],
})
export class ProgressModule { }
