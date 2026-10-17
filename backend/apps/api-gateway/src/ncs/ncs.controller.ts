import { BadRequestException, Body, Controller, Get, Header, Inject, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { CreateNcsBatchDto } from '../../../../lib/contracts/src/dto/ncs.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';
import { buildNcsTemplate, parseNcsExcel } from './ncs-excel.js';

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
@Controller('ncs')
export class NcsController {
  constructor(@Inject(PHD_SERVICE) private phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 5000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  //check xem có file không
  private requireFile(file?: Express.Multer.File): Buffer {
    if (!file) throw new BadRequestException('Chưa chọn file');
    return file.buffer;
  }

  // Nhập hồ sơ hàng loạt (tối đa 200 dòng), timeout dài hơn vì ghi nhiều dòng (KHÔNG DÙNG NỮA)
  // @Post('batch')
  // @RequirePermissions(PERMISSIONS.NCS_CREATE)
  // createMany(@CurrentUser() u: AuthUser, @Body() dto: CreateNcsBatchDto) {
  //   return this.send('phd.ncs.create-many', { actorId: u.id, items: dto.items }, 20000);
  // }

  //tải file excel theo template 
  @Get('import/template')
  @RequirePermissions(PERMISSIONS.NCS_CREATE)
  @Header('Content-Type', XLSX_MIME)
  @Header('Content-Disposition', 'attachment; filename="mau-import-ncs.xlsx"')
  async template() {
    return new StreamableFile(await buildNcsTemplate());
  }

  // Flow  1: xem trước, chưa ghi gì
  @Post('import/preview')
  @RequirePermissions(PERMISSIONS.NCS_CREATE)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async importPreview(@UploadedFile() file?: Express.Multer.File) {
    const rows = await parseNcsExcel(this.requireFile(file));
    return this.send('phd.ncs.import-preview', { rows }, 20000);
  }

  // Flow  2: upload lại file đó để tạo thật (server kiểm tra lại từ đầu)
  @Post('import/confirm')
  @RequirePermissions(PERMISSIONS.NCS_CREATE)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async importConfirm(@CurrentUser() u: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    const rows = await parseNcsExcel(this.requireFile(file));
    return this.send('phd.ncs.import-confirm', { actorId: u.id, rows }, 60000);
  }


  // List NCS (có thể có filter, phân trang sau) vì FE sử dụng tanstack table nên khỏi pagi và fil 
  @Get()
  @RequirePermissions(PERMISSIONS.NCS_READ)
  list() {
    return this.send('phd.ncs.list', {});
  }

  @Get('me')
  me(@CurrentUser() u: AuthUser) {
    return this.send('phd.ncs.get', { userId: u.id });
  }

  // Chi tiết một NCS (Giáo vụ xem)
  @Get(':id')
  @RequirePermissions(PERMISSIONS.NCS_READ)
  detail(@Param('id') id: string) {
    return this.send('phd.ncs.get', { id });
  }
}