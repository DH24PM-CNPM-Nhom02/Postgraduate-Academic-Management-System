import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationClient } from './notification.client.js';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NOTIFICATION_SERVICE',
                transport: Transport.TCP,
                // Đổi cách đọc host/port cho giống các client khác trong phd-service
                options: {
                    host: process.env.NOTIFICATION_HOST ?? 'localhost',
                    port: Number(process.env.NOTIFICATION_PORT ?? 3004),
                },
            },
        ]),
    ],
    providers: [NotificationClient],
    exports: [NotificationClient],
})
export class NotificationModule { }
