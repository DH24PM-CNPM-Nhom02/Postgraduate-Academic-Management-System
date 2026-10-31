import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { goiService } from '../helpers/call-service.util.js';
import type { LoaiQuyetDinh, TrangThaiQuyetDinh, TrangThaiHocTap } from '../generated/prisma/index.js';
import { ngayChuoi, parseNgay } from '../helpers/validateData.util.js';
import { NotificationClient } from '../notification/notification.client.js';

// Loại quyết định làm đổi trạng thái học tập của NCS -> trạng thái mới
const TRANG_THAI_MOI: Partial<Record<LoaiQuyetDinh, TrangThaiHocTap>> = {
    BAO_LUU: 'BAO_LUU',
    NGUNG_HOC: 'NGUNG_HOC',
    BUOC_THOI_HOC: 'BUOC_THOI_HOC',
    GIA_HAN: 'GIA_HAN',
    HOC_TIEP: 'DANG_HOC',
};

// NCS đang ở trạng thái nào thì mới được nhận quyết định loại đó
const TRANG_THAI_CHO_PHEP: Record<string, TrangThaiHocTap[]> = {
    BAO_LUU: ['DANG_HOC', 'GIA_HAN'],
    GIA_HAN: ['DANG_HOC', 'GIA_HAN'],
    NGUNG_HOC: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
    BUOC_THOI_HOC: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
    HOC_TIEP: ['BAO_LUU'],
};

// Các loại quyết định làm khóa tài khoản đăng nhập của NCS
const LOAI_KHOA_TAI_KHOAN = ['BAO_LUU', 'NGUNG_HOC', 'BUOC_THOI_HOC'];

// Các loại quyết định làm mở lại tài khoản đăng nhập của NCS
const LOAI_MO_TAI_KHOAN = ['HOC_TIEP'];

// NCS ở các trạng thái này thì tài khoản bị khóa
const TRANG_THAI_BI_KHOA: TrangThaiHocTap[] = ['BAO_LUU', 'NGUNG_HOC', 'BUOC_THOI_HOC'];

// Các loại quyết định có đổi trạng thái NCS (dùng để tìm quyết định mới hơn khi hoàn tác)
const LOAI_DOI_TRANG_THAI = Object.keys(TRANG_THAI_CHO_PHEP) as LoaiQuyetDinh[];

// Giá trị cũ của NCS được lưu trong audit (oldValue) lúc tạo quyết định, dùng để hoàn tác
type oldValue = {
    trangThai?: TrangThaiHocTap;
    hanGiaHan?: string | null;
    ngayChuyenTrangThai?: string | null;
    lyDoChuyenTrangThai?: string | null;
};
@Injectable()
export class DecisionService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
        private readonly thongBao: NotificationClient,
    ) { }

    async create(d: {
        nguoiTaoId: string; loai: string; soQuyetDinh: string; ngayQuyetDinh: string;
        ncsIds?: string[]; fileId?: string; ghiChu?: string;
        hanMoi?: string //chỉ dùng khi loại quyết định là GIA_HAN 
    }) {
        const loai = d.loai as LoaiQuyetDinh;
        const ngay = parseNgay(d.ngayQuyetDinh, 'Ngày quyết định');
        const dsNcsId = [...new Set(d.ncsIds ?? [])]; // bỏ NCS bị chọn trùng
        const trangThaiMoi = TRANG_THAI_MOI[loai];

        //kiểm tra dữ liệu đầu vào theo loại quyết định
        if (trangThaiMoi && dsNcsId.length === 0) {
            throw new RpcException({ statusCode: 400, message: 'Quyết định loại này phải chọn ít nhất 1 NCS' });
        }

        let hanMoi: Date | undefined;
        if (loai === 'GIA_HAN') {
            if (!d.hanMoi) {
                throw new RpcException({ statusCode: 400, message: 'Quyết định gia hạn phải có hạn mới' });
            }
            hanMoi = parseNgay(d.hanMoi, 'Hạn mới');
        }

        //  Cùng loại + cùng số: chỉ được thêm NCS khác vào, và phải cùng ngày quyết địn
        const dup = await this.prisma.quyetDinh.findMany({
            where: { loai, soQuyetDinh: d.soQuyetDinh },
            select: { ncsId: true, ngayQuyetDinh: true },
        });
        if (dup.some((q) => q.ngayQuyetDinh.getTime() !== ngay.getTime())) {
            throw new RpcException({ statusCode: 409, message: 'Số quyết định này đã tồn tại với ngày quyết định khác' });
        }

        const trung = dsNcsId.length > 0
            ? dup.filter((q) => q.ncsId !== null && dsNcsId.includes(q.ncsId))
            : dup.filter((q) => q.ncsId === null);
        if (trung.length > 0) {
            throw new RpcException({ statusCode: 409, message: 'Số quyết định này đã gắn với NCS được chọn' });
        }


        //Lấy hồ sơ các NCS, báo rõ NCS nào không tồn tại
        const dsNcs = dsNcsId.length === 0 ? [] : await this.prisma.nghienCuuSinh.findMany({
            where: {
                id: {
                    in: dsNcsId
                }
            },
            select: {
                id: true, mshv: true, userId: true, hoTen:true, trangThai: true,
                hanChinhQuy: true, hanBuocThoiHoc: true, hanGiaHan: true, ngayChuyenTrangThai: true, lyDoChuyenTrangThai: true
            },
        })
        if (dsNcs.length !== dsNcsId.length) {
            const idTonTai = new Set(dsNcs.map((ncs) => ncs.id));
            const idKhongTonTai = dsNcsId.filter((id) => !idTonTai.has(id));
            throw new RpcException({ statusCode: 404, message: `Các NCS sau không tồn tại: ${idKhongTonTai.join(', ')}` });
        }

        //kiểm tra từng ncs có được nhận quyết định này không
        if (trangThaiMoi) {
            const choPhep = TRANG_THAI_CHO_PHEP[loai];
            for (const ncs of dsNcs) {
                if (!choPhep.includes(ncs.trangThai)) {
                    throw new RpcException({
                        statusCode: 400,
                        message: `Nghiên cứu sinh ${ncs.mshv} đang ở trạng thái ${ncs.trangThai}, không thể nhận quyết định ${loai}`,
                    });
                }
                if (hanMoi) {
                    const hanHienTai = ncs.hanGiaHan ?? ncs.hanChinhQuy;
                    if (hanMoi <= hanHienTai || hanMoi > ncs.hanBuocThoiHoc) {
                        throw new RpcException({
                            statusCode: 400,
                            message: `Hạn mới của nghiên cứu sinh ${ncs.mshv} phải sau hạn hiện tại và không vượt hạn buộc thôi học`,
                        });
                    }
                }
            }
        }

        if (d.fileId) {
            // document.get tự báo 404 nếu file không tồn tại
            const file = await goiService<{ documentType: string }>(this.document, 'document.get', {
                nguoiDung: { id: d.nguoiTaoId, laNhanVien: true },
                id: d.fileId,
            });
            if (file.documentType !== 'QUYET_DINH') {
                throw new RpcException({ statusCode: 400, message: 'File đính kèm phải thuộc loại QUYET_DINH' });
            }
        }

        //transaction 
        // Quyết định không gắn NCS nào (vd thành lập tiểu ban) thì tạo 1 dòng có ncsId = null
        const dsDich = dsNcs.length > 0 ? dsNcs : [null];

        const quyetDinhs = await this.prisma.$transaction(async (tx) => {
            const ketQua = [];
            for (const ncs of dsDich) {
                const qd = await tx.quyetDinh.create({
                    data: {
                        loai,
                        soQuyetDinh: d.soQuyetDinh,
                        ngayQuyetDinh: ngay,
                        ncsId: ncs ? ncs.id : null,
                        fileId: d.fileId,
                        ghiChu: d.ghiChu,
                        nguoiTaoId: d.nguoiTaoId,
                    }
                })

                // Tác dụng phụ: bảo lưu / ngừng học / buộc thôi học / gia hạn
                if (ncs && trangThaiMoi) {
                    await tx.nghienCuuSinh.update({
                        where: {
                            id: ncs.id
                        },
                        data: {
                            trangThai: trangThaiMoi,
                            ngayChuyenTrangThai: ngay,
                            lyDoChuyenTrangThai: d.ghiChu ?? null,
                            //bảo lưu vẫn tính 72 tháng
                            ...(hanMoi ? { hanGiaHan: hanMoi } : {}),
                        }
                    })
                }

                //ghi audit
                await tx.auditLog.create({
                    data: {
                        actorId: d.nguoiTaoId,
                        action: 'TAO_QUYET_DINH',
                        entityType: 'QuyetDinh',
                        entityId: qd.id,
                        ncsId: ncs ? ncs.id : null,
                        oldValue: ncs && trangThaiMoi
                            ? {
                                trangThai: ncs.trangThai,
                                hanGiaHan: ngayChuoi(ncs.hanGiaHan),
                                ngayChuyenTrangThai: ngayChuoi(ncs.ngayChuyenTrangThai),
                                lyDoChuyenTrangThai: ncs.lyDoChuyenTrangThai,
                            }
                            : undefined,
                        newValue: {
                            loai,
                            soQuyetDinh: d.soQuyetDinh,
                            ngayQuyetDinh: d.ngayQuyetDinh,
                            trangThai: trangThaiMoi ?? null,
                            hanGiaHan: ngayChuoi(hanMoi ?? ncs?.hanGiaHan),
                        },
                    },
                });

                ketQua.push(qd);
            }
            return ketQua;
        })

        //Khóa tài khoản nếu nằm trong loại khóa tài khoản
        const canhBao: string[] = [];
        if (LOAI_KHOA_TAI_KHOAN.includes(loai)) {
            for (const ncs of dsNcs) {
                if (!ncs.userId) {
                    continue;
                }
                try {
                    await goiService(this.auth, 'auth.set-active', { userId: ncs.userId, isActive: false });
                    canhBao.push(`Tài khoản của NCS ${ncs.mshv} đã được khóa`);
                } catch (error) {
                    canhBao.push(`Không thể khóa tài khoản của NCS ${ncs.mshv}, cần khóa thủ công`);
                }
            }
        }

        // Mở lại tài khoản khi NCS bảo lưu quay lại học (HOC_TIEP)
        if (LOAI_MO_TAI_KHOAN.includes(loai)) {
            for (const ncs of dsNcs) {
                if (!ncs.userId) {
                    continue;
                }
                try {
                    await goiService(this.auth, 'auth.set-active', { userId: ncs.userId, isActive: true });
                    canhBao.push(`Tài khoản của NCS ${ncs.mshv} đã được mở lại`);
                } catch (error) {
                    canhBao.push(`Không thể mở lại tài khoản của NCS ${ncs.mshv}, cần mở thủ công`);
                }
            }
        }
        // 8. Gửi thông báo (sau khi DB đã commit, lỗi gửi không ảnh hưởng quyết định)
        if (LOAI_DOI_TRANG_THAI.includes(loai)) {
            const ncsIds = dsNcs.map((n) => n.id);
            const phanCongs = await this.prisma.phanCongHuongDan.findMany({
                where: { ncsId: { in: ncsIds }, trangThai: 'DANG_HIEU_LUC' },
                include: { gvhd: { select: { userId: true } } },
            });
            const gvhdMap = new Map<string, string[]>();
            for (const pc of phanCongs) {
                if (pc.gvhd?.userId) {
                    const list = gvhdMap.get(pc.ncsId) ?? [];
                    list.push(pc.gvhd.userId);
                    gvhdMap.set(pc.ncsId, list);
                }
            }

            for (const n of dsNcs) {
                // 1. Gửi thông báo cho NCS
                if (n.userId) {
                    this.thongBao.gui({
                        userIds: [n.userId],
                        loai: 'QUYET_DINH_DOI_TRANG_THAI',
                        khoaTrung: `QD:${loai}:${d.soQuyetDinh}:${n.id}`,
                        duLieu: {
                            loaiQuyetDinh: loai,
                            soQuyetDinh: d.soQuyetDinh,
                            ngayQuyetDinh: d.ngayQuyetDinh,
                            hanMoi: loai === 'GIA_HAN' ? (d.hanMoi ?? null) : null,
                            ghiChu: d.ghiChu ?? null,
                        },
                    });
                }

                // 2. Gửi thông báo cho GVHD của NCS
                const gvhdUserIds = gvhdMap.get(n.id) ?? [];
                if (gvhdUserIds.length > 0) {
                    this.thongBao.gui({
                        userIds: [...new Set(gvhdUserIds)],
                        loai: 'GVHD_QUYET_DINH_DOI_TRANG_THAI',
                        khoaTrung: `GVHD_QD:${loai}:${d.soQuyetDinh}:${n.id}`,
                        duLieu: {
                            loaiQuyetDinh: loai,
                            soQuyetDinh: d.soQuyetDinh,
                            ngayQuyetDinh: d.ngayQuyetDinh,
                            hanMoi: loai === 'GIA_HAN' ? (d.hanMoi ?? null) : null,
                            ghiChu: d.ghiChu ?? null,
                            tenNcs: n.hoTen,
                            mshv: n.mshv,
                        },
                    });
                }
            }
        }
        // Khóa hoặc mở khóa tài khoản lỗi thì báo riêng cho người vừa tạo quyết định,
        // vì response có thể không ai đọc kỹ
        if (canhBao.length > 0) {
            this.thongBao.gui({
                userIds: [d.nguoiTaoId],
                loai: 'CANH_BAO_TAI_KHOAN',
                duLieu: { canhBao }
            });
        }
        return { quyetDinhs, canhBao };

    }

    getListDecision(f: { ncsId?: string; soQuyetDinh?: string; loai?: string; trangThai?: string }) {
        return this.prisma.quyetDinh.findMany({
            // Giá trị undefined thì Prisma bỏ qua điều kiện đó
            where: {
                ncsId: f.ncsId,
                soQuyetDinh: f.soQuyetDinh,
                loai: f.loai as LoaiQuyetDinh | undefined,
                trangThai: f.trangThai as TrangThaiQuyetDinh | undefined,
            },
            orderBy: [{ ngayQuyetDinh: 'desc' }, { createdAt: 'desc' }],
            include: { ncs: { select: { mshv: true, hoTen: true } } },
        });
    }

    async getDecisionById(id: string) {
        const qd = await this.prisma.quyetDinh.findUnique({
            where: { id },
            include: { ncs: { select: { mshv: true, hoTen: true } } },
        });
        if (!qd) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
        }
        return qd;
    }

    async deactivateDecision(id: string, lyDo: string, nguoiThucHienId: string) {
        const qd = await this.prisma.quyetDinh.findUnique({ where: { id } });
        if (!qd) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
        }
        if (qd.trangThai === 'DEACTIVATE') {
            throw new RpcException({ statusCode: 400, message: 'Quyết định đã bị vô hiệu hóa' });
        }

        // Giữ ghi chú cũ, thêm lý do vô hiệu hóa vào sau
        const ghiChuMoi = [qd.ghiChu, `Vô hiệu hóa với lý do: ${lyDo}`].filter(Boolean).join('\n');

        // Loại quyết định không đổi trạng thái NCS: chỉ đánh dấu vô hiệu hóa như trước
        if (!(qd.loai in TRANG_THAI_CHO_PHEP) || !qd.ncsId) {
            const quyetDinh = await this.prisma.quyetDinh.update({
                where: { id },
                data: { trangThai: 'DEACTIVATE', ghiChu: ghiChuMoi },
            });
            return { quyetDinh, canhBao: [] as string[] };
        }

        // ---- Từ đây là quyết định có đổi trạng thái NCS: phải hoàn tác ----

        // 1. Chỉ được hủy quyết định đổi trạng thái mới nhất còn hiệu lực của NCS này
        const moiHon = await this.prisma.quyetDinh.findFirst({
            where: {
                ncsId: qd.ncsId,
                trangThai: 'HIEU_LUC',
                loai: { in: LOAI_DOI_TRANG_THAI },
                createdAt: { gt: qd.createdAt },
            },
            select: { soQuyetDinh: true, loai: true },
        });
        if (moiHon) {
            throw new RpcException({
                statusCode: 400,
                message: `Nghiên cứu sinh đã có quyết định mới hơn (${moiHon.loai} số ${moiHon.soQuyetDinh}), hãy vô hiệu hóa quyết định mới hơn trước`,
            });
        }

        // 2. Lấy lại giá trị cũ của NCS từ audit lúc tạo quyết định
        const audit = await this.prisma.auditLog.findFirst({
            where: {
                action: 'TAO_QUYET_DINH',
                entityType: 'QuyetDinh',
                entityId: qd.id
            },
            select: {
                oldValue: true,
                newValue: true
            },
        });
        const oldValue = audit?.oldValue as oldValue | null | undefined;
        const newValue = audit?.newValue as oldValue | null | undefined;
        if (
            !oldValue
            || !oldValue.trangThai
            || oldValue.hanGiaHan === undefined
            || oldValue.ngayChuyenTrangThai === undefined
            || oldValue.lyDoChuyenTrangThai === undefined
        ) {
            throw new RpcException({
                statusCode: 400,
                message: 'Quyết định này không có đủ dữ liệu để hoàn tác (tạo trước khi có nhật ký), hãy xử lý thủ công',
            });
        }

        const trangThaiCu: TrangThaiHocTap = oldValue.trangThai;

        // 3. Hồ sơ NCS hiện tại phải còn đúng như lúc quyết định này được áp dụng
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { id: qd.ncsId },
            select: { id: true, mshv: true, userId: true, hoTen:true, trangThai: true, hanGiaHan: true },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
        }
        if (newValue?.trangThai && ncs.trangThai !== newValue.trangThai) {
            throw new RpcException({
                statusCode: 400,
                message: `Trạng thái hiện tại của NCS ${ncs.mshv} (${ncs.trangThai}) khác với lúc ra quyết định ${qd.soQuyetDinh}, hãy xử lý thủ công`,
            });
        }

        // 4. Ghi DB trong 1 transaction: đánh dấu quyết định + khôi phục NCS + audit
        const quyetDinh = await this.prisma.$transaction(async (tx) => {
            const daHuy = await tx.quyetDinh.update({
                where: { id },
                data: { trangThai: 'DEACTIVATE', ghiChu: ghiChuMoi },
            });

            await tx.nghienCuuSinh.update({
                where: { id: ncs.id },
                data: {
                    trangThai: trangThaiCu,
                    hanGiaHan: oldValue.hanGiaHan ? parseNgay(oldValue.hanGiaHan, 'Hạn gia hạn cũ') : null,
                    ngayChuyenTrangThai: oldValue.ngayChuyenTrangThai
                        ? parseNgay(oldValue.ngayChuyenTrangThai, 'Ngày chuyển trạng thái cũ')
                        : null,
                    lyDoChuyenTrangThai: oldValue.lyDoChuyenTrangThai,
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId: nguoiThucHienId,
                    action: 'VO_HIEU_QUYET_DINH',
                    entityType: 'QuyetDinh',
                    entityId: id,
                    ncsId: ncs.id,
                    oldValue: { trangThai: ncs.trangThai, hanGiaHan: ngayChuoi(ncs.hanGiaHan) },
                    newValue: { trangThai: trangThaiCu, hanGiaHan: oldValue.hanGiaHan, lyDo },
                },
            });

            return daHuy;
        });

        // 5. Khóa / mở khóa tài khoản theo trạng thái vừa khôi phục
        const canhBao: string[] = [];
        if (ncs.userId) {
            // Trạng thái cũ là trạng thái bị khóa → khóa lại TK (vd: hủy HOC_TIEP → quay về BAO_LUU)
            // Trạng thái cũ là trạng thái bình thường → mở lại TK (vd: hủy BAO_LUU → quay về DANG_HOC)
            const canKhoa = TRANG_THAI_BI_KHOA.includes(trangThaiCu);
            try {
                await goiService(this.auth, 'auth.set-active', { userId: ncs.userId, isActive: !canKhoa });
                canhBao.push(
                    canKhoa
                        ? `Tài khoản của NCS ${ncs.mshv} đã được khóa lại (khôi phục trạng thái ${trangThaiCu})`
                        : `Tài khoản của NCS ${ncs.mshv} đã được mở lại (khôi phục trạng thái ${trangThaiCu})`,
                );
            } catch {
                canhBao.push(
                    canKhoa
                        ? `Không thể khóa lại tài khoản của NCS ${ncs.mshv}, cần xử lý thủ công`
                        : `Không thể mở lại tài khoản của NCS ${ncs.mshv}, cần xử lý thủ công`,
                );
            }
        }

        // 6. Thông báo cho NCS và GVHD biết hồ sơ đã được hoàn lại (sau khi DB đã commit)
        if (ncs.userId) {
            this.thongBao.gui({
                userIds: [ncs.userId],
                loai: 'QUYET_DINH_BI_HUY',
                khoaTrung: `QD-HUY:${id}`,
                duLieu: { loaiQuyetDinh: qd.loai, soQuyetDinh: qd.soQuyetDinh, lyDo },
            });
        }

        const phanCongs = await this.prisma.phanCongHuongDan.findMany({
            where: { ncsId: ncs.id, trangThai: 'DANG_HIEU_LUC' },
            include: { gvhd: { select: { userId: true } } },
        });
        const gvhdUserIds = phanCongs
            .map((pc) => pc.gvhd?.userId)
            .filter((u): u is string => typeof u === 'string' && u.length > 0);

        if (gvhdUserIds.length > 0) {
            this.thongBao.gui({
                userIds: [...new Set(gvhdUserIds)],
                loai: 'GVHD_QUYET_DINH_BI_HUY',
                khoaTrung: `GVHD_QD-HUY:${id}`,
                duLieu: {
                    loaiQuyetDinh: qd.loai,
                    soQuyetDinh: qd.soQuyetDinh,
                    lyDo,
                    tenNcs: ncs.hoTen,
                    mshv: ncs.mshv,
                },
            });
        }
        if (canhBao.length > 0) {
            this.thongBao.gui({
                userIds: [nguoiThucHienId],
                loai: 'CANH_BAO_TAI_KHOAN',
                duLieu: { canhBao }
            });
        }

        return { quyetDinh, canhBao };
    }
}