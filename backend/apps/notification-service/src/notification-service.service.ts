import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MAU_THONG_BAO } from './notification.templates.js';
import { tinhHetHanKhiDoc, tinhHetHanKhiTao } from './notification.policy.js';
import { NhomThongBao, Prisma } from './generated/prisma/index.js';
import { PrismaService } from './prisma/prisma.service.js';

const NHOM_HOP_LE = ['QUYET_DINH', 'TIEN_DO', 'NHAC_HAN', 'HE_THONG', 'CANH_BAO_KY_THUAT'];

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(private readonly prisma: PrismaService) { }

    // Mọi query (danhSach, demChuaDoc, danhDauDaDoc) đều gắn điều kiện này
    // Ngay khi thông báo vượt qua hetHanAt, người dùng sẽ không còn thấy nó nữa, ngay cả khi tiến trình dọn dẹp database ban đêm chưa chạy
    private conHan() {
        return { OR: [{ hetHanAt: null }, { hetHanAt: { gt: new Date() } }] };
    }

    // Nhận thông báo từ các service khác, có thể gửi cho nhiều người cùng lúc
    async create(d: { userIds: string[]; loai: string; duLieu?: Record<string, unknown>; khoaTrung?: string }) {
        const mau = MAU_THONG_BAO[d.loai];
        if (!mau) {
            this.logger.warn(`Bỏ qua thông báo, loại không có trong template: ${d.loai}`);
            return { soLuong: 0 };
        }
        //lọc ds user và loại những id trùng
        const userIds = [...new Set((d.userIds ?? []).filter((u) => typeof u === 'string' && u.length > 0))];
        if (userIds.length === 0) return { soLuong: 0 };

        const bayGio = new Date();
        const duLieu = d.duLieu ?? {};
        const hetHanAt = tinhHetHanKhiTao(mau.nhom, bayGio, duLieu); //tạo thời hạn lưu trữ cho tb đó
        const tieuDe = mau.tieuDe(duLieu).slice(0, 200);
        const noiDung = mau.noiDung(duLieu);

        const ketQua = await this.prisma.notification.createMany({
            data: userIds.map((userId) => ({
                userId,
                nhom: mau.nhom,
                loai: d.loai,
                tieuDe,
                noiDung,
                duLieu: duLieu as Prisma.InputJsonValue,
                // Cùng một khóa gửi lại sẽ bị bỏ qua nhờ unique + skipDuplicates
                khoaTrung: d.khoaTrung ? `${d.khoaTrung}:${userId}`.slice(0, 191) : null,
                hetHanAt,
                createdAt: bayGio,
            })),
            skipDuplicates: true,
        });
        return { soLuong: ketQua.count };
    }

    async danhSach(f: { userId: string; chiChuaDoc?: boolean; nhom?: string; trang?: number; soLuong?: number }) {
        const trang = Math.max(1, Math.floor(f.trang ?? 1));
        const soLuong = Math.min(50, Math.max(1, Math.floor(f.soLuong ?? 20)));
        if (f.nhom && !NHOM_HOP_LE.includes(f.nhom)) {
            throw new RpcException({ statusCode: 400, message: 'Nhóm thông báo không hợp lệ' });
        }
        const where = {
            userId: f.userId,
            ...(f.chiChuaDoc ? { daDoc: false } : {}),
            ...(f.nhom ? { nhom: f.nhom as NhomThongBao } : {}),
            ...this.conHan(),
        };
        const [tong, items] = await this.prisma.$transaction([
            this.prisma.notification.count({ where }),
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (trang - 1) * soLuong,
                take: soLuong,
            }),
        ]);
        return { items, tong, trang, soLuong };
    }

    async demChuaDoc(userId: string) {
        const soLuong = await this.prisma.notification.count({
            where: { userId, daDoc: false, ...this.conHan() },
        });
        return { soLuong };
    }

    // Chỉ đánh dấu được thông báo của chính mình (lọc theo userId)
    async danhDauDaDoc(userId: string, id: string) {
        const tb = await this.prisma.notification.findFirst({ where: { id, userId, ...this.conHan() } });
        if (!tb) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy thông báo' });
        }
        if (tb.daDoc) return tb;

        const bayGio = new Date();
        return this.prisma.notification.update({
            where: { id },
            data: {
                daDoc: true,
                readAt: bayGio,
                hetHanAt: tinhHetHanKhiDoc(tb.nhom, bayGio, tb.createdAt, tb.duLieu as Record<string, unknown> | null),
            },
        });
    }

    // Mỗi dòng có thể có hạn khác nhau (nhắc hạn, thông báo hệ thống), nên tính và cập nhật từng dòng
    async danhDauTatCaDaDoc(userId: string) {
        const chuaDoc = await this.prisma.notification.findMany({
            where: { userId, daDoc: false, ...this.conHan() },
            take: 1000,
        });
        if (chuaDoc.length === 0) return { soLuong: 0 };

        const bayGio = new Date();
        await this.prisma.$transaction(
            chuaDoc.map((tb) =>
                this.prisma.notification.update({
                    where: { id: tb.id },
                    data: {
                        daDoc: true,
                        readAt: bayGio,
                        hetHanAt: tinhHetHanKhiDoc(tb.nhom, bayGio, tb.createdAt, tb.duLieu as Record<string, unknown> | null),
                    },
                }),
            ),
        );
        return { soLuong: chuaDoc.length };
    }

    // Dùng cho tác vụ dọn dẹp hằng ngày
    async xoaQuaHan() {
        const ketQua = await this.prisma.notification.deleteMany({
            where: { hetHanAt: { lte: new Date() } },
        });
        return ketQua.count;
    }
}