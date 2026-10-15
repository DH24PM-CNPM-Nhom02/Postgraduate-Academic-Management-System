import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EvaluationService } from './evaluation.service.js';
import {
  PhdEvaluationCannotDeleteSubmittedException,
  PhdEvaluationFormAlreadySubmittedException,
  PhdEvaluationScoreInvalidException,
  PhdScoreDifferenceExceededException,
} from './evaluation.exceptions.js';
import {
  TrangThaiMinhChung,
  TrangThaiMoc,
} from '../generated/prisma/index.js';
import { serializeFormContent } from './evaluation.util.js';

describe('Evaluation Service - Unit Tests', () => {
  let service: EvaluationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      minhChungMoc: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      phieuNhanXet: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      tienTrinhNcs: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      mocTienTrinh: {
        findUnique: vi.fn(),
      },
      quyetDinh: {
        create: vi.fn(),
        update: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn(async (cb: any) => {
        if (typeof cb === 'function') {
          return cb(mockPrisma);
        }
        return cb;
      }),
    };

    service = new EvaluationService(mockPrisma);
  });

  describe('[S5-04] Validate Điểm Số trong Service', () => {
    it('quăng lỗi PhdEvaluationScoreInvalidException khi điểm < 0 hoặc > 10', async () => {
      mockPrisma.minhChungMoc.findUnique.mockResolvedValue({
        id: 'session-1',
        trangThai: TrangThaiMinhChung.PENDING_REVIEW,
        tienTrinh: { ncsId: 'ncs-1' },
      });

      await expect(
        service.createForm('actor-1', 'session-1', {
          tenNguoiCham: 'TS. A',
          diem: 11.0,
        }),
      ).rejects.toThrow(PhdEvaluationScoreInvalidException);

      await expect(
        service.createForm('actor-1', 'session-1', {
          tenNguoiCham: 'TS. A',
          diem: -0.5,
        }),
      ).rejects.toThrow(PhdEvaluationScoreInvalidException);
    });

    it('quăng lỗi PhdEvaluationScoreInvalidException khi điểm có nhiều hơn 1 chữ số thập phân', async () => {
      mockPrisma.minhChungMoc.findUnique.mockResolvedValue({
        id: 'session-1',
        trangThai: TrangThaiMinhChung.PENDING_REVIEW,
        tienTrinh: { ncsId: 'ncs-1' },
      });

      await expect(
        service.createForm('actor-1', 'session-1', {
          tenNguoiCham: 'TS. A',
          diem: 8.25,
        }),
      ).rejects.toThrow(PhdEvaluationScoreInvalidException);
    });
  });

  describe('[S5-03] Quản Lý Phiếu Nhận Xét Online (Lưu Nháp, Submit & Chặn Xóa)', () => {
    it('không cho phép sửa phiếu đã nộp chính thức', async () => {
      mockPrisma.phieuNhanXet.findUnique.mockResolvedValue({
        id: 'form-1',
        minhChungId: 'session-1',
        tenNguoiCham: 'TS. A',
        diem: 8.5,
        nhanXet: serializeFormContent({ isDraft: false, comment: 'Đã submit' }),
        minhChung: { tienTrinh: { ncsId: 'ncs-1' } },
      });

      await expect(
        service.updateForm('actor-1', 'session-1', 'form-1', {
          diem: 9.0,
        }),
      ).rejects.toThrow(PhdEvaluationFormAlreadySubmittedException);
    });

    it('không cho phép xóa phiếu đã nộp chính thức (chặn hard-delete)', async () => {
      mockPrisma.phieuNhanXet.findUnique.mockResolvedValue({
        id: 'form-1',
        minhChungId: 'session-1',
        tenNguoiCham: 'TS. A',
        diem: 8.5,
        nhanXet: serializeFormContent({ isDraft: false }),
        minhChung: { tienTrinh: { ncsId: 'ncs-1' } },
      });

      await expect(
        service.deleteForm('actor-1', 'session-1', 'form-1'),
      ).rejects.toThrow(PhdEvaluationCannotDeleteSubmittedException);
    });

    it('cho phép xóa phiếu khi còn ở trạng thái nháp', async () => {
      mockPrisma.phieuNhanXet.findUnique.mockResolvedValue({
        id: 'form-draft-1',
        minhChungId: 'session-1',
        tenNguoiCham: 'TS. A',
        diem: 8.5,
        nhanXet: serializeFormContent({ isDraft: true }),
        minhChung: { tienTrinh: { ncsId: 'ncs-1' } },
      });
      mockPrisma.phieuNhanXet.delete.mockResolvedValue({});

      const res = await service.deleteForm('actor-1', 'session-1', 'form-draft-1');
      expect(res.success).toBe(true);
      expect(mockPrisma.phieuNhanXet.delete).toHaveBeenCalledWith({
        where: { id: 'form-draft-1' },
      });
    });
  });

  describe('[S5-05 & S5-06] Phê Duyệt Kết Quả & Chuyển Mốc Tiến Trình', () => {
    it('khóa không cho duyệt và ném lỗi PhdScoreDifferenceExceededException khi chênh lệch > 3.0 điểm', async () => {
      mockPrisma.minhChungMoc.findUnique.mockResolvedValue({
        id: 'session-1',
        trangThai: TrangThaiMinhChung.PENDING_REVIEW,
        tienTrinh: {
          id: 'tt-1',
          ncsId: 'ncs-1',
          moc: { id: 2, thuTu: 2 },
        },
        quyetDinh: { ghiChu: null },
        phieuNhanXets: [
          { id: 'f1', diem: 9.0, nhanXet: serializeFormContent({ isDraft: false }) },
          { id: 'f2', diem: 5.0, nhanXet: serializeFormContent({ isDraft: false }) },
        ],
      });

      await expect(
        service.approveSession('actor-1', 'session-1', {}),
      ).rejects.toThrow(PhdScoreDifferenceExceededException);
    });

    it('phê duyệt PASSED và tự động mở khóa mốc tiếp theo khi Điểm TB >= 7.0 và chênh lệch <= 3.0', async () => {
      mockPrisma.minhChungMoc.findUnique.mockResolvedValue({
        id: 'session-1',
        trangThai: TrangThaiMinhChung.PENDING_REVIEW,
        tienTrinh: {
          id: 'tt-1',
          ncsId: 'ncs-1',
          moc: { id: 2, thuTu: 2, tenMoc: 'Tiểu luận tổng quan' },
        },
        quyetDinh: { ghiChu: null },
        phieuNhanXets: [
          { id: 'f1', diem: 8.5, nhanXet: serializeFormContent({ isDraft: false }) },
          { id: 'f2', diem: 7.5, nhanXet: serializeFormContent({ isDraft: false }) },
        ],
      });

      // Mốc tiếp theo là thuTu 3 (Đề cương chi tiết)
      mockPrisma.mocTienTrinh.findUnique.mockResolvedValue({
        id: 3,
        thuTu: 3,
        tenMoc: 'Đề cương chi tiết',
      });
      mockPrisma.tienTrinhNcs.findUnique.mockResolvedValue({
        id: 'tt-next-1',
        ncsId: 'ncs-1',
        mocId: 3,
        trangThai: TrangThaiMoc.LOCKED,
      });

      mockPrisma.minhChungMoc.update.mockResolvedValue({ id: 'session-1' });
      mockPrisma.tienTrinhNcs.update.mockImplementation(({ data }: any) => ({
        id: 'updated',
        ...data,
      }));

      const res = await service.approveSession('actor-1', 'session-1', {});

      expect(res.isPassed).toBe(true);
      expect(res.status).toBe(TrangThaiMinhChung.PASSED);
      expect(res.averageScore).toBe(8.0);
      expect(res.nextMilestoneUnlocked).toEqual({
        mocId: 3,
        thuTu: 3,
        tenMoc: 'Đề cương chi tiết',
      });

      // Kiểm tra mốc hiện tại được cập nhật PASSED
      expect(mockPrisma.tienTrinhNcs.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tt-1' },
          data: expect.objectContaining({ trangThai: TrangThaiMoc.PASSED }),
        }),
      );

      // Kiểm tra mốc tiếp theo được mở khóa UNLOCKED
      expect(mockPrisma.tienTrinhNcs.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tt-next-1' },
          data: expect.objectContaining({ trangThai: TrangThaiMoc.UNLOCKED }),
        }),
      );
    });

    it('phê duyệt REJECTED khi Điểm TB < 7.0 và không mở khóa mốc tiếp theo', async () => {
      mockPrisma.minhChungMoc.findUnique.mockResolvedValue({
        id: 'session-1',
        trangThai: TrangThaiMinhChung.PENDING_REVIEW,
        tienTrinh: {
          id: 'tt-1',
          ncsId: 'ncs-1',
          moc: { id: 2, thuTu: 2, tenMoc: 'Tiểu luận tổng quan' },
        },
        quyetDinh: { ghiChu: null },
        phieuNhanXets: [
          { id: 'f1', diem: 6.5, nhanXet: serializeFormContent({ isDraft: false }) },
          { id: 'f2', diem: 6.5, nhanXet: serializeFormContent({ isDraft: false }) },
        ],
      });

      mockPrisma.minhChungMoc.update.mockResolvedValue({ id: 'session-1' });
      mockPrisma.tienTrinhNcs.update.mockImplementation(({ data }: any) => ({
        id: 'updated',
        ...data,
      }));

      const res = await service.approveSession('actor-1', 'session-1', {});

      expect(res.isPassed).toBe(false);
      expect(res.status).toBe(TrangThaiMinhChung.REJECTED);
      expect(res.averageScore).toBe(6.5);
      expect(res.nextMilestoneUnlocked).toBeNull();

      // Mốc hiện tại chuyển REJECTED
      expect(mockPrisma.tienTrinhNcs.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tt-1' },
          data: expect.objectContaining({ trangThai: TrangThaiMoc.REJECTED }),
        }),
      );
    });
  });
});
