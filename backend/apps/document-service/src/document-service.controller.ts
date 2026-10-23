import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { DocumentTypeValue, NguoiDungTaiLieu } from '../../../lib/contracts/src/dto/document.dto.js';
import { DocumentServiceService } from './document-service.service.js';

@Controller()
export class DocumentServiceController {
  constructor(private readonly documentService: DocumentServiceService) { }

  @MessagePattern({ cmd: 'document.upload' })
  upload(
    @Payload()
    d: {
      nguoiDung: NguoiDungTaiLieu;
      documentType: DocumentTypeValue;
      ncsId?: string;
      refType?: string;
      refId?: string;
      tenFile: string;
      noiDungBase64: string;
    },
  ) {
    return this.documentService.upload(d);
  }

  @MessagePattern({ cmd: 'document.get' })
  get(@Payload() d: { nguoiDung: NguoiDungTaiLieu; id: string }) {
    return this.documentService.layThongTin(d.nguoiDung, d.id);
  }

  @MessagePattern({ cmd: 'document.download' })
  download(@Payload() d: { nguoiDung: NguoiDungTaiLieu; id: string }) {
    return this.documentService.taiVe(d.nguoiDung, d.id);
  }

  @MessagePattern({ cmd: 'document.delete' })
  delete(@Payload() d: { nguoiDung: NguoiDungTaiLieu; id: string }) {
    return this.documentService.xoa(d.nguoiDung, d.id);
  }
}