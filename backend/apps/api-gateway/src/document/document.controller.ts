import {
  BadRequestException, Body, Controller, Delete, Get, Inject, ParseUUIDPipe, Param,
  Post, StreamableFile, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { DOCUMENT_SERVICE, PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { PERMISSIONS, ROLES } from '../../../../lib/contracts/src/permissions.js';
import { MAX_PDF_SIZE, UploadDocumentDto } from '../../../../lib/contracts/src/dto/document.dto.js';
import type { NguoiDungTaiLieu } from '../../../../lib/contracts/src/dto/document.dto.js';

@Controller('documents')
export class DocumentsController {
  constructor(
    @Inject(DOCUMENT_SERVICE) private readonly documentClient: ClientProxy,
    @Inject(PHD_SERVICE) private readonly phdClient: ClientProxy,
  ) { }

  // Gọi document-service và chờ kết quả
  private goiDocument(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.documentClient.send({ cmd }, payload).pipe(timeout(ms)));
  }

  // Xác định người gọi là nhân viên (Giáo vụ, Admin) hay NCS.
  // NCS thì hỏi thêm phd-service để biết id hồ sơ NCS của họ (lấy theo token, không tin client).
  private async layNguoiDung(u: AuthUser): Promise<NguoiDungTaiLieu> {
    const laNhanVien = u.roles.includes(ROLES.ADMIN) || u.roles.includes(ROLES.GIAO_VU);
    if (laNhanVien) {
      return { id: u.id, laNhanVien: true };
    }

    let ncsId: string | undefined = undefined;
    try {
      const hoSo = await firstValueFrom(
        this.phdClient.send<{ id: string }>({ cmd: 'phd.ncs.get' }, { userId: u.id }).pipe(timeout(5000)),
      );
      ncsId = hoSo.id;
    } catch (error: any) {
      // 404 nghĩa là tài khoản này chưa có hồ sơ NCS, ncsId để trống. Lỗi khác thì báo lỗi
      if (error?.statusCode !== 404) throw error;
    }
    return { id: u.id, laNhanVien: false, ncsId };
  }

  // Tải lên một file PDF. Gửi dạng form-data: file (bắt buộc), documentType, và các trường còn lại
  @Post('upload')
  @RequirePermissions(PERMISSIONS.DOCUMENT_UPLOAD)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE } }))
  async upload(
    @CurrentUser() u: AuthUser,
    @Body() body: UploadDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Chưa chọn file');
    if (!file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Chỉ nhận file PDF');
    }

    const nguoiDung = await this.layNguoiDung(u);

    // Multer đọc tên file theo latin1 nên tên tiếng Việt bị hỏng, đổi lại thành UTF-8
    const tenFile = Buffer.from(file.originalname, 'latin1').toString('utf8');

    return this.goiDocument(
      'document.upload',
      {
        nguoiDung,
        documentType: body.documentType,
        ncsId: body.ncsId,
        refType: body.refType,
        refId: body.refId,
        tenFile,
        noiDungBase64: file.buffer.toString('base64'),
      },
      60000,
    );
  }

  // Xem thông tin của tài liệu
  @Get(':id')
  @RequirePermissions(PERMISSIONS.DOCUMENT_READ)
  async layThongTin(@CurrentUser() u: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    const nguoiDung = await this.layNguoiDung(u);
    return this.goiDocument('document.get', { nguoiDung, id });
  }

  // Tải file PDF về (trình duyệt sẽ mở xem trực tiếp)
  @Get(':id/download')
  @RequirePermissions(PERMISSIONS.DOCUMENT_READ)
  async taiVe(@CurrentUser() u: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    const nguoiDung = await this.layNguoiDung(u);
    const tep = await this.goiDocument('document.download', { nguoiDung, id }, 60000);

    // Tên file tiếng Việt phải mã hóa mới đặt được vào header
    return new StreamableFile(Buffer.from(tep.noiDungBase64, 'base64'), {
      type: tep.mimeType,
      disposition: `inline; filename*=UTF-8''${encodeURIComponent(tep.originalName)}`,
    });
  }

  // Xóa mềm tài liệu (chỉ Giáo vụ, Admin)
  @Delete(':id')
  @RequirePermissions(PERMISSIONS.DOCUMENT_DELETE)
  async xoa(@CurrentUser() u: AuthUser, @Param('id', new ParseUUIDPipe()) id: string) {
    const nguoiDung = await this.layNguoiDung(u);
    return this.goiDocument('document.delete', { nguoiDung, id });
  }
}