import { BadRequestException, Body, Controller, Get, Header, Inject, Param, Patch, Post, Query, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { CreateGvhdBatchDto, UpdateGvhdDto, UpdateGvhdStatusDto } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
import { CreateAssignmentDto, DeactivateAssignmentDto, ListAssignmentQueryDto } from '../../../../lib/contracts/src/dto/assignment.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';
import { buildGvhdTemplate, parseGvhdExcel } from './gvhd-excel.js';

//header content type
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Chỉ nhận .xlsx, tối đa 2MB (quá thì multer tự trả 413: Request Entity Too Large)
const uploadOptions = {
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req: unknown, file: Express.Multer.File, cb: (e: Error | null, ok: boolean) => void) =>
    file.originalname.toLowerCase().endsWith('.xlsx')
      ? cb(null, true)
      : cb(new BadRequestException('Chỉ nhận file .xlsx'), false),
};

@Controller('gvhd')
export class GvhdController {
  constructor(@Inject(PHD_SERVICE) private phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 5000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  //check xem có file không
  private requireFile(file?: Express.Multer.File): Buffer {
    if (!file) throw new BadRequestException('Chưa chọn file');
    return file.buffer;
  }

  // Nhập hồ sơ giảng viên hàng loạt (tối đa 200 dòng), timeout dài hơn vì ghi nhiều dòng
  @Post('batch')
  @RequirePermissions(PERMISSIONS.GVHD_CREATE)
  createMany(@CurrentUser() u: AuthUser, @Body() dto: CreateGvhdBatchDto) {
    return this.send('phd.gvhd.create-many', { actorId: u.id, items: dto.items }, 30000);
  }

  //tải file excel theo template
  @Get('import/template')
  @RequirePermissions(PERMISSIONS.GVHD_CREATE)
  @Header('Content-Type', XLSX_MIME)
  @Header('Content-Disposition', 'attachment; filename="mau-import-gvhd.xlsx"')
  async template() {
    return new StreamableFile(await buildGvhdTemplate());
  }

  // Flow  1: xem trước, chưa ghi gì
  @Post('import/preview')
  @RequirePermissions(PERMISSIONS.GVHD_CREATE)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async importPreview(@UploadedFile() file?: Express.Multer.File) {
    const rows = await parseGvhdExcel(this.requireFile(file));
    return this.send('phd.gvhd.import-preview', { rows }, 20000);
  }

  // Flow  2: upload lại file đó để tạo thật (server kiểm tra lại từ đầu)
  @Post('import/confirm')
  @RequirePermissions(PERMISSIONS.GVHD_CREATE)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async importConfirm(@CurrentUser() u: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    const rows = await parseGvhdExcel(this.requireFile(file));
    return this.send('phd.gvhd.import-confirm', { actorId: u.id, rows }, 60000);
  }

  @Get()
  @RequirePermissions(PERMISSIONS.GVHD_READ)
  list() {
    return this.send('phd.gvhd.list', {});
  }

  @Get('me')
  me(@CurrentUser() u: AuthUser) {
    return this.send('phd.gvhd.get', { userId: u.id });
  }

  @Get('me/ncs')
  myNcsList(@CurrentUser() u: AuthUser) {
    return this.send('phd.gvhd.my-ncs', { userId: u.id });
  }

  @Get('me/ncs/:ncsId')
  myNcsDetail(@CurrentUser() u: AuthUser, @Param('ncsId') ncsId: string) {
    return this.send('phd.gvhd.my-ncs-detail', { userId: u.id, ncsId });
  }

  @Post('assignments')
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_CREATE)
  createAssignment(@CurrentUser() u: AuthUser, @Body() dto: CreateAssignmentDto) {
    return this.send('phd.gvhd.assignment-create', { actorId: u.id, data: dto });
  }

  @Patch('assignments/:id/deactivate')
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_UPDATE)
  deactivateAssignment(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: DeactivateAssignmentDto,
  ) {
    return this.send('phd.gvhd.assignment-deactivate', { actorId: u.id, id, data: dto });
  }

  @Get('assignments')
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_READ)
  listAssignments(@Query() query: ListAssignmentQueryDto) {
    return this.send('phd.gvhd.assignment-list', { query });
  }

  // Chi tiết một GVHD (Giáo vụ xem)
  @Get(':id')
  @RequirePermissions(PERMISSIONS.GVHD_READ)
  detail(@Param('id') id: string) {
    return this.send('phd.gvhd.get', { id });
  }

  @Patch(':id/status')
  @RequirePermissions(PERMISSIONS.GVHD_UPDATE)
  updateStatus(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateGvhdStatusDto,
  ) {
    return this.send('phd.gvhd.update-status', { actorId: u.id, id, data: dto });
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.GVHD_UPDATE)
  update(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateGvhdDto,
  ) {
    return this.send('phd.gvhd.update', { actorId: u.id, id, data: dto });
  }
}
