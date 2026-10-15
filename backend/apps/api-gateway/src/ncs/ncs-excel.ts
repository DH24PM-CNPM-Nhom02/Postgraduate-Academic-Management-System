import { BadRequestException } from '@nestjs/common';
import ExcelJS from 'exceljs';
import type { ImportNcsRow } from '../../../../lib/contracts/src/dto/ncs.dto.js';

export const MAX_IMPORT_ROWS = 200;

// Thứ tự cột trong file mẫu. Khi đọc, cột được tìm theo tên tiêu đề (không theo vị trí)
const COLUMNS = [
  { key: 'mshv', header: 'MSHV', width: 16 },
  { key: 'hoTen', header: 'Họ tên', width: 28 },
  { key: 'ngaySinh', header: 'Ngày sinh', width: 14 },
  { key: 'gioiTinh', header: 'Giới tính', width: 12 },
  { key: 'cccd', header: 'CCCD', width: 16 },
  { key: 'email', header: 'Email', width: 28 },
  { key: 'soDienThoai', header: 'Số điện thoại', width: 16 },
  { key: 'nganh', header: 'Ngành', width: 28 },
  { key: 'khoaHoc', header: 'Khóa', width: 12 },
  { key: 'lop', header: 'Lớp', width: 14 },
  { key: 'ngayNhapHoc', header: 'Ngày nhập học', width: 16 },
  { key: 'trinhDoDauVao', header: 'Trình độ đầu vào', width: 18 },
  { key: 'phuongThucDaoTao', header: 'Phương thức đào tạo', width: 20 },
] as const;

const REQUIRED_KEYS = ['mshv', 'hoTen', 'ngayNhapHoc'];

// Bỏ dấu + chữ thường để so sánh chữ do người dùng gõ
export const plain = (s: string) =>
  s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') //xóa dấu tiếng Việt 
    .replace(/đ/g, 'd') //thay đ bằng d vì bước trên không xử lý được
    .trim();

// "01/09/2026" hoặc "1-9-2026" thành "2026-09-01"; dạng khác giữ nguyên để phd báo lỗi
function normalizeDate(s: string): string {
  const m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : s;
}

// Đổi giá trị một ô về chuỗi. Ô Excel có nhiều kiểu: chuỗi, số, ngày, công thức, rich text...
export function cellText(v: ExcelJS.CellValue, isDate = false): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'number') {
    // Ô ngày không định dạng được Excel lưu bằng số seri (số ngày kể từ 1900)
    return isDate ? new Date(Math.round((v - 25569) * 86400000)).toISOString().slice(0, 10) : String(v);
  }
  if (typeof v === 'object') {
    const o = v as any;
    if (Array.isArray(o.richText)) return o.richText.map((t: any) => t.text).join('').trim();
    if (o.result !== undefined) return cellText(o.result, isDate); // ô công thức
    if (o.text !== undefined) return cellText(o.text, isDate);     // ô hyperlink
    return '';
  }
  const s = String(v).trim();
  return isDate ? normalizeDate(s) : s;
}

function mapLevel(s: string): string {
  const k = plain(s);
  if (!k) return '';
  if (['thac si', 'ths', 'thac_si'].includes(k)) return 'THAC_SI';
  if (['dai hoc', 'dh', 'dai_hoc'].includes(k)) return 'DAI_HOC';
  return s; // giữ nguyên để phd-service báo lỗi đúng dòng
}

function mapMethod(s: string): string {
  const k = plain(s);
  if (!k) return '';
  if (['1', 'phuong thuc 1', 'pt1', 'phuong_thuc_1'].includes(k)) return 'PHUONG_THUC_1';
  if (['2', 'phuong thuc 2', 'pt2', 'phuong_thuc_2'].includes(k)) return 'PHUONG_THUC_2';
  return s;
}

export function mapGender(s: string): string {
  const k = plain(s);
  if (!k) return '';
  if (['nam', 'm', 'male'].includes(k)) return 'NAM';
  if (['nu', 'n', 'female'].includes(k)) return 'NU';
  return s; // giữ nguyên để phd-service báo lỗi đúng dòng
}

// CCCD lưu dạng chuỗi: bỏ cách chặn và dấu chấm ngăn cách nhóm số, giữ số 0 đầu
function normalizeCccd(s: string): string {
  return s.replace(/[\s.]/g, '');
}

export async function parseNcsExcel(buffer: Buffer): Promise<ImportNcsRow[]> {
  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(buffer as unknown as ArrayBuffer);
  } catch {
    throw new BadRequestException('Không đọc được file, hãy dùng file .xlsx theo mẫu');
  }
  const ws = wb.worksheets[0];
  if (!ws) throw new BadRequestException('File không có sheet nào');

  // Dòng 1 là tiêu đề: ghi nhớ mỗi trường nằm ở cột số mấy
  const colOf = new Map<string, number>();
  ws.getRow(1).eachCell((cell, col) => {
    const def = COLUMNS.find((c) => plain(c.header) === plain(cellText(cell.value)));
    if (def) colOf.set(def.key, col);
  });
  const missing = REQUIRED_KEYS.filter((k) => !colOf.has(k)).map(
    (k) => COLUMNS.find((c) => c.key === k)!.header,
  );
  if (missing.length) {
    throw new BadRequestException(`Thiếu cột: ${missing.join(', ')}. Hãy dùng file mẫu`);
  }

  const rows: ImportNcsRow[] = [];
  ws.eachRow({ includeEmpty: false }, (excelRow, rowNumber) => {
    if (rowNumber === 1) return; // bỏ dòng tiêu đề
    const get = (key: string, isDate = false) => {
      const col = colOf.get(key);
      return col ? cellText(excelRow.getCell(col).value, isDate) : '';
    };
    const r: ImportNcsRow = {
      row: rowNumber,
      mshv: get('mshv'),
      hoTen: get('hoTen'),
      ngaySinh: get('ngaySinh', true),
      gioiTinh: mapGender(get('gioiTinh')),
      cccd: normalizeCccd(get('cccd')),
      email: get('email'),
      soDienThoai: get('soDienThoai'),
      nganh: get('nganh'),
      khoaHoc: get('khoaHoc'),
      lop: get('lop'),
      ngayNhapHoc: get('ngayNhapHoc', true),
      trinhDoDauVao: mapLevel(get('trinhDoDauVao')),
      phuongThucDaoTao: mapMethod(get('phuongThucDaoTao')),
    };
    // Bỏ dòng trống hoàn toàn (người dùng có thể để định dạng dư ở cuối sheet)
    const hasData = Object.entries(r).some(([k, v]) => k !== 'row' && v);
    if (hasData) rows.push(r);
  });

  if (rows.length === 0) throw new BadRequestException('File không có dòng dữ liệu nào');
  if (rows.length > MAX_IMPORT_ROWS) {
    throw new BadRequestException(`Tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần import`);
  }
  return rows;
}

export async function buildNcsTemplate(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('NCS');
  ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  // Ép các cột này về dạng văn bản để Excel không bỏ số 0 đầu hay tự đổi định dạng ngày
  for (const key of ['mshv', 'cccd', 'soDienThoai', 'nganh', 'khoaHoc', 'lop', 'ngaySinh', 'ngayNhapHoc']) {
    ws.getColumn(key).numFmt = '@';
  }

  // Ô chọn sẵn cho ba cột có giá trị cố định
  const genderCol = COLUMNS.findIndex((c) => c.key === 'gioiTinh') + 1;
  const levelCol = COLUMNS.findIndex((c) => c.key === 'trinhDoDauVao') + 1;
  const methodCol = COLUMNS.findIndex((c) => c.key === 'phuongThucDaoTao') + 1;
  for (let r = 2; r <= MAX_IMPORT_ROWS + 1; r++) {
    ws.getCell(r, genderCol).dataValidation = {
      type: 'list', allowBlank: true, formulae: ['"Nam,Nữ"'],
    };
    ws.getCell(r, levelCol).dataValidation = {
      type: 'list', allowBlank: true, formulae: ['"Thạc sĩ,Đại học"'],
    };
    ws.getCell(r, methodCol).dataValidation = {
      type: 'list', allowBlank: true, formulae: ['"1,2"'],
    };
  }

  const guide = wb.addWorksheet('Hướng dẫn');
  guide.getColumn(1).width = 100;
  [
    'Mỗi dòng là một NCS. Không đổi tên các cột ở dòng 1.',
    'Bắt buộc: MSHV, Họ tên, Ngày nhập học.',
    'Ngày sinh và Ngày nhập học nhập dạng dd/mm/yyyy, ví dụ 01/09/2005.',
    'Giới tính: Nam hoặc Nữ. Trình độ đầu vào: Thạc sĩ hoặc Đại học (để trống = Thạc sĩ).',
    'Phương thức đào tạo: 1 hoặc 2 (để trống = 2).',
    'CCCD ghi 12 số, không ghi dấu chấm hay dấu cách giữa các nhóm số.',
    'Ngành: ghi mã ngành (vd 9620110) hoặc tên ngành; ngành phải có sẵn trong danh mục.',
    'Khóa: ghi mã khóa tuyển sinh (vd NCS01). Khóa mới chưa có trong danh mục sẽ được thêm tự động.',
    'Lớp: ghi tên lớp theo sổ của trường (vd TSKHCT01).',
    'MSHV chưa có tài khoản sẽ được tạo tài khoản, mật khẩu ban đầu = MSHV, bắt đổi khi đăng nhập lần đầu.',
    `Tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần import.`,
  ].forEach((line) => guide.addRow([line]));

  return Buffer.from(await wb.xlsx.writeBuffer());
}