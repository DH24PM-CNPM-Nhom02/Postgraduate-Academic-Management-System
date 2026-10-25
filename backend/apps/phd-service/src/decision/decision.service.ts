import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { goiService } from '../helpers/call-service.util.js';
import type { LoaiQuyetDinh, TrangThaiQuyetDinh } from '../generated/prisma/index.js';

@Injectable()
export class DecisionService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
    ) { }

    async create(d: {
        nguoiTaoId: string; loai: string; soQuyetDinh: string; ngayQuyetDinh: string;
        ncsId?: string; fileId?: string; ghiChu?: string;
    }) {
        // Ngày hợp lệ thật sự (chặn 2026-02-31)
        const ngay = new Date(`${d.ngayQuyetDinh}T00:00:00.000Z`);
        if (Number.isNaN(ngay.getTime()) || ngay.toISOString().slice(0, 10) !== d.ngayQuyetDinh) {
            throw new RpcException({ statusCode: 400, message: 'Ngày quyết định không hợp lệ' });
        }

        // Cùng loại thì số quyết định không được trùng
        const dup = await this.prisma.quyetDinh.findUnique({
            where: { loai_soQuyetDinh: { loai: d.loai as LoaiQuyetDinh, soQuyetDinh: d.soQuyetDinh } },
        });
        if (dup) {
            throw new RpcException({ statusCode: 409, message: 'Số quyết định này đã tồn tại' });
        }

        if (d.ncsId) {
            const ncs = await this.prisma.nghienCuuSinh.findUnique({
                where: {
                    id: d.ncsId
                },
                select: {
                    id: true
                }
            });
            if (!ncs) {
                throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
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

        return this.prisma.quyetDinh.create({
            data: {
                loai: d.loai as LoaiQuyetDinh,
                soQuyetDinh: d.soQuyetDinh,
                ngayQuyetDinh: ngay,
                ncsId: d.ncsId,
                fileId: d.fileId,
                ghiChu: d.ghiChu,
                nguoiTaoId: d.nguoiTaoId,
            },
        });
    }

    getListDecision(f: { ncsId?: string; loai?: string; trangThai?: string }) {
        return this.prisma.quyetDinh.findMany({
            // Giá trị undefined thì Prisma bỏ qua điều kiện đó
            where: {
                ncsId: f.ncsId,
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