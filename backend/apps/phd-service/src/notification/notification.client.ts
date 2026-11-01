import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export type GuiThongBao = {
    userIds: string[];
    loai: string;                       // phải có trong MAU_THONG_BAO của notification-service
    duLieu?: Record<string, unknown>;
    khoaTrung?: string;                 // chống gửi trùng, service tự nối thêm userId
};

@Injectable()
export class NotificationClient {
    private readonly logger = new Logger(NotificationClient.name);

    constructor(@Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy) { }

    // Bắn sự kiện rồi đi tiếp, không chờ phản hồi và không bao giờ ném lỗi ra ngoài.
    // Chỉ gọi SAU KHI transaction đã commit.
    // Lưu ý: emit() trả về Observable "lạnh", không subscribe thì sẽ không gửi gì cả
    gui(d: GuiThongBao): void {
        if (!d.userIds || d.userIds.length === 0) return;
        try {
            this.client.emit('notification.create', d).subscribe({
                error: (e: Error) => this.logger.warn(`Không gửi được thông báo ${d.loai}: ${e?.message}`),
            });
        } catch (e) {
            this.logger.warn(`Không gửi được thông báo ${d.loai}: ${(e as Error).message}`);
        }
    }
}
