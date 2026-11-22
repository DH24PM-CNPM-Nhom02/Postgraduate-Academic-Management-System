import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from './prisma/prisma.service.js';
import { PhdServiceController } from './phd-service.controller.js';
import { guardDocumentAttachment } from './helpers/document-link.js';

function fixture() {
  const unused = () => ({ count: vi.fn().mockResolvedValue(0) });
  const tx = {
    $executeRaw: vi.fn(),
    minhChungMoc: unused(),
    phieuNhanXet: unused(),
    quyetDinh: unused(),
    deNghiDieuChinh: unused(),
    xetTotNghiep: unused(),
    documentLinkGuard: { update: vi.fn(), findUniqueOrThrow: vi.fn() },
  };
  const prisma = { $transaction: (run: (db: typeof tx) => unknown) => run(tx) };
  return {
    tx,
    controller: new PhdServiceController(prisma as unknown as PrismaService),
  };
}

describe('Kiểm tra trước khi xóa tài liệu', () => {
  it('kiểm tra mọi liên kết, kể cả phiếu xóa mềm và quyết định hết hiệu lực', async () => {
    const { tx, controller } = fixture();
    for (const model of [
      tx.minhChungMoc,
      tx.phieuNhanXet,
      tx.quyetDinh,
      tx.deNghiDieuChinh,
      tx.xetTotNghiep,
    ]) {
      model.count.mockResolvedValue(1);
    }
    const usage = await controller.prepareDocumentDeletion({
      documentId: 'doc',
      documentType: 'KHAC',
    });
    expect(usage).toHaveLength(6);
    for (const model of [
      tx.minhChungMoc,
      tx.phieuNhanXet,
      tx.quyetDinh,
      tx.deNghiDieuChinh,
    ]) {
      expect(model.count).toHaveBeenCalledWith({ where: { fileId: 'doc' } });
    }
    expect(tx.xetTotNghiep.count).toHaveBeenCalledWith({
      where: { ngoaiNguDocumentId: 'doc' },
    });
    expect(tx.xetTotNghiep.count).toHaveBeenCalledWith({
      where: { congNoDocumentId: 'doc' },
    });
    expect(tx.documentLinkGuard.update).not.toHaveBeenCalled();
  });

  it('loại đề nghị đã hủy khi xét đơn từ và giữ khóa xóa nếu file trống liên kết', async () => {
    const { tx, controller } = fixture();
    expect(
      await controller.prepareDocumentDeletion({
        documentId: 'doc',
        documentType: 'DON_TU',
      }),
    ).toEqual([]);
    expect(tx.deNghiDieuChinh.count).toHaveBeenCalledWith({
      where: { fileId: 'doc', trangThai: { not: 'DA_HUY' } },
    });
    expect(tx.documentLinkGuard.update).toHaveBeenCalledWith({
      where: { documentId: 'doc' },
      data: { deleting: true },
    });
  });

  it('từ chối gắn tài liệu đã được giữ khóa xóa', async () => {
    const { tx } = fixture();
    tx.documentLinkGuard.findUniqueOrThrow.mockResolvedValue({
      deleting: true,
    });
    await expect(
      guardDocumentAttachment(tx as unknown as PrismaService, 'doc'),
    ).rejects.toThrow('yêu cầu xóa');
  });
});
