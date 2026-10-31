import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification-service.service.js';

@Controller()
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly service: NotificationService) { }

    // Sự kiện từ các service khác: gửi rồi đi tiếp, không chờ phản hồi.
    // Lỗi chỉ ghi log, không ném ra ngoài
    @EventPattern('notification.create')
    async create(@Payload() d: { userIds: string[]; loai: string; duLieu?: Record<string, unknown>; khoaTrung?: string }) {
        try {
            await this.service.create(d);
        } catch (e) {
            this.logger.error(`Không tạo được thông báo ${d?.loai}: ${(e as Error).message}`);
        }
    }

    // Các message dưới đây do gateway gọi. userId luôn lấy từ token ở gateway
    @MessagePattern('notification.list')
    danhSach(@Payload() f: { userId: string; chiChuaDoc?: boolean; nhom?: string; trang?: number; soLuong?: number }) {
        return this.service.danhSach(f);
    }

    @MessagePattern('notification.unread-count')
    demChuaDoc(@Payload() d: { userId: string }) {
        return this.service.demChuaDoc(d.userId);
    }

    @MessagePattern('notification.read')
    danhDauDaDoc(@Payload() d: { userId: string; id: string }) {
        return this.service.danhDauDaDoc(d.userId, d.id);
    }

    @MessagePattern('notification.read-all')
    danhDauTatCaDaDoc(@Payload() d: { userId: string }) {
        return this.service.danhDauTatCaDaDoc(d.userId);
    }
}