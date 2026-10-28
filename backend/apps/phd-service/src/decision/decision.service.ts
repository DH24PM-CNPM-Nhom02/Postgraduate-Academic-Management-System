import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { goiService } from '../helpers/call-service.util.js';
import type { LoaiQuyetDinh, TrangThaiQuyetDinh, TrangThaiHocTap } from '../generated/prisma/index.js';
import { ngayChuoi, parseNgay } from '../helpers/validateData.util.js';

// Loại quyết định làm đổi trạng thái học tập của NCS -> trạng thái mới
const TRANG_THAI_MOI: Partial<Record<LoaiQuyetDinh, TrangThaiHocTap>> = {
    BAO_LUU: 'BAO_LUU',
    NGUNG_HOC: 'NGUNG_HOC',
    BUOC_THOI_HOC: 'BUOC_THOI_HOC',
    GIA_HAN: 'GIA_HAN',
};

// NCS đang ở trạng thái nào thì mới được nhận quyết định loại đó
const TRANG_THAI_CHO_PHEP: Record<string, TrangThaiHocTap[]> = {
    BAO_LUU: ['DANG_HOC', 'GIA_HAN'],
    GIA_HAN: ['DANG_HOC', 'GIA_HAN'],
    NGUNG_HOC: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
    BUOC_THOI_HOC: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
};

// Các loại quyết định làm khóa tài khoản đăng nhập của NCS
const LOAI_KHOA_TAI_KHOAN = ['BAO_LUU', 'NGUNG_HOC', 'BUOC_THOI_HOC'];

@Injectable()
export class DecisionService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly auth: ClientProxy
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
                id: true, mshv: true, userId: true, trangThai: true,
                hanChinhQuy: true, hanBuocThoiHoc: true, hanGiaHan: true,
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
                            ? { trangThai: ncs.trangThai, hanGiaHan: ngayChuoi(ncs.hanGiaHan) }
                            : undefined,
                        newValue: {
                            loai,
                            soQuyetDinh: d.soQuyetDinh,
                            ngayQuyetDinh: d.ngayQuyetDinh,
                            trangThai: trangThaiMoi ?? null,
                            hanGiaHan: ngayChuoi(hanMoi),
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

    async deactivateDecision(id: string, lyDo: string) {
        const qd = await this.prisma.quyetDinh.findUnique({ where: { id } });
        if (!qd) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
        }
        if (qd.trangThai === 'DEACTIVATE') {
            throw new RpcException({ statusCode: 400, message: 'Quyết định đã bị vô hiệu hóa' });
        }
        return this.prisma.quyetDinh.update({
            where: { id },
            data: {
                trangThai: 'DEACTIVATE',
                // Giữ ghi chú cũ, thêm lý do vô hiệu hóa vào sau
                ghiChu: [qd.ghiChu, `Vô hiệu hóa với lý do: ${lyDo}`].filter(Boolean).join('\n'),
            },
        });
    }
}