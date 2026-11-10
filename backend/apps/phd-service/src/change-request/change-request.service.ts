import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationClient } from '../notification/notification.client.js';
import { goiService } from '../helpers/call-service.util.js';
import {
    ApproveDeNghiDto,
    CreateChangeRequestDto,
    ListDeNghiQuery,
    SupervisorReviewDeNghiDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { LoaiDeNghiDieuChinh, LoaiQuyetDinh, Prisma, TrangThaiDeNghi } from '../generated/prisma/index.js';
import { truThang, congThang, chuanHoa, parseNgay } from '../helpers/validateData.util.js';

@Injectable()
export class ChangeRequestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notification: NotificationClient,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
    ) { }

    async create(userId: string, dto: CreateChangeRequestDto) {
        // Luồng đề nghị gia hạn học tập (GIA_HAN): Chỉ NCS được nộp
        if (dto.loai === 'GIA_HAN') {
            const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { userId } });
            if (!ncs) {
                throw new RpcException({ statusCode: 403, message: 'Chỉ Nghiên cứu sinh mới được nộp đơn đề nghị gia hạn học tập' });
            }
            if (dto.ncsId && dto.ncsId !== ncs.id) {
                throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền tạo đơn gia hạn cho NCS khác' });
            }
            if (ncs.trangThai !== 'DANG_HOC' && ncs.trangThai !== 'GIA_HAN') {
                throw new RpcException({ statusCode: 400, message: 'NCS không ở trạng thái đang học hoặc gia hạn, không thể gửi đề nghị' });
            }

            // Kiểm tra file minh chứng / báo cáo tiến độ bắt buộc
            if (!dto.fileId) {
                throw new RpcException({ statusCode: 400, message: 'NCS bắt buộc phải đính kèm file báo cáo tiến độ/minh chứng khi xin gia hạn' });
            }
            await this.kiemTraFile(userId, ncs.id, dto.fileId, false, ['DON_TU', 'MINH_CHUNG_MOC']);

            let thongBaoCanGui: { userIds: string[]; loai: string; duLieu: Record<string, unknown> } | null = null;

            const deNghi = await this.prisma.$transaction(async (tx) => {
                const dangCho = await tx.deNghiDieuChinh.count({
                    where: {
                        ncsId: ncs.id,
                        trangThai: { in: ['CHO_DUYET', 'CHO_GVHD_XAC_NHAN'] },
                    },
                });
                if (dangCho > 0) {
                    throw new RpcException({ statusCode: 409, message: 'NCS đang có một đề nghị chờ xử lý, hãy chờ kết quả hoặc hủy đề nghị đó' });
                }

                const kiemTra = await this.kiemTraGiaHan(tx, ncs, dto);

                const created = await tx.deNghiDieuChinh.create({
                    data: {
                        ncsId: ncs.id,
                        loai: 'GIA_HAN',
                        lyDo: dto.lyDo.trim(),
                        fileId: dto.fileId,
                        soThangGiaHan: kiemTra.soThangGiaHan,
                        hanMoiDeNghi: kiemTra.hanMoiDeNghi,
                        nguoiDeNghiId: userId,
                        trangThai: 'CHO_GVHD_XAC_NHAN',
                        xacNhanGvhds: {
                            create: kiemTra.phanCongs.map((pc) => ({
                                gvhdId: pc.gvhdId,
                            })),
                        },
                    },
                    include: {
                        xacNhanGvhds: {
                            include: {
                                gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true, email: true } },
                            },
                        },
                    },
                });

                const userIdsGvhd = kiemTra.phanCongs
                    .map((pc) => pc.gvhd.userId)
                    .filter((u): u is string => !!u);

                if (userIdsGvhd.length > 0) {
                    thongBaoCanGui = {
                        userIds: userIdsGvhd,
                        loai: 'DE_NGHI_GIA_HAN_CAN_XAC_NHAN',
                        duLieu: {
                            tenNcs: ncs.hoTen,
                            mshv: ncs.mshv,
                            soThangGiaHan: kiemTra.soThangGiaHan,
                        },
                    };
                }

                return created;
            });

            if (thongBaoCanGui) {
                this.notification.gui(thongBaoCanGui);
            }

            return deNghi;
        }

        // Các loại đề nghị khác (DOI_DE_TAI, DOI_GVHD)
        const ncsId = await this.xacDinhNcs(userId, dto);

        const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: ncsId } });
        if (!ncs) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
        if (ncs.trangThai !== 'DANG_HOC' && ncs.trangThai !== 'GIA_HAN') {
            throw new RpcException({ statusCode: 400, message: 'NCS không ở trạng thái đang học, không thể gửi đề nghị' });
        }

        // Kiểm tra file đính kèm nếu có
        if (dto.fileId) {
            await this.kiemTraFile(userId, ncsId, dto.fileId, false, ['DON_TU', 'MINH_CHUNG_MOC']);
        }

        return this.prisma.$transaction(async (tx) => {
            // Mỗi NCS chỉ có 1 đề nghị đang chờ duyệt/xử lý
            const dangCho = await tx.deNghiDieuChinh.count({
                where: {
                    ncsId,
                    trangThai: { in: ['CHO_DUYET', 'CHO_GVHD_XAC_NHAN'] },
                },
            });
            if (dangCho > 0) {
                throw new RpcException({ statusCode: 409, message: 'NCS đang có một đề nghị chờ duyệt, hãy chờ xử lý hoặc hủy đề nghị đó' });
            }

            // Kiểm tra riêng theo loại, hàm trả về true nếu gửi quá hạn
            let quaHan = false;
            if (dto.loai === 'DOI_DE_TAI') quaHan = await this.kiemTraDoiDeTai(tx, ncsId, dto);
            if (dto.loai === 'DOI_GVHD') quaHan = await this.kiemTraDoiGvhd(tx, ncs, dto);

            // Tạo đề nghị
            return tx.deNghiDieuChinh.create({
                data: {
                    ncsId,
                    loai: dto.loai as LoaiDeNghiDieuChinh,
                    lyDo: dto.lyDo,
                    fileId: dto.fileId,
                    batKhaKhang: quaHan && !!dto.batKhaKhang,
                    tenDeTaiMoi: dto.loai === 'DOI_DE_TAI' ? dto.tenDeTaiMoi!.trim() : null,
                    phanCongCuId: dto.loai === 'DOI_GVHD' ? dto.phanCongCuId : null,
                    gvhdMoiId: dto.loai === 'DOI_GVHD' ? dto.gvhdMoiId : null,
                    nguoiDeNghiId: userId,
                },
            });
        });
    }

    /** Kiểm tra điều kiện nộp đơn gia hạn */
    private async kiemTraGiaHan(
        tx: Prisma.TransactionClient,
        ncs: {
            id: string;
            hoTen: string;
            mshv: string;
            hanChinhQuy: Date;
            hanGiaHan: Date | null;
            hanBuocThoiHoc: Date;
        },
        dto: CreateChangeRequestDto,
    ): Promise<{ hanMoiDeNghi: Date; soThangGiaHan: number; phanCongs: any[] }> {
        // 1. Điều kiện bắt buộc: Mốc 2 (Tiểu luận tổng quan) phải đạt PASSED
        const moc2 = await tx.tienTrinhNcs.findFirst({
            where: {
                ncsId: ncs.id,
                moc: { thuTu: 2 },
            },
        });
        if (!moc2 || moc2.trangThai !== 'PASSED') {
            throw new RpcException({
                statusCode: 400,
                message: 'Điều kiện bắt buộc: Nghiên cứu sinh phải hoàn thành Mốc 2 (Tiểu luận tổng quan đạt PASSED) mới đủ điều kiện nộp đơn đề nghị gia hạn học tập',
            });
        }

        // 2. Kiểm tra bắt buộc có file minh chứng / báo cáo tiến độ
        if (!dto.fileId) {
            throw new RpcException({
                statusCode: 400,
                message: 'NCS bắt buộc phải đính kèm file báo cáo tiến độ/minh chứng khi xin gia hạn',
            });
        }

        // 3. Kiểm tra số tháng xin gia hạn
        const soThang = Number(dto.soThangGiaHan);
        if (!Number.isInteger(soThang) || soThang < 1 || soThang > 24) {
            throw new RpcException({
                statusCode: 400,
                message: 'Thời gian xin gia hạn đề xuất phải là số nguyên từ 1 đến 24 tháng',
            });
        }

        // 4. Kiểm tra thời gian nộp đơn: trước khi hết hạn đào tạo hiện tại 02 tháng
        // Đối với lần đầu: trước hanChinhQuy 02 tháng
        // Đối với lần 2 trở đi: trước hanGiaHan 02 tháng
        const hanHienTai = ncs.hanGiaHan ?? ncs.hanChinhQuy;
        const hanChotNop = truThang(hanHienTai, 2);
        const homNayStr = new Date().toISOString().slice(0, 10);
        const hanChotStr = hanChotNop.toISOString().slice(0, 10);

        if (homNayStr > hanChotStr) {
            throw new RpcException({
                statusCode: 400,
                message: `Đã quá thời hạn nộp đơn đề nghị gia hạn học tập. Quy định yêu cầu phải nộp trước khi hết thời gian đào tạo 02 tháng (hạn chót nộp đơn là ngày ${hanChotStr})`,
            });
        }

        // 5. Kiểm tra tổng thời gian gia hạn tối đa tích lũy không quá 24 tháng
        const cacLanTruoc = await tx.deNghiDieuChinh.findMany({
            where: {
                ncsId: ncs.id,
                loai: 'GIA_HAN',
                trangThai: 'DA_DUYET',
            },
            select: { soThangGiaHan: true },
        });
        let tongThangDaGiaHan = cacLanTruoc.reduce((sum, item) => sum + (item.soThangGiaHan ?? 0), 0);
        if (tongThangDaGiaHan === 0 && ncs.hanGiaHan) {
            const diffMonths =
                (ncs.hanGiaHan.getFullYear() - ncs.hanChinhQuy.getFullYear()) * 12 +
                (ncs.hanGiaHan.getMonth() - ncs.hanChinhQuy.getMonth());
            tongThangDaGiaHan = Math.max(0, diffMonths);
        }

        if (tongThangDaGiaHan + soThang > 24) {
            throw new RpcException({
                statusCode: 400,
                message: `Tổng thời gian gia hạn tích lũy không được vượt quá 24 tháng. NCS đã được gia hạn ${tongThangDaGiaHan} tháng, lần này chỉ có thể đề xuất tối đa thêm ${Math.max(0, 24 - tongThangDaGiaHan)} tháng`,
            });
        }

        // 6. Tính hạn mới và kiểm tra khung thời gian đào tạo toàn khóa <= 72 tháng (hanBuocThoiHoc)
        const hanMoiDeNghi = congThang(hanHienTai, soThang);
        if (hanMoiDeNghi > ncs.hanBuocThoiHoc) {
            throw new RpcException({
                statusCode: 400,
                message: `Tổng thời gian đào tạo bao gồm gia hạn (${hanMoiDeNghi.toISOString().slice(0, 10)}) tuyệt đối không được vượt quá 72 tháng kể từ ngày công nhận (hạn tối đa: ${ncs.hanBuocThoiHoc.toISOString().slice(0, 10)})`,
            });
        }

        // 7. Lấy danh sách GVHD hiệu lực của NCS
        const phanCongs = await tx.phanCongHuongDan.findMany({
            where: {
                ncsId: ncs.id,
                trangThai: 'DANG_HIEU_LUC',
            },
            include: { gvhd: true },
        });

        if (phanCongs.length === 0) {
            throw new RpcException({
                statusCode: 400,
                message: 'NCS chưa được phân công Giảng viên hướng dẫn hiệu lực, không thể gửi đơn đề nghị gia hạn',
            });
        }

        return { hanMoiDeNghi, soThangGiaHan: soThang, phanCongs };
    }

    /** Xác nhận đề nghị gia hạn từ GVHD (Đồng ý hoặc Từ chối) */
    async xacNhanGvhd(userId: string, id: string, dto: SupervisorReviewDeNghiDto) {
        const gvhd = await this.prisma.giangVienHuongDan.findUnique({ where: { userId } });
        if (!gvhd) {
            throw new RpcException({ statusCode: 403, message: 'Chỉ Giảng viên hướng dẫn mới có quyền xác nhận đề nghị này' });
        }

        let thongBaoCanGui: {
            loai: string;
            userIds: string[];
            duLieu: Record<string, unknown>;
        } | null = null;

        const ketQua = await this.prisma.$transaction(async (tx) => {
            const deNghi = await tx.deNghiDieuChinh.findUnique({
                where: { id },
                include: { ncs: true, xacNhanGvhds: true },
            });
            if (!deNghi) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề nghị' });
            if (deNghi.loai !== 'GIA_HAN') {
                throw new RpcException({ statusCode: 400, message: 'Xác nhận của GVHD chỉ áp dụng cho đơn đề nghị gia hạn học tập' });
            }
            if (deNghi.trangThai !== 'CHO_GVHD_XAC_NHAN') {
                throw new RpcException({ statusCode: 409, message: 'Đề nghị không ở trạng thái chờ GVHD xác nhận' });
            }

            const xacNhan = await tx.xacNhanGvhdDeNghi.findUnique({
                where: { deNghiId_gvhdId: { deNghiId: id, gvhdId: gvhd.id } },
            });
            if (!xacNhan) {
                throw new RpcException({ statusCode: 403, message: 'Bạn không thuộc danh sách GVHD cần xác nhận đề nghị này' });
            }
            if (xacNhan.dongY !== null) {
                throw new RpcException({ statusCode: 400, message: 'Bạn đã xác nhận đề nghị này rồi' });
            }

            await tx.xacNhanGvhdDeNghi.update({
                where: { id: xacNhan.id },
                data: {
                    dongY: dto.dongY,
                    nhanXet: dto.nhanXet?.trim() ?? null,
                    ngayXacNhan: new Date(),
                },
            });

            if (dto.dongY === false) {
                // GVHD từ chối -> dừng quy trình ngay lập tức, chuyển trạng thái TU_CHOI
                const lyDoTuChoi = dto.nhanXet?.trim()
                    ? `GVHD ${gvhd.hoTen} không đồng ý: ${dto.nhanXet.trim()}`
                    : `GVHD ${gvhd.hoTen} không đồng ý đề nghị gia hạn`;

                await tx.deNghiDieuChinh.update({
                    where: { id },
                    data: {
                        trangThai: 'TU_CHOI',
                        lyDoTuChoi,
                        nguoiDuyetId: userId,
                        ngayDuyet: new Date(),
                    },
                });

                await tx.auditLog.create({
                    data: {
                        actorId: userId,
                        action: 'DE_NGHI_GIA_HAN_GVHD_TU_CHOI',
                        entityType: 'DeNghiDieuChinh',
                        entityId: id,
                        ncsId: deNghi.ncsId,
                        oldValue: { trangThai: 'CHO_GVHD_XAC_NHAN' },
                        newValue: { trangThai: 'TU_CHOI', lyDoTuChoi, gvhdId: gvhd.id },
                    },
                });

                if (deNghi.ncs.userId) {
                    thongBaoCanGui = {
                        loai: 'DE_NGHI_GIA_HAN_GVHD_TU_CHOI',
                        userIds: [deNghi.ncs.userId],
                        duLieu: {
                            tenGvhd: gvhd.hoTen,
                            lyDo: dto.nhanXet?.trim() || 'GVHD không đồng ý đề nghị gia hạn',
                        },
                    };
                }
            } else {
                // GVHD đồng ý -> kiểm tra xem toàn bộ tập thể GVHD đã đồng ý chưa
                const chuaDongY = await tx.xacNhanGvhdDeNghi.count({
                    where: {
                        deNghiId: id,
                        OR: [{ dongY: null }, { dongY: false }],
                    },
                });

                if (chuaDongY === 0) {
                    // Tất cả GVHD đều đã đồng ý -> chuyển sang CHO_DUYET để Giáo vụ duyệt
                    await tx.deNghiDieuChinh.update({
                        where: { id },
                        data: {
                            trangThai: 'CHO_DUYET',
                        },
                    });

                    await tx.auditLog.create({
                        data: {
                            actorId: userId,
                            action: 'DE_NGHI_GIA_HAN_GVHD_DONG_Y_TOAN_BO',
                            entityType: 'DeNghiDieuChinh',
                            entityId: id,
                            ncsId: deNghi.ncsId,
                            oldValue: { trangThai: 'CHO_GVHD_XAC_NHAN' },
                            newValue: { trangThai: 'CHO_DUYET' },
                        },
                    });

                    if (deNghi.ncs.userId) {
                        thongBaoCanGui = {
                            loai: 'DE_NGHI_GIA_HAN_GVHD_DONG_Y',
                            userIds: [deNghi.ncs.userId],
                            duLieu: {
                                tenNcs: deNghi.ncs.hoTen,
                                mshv: deNghi.ncs.mshv,
                            },
                        };
                    }
                }
            }

            return tx.deNghiDieuChinh.findUnique({
                where: { id },
                include: {
                    ncs: { select: { id: true, mshv: true, hoTen: true } },
                    xacNhanGvhds: {
                        include: {
                            gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true, email: true } },
                        },
                    },
                },
            });
        });

        if (thongBaoCanGui) {
            this.notification.gui(thongBaoCanGui);
        }

        return ketQua;
    }

    /** Người gửi là NCS thì lấy chính họ. Là GVHD thì phải đang hướng dẫn NCS được chọn. */
    private async xacDinhNcs(userId: string, dto: CreateChangeRequestDto): Promise<string> {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { userId } });
        if (ncs) {
            if (dto.ncsId && dto.ncsId !== ncs.id) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'Bạn không có quyền tạo đề nghị cho NCS khác',
                });
            }
            return ncs.id;
        }

        const gv = await this.prisma.giangVienHuongDan.findUnique({ where: { userId } });
        if (!gv) throw new RpcException({ statusCode: 403, message: 'Chỉ NCS hoặc GVHD mới được gửi đề nghị' });
        if (!dto.ncsId) throw new RpcException({ statusCode: 400, message: 'GVHD cần chọn NCS (ncsId)' });

        const phanCong = await this.prisma.phanCongHuongDan.findFirst({
            where: { ncsId: dto.ncsId, gvhdId: gv.id, trangThai: 'DANG_HIEU_LUC' },
        });
        if (!phanCong) throw new RpcException({ statusCode: 403, message: 'Bạn không phải GVHD đang hiệu lực của NCS này' });
        return dto.ncsId;
    }

    /** Đổi đề tài. Trả về true nếu quá hạn mà có đánh dấu bất khả kháng. */
    private async kiemTraDoiDeTai(
        tx: Prisma.TransactionClient,
        ncsId: string,
        dto: CreateChangeRequestDto,
    ): Promise<boolean> {
        const deTai = await tx.deTai.findFirst({ where: { ncsId, trangThai: 'HIEU_LUC' } });
        if (!deTai) throw new RpcException({ statusCode: 400, message: 'NCS chưa có đề tài hiệu lực để đổi' });
        if (chuanHoa(deTai.tenDeTai) === chuanHoa(dto.tenDeTaiMoi!)) {
            throw new RpcException({ statusCode: 400, message: 'Tên đề tài mới trùng với tên đề tài hiện tại' });
        }

        // Hạn: NCS chưa nộp mốc 8
        const moc8 = await tx.tienTrinhNcs.findFirst({
            where: {
                ncsId,
                moc: { thuTu: 8 },
            },
        });
        const daNopMoc8 = !!moc8 && moc8.trangThai !== 'LOCKED' && moc8.trangThai !== 'UNLOCKED';

        if (daNopMoc8 && !dto.batKhaKhang) {
            throw new RpcException({ statusCode: 400, message: 'NCS đã đạt mốc 8, không thể đổi đề tài. Nếu thuộc trường hợp bất khả kháng, hãy đánh dấu bất khả kháng và nêu rõ trong lý do' });
        }
        return daNopMoc8;
    }

    /** Đổi GVHD. Trả về true nếu quá hạn mà có đánh dấu bất khả kháng. */
    private async kiemTraDoiGvhd(
        tx: Prisma.TransactionClient,
        ncs: { id: string; hanGiaHan: Date | null; hanChinhQuy: Date },
        dto: CreateChangeRequestDto,
    ): Promise<boolean> {
        const phanCongCu = await tx.phanCongHuongDan.findFirst({
            where: {
                id: dto.phanCongCuId,
                ncsId: ncs.id,
                trangThai: 'DANG_HIEU_LUC',
            },
        });
        if (!phanCongCu) throw new RpcException({ statusCode: 400, message: 'Phân công cần thay đổi không tồn tại hoặc không còn hiệu lực' });
        if (phanCongCu.gvhdId === dto.gvhdMoiId) throw new RpcException({ statusCode: 400, message: 'GVHD mới trùng với GVHD hiện tại' });

        const gvMoi = await tx.giangVienHuongDan.findUnique({ where: { id: dto.gvhdMoiId } });
        if (!gvMoi || !gvMoi.trangThai) throw new RpcException({ statusCode: 400, message: 'GVHD mới không tồn tại hoặc không còn hoạt động' });

        const daHuongDan = await tx.phanCongHuongDan.findFirst({
            where: {
                ncsId: ncs.id,
                gvhdId: dto.gvhdMoiId,
                trangThai: 'DANG_HIEU_LUC',
            },
        });
        if (daHuongDan) throw new RpcException({ statusCode: 400, message: 'GVHD mới đang hướng dẫn NCS này rồi' });

        // Hạn: gửi chậm nhất 12 tháng trước khi kết thúc khóa học
        const hanKetThuc = ncs.hanGiaHan ?? ncs.hanChinhQuy;
        const hanChotGui = truThang(hanKetThuc, 12);
        const quaHan = new Date() > hanChotGui;

        if (quaHan && !dto.batKhaKhang) {
            throw new RpcException({ statusCode: 400, message: `Đã quá hạn gửi đề nghị đổi GVHD (hạn chót ${hanChotGui.toISOString().slice(0, 10)}). Nếu thuộc trường hợp bất khả kháng, hãy đánh dấu bất khả kháng và nêu rõ trong lý do` });
        }
        return quaHan;
    }

    async list(userId: string, q: ListDeNghiQuery = {}) {
        const query = ((q as any)?.q ?? q ?? {}) as ListDeNghiQuery;

        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
            select: { id: true },
        });

        const gvhd = !ncs
            ? await this.prisma.giangVienHuongDan.findUnique({
                where: { userId },
                select: { id: true },
            })
            : null;

        let phamVi: Prisma.DeNghiDieuChinhWhereInput = {};

        if (ncs) {
            if (query?.ncsId && query.ncsId !== ncs.id) {
                throw new RpcException({
                    statusCode: 403,
                    message: 'Bạn không có quyền xem đề nghị của NCS khác',
                });
            }
            phamVi = { ncsId: ncs.id };
        } else if (gvhd) {
            const phanCong = await this.prisma.phanCongHuongDan.findMany({
                where: {
                    gvhdId: gvhd.id,
                    trangThai: 'DANG_HIEU_LUC',
                },
                select: { ncsId: true },
            });
            const danhSachNcsId = phanCong.map((p) => p.ncsId);

            const deNghiXacNhan = await this.prisma.xacNhanGvhdDeNghi.findMany({
                where: { gvhdId: gvhd.id },
                select: { deNghiId: true },
            });
            const deNghiIds = deNghiXacNhan.map((x) => x.deNghiId);

            if (query?.ncsId && !danhSachNcsId.includes(query.ncsId)) {
                phamVi = {
                    AND: [
                        { OR: [{ nguoiDeNghiId: userId }, { id: { in: deNghiIds } }] },
                        { ncsId: query.ncsId },
                    ],
                };
            } else {
                phamVi = {
                    OR: [
                        { nguoiDeNghiId: userId },
                        { ncsId: { in: danhSachNcsId } },
                        { id: { in: deNghiIds } },
                    ],
                };
            }
        }

        const where: Prisma.DeNghiDieuChinhWhereInput = {
            AND: [
                phamVi,
                {
                    ...(query?.trangThai && { trangThai: query.trangThai as TrangThaiDeNghi }),
                    ...(query?.loai && { loai: query.loai as LoaiDeNghiDieuChinh }),
                    ...(query?.ncsId && { ncsId: query.ncsId }),
                },
            ],
        };

        const page = Number(query?.page) > 0 ? Number(query.page) : 1;
        const limit = Number(query?.limit) > 0 ? Number(query.limit) : 20;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.deNghiDieuChinh.findMany({
                where,
                include: {
                    ncs: {
                        select: { id: true, mshv: true, hoTen: true },
                    },
                    gvhdMoi: {
                        select: { id: true, hoTen: true, hocHamHocVi: true },
                    },
                    xacNhanGvhds: {
                        include: {
                            gvhd: {
                                select: { id: true, hoTen: true, hocHamHocVi: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.deNghiDieuChinh.count({ where }),
        ]);

        const mappedData = data.map((item) => ({
            ...item,
            isOwner: item.nguoiDeNghiId === userId || (ncs ? item.ncsId === ncs.id : false),
        }));

        return { data: mappedData, total, page, limit };
    }

    async detail(userId: string, id: string) {
        const deNghi = await this.prisma.deNghiDieuChinh.findUnique({
            where: { id },
            include: {
                ncs: {
                    select: {
                        id: true,
                        mshv: true,
                        hoTen: true,
                        email: true,
                        hanChinhQuy: true,
                        hanGiaHan: true,
                        hanBuocThoiHoc: true,
                        trangThai: true,
                    },
                },
                gvhdMoi: {
                    select: { id: true, hoTen: true, email: true, hocHamHocVi: true },
                },
                phanCongCu: {
                    include: {
                        gvhd: {
                            select: { id: true, hoTen: true, email: true, hocHamHocVi: true },
                        },
                    },
                },
                xacNhanGvhds: {
                    include: {
                        gvhd: {
                            select: { id: true, hoTen: true, email: true, hocHamHocVi: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
                quyetDinh: true,
            },
        });

        if (!deNghi) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề nghị' });
        }

        // Kiểm tra quyền sở hữu / quyền xem (ownership)
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
            select: { id: true },
        });

        const gvhd = !ncs
            ? await this.prisma.giangVienHuongDan.findUnique({
                where: { userId },
                select: { id: true },
            })
            : null;

        let isOwner = false;

        if (ncs) {
            if (deNghi.ncsId !== ncs.id) {
                throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền xem đề nghị này' });
            }
            isOwner = true;
        } else if (gvhd) {
            const laNguoiGui = deNghi.nguoiDeNghiId === userId;
            const dangHuongDan = await this.prisma.phanCongHuongDan.findFirst({
                where: {
                    gvhdId: gvhd.id,
                    ncsId: deNghi.ncsId,
                    trangThai: 'DANG_HIEU_LUC',
                },
                select: { id: true },
            });
            const coXacNhan = deNghi.xacNhanGvhds.some((x) => x.gvhdId === gvhd.id);

            if (!laNguoiGui && !dangHuongDan && !coXacNhan) {
                throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền xem đề nghị này' });
            }
            isOwner = laNguoiGui;
        } else {
            // Giáo vụ / Admin xem được tất cả
            isOwner = deNghi.nguoiDeNghiId === userId;
        }

        // Thông tin đi kèm để giáo vụ/người xem dễ kiểm tra
        const thongTinThem: Record<string, unknown> = {};

        if (deNghi.loai === 'DOI_DE_TAI') {
            thongTinThem.deTaiHienTai = await this.prisma.deTai.findFirst({
                where: {
                    ncsId: deNghi.ncsId,
                    trangThai: 'HIEU_LUC',
                },
            });
        }

        if (deNghi.loai === 'GIA_HAN') {
            thongTinThem.hanHienTai = deNghi.ncs?.hanGiaHan ?? deNghi.ncs?.hanChinhQuy ?? null;
            // Tính số tháng đã gia hạn trước đây
            const cacLanTruoc = await this.prisma.deNghiDieuChinh.findMany({
                where: {
                    ncsId: deNghi.ncsId,
                    loai: 'GIA_HAN',
                    trangThai: 'DA_DUYET',
                    id: { not: deNghi.id },
                },
                select: { soThangGiaHan: true },
            });
            thongTinThem.tongThangDaGiaHanTruoc = cacLanTruoc.reduce((sum, item) => sum + (item.soThangGiaHan ?? 0), 0);
        }

        return {
            ...deNghi,
            ...thongTinThem,
            isOwner,
        };
    }

    // Hủy đề nghị: cho phép khi đang chờ duyệt hoặc chờ GVHD xác nhận
    async huyDeNghi(userId: string, id: string) {
        const deNghi = await this.prisma.deNghiDieuChinh.findUnique({
            where: { id },
        });
        if (!deNghi) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề nghị' });
        }

        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
        });
        const laNguoiGui = deNghi.nguoiDeNghiId === userId;
        const laNcsCuaDeNghi = ncs?.id === deNghi.ncsId;

        if (!laNguoiGui && !laNcsCuaDeNghi) {
            throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền hủy đề nghị này' });
        }

        const kq = await this.prisma.deNghiDieuChinh.updateMany({
            where: {
                id,
                trangThai: { in: ['CHO_DUYET', 'CHO_GVHD_XAC_NHAN'] },
            },
            data: {
                trangThai: 'DA_HUY',
            },
        });
        if (kq.count === 0) {
            throw new RpcException({ statusCode: 409, message: 'Đề nghị không còn ở trạng thái chờ duyệt hoặc đã hủy' });
        }
        return { id, trangThai: 'DA_HUY' };
    }

    /** Giáo vụ từ chối đề nghị: bắt buộc có lý do, không cần quyết định */
    async tuChoi(userId: string, id: string, lyDoTuChoi: string) {
        const deNghi = await this.prisma.deNghiDieuChinh.findUnique({
            where: { id },
            include: { ncs: true },
        });
        if (!deNghi) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề nghị' });

        const kq = await this.prisma.deNghiDieuChinh.updateMany({
            where: {
                id,
                trangThai: { in: ['CHO_DUYET', 'CHO_GVHD_XAC_NHAN'] },
            },
            data: {
                trangThai: 'TU_CHOI',
                lyDoTuChoi: lyDoTuChoi.trim(),
                nguoiDuyetId: userId,
                ngayDuyet: new Date(),
            },
        });
        if (kq.count === 0) {
            throw new RpcException({ statusCode: 409, message: 'Đề nghị không còn ở trạng thái chờ duyệt, không thể từ chối' });
        }

        // Ghi AuditLog
        await this.prisma.auditLog.create({
            data: {
                actorId: userId,
                action: 'DE_NGHI_TU_CHOI',
                entityType: 'DeNghiDieuChinh',
                entityId: id,
                ncsId: deNghi.ncsId,
                oldValue: { trangThai: deNghi.trangThai },
                newValue: { trangThai: 'TU_CHOI', lyDoTuChoi: lyDoTuChoi.trim() },
            },
        });

        // Gửi thông báo từ chối cho người tạo đơn và NCS
        const tenLoaiDeNghiMap: Record<string, string> = {
            DOI_DE_TAI: 'đổi đề tài luận án',
            DOI_GVHD: 'thay đổi GVHD',
            GIA_HAN: 'gia hạn học tập',
        };
        const tenLoaiDeNghi = tenLoaiDeNghiMap[deNghi.loai] ?? 'điều chỉnh';

        const userIds = new Set<string>();
        if (deNghi.nguoiDeNghiId) userIds.add(deNghi.nguoiDeNghiId);
        if (deNghi.ncs?.userId) userIds.add(deNghi.ncs.userId);

        if (deNghi.loai === 'GIA_HAN') {
            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: deNghi.ncsId, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            for (const pc of phanCongs) {
                if (pc.gvhd?.userId) userIds.add(pc.gvhd.userId);
            }
        }

        if (userIds.size > 0) {
            this.notification.gui({
                userIds: Array.from(userIds),
                loai: 'DE_NGHI_DIEU_CHINH_TU_CHOI',
                duLieu: {
                    tenLoaiDeNghi,
                    tenNcs: deNghi.ncs?.hoTen,
                    mshv: deNghi.ncs?.mshv,
                    lyDo: lyDoTuChoi.trim(),
                },
                khoaTrung: `CHANGE_REQUEST_REJECT:${id}`,
            });
        }

        return this.prisma.deNghiDieuChinh.findUnique({
            where: { id },
            include: { ncs: true, quyetDinh: true },
        });
    }

    // Duyệt đơn đề nghị (Giáo vụ)
    async duyet(userId: string, id: string, dto: ApproveDeNghiDto) {
        // Chỉ Giáo vụ / Admin mới có quyền duyệt đề nghị
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (ncs) {
            throw new RpcException({ statusCode: 403, message: 'NCS không có quyền duyệt đề nghị' });
        }

        const gvhd = await this.prisma.giangVienHuongDan.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (gvhd) {
            throw new RpcException({ statusCode: 403, message: 'GVHD không có quyền duyệt đề nghị này' });
        }

        const deNghi = await this.prisma.deNghiDieuChinh.findUnique({
            where: { id },
            include: { xacNhanGvhds: true },
        });
        if (!deNghi) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề nghị' });
        }

        if (deNghi.trangThai === 'CHO_GVHD_XAC_NHAN') {
            throw new RpcException({ statusCode: 400, message: 'Đề nghị chưa được toàn bộ tập thể GVHD xác nhận đồng ý' });
        }

        if (deNghi.trangThai !== 'CHO_DUYET') {
            throw new RpcException({ statusCode: 409, message: 'Đề nghị không còn ở trạng thái chờ duyệt' });
        }

        if (dto.resetTuMoc !== undefined && deNghi.loai !== 'DOI_DE_TAI') {
            throw new RpcException({ statusCode: 400, message: 'Đặt lại mốc chỉ áp dụng với loại đề nghị đổi đề tài' });
        }

        // Kiểm tra file quyết định đính kèm nếu có
        if (dto.fileId) {
            const file = await goiService<{ documentType: string }>(
                this.document,
                'document.get',
                {
                    nguoiDung: { id: userId, laNhanVien: true, ncsId: deNghi.ncsId },
                    id: dto.fileId,
                },
            );
            if (file.documentType !== 'QUYET_DINH') {
                throw new RpcException({
                    statusCode: 400,
                    message: 'File quyết định đính kèm phải thuộc loại QUYET_DINH',
                });
            }
        }

        let qdDuocTao: { id: string; soQuyetDinh: string; ngayQuyetDinh: Date; ghiChu?: string | null } | null = null;

        const ketQuaCuoi = await this.prisma.$transaction(async (tx) => {
            let qd: { id: string; soQuyetDinh: string; ngayQuyetDinh: Date; ghiChu?: string | null };

            if (deNghi.loai === 'DOI_DE_TAI') {
                if (!dto.quyetDinhId) {
                    throw new RpcException({ statusCode: 400, message: 'Vui lòng cung cấp quyetDinhId cho đề nghị đổi đề tài' });
                }
                qd = await this.kiemTraQuyetDinh(tx, deNghi, dto.quyetDinhId, 'GIAO_DE_TAI');
            } else if (deNghi.loai === 'DOI_GVHD') {
                if (!dto.quyetDinhId) {
                    throw new RpcException({ statusCode: 400, message: 'Vui lòng cung cấp quyetDinhId cho đề nghị đổi GVHD' });
                }
                qd = await this.kiemTraQuyetDinh(tx, deNghi, dto.quyetDinhId, 'PHAN_CONG_GVHD');
            } else if (deNghi.loai === 'GIA_HAN') {
                // Kiểm tra đảm bảo toàn bộ GVHD đã đồng ý
                const chuaDongY = await tx.xacNhanGvhdDeNghi.count({
                    where: { deNghiId: id, dongY: { not: true } },
                });
                if (chuaDongY > 0) {
                    throw new RpcException({
                        statusCode: 400,
                        message: 'Đề nghị chưa được toàn bộ tập thể GVHD xác nhận đồng ý',
                    });
                }

                // Với GIA_HAN: Hỗ trợ truyền quyetDinhId HOẶC nhập soQuyetDinh + ngayQuyetDinh
                if (dto.quyetDinhId) {
                    qd = await this.kiemTraQuyetDinh(tx, deNghi, dto.quyetDinhId, 'GIA_HAN');
                } else {
                    if (!dto.soQuyetDinh || !dto.ngayQuyetDinh) {
                        throw new RpcException({
                            statusCode: 400,
                            message: 'Giáo vụ cần chọn quyetDinhId có sẵn hoặc nhập số quyết định (soQuyetDinh) và ngày ký (ngayQuyetDinh)',
                        });
                    }
                    const ngayQd = parseNgay(dto.ngayQuyetDinh, 'Ngày quyết định');
                    const ngayGui = deNghi.createdAt.toISOString().slice(0, 10);
                    const ngayQdStr = ngayQd.toISOString().slice(0, 10);
                    if (ngayQdStr < ngayGui) {
                        throw new RpcException({ statusCode: 400, message: 'Ngày quyết định không được trước ngày gửi đề nghị' });
                    }

                    // Kiểm tra ràng buộc unique số quyết định và tính nhất quán
                    await this.kiemTraSoQuyetDinhTruocKhiTao(tx, dto.soQuyetDinh, ngayQd, 'GIA_HAN', deNghi.ncsId);

                    qd = await tx.quyetDinh.create({
                        data: {
                            loai: 'GIA_HAN',
                            soQuyetDinh: dto.soQuyetDinh.trim(),
                            ngayQuyetDinh: ngayQd,
                            ncsId: deNghi.ncsId,
                            fileId: dto.fileId ?? null,
                            ghiChu: dto.ghiChu ?? `Quyết định gia hạn theo đơn đề nghị ngày ${ngayGui}`,
                            nguoiTaoId: userId,
                        },
                    });
                }
            } else {
                throw new RpcException({ statusCode: 400, message: `Chưa hỗ trợ duyệt đề nghị loại ${deNghi.loai}` });
            }

            qdDuocTao = qd;

            const tt = await tx.deNghiDieuChinh.updateMany({
                where: {
                    id,
                    trangThai: 'CHO_DUYET',
                },
                data: {
                    trangThai: 'DA_DUYET',
                    nguoiDuyetId: userId,
                    ngayDuyet: new Date(),
                    quyetDinhId: qd.id,
                },
            });
            if (tt.count === 0) {
                throw new RpcException({ statusCode: 409, message: 'Đề nghị vừa được xử lý bởi người khác' });
            }

            let ketQua: Record<string, unknown>;
            if (deNghi.loai === 'DOI_DE_TAI') {
                ketQua = await this.apDungDoiDeTai(tx, userId, deNghi, qd, dto.resetTuMoc);
            } else if (deNghi.loai === 'DOI_GVHD') {
                ketQua = await this.apDungDoiGVHD(tx, userId, deNghi, qd);
            } else {
                ketQua = await this.apDungGiaHan(tx, userId, deNghi, qd);
            }

            const daDuyet = await tx.deNghiDieuChinh.findUnique({
                where: { id },
                include: {
                    ncs: true,
                    quyetDinh: true,
                    xacNhanGvhds: {
                        include: { gvhd: true },
                    },
                },
            });
            return { deNghi: daDuyet, ...ketQua };
        });

        // Bắn thông báo sau transaction
        if (deNghi.loai === 'GIA_HAN' && qdDuocTao) {
            const ncsRecord = await this.prisma.nghienCuuSinh.findUnique({
                where: { id: deNghi.ncsId },
                include: {
                    phanCongs: {
                        where: { trangThai: 'DANG_HIEU_LUC' },
                        include: { gvhd: true },
                    },
                },
            });

            if (ncsRecord) {
                const qdInfo = qdDuocTao as { id: string; soQuyetDinh: string; ngayQuyetDinh: Date; ghiChu?: string | null };
                // 1. Gửi cho NCS
                if (ncsRecord.userId) {
                    this.notification.gui({
                        userIds: [ncsRecord.userId],
                        loai: 'QUYET_DINH_DOI_TRANG_THAI',
                        duLieu: {
                            loaiQuyetDinh: 'GIA_HAN',
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                            hanMoi: deNghi.hanMoiDeNghi,
                            ghiChu: qdInfo.ghiChu ?? deNghi.lyDo,
                        },
                    });
                }

                // 2. Gửi cho tập thể GVHD
                const gvhdUserIds = ncsRecord.phanCongs
                    .map((p) => p.gvhd.userId)
                    .filter((u): u is string => !!u);

                if (gvhdUserIds.length > 0) {
                    this.notification.gui({
                        userIds: gvhdUserIds,
                        loai: 'GVHD_QUYET_DINH_DOI_TRANG_THAI',
                        duLieu: {
                            loaiQuyetDinh: 'GIA_HAN',
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                            tenNcs: ncsRecord.hoTen,
                            mshv: ncsRecord.mshv,
                            hanMoi: deNghi.hanMoiDeNghi,
                            ghiChu: qdInfo.ghiChu ?? deNghi.lyDo,
                        },
                    });
                }
            }
        }

        if (deNghi.loai === 'DOI_DE_TAI' && qdDuocTao) {
            const ncsRecord = await this.prisma.nghienCuuSinh.findUnique({
                where: { id: deNghi.ncsId },
                include: {
                    phanCongs: {
                        where: { trangThai: 'DANG_HIEU_LUC' },
                        include: { gvhd: true },
                    },
                },
            });

            if (ncsRecord) {
                const qdInfo = qdDuocTao as { id: string; soQuyetDinh: string; ngayQuyetDinh: Date };

                // 1. Gửi cho NCS
                if (ncsRecord.userId) {
                    this.notification.gui({
                        userIds: [ncsRecord.userId],
                        loai: 'DE_NGHI_DOI_DE_TAI_DUYET',
                        duLieu: {
                            tenDeTaiMoi: deNghi.tenDeTaiMoi,
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                            resetTuMoc: dto.resetTuMoc,
                        },
                        khoaTrung: `CHANGE_REQUEST_DOI_DE_TAI_NCS:${id}`,
                    });
                }

                // 2. Gửi cho tập thể GVHD
                const gvhdUserIds = ncsRecord.phanCongs
                    .map((p) => p.gvhd.userId)
                    .filter((u): u is string => !!u);

                if (gvhdUserIds.length > 0) {
                    this.notification.gui({
                        userIds: gvhdUserIds,
                        loai: 'GVHD_DE_NGHI_DOI_DE_TAI_DUYET',
                        duLieu: {
                            tenNcs: ncsRecord.hoTen,
                            mshv: ncsRecord.mshv,
                            tenDeTaiMoi: deNghi.tenDeTaiMoi,
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                            resetTuMoc: dto.resetTuMoc,
                        },
                        khoaTrung: `CHANGE_REQUEST_DOI_DE_TAI_GVHD:${id}`,
                    });
                }
            }
        }

        if (deNghi.loai === 'DOI_GVHD' && qdDuocTao) {
            const ncsRecord = await this.prisma.nghienCuuSinh.findUnique({
                where: { id: deNghi.ncsId },
                select: { userId: true, hoTen: true, mshv: true },
            });

            const extra = ketQuaCuoi as {
                tenGvhdCu?: string;
                tenGvhdMoi?: string;
                userIdGvhdCu?: string;
                userIdGvhdMoi?: string;
            };

            if (ncsRecord) {
                const qdInfo = qdDuocTao as { id: string; soQuyetDinh: string; ngayQuyetDinh: Date };

                // 1. Gửi cho NCS
                if (ncsRecord.userId) {
                    this.notification.gui({
                        userIds: [ncsRecord.userId],
                        loai: 'DE_NGHI_DOI_GVHD_DUYET',
                        duLieu: {
                            tenGvhdCu: extra.tenGvhdCu ?? 'GVHD trước',
                            tenGvhdMoi: extra.tenGvhdMoi ?? 'GVHD mới',
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                        },
                        khoaTrung: `CHANGE_REQUEST_DOI_GVHD_NCS:${id}`,
                    });
                }

                // 2. Gửi cho GVHD cũ
                if (extra.userIdGvhdCu) {
                    this.notification.gui({
                        userIds: [extra.userIdGvhdCu],
                        loai: 'GVHD_CU_THAY_DOI_PHAN_CONG',
                        duLieu: {
                            tenNcs: ncsRecord.hoTen,
                            mshv: ncsRecord.mshv,
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                        },
                        khoaTrung: `CHANGE_REQUEST_DOI_GVHD_OLD:${id}`,
                    });
                }

                // 3. Gửi cho GVHD mới
                if (extra.userIdGvhdMoi) {
                    this.notification.gui({
                        userIds: [extra.userIdGvhdMoi],
                        loai: 'GVHD_MOI_DUOC_PHAN_CONG',
                        duLieu: {
                            tenNcs: ncsRecord.hoTen,
                            mshv: ncsRecord.mshv,
                            soQuyetDinh: qdInfo.soQuyetDinh,
                            ngayQuyetDinh: qdInfo.ngayQuyetDinh,
                        },
                        khoaTrung: `CHANGE_REQUEST_DOI_GVHD_NEW:${id}`,
                    });
                }
            }
        }

        return ketQuaCuoi;
    }

    private async apDungGiaHan(
        tx: Prisma.TransactionClient,
        userId: string,
        deNghi: {
            id: string;
            ncsId: string;
            hanMoiDeNghi: Date | null;
            soThangGiaHan: number | null;
            lyDo: string;
        },
        qd: { id: string; soQuyetDinh: string; ngayQuyetDinh: Date; ghiChu?: string | null },
    ) {
        if (!deNghi.hanMoiDeNghi) {
            throw new RpcException({ statusCode: 400, message: 'Đề nghị gia hạn thiếu thông tin hạn mới đề xuất' });
        }

        const ncs = await tx.nghienCuuSinh.findUnique({ where: { id: deNghi.ncsId } });
        if (!ncs) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });

        // Cập nhật trạng thái DANG_HOC -> GIA_HAN và hạn học tập mới
        await tx.nghienCuuSinh.update({
            where: { id: ncs.id },
            data: {
                trangThai: 'GIA_HAN',
                hanGiaHan: deNghi.hanMoiDeNghi,
                ngayChuyenTrangThai: qd.ngayQuyetDinh,
                lyDoChuyenTrangThai: qd.ghiChu ?? deNghi.lyDo,
            },
        });

        // Ghi AuditLog
        await tx.auditLog.create({
            data: {
                actorId: userId,
                action: 'DE_NGHI_GIA_HAN_DUYET',
                entityType: 'DeNghiDieuChinh',
                entityId: deNghi.id,
                ncsId: deNghi.ncsId,
                oldValue: {
                    trangThai: ncs.trangThai,
                    hanGiaHan: ncs.hanGiaHan,
                },
                newValue: {
                    trangThai: 'GIA_HAN',
                    hanGiaHan: deNghi.hanMoiDeNghi,
                    quyetDinhId: qd.id,
                    soQuyetDinh: qd.soQuyetDinh,
                    soThangGiaHan: deNghi.soThangGiaHan,
                },
            },
        });

        return {
            quyetDinhId: qd.id,
            soQuyetDinh: qd.soQuyetDinh,
            trangThaiMoi: 'GIA_HAN',
            hanGiaHanMoi: deNghi.hanMoiDeNghi,
            soThangGiaHan: deNghi.soThangGiaHan,
        };
    }

    private async kiemTraQuyetDinh(
        tx: Prisma.TransactionClient,
        deNghi: {
            ncsId: string;
            createdAt: Date;
        },
        quyetDinhId: string,
        loaiCan: 'PHAN_CONG_GVHD' | 'GIAO_DE_TAI' | 'GIA_HAN',
    ) {
        const qd = await tx.quyetDinh.findUnique({ where: { id: quyetDinhId } });
        if (!qd) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
        }
        if (qd.loai !== loaiCan) {
            throw new RpcException({ statusCode: 400, message: `Quyết định phải thuộc loại ${loaiCan}` });
        }
        if (qd.trangThai !== 'HIEU_LUC') {
            throw new RpcException({ statusCode: 400, message: 'Quyết định không còn hiệu lực' });
        }
        if (qd.ncsId !== deNghi.ncsId) {
            throw new RpcException({ statusCode: 400, message: 'Quyết định không thuộc NCS của đề nghị' });
        }

        // Quyết định ra trước khi có đơn thì không thể là câu trả lời cho đơn đó
        const ngayGui = deNghi.createdAt.toISOString().slice(0, 10);
        const ngayQd = qd.ngayQuyetDinh.toISOString().slice(0, 10);

        if (ngayQd < ngayGui) {
            throw new RpcException({ statusCode: 400, message: 'Ngày quyết định không được trước ngày gửi đề nghị' });
        }

        // Chặn chọn nhầm quyết định cũ
        const daDung = loaiCan === 'PHAN_CONG_GVHD'
            ? await tx.phanCongHuongDan.count({
                where: {
                    quyetDinhId: qd.id,
                    ncsId: qd.ncsId,
                },
            })
            : loaiCan === 'GIAO_DE_TAI'
                ? await tx.deTai.count({
                    where: {
                        quyetDinhId: qd.id,
                    },
                })
                : await tx.deNghiDieuChinh.count({
                    where: {
                        quyetDinhId: qd.id,
                    },
                });
        if (daDung > 0) {
            throw new RpcException({ statusCode: 400, message: 'Quyết định này đã được dùng cho một phân công/đề tài/đề nghị khác, hãy chọn quyết định mới' });
        }
        return qd;
    }

    private async apDungDoiGVHD(
        tx: Prisma.TransactionClient,
        userId: string,
        deNghi: {
            id: string;
            ncsId: string;
            phanCongCuId: string | null;
            gvhdMoiId: string | null;
        },
        qd: { id: string; ngayQuyetDinh: Date },
    ) {
        const pcCu = await tx.phanCongHuongDan.findFirst({
            where: {
                id: deNghi.phanCongCuId!,
                ncsId: deNghi.ncsId,
                trangThai: 'DANG_HIEU_LUC',
            },
        });
        if (!pcCu) {
            throw new RpcException({ statusCode: 409, message: 'Phân công cũ không còn hiệu lực, không thể duyệt' });
        }

        const gvMoi = await tx.giangVienHuongDan.findUnique({
            where: {
                id: deNghi.gvhdMoiId!,
            },
        });
        if (!gvMoi || !gvMoi.trangThai) {
            throw new RpcException({ statusCode: 409, message: 'GVHD mới không còn hoạt động' });
        }

        const daHuongDan = await tx.phanCongHuongDan.findFirst({
            where: {
                ncsId: deNghi.ncsId,
                gvhdId: gvMoi.id,
                trangThai: 'DANG_HIEU_LUC',
            },
        });
        if (daHuongDan) {
            throw new RpcException({ statusCode: 409, message: 'GVHD mới đang hướng dẫn NCS này rồi' });
        }

        const soSau = Number(gvMoi.soNcsDangHuongDan) + Number(pcCu.trongSo);
        if (soSau > gvMoi.maxNcsChoPhep) {
            throw new RpcException({ statusCode: 400, message: `GVHD mới đã đủ định mức (tối đa ${gvMoi.maxNcsChoPhep})` });
        }

        const capNhatMoi = await tx.giangVienHuongDan.updateMany({
            where: { id: gvMoi.id, version: gvMoi.version },
            data: { soNcsDangHuongDan: soSau, version: { increment: 1 } },
        });
        if (capNhatMoi.count === 0) {
            throw new RpcException({ statusCode: 409, message: 'Dữ liệu GVHD mới vừa thay đổi, hãy thử lại' });
        }

        const gvCu = await tx.giangVienHuongDan.findUnique({ where: { id: pcCu.gvhdId } });
        if (gvCu) {
            await tx.giangVienHuongDan.update({
                where: {
                    id: gvCu.id,
                },
                data: {
                    soNcsDangHuongDan: Math.max(0, Number(gvCu.soNcsDangHuongDan) - Number(pcCu.trongSo)),
                    version: { increment: 1 },
                },
            });
        }

        await tx.phanCongHuongDan.update({
            where: {
                id: pcCu.id,
            },
            data: {
                trangThai: 'DEACTIVATE',
                ngayKetThuc: qd.ngayQuyetDinh,
            },
        });

        const pcMoi = await tx.phanCongHuongDan.create({
            data: {
                ncsId: deNghi.ncsId,
                gvhdId: gvMoi.id,
                vaiTro: pcCu.vaiTro,
                trongSo: pcCu.trongSo,
                quyetDinhId: qd.id,
                ngayBatDau: qd.ngayQuyetDinh,
            },
        });

        await tx.auditLog.create({
            data: {
                actorId: userId,
                action: 'DE_NGHI_DOI_GVHD_DUYET',
                entityType: 'DeNghiDieuChinh',
                entityId: deNghi.id,
                ncsId: deNghi.ncsId,
                oldValue: { phanCongId: pcCu.id, gvhdId: pcCu.gvhdId },
                newValue: { phanCongId: pcMoi.id, gvhdId: pcMoi.gvhdId, quyetDinhId: qd.id },
            },
        });

        return {
            phanCongCuId: pcCu.id,
            phanCongMoiId: pcMoi.id,
            tenGvhdCu: gvCu?.hoTen,
            tenGvhdMoi: gvMoi.hoTen,
            userIdGvhdCu: gvCu?.userId,
            userIdGvhdMoi: gvMoi.userId,
        };
    }

    private async apDungDoiDeTai(
        tx: Prisma.TransactionClient,
        userId: string,
        deNghi: {
            id: string;
            ncsId: string;
            tenDeTaiMoi: string | null;
        },
        qd: {
            id: string;
            soQuyetDinh: string;
        },
        resetTuMoc?: number,
    ) {
        const deTaiCu = await tx.deTai.findFirst({
            where: {
                ncsId: deNghi.ncsId,
                trangThai: 'HIEU_LUC',
            },
        });
        if (!deTaiCu) {
            throw new RpcException({ statusCode: 409, message: 'NCS không còn đề tài hiệu lực để đổi' });
        }

        await tx.deTai.update({
            where: {
                id: deTaiCu.id,
            },
            data: {
                trangThai: 'DA_THAY_THE',
            },
        });

        const deTaiMoi = await tx.deTai.create({
            data: {
                ncsId: deNghi.ncsId,
                tenDeTai: deNghi.tenDeTaiMoi!,
                trangThai: 'HIEU_LUC',
                quyetDinhId: qd.id,
            },
        });

        let mocDaDatLai: number[] = [];
        if (resetTuMoc !== undefined) {
            mocDaDatLai = await this.datLaiTienTrinh(
                tx,
                userId,
                deNghi.ncsId,
                resetTuMoc,
                `Đề tài đã được thay đổi theo quyết định ${qd.soQuyetDinh}, mốc được đặt lại`,
            );
        }

        await tx.auditLog.create({
            data: {
                actorId: userId,
                action: 'DE_NGHI_DOI_DE_TAI_DUYET',
                entityType: 'DeNghiDieuChinh',
                entityId: deNghi.id,
                ncsId: deNghi.ncsId,
                oldValue: { deTaiId: deTaiCu.id, tenDeTai: deTaiCu.tenDeTai },
                newValue: {
                    deTaiId: deTaiMoi.id,
                    tenDeTai: deTaiMoi.tenDeTai,
                    quyetDinhId: qd.id,
                    resetTuMoc: resetTuMoc ?? null,
                    mocDaDatLai,
                },
            },
        });

        return { deTaiCuId: deTaiCu.id, deTaiMoiId: deTaiMoi.id, mocDaDatLai };
    }

    private async datLaiTienTrinh(tx: Prisma.TransactionClient, userId: string, ncsId: string, tuMoc: number, lyDo?: string): Promise<number[]> {
        if (!Number.isInteger(tuMoc) || tuMoc < 2 || tuMoc > 7) {
            throw new RpcException({ statusCode: 400, message: 'Đặt lại mốc phải là số nguyên từ 2 đến 7' });
        }

        const row = await tx.tienTrinhNcs.findMany({
            where: {
                ncsId,
                moc: {
                    thuTu: {
                        gte: tuMoc - 1,
                    },
                },
            },
            include: {
                moc: true,
            },
            orderBy: {
                moc: { thuTu: 'asc' },
            },
        });

        const mocTruoc = row.find((r) => r.moc.thuTu === tuMoc - 1);
        const canDatLai = row.filter((r) => r.moc.thuTu >= tuMoc);
        const mocDauDuocMo = mocTruoc?.trangThai === 'PASSED';

        for (const r of canDatLai) {
            const duocMo = r.moc.thuTu === tuMoc && mocDauDuocMo;

            await tx.minhChungMoc.updateMany({
                where: {
                    tienTrinhId: r.id,
                    trangThai: 'PENDING_REVIEW',
                },
                data: {
                    trangThai: 'REJECTED',
                    lyDoTuChoi: lyDo,
                    nguoiDuyetId: userId,
                    ngayDuyet: new Date(),
                },
            });

            await tx.tienTrinhNcs.update({
                where: {
                    id: r.id,
                },
                data: {
                    trangThai: duocMo ? 'UNLOCKED' : 'LOCKED',
                    openedAt: duocMo ? new Date() : null,
                    submittedAt: null,
                    passedAt: null,
                    version: { increment: 1 },
                },
            });
        }
        return canDatLai.map((r) => r.moc.thuTu);
    }

    /** Kiểm tra file qua document-service (tồn tại, đúng loại, đúng quyền) và chống dùng trùng */
    private async kiemTraFile(
        userId: string,
        ncsId: string,
        fileId: string,
        laNhanVien = false,
        loaiChoPhep: string[] = ['DON_TU', 'MINH_CHUNG_MOC'],
    ) {
        const file = await goiService<{ documentType: string }>(
            this.document,
            'document.get',
            {
                nguoiDung: { id: userId, laNhanVien, ncsId },
                id: fileId,
            },
        );

        if (!loaiChoPhep.includes(file.documentType)) {
            throw new RpcException({
                statusCode: 400,
                message: `File đính kèm không đúng loại tài liệu yêu cầu (yêu cầu: ${loaiChoPhep.join(', ')})`,
            });
        }

        const daDung = await this.prisma.deNghiDieuChinh.findFirst({
            where: {
                fileId,
                trangThai: { notIn: ['DA_HUY', 'TU_CHOI'] },
            },
        });
        if (daDung) {
            throw new RpcException({
                statusCode: 409,
                message: 'File đính kèm này đã được sử dụng cho một đề nghị khác đang chờ xử lý hoặc đã duyệt',
            });
        }

        return file;
    }

    /** Kiểm tra tính duy nhất và nhất quán của số quyết định trước khi tạo mới */
    private async kiemTraSoQuyetDinhTruocKhiTao(
        tx: Prisma.TransactionClient,
        soQuyetDinh: string,
        ngayQd: Date,
        loai: LoaiQuyetDinh,
        ncsId: string,
    ) {
        const soQdClean = soQuyetDinh.trim();

        // 1. Kiểm tra xem số quyết định này đã được dùng cho loại quyết định khác chưa
        const khacLoai = await tx.quyetDinh.findFirst({
            where: {
                soQuyetDinh: soQdClean,
                loai: { not: loai },
            },
            select: { loai: true, soQuyetDinh: true },
        });
        if (khacLoai) {
            throw new RpcException({
                statusCode: 409,
                message: `Số quyết định "${soQdClean}" đã tồn tại trong hệ thống với loại quyết định khác (${khacLoai.loai})`,
            });
        }

        // 2. Tìm tất cả các quyết định cùng loại và cùng số quyết định
        const dsCungSo = await tx.quyetDinh.findMany({
            where: {
                loai,
                soQuyetDinh: soQdClean,
            },
            select: { ncsId: true, ngayQuyetDinh: true },
        });

        // 3. Nếu đã có quyết định mang số này: ngày ký phải trùng khớp
        const khacNgay = dsCungSo.find(
            (q) => q.ngayQuyetDinh.toISOString().slice(0, 10) !== ngayQd.toISOString().slice(0, 10),
        );
        if (khacNgay) {
            throw new RpcException({
                statusCode: 409,
                message: `Số quyết định "${soQdClean}" đã tồn tại trong hệ thống với ngày ký khác (${khacNgay.ngayQuyetDinh.toISOString().slice(0, 10)})`,
            });
        }

        // 4. Kiểm tra xem số quyết định này đã được cấp cho chính NCS này chưa (chống trùng @@unique([loai, soQuyetDinh, ncsId]))
        const daCapChoNcs = dsCungSo.some((q) => q.ncsId === ncsId);
        if (daCapChoNcs) {
            throw new RpcException({
                statusCode: 409,
                message: `Số quyết định "${soQdClean}" đã được áp dụng cho nghiên cứu sinh này trước đó`,
            });
        }
    }
}