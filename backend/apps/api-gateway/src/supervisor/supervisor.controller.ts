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
  AssignSupervisorDto,
  ChangeSupervisorDto,
  CreateSupervisorDto,
  QueryAssignmentsDto,
  QuerySupervisorsDto,
  UpdateSupervisorDto,
} from '../../../../lib/contracts/src/dto/supervisor.dto.js';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';

/**
 * [S5-16, S5-17, S5-23] API Gateway Controller cho Quản lý GVHD.
 * - RBAC Guard: @Roles(...) được áp dụng trên từng endpoint.
 * - Audit: AuditInterceptor toàn cục xử lý correlation-id và ghi log.
 * - Swagger: Tài liệu OpenAPI đầy đủ tại /api/docs.
 */
@ApiTags('PhD Supervisor (GVHD)')
@ApiBearerAuth()
@Controller('phd/supervisors')
export class SupervisorController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  // ─── [S5-13] CRUD Lý lịch khoa học GVHD ─────────────────────────────────

  @Get()
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-13] Danh sách giảng viên hướng dẫn (có lọc theo học hàm, đơn vị, còn chỗ trống)' })
  @ApiResponse({ status: 200, description: 'Danh sách GVHD' })
  listSupervisors(@Query() query: QuerySupervisorsDto) {
    return this.send('phd.supervisor.list', query);
  }

  @Post()
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-13] Tạo mới hồ sơ GVHD (lý lịch khoa học)' })
  @ApiResponse({ status: 201, description: 'Tạo GVHD thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  createSupervisor(@CurrentUser() u: AuthUser, @Body() dto: CreateSupervisorDto) {
    return this.send('phd.supervisor.create', { actorId: u.id, dto });
  }

  @Get(':id')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-13] Chi tiết GVHD kèm tải hiện tại & danh sách NCS đang hướng dẫn' })
  @ApiParam({ name: 'id', description: 'ID giảng viên hướng dẫn' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết GVHD' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy GVHD (PHD_SUPERVISOR_NOT_FOUND)' })
  getSupervisor(@Param('id') id: string) {
    return this.send('phd.supervisor.get', { id });
  }

  @Patch(':id')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-13] Cập nhật thông tin lý lịch khoa học GVHD' })
  @ApiParam({ name: 'id', description: 'ID giảng viên hướng dẫn' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy GVHD (PHD_SUPERVISOR_NOT_FOUND)' })
  updateSupervisor(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSupervisorDto,
  ) {
    return this.send('phd.supervisor.update', { actorId: u.id, id, dto });
  }

  // ─── [S5-14] Tra cứu định mức (BR-09) ────────────────────────────────────

  @Get(':id/quota')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-14] Tra cứu tải & định mức GVHD (BR-09)',
    description:
      'Tải = (NCS HD Chính × 1.0) + (NCS Đồng HD × 0.5). Định mức: GS ≤ 7, PGS ≤ 5, TS ≤ 3.',
  })
  @ApiParam({ name: 'id', description: 'ID giảng viên hướng dẫn' })
  @ApiResponse({ status: 200, description: 'Thông tin tải và định mức' })
  getQuotaStatus(@Param('id') id: string) {
    return this.send('phd.supervisor.quota', { gvhdId: id });
  }

  // ─── [S5-15] Phân công GVHD ───────────────────────────────────────────────

  @Post('assign')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-15] Phân công GVHD cho NCS (Transaction Serializable + Pessimistic Lock)',
    description:
      'Sử dụng SELECT ... FOR UPDATE để khóa hàng GVHD, tính lại tải thực tế, rollback nếu vượt quota. Trả lỗi PHD_SUPERVISOR_QUOTA_EXCEEDED nếu vượt định mức.',
  })
  @ApiResponse({ status: 201, description: 'Phân công thành công' })
  @ApiResponse({ status: 400, description: 'Vượt định mức (PHD_SUPERVISOR_QUOTA_EXCEEDED)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy GVHD hoặc NCS' })
  assignSupervisor(@CurrentUser() u: AuthUser, @Body() dto: AssignSupervisorDto) {
    return this.send('phd.supervisor.assign', { actorId: u.id, dto });
  }

  @Post('change')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({
    summary: '[S5-15] Thay đổi GVHD (BR-04: DEACTIVATE phân công cũ, phân công mới)',
    description:
      'Vô hiệu hóa phân công cũ (DEACTIVATE) thay vì xóa, giảm tải GVHD cũ, kiểm tra quota GVHD mới trước khi tạo phân công mới. Toàn bộ trong transaction SERIALIZABLE.',
  })
  @ApiResponse({ status: 201, description: 'Thay đổi GVHD thành công' })
  @ApiResponse({ status: 400, description: 'GVHD mới vượt định mức (PHD_SUPERVISOR_QUOTA_EXCEEDED)' })
  changeSupervisor(@CurrentUser() u: AuthUser, @Body() dto: ChangeSupervisorDto) {
    return this.send('phd.supervisor.change', { actorId: u.id, dto });
  }

  @Get('assignments/list')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-16] Danh sách phân công hướng dẫn (có thể lọc theo NCS, GVHD, trạng thái)' })
  @ApiResponse({ status: 200, description: 'Danh sách phân công' })
  listAssignments(@Query() query: QueryAssignmentsDto) {
    return this.send('phd.supervisor.assignments', query);
  }
}
