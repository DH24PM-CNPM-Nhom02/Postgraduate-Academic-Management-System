import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import type { DocumentTypeValue } from '../../../lib/contracts/src/dto/document.dto.js';
import { lockDocument } from './helpers/document-link.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class PhdServiceController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern({ cmd: 'phd.document.is-ncs-decision' })
  async isNcsDecision(@Payload() { documentId, ncsId }: { documentId: string; ncsId: string }) {
    if (!documentId || !ncsId) return false;

    const decision = await this.prisma.quyetDinh.findFirst({
      where: {
        fileId: documentId,
        OR: [
          { deTais: { some: { ncsId } } },
          { phanCongs: { some: { ncsId } } },
          { deNghis: { some: { ncsId, trangThai: 'DA_DUYET' } } },
          {
            loai: 'CONG_NHAN_TOT_NGHIEP',
            totNghieps: { some: { ncsId, trangThai: 'DA_DUYET', ncs: { trangThai: 'DA_TOT_NGHIEP' } } },
          },
        ],
      },
      select: { id: true },
    });
    return decision !== null;
  }

  @MessagePattern({ cmd: 'phd.document.prepare-delete' })
  async prepareDocumentDeletion(
    @Payload() d: { documentId: string; documentType: DocumentTypeValue },
  ) {
    const fileId = d.documentId;
    return this.prisma.$transaction(async (tx) => {
      await lockDocument(tx, fileId);
      const counts = await Promise.all([
        tx.minhChungMoc.count({ where: { fileId } }),
        tx.phieuNhanXet.count({ where: { fileId } }),
        tx.quyetDinh.count({ where: { fileId } }),
        tx.deNghiDieuChinh.count({
          where: {
            fileId,
            ...(d.documentType === 'DON_TU' && {
              trangThai: { not: 'DA_HUY' as const },
            }),
          },
        }),
        tx.xetTotNghiep.count({ where: { ngoaiNguDocumentId: fileId } }),
        tx.xetTotNghiep.count({ where: { congNoDocumentId: fileId } }),
      ]);
      const usage = [
        'minh chứng mốc',
        'phiếu nhận xét',
        'quyết định',
        'đề nghị điều chỉnh',
        'minh chứng ngoại ngữ xét tốt nghiệp',
        'minh chứng công nợ xét tốt nghiệp',
      ].filter((_, index) => counts[index] > 0);
      if (!usage.length) {
        // Preserve the deletion intent if the document-service write needs to be retried.
        await tx.documentLinkGuard.update({
          where: { documentId: fileId },
          data: { deleting: true },
        });
      }
      return usage;
    });
  }

  @MessagePattern({ cmd: 'ping' })
  @MessagePattern('ping')
  ping() {
    return 'pong';
  }
}
