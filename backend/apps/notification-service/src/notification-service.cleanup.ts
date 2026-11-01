import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification-service.service.js';

@Injectable()
export class NotificationCleanup {
    private readonly logger = new Logger(NotificationCleanup.name);

    constructor(private readonly service: NotificationService) { }

    // Mỗi ngày lúc 02:00 xóa các thông báo đã quá hạn lưu trữ
    @Cron('0 2 * * *')
    async donDep() {
        try {
            const soDong = await this.service.xoaQuaHan();
            this.logger.log(`Đã xóa ${soDong} thông báo quá hạn lưu trữ`);
        } catch (e) {
            this.logger.error(`Dọn thông báo quá hạn bị lỗi: ${(e as Error).message}`);
        }
    }
}