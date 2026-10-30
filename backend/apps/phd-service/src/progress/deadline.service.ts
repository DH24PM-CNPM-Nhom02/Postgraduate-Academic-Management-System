import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { congNgay, congNgayLamViec, congThang, kyBaoCaoTiepTheo, soNgayGiua, layNgay } from '../helpers/date.util.js';
import { isRealDate } from '../helpers/validateData.util.js';

const SO_NGAY_SAP_HAN = 30;            // còn từ 30 ngày trở xuống thì báo "sắp hết hạn"


// Mốc 6 (báo cáo tiến độ định kỳ / bảo vệ giữa kỳ): 02 lần mỗi năm, vào tháng 6 và tháng 12.
// Là lịch cố định cho mọi NCS nên viết thẳng trong code, không đưa vào bảng moc_han.
const MOC_BAO_CAO_DINH_KY = 6;
const THANG_BAO_CAO_DINH_KY = [6, 12];

type NcsHan = {
  ngayNhapHoc: Date;
  hanChinhQuy: Date;
  hanGiaHan: Date | null;
  hanBuocThoiHoc: Date;
};

type HanDaTinh = {
  h: { maHan: string; tenHan: string; laHanMem: boolean; canCu: string | null };
  han: Date | null;
};

type MocHan = {
  maHan: string;
  tenHan: string;
  mocGoc: 'NGAY_NHAP_HOC' | 'NGAY_MOC_DAT' | 'HET_HAN_CHINH_QUY';
  gocThuTu: number | null;
  soDonVi: number;
  donVi: 'NGAY' | 'NGAY_LAM_VIEC' | 'THANG';
  laHanMem: boolean;
  canCu: string | null;
};

const ngayChuoi = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

@Injectable()
export class DeadlineService {
  constructor(private readonly prisma: PrismaService) { }

  /** Tính 1 hạn từ ngày gốc. Trả về null nếu chưa có ngày gốc (vd mốc 8 chưa được duyệt). */
  private tinhMotHan(h: MocHan, ncs: NcsHan, ngayDatCuaMoc: Map<number, Date>): Date | null {
    let goc: Date | null = null;
    if (h.mocGoc === 'NGAY_NHAP_HOC') {
      goc = ncs.ngayNhapHoc;
    } else if (h.mocGoc === 'NGAY_MOC_DAT') {
      goc = h.gocThuTu ? (ngayDatCuaMoc.get(h.gocThuTu) ?? null) : null;
    } else {
      // Hết hạn chính quy: nếu NCS đã được gia hạn thì lấy hạn gia hạn (đã nằm trong 72 tháng)
      goc = ncs.hanGiaHan ?? ncs.hanChinhQuy;
    }
    if (!goc) {
      return null;
    }

    let han: Date;
    if (h.donVi === 'THANG') {
      han = congThang(goc, h.soDonVi);
    } else if (h.donVi === 'NGAY') {
      han = congNgay(goc, h.soDonVi);
    } else {
      han = congNgayLamViec(goc, h.soDonVi); // chỉ dùng số dương
    }

    // Không hạn nào được vượt quá tổng thời gian tối đa 72 tháng
    return han > ncs.hanBuocThoiHoc ? ncs.hanBuocThoiHoc : han;
  }

  /**
   * Hạn của tất cả mốc của một NCS, key là thứ tự mốc (1..9).
   * hanHieuLuc = hanKeHoach (nếu Giáo vụ đã nhập) hoặc hạn cứng sớm nhất của mốc.
   */
  async tinhHanCacMoc(ncsId: string) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: ncsId },
      select: { ngayNhapHoc: true, hanChinhQuy: true, hanGiaHan: true, hanBuocThoiHoc: true },
    });
    if (!ncs) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
    }

    const tienTrinhs = await this.prisma.tienTrinhNcs.findMany({
      where: { ncsId },
      select: {
        trangThai: true,
        passedAt: true,
        hanKeHoach: true,
        moc: {
          select: {
            thuTu: true,
            hans: true
          }
        }
      },
    });

    // Ngày mỗi mốc được duyệt đạt, dùng làm gốc cho hạn kiểu NGAY_MOC_DAT(xây dựng danh sách ngày đạt của các mốc)
    const ngayDatCuaMoc = new Map<number, Date>();
    for (const tt of tienTrinhs) {
      if (tt.passedAt) {
        ngayDatCuaMoc.set(tt.moc.thuTu, tt.passedAt);
      }
    }

    const homNay = new Date();
    const ketQua: Record<number, unknown> = {};

    for (const tt of tienTrinhs) {
      const cacHan: HanDaTinh[] = tt.moc.hans.map((h) => ({
        h,
        han: this.tinhMotHan(h, ncs, ngayDatCuaMoc),
      }));

      // Mốc 6: hạn là ngày cuối của kỳ báo cáo (30/06 hoặc 31/12) sắp tới, không vượt 72 tháng
      if (tt.moc.thuTu === MOC_BAO_CAO_DINH_KY && tt.trangThai !== 'PASSED') {
        const kyTiepTheo = kyBaoCaoTiepTheo(homNay, THANG_BAO_CAO_DINH_KY);
        cacHan.push({
          h: {
            maHan: 'KY_BAO_CAO_TIEP_THEO',
            tenHan: 'Báo cáo tiến độ định kỳ (kỳ tiếp theo)',
            laHanMem: false,
            canCu: 'Định kỳ 02 lần mỗi năm vào tháng 6 và tháng 12',
          },
          han: kyTiepTheo > ncs.hanBuocThoiHoc ? ncs.hanBuocThoiHoc : kyTiepTheo,
        });
      }

      // Hạn cứng của mốc = hạn sớm nhất trong các quy tắc hạn cứng đã tính được. Hạn mềm không tham gia chọn ngày này.
      const hanCungList = cacHan.filter((x) => !x.h.laHanMem && x.han).map((x) => x.han as Date);
      const hanCung = hanCungList.length > 0 ? new Date(Math.min(...hanCungList.map((d) => d.getTime()))) : null;

      // Hạn hiệu lực (hanHieuLuc) ưu tiên hạn kế hoạch do Giáo vụ nhập. Nếu không có hạn kế hoạch thì sử dụng hạn cứng.
      const hanHieuLuc = tt.hanKeHoach ?? hanCung;

      let tinhTrang: 'DA_DAT' | 'CHUA_CO_HAN' | 'CON_HAN' | 'SAP_HET_HAN' | 'QUA_HAN' = 'CHUA_CO_HAN';
      let soNgayConLai: number | null = null;
      if (tt.trangThai === 'PASSED') {
        tinhTrang = 'DA_DAT';
      } else if (hanHieuLuc) {
        soNgayConLai = soNgayGiua(homNay, hanHieuLuc);
        tinhTrang = soNgayConLai < 0 ? 'QUA_HAN' : soNgayConLai <= SO_NGAY_SAP_HAN ? 'SAP_HET_HAN' : 'CON_HAN';
      }

      ketQua[tt.moc.thuTu] = {
        hanHieuLuc: ngayChuoi(hanHieuLuc),
        hanKeHoach: ngayChuoi(tt.hanKeHoach),
        hanCung: ngayChuoi(hanCung),
        tinhTrang,
        soNgayConLai,
        cacHan: cacHan.map((x) => ({
          maHan: x.h.maHan,
          tenHan: x.h.tenHan,
          han: ngayChuoi(x.han),
          laHanMem: x.h.laHanMem,
          canCu: x.h.canCu,
        })),
      };
    }
    return { hanHieuLucCuaMoc: ketQua, hanCuaNcs: { hanChinhQuy: ngayChuoi(ncs.hanChinhQuy), hanGiaHan: ngayChuoi(ncs.hanGiaHan), hanBuocThoiHoc: ngayChuoi(ncs.hanBuocThoiHoc) } };
  }

  /** Giáo vụ nhập hoặc xóa (hanKeHoach = null) hạn theo kế hoạch toàn khóa của một mốc. */
  async datHanKeHoach(actorId: string, tienTrinhId: string, hanKeHoach: string | null) {
    const tienTrinh = await this.prisma.tienTrinhNcs.findUnique({
      where: { id: tienTrinhId },
      select: {
        id: true,
        ncsId: true,
        trangThai: true,
        hanKeHoach: true,
        moc: {
          select: {
            thuTu: true
          }
        },
        ncs: {
          select: {
            hanBuocThoiHoc: true,
            ngayNhapHoc: true
          }
        }
      },
    });
    if (!tienTrinh) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tiến trình' });
    }
    if (tienTrinh.trangThai === 'PASSED') {
      throw new RpcException({ statusCode: 400, message: 'Mốc đã đạt, không cần đặt hạn kế hoạch' });
    }

    let ngayMoi: Date | null = null;
    if (hanKeHoach !== null) {
      if (!isRealDate(hanKeHoach)) {
        throw new RpcException({ statusCode: 400, message: 'Hạn kế hoạch không hợp lệ' });
      }
      ngayMoi = new Date(`${hanKeHoach}T00:00:00.000Z`);

      if (ngayMoi > tienTrinh.ncs.hanBuocThoiHoc) {
        throw new RpcException({ statusCode: 400, message: 'Hạn kế hoạch không được vượt quá hạn tối đa 72 tháng của NCS' });
      }
      // Không được muộn hơn hạn cứng của mốc (nếu mốc có hạn cứng)
      const han = (await this.tinhHanCacMoc(tienTrinh.ncsId)).hanHieuLucCuaMoc[tienTrinh.moc.thuTu] as { hanCung: string | null };
      if (han.hanCung && hanKeHoach > han.hanCung) {
        throw new RpcException({ statusCode: 400, message: `Hạn kế hoạch không được muộn hơn hạn quy định của mốc (${han.hanCung})` });
      }
      // Không được sớm hơn ngày quyết định giao cho NCS hướng dẫn
      if (ngayMoi < tienTrinh.ncs.ngayNhapHoc) {
        throw new RpcException({ statusCode: 400, message: 'Hạn kế hoạch không được sớm hơn ngày quyết định giao cho NCS hướng dẫn của NCS' });
      }
      // Không được sớm hơn ngày hiện tại
      if (ngayMoi < layNgay(new Date())) {
        throw new RpcException({ statusCode: 400, message: 'Hạn kế hoạch không được đặt trong quá khứ' });
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.tienTrinhNcs.update({
        where: { id: tienTrinh.id },
        data: {
          hanKeHoach: ngayMoi
        }
      });
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'MILESTONE_PLAN_DEADLINE_SET',
          entityType: 'TienTrinhNcs',
          entityId: tienTrinh.id,
          ncsId: tienTrinh.ncsId,
          oldValue: { hanKeHoach: ngayChuoi(tienTrinh.hanKeHoach) },
          newValue: { hanKeHoach: ngayChuoi(ngayMoi), thuTu: tienTrinh.moc.thuTu },
        },
      });
    });

    return { tienTrinhId: tienTrinh.id, hanKeHoach: ngayChuoi(ngayMoi) };
  }
}
