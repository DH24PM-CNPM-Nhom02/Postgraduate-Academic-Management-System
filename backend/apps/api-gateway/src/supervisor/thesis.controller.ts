import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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
  CreateThesisDto,
  QueryThesisDto,
  UpdateThesisDto,
} from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';

/**
 * [S5-18, S5-23] API Gateway Controller cho Quản lý Đề tài luận án.
 * - Hỗ trợ tạo mới, cập nhật (BR-04: thay thế không xóa), xem lịch sử.
 * - RBAC Guard, Swagger documentation và Audit Trail đầy đủ.
 */
@ApiTags('PhD Thesis (Đề tài)')
@ApiBearerAuth()
@Controller('phd/theses')
export class ThesisController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Get()
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-18] Danh sách đề tài luận án (có lọc theo NCS, trạng thái, từ khóa)' })
  @ApiResponse({ status: 200, description: 'Danh sách đề tài' })
  listTheses(@Query() query: QueryThesisDto) {
    return this.send('phd.thesis.list', query);
  }

  @Post()
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-18] Giao đề tài luận án cho NCS (kèm số quyết định và ngày ký)',
    description: 'Tạo đề tài mới với quyết định GIAO_DE_TAI. Báo lỗi PHD_THESIS_ACTIVE_EXISTS nếu NCS đã có đề tài đang hiệu lực.',
  })
  @ApiResponse({ status: 201, description: 'Tạo đề tài thành công' })
  @ApiResponse({ status: 400, description: 'NCS đã có đề tài đang hiệu lực (PHD_THESIS_ACTIVE_EXISTS)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy NCS (PHD_THESIS_STUDENT_NOT_FOUND)' })
  createThesis(@CurrentUser() u: AuthUser, @Body() dto: CreateThesisDto) {
    return this.send('phd.thesis.create', { actorId: u.id, dto });
  }

  @Get('ncs/:ncsId/current')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-18] Lấy đề tài đang hiệu lực của một NCS' })
  @ApiParam({ name: 'ncsId', description: 'ID nghiên cứu sinh' })
  @ApiResponse({ status: 200, description: 'Đề tài đang hiệu lực (null nếu chưa có)' })
  getCurrentThesisByNcs(@Param('ncsId') ncsId: string) {
    return this.send('phd.thesis.current', { ncsId });
  }

  @Get('ncs/:ncsId/history')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-18] Lịch sử toàn bộ đề tài của NCS (kể cả đề tài đã thay thế DA_THAY_THE)',
    description: 'Cung cấp toàn bộ chuỗi thay đổi đề tài phục vụ truy vết pháp lý (BR-04).',
  })
  @ApiParam({ name: 'ncsId', description: 'ID nghiên cứu sinh' })
  @ApiResponse({ status: 200, description: 'Danh sách đề tài theo thứ tự thời gian' })
  getThesisHistory(@Param('ncsId') ncsId: string) {
    return this.send('phd.thesis.history', { ncsId });
  }

  @Get(':id')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-18] Chi tiết một đề tài (kèm quyết định pháp lý)' })
  @ApiParam({ name: 'id', description: 'ID đề tài' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết đề tài' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đề tài (PHD_THESIS_NOT_FOUND)' })
  getThesis(@Param('id') id: string) {
    return this.send('phd.thesis.get', { id });
  }

  @Patch(':id')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-18] Cập nhật / điều chỉnh tên đề tài (BR-04: thay thế, không xóa)',
    description:
      'Đặt đề tài cũ thành DA_THAY_THE, tạo quyết định GIAO_DE_TAI mới và bản ghi đề tài mới với HIEU_LUC. Giữ toàn bộ lịch sử pháp lý.',
  })
  @ApiParam({ name: 'id', description: 'ID đề tài cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công, đề tài cũ chuyển DA_THAY_THE' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đề tài (PHD_THESIS_NOT_FOUND)' })
  updateThesis(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateThesisDto,
  ) {
    return this.send('phd.thesis.update', { actorId: u.id, id, dto });
  }
}
