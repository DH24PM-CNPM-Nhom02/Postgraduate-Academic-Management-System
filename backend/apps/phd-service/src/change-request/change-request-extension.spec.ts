import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChangeRequestService } from './change-request.service.js';
import { RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('ChangeRequestService - Luồng gia hạn học tập (GIA_HAN)', () => {
    let service: ChangeRequestService;
    let mockPrisma: any;
    let mockNotification: any;
    let mockDocument: any;

    beforeEach(() => {
        mockNotification = {
            gui: vi.fn(),
        };

        mockDocument = {
            send: vi.fn((pattern, payload) => {
                if (pattern.cmd === 'document.get') {
                    if (payload.id === 'invalid-file-type') {
                        return of({ id: payload.id, documentType: 'KHAC' });
                    }
                    if (payload.id === 'not-found-file') {
                        return throwError(() => ({ statusCode: 404, message: 'Không tìm thấy tài liệu' }));
                    }
                    if (payload.id === 'doc-quyet-dinh') {
                        return of({ id: payload.id, documentType: 'QUYET_DINH' });
                    }
                    return of({ id: payload.id, documentType: 'DON_TU' });
                }
                return of({});
            }),
        };

        mockPrisma = {
            nghienCuuSinh: {
                findUnique: vi.fn(),
                update: vi.fn(),
            },
            giangVienHuongDan: {
                findUnique: vi.fn(),
                update: vi.fn(),
                updateMany: vi.fn(),
            },
            phanCongHuongDan: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
                create: vi.fn().mockImplementation((args: any) => Promise.resolve({ id: 'pc-moi-gen', ...args?.data })),
                update: vi.fn(),
                count: vi.fn().mockResolvedValue(0),
            },
            tienTrinhNcs: {
                findFirst: vi.fn(),
                findMany: vi.fn().mockResolvedValue([]),
                update: vi.fn(),
            },
            deNghiDieuChinh: {
                findUnique: vi.fn(),
                findMany: vi.fn(),
                findFirst: vi.fn().mockResolvedValue(null), // fileId chưa bị dùng trùng
                create: vi.fn(),
                update: vi.fn(),
                updateMany: vi.fn(),
                count: vi.fn(),
            },
            xacNhanGvhdDeNghi: {
                findUnique: vi.fn(),
                findMany: vi.fn(),
                create: vi.fn(),
                update: vi.fn(),
                count: vi.fn(),
            },
            quyetDinh: {
                findUnique: vi.fn(),
                findFirst: vi.fn().mockResolvedValue(null),
                findMany: vi.fn().mockResolvedValue([]),
                create: vi.fn(),
                count: vi.fn(),
            },
            auditLog: {
                create: vi.fn(),
            },
            $transaction: vi.fn(async (callback) => {
                if (typeof callback === 'function') {
                    return callback(mockPrisma);
                }
                return Promise.all(callback);
            }),
        };

        service = new ChangeRequestService(mockPrisma, mockNotification, mockDocument);
    });

    const now = new Date();
    // Tạo mốc kết thúc sau 6 tháng để đảm bảo còn trong hạn nộp (> 2 tháng)
    const futureDate = new Date(now.getFullYear(), now.getMonth() + 6, 1);
    const maxDate = new Date(now.getFullYear(), now.getMonth() + 30, 1);

    const fakeNcs = {
        id: 'ncs-uuid-1',
        userId: 'user-ncs-1',
        hoTen: 'Nguyễn Văn A',
        mshv: 'NCS001',
        trangThai: 'DANG_HOC',
        hanChinhQuy: futureDate,
        hanGiaHan: null,
        hanBuocThoiHoc: maxDate,
    };

    const fakeGvhd1 = { id: 'gv-1', userId: 'user-gv-1', hoTen: 'GS. Trần B' };
    const fakeGvhd2 = { id: 'gv-2', userId: 'user-gv-2', hoTen: 'PGS. Lê C' };

    it('NCS nộp đơn gia hạn học tập thành công và tạo yêu cầu xác nhận cho tập thể GVHD', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(fakeNcs);
        mockPrisma.deNghiDieuChinh.count.mockResolvedValue(0); // Chưa có đề nghị nào chờ duyệt
        mockPrisma.tienTrinhNcs.findFirst.mockResolvedValue({
            id: 'tt-moc-2',
            mocId: 2,
            trangThai: 'PASSED',
        });
        mockPrisma.deNghiDieuChinh.findMany.mockResolvedValue([]); // Chưa có lần gia hạn nào trước đây
        mockPrisma.phanCongHuongDan.findMany.mockResolvedValue([
            { id: 'pc-1', gvhdId: fakeGvhd1.id, gvhd: fakeGvhd1 },
            { id: 'pc-2', gvhdId: fakeGvhd2.id, gvhd: fakeGvhd2 },
        ]);

        const fakeCreatedDeNghi = {
            id: 'dn-uuid-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_GVHD_XAC_NHAN',
            soThangGiaHan: 6,
            xacNhanGvhds: [
                { id: 'xn-1', gvhdId: fakeGvhd1.id },
                { id: 'xn-2', gvhdId: fakeGvhd2.id },
            ],
        };
        mockPrisma.deNghiDieuChinh.create.mockResolvedValue(fakeCreatedDeNghi);

        const result = await service.create('user-ncs-1', {
            loai: 'GIA_HAN',
            lyDo: 'Cần thêm thời gian làm thực nghiệm',
            fileId: 'doc-file-123',
            soThangGiaHan: 6,
        });

        expect(result).toBeDefined();
        expect(mockDocument.send).toHaveBeenCalled();
        expect(mockPrisma.deNghiDieuChinh.create).toHaveBeenCalled();
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                loai: 'DE_NGHI_GIA_HAN_CAN_XAC_NHAN',
                userIds: ['user-gv-1', 'user-gv-2'],
            })
        );
    });

    it('Chặn nếu fileId không đúng định dạng đơn từ / minh chứng', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(fakeNcs);

        await expect(
            service.create('user-ncs-1', {
                loai: 'GIA_HAN',
                lyDo: 'Lý do',
                fileId: 'invalid-file-type',
                soThangGiaHan: 6,
            })
        ).rejects.toThrowError(/không đúng loại tài liệu/);
    });

    it('Chặn nếu người gửi không phải là NCS', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null);

        await expect(
            service.create('user-other', {
                loai: 'GIA_HAN',
                lyDo: 'Lý do',
                fileId: 'doc-file-123',
                soThangGiaHan: 6,
            })
        ).rejects.toThrow(RpcException);
    });

    it('Chặn nếu NCS chưa hoàn thành Mốc 2 (PASSED)', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(fakeNcs);
        mockPrisma.deNghiDieuChinh.count.mockResolvedValue(0);
        // Mốc 2 chưa PASSED
        mockPrisma.tienTrinhNcs.findFirst.mockResolvedValue({
            id: 'tt-moc-2',
            mocId: 2,
            trangThai: 'UNLOCKED',
        });

        await expect(
            service.create('user-ncs-1', {
                loai: 'GIA_HAN',
                lyDo: 'Lý do',
                fileId: 'doc-file-123',
                soThangGiaHan: 6,
            })
        ).rejects.toThrowError(/Mốc 2/);
    });

    it('Chặn nếu nộp quá hạn 02 tháng trước khi hết hạn đào tạo', async () => {
        // Hạn chính quy chỉ còn 1 tháng kể từ bây giờ (đã quá hạn nộp 2 tháng)
        const expiredNcs = {
            ...fakeNcs,
            hanChinhQuy: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        };
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(expiredNcs);
        mockPrisma.deNghiDieuChinh.count.mockResolvedValue(0);
        mockPrisma.tienTrinhNcs.findFirst.mockResolvedValue({
            id: 'tt-moc-2',
            mocId: 2,
            trangThai: 'PASSED',
        });

        await expect(
            service.create('user-ncs-1', {
                loai: 'GIA_HAN',
                lyDo: 'Lý do',
                fileId: 'doc-file-123',
                soThangGiaHan: 6,
            })
        ).rejects.toThrowError(/quá thời hạn nộp đơn/);
    });

    it('Chặn nếu tổng thời gian gia hạn tích lũy vượt quá 24 tháng', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(fakeNcs);
        mockPrisma.deNghiDieuChinh.count.mockResolvedValue(0);
        mockPrisma.tienTrinhNcs.findFirst.mockResolvedValue({
            id: 'tt-moc-2',
            mocId: 2,
            trangThai: 'PASSED',
        });
        // Đã gia hạn trước đó 20 tháng
        mockPrisma.deNghiDieuChinh.findMany.mockResolvedValue([
            { soThangGiaHan: 12 },
            { soThangGiaHan: 8 },
        ]);

        await expect(
            service.create('user-ncs-1', {
                loai: 'GIA_HAN',
                lyDo: 'Lý do',
                fileId: 'doc-file-123',
                soThangGiaHan: 6, // 20 + 6 = 26 > 24
            })
        ).rejects.toThrowError(/vượt quá 24 tháng/);
    });

    it('GVHD từ chối đề nghị gia hạn -> Dừng quy trình và chuyển trạng thái TU_CHOI', async () => {
        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(fakeGvhd1);
        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_GVHD_XAC_NHAN',
            ncs: fakeNcs,
        });
        mockPrisma.xacNhanGvhdDeNghi.findUnique.mockResolvedValue({
            id: 'xn-1',
            deNghiId: 'dn-1',
            gvhdId: fakeGvhd1.id,
            dongY: null,
        });

        await service.xacNhanGvhd('user-gv-1', 'dn-1', {
            dongY: false,
            nhanXet: 'Tiến độ chưa đạt yêu cầu',
        });

        expect(mockPrisma.xacNhanGvhdDeNghi.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ dongY: false }),
            })
        );
        expect(mockPrisma.deNghiDieuChinh.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'dn-1' },
                data: expect.objectContaining({
                    trangThai: 'TU_CHOI',
                    lyDoTuChoi: expect.stringContaining('Tiến độ chưa đạt yêu cầu'),
                }),
            })
        );
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                loai: 'DE_NGHI_GIA_HAN_GVHD_TU_CHOI',
                userIds: ['user-ncs-1'],
            })
        );
    });

    it('Tập thể GVHD: Khi tất cả GVHD đồng ý -> Chuyển sang CHO_DUYET cho Giáo vụ', async () => {
        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(fakeGvhd2);
        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_GVHD_XAC_NHAN',
            ncs: fakeNcs,
        });
        mockPrisma.xacNhanGvhdDeNghi.findUnique.mockResolvedValue({
            id: 'xn-2',
            deNghiId: 'dn-1',
            gvhdId: fakeGvhd2.id,
            dongY: null,
        });
        // Không còn ai chưa đồng ý (chuaDongY = 0)
        mockPrisma.xacNhanGvhdDeNghi.count.mockResolvedValue(0);

        await service.xacNhanGvhd('user-gv-2', 'dn-1', {
            dongY: true,
            nhanXet: 'Đồng ý cho gia hạn',
        });

        expect(mockPrisma.deNghiDieuChinh.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'dn-1' },
                data: expect.objectContaining({ trangThai: 'CHO_DUYET' }),
            })
        );
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                loai: 'DE_NGHI_GIA_HAN_GVHD_DONG_Y',
                userIds: ['user-ncs-1'],
            })
        );
    });

    it('Giáo vụ duyệt đơn gia hạn và nhập quyết định -> Chuyển NCS sang GIA_HAN và tính hạn mới', async () => {
        mockPrisma.nghienCuuSinh.findUnique
            .mockResolvedValueOnce(null) // Người duyệt không phải NCS
            .mockResolvedValueOnce(fakeNcs) // Lấy NCS khi áp dụng gia hạn
            .mockResolvedValueOnce({
                ...fakeNcs,
                phanCongs: [
                    { gvhd: { userId: 'user-gv-1' } },
                    { gvhd: { userId: 'user-gv-2' } },
                ],
            }); // Lấy NCS để gửi thông báo

        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(null); // Người duyệt không phải GVHD (là Giáo vụ)

        const hanMoi = new Date(futureDate.getFullYear(), futureDate.getMonth() + 6, 1);
        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_DUYET',
            createdAt: new Date('2026-10-01'),
            hanMoiDeNghi: hanMoi,
            soThangGiaHan: 6,
            lyDo: 'Lý do gia hạn',
        });

        // Tất cả GVHD đều đã đồng ý
        mockPrisma.xacNhanGvhdDeNghi.count.mockResolvedValue(0);

        mockPrisma.quyetDinh.create.mockResolvedValue({
            id: 'qd-123',
            soQuyetDinh: '999/QĐ-ĐH',
            ngayQuyetDinh: new Date('2026-10-15'),
        });
        mockPrisma.deNghiDieuChinh.updateMany.mockResolvedValue({ count: 1 });

        const result = await service.duyet('user-giao-vu', 'dn-1', {
            soQuyetDinh: '999/QĐ-ĐH',
            ngayQuyetDinh: '2026-10-15',
            fileId: 'doc-quyet-dinh',
            ghiChu: 'Đồng ý gia hạn 6 tháng',
        });

        expect(result).toBeDefined();
        // Cập nhật NCS sang GIA_HAN
        expect(mockPrisma.nghienCuuSinh.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: fakeNcs.id },
                data: expect.objectContaining({
                    trangThai: 'GIA_HAN',
                    hanGiaHan: hanMoi,
                }),
            })
        );
        // Gửi thông báo quyết định gia hạn cho NCS và các GVHD
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                loai: 'QUYET_DINH_DOI_TRANG_THAI',
                userIds: ['user-ncs-1'],
            })
        );
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                loai: 'GVHD_QUYET_DINH_DOI_TRANG_THAI',
                userIds: ['user-gv-1', 'user-gv-2'],
            })
        );
    });

    it('Chặn duyệt nếu số quyết định đã được áp dụng cho NCS này trước đó', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null); // Giáo vụ
        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(null);

        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_DUYET',
            createdAt: new Date('2026-10-01'),
            hanMoiDeNghi: new Date('2027-04-01'),
            soThangGiaHan: 6,
        });
        mockPrisma.xacNhanGvhdDeNghi.count.mockResolvedValue(0);

        // Giả lập số quyết định đã được cấp cho chính NCS này
        mockPrisma.quyetDinh.findFirst.mockResolvedValue(null);
        mockPrisma.quyetDinh.findMany.mockResolvedValue([
            { ncsId: fakeNcs.id, ngayQuyetDinh: new Date('2026-10-15') },
        ]);

        await expect(
            service.duyet('user-giao-vu', 'dn-1', {
                soQuyetDinh: '999/QĐ-ĐH',
                ngayQuyetDinh: '2026-10-15',
            })
        ).rejects.toThrowError(/đã được áp dụng cho nghiên cứu sinh này/);
    });

    it('Chặn duyệt nếu số quyết định đã tồn tại trong hệ thống với ngày ký khác', async () => {
        mockPrisma.nghienCuuSinh.findUnique.mockResolvedValue(null);
        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(null);

        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'GIA_HAN',
            trangThai: 'CHO_DUYET',
            createdAt: new Date('2026-10-01'),
            hanMoiDeNghi: new Date('2027-04-01'),
            soThangGiaHan: 6,
        });
        mockPrisma.xacNhanGvhdDeNghi.count.mockResolvedValue(0);

        // Giả lập số quyết định đã tồn tại với ngày ký 2026-10-10
        mockPrisma.quyetDinh.findFirst.mockResolvedValue(null);
        mockPrisma.quyetDinh.findMany.mockResolvedValue([
            { ncsId: 'ncs-other', ngayQuyetDinh: new Date('2026-10-10') },
        ]);

        await expect(
            service.duyet('user-giao-vu', 'dn-1', {
                soQuyetDinh: '999/QĐ-ĐH',
                ngayQuyetDinh: '2026-10-15', // ngày khác ngày cũ
            })
        ).rejects.toThrowError(/với ngày ký khác/);
    });

    it('Giáo vụ từ chối đơn đề nghị -> cập nhật TU_CHOI và gửi thông báo DE_NGHI_DIEU_CHINH_TU_CHOI', async () => {
        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-1',
            ncsId: fakeNcs.id,
            loai: 'DOI_DE_TAI',
            trangThai: 'CHO_DUYET',
            nguoiDeNghiId: 'user-ncs-1',
            ncs: fakeNcs,
        });
        mockPrisma.deNghiDieuChinh.updateMany.mockResolvedValue({ count: 1 });

        await service.tuChoi('user-giao-vu', 'dn-1', 'Hồ sơ thiếu minh chứng');

        expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    action: 'DE_NGHI_TU_CHOI',
                    entityType: 'DeNghiDieuChinh',
                    entityId: 'dn-1',
                }),
            })
        );

        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-ncs-1'],
                loai: 'DE_NGHI_DIEU_CHINH_TU_CHOI',
                duLieu: expect.objectContaining({
                    tenLoaiDeNghi: 'đổi đề tài luận án',
                    lyDo: 'Hồ sơ thiếu minh chứng',
                }),
            })
        );
    });

    it('Giáo vụ duyệt đơn đề nghị đổi đề tài -> gửi thông báo DE_NGHI_DOI_DE_TAI_DUYET và GVHD_DE_NGHI_DOI_DE_TAI_DUYET', async () => {
        mockPrisma.nghienCuuSinh.findUnique = vi.fn((params: any) => {
            if (params?.where?.userId) return Promise.resolve(null); // giáo vụ duyệt
            if (params?.where?.id === fakeNcs.id) {
                return Promise.resolve({
                    ...fakeNcs,
                    phanCongs: [
                        { gvhd: { userId: 'user-gvhd-1' } },
                    ],
                });
            }
            return Promise.resolve(null);
        });
        mockPrisma.giangVienHuongDan.findUnique.mockResolvedValue(null);

        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-dt-1',
            ncsId: fakeNcs.id,
            loai: 'DOI_DE_TAI',
            trangThai: 'CHO_DUYET',
            tenDeTaiMoi: 'Đề tài trí tuệ nhân tạo mới',
            createdAt: new Date('2026-10-01'),
        });

        mockPrisma.quyetDinh.findUnique.mockResolvedValue({
            id: 'qd-dt-1',
            loai: 'GIAO_DE_TAI',
            soQuyetDinh: '123/QĐ-ĐH',
            ngayQuyetDinh: new Date('2026-10-20'),
            trangThai: 'HIEU_LUC',
            ncsId: fakeNcs.id,
        });
        mockPrisma.deTai = {
            findFirst: vi.fn().mockResolvedValue({ id: 'dt-cu', tenDeTai: 'Đề tài cũ' }),
            update: vi.fn().mockResolvedValue({}),
            create: vi.fn().mockResolvedValue({ id: 'dt-moi', tenDeTai: 'Đề tài trí tuệ nhân tạo mới' }),
            count: vi.fn().mockResolvedValue(0),
        };
        mockPrisma.deNghiDieuChinh.updateMany.mockResolvedValue({ count: 1 });

        await service.duyet('user-giao-vu', 'dn-dt-1', {
            quyetDinhId: 'qd-dt-1',
            resetTuMoc: 3,
        });

        // 1. Thông báo cho NCS
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-ncs-1'],
                loai: 'DE_NGHI_DOI_DE_TAI_DUYET',
                duLieu: expect.objectContaining({
                    tenDeTaiMoi: 'Đề tài trí tuệ nhân tạo mới',
                    soQuyetDinh: '123/QĐ-ĐH',
                    resetTuMoc: 3,
                }),
            })
        );

        // 2. Thông báo cho GVHD
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-gvhd-1'],
                loai: 'GVHD_DE_NGHI_DOI_DE_TAI_DUYET',
                duLieu: expect.objectContaining({
                    tenDeTaiMoi: 'Đề tài trí tuệ nhân tạo mới',
                    soQuyetDinh: '123/QĐ-ĐH',
                    resetTuMoc: 3,
                }),
            })
        );
    });

    it('Giáo vụ duyệt đơn đề nghị đổi GVHD -> gửi thông báo DE_NGHI_DOI_GVHD_DUYET, GVHD_CU_THAY_DOI_PHAN_CONG, GVHD_MOI_DUOC_PHAN_CONG', async () => {
        mockPrisma.nghienCuuSinh.findUnique = vi.fn((params: any) => {
            if (params?.where?.userId) return Promise.resolve(null);
            if (params?.where?.id === fakeNcs.id) return Promise.resolve(fakeNcs);
            return Promise.resolve(null);
        });

        mockPrisma.deNghiDieuChinh.findUnique.mockResolvedValue({
            id: 'dn-gv-1',
            ncsId: fakeNcs.id,
            loai: 'DOI_GVHD',
            trangThai: 'CHO_DUYET',
            phanCongCuId: 'pc-cu-1',
            gvhdMoiId: 'gv-moi-1',
            createdAt: new Date('2026-10-01'),
        });

        mockPrisma.quyetDinh.findUnique.mockResolvedValue({
            id: 'qd-gv-1',
            loai: 'PHAN_CONG_GVHD',
            soQuyetDinh: '456/QĐ-ĐH',
            ngayQuyetDinh: new Date('2026-10-20'),
            trangThai: 'HIEU_LUC',
            ncsId: fakeNcs.id,
        });

        mockPrisma.phanCongHuongDan.findFirst = vi.fn((params: any) => {
            if (params?.where?.id === 'pc-cu-1') {
                return Promise.resolve({
                    id: 'pc-cu-1',
                    ncsId: fakeNcs.id,
                    gvhdId: 'gv-cu-1',
                    trongSo: 1,
                    vaiTro: 'CHINH',
                    trangThai: 'DANG_HIEU_LUC',
                });
            }
            return Promise.resolve(null);
        });

        mockPrisma.phanCongHuongDan.count.mockResolvedValue(0);

        mockPrisma.giangVienHuongDan.findUnique = vi.fn((params: any) => {
            if (params?.where?.userId) return Promise.resolve(null);
            if (params?.where?.id === 'gv-moi-1') {
                return Promise.resolve({
                    id: 'gv-moi-1',
                    hoTen: 'TS. Nguyễn Văn Mới',
                    userId: 'user-gvhd-moi',
                    trangThai: true,
                    soNcsDangHuongDan: 1,
                    maxNcsChoPhep: 5,
                    version: 1,
                });
            }
            if (params?.where?.id === 'gv-cu-1') {
                return Promise.resolve({
                    id: 'gv-cu-1',
                    hoTen: 'PGS. TS. Trần Văn Cũ',
                    userId: 'user-gvhd-cu',
                    soNcsDangHuongDan: 2,
                    version: 1,
                });
            }
            return Promise.resolve(null);
        });

        mockPrisma.giangVienHuongDan.updateMany.mockResolvedValue({ count: 1 });
        mockPrisma.deNghiDieuChinh.updateMany.mockResolvedValue({ count: 1 });

        await service.duyet('user-giao-vu', 'dn-gv-1', {
            quyetDinhId: 'qd-gv-1',
        });

        // 1. Thông báo cho NCS
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-ncs-1'],
                loai: 'DE_NGHI_DOI_GVHD_DUYET',
                duLieu: expect.objectContaining({
                    tenGvhdCu: 'PGS. TS. Trần Văn Cũ',
                    tenGvhdMoi: 'TS. Nguyễn Văn Mới',
                    soQuyetDinh: '456/QĐ-ĐH',
                }),
            })
        );

        // 2. Thông báo cho GVHD cũ
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-gvhd-cu'],
                loai: 'GVHD_CU_THAY_DOI_PHAN_CONG',
                duLieu: expect.objectContaining({
                    soQuyetDinh: '456/QĐ-ĐH',
                }),
            })
        );

        // 3. Thông báo cho GVHD mới
        expect(mockNotification.gui).toHaveBeenCalledWith(
            expect.objectContaining({
                userIds: ['user-gvhd-moi'],
                loai: 'GVHD_MOI_DUOC_PHAN_CONG',
                duLieu: expect.objectContaining({
                    soQuyetDinh: '456/QĐ-ĐH',
                }),
            })
        );
    });
});
