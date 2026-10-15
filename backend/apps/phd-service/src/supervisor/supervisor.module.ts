import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SupervisorController } from './supervisor.controller.js';
import { SupervisorService } from './supervisor.service.js';
// import { GvhdImportService } from './gvhd-import.service.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
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
    controllers: [SupervisorController],
    providers: [SupervisorService],
})
export class SupervisorModule { }
