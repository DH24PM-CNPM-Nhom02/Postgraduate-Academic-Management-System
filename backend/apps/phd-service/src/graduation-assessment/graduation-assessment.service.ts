import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PrismaService } from "../prisma/prisma.service.js";
import { ListXetTotNghiepQueryDto, XacNhanCongNoDto, XacNhanNgoaiNguDto } from "../../../../lib/contracts/src/dto/graduation-assessment.dto.js";
import { goiService } from "../helpers/call-service.util.js";
import { tinhKetQuaTotNghiep, TRANG_THAI_DUOC_XET } from "./confirm-graduation.js";
import { ngayChuoi, parseNgay } from "../helpers/validateData.util.js";
import { NotificationClient } from "../notification/notification.client.js";


@Injectable()
export class GraduationAssessmentService {
    constructor(
        private prisma: PrismaService,
        @Inject('DOCUMENT_SERVICE') private readonly document: ClientProxy,
        private readonly thongBao: NotificationClient,
    ) { }

    private async callDocument<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
        return goiService<T>(this.document, cmd, payload, ms);
    }

    // Kiểm tra NCS có tồn tại và chưa tốt nghiệp (đã tốt nghiệp thì không sửa nữa)
    private async kiemTraTruocKhiXacNhan(ncsId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: ncsId } });
        if (!ncs) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });

        const xet = await this.prisma.xetTotNghiep.findUnique({ where: { ncsId } });
        if (xet?.trangThai === 'DA_DUYET') {
            throw new RpcException({ statusCode: 400, message: 'NCS đã tốt nghiệp, không thể sửa xác nhận' });
        }
    }

    // Kiểm tra file đính kèm (nếu có gửi lên): file tồn tại và đúng loại
    private async kiemTraFile(fileId: string | undefined, loaiFile: string, nguoiXacNhanId: string) {
        if (!fileId) return;

        // document.get tự kiểm tra file có tồn tại không (không có thì ném 404)
        const thongTinFile = await this.callDocument<{ documentType: string }>('document.get', {
            nguoiDung: { id: nguoiXacNhanId, laNhanVien: true },
            id: fileId,
        });

        if (thongTinFile.documentType !== loaiFile) {
            throw new RpcException({ statusCode: 400, message: 'File đính kèm không đúng loại' });
        }
    }

    // kiểm tra điều kiện xét tốt nghiệp của 1 NCS
    async kiemTra(ncsId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { id: ncsId },
            select: {
                id: true,
                mshv: true,
                hoTen: true,
                trangThai: true,
                hanBuocThoiHoc: true,
                tienTrinhs: { select: { trangThai: true, passedAt: true, moc: { select: { thuTu: true } } } },
                xetTotNghiep: true,
            },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
        }

        const tongMoc = await this.prisma.mocTienTrinh.count();
        const soDeNghiCho = await this.prisma.deNghiDieuChinh.count({
            where: { ncsId, trangThai: 'CHO_DUYET' },
        });
        return tinhKetQuaTotNghiep(ncs, tongMoc, soDeNghiCho);
    }

    // ===== Danh sách NCS đã xong các mốc để Giáo vụ xét tốt nghiệp =====
    // duDieuKien = 'true' chỉ lấy NCS đủ điều kiện, 'false' chỉ lấy NCS còn thiếu, bỏ trống thì lấy cả hai
    async danhSach(d: ListXetTotNghiepQueryDto) {
        const tongMoc = await this.prisma.mocTienTrinh.count();

        // Chỉ lấy NCS đang học (hoặc gia hạn) mà tất cả mốc đã PASSED
        const dsNcs = await this.prisma.nghienCuuSinh.findMany({
            where: {
                trangThai: { in: TRANG_THAI_DUOC_XET as any },
                AND: [
                    { tienTrinhs: { some: {} } }, //ncs phải có ít nhất 1 tiến trình
                    { tienTrinhs: { every: { trangThai: 'PASSED' } } }, //và tất cả tiến trình phải pass hết
                ],
            },
            select: {
                id: true,
                mshv: true,
                hoTen: true,
                trangThai: true,
                hanBuocThoiHoc: true,
                tienTrinhs: { select: { trangThai: true, passedAt: true, moc: { select: { thuTu: true } } } },
                xetTotNghiep: true,
            },
            orderBy: { mshv: 'asc' },
        });

        // Đếm đề nghị đang chờ duyệt của các NCS này bằng 1 câu truy vấn
        const dem = await this.prisma.deNghiDieuChinh.groupBy({
            by: ['ncsId'],
            where: { ncsId: { in: dsNcs.map((n) => n.id) }, trangThai: 'CHO_DUYET' },
            _count: { _all: true },
        });
        const soDeNghiCho = new Map(dem.map((x) => [x.ncsId, x._count._all]));

        let ketQua = dsNcs.map((ncs) => tinhKetQuaTotNghiep(ncs, tongMoc, soDeNghiCho.get(ncs.id) ?? 0));
        if (d.duDieuKien === 'true') ketQua = ketQua.filter((k) => k.duDieuKien);
        if (d.duDieuKien === 'false') ketQua = ketQua.filter((k) => !k.duDieuKien);

        const wantPagination = d.page != null && d.limit != null;
        if (!wantPagination) {
            return ketQua;
        }

        const total = ketQua.length;
        const page = Math.max(1, Number(d.page));
        const limit = Math.min(100, Math.max(1, Number(d.limit)));
        const data = ketQua.slice((page - 1) * limit, page * limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    async xacNhanNgoaiNgu(ncsId: string, dto: XacNhanNgoaiNguDto, nguoiXacNhanId: string) {
        await this.kiemTraTruocKhiXacNhan(ncsId);

        if (dto.dat && (!dto.chuanDauRa || !dto.ngayCongNhanNgoaiNgu)) {
            throw new RpcException({ statusCode: 400, message: 'Cần nhập chuẩn đầu ra và ngày công nhận' });
        }

        // Kiểm tra file nếu có
        await this.kiemTraFile(dto.fileId, 'MINH_CHUNG_NGOAI_NGU', nguoiXacNhanId);

        const data = {
            datNgoaiNgu: dto.dat,
            chuanDauRaNgoaiNgu: dto.dat ? dto.chuanDauRa : null,
            ngayCongNhanNgoaiNgu: dto.dat ? new Date(dto.ngayCongNhanNgoaiNgu!) : null,
            ngoaiNguGhiChu: dto.ghiChu ?? null,
            ngoaiNguNguoiXacNhanId: nguoiXacNhanId,
            ngoaiNguNgayXacNhan: new Date(),
        };

        return this.prisma.xetTotNghiep.upsert({
            where: { ncsId },
            update: data,
            create: { ncsId, ...data },
        });
    }

    async xacNhanCongNo(ncsId: string, dto: XacNhanCongNoDto, nguoiXacNhanId: string) {
        await this.kiemTraTruocKhiXacNhan(ncsId);

        // Kiểm tra file nếu có
        await this.kiemTraFile(dto.fileId, 'MINH_CHUNG_CONG_NO', nguoiXacNhanId);

        const data = {
            khongConCongNo: dto.khongConCongNo,
            congNoGhiChu: dto.ghiChu ?? null,
            congNoNguoiXacNhanId: nguoiXacNhanId,
            congNoNgayXacNhan: new Date(),
        };

        return this.prisma.xetTotNghiep.upsert({
            where: { ncsId },
            update: data,
            create: { ncsId, ...data },
        });
    }

    // ===== Giáo vụ xác nhận tốt nghiệp =====
    // Quyết định công nhận tốt nghiệp đã được tạo trước bằng API quyết định (loại CONG_NHAN_TOT_NGHIEP,
    // mỗi NCS 1 dòng). Ở đây chọn NCS nào thì chọn quyết định tương ứng của NCS đó.
    // Tất cả NCS phải hợp lệ và đủ điều kiện, thiếu 1 người thì không lưu gì cả.
    async xacNhanTotNghiep(d: {
        nguoiXacNhanId: string;
        danhSach: { ncsId: string; quyetDinhId: string; ngayTotNghiep?: string }[];
    }) {
        if (d.danhSach.length === 0) {
            throw new RpcException({ statusCode: 400, message: 'Phải chọn ít nhất 1 NCS' });
        }
        const dsNcsId = d.danhSach.map((x) => x.ncsId);
        const dsQuyetDinhId = d.danhSach.map((x) => x.quyetDinhId);
        if (new Set(dsNcsId).size !== dsNcsId.length) {
            throw new RpcException({ statusCode: 400, message: 'Mỗi NCS chỉ được xuất hiện 1 lần trong danh sách' });
        }
        if (new Set(dsQuyetDinhId).size !== dsQuyetDinhId.length) {
            throw new RpcException({ statusCode: 400, message: 'Mỗi quyết định chỉ được gắn cho 1 NCS' });
        }

        // Hồ sơ NCS (giữ giá trị cũ trong audit để hoàn tác sau này)
        const dsNcs = await this.prisma.nghienCuuSinh.findMany({
            where: { id: { in: dsNcsId } },
            select: {
                id: true, mshv: true, userId: true, hoTen: true, trangThai: true,
                ngayChuyenTrangThai: true, lyDoChuyenTrangThai: true,
            },
        });
        if (dsNcs.length !== dsNcsId.length) {
            const idTonTai = new Set(dsNcs.map((n) => n.id));
            const idKhongTonTai = dsNcsId.filter((id) => !idTonTai.has(id));
            throw new RpcException({ statusCode: 404, message: `Các NCS sau không tồn tại: ${idKhongTonTai.join(', ')}` });
        }
        const ncsMap = new Map(dsNcs.map((n) => [n.id, n] as const));

        // Quyết định đã chọn: phải tồn tại, đúng loại, còn hiệu lực và đúng NCS
        const dsQuyetDinh = await this.prisma.quyetDinh.findMany({
            where: { id: { in: dsQuyetDinhId } },
            select: {
                id: true,
                loai: true,
                trangThai: true,
                ncsId: true,
                soQuyetDinh: true,
                ngayQuyetDinh: true
            },
        });
        const quyetDinhMap = new Map(dsQuyetDinh.map((q) => [q.id, q] as const));
        // kiểm tra điều kiện của từng NCS và Quyết định 
        const dongXacNhan = d.danhSach.map((x) => {
            const ncs = ncsMap.get(x.ncsId)!;
            const qd = quyetDinhMap.get(x.quyetDinhId);
            if (!qd) {
                throw new RpcException({ statusCode: 404, message: `Không tìm thấy quyết định ${x.quyetDinhId}` });
            }
            if (qd.loai !== 'CONG_NHAN_TOT_NGHIEP') {
                throw new RpcException({ statusCode: 400, message: `Quyết định ${qd.soQuyetDinh} không phải quyết định công nhận tốt nghiệp` });
            }
            if (qd.trangThai !== 'HIEU_LUC') {
                throw new RpcException({ statusCode: 400, message: `Quyết định ${qd.soQuyetDinh} đã bị vô hiệu hóa` });
            }
            if (qd.ncsId !== ncs.id) {
                throw new RpcException({ statusCode: 400, message: `Quyết định ${qd.soQuyetDinh} không thuộc NCS ${ncs.mshv}` });
            }
            // Ngày hiệu lực công nhận tốt nghiệp không nhập thì lấy theo ngày quyết định
            const ngayTn = x.ngayTotNghiep ? parseNgay(x.ngayTotNghiep, 'Ngày tốt nghiệp') : qd.ngayQuyetDinh;
            return { ncs, qd, ngayTn };
        });

        // Kiểm tra lại điều kiện ngay lúc xác nhận (dữ liệu có thể đã đổi từ lúc xem)
        const daTotNghiep: { ncsId: string; mshv: string; hoTen: string; lyDo: string }[] = [];
        const chuaDuDieuKien: { ncsId: string; mshv: string; hoTen: string; lyDo: string }[] = [];

        for (const { ncs } of dongXacNhan) {
            const kq = await this.kiemTra(ncs.id);
            if (kq.daDuyetTotNghiep || ncs.trangThai === 'DA_TOT_NGHIEP') {
                daTotNghiep.push({ ncsId: ncs.id, mshv: ncs.mshv, hoTen: ncs.hoTen, lyDo: 'Đã được duyệt tốt nghiệp' });
            } else if (!kq.duDieuKien) {
                const chuaDat = kq.dieuKien.filter((k) => !k.dat).map((k) => k.ten);
                chuaDuDieuKien.push({ ncsId: ncs.id, mshv: ncs.mshv, hoTen: ncs.hoTen, lyDo: `Chưa đạt: ${chuaDat.join(', ')}` });
            }
        }

        if (daTotNghiep.length > 0 || chuaDuDieuKien.length > 0) {
            let message = '';
            if (daTotNghiep.length > 0 && chuaDuDieuKien.length > 0) {
                message = `Có ${daTotNghiep.length} NCS đã được duyệt tốt nghiệp và ${chuaDuDieuKien.length} NCS chưa đủ điều kiện tốt nghiệp`;
            } else if (daTotNghiep.length > 0) {
                message = `Có ${daTotNghiep.length} NCS đã được duyệt tốt nghiệp`;
            } else {
                message = `Có ${chuaDuDieuKien.length} NCS chưa đủ điều kiện tốt nghiệp`;
            }

            throw new RpcException({
                statusCode: 400,
                message,
                chiTiet: [...daTotNghiep, ...chuaDuDieuKien],
            });
        }

        const bayGio = new Date();

        await this.prisma.$transaction(async (tx) => {
            for (const { ncs, qd, ngayTn } of dongXacNhan) {
                // Chỉ đổi khi NCS vẫn đang học/gia hạn, chống 2 người xác nhận cùng lúc
                const daDoi = await tx.nghienCuuSinh.updateMany({
                    where: { id: ncs.id, trangThai: { in: TRANG_THAI_DUOC_XET as any } },
                    data: {
                        trangThai: 'DA_TOT_NGHIEP',
                        ngayChuyenTrangThai: ngayTn,
                        lyDoChuyenTrangThai: `Công nhận tốt nghiệp theo quyết định số ${qd.soQuyetDinh}`,
                    },
                });
                if (daDoi.count !== 1) {
                    throw new RpcException({ statusCode: 409, message: `Trạng thái của NCS ${ncs.mshv} vừa thay đổi, hãy thử lại` });
                }

                const xet = await tx.xetTotNghiep.upsert({
                    where: { ncsId: ncs.id },
                    update: {
                        trangThai: 'DA_DUYET', kiemTraLuc: bayGio, nguoiDuyetId: d.nguoiXacNhanId,
                        ngayDuyet: bayGio, ngayTotNghiep: ngayTn, quyetDinhId: qd.id,
                    },
                    create: {
                        ncsId: ncs.id, trangThai: 'DA_DUYET', kiemTraLuc: bayGio, nguoiDuyetId: d.nguoiXacNhanId,
                        ngayDuyet: bayGio, ngayTotNghiep: ngayTn, quyetDinhId: qd.id,
                    },
                });

                await tx.auditLog.create({
                    data: {
                        actorId: d.nguoiXacNhanId,
                        action: 'XAC_NHAN_TOT_NGHIEP',
                        entityType: 'XetTotNghiep',
                        entityId: xet.id,
                        ncsId: ncs.id,
                        // Giá trị cũ của NCS, dùng để hoàn tác nếu sau này làm chức năng hủy tốt nghiệp
                        oldValue: {
                            trangThai: ncs.trangThai,
                            ngayChuyenTrangThai: ngayChuoi(ncs.ngayChuyenTrangThai),
                            lyDoChuyenTrangThai: ncs.lyDoChuyenTrangThai,
                        },
                        newValue: { trangThai: 'DA_TOT_NGHIEP', ngayTotNghiep: ngayChuoi(ngayTn), quyetDinhId: qd.id },
                    },
                });
            }
        });

        await this.guiThongBaoTotNghiep(
            dongXacNhan.map(({ ncs, qd, ngayTn }) => ({
                ncs,
                soQuyetDinh: qd.soQuyetDinh,
                ngayQuyetDinh: ngayChuoi(qd.ngayQuyetDinh),
                ngayTotNghiep: ngayChuoi(ngayTn),
            })),
        );

        return {
            ketQua: dongXacNhan.map(({ ncs, qd, ngayTn }) => ({
                ncsId: ncs.id,
                mshv: ncs.mshv,
                quyetDinhId: qd.id,
                ngayTotNghiep: ngayChuoi(ngayTn),
            })),
        };
    }

    // Gửi thông báo sau khi DB đã commit (lỗi gửi không ảnh hưởng việc xác nhận)
    private async guiThongBaoTotNghiep(
        dsXacNhan: {
            ncs: { id: string; mshv: string; userId: string | null; hoTen: string };
            soQuyetDinh: string;
            ngayQuyetDinh: string | null;
            ngayTotNghiep: string | null;
        }[],
    ) {
        const phanCongs = await this.prisma.phanCongHuongDan.findMany({
            where: { ncsId: { in: dsXacNhan.map((x) => x.ncs.id) }, trangThai: 'DANG_HIEU_LUC' },
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

        for (const x of dsXacNhan) {
            const duLieu = { soQuyetDinh: x.soQuyetDinh, ngayQuyetDinh: x.ngayQuyetDinh, ngayTotNghiep: x.ngayTotNghiep };
            if (x.ncs.userId) {
                this.thongBao.gui({
                    userIds: [x.ncs.userId],
                    loai: 'TOT_NGHIEP',
                    khoaTrung: `TOT_NGHIEP:${x.soQuyetDinh}:${x.ncs.id}`,
                    duLieu,
                });
            }
            const gvhdUserIds = gvhdMap.get(x.ncs.id) ?? [];
            if (gvhdUserIds.length > 0) {
                this.thongBao.gui({
                    userIds: [...new Set(gvhdUserIds)],
                    loai: 'GVHD_NCS_TOT_NGHIEP',
                    khoaTrung: `GVHD_TOT_NGHIEP:${x.soQuyetDinh}:${x.ncs.id}`,
                    duLieu: { ...duLieu, tenNcs: x.ncs.hoTen, mshv: x.ncs.mshv },
                });
            }
        }
    }

    // ===== Danh sách quyết định công nhận tốt nghiệp chưa dùng của 1 NCS (cho ô chọn quyết định ở màn hình xác nhận) =====
    // Chỉ lấy quyết định còn hiệu lực và chưa dùng để xác nhận tốt nghiệp, mới nhất trước
    async danhSachQuyetDinhChuaDung(ncsId: string) {
        const ncs = await this.prisma.nghienCuuSinh.findUnique({
            where: { id: ncsId },
            select: { id: true },
        });
        if (!ncs) {
            throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
        }

        const dsQuyetDinh = await this.prisma.quyetDinh.findMany({
            where: {
                ncsId,
                loai: 'CONG_NHAN_TOT_NGHIEP',
                trangThai: 'HIEU_LUC',
                totNghieps: { none: { trangThai: 'DA_DUYET' } },
            },
            select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true, fileId: true, ghiChu: true },
            orderBy: { ngayQuyetDinh: 'desc' },
        });

        return dsQuyetDinh.map((q) => ({
            id: q.id,
            soQuyetDinh: q.soQuyetDinh,
            ngayQuyetDinh: ngayChuoi(q.ngayQuyetDinh),
            fileId: q.fileId,
            ghiChu: q.ghiChu,
        }));
    }
}