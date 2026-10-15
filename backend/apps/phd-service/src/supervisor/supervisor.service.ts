import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ImportGvhdRow } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
import type { GioiTinh, HocHamHocVi } from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { isRealDate, validateEmail } from '../helpers/validateData.util.js';

const MAX_ROWS = 200;
const DANH_SACH_HOC_HAM = ['GIAO_SU', 'PHO_GIAO_SU', 'TIEN_SI_KHOA_HOC', 'TIEN_SI'];

@Injectable()
export class SupervisorService {
  constructor(private readonly prisma: PrismaService) { }

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
    const ketQua: { row: number; maGv: string; ok: boolean; hanhDong: string; errors: string[] }[] = [];
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

      ketQua.push({ row: r.row, maGv: maGv, ok: loi.length === 0, hanhDong: hanhDong, errors: loi });

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
}