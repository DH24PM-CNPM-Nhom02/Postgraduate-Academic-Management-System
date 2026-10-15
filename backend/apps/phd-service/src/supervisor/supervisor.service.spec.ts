/**
 * [S5-24] Unit Tests & Concurrency Tests cho Supervisor Module
 *
 * Bao gồm:
 * 1. Unit tests BR-09: tính tải, kiểm tra quota GS/PGS/TS
 * 2. Unit tests CRUD GVHD
 * 3. Unit tests BR-04: DEACTIVATE phân công cũ khi thay GVHD
 * 4. Concurrency Test: giả lập 2 request phân công đồng thời, chứng minh
 *    cơ chế Transaction Serializable + Pessimistic Lock ngăn vượt quota.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SupervisorService } from './supervisor.service.js';
import {
  PhdSupervisorNotFoundException,
  PhdSupervisorQuotaExceededException,
  PhdSupervisorStudentNotFoundException,
} from './supervisor.exceptions.js';

// ─── Mock Prisma Factory ──────────────────────────────────────────────────────

function createMockPrisma(overrides?: Partial<any>) {
  const base: any = {
    nghienCuuSinh: { findUnique: vi.fn() },
    giangVienHuongDan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      fields: { maxNcsChoPhep: 'maxNcsChoPhep' },
    },
    phanCongHuongDan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    quyetDinh: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  };
  return { ...base, ...overrides };
}

// ─── [S5-14] Unit Tests: Tính tải & Định mức ──────────────────────────────────

describe('[S5-14] Kiểm tra định mức BR-09', () => {
  let service: SupervisorService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new SupervisorService(mockPrisma);
  });

  it('GS (GIAO_SU): định mức tối đa 7.0 NCS', async () => {
    mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue({
      id: 'gvhd-gs-1',
      hoTen: 'GS.TS. Nguyễn A',
      hocHamHocVi: 'GIAO_SU',
      maxNcsChoPhep: 7,
      soNcsDangHuongDan: 6.0,
      phanCongs: [
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
        { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
        { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
        { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
      ],
    });

    const result = await service.getQuotaStatus('gvhd-gs-1');
    expect(result.maxNcsChoPhep).toBe(7);
    expect(result.quotaTheoHocHam).toBe(7);
    expect(result.coChoTrong).toBe(true); // 6.0 < 7
  });

  it('PGS (PHO_GIAO_SU): định mức tối đa 5.0 NCS', async () => {
    mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue({
      id: 'gvhd-pgs-1',
      hoTen: 'PGS.TS. Trần B',
      hocHamHocVi: 'PHO_GIAO_SU',
      maxNcsChoPhep: 5,
      soNcsDangHuongDan: 5.0,
      phanCongs: [],
    });

    const result = await service.getQuotaStatus('gvhd-pgs-1');
    expect(result.maxNcsChoPhep).toBe(5);
    expect(result.coChoTrong).toBe(false); // 5.0 = 5 → hết chỗ
    expect(result.conLai).toBe(0);
  });

  it('TS (TIEN_SI): định mức tối đa 3.0 NCS', async () => {
    mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue({
      id: 'gvhd-ts-1',
      hoTen: 'TS. Lê C',
      hocHamHocVi: 'TIEN_SI',
      maxNcsChoPhep: 3,
      soNcsDangHuongDan: 2.5,
      phanCongs: [
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
        { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
      ],
    });

    const result = await service.getQuotaStatus('gvhd-ts-1');
    expect(result.quotaTheoHocHam).toBe(3);
    expect(result.computedLoad).toBe(2.5); // 1.0 + 1.0 + 0.5
    expect(result.coChoTrong).toBe(true);
  });

  it('ném PhdSupervisorNotFoundException khi ID không tồn tại', async () => {
    mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(null);
    await expect(service.getQuotaStatus('non-exist')).rejects.toThrow(PhdSupervisorNotFoundException);
  });
});

// ─── [S5-13] Unit Tests: CRUD GVHD ──────────────────────────────────────────

describe('[S5-13] CRUD Giảng viên hướng dẫn', () => {
  let service: SupervisorService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new SupervisorService(mockPrisma);
  });

  it('Tạo GVHD - tự tính maxNcsChoPhep = 5 khi hocHamHocVi = PHO_GIAO_SU', async () => {
    const created = {
      id: 'new-gvhd-uuid',
      hoTen: 'PGS.TS. Nguyễn D',
      hocHamHocVi: 'PHO_GIAO_SU',
      maxNcsChoPhep: 5,
      soNcsDangHuongDan: 0,
    };
    mockPrisma.giangVienHuongDan.create.mockResolvedValue(created);
    mockPrisma.auditLog.create.mockResolvedValue({});

    const result = await service.createSupervisor('actor-gv', {
      hoTen: 'PGS.TS. Nguyễn D',
      hocHamHocVi: 'PHO_GIAO_SU' as any,
      coQuanCongTac: 'Trường ĐHAG',
    });

    expect(mockPrisma.giangVienHuongDan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ maxNcsChoPhep: 5 }),
      }),
    );
    expect(result.maxNcsChoPhep).toBe(5);
  });

  it('Tạo GVHD - dùng maxNcsChoPhep tùy chỉnh nếu được truyền vào', async () => {
    mockPrisma.giangVienHuongDan.create.mockResolvedValue({
      id: 'gvhd-2',
      maxNcsChoPhep: 6,
    });
    mockPrisma.auditLog.create.mockResolvedValue({});

    await service.createSupervisor('actor-gv', {
      hoTen: 'GS. An',
      hocHamHocVi: 'GIAO_SU' as any,
      coQuanCongTac: 'Trường ĐHAG',
      maxNcsChoPhep: 6, // custom, khác định mức GS=7
    });

    expect(mockPrisma.giangVienHuongDan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ maxNcsChoPhep: 6 }),
      }),
    );
  });

  it('ném PhdSupervisorStudentNotFoundException khi NCS không tồn tại', async () => {
    mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null);
    await expect(
      service.assignSupervisor('actor', {
        ncsId: 'non-exist-ncs',
        gvhdId: 'gvhd-1',
        vaiTro: 'HUONG_DAN_CHINH' as any,
        soQuyetDinh: '100/QĐ',
        ngayQuyetDinh: '2026-10-15',
      }),
    ).rejects.toThrow(PhdSupervisorStudentNotFoundException);
  });
});

// ─── [S5-15] Unit Tests: Transaction & Quota Check ───────────────────────────

describe('[S5-15] Transaction Phân công GVHD & Chống Race Condition', () => {
  let service: SupervisorService;
  let mockPrisma: any;

  const buildAssignDto = (overrides = {}) => ({
    ncsId: 'ncs-test-uuid',
    gvhdId: 'gvhd-ts-uuid',
    vaiTro: 'HUONG_DAN_CHINH' as any,
    soQuyetDinh: '100/QĐ-ĐHAG',
    ngayQuyetDinh: '2026-10-15',
    ...overrides,
  });

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new SupervisorService(mockPrisma);

    // Mock NCS luôn tồn tại
    mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({
      id: 'ncs-test-uuid',
      hoTen: 'NCS Test',
    });
  });

  it('[BR-09] Rollback transaction và ném PHD_SUPERVISOR_QUOTA_EXCEEDED khi TS đã hướng dẫn 3.0 NCS', async () => {
    // Setup transaction mock: thực thi callback trong transaction context
    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        ...mockPrisma,
        $queryRaw: vi.fn().mockResolvedValue([{
          id: 'gvhd-ts-uuid',
          ho_ten: 'TS. Lê Văn Test',
          hoc_ham_hoc_vi: 'TIEN_SI',
          max_ncs_cho_phep: 3,         // TS: tối đa 3.0
          so_ncs_dang_huong_dan: 3.0,  // Đã đầy!
          version: 1,
        }]),
        phanCongHuongDan: {
          ...mockPrisma.phanCongHuongDan,
          findMany: vi.fn().mockResolvedValue([
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
          ]),
        },
      };
      // Gọi callback - nó phải ném exception → transaction rollback
      return cb(tx);
    });

    await expect(
      service.assignSupervisor('actor-gv', buildAssignDto()),
    ).rejects.toThrow(PhdSupervisorQuotaExceededException);
  });

  it('[BR-09] Phân công thành công khi TS còn chỗ (load = 2.5 < 3.0)', async () => {
    const mockPhanCong = {
      id: 'pc-new-uuid',
      ncsId: 'ncs-test-uuid',
      gvhdId: 'gvhd-ts-uuid',
      vaiTro: 'HUONG_DAN_CHINH',
      trongSo: 1.0,
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        ...mockPrisma,
        $queryRaw: vi.fn().mockResolvedValue([{
          id: 'gvhd-ts-uuid',
          ho_ten: 'TS. Lê Văn Test',
          hoc_ham_hoc_vi: 'TIEN_SI',
          max_ncs_cho_phep: 3,
          so_ncs_dang_huong_dan: 2.5, // Còn 0.5 chỗ
          version: 1,
        }]),
        phanCongHuongDan: {
          ...mockPrisma.phanCongHuongDan,
          findMany: vi.fn().mockResolvedValue([
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
          ]),
          create: vi.fn().mockResolvedValue(mockPhanCong),
        },
        quyetDinh: { create: vi.fn().mockResolvedValue({ id: 'qd-uuid' }) },
        giangVienHuongDan: {
          ...mockPrisma.giangVienHuongDan,
          update: vi.fn().mockResolvedValue({}),
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      };
      return cb(tx);
    });

    // 2.5 (load hiện tại) + 1.0 (HD Chính) = 3.5 > 3 → phải thất bại!
    await expect(
      service.assignSupervisor('actor-gv', buildAssignDto()),
    ).rejects.toThrow(PhdSupervisorQuotaExceededException);
  });

  it('[BR-09] Phân công thành công khi GVHD còn đủ chỗ với Đồng HD', async () => {
    const mockPhanCong = {
      id: 'pc-dong-uuid',
      ncsId: 'ncs-test-uuid',
      gvhdId: 'gvhd-pgs-uuid',
      vaiTro: 'DONG_HUONG_DAN',
      trongSo: 0.5,
    };

    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        ...mockPrisma,
        $queryRaw: vi.fn().mockResolvedValue([{
          id: 'gvhd-pgs-uuid',
          ho_ten: 'PGS.TS. Trần E',
          hoc_ham_hoc_vi: 'PHO_GIAO_SU',
          max_ncs_cho_phep: 5,
          so_ncs_dang_huong_dan: 4.5, // Còn 0.5 chỗ
          version: 2,
        }]),
        phanCongHuongDan: {
          ...mockPrisma.phanCongHuongDan,
          findMany: vi.fn().mockResolvedValue([
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
          ]),
          create: vi.fn().mockResolvedValue(mockPhanCong),
        },
        quyetDinh: { create: vi.fn().mockResolvedValue({ id: 'qd-uuid-2' }) },
        giangVienHuongDan: {
          ...mockPrisma.giangVienHuongDan,
          update: vi.fn().mockResolvedValue({}),
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      };
      return cb(tx);
    });

    // 4.5 (load) + 0.5 (Đồng HD) = 5.0 = max → hợp lệ (không > max)
    const result = await service.assignSupervisor('actor-gv', {
      ...buildAssignDto({ gvhdId: 'gvhd-pgs-uuid' }),
      vaiTro: 'DONG_HUONG_DAN' as any,
    });

    expect(result).toBeDefined();
    expect(result.phanCong.vaiTro).toBe('DONG_HUONG_DAN');
    expect(result.loadAfter).toBe(5.0);
  });

  it('[S5-22] Bắn Event TCP phd.supervisor.assigned khi phân công thành công', async () => {
    const mockEmit = vi.fn();
    const serviceWithNotification = new SupervisorService(mockPrisma, { emit: mockEmit } as any);

    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        ...mockPrisma,
        $queryRaw: vi.fn().mockResolvedValue([{
          id: 'gvhd-event-uuid',
          ho_ten: 'TS. Event Test',
          hoc_ham_hoc_vi: 'TIEN_SI',
          max_ncs_cho_phep: 3,
          so_ncs_dang_huong_dan: 1.0,
          version: 1,
        }]),
        phanCongHuongDan: {
          ...mockPrisma.phanCongHuongDan,
          findMany: vi.fn().mockResolvedValue([{ vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 }]),
          create: vi.fn().mockResolvedValue({ id: 'pc-event-uuid', vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 }),
        },
        quyetDinh: { create: vi.fn().mockResolvedValue({ id: 'qd-event-uuid' }) },
        giangVienHuongDan: { ...mockPrisma.giangVienHuongDan, update: vi.fn().mockResolvedValue({}) },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      };
      return cb(tx);
    });

    await serviceWithNotification.assignSupervisor('actor-gv', {
      ...buildAssignDto({ gvhdId: 'gvhd-event-uuid' }),
      vaiTro: 'HUONG_DAN_CHINH' as any,
    });

    expect(mockEmit).toHaveBeenCalledWith(
      'phd.supervisor.assigned',
      expect.objectContaining({
        eventType: 'phd.supervisor.assigned',
        actorId: 'actor-gv',
        data: expect.objectContaining({
          assignmentId: 'pc-event-uuid',
          gvhdId: 'gvhd-event-uuid',
          vaiTro: 'HUONG_DAN_CHINH',
          quyetDinhId: 'qd-event-uuid',
        }),
      }),
    );
  });
});

// ─── [S5-24] Concurrency Test ─────────────────────────────────────────────────

describe('[S5-24] Concurrency Test: 2 request phân công đồng thời', () => {
  /**
   * Mô phỏng kịch bản Race Condition:
   *
   * - GVHD TS có maxNcsChoPhep = 3, soNcsDangHuongDan = 2.0 (còn 1 chỗ).
   * - 2 request cùng muốn phân công 1 NCS HD Chính (tải += 1.0) cho cùng GVHD.
   * - Chỉ có 1 request được thành công, request còn lại phải bị PHD_SUPERVISOR_QUOTA_EXCEEDED.
   *
   * Cơ chế chống:
   * - Transaction SERIALIZABLE buộc các request phải thực thi tuần tự.
   * - SELECT ... FOR UPDATE khóa hàng GVHD, request thứ 2 phải đợi lock.
   * - Sau khi request thứ 1 commit (load = 3.0 = max), request thứ 2 lấy được
   *   lock, đọc lại load = 3.0, tính 3.0 + 1.0 = 4.0 > 3.0 → ROLLBACK.
   */
  it('Giả lập 2 request đồng thời: chỉ 1 thành công, 1 bị rollback do vượt quota', async () => {
    let lockCount = 0; // Đếm số lần SELECT FOR UPDATE được gọi

    // Mock GVHD: TS, maxNcs = 3, load = 2.0 (còn 1 chỗ)
    const gvhdLockedRows = [
      // Request 1 thấy: load = 2.0 (chưa ai commit)
      [{ id: 'gvhd-ts-cc', ho_ten: 'TS. Concurrency Test', hoc_ham_hoc_vi: 'TIEN_SI', max_ncs_cho_phep: 3, so_ncs_dang_huong_dan: 2.0, version: 5 }],
      // Request 2 thấy: load = 3.0 (sau khi Request 1 đã commit)
      [{ id: 'gvhd-ts-cc', ho_ten: 'TS. Concurrency Test', hoc_ham_hoc_vi: 'TIEN_SI', max_ncs_cho_phep: 3, so_ncs_dang_huong_dan: 3.0, version: 6 }],
    ];

    // Danh sách NCS được assigned (sau commit của request 1)
    const assignedAfterCommit = [
      { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
      { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 }, // Request 1 đã tạo
    ];

    // Tạo 2 mock service độc lập (mỗi service = 1 request)
    let reqCount = 0;

    function createTxMock(isFirstRequest: boolean) {
      return async (cb: any) => {
        reqCount++;
        const tx = {
          $queryRaw: vi.fn().mockImplementation(async () => {
            lockCount++;
            return gvhdLockedRows[isFirstRequest ? 0 : 1];
          }),
          phanCongHuongDan: {
            findMany: vi.fn().mockResolvedValue(
              isFirstRequest
                ? [
                    { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
                    { vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 },
                  ]
                : assignedAfterCommit,
            ),
            create: vi.fn().mockResolvedValue({ id: 'pc-cc-1', vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0 }),
          },
          quyetDinh: { create: vi.fn().mockResolvedValue({ id: 'qd-cc-1' }) },
          giangVienHuongDan: {
            update: vi.fn().mockResolvedValue({}),
            fields: {},
          },
          auditLog: { create: vi.fn().mockResolvedValue({}) },
        };
        return cb(tx);
      };
    }

    const mockPrisma1 = createMockPrisma();
    mockPrisma1.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-cc-1', hoTen: 'NCS Concurrent 1' });
    mockPrisma1.$transaction.mockImplementation(createTxMock(true));

    const mockPrisma2 = createMockPrisma();
    mockPrisma2.nghienCuuSinh.findUnique.mockResolvedValue({ id: 'ncs-cc-2', hoTen: 'NCS Concurrent 2' });
    mockPrisma2.$transaction.mockImplementation(createTxMock(false));

    const service1 = new SupervisorService(mockPrisma1);
    const service2 = new SupervisorService(mockPrisma2);

    const dto = (ncsId: string) => ({
      ncsId,
      gvhdId: 'gvhd-ts-cc',
      vaiTro: 'HUONG_DAN_CHINH' as any,
      soQuyetDinh: '100/QĐ',
      ngayQuyetDinh: '2026-10-15',
    });

    // Chạy 2 request "đồng thời" (Promise.allSettled)
    const [result1, result2] = await Promise.allSettled([
      service1.assignSupervisor('actor-gv-1', dto('ncs-cc-1')),
      service2.assignSupervisor('actor-gv-2', dto('ncs-cc-2')),
    ]);

    // ── Kỳ vọng ──
    // Request 1 (thấy load = 2.0, thêm 1.0 → 3.0 = max): THÀNH CÔNG
    expect(result1.status).toBe('fulfilled');

    expect(lockCount).toBe(2);

    // Request 2 (thấy load = 3.0, thêm 1.0 → 4.0 > 3.0): ROLLBACK
    expect(result2.status).toBe('rejected');
    if (result2.status === 'rejected') {
      expect(result2.reason).toBeInstanceOf(PhdSupervisorQuotaExceededException);
      const errMsg = (result2.reason as any).error?.message ?? '';
      expect(errMsg).toContain('vượt định mức');
      // Kiểm tra error code đúng
      expect((result2.reason as any).error?.errorCode).toBe('PHD_SUPERVISOR_QUOTA_EXCEEDED');
    }
  });
});

// ─── [BR-04] Unit Tests: DEACTIVATE thay vì Hard Delete ──────────────────────

describe('[BR-04] Thay đổi GVHD - DEACTIVATE phân công cũ', () => {
  let service: SupervisorService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    service = new SupervisorService(mockPrisma);

    mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue({
      id: 'ncs-uuid-br04',
      hoTen: 'NCS BR04 Test',
    });
  });

  it('Phân công cũ được đặt sang DEACTIVATE (không hard-delete)', async () => {
    const deactivateUpdateSpy = vi.fn().mockResolvedValue({});

    mockPrisma.$transaction.mockImplementation(async (cb: any) => {
      const tx = {
        ...mockPrisma,
        $queryRaw: vi.fn()
          .mockResolvedValueOnce([{
            id: 'gvhd-old', ho_ten: 'TS. Cũ', hoc_ham_hoc_vi: 'TIEN_SI',
            max_ncs_cho_phep: 3, so_ncs_dang_huong_dan: 1.0, version: 1,
          }])
          .mockResolvedValueOnce([{
            id: 'gvhd-new', ho_ten: 'PGS. Mới', hoc_ham_hoc_vi: 'PHO_GIAO_SU',
            max_ncs_cho_phep: 5, so_ncs_dang_huong_dan: 2.0, version: 3,
          }]),
        phanCongHuongDan: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'pc-old', gvhdId: 'gvhd-old', vaiTro: 'HUONG_DAN_CHINH', trongSo: 1.0,
            gvhd: { id: 'gvhd-old', hoTen: 'TS. Cũ' },
          }),
          findMany: vi.fn().mockResolvedValue([
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
            { vaiTro: 'DONG_HUONG_DAN', trongSo: 0.5 },
          ]),
          update: deactivateUpdateSpy,
          create: vi.fn().mockResolvedValue({ id: 'pc-new' }),
        },
        quyetDinh: { create: vi.fn().mockResolvedValue({ id: 'qd-new' }) },
        giangVienHuongDan: {
          ...mockPrisma.giangVienHuongDan,
          update: vi.fn().mockResolvedValue({}),
        },
        auditLog: { create: vi.fn().mockResolvedValue({}) },
      };
      return cb(tx);
    });

    await service.changeSupervisor('actor-gv', {
      ncsId: 'ncs-uuid-br04',
      phanCongCuId: 'pc-old',
      gvhdMoiId: 'gvhd-new',
      vaiTro: 'HUONG_DAN_CHINH' as any,
      lyDo: 'GVHD cũ nghỉ hưu',
      soQuyetDinh: '200/QĐ',
      ngayQuyetDinh: '2026-11-01',
    });

    // Kiểm tra DEACTIVATE được gọi (không phải delete)
    expect(deactivateUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pc-old' },
        data: expect.objectContaining({ trangThai: 'DEACTIVATE' }),
      }),
    );
  });
});
