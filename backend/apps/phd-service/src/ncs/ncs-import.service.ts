import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CCCD_PATTERN,
  GIOI_TINH,
  PHUONG_THUC_DAO_TAO,
  TRINH_DO_DAU_VAO,
  type CreateNcsItemDto,
  type ImportNcsRow,
} from '../../../../lib/contracts/src/dto/ncs.dto.js';
import { ROLES } from '../../../../lib/contracts/src/permissions.js';
import { NcsService, timTrongDanhSach } from './ncs.service.js';
import { isRealDate, validateEmail, validatePhoneNumber } from '../helpers/validateData.util.js';

const MAX_ROWS = 200;

type RowResult = {
  row: number;            // số dòng trong file Excel
  mshv: string;
  ok: boolean;
  willCreateAccount: boolean; // true = MSHV này chưa có tài khoản, sẽ được tạo 
  errors: string[];
};



// Email dạng chuẩn để so sánh: bỏ khoảng trắng, chữ thường ('' nếu không có)
function emailOf(row: ImportNcsRow): string {
  return (row.email ?? '').trim().toLowerCase();
}

// Kiểm tra định dạng từng dòng, thông báo bằng tiếng Việt cho Giáo vụ đọc
function validateRow(r: ImportNcsRow): string[] {
  const errors: string[] = [];
  const mshv = r.mshv?.trim();

  if (!mshv) errors.push('Thiếu MSHV');
  else if (mshv.length > 20) errors.push('MSHV dài quá 20 ký tự');

  if (r.hoTen && r.hoTen.trim().length > 100) errors.push('Họ tên dài quá 100 ký tự');

  if (!r.ngayNhapHoc) errors.push('Thiếu ngày nhập học');
  else if (!isRealDate(r.ngayNhapHoc)) errors.push('Ngày nhập học không hợp lệ (dùng dd/mm/yyyy)');

  if (r.ngaySinh && !isRealDate(r.ngaySinh)) errors.push('Ngày sinh không hợp lệ (dùng dd/mm/yyyy)');
  if (r.email && !validateEmail(r.email.trim())) errors.push('Email không hợp lệ');
  if (r.soDienThoai && !validatePhoneNumber(r.soDienThoai.trim())) errors.push('Số điện thoại không hợp lệ');

  if (r.gioiTinh && !(GIOI_TINH as readonly string[]).includes(r.gioiTinh)) errors.push('Giới tính chỉ nhận: Nam hoặc Nữ');
  if (r.cccd && !CCCD_PATTERN.test(r.cccd.trim())) errors.push('CCCD phải là 12 chữ số ');

  if (r.nganh && r.nganh.trim().length > 150) errors.push('Tên ngành dài quá 150 ký tự');
  if (r.khoaHoc && r.khoaHoc.trim().length > 20) errors.push('Mã khóa dài quá 20 ký tự');
  if (r.lop && r.lop.trim().length > 30) errors.push('Tên lớp dài quá 30 ký tự');

  if (r.trinhDoDauVao && !(TRINH_DO_DAU_VAO as readonly string[]).includes(r.trinhDoDauVao)) {
    errors.push('Trình độ đầu vào chỉ nhận: Thạc sĩ hoặc Đại học');
  }
  if (r.phuongThucDaoTao && !(PHUONG_THUC_DAO_TAO as readonly string[]).includes(r.phuongThucDaoTao)) {
    errors.push('Phương thức đào tạo chỉ nhận: 1 hoặc 2');
  }
  return errors;
}

// Đổi dòng import sang dạng mà NcsService.createMany hiểu và xử lý được 
function toItem(r: ImportNcsRow): CreateNcsItemDto {
  return {
    mshv: r.mshv.trim(),
    hoTen: r.hoTen?.trim() || undefined,
    ngaySinh: r.ngaySinh || undefined,
    gioiTinh: (r.gioiTinh || undefined) as CreateNcsItemDto['gioiTinh'],
    cccd: r.cccd?.trim() || undefined,
    email: r.email?.trim() || undefined,
    soDienThoai: r.soDienThoai?.trim() || undefined,
    nganh: r.nganh?.trim() || undefined,
    khoaHoc: r.khoaHoc?.trim() || undefined,
    lop: r.lop?.trim() || undefined,
    ngayNhapHoc: r.ngayNhapHoc!, // validateRow đã bắt buộc có
    trinhDoDauVao: (r.trinhDoDauVao || undefined) as CreateNcsItemDto['trinhDoDauVao'],
    phuongThucDaoTao: (r.phuongThucDaoTao || undefined) as CreateNcsItemDto['phuongThucDaoTao'],
  };
}

@Injectable()
export class NcsImportService {
  constructor(private readonly ncs: NcsService) { }

  // ===== Flow 1: chỉ kiểm tra, KHÔNG ghi gì =====
  async preview(rows: ImportNcsRow[]) {
    this.assertSize(rows);
    const { rows: results, newKhoaHocCount } = await this.analyze(rows);
    const errorCount = results.filter((r) => !r.ok).length;
    return {
      total: results.length,
      validCount: results.length - errorCount,
      errorCount,
      newAccountCount: results.filter((r) => r.ok && r.willCreateAccount).length,
      newKhoaHocCount, // số khóa sẽ được thêm vào danh mục khi confirm
      rows: results,
    };
  }

  // ===== Flow  2: kiểm tra lại, rồi tạo tài khoản thiếu + hồ sơ =====
  async confirm(actorId: string, rows: ImportNcsRow[]) {
    this.assertSize(rows);

    // Luôn kiểm tra lại, không tin kết quả preview (dữ liệu có thể đã đổi giữa hai lần)
    const { rows: results, newKhoaHocCount } = await this.analyze(rows);
    const bad = results.filter((r) => !r.ok);
    if (bad.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'File còn dòng không hợp lệ, chưa tạo gì cả',
        rows: bad,
      });
    }

    // Tạo tài khoản cho MSHV chưa có (mật khẩu ban đầu = MSHV do auth-service đặt)
    const needAccount = rows.filter((_, i) => results[i].willCreateAccount);
    if (needAccount.length > 0) {
      await this.ncs.callAuth(
        'auth.create-users',
        {
          users: needAccount.map((r) => ({
            username: r.mshv.trim(),
            fullName: r.hoTen!.trim(), // analyze đã bắt buộc có họ tên khi cần tạo tài khoản
            email: emailOf(r) || undefined,
            role: ROLES.NCS,
          })),
        },
        30000,
      );
    }

    //Tạo hồ sơ (một transaction, như đã viết ở NcsService)
    const profiles = await this.ncs.createMany(actorId, rows.map(toItem));

    return {
      createdAccounts: needAccount.length,
      createdKhoaHoc: newKhoaHocCount,
      createdProfiles: profiles.length,
      profiles,
    };
  }

  
  // Kiểm tra email của các dòng sẽ tạo tài khoản mới (ghi lỗi thẳng vào results)
  private async checkEmails(rows: ImportNcsRow[], results: RowResult[]) {
    // gom email của các dòng sẽ tạo tài khoản mới
    const emailsToCheck: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      if (!results[i].willCreateAccount) continue; // dòng đã có tài khoản thì bỏ qua
      const email = emailOf(rows[i]);
      if (email && !emailsToCheck.includes(email)) emailsToCheck.push(email);
    }
    if (emailsToCheck.length === 0) return;

    // gọi hàm bên auth-service xem email nào đã có người dùng
    const owners = await this.ncs.callAuth<{ email: string; username: string }[]>(
      'auth.find-emails',
      { emails: emailsToCheck },
    );
    const ownerByEmail = new Map<string, string>(); // email -> tên tài khoản đang giữ
    for (const owner of owners) ownerByEmail.set(owner.email.toLowerCase(), owner.username);

    // duyệt từng dòng và ghi lỗi
    const firstRowOfEmail = new Map<string, number>(); // email -> số dòng xuất hiện đầu tiên
    for (let i = 0; i < rows.length; i++) {
      //check dòng dữ liệu đó có cần tạo account không 
      if (!results[i].willCreateAccount) continue;
      //check xem dòng đó có email không, k có thì bỏ qua 
      const email = emailOf(rows[i]);
      if (!email) continue; // bỏ trống email thì không kiểm

      //check email tồn tại 
      const owner = ownerByEmail.get(email);
      if (owner) {
        results[i].errors.push(`Email đã được dùng bởi tài khoản ${owner}`);
      }

      //check trùng email 
      const firstRow = firstRowOfEmail.get(email);
      if (firstRow === undefined) {
        firstRowOfEmail.set(email, results[i].row);
      } else {
        results[i].errors.push(`Email trùng với dòng ${firstRow}`);
      }
    }
  }

  //check số lượng dòng Min, 
  private assertSize(rows: ImportNcsRow[]) {
    if (!rows?.length) throw new RpcException({ statusCode: 400, message: 'File không có dòng nào' });
    if (rows.length > MAX_ROWS) {
      throw new RpcException({ statusCode: 400, message: `Tối đa ${MAX_ROWS} dòng mỗi lần import` });
    }
  }

  // Kiểm tra toàn bộ danh sách, trả kết quả theo từng dòng (đúng thứ tự đầu vào)
  private async analyze(rows: ImportNcsRow[]): Promise<{ rows: RowResult[]; newKhoaHocCount: number }> {
    const results: RowResult[] = rows.map((r) => ({
      row: r.row,
      mshv: (r.mshv ?? '').trim(),
      ok: true,
      willCreateAccount: false,
      errors: validateRow(r),
    }));

    // MSHV lặp trong file: dòng xuất hiện sau bị báo, trỏ về dòng đầu tiên
    const firstSeen = new Map<string, number>();
    for (const res of results) {
      if (!res.mshv) continue;
      const first = firstSeen.get(res.mshv);
      if (first === undefined) firstSeen.set(res.mshv, res.row);
      else res.errors.push(`MSHV trùng với dòng ${first}`);
    }

    // lấy danh sách bên auth-service 
    const mshvList = [...firstSeen.keys()]; //chỉ lấy mshv là key của Map firstSeen 
    const accounts = await this.ncs.getAccounts(mshvList);
    const hasProfile = await this.ncs.getMshvHavingProfile(mshvList);

    // Danh mục: ngành phải có sẵn; khóa chưa có thì confirm sẽ thêm vào danh mục
    const nganhCatalog = await this.ncs.getListNganh(rows.map((r) => r.nganh));
    const khoaCatalog = await this.ncs.getListKhoaHoc(rows.map((r) => r.khoaHoc));
    const cccdTaken = await this.ncs.getCccdTaken(rows.map((r) => r.cccd));
    const sdtTaken = await this.ncs.getSdtTaken(rows.map((r) => r.soDienThoai));

    const firstCccd = new Map<string, number>(); // CCCD -> dòng xuất hiện đầu tiên
    const firstSdt = new Map<string, number>(); // SDT -> dòng xuất hiện đầu tiên

    results.forEach((res, i) => {
      const row = rows[i];

      // CCCD là unique nên trùng cũng phải báo trước, tránh fail cả lô lúc ghi
      const cccd = row.cccd?.trim();
      if (cccd) {
        const first = firstCccd.get(cccd);
        if (first === undefined) firstCccd.set(cccd, res.row);
        else res.errors.push(`CCCD trùng với dòng ${first}`);

        if (cccdTaken.has(cccd)) res.errors.push('CCCD đã có trong hồ sơ khác');
      }

      // SĐT là unique nên trùng cũng phải báo trước, tránh fail cả lô lúc ghi
      const sdt = row.soDienThoai?.trim();
      if (sdt) {
        const first = firstSdt.get(sdt);
        if (first === undefined) firstSdt.set(sdt, res.row);
        else res.errors.push(`SĐT trùng với dòng ${first}`);

        if (sdtTaken.has(sdt)) res.errors.push('SĐT đã có trong hồ sơ khác');
      }
      //kiểm tra ngành có tòn tại không 
      if (row.nganh && !timTrongDanhSach(nganhCatalog, row.nganh)) {
        res.errors.push(`Không tìm thấy ngành "${row.nganh}" trong danh mục`);
      }

      if (!res.mshv) return;
      const account = accounts.get(res.mshv);

      if (!account) {
        res.willCreateAccount = true; // chưa có tài khoản: import sẽ tạo luôn
        if (!rows[i].hoTen?.trim()) res.errors.push('Thiếu họ tên (cần để tạo tài khoản mới)');
      } else if (!account.roles.includes(ROLES.NCS)) {
        res.errors.push('MSHV này không phải tài khoản NCS');
      } else if (!account.isActive) {
        res.errors.push('Tài khoản đang bị khóa');
      }

      if (hasProfile.has(res.mshv)) res.errors.push('MSHV đã có hồ sơ');
    });

    await this.checkEmails(rows, results); //check trùng email 

    results.forEach((res) => (res.ok = res.errors.length === 0));
    return { rows: results, newKhoaHocCount: khoaCatalog.moiTao.length };
  }
}