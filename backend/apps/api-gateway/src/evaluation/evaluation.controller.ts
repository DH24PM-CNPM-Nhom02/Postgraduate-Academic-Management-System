import {
  Body,
  Controller,
  Delete,
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
  ApproveEvaluationDto,
  AssignEvaluatorsDto,
  CreateEvaluationFormDto,
  CreateEvaluationSessionDto,
  QueryEvaluationSessionsDto,
  UpdateEvaluationFormDto,
} from '../../../../lib/contracts/src/dto/evaluation.dto.js';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';

@ApiTags('PhD Evaluation')
@ApiBearerAuth()
@Controller('phd/evaluations')
export class EvaluationController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Get()
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách các đợt chấm điểm (evaluation sessions)' })
  @ApiResponse({ status: 200, description: 'Danh sách các đợt chấm điểm' })
  listSessions(@Query() query: QueryEvaluationSessionsDto) {
    return this.send('phd.evaluation.list', query);
  }

  @Post()
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-02] Khởi tạo đợt chấm điểm mới' })
  @ApiResponse({ status: 201, description: 'Khởi tạo đợt chấm thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc mốc chưa mở' })
  createSession(@CurrentUser() u: AuthUser, @Body() dto: CreateEvaluationSessionDto) {
    return this.send('phd.evaluation.create-session', { actorId: u.id, dto });
  }

  @Get(':id')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-02] Lấy chi tiết đợt chấm điểm và các phiếu nhận xét' })
  @ApiParam({ name: 'id', description: 'ID của đợt chấm (MinhChungMoc ID)' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết đợt chấm' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đợt chấm' })
  getSession(@Param('id') id: string) {
    return this.send('phd.evaluation.get', { id });
  }

  @Post(':id/assign')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-02] Phân công người chấm trong hội đồng / tiểu ban' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiResponse({ status: 200, description: 'Phân công hội đồng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đợt chấm' })
  assignEvaluators(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: AssignEvaluatorsDto,
  ) {
    return this.send('phd.evaluation.assign', { actorId: u.id, sessionId: id, dto });
  }

  @Post(':id/forms')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-03, S5-04] Lập phiếu nhận xét online (hỗ trợ lưu nháp và nộp chính thức)' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiResponse({ status: 201, description: 'Lưu phiếu nhận xét thành công' })
  @ApiResponse({ status: 400, description: 'Điểm không hợp lệ (PHD_EVALUATION_SCORE_INVALID)' })
  createForm(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateEvaluationFormDto,
  ) {
    return this.send('phd.evaluation.create-form', { actorId: u.id, sessionId: id, dto });
  }

  @Patch(':id/forms/:formId')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-03, S5-04] Chỉnh sửa phiếu nhận xét nháp' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiParam({ name: 'formId', description: 'ID phiếu nhận xét' })
  @ApiResponse({ status: 200, description: 'Cập nhật phiếu thành công' })
  @ApiResponse({ status: 400, description: 'Phiếu đã submit không thể sửa (PHD_EVALUATION_FORM_ALREADY_SUBMITTED)' })
  updateForm(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Param('formId') formId: string,
    @Body() dto: UpdateEvaluationFormDto,
  ) {
    return this.send('phd.evaluation.update-form', {
      actorId: u.id,
      sessionId: id,
      formId,
      dto,
    });
  }

  @Post(':id/forms/:formId/submit')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-03] Nộp chính thức phiếu nhận xét (chuyển từ nháp sang submitted)' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiParam({ name: 'formId', description: 'ID phiếu nhận xét' })
  @ApiResponse({ status: 200, description: 'Nộp phiếu nhận xét thành công' })
  submitForm(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Param('formId') formId: string,
  ) {
    return this.send('phd.evaluation.submit-form', {
      actorId: u.id,
      sessionId: id,
      formId,
    });
  }

  @Delete(':id/forms/:formId')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-03] Xóa phiếu nhận xét nháp (KHÔNG cho phép xóa phiếu đã nộp)' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiParam({ name: 'formId', description: 'ID phiếu nhận xét' })
  @ApiResponse({ status: 200, description: 'Xóa phiếu nháp thành công' })
  @ApiResponse({ status: 400, description: 'Chặn xóa phiếu đã submit (PHD_EVALUATION_CANNOT_DELETE_SUBMITTED)' })
  deleteForm(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Param('formId') formId: string,
  ) {
    return this.send('phd.evaluation.delete-form', {
      actorId: u.id,
      sessionId: id,
      formId,
    });
  }

  @Get(':id/summary')
  @Roles(ROLES.GIAO_VU, ROLES.GVHD, ROLES.NCS, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-05] Xem tổng hợp điểm: Điểm trung bình, chênh lệch Max-Min và cảnh báo' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiResponse({ status: 200, description: 'Thông tin tổng hợp điểm' })
  getSummary(@Param('id') id: string) {
    return this.send('phd.evaluation.summary', { sessionId: id });
  }

  @Post(':id/approve')
  @Roles(ROLES.GIAO_VU, ROLES.ADMIN)
  @ApiOperation({ summary: '[S5-05, S5-06] Phê duyệt kết quả đợt chấm & tự động cập nhật mốc tiến trình' })
  @ApiParam({ name: 'id', description: 'ID đợt chấm điểm' })
  @ApiResponse({ status: 200, description: 'Phê duyệt thành công, chuyển mốc PASSED/REJECTED' })
  @ApiResponse({ status: 400, description: 'Chênh lệch > 3.0 (PHD_SCORE_DIFFERENCE_EXCEEDED) hoặc chưa nộp đủ phiếu' })
  approveSession(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: ApproveEvaluationDto,
  ) {
    return this.send('phd.evaluation.approve', {
      actorId: u.id,
      sessionId: id,
      dto,
    });
  }
}
