import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ThesisService } from './thesis.service.js';
import {
  PhdThesisActiveExistsException,
  PhdThesisNotFoundException,
  PhdThesisStudentNotFoundException,
} from './supervisor.exceptions.js';

describe('ThesisService Unit Tests', () => {
  let service: ThesisService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      nghienCuuSinh: {
        findUnique: vi.fn(),
      },
      deTai: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      quyetDinh: {
        create: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
    };

    service = new ThesisService(mockPrisma);
  });

  describe('createThesis', () => {
    it('ném PhdThesisStudentNotFoundException khi NCS không tồn tại', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null);

      await expect(
        service.createThesis('user-1', {
          ncsId: 'invalid-ncs',
          tenDeTai: 'Đề tài Test',
          soQuyetDinh: 'QD/01',
          ngayQuyetDinh: '2026-01-01',
        }),
      ).rejects.toBeInstanceOf(PhdThesisStudentNotFoundException);
    });

    it('ném PhdThesisActiveExistsException khi NCS đã có đề tài hiệu lực', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });
      mockPrisma.deTai.findFirst.mockResolvedValue({ id: 'dt-existing', trangThai: 'HIEU_LUC' });

      await expect(
        service.createThesis('user-1', {
          ncsId: 'ncs-1',
          tenDeTai: 'Đề tài mới',
          soQuyetDinh: 'QD/02',
          ngayQuyetDinh: '2026-01-01',
        }),
      ).rejects.toBeInstanceOf(PhdThesisActiveExistsException);
    });

    it('tạo đề tài và quyết định thành công khi hợp lệ', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });
      mockPrisma.deTai.findFirst.mockResolvedValue(null);
      mockPrisma.quyetDinh.create.mockResolvedValue({ id: 'qd-1', soQuyetDinh: 'QD/01' });
      mockPrisma.deTai.create.mockResolvedValue({ id: 'dt-1', tenDeTai: 'Đề tài AI', trangThai: 'HIEU_LUC' });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'audit-1' });

      const result = await service.createThesis('user-admin', {
        ncsId: 'ncs-1',
        tenDeTai: 'Đề tài AI',
        soQuyetDinh: 'QD/01',
        ngayQuyetDinh: '2026-01-01',
      });

      expect(result.deTai.id).toBe('dt-1');
      expect(result.quyetDinh.id).toBe('qd-1');
      expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('updateThesis (BR-04)', () => {
    it('ném PhdThesisNotFoundException khi đề tài không tồn tại', async () => {
      mockPrisma.deTai.findUnique.mockResolvedValue(null);

      await expect(
        service.updateThesis('user-1', 'invalid-dt', {
          tenDeTaiMoi: 'Đề tài mới',
          lyDo: 'Lý do đổi',
          soQuyetDinh: 'QD/03',
          ngayQuyetDinh: '2026-02-01',
        }),
      ).rejects.toBeInstanceOf(PhdThesisNotFoundException);
    });

    it('bảo toàn lịch sử: đổi đề tài cũ sang DA_THAY_THE và tạo đề tài mới (không hard delete)', async () => {
      mockPrisma.deTai.findUnique.mockResolvedValue({
        id: 'dt-old',
        ncsId: 'ncs-1',
        tenDeTai: 'Tên đề tài cũ',
        trangThai: 'HIEU_LUC',
      });
      mockPrisma.quyetDinh.create.mockResolvedValue({ id: 'qd-new', soQuyetDinh: 'QD/03' });
      mockPrisma.deTai.create.mockResolvedValue({
        id: 'dt-new',
        tenDeTai: 'Tên đề tài mới',
        trangThai: 'HIEU_LUC',
      });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'audit-new' });

      const res = await service.updateThesis('user-admin', 'dt-old', {
        tenDeTaiMoi: 'Tên đề tài mới',
        lyDo: 'Cập nhật phạm vi nghiên cứu',
        soQuyetDinh: 'QD/03',
        ngayQuyetDinh: '2026-02-01',
      });

      expect(res.replacedId).toBe('dt-old');
      expect(res.newDeTai.id).toBe('dt-new');
      expect(mockPrisma.deTai.update).toHaveBeenCalledWith({
        where: { id: 'dt-old' },
        data: { trangThai: 'DA_THAY_THE' },
      });
    });
  });

  describe('getThesis, getCurrentThesisByNcs & getThesisHistory', () => {
    it('lấy chi tiết đề tài hoặc ném nếu không tìm thấy', async () => {
      mockPrisma.deTai.findUnique.mockResolvedValue({ id: 'dt-1', tenDeTai: 'Đề tài X' });
      const found = await service.getThesis('dt-1');
      expect(found.id).toBe('dt-1');

      mockPrisma.deTai.findUnique.mockResolvedValue(null);
      await expect(service.getThesis('dt-missing')).rejects.toBeInstanceOf(PhdThesisNotFoundException);
    });

    it('lấy đề tài hiện tại theo NCS', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1', mshv: '202601', hoTen: 'NCS A' });
      mockPrisma.deTai.findFirst.mockResolvedValue({ id: 'dt-1', tenDeTai: 'Đề tài hiện tại' });

      const result = await service.getCurrentThesisByNcs('ncs-1');
      expect(result.deTaiHienTai?.id).toBe('dt-1');
    });

    it('lấy lịch sử đề tài của NCS', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });
      mockPrisma.deTai.findMany.mockResolvedValue([
        { id: 'dt-2', trangThai: 'HIEU_LUC' },
        { id: 'dt-1', trangThai: 'DA_THAY_THE' },
      ]);

      const history = await service.getThesisHistory('ncs-1');
      expect(history.length).toBe(2);
    });
  });
});
