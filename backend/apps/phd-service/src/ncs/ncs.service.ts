import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';

import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import type { CreateNcsItemDto } from '../../../../lib/contracts/src/dto/ncs.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrangThaiMoc } from '../generated/prisma/index.js';

type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
};

// Thời gian đào tạo tính theo tháng.
// Lưu ý: các giá trị này cần đúng với quy định thực tế của trường.
const THOI_GIAN_DAO_TAO = {
  THAC_SI: 36,
  DAI_HOC: 48,
};

const SO_THANG_TOI_DA = 72;

/**
 * Cộng số tháng vào một ngày.
 * Ví dụ: 31/01 cộng 1 tháng sẽ thành ngày cuối tháng 2.
 */
function congThang(ngay: Date, soThang: number): Date {
  const nam = ngay.getUTCFullYear();
  const thang = ngay.getUTCMonth() + soThang;
  const ngayTrongThang = ngay.getUTCDate();

  const ngayCuoiThangDich = new Date(Date.UTC(nam, thang + 1, 0)).getUTCDate();
  const ngayKetQua = Math.min(ngayTrongThang, ngayCuoiThangDich);

  return new Date(Date.UTC(nam, thang, ngayKetQua));
}

/**
 * Chuẩn hóa chữ để so sánh mã/tên:
 * - không phân biệt chữ hoa và chữ thường
 * - bỏ dấu tiếng Việt
 * - bỏ khoảng trắng ở đầu và cuối
 */
function chuanHoaChuoi(chuoi: string): string {
  return chuoi
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * Tìm một giá trị trong danh sách đã chuẩn hóa.
 * Ví dụ: tìm tên ngành từ mã ngành hoặc tên ngành.
 */
export function timTrongDanhSach(
  danhSach: Map<string, number | string>,
  giaTri?: string,
): number | string | null {
  if (!giaTri) {
    return null;
  }

  const khoa = chuanHoaChuoi(giaTri);
  return danhSach.get(khoa) ?? null;
}

/**
 * Tạo dữ liệu hồ sơ NCS trước khi lưu vào database.
 */
function taoDuLieuHoSo(
  item: CreateNcsItemDto,
  taiKhoan: AuthUser,
  danhSachNganh: Map<string, number>,
  danhSachKhoa: Map<string, string>,
) {
  const ngayNhapHoc = new Date(item.ngayNhapHoc);
  const trinhDo = item.trinhDoDauVao ?? 'THAC_SI';

  const soThangDaoTao = THOI_GIAN_DAO_TAO[trinhDo];

  return {
    id: randomUUID(),
    userId: taiKhoan.id,
    mshv: item.mshv,
    hoTen: item.hoTen ?? taiKhoan.fullName,
    ngaySinh: item.ngaySinh ? new Date(item.ngaySinh) : null,
    gioiTinh: item.gioiTinh ?? null,
    cccd: item.cccd ?? null,
    email: item.email ?? null,
    soDienThoai: item.soDienThoai ?? null,

    nganhId: timTrongDanhSach(danhSachNganh, item.nganh) as number | null,
    lop: item.lop ?? null,

    // Giữ lại mã khóa người dùng nhập và liên kết với danh mục khóa học.
    khoaHoc: item.khoaHoc ?? null,
    khoaHocId: timTrongDanhSach(danhSachKhoa, item.khoaHoc) as string | null,

    ngayNhapHoc,
    trinhDoDauVao: trinhDo,
    phuongThucDaoTao: item.phuongThucDaoTao ?? 'PHUONG_THUC_2',

    hanChinhQuy: congThang(ngayNhapHoc, soThangDaoTao),
    hanBuocThoiHoc: congThang(ngayNhapHoc, SO_THANG_TOI_DA),
  };
}

@Injectable()
export class NcsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
  ) { }

  /**
   * Gọi auth-service để lấy thông tin tài khoản.
   * Nếu service không phản hồi trong 5 giây hoặc bị lỗi,
   * trả về lỗi để hệ thống phía trên xử lý.
   */
  async callAuth<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
    return firstValueFrom(
      this.auth.send<T>({ cmd }, payload).pipe(
        timeout(ms),
        catchError((err) =>
          throwError(
            () =>
              new RpcException(
                err?.statusCode ? err : { statusCode: 502, message: 'Không gọi được auth-service' },
              ),
          ),
        ),
      ),
    );
  }

  /**
   * Tạo nhiều hồ sơ NCS trong một lần.
   * Chỉ lưu dữ liệu khi toàn bộ dòng đều hợp lệ.
   */
  async createMany(actorId: string, items: CreateNcsItemDto[]) {
    const danhSachMshv: string[] = [];

    for (const item of items) {
      danhSachMshv.push(item.mshv);
    }

    this.kiemTraMshvBiLap(danhSachMshv);

    // Lấy tài khoản và hồ sơ hiện có để kiểm tra dữ liệu.
    const taiKhoanTheoMshv = await this.getAccounts(danhSachMshv);
    const mshvDaCoHoSo = await this.getMshvHavingProfile(danhSachMshv);

    const danhSachCccd: (string | undefined)[] = [];
    const danhSachNganhCanTim: (string | undefined)[] = [];
    const danhSachKhoaCanTim: (string | undefined)[] = [];
    const danhSachSdt: (string | undefined)[] = [];
    for (const item of items) {
      danhSachCccd.push(item.cccd);
      danhSachNganhCanTim.push(item.nganh);
      danhSachKhoaCanTim.push(item.khoaHoc);
      danhSachSdt.push(item.soDienThoai);
    }

    const cccdDaSuDung = await this.getCccdTaken(danhSachCccd);
    const danhSachNganh = await this.getListNganh(danhSachNganhCanTim);
    const danhSachKhoa = await this.getListKhoaHoc(danhSachKhoaCanTim);
    const sdtDaSuDung = await this.getSdtTaken(danhSachSdt);
    // Nếu có bất kỳ dòng sai nào, hàm này sẽ báo lỗi và dừng lại.
    this.kiemTraTatCaDuLieu(
      items,
      taiKhoanTheoMshv,
      mshvDaCoHoSo,
      cccdDaSuDung,
      sdtDaSuDung,
      danhSachNganh,
    );

    const danhSachMoc = await this.layDanhSachMoc();

    const danhSachHoSo = [];
    for (const item of items) {
      const taiKhoan = taiKhoanTheoMshv.get(item.mshv);

      // Dữ liệu đã được kiểm tra nên tài khoản phải tồn tại.
      if (!taiKhoan) {
        throw new RpcException({
          statusCode: 400,
          message: `Không tìm thấy tài khoản của ${item.mshv}`,
        });
      }

      const hoSo = taoDuLieuHoSo(
        item,
        taiKhoan,
        danhSachNganh,
        danhSachKhoa.map,
      );

      danhSachHoSo.push(hoSo);
    }

    await this.luuTatCa(
      actorId,
      danhSachHoSo,
      danhSachMoc,
      danhSachKhoa.moiTao,
    );

    // Chỉ trả về những thông tin cần thiết cho màn hình kết quả.
    const ketQua = [];
    for (const hoSo of danhSachHoSo) {
      ketQua.push({
        id: hoSo.id,
        mshv: hoSo.mshv,
        hoTen: hoSo.hoTen,
        hanChinhQuy: hoSo.hanChinhQuy,
        hanBuocThoiHoc: hoSo.hanBuocThoiHoc,
      });
    }

    return ketQua;
  }

  /** Kiểm tra mã số học viên có bị lặp trong file nhập hay không. */
  private kiemTraMshvBiLap(danhSachMshv: string[]) {
    const daGap: string[] = [];
    const biLap: string[] = [];

    for (const mshv of danhSachMshv) {
      if (daGap.includes(mshv)) {
        if (!biLap.includes(mshv)) {
          biLap.push(mshv);
        }
      } else {
        daGap.push(mshv);
      }
    }

    if (biLap.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message: `MSHV bị lặp trong danh sách: ${biLap.join(', ')}`,
      });
    }
  }

  /** Gọi auth-service và sắp xếp tài khoản theo MSHV. */
  async getAccounts(
    danhSachMshv: string[],
  ): Promise<Map<string, AuthUser>> {
    const danhSachTaiKhoan = await this.callAuth<AuthUser[]>(
      'auth.find-users',
      { usernames: danhSachMshv },
    );

    const ketQua = new Map<string, AuthUser>();
    for (const taiKhoan of danhSachTaiKhoan) {
      ketQua.set(taiKhoan.username, taiKhoan);
    }

    return ketQua;
  }

  /** Lấy các MSHV đã có hồ sơ NCS. */
  async getMshvHavingProfile(
    danhSachMshv: string[],
  ): Promise<Set<string>> {
    const danhSach = await this.prisma.nghienCuuSinh.findMany({
      where: { mshv: { in: danhSachMshv } },
      select: { mshv: true },
    });

    const ketQua = new Set<string>();
    for (const dong of danhSach) {
      ketQua.add(dong.mshv);
    }

    return ketQua;
  }

  /** Lấy các CCCD đã được dùng trong hồ sơ. */
  async getCccdTaken(
    danhSachCccd: (string | undefined)[],
  ): Promise<Set<string>> {
    const cccdCanTim: string[] = [];

    for (const cccd of danhSachCccd) {
      if (cccd && cccd.trim() !== '') {
        cccdCanTim.push(cccd.trim());
      }
    }

    if (cccdCanTim.length === 0) {
      return new Set<string>();
    }

    const danhSach = await this.prisma.nghienCuuSinh.findMany({
      where: { cccd: { in: cccdCanTim } },
      select: { cccd: true },
    });

    const ketQua = new Set<string>();
    for (const dong of danhSach) {
      if (dong.cccd) {
        ketQua.add(dong.cccd);
      }
    }

    return ketQua;
  }

  async getSdtTaken(
    danhSachSdt: (string | undefined)[],
  ): Promise<Set<string>> {
    const sdtCanTim: string[] = [];

    for (const sdt of danhSachSdt) {
      if (sdt && sdt.trim() !== '') {
        const clean = sdt.trim();
        if (/^\d+$/.test(clean)) {
          sdtCanTim.push(clean);
        }
      }
    }

    if (sdtCanTim.length === 0) {
      return new Set<string>();
    }

    const danhSach = await this.prisma.nghienCuuSinh.findMany({
      where: { soDienThoai: { in: sdtCanTim } },
      select: { soDienThoai: true },
    });

    const ketQua = new Set<string>();
    for (const dong of danhSach) {
      if (dong.soDienThoai) {
        ketQua.add(dong.soDienThoai);
      }
    }

    return ketQua;
  }

  /**
   * Lấy danh mục ngành đang có.
   * Cho phép tìm bằng mã ngành hoặc tên ngành.
   */
  async getListNganh(
    cacGiaTri: (string | undefined)[],
  ): Promise<Map<string, number>> {
    const danhSach = await this.prisma.nganhDaoTao.findMany({
      select: { id: true, maNganh: true, tenNganh: true },
    });

    const ketQua = new Map<string, number>();

    for (const nganh of danhSach) {
      const maNganh = chuanHoaChuoi(nganh.maNganh);
      const tenNganh = chuanHoaChuoi(nganh.tenNganh);

      if (!ketQua.has(maNganh)) {
        ketQua.set(maNganh, nganh.id);
      }
      if (!ketQua.has(tenNganh)) {
        ketQua.set(tenNganh, nganh.id);
      }
    }

    return ketQua;
  }

  /**
   * Lấy danh mục khóa học.
   * Nếu khóa chưa tồn tại thì chuẩn bị tạo mới khi lưu hồ sơ.
   */
  async getListKhoaHoc(
    cacGiaTri: (string | undefined)[],
  ): Promise<{ map: Map<string, string>; moiTao: { id: string; maKhoaHoc: string }[] }> {
    const danhSachKhoa = await this.prisma.khoaHocNcs.findMany({
      select: { id: true, maKhoaHoc: true },
    });

    const map = new Map<string, string>();
    for (const khoa of danhSachKhoa) {
      map.set(chuanHoaChuoi(khoa.maKhoaHoc), khoa.id);
    }

    const moiTao: { id: string; maKhoaHoc: string }[] = [];
    const daXuLy: string[] = [];

    for (const giaTri of cacGiaTri) {
      if (!giaTri || giaTri.trim() === '') {
        continue;
      }

      const maKhoaHoc = giaTri.trim();
      const khoaDaChuanHoa = chuanHoaChuoi(maKhoaHoc);

      if (map.has(khoaDaChuanHoa) || daXuLy.includes(khoaDaChuanHoa)) {
        continue;
      }

      const id = randomUUID();
      map.set(khoaDaChuanHoa, id);
      moiTao.push({ id, maKhoaHoc });
      daXuLy.push(khoaDaChuanHoa);
    }

    return { map, moiTao };
  }

  /** Kiểm tra toàn bộ dòng và gom các lỗi để báo cùng lúc. */
  private kiemTraTatCaDuLieu(
    items: CreateNcsItemDto[],
    taiKhoanTheoMshv: Map<string, AuthUser>,
    mshvDaCoHoSo: Set<string>,
    cccdDaSuDung: Set<string>,
    sdtDaSuDung: Set<string>,
    danhSachNganh: Map<string, number>,
  ) {
    const danhSachLoi: { mshv: string; reason: string }[] = [];
    const cccdTheoMshv = new Map<string, string>();
    const sdtTheoMshv = new Map<string, string>();
    for (const item of items) {
      const mshv = item.mshv;
      const taiKhoan = taiKhoanTheoMshv.get(mshv);

      if (!taiKhoan) {
        danhSachLoi.push({
          mshv,
          reason: 'Chưa có tài khoản, hãy tạo tài khoản trước',
        });
      } else {
        if (!taiKhoan.roles.includes(ROLES.NCS)) {
          danhSachLoi.push({ mshv, reason: 'Tài khoản không phải là NCS' });
        }

        if (!taiKhoan.isActive) {
          danhSachLoi.push({ mshv, reason: 'Tài khoản đang bị khóa' });
        }
      }

      if (mshvDaCoHoSo.has(mshv)) {
        danhSachLoi.push({ mshv, reason: 'MSHV đã có hồ sơ' });
      }

      const cccd = item.cccd?.trim();
      if (cccd) {
        const mshvTruocDo = cccdTheoMshv.get(cccd);

        if (mshvTruocDo) {
          danhSachLoi.push({
            mshv,
            reason: `CCCD trùng với MSHV ${mshvTruocDo}`,
          });
        } else {
          cccdTheoMshv.set(cccd, mshv);
        }

        if (cccdDaSuDung.has(cccd)) {
          danhSachLoi.push({
            mshv,
            reason: 'CCCD đã có trong hồ sơ khác',
          });
        }
      }

      // SDT là unique nên trùng cũng phải báo trước, tránh fail cả lô lúc ghi
      const sdt = item.soDienThoai?.trim();
      if (sdt) {
        const mshvTruocDo = sdtTheoMshv.get(sdt);
        if (mshvTruocDo) {
          danhSachLoi.push({
            mshv,
            reason: `SĐT trùng với MSHV ${mshvTruocDo}`,
          });
        } else {
          sdtTheoMshv.set(sdt, mshv);
        }

        if (sdtDaSuDung.has(sdt)) {
          danhSachLoi.push({
            mshv,
            reason: 'SĐT đã có trong hồ sơ khác',
          });
        }
      }

      if (item.nganh && !timTrongDanhSach(danhSachNganh, item.nganh)) {
        danhSachLoi.push({
          mshv,
          reason: `Không tìm thấy ngành "${item.nganh}" trong danh mục`,
        });
      }
    }

    if (danhSachLoi.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Danh sách có dòng không hợp lệ, chưa tạo hồ sơ nào',
        errors: danhSachLoi,
      });
    }
  }

  /** Lấy 9 mốc tiến trình đã được tạo sẵn trong database. */
  async layDanhSachMoc() {
    const danhSachMoc = await this.prisma.mocTienTrinh.findMany({
      orderBy: { thuTu: 'asc' },
    });

    if (danhSachMoc.length !== 9) {
      throw new RpcException({
        statusCode: 500,
        message: 'Chưa seed đủ 9 mốc tiến trình',
      });
    }

    return danhSachMoc;
  }

  /**
   * Lưu hồ sơ, các mốc tiến trình và nhật ký trong một transaction.
   * Nếu một thao tác lưu thất bại, database sẽ không lưu dở dang các thao tác còn lại.
   */
  private async luuTatCa(
    actorId: string,
    danhSachHoSo: any[],
    danhSachMoc: any[],
    danhSachKhoaMoi: { id: string; maKhoaHoc: string }[],
  ) {
    const thoiGianHienTai = new Date();
    const danhSachTienTrinh = [];
    const danhSachNhatKy = [];

    for (const hoSo of danhSachHoSo) {
      for (const moc of danhSachMoc) {
        const laMocDauTien = moc.thuTu === 1;

        danhSachTienTrinh.push({
          ncsId: hoSo.id,
          mocId: moc.id,
          trangThai: laMocDauTien
            ? TrangThaiMoc.UNLOCKED
            : TrangThaiMoc.LOCKED,
          openedAt: laMocDauTien ? thoiGianHienTai : null,
        });
      }

      danhSachNhatKy.push({
        actorId,
        action: 'NCS_CREATE',
        entityId: hoSo.id,
        entityType: 'NghienCuuSinh',
        ncsId: hoSo.id,
        newValue: { mshv: hoSo.mshv, hoTen: hoSo.hoTen },
      });
    }

    try {
      await this.prisma.$transaction([
        // Tạo danh mục khóa trước để hồ sơ có thể tham chiếu đến khóa.
        this.prisma.khoaHocNcs.createMany({
          data: danhSachKhoaMoi,
          skipDuplicates: true,
        }),
        this.prisma.nghienCuuSinh.createMany({
          data: danhSachHoSo,
        }),
        this.prisma.tienTrinhNcs.createMany({
          data: danhSachTienTrinh,
        }),
        this.prisma.auditLog.createMany({
          data: danhSachNhatKy,
        }),
      ]);
    } catch (error: any) {
      // P2002 là lỗi vi phạm ràng buộc unique trong Prisma.
      if (error.code === 'P2002') {
        throw new RpcException({
          statusCode: 409,
          message: 'Có NCS vừa được tạo hồ sơ ở request khác',
        });
      }

      throw error;
    }
  }
}
