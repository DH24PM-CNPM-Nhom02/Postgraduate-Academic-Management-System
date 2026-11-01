import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';

import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { CCCD_PATTERN, type CreateNcsItemDto, type UpdateNcsDto, type UpdateNcsStatusDto } from '../../../../lib/contracts/src/dto/ncs.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TrangThaiHocTap, TrangThaiMoc } from '../generated/prisma/index.js';
import { chuanHoaChuoi, validateEmail, validatePhoneNumber } from '../helpers/validateData.util.js';
import { Prisma } from '../generated/prisma/index.js';
import { goiService } from '../helpers/call-service.util.js';
import { congThang } from '../helpers/date.util.js';
import { NotificationClient } from '../notification/notification.client.js';
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
    private readonly thongBao: NotificationClient,
  ) { }

  /**
   * Gọi auth-service để lấy thông tin tài khoản.
   * Nếu service không phản hồi trong 5 giây hoặc bị lỗi,
   * trả về lỗi để hệ thống phía trên xử lý.
   */
  async callAuth<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
    return goiService<T>(this.auth, cmd, payload, ms);
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
        let trangThai: TrangThaiMoc = TrangThaiMoc.LOCKED;
        let openedAt: Date | null = null;
        let passedAt: Date | null = null;

        if (moc.thuTu === 1) {
          // Nhập học: có hồ sơ là coi như đã đạt, không cần nộp minh chứng
          trangThai = TrangThaiMoc.PASSED;
          openedAt = thoiGianHienTai;
          passedAt = thoiGianHienTai;
        } else if (moc.thuTu === 2) {
          // Mốc đầu tiên NCS phải nộp
          trangThai = TrangThaiMoc.UNLOCKED;
          openedAt = thoiGianHienTai;
        }

        danhSachTienTrinh.push({
          ncsId: hoSo.id,
          mocId: moc.id,
          trangThai,
          openedAt,
          passedAt,
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

  // ==========Get All NCS============
  async getAllNcs() {
    return await this.prisma.nghienCuuSinh.findMany({
      orderBy: { mshv: 'asc' },
      select: {
        id: true,
        mshv: true,
        hoTen: true,
        lop: true,
        trangThai: true,
        ngayNhapHoc: true,
        hanChinhQuy: true,
        hanGiaHan: true,
        hanBuocThoiHoc: true,
        khoaHocNcs: { select: { maKhoaHoc: true } },
        nganh: { select: { maNganh: true, tenNganh: true } },
      },
    });
  }

  /**
   * Chi tiết một hồ sơ NCS (kèm ngành, khóa và 9 mốc tiến trình theo thứ tự).
   * Dùng cho 2 trường hợp:
   * - Giáo vụ xem NCS bất kỳ: truyền { id }
   * - NCS xem hồ sơ của chính mình: truyền { userId } (lấy từ token, không lấy từ client)
   */
  async getDetailNcs(boLoc: { id?: string; userId?: string }) {
    const dieuKien: Prisma.NghienCuuSinhWhereInput = {};
    if (boLoc.id) {
      dieuKien.id = boLoc.id;
    } else if (boLoc.userId) {
      dieuKien.userId = boLoc.userId;
    } else {
      throw new RpcException({ statusCode: 400, message: 'Thiếu id hoặc userId' });
    }

    const hoSo = await this.prisma.nghienCuuSinh.findFirst({
      where: dieuKien,
      include: {
        nganh: true,
        khoaHocNcs: true,
        tienTrinhs: {
          include: { moc: true },
          orderBy: { moc: { thuTu: 'asc' } },
        },
      },
    });

    if (!hoSo) {
      throw new RpcException({
        statusCode: 404,
        message: boLoc.id ? 'Không tìm thấy hồ sơ NCS' : 'Bạn chưa có hồ sơ NCS',
      });
    }

    return hoSo;
  }


  // Update NCS status
  async updateStatus(actorId: string, ncsId: string, data: UpdateNcsStatusDto) {
    const allowedStatuses = ['DANG_HOC', 'BAO_LUU', 'NGUNG_HOC'];
    if (!data || !allowedStatuses.includes(data.trangThai) || !data.ngayChuyenTrangThai) {
      throw new RpcException({ statusCode: 400, message: 'Trạng thái hoặc ngày hiệu lực không hợp lệ' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.ngayChuyenTrangThai)) {
      throw new RpcException({ statusCode: 400, message: 'Ngày hiệu lực phải theo định dạng YYYY-MM-DD' });
    }
    const effectiveDate = new Date(`${data.ngayChuyenTrangThai}T00:00:00.000Z`);
    if (Number.isNaN(effectiveDate.getTime()) || effectiveDate.toISOString().slice(0, 10) !== data.ngayChuyenTrangThai) {
      throw new RpcException({ statusCode: 400, message: 'Ngày hiệu lực không hợp lệ' });
    }
    if (data.lyDoChuyenTrangThai !== undefined && (typeof data.lyDoChuyenTrangThai !== 'string' || data.lyDoChuyenTrangThai.length > 5000)) {
      throw new RpcException({ statusCode: 400, message: 'Lý do chuyển trạng thái không hợp lệ' });
    }

    const reason = data.lyDoChuyenTrangThai?.trim() || null;
    const profile = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: ncsId },
      select: { id: true, userId: true, mshv: true, hoTen: true, trangThai: true, ngayChuyenTrangThai: true, lyDoChuyenTrangThai: true },
    });
    if (!profile) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });

    const accountActiveBefore = !['BAO_LUU', 'NGUNG_HOC'].includes(profile.trangThai);
    const accountActiveAfter = data.trangThai === 'DANG_HOC';
    const statusChanged = profile.trangThai !== data.trangThai;
    const oldEffectiveDate = profile.ngayChuyenTrangThai?.toISOString().slice(0, 10) ?? null;
    const newEffectiveDate = effectiveDate.toISOString().slice(0, 10);
    const oldReason = profile.lyDoChuyenTrangThai;
    if (!statusChanged && oldEffectiveDate === newEffectiveDate && oldReason === reason) {
      throw new RpcException({ statusCode: 400, message: 'Trạng thái và thông tin hiệu lực không thay đổi' });
    }

    const accountNeedsUpdate = Boolean(profile.userId) && accountActiveBefore !== accountActiveAfter;
    if (accountNeedsUpdate && profile.userId) {
      await this.callAuth<{ id: string; isActive: boolean }>('auth.set-active', {
        userId: profile.userId,
        isActive: accountActiveAfter,
      });
    }

    try {
      const updated= await this.prisma.$transaction(async (tx) => {
        const current = await tx.nghienCuuSinh.findUnique({
          where: { id: ncsId },
          select: { id: true, trangThai: true, ngayChuyenTrangThai: true, lyDoChuyenTrangThai: true },
        });
        if (!current) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
        if (current.trangThai !== profile.trangThai ||
          (current.ngayChuyenTrangThai?.toISOString().slice(0, 10) ?? null) !== oldEffectiveDate ||
          current.lyDoChuyenTrangThai !== oldReason) {
          throw new RpcException({ statusCode: 409, message: 'Trạng thái NCS vừa được cập nhật ở request khác, vui lòng thử lại' });
        }

        const oldValue = {
          trangThai: current.trangThai,
          ngayChuyenTrangThai: current.ngayChuyenTrangThai?.toISOString().slice(0, 10) ?? null,
          lyDoChuyenTrangThai: current.lyDoChuyenTrangThai,
        };
        const newValue = {
          trangThai: data.trangThai,
          ngayChuyenTrangThai: newEffectiveDate,
          lyDoChuyenTrangThai: reason,
        };
        const updated = await tx.nghienCuuSinh.update({
          where: { id: ncsId },
          data: {
            trangThai: data.trangThai as TrangThaiHocTap,
            ngayChuyenTrangThai: effectiveDate,
            lyDoChuyenTrangThai: reason,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'NCS_STATUS_UPDATE',
            entityType: 'NghienCuuSinh',
            entityId: ncsId,
            ncsId,
            oldValue,
            newValue,
          },
        });
        return updated;
      });

      // Bắn thông báo cập nhật trạng thái học tập cho NCS và GVHD
      try {
        const recipientUserIds: string[] = [];
        if (profile.userId) recipientUserIds.push(profile.userId);

        const phanCongs = await this.prisma.phanCongHuongDan.findMany({
          where: { ncsId, trangThai: 'DANG_HIEU_LUC' },
          include: { gvhd: { select: { userId: true } } },
        });
        for (const pc of phanCongs) {
          if (pc.gvhd?.userId) recipientUserIds.push(pc.gvhd.userId);
        }

        if (recipientUserIds.length > 0) {
          this.thongBao.gui({
            userIds: recipientUserIds,
            loai: 'CAP_NHAT_TRANG_THAI_HOC_TAP',
            duLieu: {
              tenNcs: profile.hoTen,
              mshv: profile.mshv,
              trangThaiMoi: data.trangThai,
              ngayHieuLuc: data.ngayChuyenTrangThai,
              lyDo: reason,
            },
            khoaTrung: `TRANG_THAI_NCS:${ncsId}:${data.trangThai}:${newEffectiveDate}`,
          });
        }
      } catch (err) {
        // ignore notification error
      }

      return updated;
    } catch (error) {
      if (accountNeedsUpdate && profile.userId) {
        try {
          await this.callAuth('auth.set-active', { userId: profile.userId, isActive: accountActiveBefore });
        } catch {
          throw new RpcException({ statusCode: 502, message: 'Không cập nhật được trạng thái NCS và không thể khôi phục trạng thái tài khoản' });
        }
      }
      throw error;
    }
  }

  // ==========Update NCS==============
  async updateNcs(actorId: string, ncsId: string, data: UpdateNcsDto) {
    const allowedFields = new Set([
      'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'email',
      'soDienThoai', 'nganh', 'khoaHoc', 'lop',
    ]);
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new RpcException({ statusCode: 400, message: 'Không có thông tin nào để sửa' });
    }
    const unknownFields = Object.keys(data).filter((field) => !allowedFields.has(field));
    if (unknownFields.length) {
      throw new RpcException({ statusCode: 400, message: `Trường không được hỗ trợ: ${unknownFields.join(', ')}` });
    }

    const input: UpdateNcsDto = { ...data };
    for (const [field, value] of Object.entries(input)) {
      if (value === null || value === undefined) {
        throw new RpcException({ statusCode: 400, message: `Trường ${field} không được để trống` });
      }
      if (typeof value === 'string') {
        const normalized = value.trim();
        if (!normalized) throw new RpcException({ statusCode: 400, message: `Trường ${field} không được để trống` });
        (input as Record<string, unknown>)[field] = normalized;
      }
    }

    try {
      const ketQua = await this.prisma.$transaction(async (tx) => {
        const hoSoCu = await tx.nghienCuuSinh.findUnique({ where: { id: ncsId } });
        if (!hoSoCu) {
          throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ NCS' });
        }

        const duLieuCapNhat: Prisma.NghienCuuSinhUncheckedUpdateInput = {};
        const oldValue: Record<string, unknown> = {};
        const newValue: Record<string, unknown> = {};
        const setChange = (auditField: string, dbField: string, old: unknown, value: unknown) => {
          if (old === value) return false;
          oldValue[auditField] = old;
          newValue[auditField] = value;
          (duLieuCapNhat as Record<string, unknown>)[dbField] = value;
          return true;
        };

        if (input.hoTen !== undefined) setChange('hoTen', 'hoTen', hoSoCu.hoTen, input.hoTen);
        if (input.ngaySinh !== undefined) {
          if (Number.isNaN(Date.parse(input.ngaySinh))) throw new RpcException({ statusCode: 400, message: 'Ngày sinh không hợp lệ' });
          const date = new Date(input.ngaySinh);
          if (date.toISOString().slice(0, 10) !== input.ngaySinh.slice(0, 10)) throw new RpcException({ statusCode: 400, message: 'Ngày sinh không hợp lệ' });
          const old = hoSoCu.ngaySinh?.toISOString().slice(0, 10) ?? null;
          if (old !== date.toISOString().slice(0, 10)) {
            oldValue.ngaySinh = old;
            newValue.ngaySinh = date.toISOString().slice(0, 10);
            duLieuCapNhat.ngaySinh = date;
          }
        }
        if (input.gioiTinh !== undefined) {
          if (!['NAM', 'NU'].includes(input.gioiTinh)) throw new RpcException({ statusCode: 400, message: 'Giới tính không hợp lệ' });
          setChange('gioiTinh', 'gioiTinh', hoSoCu.gioiTinh, input.gioiTinh);
        }
        if (input.cccd !== undefined) {
          if (!CCCD_PATTERN.test(input.cccd)) throw new RpcException({ statusCode: 400, message: 'CCCD phải là 12 chữ số (hoặc 9 chữ số với CMND cũ)' });
          setChange('cccd', 'cccd', hoSoCu.cccd, input.cccd);
        }
        if (input.soDienThoai !== undefined) {
          if (!validatePhoneNumber(input.soDienThoai)) throw new RpcException({ statusCode: 400, message: 'Số điện thoại không hợp lệ' });
          setChange('soDienThoai', 'soDienThoai', hoSoCu.soDienThoai, input.soDienThoai);
        }
        if (input.email !== undefined) {
          if (!validateEmail(input.email)) {
            throw new RpcException({ statusCode: 400, message: 'Email không hợp lệ' });
          }
          else if (input.email.length > 100) {
            throw new RpcException({ statusCode: 400, message: 'Email dài quá 100 ký tự' });
          }
          setChange('email', 'email', hoSoCu.email, input.email);
        }
        if (input.nganh !== undefined) {
          if (input.nganh.length > 150) throw new RpcException({ statusCode: 400, message: 'Tên ngành dài quá 150 ký tự' });
          const nganh = await tx.nganhDaoTao.findFirst({
            where: { OR: [{ maNganh: input.nganh }, { tenNganh: input.nganh }] },
            select: { id: true, maNganh: true, tenNganh: true },
          });
          if (!nganh) throw new RpcException({ statusCode: 400, message: `Không tìm thấy ngành "${input.nganh}" trong danh mục` });
          if (hoSoCu.nganhId !== nganh.id) {
            oldValue.nganh = hoSoCu.nganhId;
            newValue.nganh = { id: nganh.id, maNganh: nganh.maNganh, tenNganh: nganh.tenNganh };
            duLieuCapNhat.nganhId = nganh.id;
          }
        }
        if (input.khoaHoc !== undefined) {
          const khoa = await tx.khoaHocNcs.findFirst({ where: { maKhoaHoc: input.khoaHoc }, select: { id: true, maKhoaHoc: true } });
          if (!khoa) throw new RpcException({ statusCode: 400, message: `Không tìm thấy khóa "${input.khoaHoc}" trong danh mục (khóa phải có sẵn)` });
          if (hoSoCu.khoaHoc !== khoa.maKhoaHoc || hoSoCu.khoaHocId !== khoa.id) {
            oldValue.khoaHoc = hoSoCu.khoaHoc;
            newValue.khoaHoc = khoa.maKhoaHoc;
            duLieuCapNhat.khoaHoc = khoa.maKhoaHoc;
            duLieuCapNhat.khoaHocId = khoa.id;
          }
        }
        if (input.lop !== undefined) setChange('lop', 'lop', hoSoCu.lop, input.lop);

        if (Object.keys(duLieuCapNhat).length === 0) {
          throw new RpcException({ statusCode: 400, message: 'Không có thay đổi nào để cập nhật' });
        }

        const updated = await tx.nghienCuuSinh.update({ where: { id: ncsId }, data: duLieuCapNhat });
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'NCS_UPDATE',
            entityType: 'NghienCuuSinh',
            entityId: ncsId,
            ncsId,
            oldValue: JSON.parse(JSON.stringify(oldValue)),
            newValue: JSON.parse(JSON.stringify(newValue)),
          },
        });
        return updated;
      });
      return ketQua;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        const target = 'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta
          ? String(error.meta.target)
          : '';
        if (target.includes('cccd')) throw new RpcException({ statusCode: 409, message: 'CCCD đã được dùng bởi hồ sơ khác' });
        if (target.includes('so_dien_thoai') || target.includes('soDienThoai')) {
          throw new RpcException({ statusCode: 409, message: 'Số điện thoại đã được dùng bởi hồ sơ khác' });
        }
        throw new RpcException({ statusCode: 409, message: 'Dữ liệu vi phạm ràng buộc duy nhất' });
      }
      throw error;
    }
  }
}
