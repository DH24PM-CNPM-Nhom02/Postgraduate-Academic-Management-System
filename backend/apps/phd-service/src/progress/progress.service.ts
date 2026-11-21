import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import type { Prisma } from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { goiService } from '../helpers/call-service.util.js';
import { DeadlineService } from './deadline.service.js';
import { layNgay } from '../helpers/date.util.js';
import { NotificationClient } from '../notification/notification.client.js';
import type { CreateEvaluationDto, UpdateEvaluationDto, ListPendingMilestonesQueryDto } from '../../../../lib/contracts/src/dto/progress.dto.js';

const DIEM_DAT = 7;            // điểm trung bình tối thiểu để đạt (thang 10)
const SO_PHIEU_TOI_THIEU = 3;  // quy định của trường: tối thiểu 3 phiếu nhận xét

@Injectable()
export class ProgressService {
    private readonly logger = new Logger(ProgressService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
        private readonly han: DeadlineService,
        private readonly thongBao: NotificationClient,
    ) { }

    private async callDocument<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
        return goiService<T>(this.document, cmd, payload, ms);
    }

    private async callAuth<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
        return goiService<T>(this.auth, cmd, payload, ms);
    }

    async nopMinhChung(userId: string, thuTu: number, fileId: string, ghiChu?: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: {
                userId
            }
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Bạn chưa có hồ sơ NCS' });
        }

        // Quá hạn của một mốc vẫn được nộp, nhưng không được vượt tổng thời gian đào tạo tối đa (72 tháng)
        if (layNgay(new Date()) > ncs.hanBuocThoiHoc) {
            throw new RpcException({ statusCode: 403, message: 'Đã vượt quá tổng thời gian đào tạo tối đa, không thể nộp minh chứng' });
        }

        if (ncs.trangThai !== 'DANG_HOC' && ncs.trangThai !== 'GIA_HAN') {
            throw new RpcException({ statusCode: 403, message: 'Hồ sơ NCS không ở trạng thái đang học' });
        }

        const tienTrinh = await this.prisma.tienTrinhNcs.findFirst({
            where: {
                ncsId: ncs.id,
                moc: {
                    thuTu
                }
            },
        });
        if (!tienTrinh) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy mốc' });
        }
        if (tienTrinh.trangThai !== 'UNLOCKED' && tienTrinh.trangThai !== 'REJECTED') {
            throw new RpcException({ statusCode: 400, message: 'Mốc chưa mở, đang chờ duyệt hoặc đã đạt' });
        }

        // ===== Kiểm tra file =====
        // document.get tự kiểm tra: file tồn tại và thuộc đúng NCS này (sai thì ném 404/403)
        const thongTinFile = await this.callDocument<{ documentType: string }>('document.get', {
            nguoiDung: { id: userId, laNhanVien: false, ncsId: ncs.id },
            id: fileId,
        });
        // NCS xem được cả file QUYET_DINH của mình, nhưng chỉ file minh chứng mới được nộp
        if (thongTinFile.documentType !== 'MINH_CHUNG_MOC') {
            throw new RpcException({ statusCode: 400, message: 'File này không phải file minh chứng' });
        }
        // Một file chỉ được dùng cho một lần nộp
        const daDung = await this.prisma.minhChungMoc.findFirst({ where: { fileId } });
        if (daDung) {
            throw new RpcException({ statusCode: 409, message: 'File này đã được dùng cho một lần nộp khác' });
        }

        const soLanDaNop = await this.prisma.minhChungMoc.count({
            where: { tienTrinhId: tienTrinh.id },
        });

        const minhChungMoi = await this.prisma.$transaction(async (tx) => {
            const kq = await tx.tienTrinhNcs.updateMany({
                where: {
                    id: tienTrinh.id,
                    version: tienTrinh.version
                },
                data: {
                    trangThai: 'PENDING_REVIEW',
                    submittedAt: new Date(),
                    version: {
                        increment: 1
                    }
                },
            });
            if (kq.count === 0) {
                throw new RpcException({ statusCode: 409, message: 'Mốc vừa thay đổi, vui lòng tải lại' });
            }

            return tx.minhChungMoc.create({
                data: {
                    tienTrinhId: tienTrinh.id,
                    lanNop: soLanDaNop + 1,
                    fileId,
                    ghiChuNcs: ghiChu
                },
            });
        });

        // Bắn thông báo cho Giáo vụ và GVHD khi NCS nộp minh chứng mốc
        try {
            const recipientUserIds: string[] = [];

            // 1. GVHD của NCS
            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: ncs.id, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            for (const pc of phanCongs) {
                if (pc.gvhd?.userId) recipientUserIds.push(pc.gvhd.userId);
            }

            // 2. Tài khoản Giáo vụ (GIAO_VU)
            try {
                const giaoVus = await this.callAuth<{ id: string }[]>('auth.get-users-by-role', { role: 'GIAO_VU' });
                if (Array.isArray(giaoVus)) {
                    for (const gv of giaoVus) {
                        if (gv.id) recipientUserIds.push(gv.id);
                    }
                }
            } catch (authErr) {
                this.logger.warn(`Không lấy được danh sách Giáo vụ từ auth-service: ${(authErr as Error).message}`);
            }

            const uniqueRecipients = [...new Set(recipientUserIds)];
            if (uniqueRecipients.length > 0) {
                this.thongBao.gui({
                    userIds: uniqueRecipients,
                    loai: 'NCS_NOP_MINH_CHUNG',
                    duLieu: {
                        thuTu,
                        tenNcs: ncs.hoTen,
                        mshv: ncs.mshv,
                    },
                    khoaTrung: `NOP_MINH_CHUNG:${tienTrinh.id}:${minhChungMoi.lanNop}`,
                });
            }
        } catch (err) {
            this.logger.warn(`Không thể gửi thông báo NCS nộp minh chứng: ${(err as Error).message}`);
        }

        return minhChungMoi;
    }

    //ncs tự xem tiến trình của mình 
    async tienTrinhCuaToi(userId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
            select: { id: true, mshv: true, hoTen: true, lop: true, trangThai: true, hanBuocThoiHoc: true },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Bạn chưa có hồ sơ NCS' });
        }
        return this.layTienTrinh(ncs);
    }

    // Giáo vụ xem tiến trình của một NCS bất kỳ
    async tienTrinhCuaNcs(ncsId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { id: ncsId },
            select: { id: true, mshv: true, hoTen: true, lop: true, trangThai: true, hanBuocThoiHoc: true },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
        }
        return this.layTienTrinh(ncs);
    }

    //lấy 9 mốc tiến trình kèm lịch sử nộp của từng mốc
    private async layTienTrinh(ncs: {
        id: string;
        mshv: string;
        hoTen: string;
        lop: string | null;
        trangThai: string;
        hanBuocThoiHoc: Date;
    }) {
        const danhSach = await this.prisma.tienTrinhNcs.findMany({
            where: { ncsId: ncs.id },
            orderBy: { moc: { thuTu: "asc" } },
            select: {
                id: true,
                trangThai: true,
                openedAt: true,
                submittedAt: true,
                passedAt: true,
                moc: {
                    select: {
                        thuTu: true,
                        tenMoc: true,
                        moTa: true,
                        yeuCauDiem: true
                    }
                },
                minhChungs: {
                    orderBy: { lanNop: "asc" },
                    select: {
                        id: true,
                        lanNop: true,
                        fileId: true,
                        ghiChuNcs: true,
                        trangThai: true,
                        diemTrungBinh: true,
                        lyDoTuChoi: true,
                        ngayNop: true,
                        ngayDuyet: true,
                        phieuNhanXets: {
                            where: { deletedAt: null },
                            orderBy: { createdAt: 'asc' },
                        }
                    }
                }
            }
        })
        const hanNcs = await this.han.tinhHanCacMoc(ncs.id);
        const duDieuKienNop =
            (ncs.trangThai === 'DANG_HOC' || ncs.trangThai === 'GIA_HAN') &&
            (!ncs.hanBuocThoiHoc || layNgay(new Date()) <= ncs.hanBuocThoiHoc);

        return {
            ncs,
            hanCuaNcs: hanNcs.hanCuaNcs,
            tienTrinhs: danhSach.map((tt) => ({
                ...tt,
                //FE dùng cờ này để bật tắt nút nộp minh chứng của mốc đó
                coTheNop: duDieuKienNop && (tt.trangThai === "UNLOCKED" || tt.trangThai === "REJECTED"),
                han: hanNcs.hanHieuLucCuaMoc[tt.moc.thuTu] ?? null,
            }))
        }
    }

    // Giáo vụ: các mốc đang chờ duyệt, nộp trước xếp trước
    async danhSachChoDuyet(query?: ListPendingMilestonesQueryDto) {
        const where: Prisma.TienTrinhNcsWhereInput = {
            trangThai: 'PENDING_REVIEW',
            ...(query?.thuTu !== undefined ? { moc: { thuTu: query.thuTu } } : {}),
        };
        const select = {
            id: true,
            submittedAt: true,
            ncs: { select: { id: true, mshv: true, hoTen: true, lop: true } },
            moc: { select: { thuTu: true, tenMoc: true, yeuCauDiem: true } },
            // Chỉ lấy lần nộp mới nhất, chính là lần đang chờ duyệt
            minhChungs: {
                orderBy: { lanNop: 'desc' as const },
                take: 1,
                select: {
                    id: true, lanNop: true, fileId: true, ghiChuNcs: true, ngayNop: true,
                    _count: { select: { phieuNhanXets: { where: { deletedAt: null } } } },
                },
            },
        };

        const mapItem = ({ minhChungs, ...tienTrinh }: any) => ({
            ...tienTrinh,
            minhChungMoiNhat: minhChungs[0] ?? null,
        });

        const wantPagination = query?.page != null && query?.limit != null;
        if (!wantPagination) {
            const danhSach = await this.prisma.tienTrinhNcs.findMany({
                where,
                orderBy: { submittedAt: 'asc' },
                select,
            });
            return danhSach.map(mapItem);
        }

        const page = Math.max(1, Number(query.page));
        const limit = Math.min(100, Math.max(1, Number(query.limit)));
        const skip = (page - 1) * limit;

        const [danhSach, total] = await Promise.all([
            this.prisma.tienTrinhNcs.findMany({
                where,
                orderBy: { submittedAt: 'asc' },
                select,
                skip,
                take: limit,
            }),
            this.prisma.tienTrinhNcs.count({ where }),
        ]);

        return {
            data: danhSach.map(mapItem),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    // Lấy mốc đang chờ duyệt cùng lần nộp mới nhất, sai trạng thái thì báo lỗi
    private async layMocChoDuyet(tienTrinhId: string) {
        const tienTrinh = await this.prisma.tienTrinhNcs.findUnique({
            where: { id: tienTrinhId },
            include: {
                moc: true,
                ncs: {
                    select: {
                        id: true,
                        userId: true,
                        hoTen: true,
                        mshv: true,
                        trangThai: true,
                        hanBuocThoiHoc: true,
                    },
                },
                minhChungs: {
                    orderBy: {
                        lanNop: 'desc'
                    },
                    take: 1
                },
            },
        });
        if (!tienTrinh) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tiến trình' });
        }
        if (tienTrinh.trangThai !== 'PENDING_REVIEW') {
            throw new RpcException({ statusCode: 409, message: 'Mốc không ở trạng thái chờ duyệt' });
        }
        if (!tienTrinh.ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS liên kết' });
        }
        if (tienTrinh.ncs.trangThai !== 'DANG_HOC' && tienTrinh.ncs.trangThai !== 'GIA_HAN') {
            throw new RpcException({
                statusCode: 403,
                message: 'Hồ sơ NCS không ở trạng thái đang học, không thể duyệt hoặc từ chối mốc',
            });
        }
        if (tienTrinh.ncs.hanBuocThoiHoc && layNgay(new Date()) > tienTrinh.ncs.hanBuocThoiHoc) {
            throw new RpcException({
                statusCode: 403,
                message: 'NCS đã vượt quá tổng thời gian đào tạo tối đa (72 tháng), không thể duyệt hoặc từ chối mốc',
            });
        }
        const minhChung = tienTrinh.minhChungs[0];
        if (!minhChung || minhChung.trangThai !== 'PENDING_REVIEW') {
            throw new RpcException({ statusCode: 409, message: 'Không tìm thấy lần nộp đang chờ duyệt' });
        }
        return { tienTrinh, minhChung };
    }

    async duyetMoc(actorId: string, tienTrinhId: string, quyetDinhId: string) {
        const { tienTrinh, minhChung } = await this.layMocChoDuyet(tienTrinhId);

        //Kiểm tra căn cứ pháp lý
        const quyetDinh = await this.prisma.quyetDinh.findUnique({
            where: {
                id: quyetDinhId
            }
        });
        if (!quyetDinh) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
        }
        if (quyetDinh.loai !== 'CAN_CU_DUYET_MOC' || quyetDinh.trangThai !== 'HIEU_LUC') {
            throw new RpcException({
                statusCode: 400,
                message: 'Quyết định phải thuộc loại CAN_CU_DUYET_MOC và còn hiệu lực',
            });
        }
        if (quyetDinh.ncsId && quyetDinh.ncsId !== tienTrinh.ncsId) {
            throw new RpcException({ statusCode: 400, message: 'Quyết định này thuộc về NCS khác' });
        }

        // Mốc yêu cầu điểm: tính trung bình các phiếu nhận xét
        let diemTrungBinh: number | null = null;
        if (tienTrinh.moc.yeuCauDiem) {
            const tk = await this.tongHopPhieu(minhChung.id);
            if (!tk.duPhieu) {
                throw new RpcException({
                    statusCode: 400,
                    message: `Mốc này cần tối thiểu ${tk.soPhieuToiThieu} phiếu nhận xét, hiện có ${tk.soPhieu}`,
                });
            }
            diemTrungBinh = tk.diemTrungBinh ?? 0;
            if (diemTrungBinh < DIEM_DAT) {
                throw new RpcException({
                    statusCode: 400,
                    message: `Điểm trung bình ${diemTrungBinh} chưa đạt (cần từ ${DIEM_DAT}), hãy từ chối mốc này`,
                });
            }
        }

        const now = new Date();
        const ketQua = await this.prisma.$transaction(async (tx) => {
            const currentNcs = await tx.nghienCuuSinh.findUnique({
                where: { id: tienTrinh.ncsId },
                select: { trangThai: true, hanBuocThoiHoc: true },
            });
            if (!currentNcs || (currentNcs.trangThai !== 'DANG_HOC' && currentNcs.trangThai !== 'GIA_HAN')) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'Hồ sơ NCS không ở trạng thái đang học, không thể duyệt mốc',
                });
            }
            if (currentNcs.hanBuocThoiHoc && layNgay(now) > currentNcs.hanBuocThoiHoc) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'NCS đã vượt quá tổng thời gian đào tạo tối đa (72 tháng), không thể duyệt mốc',
                });
            }

            // Chỉ cập nhật nếu mốc vẫn còn đúng version và đang chờ duyệt (chống duyệt trùng)
            const kq = await tx.tienTrinhNcs.updateMany({
                where: {
                    id: tienTrinh.id,
                    version: tienTrinh.version,
                    trangThai: 'PENDING_REVIEW'
                },
                data: {
                    trangThai: 'PASSED',
                    passedAt: now,
                    version: {
                        increment: 1
                    }
                },
            });
            if (kq.count === 0) {
                throw new RpcException({ statusCode: 409, message: 'Mốc vừa được xử lý, vui lòng tải lại' });
            }

            await tx.minhChungMoc.update({
                where: { id: minhChung.id },
                data: {
                    trangThai: 'PASSED',
                    quyetDinhId,
                    nguoiDuyetId: actorId,
                    ngayDuyet: now,
                    diemTrungBinh,
                },
            });

            // Mở khóa mốc kế tiếp (mốc 9 không có mốc sau nên count = 0, không sao)
            const mocKe = await tx.tienTrinhNcs.updateMany({
                where: {
                    ncsId: tienTrinh.ncsId,
                    moc: { thuTu: tienTrinh.moc.thuTu + 1 },
                    trangThai: 'LOCKED',
                },
                data: {
                    trangThai: 'UNLOCKED',
                    openedAt: now,
                    version: { increment: 1 }
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId,
                    action: 'MILESTONE_APPROVE',
                    entityType: 'TienTrinhNcs',
                    entityId: tienTrinh.id,
                    ncsId: tienTrinh.ncsId,
                    oldValue: { trangThai: 'PENDING_REVIEW' },
                    newValue: {
                        trangThai: 'PASSED',
                        thuTu: tienTrinh.moc.thuTu,
                        lanNop: minhChung.lanNop,
                        minhChungId: minhChung.id,
                        quyetDinhId,
                        diemTrungBinh,
                    },
                },
            });

            return {
                tienTrinhId: tienTrinh.id,
                trangThai: 'PASSED',
                diemTrungBinh,
                mocKeTiep: mocKe.count > 0 ? tienTrinh.moc.thuTu + 1 : null,
            };
        });

        // Bắn thông báo không đồng bộ (fire-and-forget) cho NCS và GVHD khi mốc được duyệt
        try {
            // Thông báo cho NCS
            if (tienTrinh.ncs?.userId) {
                this.thongBao.gui({
                    userIds: [tienTrinh.ncs.userId],
                    loai: 'MOC_DUOC_DUYET',
                    duLieu: {
                        thuTu: tienTrinh.moc.thuTu,
                        mocKeTiep: ketQua.mocKeTiep,
                    },
                    khoaTrung: `DUYET_MOC:${tienTrinh.id}:${minhChung.lanNop}`,
                });
            }

            // Thông báo cho GVHD
            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: tienTrinh.ncsId, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            const gvhdUserIds = phanCongs
                .map((pc) => pc.gvhd?.userId)
                .filter((id): id is string => typeof id === 'string' && id.length > 0);

            if (gvhdUserIds.length > 0) {
                this.thongBao.gui({
                    userIds: gvhdUserIds,
                    loai: 'GVHD_MOC_DUOC_DUYET',
                    duLieu: {
                        thuTu: tienTrinh.moc.thuTu,
                        mocKeTiep: ketQua.mocKeTiep,
                        tenNcs: tienTrinh.ncs?.hoTen,
                        mshv: tienTrinh.ncs?.mshv,
                    },
                    khoaTrung: `GVHD_DUYET_MOC:${tienTrinh.id}:${minhChung.lanNop}`,
                });
            }
        } catch (err) {
            this.logger.warn(`Không thể gửi sự kiện thông báo duyệt mốc: ${(err as Error).message}`);
        }

        return ketQua;
    }

    async tuChoiMoc(actorId: string, tienTrinhId: string, lyDo: string) {
        const { tienTrinh, minhChung } = await this.layMocChoDuyet(tienTrinhId);
        const now = new Date();
        const ketQua = await this.prisma.$transaction(async (tx) => {
            const currentNcs = await tx.nghienCuuSinh.findUnique({
                where: { id: tienTrinh.ncsId },
                select: { trangThai: true, hanBuocThoiHoc: true },
            });
            if (!currentNcs || (currentNcs.trangThai !== 'DANG_HOC' && currentNcs.trangThai !== 'GIA_HAN')) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'Hồ sơ NCS không ở trạng thái đang học, không thể từ chối mốc',
                });
            }
            if (currentNcs.hanBuocThoiHoc && layNgay(now) > currentNcs.hanBuocThoiHoc) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'NCS đã vượt quá tổng thời gian đào tạo tối đa (72 tháng), không thể từ chối mốc',
                });
            }

            const kq = await tx.tienTrinhNcs.updateMany({
                where: { id: tienTrinh.id, version: tienTrinh.version, trangThai: 'PENDING_REVIEW' },
                data: { trangThai: 'REJECTED', version: { increment: 1 } },
            });
            if (kq.count === 0) {
                throw new RpcException({ statusCode: 409, message: 'Mốc vừa được xử lý, vui lòng tải lại' });
            }

            // Lần nộp bị từ chối được giữ nguyên làm lịch sử, NCS nộp lại sẽ tạo dòng mới
            await tx.minhChungMoc.update({
                where: { id: minhChung.id },
                data: {
                    trangThai: 'REJECTED',
                    lyDoTuChoi: lyDo,
                    nguoiDuyetId: actorId,
                    ngayDuyet: now
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId,
                    action: 'MILESTONE_REJECT',
                    entityType: 'TienTrinhNcs',
                    entityId: tienTrinh.id,
                    ncsId: tienTrinh.ncsId,
                    oldValue: { trangThai: 'PENDING_REVIEW' },
                    newValue: {
                        trangThai: 'REJECTED',
                        thuTu: tienTrinh.moc.thuTu,
                        lanNop: minhChung.lanNop,
                        minhChungId: minhChung.id,
                        lyDo,
                    },
                },
            });

            return { tienTrinhId: tienTrinh.id, trangThai: 'REJECTED' };
        });

        // Bắn thông báo không đồng bộ cho NCS và GVHD khi mốc bị từ chối
        try {
            // Thông báo cho NCS
            if (tienTrinh.ncs?.userId) {
                this.thongBao.gui({
                    userIds: [tienTrinh.ncs.userId],
                    loai: 'MOC_BI_TU_CHOI',
                    duLieu: {
                        thuTu: tienTrinh.moc.thuTu,
                        lyDo,
                    },
                    khoaTrung: `TU_CHOI_MOC:${tienTrinh.id}:${minhChung.lanNop}`,
                });
            }

            // Thông báo cho GVHD
            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: tienTrinh.ncsId, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            const gvhdUserIds = phanCongs
                .map((pc) => pc.gvhd?.userId)
                .filter((id): id is string => typeof id === 'string' && id.length > 0);

            if (gvhdUserIds.length > 0) {
                this.thongBao.gui({
                    userIds: gvhdUserIds,
                    loai: 'GVHD_MOC_BI_TU_CHOI',
                    duLieu: {
                        thuTu: tienTrinh.moc.thuTu,
                        lyDo,
                        tenNcs: tienTrinh.ncs?.hoTen,
                        mshv: tienTrinh.ncs?.mshv,
                    },
                    khoaTrung: `GVHD_TU_CHOI_MOC:${tienTrinh.id}:${minhChung.lanNop}`,
                });
            }
        } catch (err) {
            this.logger.warn(`Không thể gửi sự kiện thông báo từ chối mốc: ${(err as Error).message}`);
        }

        return ketQua;
    }

    // Tổng hợp phiếu của một lần nộp: số phiếu, điểm trung bình, đã đủ phiếu chưa
    private async tongHopPhieu(minhChungId: string, db: Prisma.TransactionClient = this.prisma) {
        const tk = await db.phieuNhanXet.aggregate({
            where: { minhChungId, deletedAt: null },
            _avg: { diem: true },
            _count: { _all: true },
        });
        const soPhieu = tk._count._all;
        return {
            soPhieu,
            soPhieuToiThieu: SO_PHIEU_TOI_THIEU,
            diemTrungBinh: soPhieu > 0 ? Math.round(Number(tk._avg.diem) * 100) / 100 : null,
            duPhieu: soPhieu >= SO_PHIEU_TOI_THIEU,
        };
    }

    private async layMinhChungNhapPhieu(minhChungId: string) {
        const minhChung = await this.prisma.minhChungMoc.findUnique({
            where: {
                id: minhChungId
            },
            include: {
                tienTrinh: {
                    include: {
                        moc: true
                    }
                }
            },
        });
        if (!minhChung) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy lần nộp' });
        }
        if (!minhChung.tienTrinh.moc.yeuCauDiem) {
            throw new RpcException({ statusCode: 400, message: 'Mốc này không yêu cầu phiếu nhận xét' });
        }
        if (minhChung.trangThai !== 'PENDING_REVIEW' || minhChung.tienTrinh.trangThai !== 'PENDING_REVIEW') {
            throw new RpcException({ statusCode: 409, message: 'Lần nộp này đã được xử lý, không thể thay đổi phiếu' });
        }

        return minhChung;
    }

    private async khoaMocNhapPhieu(tx: Prisma.TransactionClient, tienTrinh: { id: string; version: number }) {
        // Dùng chung version với duyệt/từ chối để hai thao tác không ghi đè nhau.
        const result = await tx.tienTrinhNcs.updateMany({
            where: { id: tienTrinh.id, version: tienTrinh.version, trangThai: 'PENDING_REVIEW' },
            data: { version: { increment: 1 } },
        });
        if (result.count === 0) {
            throw new RpcException({ statusCode: 409, message: 'Mốc vừa thay đổi hoặc đã được xử lý, vui lòng tải lại' });
        }
    }

    private async kiemTraFilePhieu(fileId: string | null | undefined, actorId: string) {
        if (!fileId) return;
        const file = await this.callDocument<{ documentType: string }>('document.get', {
            nguoiDung: { id: actorId, laNhanVien: true },
            id: fileId,
        });
        if (file.documentType !== 'PHIEU_NHAN_XET') {
            throw new RpcException({ statusCode: 400, message: 'File đính kèm phải thuộc loại PHIEU_NHAN_XET' });
        }
    }

    private xuLyLoiLuuFilePhieu(error: unknown, fileId?: string | null): never {
        // Bắt tại thao tác ghi phiếu để ràng buộc unique vẫn bảo vệ khi có yêu cầu đồng thời.
        if (fileId && typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            throw new RpcException({
                statusCode: 409,
                code: 'PHIEU_TRUNG_FILE',
                message: 'Tệp này đã được gắn với một phiếu nhận xét khác. Vui lòng chọn tệp khác.',
            });
        }
        throw error;
    }

    private async kiemTraTrungPhieu(
        tx: Prisma.TransactionClient,
        minhChungId: string,
        tenNguoiCham: string,
        donVi: string | null,
        phieuId?: string,
    ) {
        const cacPhieu = await tx.phieuNhanXet.findMany({
            where: { minhChungId, deletedAt: null, id: phieuId ? { not: phieuId } : undefined },
            select: { tenNguoiCham: true, donViNguoiCham: true },
        });
        const chuanHoa = (s: string | null) => (s ?? '').trim().normalize('NFC').toLowerCase();
        const trung = cacPhieu.some((phieu) =>
            chuanHoa(phieu.tenNguoiCham) === chuanHoa(tenNguoiCham) &&
            chuanHoa(phieu.donViNguoiCham) === chuanHoa(donVi),
        );
        if (trung) {
            throw new RpcException({
                statusCode: 409,
                code: 'PHIEU_TRUNG_NGUOI_CHAM',
                message: `Đã có phiếu của "${tenNguoiCham}" (${donVi ?? 'không ghi đơn vị'}) cho lần nộp này. Nếu đây là người chấm khác trùng tên, hãy xác nhận để lưu.`,
            });
        }
    }

    private async kiemTraChenhLechDiem(tx: Prisma.TransactionClient, minhChungId: string) {
        const tatCaPhieu = await tx.phieuNhanXet.findMany({
            where: { minhChungId, deletedAt: null },
            select: { diem: true, tenNguoiCham: true },
        });
        if (tatCaPhieu.length >= 2) {
            const dsDiem = tatCaPhieu.map(p => Number(p.diem));
            const maxDiem = Math.max(...dsDiem);
            const minDiem = Math.min(...dsDiem);

            // Quy tắc 2: Chênh lệch biên không vượt quá 3.0 điểm
            const chenhLechBien = Math.round((maxDiem - minDiem) * 100) / 100;
            if (chenhLechBien > 3.0) {
                throw new RpcException({
                    statusCode: 400,
                    message: `Chênh lệch điểm giữa các thành viên Tiểu ban (${chenhLechBien} điểm) vượt quá 3.0 điểm cho phép (cao nhất: ${maxDiem}, thấp nhất: ${minDiem}). Vui lòng kiểm tra lại điểm.`,
                });
            }

            // Quy tắc 3: Chênh lệch so với ĐTB không vượt quá 2.0 điểm
            const diemTB = dsDiem.reduce((s, v) => s + v, 0) / dsDiem.length;
            const viPham = tatCaPhieu.filter(p => {
                const chenhLech = Math.abs(Number(p.diem) - diemTB);
                return Math.round(chenhLech * 100) / 100 > 2.0;
            });
            if (viPham.length > 0) {
                const dtbLamTron = Math.round(diemTB * 100) / 100;
                const danhSach = viPham
                    .map(p => `"${p.tenNguoiCham}" (${Number(p.diem)} điểm, chênh ${Math.round(Math.abs(Number(p.diem) - diemTB) * 100) / 100})`)
                    .join(', ');
                throw new RpcException({
                    statusCode: 400,
                    message: `Điểm của ${danhSach} vượt quá 2.0 điểm so với điểm trung bình Tiểu ban (ĐTB: ${dtbLamTron}). Vui lòng kiểm tra lại điểm.`,
                });
            }
        }
    }

    async nhapPhieuNhanXet(d: { actorId: string; minhChungId: string; dto: CreateEvaluationDto }) {
        const minhChung = await this.layMinhChungNhapPhieu(d.minhChungId);
        const tenNguoiCham = d.dto.tenNguoiCham.trim();
        if (!tenNguoiCham) {
            throw new RpcException({ statusCode: 400, message: 'Tên người chấm không được bỏ trống' });
        }
        const donViNguoiCham = d.dto.donViNguoiCham?.trim() || null;
        await this.kiemTraFilePhieu(d.dto.fileId, d.actorId);

        const { phieu, tongHop } = await this.prisma.$transaction(async (tx) => {
            await this.khoaMocNhapPhieu(tx, minhChung.tienTrinh);
            if (!d.dto.xacNhanTrung) {
                await this.kiemTraTrungPhieu(tx, minhChung.id, tenNguoiCham, donViNguoiCham);
            }

            const moi = await tx.phieuNhanXet.create({
                data: {
                    minhChungId: minhChung.id,
                    tenNguoiCham,
                    donViNguoiCham,
                    diem: d.dto.diem,
                    nhanXet: d.dto.nhanXet?.trim() || null,
                    fileId: d.dto.fileId ?? null,
                    nhapBoiId: d.actorId,
                },
            }).catch((error: unknown) => this.xuLyLoiLuuFilePhieu(error, d.dto.fileId));
            await this.kiemTraChenhLechDiem(tx, minhChung.id);
            await tx.auditLog.create({
                data: {
                    actorId: d.actorId,
                    action: 'EVALUATION_CREATE',
                    entityType: 'PhieuNhanXet',
                    entityId: moi.id,
                    ncsId: minhChung.tienTrinh.ncsId,
                    newValue: {
                        minhChungId: minhChung.id,
                        thuTu: minhChung.tienTrinh.moc.thuTu,
                        tenNguoiCham,
                        diem: d.dto.diem,
                        fileId: moi.fileId,
                    },
                },
            });
            return { phieu: moi, tongHop: await this.tongHopPhieu(minhChung.id, tx) };
        });

        // Gửi thông báo có phiếu nhận xét mới cho NCS và GVHD
        try {
            const recipientUserIds: string[] = [];
            const ncs = await this.prisma.nghienCuuSinh.findUnique({
                where: { id: minhChung.tienTrinh.ncsId },
                select: { userId: true, hoTen: true, mshv: true },
            });
            if (ncs?.userId) recipientUserIds.push(ncs.userId);

            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: minhChung.tienTrinh.ncsId, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            for (const pc of phanCongs) {
                if (pc.gvhd?.userId) recipientUserIds.push(pc.gvhd.userId);
            }

            if (recipientUserIds.length > 0) {
                this.thongBao.gui({
                    userIds: recipientUserIds,
                    loai: 'CO_PHIEU_NHAN_XET_MOI',
                    duLieu: {
                        thuTu: minhChung.tienTrinh.moc.thuTu,
                        tenNguoiCham,
                        diem: d.dto.diem,
                        tenNcs: ncs?.hoTen,
                        mshv: ncs?.mshv,
                    },
                    khoaTrung: `PHIEU_NX:${phieu.id}`,
                });
            }
        } catch (err) {
            this.logger.warn(`Không thể gửi thông báo phiếu nhận xét: ${(err as Error).message}`);
        }

        // Trả luôn tổng hợp để FE hiện "2/3 phiếu" sau mỗi lần nhập
        return { phieu, tongHop };
    }

    private async layPhieuChuaXoa(tx: Prisma.TransactionClient, minhChungId: string, phieuId: string) {
        const phieu = await tx.phieuNhanXet.findFirst({
            where: { id: phieuId, minhChungId, deletedAt: null },
        });
        if (!phieu) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy phiếu nhận xét' });
        }
        return phieu;
    }

    async suaPhieuNhanXet(d: { actorId: string; minhChungId: string; phieuId: string; dto: UpdateEvaluationDto }) {
        const minhChung = await this.layMinhChungNhapPhieu(d.minhChungId);
        const { dto } = d;
        await this.kiemTraFilePhieu(dto.fileId, d.actorId);

        return this.prisma.$transaction(async (tx) => {
            await this.khoaMocNhapPhieu(tx, minhChung.tienTrinh);
            const cu = await this.layPhieuChuaXoa(tx, minhChung.id, d.phieuId);
            const tenNguoiCham = dto.tenNguoiCham === undefined ? cu.tenNguoiCham : dto.tenNguoiCham.trim();
            if (!tenNguoiCham) {
                throw new RpcException({ statusCode: 400, message: 'Tên người chấm không được bỏ trống' });
            }
            const donViNguoiCham = dto.donViNguoiCham === undefined
                ? cu.donViNguoiCham
                : dto.donViNguoiCham?.trim() || null;
            if (!dto.xacNhanTrung && (tenNguoiCham !== cu.tenNguoiCham || donViNguoiCham !== cu.donViNguoiCham)) {
                await this.kiemTraTrungPhieu(tx, minhChung.id, tenNguoiCham, donViNguoiCham, cu.id);
            }

            const phieu = await tx.phieuNhanXet.update({
                where: { id: cu.id },
                data: {
                    tenNguoiCham,
                    donViNguoiCham,
                    diem: dto.diem,
                    nhanXet: dto.nhanXet === undefined ? undefined : dto.nhanXet?.trim() || null,
                    fileId: dto.fileId,
                    capNhatBoiId: d.actorId,
                },
            }).catch((error: unknown) => this.xuLyLoiLuuFilePhieu(error, dto.fileId));
            if (dto.diem !== undefined && dto.diem !== Number(cu.diem)) {
                await this.kiemTraChenhLechDiem(tx, minhChung.id);
            }

            await tx.auditLog.create({
                data: {
                    actorId: d.actorId,
                    action: 'EVALUATION_UPDATE',
                    entityType: 'PhieuNhanXet',
                    entityId: phieu.id,
                    ncsId: minhChung.tienTrinh.ncsId,
                    oldValue: { ...cu, diem: Number(cu.diem), createdAt: cu.createdAt.toISOString(), updatedAt: cu.updatedAt.toISOString(), deletedAt: null },
                    newValue: { ...phieu, diem: Number(phieu.diem), createdAt: phieu.createdAt.toISOString(), updatedAt: phieu.updatedAt.toISOString(), deletedAt: null },
                },
            });
            return { phieu, tongHop: await this.tongHopPhieu(minhChung.id, tx) };
        });
    }

    async xoaPhieuNhanXet(d: { actorId: string; minhChungId: string; phieuId: string }) {
        const minhChung = await this.layMinhChungNhapPhieu(d.minhChungId);

        return this.prisma.$transaction(async (tx) => {
            await this.khoaMocNhapPhieu(tx, minhChung.tienTrinh);
            const cu = await this.layPhieuChuaXoa(tx, minhChung.id, d.phieuId);
            const deletedAt = new Date();
            await tx.phieuNhanXet.update({
                where: { id: cu.id },
                data: { deletedAt, xoaBoiId: d.actorId },
            });
            await tx.auditLog.create({
                data: {
                    actorId: d.actorId,
                    action: 'EVALUATION_DELETE',
                    entityType: 'PhieuNhanXet',
                    entityId: cu.id,
                    ncsId: minhChung.tienTrinh.ncsId,
                    newValue: { minhChungId: minhChung.id, deletedAt: deletedAt.toISOString(), fileId: cu.fileId },
                },
            });
            return { tongHop: await this.tongHopPhieu(minhChung.id, tx) };
        });
    }

    async danhSachPhieu(minhChungId: string) {
        const minhChung = await this.prisma.minhChungMoc.findUnique({
            where: { id: minhChungId },
            select: { id: true },
        });
        if (!minhChung) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy lần nộp' });
        }
        const phieus = await this.prisma.phieuNhanXet.findMany({
            where: { minhChungId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true, tenNguoiCham: true, donViNguoiCham: true,
                diem: true, nhanXet: true, fileId: true, nhapBoiId: true, createdAt: true,
                capNhatBoiId: true, updatedAt: true,
            },
        });
        return { phieus, tongHop: await this.tongHopPhieu(minhChungId) };
    }
}
