import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NcsController } from './ncd.controller.js';
import { NcsService } from './ncs.service.js';
import { NcsImportService } from './ncs-import.service.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        NotificationModule,
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
                    port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
                },
            },
        ])
    ],
    controllers: [NcsController],
    providers: [NcsService, NcsImportService],
})
export class NcsModule { }
