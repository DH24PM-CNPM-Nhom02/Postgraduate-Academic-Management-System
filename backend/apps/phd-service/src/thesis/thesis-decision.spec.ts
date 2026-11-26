import { describe, expect, it, vi } from 'vitest';
import { ChangeRequestService } from '../change-request/change-request.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { NotificationClient } from '../notification/notification.client.js';
import { ThesisService } from './thesis.service.js';

function fixture() {
  const ncs = { id: 'ncs', trangThai: 'DANG_HOC' };
  const decision = { id: 'new', ncsId: ncs.id, loai: 'GIAO_DE_TAI', trangThai: 'HIEU_LUC', ngayQuyetDinh: new Date('2026-01-02') };
  const request = { id: 'request', ncsId: ncs.id, loai: 'DOI_DE_TAI', trangThai: 'CHO_DUYET', createdAt: new Date('2026-01-01') };
  const history: Array<{ quyetDinhId: string; tenDeTai: string; trangThai: string }> = [];
  const tx = {
    $queryRaw: vi.fn(),
    nghienCuuSinh: { findUnique: vi.fn().mockResolvedValue(ncs) },
    quyetDinh: { findUnique: vi.fn(async ({ where }) => ({ ...decision, id: where.id })) },
    deTai: {
      count: vi.fn(async ({ where }) => history.filter(t => t.quyetDinhId === where.quyetDinhId).length),
      findFirst: vi.fn(async () => history.find(t => t.trangThai === 'HIEU_LUC') ?? null),
      create: vi.fn(async ({ data }) => { history.push(data); return data; }),
      update: vi.fn(),
    },
    deNghiDieuChinh: { findFirst: vi.fn().mockResolvedValue(null), updateMany: vi.fn() },
    xacNhanGvhdDeNghi: { count: vi.fn().mockResolvedValue(0) },
    phanCongHuongDan: { findMany: vi.fn().mockResolvedValue([]) },
    auditLog: { create: vi.fn() },
  };
  const db = {
    $transaction: (work: (client: typeof tx) => Promise<unknown>) => work(tx),
    nghienCuuSinh: { findUnique: vi.fn().mockResolvedValue(null) },
    giangVienHuongDan: { findUnique: vi.fn().mockResolvedValue(null) },
    deNghiDieuChinh: { findUnique: vi.fn().mockResolvedValue(request) },
  } as unknown as PrismaService;
  const notifications = { gui: vi.fn() } as unknown as NotificationClient;
  const theses = new ThesisService(db, notifications);
  const requests = new ChangeRequestService(db, notifications, {} as never, {} as never);
  const assign = (id: string, title = 'Tên mới') =>
    theses.assign('staff', { ncsId: ncs.id, quyetDinhId: id, tenDeTai: title });
  const approve = (id: string) => requests.duyet('staff', request.id, { quyetDinhId: id });
  return { assign, approve, history, tx };
}

describe('Một quyết định giao đề tài chỉ được sử dụng một lần', () => {
  it.each(['HIEU_LUC', 'DA_HUY', 'DA_THAY_THE'])('chặn quyết định đã gắn với đề tài %s trong cả hai luồng', async trangThai => {
    const { assign, approve, history, tx } = fixture();
    history.push({ quyetDinhId: 'old', tenDeTai: 'Tên cũ', trangThai });
    for (const useDecision of [assign, approve]) {
      await expect(useDecision('old')).rejects.toMatchObject({ error: { statusCode: 409 } });
    }
    expect(tx.deTai.count).toHaveBeenCalledWith({ where: { quyetDinhId: 'old' } });
    expect(tx.deTai.create).not.toHaveBeenCalled();
    expect(tx.deTai.update).not.toHaveBeenCalled();
    expect(tx.deNghiDieuChinh.updateMany).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('sau khi hủy, giao lại cùng tên cũng cần quyết định mới', async () => {
    const { assign, history } = fixture();
    await assign('first', 'Tên ban đầu');
    history[0].trangThai = 'DA_HUY';
    await expect(assign('first', 'Tên ban đầu')).rejects.toMatchObject({ error: { statusCode: 409 } });
    await assign('second', 'Tên mới');
    expect(history.map(t => [t.quyetDinhId, t.tenDeTai])).toEqual([
      ['first', 'Tên ban đầu'], ['second', 'Tên mới'],
    ]);
  });
});
