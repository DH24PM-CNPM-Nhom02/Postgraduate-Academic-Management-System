import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { PhdEventPayload } from '../../../lib/contracts/src/dto/change-request.dto.js';
import { NotificationServiceService } from './notification-service.service.js';

@Controller()
export class NotificationServiceController {
  private readonly logger = new Logger(NotificationServiceController.name);

  constructor(private readonly notificationServiceService: NotificationServiceService) {}

  @Get()
  getHello(): string {
    return this.notificationServiceService.getHello();
  }

  // ─── [S5-22] Lắng nghe Event TCP từ phd-service ────────────────────────────

  @EventPattern('phd.supervisor.assigned')
  handleSupervisorAssigned(@Payload() event: PhdEventPayload) {
    this.logger.log(
      `[EVENT RECEIVED] phd.supervisor.assigned | EventID: ${event.eventId} | NCS: ${event.ncsId} | GVHD: ${event.data?.gvhdId} | Vai trò: ${event.data?.vaiTro} | Quyết định: ${event.data?.soQuyetDinh}`,
    );
    // Xử lý gửi thông báo (email / in-app notification) cho NCS và GVHD
    return { success: true, eventId: event.eventId };
  }

  @EventPattern('phd.change_request.approved')
  handleChangeRequestApproved(@Payload() event: PhdEventPayload) {
    this.logger.log(
      `[EVENT RECEIVED] phd.change_request.approved | EventID: ${event.eventId} | NCS: ${event.ncsId} | Loại: ${event.data?.loai} | Quyết định: ${event.data?.soQuyetDinh}`,
    );
    // Xử lý gửi thông báo (email / in-app notification) cho NCS thông báo đề nghị thay đổi đã được phê duyệt
    return { success: true, eventId: event.eventId };
  }
}
