/// <reference types="node" />
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/index.js';

const databaseUrl = process.env.PHD_DATABASE_URL;
if (!databaseUrl) throw new Error('Thiếu PHD_DATABASE_URL trong .env');
const u = new URL(databaseUrl);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    connectionLimit: 5,
  }),
});

// Seed chạy lại nhiều lần vẫn an toàn (idempotent): chỉ thêm cái thiếu, không tạo trùng.

// ---------------------------------------------------------------------------
// 1. 9 mốc tiến trình (backend-plan-phd.md mục 7.1); mốc 2, 4, 5 có chấm điểm
// ---------------------------------------------------------------------------
const MOCS = [
  { thuTu: 1, tenMoc: 'Nhập học', yeuCauDiem: false },
  { thuTu: 2, tenMoc: 'Tiểu luận tổng quan', yeuCauDiem: true },
  { thuTu: 3, tenMoc: 'Đề cương chi tiết', yeuCauDiem: false },
  { thuTu: 4, tenMoc: 'Chuyên đề 1', yeuCauDiem: true },
  { thuTu: 5, tenMoc: 'Chuyên đề 2', yeuCauDiem: true },
  { thuTu: 6, tenMoc: 'Bảo vệ giữa kỳ', yeuCauDiem: false },
  { thuTu: 7, tenMoc: 'Seminar cuối khóa', yeuCauDiem: false },
  { thuTu: 8, tenMoc: 'Bảo vệ cấp Bộ môn', yeuCauDiem: false },
  { thuTu: 9, tenMoc: 'Bảo vệ cấp Trường và Phản biện kín', yeuCauDiem: false },
];

// ---------------------------------------------------------------------------
// 2. Ngành đào tạo tiến sĩ (mã ngành lưu dạng chuỗi, KHÔNG phải số)
// ---------------------------------------------------------------------------
const NGANHS = [{ maNganh: '9620110', tenNganh: 'Khoa học cây trồng' }];

// ---------------------------------------------------------------------------
// 3. Khóa tuyển sinh NCS. NCS01 nhập học 11-12/2025 (theo file trường)
// ---------------------------------------------------------------------------
const KHOAS = [{ maKhoaHoc: 'NCS01', namTuyenSinh: 2025 }];

// ---------------------------------------------------------------------------
// 4. Cây đơn vị công tác của giảng viên, lấy từ sheet GIANGVIEN của trường.
//    - `ten` giữ NGUYÊN như cột t_dvi / dvi.ten để import giảng viên tra theo đúng chuỗi.
//    - Các dòng "Lãnh đạo Khoa/Viện ..." KHÔNG tạo đơn vị riêng: khi import, giảng viên
//      đó gắn thẳng vào Khoa/Viện cha (cột dvi.ten).
// ---------------------------------------------------------------------------
type Loai = 'KHOA' | 'BO_MON' | 'PHONG_BAN';

/** Cấp 1: Khoa, Viện, Phòng, Ban, Đảng ủy và các bộ môn trực thuộc trường */
const DON_VI_CAP_1: { ten: string; loai: Loai }[] = [
  { ten: "Bộ môn Giáo dục quốc phòng", loai: 'BO_MON' },
  { ten: "Bộ môn Giáo dục thể chất", loai: 'BO_MON' },
  { ten: "Khoa Công nghệ thông tin", loai: 'KHOA' },
  { ten: "Khoa Du lịch và Văn hóa - Nghệ thuật", loai: 'KHOA' },
  { ten: "Khoa Kinh tế - Quản trị kinh doanh", loai: 'KHOA' },
  { ten: "Khoa Kỹ thuật - Công nghệ - Môi trường", loai: 'KHOA' },
  { ten: "Khoa Luật và Khoa học chính trị", loai: 'KHOA' },
  { ten: "Khoa Ngoại ngữ", loai: 'KHOA' },
  { ten: "Khoa Nông nghiệp - Tài nguyên thiên nhiên", loai: 'KHOA' },
  { ten: "Khoa Sư phạm", loai: 'KHOA' },
  { ten: "Viện Biến đổi khí hậu", loai: 'KHOA' },
  { ten: "Ban Giám hiệu", loai: 'PHONG_BAN' },
  { ten: "Phòng Khoa học và Công nghệ", loai: 'PHONG_BAN' },
  { ten: "Phòng Quản trị - Thiết bị", loai: 'PHONG_BAN' },
  { ten: "Phòng Đào tạo", loai: 'PHONG_BAN' },
  { ten: "Đảng ủy", loai: 'PHONG_BAN' },
];

/** Cấp 2: bộ môn thuộc khoa, phòng thuộc viện... (parent = ten của đơn vị cấp 1) */
const DON_VI_CAP_2: { ten: string; loai: Loai; parent: string }[] = [
  { ten: "Bộ môn Công nghệ thông tin - Khoa CNTT", loai: 'BO_MON', parent: "Khoa Công nghệ thông tin" },
  { ten: "Bộ môn Kỹ thuật phần mềm - Khoa CNTT", loai: 'BO_MON', parent: "Khoa Công nghệ thông tin" },
  { ten: "Bộ môn Du lịch - Khoa DL và VH - NT", loai: 'BO_MON', parent: "Khoa Du lịch và Văn hóa - Nghệ thuật" },
  { ten: "Bộ môn Kinh tế - Tổng hợp - Khoa KT-QTKD", loai: 'BO_MON', parent: "Khoa Kinh tế - Quản trị kinh doanh" },
  { ten: "Bộ môn Quản trị Marketing - Khoa KT-QTKD", loai: 'BO_MON', parent: "Khoa Kinh tế - Quản trị kinh doanh" },
  { ten: "Bộ môn Tài chính - Kế toán - Khoa KT-QTKD", loai: 'BO_MON', parent: "Khoa Kinh tế - Quản trị kinh doanh" },
  { ten: "Bộ môn Kỹ thuật Vật liệu và Hóa - Sinh - Khoa KT-CN-MT", loai: 'BO_MON', parent: "Khoa Kỹ thuật - Công nghệ - Môi trường" },
  { ten: "Bộ môn Kỹ thuật và Quản lý môi trường - Khoa KT-CN-MT", loai: 'BO_MON', parent: "Khoa Kỹ thuật - Công nghệ - Môi trường" },
  { ten: "Bộ môn Khoa học Chính trị - Khoa Luật & KHCT", loai: 'BO_MON', parent: "Khoa Luật và Khoa học chính trị" },
  { ten: "Bộ môn Luật - Khoa Luật & KHCT", loai: 'BO_MON', parent: "Khoa Luật và Khoa học chính trị" },
  { ten: "Bộ môn Ngôn ngữ học và Dịch thuật Tiếng Anh - Khoa Ngoại ngữ", loai: 'BO_MON', parent: "Khoa Ngoại ngữ" },
  { ten: "Bộ môn Phương pháp giảng dạy tiếng Anh - Khoa Ngoại ngữ", loai: 'BO_MON', parent: "Khoa Ngoại ngữ" },
  { ten: "Bộ môn Công nghệ Sinh học - Khoa NN-TNTN", loai: 'BO_MON', parent: "Khoa Nông nghiệp - Tài nguyên thiên nhiên" },
  { ten: "Bộ môn Công nghệ thực phẩm - Khoa NN-TNTN", loai: 'BO_MON', parent: "Khoa Nông nghiệp - Tài nguyên thiên nhiên" },
  { ten: "Bộ môn Khoa học Cây trồng - Khoa NN-TNTN", loai: 'BO_MON', parent: "Khoa Nông nghiệp - Tài nguyên thiên nhiên" },
  { ten: "Bộ môn Khoa học động vật - Khoa NN-TNTN", loai: 'BO_MON', parent: "Khoa Nông nghiệp - Tài nguyên thiên nhiên" },
  { ten: "Bộ môn Phát triển nông thôn & Nông nghiệp bền vững - Khoa NN-TNTN", loai: 'BO_MON', parent: "Khoa Nông nghiệp - Tài nguyên thiên nhiên" },
  { ten: "Bộ môn Lịch sử - Địa lý - Khoa Sư phạm", loai: 'BO_MON', parent: "Khoa Sư phạm" },
  { ten: "Bộ môn Ngữ văn - Khoa Sư phạm", loai: 'BO_MON', parent: "Khoa Sư phạm" },
  { ten: "Bộ môn Toán học - Khoa Sư phạm", loai: 'BO_MON', parent: "Khoa Sư phạm" },
  { ten: "Bộ môn Tâm lý Giáo dục - Mầm non - Tiểu học - Khoa Sư phạm", loai: 'BO_MON', parent: "Khoa Sư phạm" },
  { ten: "Bộ môn Vật lý - Hóa học - Sinh học - Khoa Sư phạm", loai: 'BO_MON', parent: "Khoa Sư phạm" },
  { ten: "Bộ phận Quản lý khu Thí nghiệm - Thực hành - Phòng QT-TB", loai: 'PHONG_BAN', parent: "Phòng Quản trị - Thiết bị" },
  { ten: "Phòng Nghiên cứu Nông nghiệp và Phát triển nông thôn - Viện BĐKH", loai: 'PHONG_BAN', parent: "Viện Biến đổi khí hậu" },
];

// ---------------------------------------------------------------------------
// 5. Hạn theo quy định của trường (bảng moc_han). Hạn của từng NCS được tính khi truy vấn.
//    Mốc 1 và mốc 6 không có dòng ở đây: mốc 1 tự đạt, mốc 6 là lịch cố định tháng 6 và tháng 12.
// ---------------------------------------------------------------------------
type DongHan = {
  thuTu: number;
  maHan: string;
  tenHan: string;
  mocGoc: 'NGAY_NHAP_HOC' | 'NGAY_MOC_DAT' | 'HET_HAN_CHINH_QUY';
  gocThuTu?: number;
  soDonVi: number;
  donVi: 'NGAY' | 'NGAY_LAM_VIEC' | 'THANG';
  laHanMem?: boolean;
  canCu: string;
};

const HAN_TRUOC_MOC_8 = 'Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy';

const MOC_HANS: DongHan[] = [
  { thuTu: 2, maHan: 'HOAN_THANH', tenHan: 'Hoàn thành tiểu luận tổng quan', mocGoc: 'NGAY_NHAP_HOC', soDonVi: 6, donVi: 'THANG', canCu: 'Thực hiện trong 06 tháng đầu khóa' },
  { thuTu: 3, maHan: 'HOAN_THANH', tenHan: 'Hoàn thành đề cương nghiên cứu', mocGoc: 'NGAY_NHAP_HOC', soDonVi: 6, donVi: 'THANG', canCu: 'Thực hiện trong 06 tháng đầu khóa' },
  { thuTu: 4, maHan: 'DANG_KY_CHUYEN_DE', tenHan: 'GVHD gửi phiếu đăng ký chuyên đề', mocGoc: 'NGAY_NHAP_HOC', soDonVi: 12, donVi: 'THANG', laHanMem: true, canCu: 'Chậm nhất đầu năm học thứ 2 (ước tính 12 tháng từ ngày nhập học)' },
  { thuTu: 4, maHan: 'HOAN_THANH', tenHan: 'Hoàn thành chuyên đề 1', mocGoc: 'HET_HAN_CHINH_QUY', soDonVi: -3, donVi: 'THANG', canCu: HAN_TRUOC_MOC_8 },
  { thuTu: 5, maHan: 'HOAN_THANH', tenHan: 'Hoàn thành chuyên đề 2', mocGoc: 'HET_HAN_CHINH_QUY', soDonVi: -3, donVi: 'THANG', canCu: HAN_TRUOC_MOC_8 },
  { thuTu: 7, maHan: 'HOAN_THANH', tenHan: 'Hoàn thành seminar cuối khóa', mocGoc: 'HET_HAN_CHINH_QUY', soDonVi: -3, donVi: 'THANG', canCu: HAN_TRUOC_MOC_8 },
  { thuTu: 8, maHan: 'NOP_HO_SO', tenHan: 'Nộp hồ sơ đăng ký bảo vệ cấp đơn vị chuyên môn', mocGoc: 'HET_HAN_CHINH_QUY', soDonVi: -3, donVi: 'THANG', canCu: 'Chậm nhất 03 tháng trước khi hết thời hạn chính quy' },
  { thuTu: 9, maHan: 'HOAN_THIEN_GUI_PHAN_BIEN', tenHan: 'Hoàn thiện luận án gửi phản biện độc lập', mocGoc: 'NGAY_MOC_DAT', gocThuTu: 8, soDonVi: 60, donVi: 'NGAY_LAM_VIEC', canCu: 'Tối đa 60 ngày làm việc sau khi hội đồng cấp đơn vị thông qua (mốc 8)' },
  { thuTu: 9, maHan: 'BAO_VE_CO_SO', tenHan: 'Bảo vệ luận án cấp cơ sở đào tạo', mocGoc: 'NGAY_MOC_DAT', gocThuTu: 8, soDonVi: 12, donVi: 'THANG', canCu: 'Nhà trường tổ chức trong vòng 12 tháng kể từ ngày mốc 8 được thông qua' },
];

async function seedMoc() {
  for (const m of MOCS) {
    await prisma.mocTienTrinh.upsert({
      where: { thuTu: m.thuTu },
      update: { tenMoc: m.tenMoc, yeuCauDiem: m.yeuCauDiem },
      create: m,
    });
  }
  const count = await prisma.mocTienTrinh.count();
  if (count !== MOCS.length) {
    throw new Error(`moc_tien_trinh có ${count} dòng, mong đợi ${MOCS.length}; kiểm tra lại dữ liệu cũ`);
  }
}

async function seedMocHan() {
  for (const h of MOC_HANS) {
    const moc = await prisma.mocTienTrinh.findUnique({ where: { thuTu: h.thuTu }, select: { id: true } });
    if (!moc) throw new Error(`Chưa có mốc ${h.thuTu}, hãy chạy seedMoc trước`);
    const duLieu = {
      tenHan: h.tenHan,
      mocGoc: h.mocGoc,
      gocThuTu: h.gocThuTu ?? null,
      soDonVi: h.soDonVi,
      donVi: h.donVi,
      laHanMem: h.laHanMem ?? false,
      canCu: h.canCu,
    };
    await prisma.mocHan.upsert({
      where: { mocId_maHan: { mocId: moc.id, maHan: h.maHan } },
      update: duLieu,
      create: { mocId: moc.id, maHan: h.maHan, ...duLieu },
    });
  }
}

async function seedNganh() {
  for (const n of NGANHS) {
    await prisma.nganhDaoTao.upsert({
      where: { maNganh: n.maNganh },
      update: { tenNganh: n.tenNganh },
      create: n,
    });
  }
}

async function seedKhoa() {
  for (const k of KHOAS) {
    await prisma.khoaHocNcs.upsert({
      where: { maKhoaHoc: k.maKhoaHoc },
      update: {}, // không ghi đè năm/ghi chú nếu Giáo vụ đã sửa
      create: k,
    });
  }
}

/** Tìm theo (ten, parentId); chưa có thì tạo. Trả về id. */
async function findOrCreateDonVi(ten: string, loai: Loai, parentId: string | null): Promise<string> {
  const existed = await prisma.donVi.findFirst({ where: { ten, parentId }, select: { id: true } });
  if (existed) return existed.id;
  const created = await prisma.donVi.create({ data: { ten, loai, parentId }, select: { id: true } });
  return created.id;
}

async function seedDonVi() {
  const idByTen = new Map<string, string>();

  for (const d of DON_VI_CAP_1) {
    idByTen.set(d.ten, await findOrCreateDonVi(d.ten, d.loai, null));
  }
  for (const d of DON_VI_CAP_2) {
    const parentId = idByTen.get(d.parent);
    if (!parentId) throw new Error(`Không thấy đơn vị cha "${d.parent}" của "${d.ten}"`);
    idByTen.set(d.ten, await findOrCreateDonVi(d.ten, d.loai, parentId));
  }
}

async function main() {
  await seedMoc();
  console.log('Seed 9 mốc xong');
  await seedMocHan();
  console.log(`Seed ${MOC_HANS.length} dòng hạn xong`);
  await seedNganh();
  console.log(`Seed ${NGANHS.length} ngành xong`);
  await seedKhoa();
  console.log(`Seed ${KHOAS.length} khóa tuyển sinh xong`);
  await seedDonVi();
  console.log(`Seed đơn vị xong (${DON_VI_CAP_1.length} cấp 1, ${DON_VI_CAP_2.length} cấp 2)`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());