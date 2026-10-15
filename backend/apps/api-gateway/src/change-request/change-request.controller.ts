import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom, timeout } from 'rxjs';
import {
  ApproveChangeRequestDto,
  CreateChangeRequestDto,
  QueryChangeRequestsDto,
  RejectChangeRequestDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';

/**
 * [S5-21] API Gateway Controller cho Module Change Request (Đề nghị thay đổi)
 * - Tiếp nhận đơn xin đổi đề tài, đổi GVHD, gia hạn học tập.
 * - Phê duyệt đơn (Transaction cập nhật dữ liệu tự động theo BR-04).
 * - Từ chối đơn (bắt buộc lý do).
 */
@ApiTags('PhD Change Requests (Đề nghị thay đổi đề tài / GVHD)')
@ApiBearerAuth()
@Controller('phd/change-requests')
export class ChangeRequestController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Post()
  @Roles(ROLES.NCS, ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-20, S5-21] Nộp đơn đề nghị thay đổi (Đổi tên đề tài, Đổi GVHD, Gia hạn học tập)',
    description: 'NCS hoặc Giáo vụ nộp đơn đề nghị. Trạng thái khởi tạo là CHO_DUYET.',
  })
  @ApiResponse({ status: 201, description: 'Nộp đơn đề nghị thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc thiếu thông tin bắt buộc' })
  submitChangeRequest(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateChangeRequestDto,
  ) {
    return this.send('phd.change-request.submit', { actorId: user.id, dto });
  }

  @Get()
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN, ROLES.GVHD)
  @ApiOperation({
    summary: '[S5-21] Danh sách đơn đề nghị thay đổi (có thể lọc theo NCS, loại đơn, trạng thái)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách đơn đề nghị' })
  listChangeRequests(@Query() query: QueryChangeRequestsDto) {
    return this.send('phd.change-request.list', query);
  }

  @Get(':id')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN, ROLES.NCS, ROLES.GVHD)
  @ApiOperation({ summary: '[S5-21] Chi tiết một đơn đề nghị thay đổi kèm thông tin liên quan' })
  @ApiParam({ name: 'id', description: 'ID đơn đề nghị (UUID)' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn đề nghị' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đề nghị' })
  getChangeRequest(@Param('id') id: string) {
    return this.send('phd.change-request.get', { id });
  }

  @Post(':id/approve')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-20, S5-21] Phê duyệt đơn đề nghị thay đổi (kèm số quyết định pháp lý)',
    description:
      'Chạy Transaction tự động cập nhật dữ liệu chính:\n' +
      '- Đổi đề tài: Đổi đề tài cũ sang DA_THAY_THE (BR-04), tạo đề tài mới với quyết định GIAO_DE_TAI.\n' +
      '- Đổi GVHD: Khóa GVHD mới kiểm tra hạn ngạch BR-09, chuyển phân công cũ sang DEACTIVATE (BR-04), tạo phân công mới với quyết định PHAN_CONG_GVHD.\n' +
      '- Gia hạn: Cập nhật hạn gia hạn học tập và trạng thái GIA_HAN.\n' +
      'Sau đó phát sự kiện TCP phd.change_request.approved tới notification-service.',
  })
  @ApiParam({ name: 'id', description: 'ID đơn đề nghị (UUID)' })
  @ApiResponse({ status: 200, description: 'Phê duyệt đơn thành công' })
  @ApiResponse({ status: 400, description: 'Đơn đã được xử lý hoặc vượt hạn ngạch GVHD' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đề nghị' })
  approveChangeRequest(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ApproveChangeRequestDto,
    @Headers('x-correlation-id') correlationId?: string,
  ) {
    return this.send('phd.change-request.approve', {
      actorId: user.id,
      id,
      dto,
      correlationId,
    });
  }

  @Post(':id/reject')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-20, S5-21] Từ chối đơn đề nghị thay đổi (bắt buộc nhập lý do)',
    description: 'Chuyển trạng thái đơn sang TU_CHOI và lưu lý do từ chối.',
  })
  @ApiParam({ name: 'id', description: 'ID đơn đề nghị (UUID)' })
  @ApiResponse({ status: 200, description: 'Từ chối đơn thành công' })
  @ApiResponse({ status: 400, description: 'Đơn đã được xử lý hoặc thiếu lý do từ chối' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đề nghị' })
  rejectChangeRequest(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RejectChangeRequestDto,
  ) {
    return this.send('phd.change-request.reject', {
      actorId: user.id,
      id,
      dto,
    });
  }
}
