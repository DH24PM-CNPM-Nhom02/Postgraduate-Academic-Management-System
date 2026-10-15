import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChangeRequestService } from './change-request.service.js';
import {
  PhdChangeRequestAlreadyProcessedException,
  PhdChangeRequestAssignmentNotFoundException,
  PhdChangeRequestInvalidDataException,
  PhdChangeRequestNotFoundException,
  PhdChangeRequestRejectReasonRequiredException,
  PhdChangeRequestStudentNotFoundException,
} from './change-request.exceptions.js';
import { PhdSupervisorQuotaExceededException } from '../supervisor/supervisor.exceptions.js';

describe('ChangeRequestService Unit Tests (Sprint 5 - Cụm 3)', () => {
  let service: ChangeRequestService;
  let mockPrisma: any;
  let mockNotificationClient: any;

  beforeEach(() => {
    mockPrisma = {
      nghienCuuSinh: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      phanCongHuongDan: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      giangVienHuongDan: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      deTai: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      quyetDinh: {
        create: vi.fn(),
      },
      deNghiDieuChinh: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $queryRaw: vi.fn(),
      $transaction: vi.fn(async (cb: any) => cb(mockPrisma)),
    };

    mockNotificationClient = {
      emit: vi.fn(),
    };

    service = new ChangeRequestService(mockPrisma, mockNotificationClient);
  });

  // ─── [S5-20] Nộp đơn đề nghị thay đổi ─────────────────────────────────────

  describe('submitChangeRequest', () => {
    it('ném PhdChangeRequestStudentNotFoundException khi NCS không tồn tại', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null);

      await expect(
        service.submitChangeRequest('user-1', {
          ncsId: 'invalid-ncs',
          loai: 'DOI_DE_TAI' as any,
          lyDo: 'Lý do đổi',
          tenDeTaiMoi: 'Đề tài mới',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestStudentNotFoundException);
    });

    it('ném PhdChangeRequestInvalidDataException khi DOI_DE_TAI thiếu tenDeTaiMoi', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });

      await expect(
        service.submitChangeRequest('user-1', {
          ncsId: 'ncs-1',
          loai: 'DOI_DE_TAI' as any,
          lyDo: 'Lý do đổi',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestInvalidDataException);
    });

    it('ném PhdChangeRequestInvalidDataException khi DOI_GVHD thiếu gvhdMoiId hoặc phanCongCuId', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });

      await expect(
        service.submitChangeRequest('user-1', {
          ncsId: 'ncs-1',
          loai: 'DOI_GVHD' as any,
          lyDo: 'Lý do đổi GVHD',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestInvalidDataException);
    });

    it('ném PhdChangeRequestAssignmentNotFoundException khi phân công cũ không thuộc NCS', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });
      mockPrisma.phanCongHuongDan.findUnique.mockResolvedValue({
        id: 'pc-1',
        ncsId: 'other-ncs',
        trangThai: 'DANG_HIEU_LUC',
      });

      await expect(
        service.submitChangeRequest('user-1', {
          ncsId: 'ncs-1',
          loai: 'DOI_GVHD' as any,
          lyDo: 'Lý do đổi GVHD',
          phanCongCuId: 'pc-1',
          gvhdMoiId: 'gv-new',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestAssignmentNotFoundException);
    });

    it('tạo đơn đề nghị thành công ở trạng thái CHO_DUYET', async () => {
      mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-1' });
      mockPrisma.deNghiDieuChinh.create.mockResolvedValue({
        id: 'cr-1',
        ncsId: 'ncs-1',
        loai: 'DOI_DE_TAI',
        trangThai: 'CHO_DUYET',
      });

      const res = await service.submitChangeRequest('user-ncs', {
        ncsId: 'ncs-1',
        loai: 'DOI_DE_TAI' as any,
        lyDo: 'Mở rộng hướng nghiên cứu',
        tenDeTaiMoi: 'Nghiên cứu ứng dụng Deep Learning trong xử lý ảnh y tế',
      });

      expect(res.id).toBe('cr-1');
      expect(mockPrisma.deNghiDieuChinh.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            trangThai: 'CHO_DUYET',
            tenDeTaiMoi: 'Nghiên cứu ứng dụng Deep Learning trong xử lý ảnh y tế',
          }),
        }),
      );
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'CHANGE_REQUEST_SUBMIT' }),
        }),
      );
    });
  });

  // ─── [S5-20] Phê duyệt đơn đề nghị & Transaction ──────────────────────────

  describe('approveChangeRequest', () => {
    it('ném PhdChangeRequestNotFoundException khi đơn không tồn tại', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue(null);

      await expect(
        service.approveChangeRequest('user-gv', 'invalid-cr', {
          soQuyetDinh: 'QD/01',
          ngayQuyetDinh: '2026-10-15',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestNotFoundException);
    });

    it('ném PhdChangeRequestAlreadyProcessedException khi đơn đã duyệt hoặc từ chối', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
        id: 'cr-done',
        trangThai: 'DA_DUYET',
      });

      await expect(
        service.approveChangeRequest('user-gv', 'cr-done', {
          soQuyetDinh: 'QD/01',
          ngayQuyetDinh: '2026-10-15',
        }),
      ).rejects.toBeInstanceOf(PhdChangeRequestAlreadyProcessedException);
    });

    it('duyệt DOI_DE_TAI (BR-04): đổi đề tài cũ sang DA_THAY_THE và phát Event TCP', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
        id: 'cr-de-tai',
        ncsId: 'ncs-1',
        loai: 'DOI_DE_TAI',
        tenDeTaiMoi: 'Tên đề tài AI mới',
        trangThai: 'CHO_DUYET',
      });

      mockPrisma.deTai.findFirst.mockResolvedValue({
        id: 'dt-old',
        ncsId: 'ncs-1',
        tenDeTai: 'Tên cũ',
        trangThai: 'HIEU_LUC',
      });
      mockPrisma.quyetDinh.create.mockResolvedValue({ id: 'qd-dt-1', soQuyetDinh: 'QD/01' });
      mockPrisma.deTai.create.mockResolvedValue({ id: 'dt-new', tenDeTai: 'Tên đề tài AI mới' });
      mockPrisma.deNghiDieuChinh.update.mockResolvedValue({ id: 'cr-de-tai', trangThai: 'DA_DUYET' });

      const res = await service.approveChangeRequest(
        'user-gv',
        'cr-de-tai',
        { soQuyetDinh: 'QD/01', ngayQuyetDinh: '2026-10-15' },
        'corr-123',
      );

      expect(res.updatedRequest.trangThai).toBe('DA_DUYET');

      // BR-04: Đề tài cũ cập nhật DA_THAY_THE
      expect(mockPrisma.deTai.update).toHaveBeenCalledWith({
        where: { id: 'dt-old' },
        data: { trangThai: 'DA_THAY_THE' },
      });

      // Tạo đề tài mới với quyết định GIAO_DE_TAI
      expect(mockPrisma.deTai.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ncsId: 'ncs-1',
            tenDeTai: 'Tên đề tài AI mới',
            trangThai: 'HIEU_LUC',
            quyetDinhId: 'qd-dt-1',
          }),
        }),
      );

      // [S5-22] Bắn TCP Event phd.change_request.approved
      expect(mockNotificationClient.emit).toHaveBeenCalledWith(
        'phd.change_request.approved',
        expect.objectContaining({
          eventType: 'phd.change_request.approved',
          ncsId: 'ncs-1',
          correlationId: 'corr-123',
          data: expect.objectContaining({
            changeRequestId: 'cr-de-tai',
            loai: 'DOI_DE_TAI',
            soQuyetDinh: 'QD/01',
          }),
        }),
      );
    });

    it('duyệt DOI_GVHD (BR-04, BR-09): ném PhdSupervisorQuotaExceededException nếu GVHD mới hết chỗ', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
        id: 'cr-gvhd',
        ncsId: 'ncs-1',
        loai: 'DOI_GVHD',
        phanCongCuId: 'pc-old',
        gvhdMoiId: 'gv-ts-full',
        trangThai: 'CHO_DUYET',
        phanCongCu: { id: 'pc-old', gvhdId: 'gv-old', vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      });

      // GVHD mới: TS (max = 3.0), đã đủ 3.0
      mockPrisma.$queryRaw.mockResolvedValue([
        { id: 'gv-ts-full', ho_ten: 'TS. Full Quota', hoc_ham_hoc_vi: 'TIEN_SI', max_ncs_cho_phep: 3 },
      ]);
      mockPrisma.phanCongHuongDan.findMany.mockResolvedValue([
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      ]);

      await expect(
        service.approveChangeRequest('user-gv', 'cr-gvhd', {
          soQuyetDinh: 'QD/02',
          ngayQuyetDinh: '2026-10-15',
        }),
      ).rejects.toBeInstanceOf(PhdSupervisorQuotaExceededException);
    });

    it('duyệt DOI_GVHD (BR-04, BR-09): chuyển phân công cũ sang DEACTIVATE và tạo phân công mới', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
        id: 'cr-gvhd-ok',
        ncsId: 'ncs-1',
        loai: 'DOI_GVHD',
        phanCongCuId: 'pc-old',
        gvhdMoiId: 'gv-gs-avail',
        trangThai: 'CHO_DUYET',
        phanCongCu: { id: 'pc-old', gvhdId: 'gv-old', vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      });

      // GVHD mới: GS (max = 7.0), hiện có 2.0 (còn 5.0 chỗ)
      mockPrisma.$queryRaw.mockResolvedValue([
        { id: 'gv-gs-avail', ho_ten: 'GS. Available', hoc_ham_hoc_vi: 'GIAO_SU', max_ncs_cho_phep: 7 },
      ]);
      mockPrisma.phanCongHuongDan.findMany.mockResolvedValue([
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      ]);
      mockPrisma.quyetDinh.create.mockResolvedValue({ id: 'qd-gv-1', soQuyetDinh: 'QD/02' });
      mockPrisma.phanCongHuongDan.create.mockResolvedValue({ id: 'pc-new' });
      mockPrisma.deNghiDieuChinh.update.mockResolvedValue({ id: 'cr-gvhd-ok', trangThai: 'DA_DUYET' });

      await service.approveChangeRequest('user-gv', 'cr-gvhd-ok', {
        soQuyetDinh: 'QD/02',
        ngayQuyetDinh: '2026-10-15',
      });

      // BR-04: Phân công cũ chuyển DEACTIVATE (không hard delete)
      expect(mockPrisma.phanCongHuongDan.update).toHaveBeenCalledWith({
        where: { id: 'pc-old' },
        data: { trangThai: 'DEACTIVATE' },
      });

      // Tạo phân công mới
      expect(mockPrisma.phanCongHuongDan.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ncsId: 'ncs-1',
            gvhdId: 'gv-gs-avail',
            trangThai: 'DANG_HIEU_LUC',
          }),
        }),
      );

      // Cập nhật tải GVHD mới (increment) và GVHD cũ (decrement)
      expect(mockPrisma.giangVienHuongDan.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'gv-old' } }),
      );
      expect(mockPrisma.giangVienHuongDan.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'gv-gs-avail' } }),
      );

      // [S5-22] Bắn TCP Event
      expect(mockNotificationClient.emit).toHaveBeenCalledWith(
        'phd.change_request.approved',
        expect.objectContaining({
          eventType: 'phd.change_request.approved',
          ncsId: 'ncs-1',
        }),
      );
    });
  });

  // ─── [S5-20] Từ chối đơn đề nghị ──────────────────────────────────────────

  describe('rejectChangeRequest', () => {
    it('ném PhdChangeRequestRejectReasonRequiredException khi không có lý do từ chối', async () => {
      await expect(
        service.rejectChangeRequest('user-gv', 'cr-1', { lyDoTuChoi: '' }),
      ).rejects.toBeInstanceOf(PhdChangeRequestRejectReasonRequiredException);
    });

    it('từ chối đơn thành công và lưu lý do', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
        id: 'cr-reject',
        ncsId: 'ncs-1',
        trangThai: 'CHO_DUYET',
      });
      mockPrisma.deNghiDieuChinh.update.mockResolvedValue({
        id: 'cr-reject',
        trangThai: 'TU_CHOI',
        lyDoTuChoi: 'Hồ sơ chưa đủ điều kiện',
      });

      const res = await service.rejectChangeRequest('user-gv', 'cr-reject', {
        lyDoTuChoi: 'Hồ sơ chưa đủ điều kiện',
      });

      expect(res.trangThai).toBe('TU_CHOI');
      expect(mockPrisma.deNghiDieuChinh.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            trangThai: 'TU_CHOI',
            lyDoTuChoi: 'Hồ sơ chưa đủ điều kiện',
          }),
        }),
      );
    });
  });

  // ─── Queries ──────────────────────────────────────────────────────────────

  describe('listChangeRequests & getChangeRequest', () => {
    it('trả về danh sách đơn đề nghị và phân trang', async () => {
      mockPrisma.deNghiDieuChinh.findMany.mockResolvedValue([{ id: 'cr-1' }, { id: 'cr-2' }]);
      mockPrisma.deNghiDieuChinh.count.mockResolvedValue(2);

      const res = await service.listChangeRequests({ limit: 10, page: 1 });
      expect(res.items.length).toBe(2);
      expect(res.total).toBe(2);
    });

    it('ném PhdChangeRequestNotFoundException khi không tìm thấy đơn chi tiết', async () => {
      mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue(null);

      await expect(service.getChangeRequest('cr-missing')).rejects.toBeInstanceOf(
        PhdChangeRequestNotFoundException,
      );
    });
  });
});
