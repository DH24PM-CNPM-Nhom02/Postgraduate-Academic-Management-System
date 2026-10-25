import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { goiService } from '../helpers/call-service.util.js';


@Injectable()
export class ProgressService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
    ) { }

    private async callDocument<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
        return goiService<T>(this.document, cmd, payload, ms);
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

        return this.prisma.$transaction(async (tx) => {
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
    }

    //ncs tự xem tiến trình của mình 
    async tienTrinhCuaToi(userId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { userId },
            select: { id: true, mshv: true, hoTen: true, lop: true },
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
            select: { id: true, mshv: true, hoTen: true, lop: true },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
        }
        return this.layTienTrinh(ncs);
    }

    //lấy 9 mốc tiến trình kèm lịch sử nộp của từng mốc
    private async layTienTrinh(ncs: { id: string, mshv: string, hoTen: string, lop: string | null }) {
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
                    }
                }
            }
        })
        return {
            ncs,
            tienTrinhs: danhSach.map((tt) => ({
                ...tt,
                //FE dùng cờ này để bật tắt nút nộp minh chứng của mốc đó
                coTheNop: tt.trangThai === "UNLOCKED" || tt.trangThai === "REJECTED"
            }))
        }
    }

    // Giáo vụ: các mốc đang chờ duyệt, nộp trước xếp trước
    async danhSachChoDuyet() {
        const danhSach = await this.prisma.tienTrinhNcs.findMany({
            where: { trangThai: 'PENDING_REVIEW' },
            orderBy: { submittedAt: 'asc' },
            select: {
                id: true,
                submittedAt: true,
                ncs: { select: { id: true, mshv: true, hoTen: true, lop: true } },
                moc: { select: { thuTu: true, tenMoc: true, yeuCauDiem: true } },
                // Chỉ lấy lần nộp mới nhất, chính là lần đang chờ duyệt
                minhChungs: {
                    orderBy: { lanNop: 'desc' },
                    take: 1,
                    select: { id: true, lanNop: true, fileId: true, ghiChuNcs: true, ngayNop: true },
                },
            },
        });

        return danhSach.map(({ minhChungs, ...tienTrinh }) => ({
            ...tienTrinh,
            minhChungMoiNhat: minhChungs[0] ?? null,
        }));
    }
}