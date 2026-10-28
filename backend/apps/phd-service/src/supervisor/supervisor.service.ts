import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import type { ImportGvhdRow, UpdateGvhdDto, UpdateGvhdStatusDto } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
import type { CreateAssignmentDto, DeactivateAssignmentDto, ListAssignmentQueryDto } from '../../../../lib/contracts/src/dto/assignment.dto.js';
import type { GioiTinh, HocHamHocVi, Prisma } from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { isRealDate, validateEmail } from '../helpers/validateData.util.js';
import { goiService } from '../helpers/call-service.util.js';

const MAX_ROWS = 200;
const DANH_SACH_HOC_HAM = ['GIAO_SU', 'PHO_GIAO_SU', 'TIEN_SI_KHOA_HOC', 'TIEN_SI'];

@Injectable()
export class SupervisorService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
  ) { }

  private async callAuth<T>(cmd: string, payload: unknown, ms = 5000): Promise<T> {
    return goiService<T>(this.auth, cmd, payload, ms);
  }

  /**
   * Nhập danh sách giảng viên từ file Excel.
   * - luuThat = false: chỉ kiểm tra và trả kết quả để xem trước, KHÔNG ghi gì
   * - luuThat = true : kiểm tra lại từ đầu, nếu không có lỗi thì lưu tất cả trong một transaction
   * Mã GV đã có trong database thì cập nhật, chưa có thì tạo mới.
   */
  async importMany(actorId: string, rows: ImportGvhdRow[], luuThat: boolean) {
    // ===== Bước 1: kiểm tra số dòng =====
    if (!rows || rows.length === 0) {
      throw new RpcException({ statusCode: 400, message: 'File không có dòng nào' });
    }
    if (rows.length > MAX_ROWS) {
      throw new RpcException({ statusCode: 400, message: `Tối đa ${MAX_ROWS} dòng mỗi lần import` });
    }

    // ===== Bước 2: lấy dữ liệu trong database để so sánh =====
    // Gom mã GV và email có trong file
    const danhSachMaGv: string[] = [];
    const danhSachEmail: string[] = [];
    for (const r of rows) {
      const maGv = (r.maGv ?? '').trim();
      const email = (r.email ?? '').trim().toLowerCase();
      if (maGv) danhSachMaGv.push(maGv);
      if (email) danhSachEmail.push(email);
    }

    // Mã GV nào đã có trong database thì dòng đó là CẬP NHẬT
    const gvTheoMaGv = await this.prisma.giangVienHuongDan.findMany({
      where: { maGv: { in: danhSachMaGv } },
      select: { maGv: true },
    });
    const maGvDaCo = new Set<string>();
    for (const gv of gvTheoMaGv) {
      if (gv.maGv) maGvDaCo.add(gv.maGv);
    }

    const taiKhoanTheoMaGv = await this.callAuth<{ id: string; username: string; fullName: string; isActive: boolean; roles: string[] }[]>(
      'auth.find-users', { usernames: danhSachMaGv },
    );
    const taiKhoan = new Map(taiKhoanTheoMaGv.map((account) => [account.username, account]));

    // Email nào đã có trong database: lưu lại mã GV đang dùng email đó
    const gvTheoEmail = await this.prisma.giangVienHuongDan.findMany({
      where: { email: { in: danhSachEmail } },
      select: { maGv: true, email: true },
    });
    const maGvCuaEmail = new Map<string, string | null>();
    for (const gv of gvTheoEmail) {
      if (gv.email) maGvCuaEmail.set(gv.email.toLowerCase(), gv.maGv);
    }

    // Đơn vị chỉ khoảng 40 dòng nên lấy hết: tên đơn vị -> id
    const danhSachDonVi = await this.prisma.donVi.findMany({ select: { id: true, ten: true } });
    const idCuaDonVi = new Map<string, string>();
    for (const donVi of danhSachDonVi) {
      idCuaDonVi.set(donVi.ten, donVi.id);
    }

    // ===== Bước 3: kiểm tra từng dòng =====
    const ketQua: { row: number; maGv: string; ok: boolean; hanhDong: string; errors: string[]; willCreateAccount: boolean }[] = [];
    const canLuu = []; // các dòng hợp lệ, sẽ lưu ở bước 6
    const dongDauCuaMaGv = new Map<string, number>(); // mã GV -> dòng xuất hiện đầu tiên trong file
    const dongDauCuaEmail = new Map<string, number>(); // email -> dòng xuất hiện đầu tiên trong file

    for (const r of rows) {
      const loi: string[] = [];
      const maGv = (r.maGv ?? '').trim();
      const hoTen = (r.hoTen ?? '').trim();
      const email = (r.email ?? '').trim();
      const emailThuong = email.toLowerCase(); // dùng để so sánh, không phân biệt hoa thường
      const chuyenNganh = (r.chuyenNganh ?? '').trim();
      const quocGia = (r.quocGiaTotNghiep ?? '').trim();
      const tenDonVi = (r.donVi ?? '').trim();

      // --- Mã GV ---
      if (!maGv) {
        loi.push('Thiếu mã GV');
      } else if (maGv.length > 20) {
        loi.push('Mã GV dài quá 20 ký tự');
      } else {
        const dongDau = dongDauCuaMaGv.get(maGv);
        if (dongDau === undefined) {
          dongDauCuaMaGv.set(maGv, r.row);
        } else {
          loi.push(`Mã GV trùng với dòng ${dongDau}`);
        }
      }

      // --- Họ tên, ngày sinh, giới tính ---
      if (!hoTen) loi.push('Thiếu họ tên');
      else if (hoTen.length > 100) loi.push('Họ tên dài quá 100 ký tự');

      if (r.ngaySinh && !isRealDate(r.ngaySinh)) {
        loi.push('Ngày sinh không hợp lệ (dùng dd/mm/yyyy)');
      }

      let gioiTinh: GioiTinh | undefined = undefined;
      if (r.gioiTinh === 'NAM') gioiTinh = 'NAM';
      else if (r.gioiTinh === 'NU') gioiTinh = 'NU';
      else if (r.gioiTinh) loi.push('Giới tính chỉ nhận: Nam hoặc Nữ');

      // --- Học hàm và số NCS tối đa được hướng dẫn (Thông tư 18/2021) ---
      let hocHam: HocHamHocVi = 'TIEN_SI';
      let maxNcs = 3;
      if (r.hocHamHocVi === 'GIAO_SU') {
        hocHam = 'GIAO_SU';
        maxNcs = 7;
      } else if (r.hocHamHocVi === 'PHO_GIAO_SU') {
        hocHam = 'PHO_GIAO_SU';
        maxNcs = 5;
      } else if (r.hocHamHocVi === 'TIEN_SI_KHOA_HOC') {
        hocHam = 'TIEN_SI_KHOA_HOC';
        maxNcs = 5;
      } else if (r.hocHamHocVi && !DANH_SACH_HOC_HAM.includes(r.hocHamHocVi)) {
        loi.push('Học hàm không hợp lệ');
      }

      // --- Email: đúng định dạng, không trùng trong file, không trùng giảng viên khác ---
      if (email) {
        if (!validateEmail(email)) {
          loi.push('Email không hợp lệ');
        }

        const maGvDangDung = maGvCuaEmail.get(emailThuong);
        if (maGvDangDung && maGvDangDung !== maGv) {
          loi.push(`Email đã được dùng bởi giảng viên ${maGvDangDung}`);
        }

        const dongDau = dongDauCuaEmail.get(emailThuong);
        if (dongDau === undefined) {
          dongDauCuaEmail.set(emailThuong, r.row);
        } else {
          loi.push(`Email trùng với dòng ${dongDau}`);
        }
      }

      // --- Chuyên ngành, nước tốt nghiệp ---
      if (chuyenNganh === '') loi.push('Chuyên ngành không được để trống');
      if (quocGia === '') loi.push('Nước tốt nghiệp không được để trống');
      if (chuyenNganh.length > 255) loi.push('Chuyên ngành dài quá 255 ký tự');
      if (quocGia.length > 50) loi.push('Nước tốt nghiệp dài quá 50 ký tự');

      // --- Đơn vị: tìm id theo tên ---
      let donViId: string | undefined = undefined;
      if (tenDonVi) {
        donViId = idCuaDonVi.get(tenDonVi);

        // "Lãnh đạo Khoa ..." không có đơn vị riêng nên dùng đơn vị cấp trên
        if (!donViId && tenDonVi.startsWith('Lãnh đạo')) {
          donViId = idCuaDonVi.get((r.donViCapTren ?? '').trim());
        }

        if (!donViId) {
          loi.push(`Không tìm thấy đơn vị "${tenDonVi}" trong danh mục`);
        }
      }

      // --- Tạo mới hay cập nhật ---
      let hanhDong = 'TAO_MOI';
      if (maGvDaCo.has(maGv)) hanhDong = 'CAP_NHAT';

      const account = taiKhoan.get(maGv);
      const willCreateAccount = !account;
      if (account && !account.roles.includes(ROLES.GVHD)) {
        loi.push('Mã GV đã có tài khoản nhưng không có role GVHD');
      }
      if (!account && !maGv) {
        loi.push('Thiếu mã GV để tạo tài khoản');
      }

      ketQua.push({
        row: r.row,
        maGv,
        ok: loi.length === 0,
        hanhDong,
        errors: loi,
        willCreateAccount,
      });

      if (loi.length === 0) {
        // Ô để trống thì dùng undefined: Prisma sẽ bỏ qua, giữ nguyên giá trị cũ trong database.
        // Chỉ ghi các trường có trong file, không đụng vào soNcsDangHuongDan, version, userId.
        canLuu.push({
          hanhDong: hanhDong,
          maGv: maGv,
          duLieu: {
            maGv: maGv,
            hoTen: hoTen,
            gioiTinh: gioiTinh,
            ngaySinh: r.ngaySinh ? new Date(r.ngaySinh) : undefined,
            email: email || undefined,
            hocHamHocVi: hocHam,
            maxNcsChoPhep: maxNcs,
            chuyenNganh: chuyenNganh || undefined,
            quocGiaTotNghiep: quocGia || undefined,
            donViId: donViId,
            userId: undefined as string | undefined,
          },
        });
      }
    }

    // Đếm số dòng lỗi, số dòng tạo mới, số dòng cập nhật
    let soLoi = 0;
    let soTaoMoi = 0;
    let soCapNhat = 0;
    for (const k of ketQua) {
      if (!k.ok) soLoi++;
      else if (k.hanhDong === 'TAO_MOI') soTaoMoi++;
      else soCapNhat++;
    }

    // ===== Bước 4: chỉ xem trước thì trả kết quả, không lưu =====
    if (!luuThat) {
      return {
        total: ketQua.length,
        validCount: ketQua.length - soLoi,
        errorCount: soLoi,
        createCount: soTaoMoi,
        updateCount: soCapNhat,
        newAccountCount: ketQua.filter((row) => row.ok && row.willCreateAccount).length,
        rows: ketQua,
      };
    }

    // ===== Bước 5: còn dòng lỗi thì báo lỗi, không lưu gì cả =====
    if (soLoi > 0) {
      const dongLoi = [];
      for (const k of ketQua) {
        if (!k.ok) dongLoi.push(k);
      }
      throw new RpcException({
        statusCode: 400,
        message: 'File còn dòng không hợp lệ, chưa lưu gì cả',
        rows: dongLoi,
      });
    }

    const needAccount = ketQua.filter((row) => row.ok && row.willCreateAccount);
    if (needAccount.length > 0) {
      await this.callAuth(
        'auth.create-users',
        {
          users: needAccount.map((row) => {
            const source = rows.find((item) => (item.maGv ?? '').trim() === row.maGv)!;
            return {
              username: row.maGv,
              fullName: (source.hoTen ?? '').trim(),
              email: (source.email ?? '').trim().toLowerCase() || undefined,
              role: ROLES.GVHD,
              password: row.maGv,
            };
          }),
        },
        30000,
      );
    }

    const accountsAfterCreate = needAccount.length > 0
      ? await this.callAuth<{ id: string; username: string; roles: string[] }[]>('auth.find-users', { usernames: danhSachMaGv })
      : taiKhoanTheoMaGv;
    const accountIdByUsername = new Map(accountsAfterCreate.map((account) => [account.username, account.id]));
    for (const dong of canLuu) {
      const userId = accountIdByUsername.get(dong.maGv);
      if (!userId) {
        throw new RpcException({ statusCode: 502, message: `Không lấy được tài khoản của ${dong.maGv}` });
      }
      dong.duLieu.userId = userId;
    }

    // ===== Bước 6: lưu tất cả trong một transaction =====
    const cacLenh = [];
    for (const dong of canLuu) {
      if (dong.hanhDong === 'CAP_NHAT') {
        cacLenh.push(
          this.prisma.giangVienHuongDan.update({ where: { maGv: dong.maGv }, data: dong.duLieu }),
        );
      } else {
        cacLenh.push(this.prisma.giangVienHuongDan.create({ data: dong.duLieu }));
      }
    }

    // Một dòng nhật ký cho cả lần import
    cacLenh.push(
      this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'GVHD_IMPORT',
          entityType: 'GiangVienHuongDan',
          entityId: 'import',
          newValue: { taoMoi: soTaoMoi, capNhat: soCapNhat },
        },
      }),
    );

    try {
      await this.prisma.$transaction(cacLenh);
    } catch (error: any) {
      // P2002 là lỗi trùng giá trị unique (maGv) trong Prisma
      if (error.code === 'P2002') {
        throw new RpcException({
          statusCode: 409,
          message: 'Có giảng viên vừa được tạo ở request khác, hãy thử lại',
        });
      }
      throw error;
    }

    // Chỉ trả về những thông tin cần thiết cho màn hình kết quả.


    return canLuu;
  }

  //Get info Supervisor
  async getAllSupervisor() {
    return await this.prisma.giangVienHuongDan.findMany({
      orderBy: { maGv: 'asc' },
      select: {
        id: true,
        maGv: true,
        hoTen: true,
        gioiTinh: true,
        ngaySinh: true,
        email: true,
        hocHamHocVi: true,
        maxNcsChoPhep: true,
        chuyenNganh: true,
        quocGiaTotNghiep: true,
        donVi: {
          select: {
            id: true,
            ten: true,
            parent: {
              select: { id: true, ten: true },
            },
          }
        }
      },
    })
  }

  /**
     * Chi tiết một hồ sơ GVHD.
     * Dùng cho 2 trường hợp:
     * - Giáo vụ xem GVHD bất kỳ: truyền { id }
     * - GVHD xem hồ sơ của chính mình: truyền { userId } (lấy từ token, không lấy từ client)
     */
  async getDetailSupervisor(boLoc: { id?: string; userId?: string }) {
    const dieuKien: Prisma.GiangVienHuongDanWhereInput = {};
    if (boLoc.id) {
      dieuKien.id = boLoc.id;
    } else if (boLoc.userId) {
      dieuKien.userId = boLoc.userId;
    } else {
      throw new RpcException({ statusCode: 400, message: 'Thiếu id hoặc userId' });
    }

    const hoSo = await this.prisma.giangVienHuongDan.findFirst({
      where: dieuKien,
      include: {
        donVi: {
          select: {
            id: true,
            ten: true,
            parent: {
              select: { id: true, ten: true },
            },
          },
        },
        phanCongs: {
          where: { trangThai: 'DANG_HIEU_LUC' },
          select: {
            id: true,
            vaiTro: true,
            trongSo: true,
            ngayBatDau: true,
            ncs: {
              select: {
                id: true,
                mshv: true,
                hoTen: true,
                trangThai: true,
              },
            },
          },
        },
      },
    });

    if (!hoSo) {
      throw new RpcException({
        statusCode: 404,
        message: boLoc.id ? 'Không tìm thấy hồ sơ GVHD' : 'Bạn chưa có hồ sơ GVHD',
      });
    }

    return hoSo;
  }

  async updateStatus(actorId: string, id: string, data: UpdateGvhdStatusDto) {
    if (!data || typeof data.trangThai !== 'boolean') {
      throw new RpcException({ statusCode: 400, message: 'Trạng thái GVHD phải là boolean' });
    }

    const profile = await this.prisma.giangVienHuongDan.findUnique({
      where: { id },
      select: { id: true, userId: true, trangThai: true },
    });
    if (!profile) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ GVHD' });
    }
    if (profile.trangThai === data.trangThai) {
      throw new RpcException({ statusCode: 400, message: 'Trạng thái GVHD không thay đổi' });
    }

    const hasLinkedAccount = Boolean(profile.userId);
    if (hasLinkedAccount) {
      await this.callAuth('auth.set-active', {
        userId: profile.userId,
        isActive: data.trangThai,
      });
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const current = await tx.giangVienHuongDan.findUnique({
          where: { id },
          select: { id: true, trangThai: true },
        });
        if (!current) {
          throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ GVHD' });
        }
        if (current.trangThai !== profile.trangThai) {
          throw new RpcException({
            statusCode: 409,
            message: 'Trạng thái GVHD vừa được cập nhật ở request khác, vui lòng thử lại',
          });
        }

        const updated = await tx.giangVienHuongDan.update({
          where: { id },
          data: { trangThai: data.trangThai },
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'GVHD_STATUS_UPDATE',
            entityType: 'GiangVienHuongDan',
            entityId: id,
            oldValue: { trangThai: current.trangThai },
            newValue: { trangThai: data.trangThai },
          },
        });
        return updated;
      });
    } catch (error) {
      if (hasLinkedAccount && profile.userId) {
        try {
          await this.callAuth('auth.set-active', {
            userId: profile.userId,
            isActive: profile.trangThai,
          });
        } catch {
          throw new RpcException({
            statusCode: 502,
            message: 'Không cập nhật được trạng thái GVHD và không thể khôi phục trạng thái tài khoản',
          });
        }
      }
      throw error;
    }
  }

  //update gvhd
  async updateSupervisor(actorId: string, id: string, data: UpdateGvhdDto) {
    const allowedFields = new Set([
      'hoTen', 'ngaySinh', 'gioiTinh', 'email', 'hocHamHocVi', 'donVi', 'chuyenNganh', 'quocGiaTotNghiep'
    ]);
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new RpcException({ statusCode: 400, message: 'Không có thông tin nào để sửa' });
    }
    const unknownFields = Object.keys(data).filter((field) => !allowedFields.has(field));
    if (unknownFields.length) {
      throw new RpcException({ statusCode: 400, message: `Trường không được hỗ trợ: ${unknownFields.join(', ')}` });
    }

    const input: UpdateGvhdDto = { ...data };
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
        const hoSoCu = await tx.giangVienHuongDan.findUnique({ where: { id } });
        if (!hoSoCu) {
          throw new RpcException({ statusCode: 404, message: 'Không tìm thấy hồ sơ GVHD' });
        }

        const duLieuCapNhat: Prisma.GiangVienHuongDanUncheckedUpdateInput = {};
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

        if (input.hocHamHocVi !== undefined) {
          const maxNcsByHocHam: Record<string, number> = {
            GIAO_SU: 7,
            PHO_GIAO_SU: 5,
            TIEN_SI_KHOA_HOC: 5,
            TIEN_SI: 3,
          };
          const maxNcs = maxNcsByHocHam[input.hocHamHocVi];
          setChange('hocHamHocVi', 'hocHamHocVi', hoSoCu.hocHamHocVi, input.hocHamHocVi);
          setChange('maxNcsChoPhep', 'maxNcsChoPhep', hoSoCu.maxNcsChoPhep, maxNcs);
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

        if (input.donVi !== undefined) {
          const donVi = await tx.donVi.findUnique({
            where: { id: input.donVi },
            select: { id: true, ten: true },
          });
          if (!donVi) throw new RpcException({ statusCode: 400, message: `Không tìm thấy đơn vị với id "${input.donVi}"` });
          if (hoSoCu.donViId !== donVi.id) {
            oldValue.donViId = hoSoCu.donViId;
            newValue.donViId = { id: donVi.id, ten: donVi.ten };
            duLieuCapNhat.donViId = donVi.id;
          }
        }
        if (input.chuyenNganh !== undefined) {
          if (input.chuyenNganh.length > 255) throw new RpcException({ statusCode: 400, message: 'Chuyên ngành dài quá 255 ký tự' });
          setChange('chuyenNganh', 'chuyenNganh', hoSoCu.chuyenNganh, input.chuyenNganh);
        }
        if (input.quocGiaTotNghiep !== undefined) {
          if (input.quocGiaTotNghiep.length > 50) throw new RpcException({ statusCode: 400, message: 'Quốc gia tốt nghiệp dài quá 50 ký tự' });
          setChange('quocGiaTotNghiep', 'quocGiaTotNghiep', hoSoCu.quocGiaTotNghiep, input.quocGiaTotNghiep);
        }

        if (Object.keys(duLieuCapNhat).length === 0) {
          throw new RpcException({ statusCode: 400, message: 'Không có thay đổi nào để cập nhật' });
        }

        const updated = await tx.giangVienHuongDan.update({
          where: { id },
          data: duLieuCapNhat,
        });
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'GVHD_UPDATE',
            entityType: 'GiangVienHuongDan',
            entityId: id,
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
        if (target.includes('email')) {
          throw new RpcException({ statusCode: 409, message: 'Email đã được sử dụng bởi hồ sơ khác' });
        }
        throw new RpcException({ statusCode: 409, message: 'Dữ liệu GVHD vi phạm ràng buộc duy nhất' });
      }
      throw error;
    }

  }

  /**
   * B. GVHD xem danh sách NCS mình hướng dẫn kèm đề tài và 9 mốc tiến trình
   */
  async getMyNcsList(userId: string) {
    const gvhd = await this.prisma.giangVienHuongDan.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!gvhd) {
      throw new RpcException({ statusCode: 404, message: 'Bạn chưa có hồ sơ GVHD' });
    }

    const phanCongs = await this.prisma.phanCongHuongDan.findMany({
      where: {
        gvhdId: gvhd.id,
        trangThai: 'DANG_HIEU_LUC',
      },
      select: {
        id: true,
        vaiTro: true,
        trongSo: true,
        ngayBatDau: true,
        ncs: {
          select: {
            id: true,
            mshv: true,
            hoTen: true,
            trangThai: true,
            nganhId: true,
            khoaHoc: true,
            lop: true,
            hanChinhQuy: true,
            hanBuocThoiHoc: true,
            hanGiaHan: true,
            nganh: {
              select: { id: true, maNganh: true, tenNganh: true },
            },
            deTais: {
              where: { trangThai: 'HIEU_LUC' },
              select: { id: true, tenDeTai: true, createdAt: true },
              take: 1,
            },
            tienTrinhs: {
              select: {
                id: true,
                trangThai: true,
                moc: {
                  select: {
                    thuTu: true,
                    tenMoc: true,
                    yeuCauDiem: true,
                  },
                },
              },
              orderBy: {
                moc: {
                  thuTu: 'asc',
                },
              },
            },
          },
        },
      },
    });

    return phanCongs.map((pc) => {
      const deTaiHieuLuc = pc.ncs.deTais?.[0] || null;
      const tienTrinhs = pc.ncs.tienTrinhs.map((tt) => ({
        mocThuTu: tt.moc.thuTu,
        tenMoc: tt.moc.tenMoc,
        trangThai: tt.trangThai,
        yeuCauDiem: tt.moc.yeuCauDiem,
      }));

      return {
        phanCongId: pc.id,
        vaiTro: pc.vaiTro,
        trongSo: pc.trongSo,
        ngayBatDau: pc.ngayBatDau,
        ncs: {
          id: pc.ncs.id,
          mshv: pc.ncs.mshv,
          hoTen: pc.ncs.hoTen,
          trangThai: pc.ncs.trangThai,
          nganh: pc.ncs.nganh,
          khoaHoc: pc.ncs.khoaHoc,
          lop: pc.ncs.lop,
          hanChinhQuy: pc.ncs.hanChinhQuy,
          hanBuocThoiHoc: pc.ncs.hanBuocThoiHoc,
          hanGiaHan: pc.ncs.hanGiaHan,
          deTaiHieuLuc,
          tienTrinhs,
        },
      };
    });
  }

  /**
   * C. GVHD xem chi tiết một NCS (có kiểm tra quyền sở hữu)
   */
  async getMyNcsDetail(userId: string, ncsId: string) {
    const gvhd = await this.prisma.giangVienHuongDan.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!gvhd) {
      throw new RpcException({ statusCode: 404, message: 'Bạn chưa có hồ sơ GVHD' });
    }

    const ownership = await this.prisma.phanCongHuongDan.findFirst({
      where: {
        gvhdId: gvhd.id,
        ncsId,
        trangThai: 'DANG_HIEU_LUC',
      },
    });
    if (!ownership) {
      throw new RpcException({
        statusCode: 403,
        message: 'Bạn không phải GVHD chính thức của NCS này',
      });
    }

    const ncsDetail = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: ncsId },
      include: {
        nganh: true,
        khoaHocNcs: true,
        deTais: {
          orderBy: { createdAt: 'desc' },
        },
        phanCongs: {
          include: {
            gvhd: {
              select: {
                id: true,
                hoTen: true,
                email: true,
                hocHamHocVi: true,
                chuyenNganh: true,
                donVi: { select: { id: true, ten: true } },
              },
            },
            quyetDinh: {
              select: {
                id: true,
                soQuyetDinh: true,
                ngayQuyetDinh: true,
                loai: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tienTrinhs: {
          include: {
            moc: true,
            minhChungs: {
              include: {
                quyetDinh: {
                  select: {
                    id: true,
                    soQuyetDinh: true,
                    ngayQuyetDinh: true,
                  },
                },
                phieuNhanXets: true,
              },
              orderBy: { lanNop: 'desc' },
            },
          },
          orderBy: {
            moc: { thuTu: 'asc' },
          },
        },
        quyetDinhs: {
          orderBy: { ngayQuyetDinh: 'desc' },
        },
      },
    });

    if (!ncsDetail) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy thông tin NCS' });
    }

    return ncsDetail;
  }

  /**
   * D1. Phân công GVHD cho NCS (có kiểm tra định mức và optimistic locking)
   */
  async createAssignment(actorId: string, dto: CreateAssignmentDto) {
    //Kiểm tra NCS
    const ncs = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: dto.ncsId },
      select: { id: true, trangThai: true, hoTen: true },
    });
    if (!ncs) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
    }
    if (ncs.trangThai !== 'DANG_HOC' && ncs.trangThai !== 'GIA_HAN') {
      throw new RpcException({
        statusCode: 400,
        message: 'NCS không ở trạng thái được phép phân công GVHD (chỉ chấp nhận DANG_HOC hoặc GIA_HAN)',
      });
    }

    //Kiểm tra GVHD
    const gvhdCheck = await this.prisma.giangVienHuongDan.findUnique({
      where: { id: dto.gvhdId },
      select: { id: true, trangThai: true, hoTen: true },
    });
    if (!gvhdCheck) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy GVHD' });
    }
    if (!gvhdCheck.trangThai) {
      throw new RpcException({ statusCode: 400, message: 'GVHD đã bị vô hiệu hóa, không thể phân công' });
    }

    //Kiểm tra Quyết định
    const quyetDinh = await this.prisma.quyetDinh.findUnique({
      where: { id: dto.quyetDinhId },
      select: { id: true, loai: true, trangThai: true },
    });
    if (!quyetDinh) {
      throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
    }
    if (quyetDinh.loai !== 'PHAN_CONG_GVHD' || quyetDinh.trangThai !== 'HIEU_LUC') {
      throw new RpcException({
        statusCode: 400,
        message: 'Quyết định phải thuộc loại PHAN_CONG_GVHD và đang có hiệu lực',
      });
    }

    //Kiểm tra trùng phân công cùng GVHD
    const trungGvhd = await this.prisma.phanCongHuongDan.findFirst({
      where: {
        ncsId: dto.ncsId,
        gvhdId: dto.gvhdId,
        trangThai: 'DANG_HIEU_LUC',
      },
    });
    if (trungGvhd) {
      throw new RpcException({
        statusCode: 409,
        message: 'GVHD này đã và đang được phân công hướng dẫn NCS này',
      });
    }

    //Kiểm tra ràng buộc duy nhất 1 GVHD chính
    if (dto.vaiTro === 'HUONG_DAN_CHINH') {
      const gvhdChinhHienTai = await this.prisma.phanCongHuongDan.findFirst({
        where: {
          ncsId: dto.ncsId,
          vaiTro: 'HUONG_DAN_CHINH',
          trangThai: 'DANG_HIEU_LUC',
        },
      });
      if (gvhdChinhHienTai) {
        throw new RpcException({
          statusCode: 400,
          message: 'NCS đã có GVHD chính. Vui lòng vô hiệu hóa GVHD cũ trước khi gán mới',
        });
      }
    }

    const trongSoVal = dto.vaiTro === 'HUONG_DAN_CHINH' ? 1.0 : 0.5;

    //Transaction kiểm tra định mức + optimistic lock
    return await this.prisma.$transaction(async (tx) => {
      const gvhd = await tx.giangVienHuongDan.findUnique({
        where: { id: dto.gvhdId },
      });
      if (!gvhd || !gvhd.trangThai) {
        throw new RpcException({ statusCode: 400, message: 'GVHD không tồn tại hoặc đã bị vô hiệu hóa' });
      }

      const soHienTai = Number(gvhd.soNcsDangHuongDan);
      const soMoi = Number((soHienTai + trongSoVal).toFixed(1));

      if (soMoi > gvhd.maxNcsChoPhep) {
        throw new RpcException({
          statusCode: 400,
          message: `Vượt định mức hướng dẫn của GVHD (hiện tại: ${soHienTai}, thêm: ${trongSoVal}, tối đa: ${gvhd.maxNcsChoPhep})`,
        });
      }

      const updateResult = await tx.giangVienHuongDan.updateMany({
        where: {
          id: dto.gvhdId,
          version: gvhd.version,
        },
        data: {
          soNcsDangHuongDan: soMoi,
          version: { increment: 1 },
        },
      });

      if (updateResult.count === 0) {
        throw new RpcException({
          statusCode: 409,
          message: 'Dữ liệu GVHD vừa thay đổi do thao tác đồng thời, vui lòng thử lại',
        });
      }

      const ngayBatDau = dto.ngayBatDau ? new Date(dto.ngayBatDau) : new Date();

      const phanCong = await tx.phanCongHuongDan.create({
        data: {
          ncsId: dto.ncsId,
          gvhdId: dto.gvhdId,
          vaiTro: dto.vaiTro,
          trongSo: trongSoVal,
          quyetDinhId: dto.quyetDinhId,
          trangThai: 'DANG_HIEU_LUC',
          ngayBatDau,
        },
        include: {
          gvhd: {
            select: {
              id: true,
              hoTen: true,
              hocHamHocVi: true,
              email: true,
              soNcsDangHuongDan: true,
              maxNcsChoPhep: true,
            },
          },
          ncs: {
            select: { id: true, mshv: true, hoTen: true, trangThai: true },
          },
          quyetDinh: {
            select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true, loai: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'ASSIGNMENT_CREATE',
          entityType: 'PhanCongHuongDan',
          entityId: phanCong.id,
          oldValue: {},
          newValue: {
            ncsId: dto.ncsId,
            gvhdId: dto.gvhdId,
            vaiTro: dto.vaiTro,
            trongSo: trongSoVal,
            quyetDinhId: dto.quyetDinhId,
            ngayBatDau,
          },
        },
      });

      return phanCong;
    });
  }

  /**
   * D2. Vô hiệu hóa (đổi) phân công GVHD và trả lại định mức
   */
  async deactivateAssignment(actorId: string, id: string, dto?: DeactivateAssignmentDto) {
    return await this.prisma.$transaction(async (tx) => {
      const phanCong = await tx.phanCongHuongDan.findUnique({
        where: { id },
        include: { gvhd: true },
      });
      if (!phanCong) {
        throw new RpcException({ statusCode: 404, message: 'Không tìm thấy phân công hướng dẫn' });
      }
      if (phanCong.trangThai !== 'DANG_HIEU_LUC') {
        throw new RpcException({ statusCode: 400, message: 'Phân công này đã bị vô hiệu hóa trước đó' });
      }

      const gvhd = phanCong.gvhd;
      const soHienTai = Number(gvhd.soNcsDangHuongDan);
      const trongSoVal = Number(phanCong.trongSo);
      const soMoi = Math.max(0, Number((soHienTai - trongSoVal).toFixed(1)));

      const updateResult = await tx.giangVienHuongDan.updateMany({
        where: { id: gvhd.id, version: gvhd.version },
        data: {
          soNcsDangHuongDan: soMoi,
          version: { increment: 1 },
        },
      });

      if (updateResult.count === 0) {
        throw new RpcException({
          statusCode: 409,
          message: 'Dữ liệu GVHD vừa thay đổi do thao tác đồng thời, vui lòng thử lại',
        });
      }

      const ngayKetThuc = dto?.ngayKetThuc ? new Date(dto.ngayKetThuc) : new Date();

      const updated = await tx.phanCongHuongDan.update({
        where: { id },
        data: {
          trangThai: 'DEACTIVATE',
          ngayKetThuc,
        },
        include: {
          gvhd: {
            select: {
              id: true,
              hoTen: true,
              hocHamHocVi: true,
              soNcsDangHuongDan: true,
              maxNcsChoPhep: true,
            },
          },
          ncs: {
            select: { id: true, mshv: true, hoTen: true },
          },
          quyetDinh: {
            select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'ASSIGNMENT_DEACTIVATE',
          entityType: 'PhanCongHuongDan',
          entityId: id,
          oldValue: { trangThai: phanCong.trangThai, ngayKetThuc: phanCong.ngayKetThuc },
          newValue: { trangThai: 'DEACTIVATE', ngayKetThuc },
        },
      });

      return updated;
    });
  }

  /**
   * D3. Xem danh sách phân công
   */
  async listAssignments(query: ListAssignmentQueryDto) {
    const where: Prisma.PhanCongHuongDanWhereInput = {};
    if (query?.ncsId) where.ncsId = query.ncsId;
    if (query?.gvhdId) where.gvhdId = query.gvhdId;
    if (query?.trangThai) where.trangThai = query.trangThai as any;

    return this.prisma.phanCongHuongDan.findMany({
      where,
      include: {
        gvhd: {
          select: {
            id: true,
            hoTen: true,
            email: true,
            hocHamHocVi: true,
            soNcsDangHuongDan: true,
            maxNcsChoPhep: true,
            donVi: { select: { id: true, ten: true } },
          },
        },
        ncs: {
          select: {
            id: true,
            mshv: true,
            hoTen: true,
            trangThai: true,
          },
        },
        quyetDinh: {
          select: {
            id: true,
            soQuyetDinh: true,
            ngayQuyetDinh: true,
            loai: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}