import { Controller, Get, Inject, Param, Patch, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { ListNotificationQueryDto } from '../../../../lib/contracts/src/dto/notification.dto.js';


@Controller('notifications')
export class NotificationController {
    constructor(
        @Inject('NOTIFICATION_SERVICE') private readonly notifClient: ClientProxy,
    ) { }

    @Get()
    async getNotifications(@CurrentUser() user: AuthUser, @Query() query: ListNotificationQueryDto) {
        return firstValueFrom(
            this.notifClient.send('notification.list', {
                userId: user.id,
                chiChuaDoc: String(query.unread) === 'true',
                nhom: query.group,
                trang: Number(query.page || 1),
                soLuong: Number(query.limit || 20),
            }),
        );
    }

    @Get('unread-count')
    async getUnreadCount(@CurrentUser() user: AuthUser) {
        return firstValueFrom(
            this.notifClient.send('notification.unread-count', { userId: user.id }),
        );
    }

    @Patch(':id/read')
    async markAsRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return firstValueFrom(
            this.notifClient.send('notification.read', { userId: user.id, id }),
        );
    }

    @Patch('read-all')
    async markAllAsRead(@CurrentUser() user: AuthUser) {
        return firstValueFrom(
            this.notifClient.send('notification.read-all', { userId: user.id }),
        );
    }
}