import { cellText, mapGender, MAX_IMPORT_ROWS, plain } from "../ncs/ncs-excel.js";
import { ImportGvhdRow } from "../../../../lib/contracts/src/dto/gvhd.dto.js";
import ExcelJS from 'exceljs';
import { BadRequestException } from "@nestjs/common";
const COLUMNS = [
    { key: 'maGv', header: 'Mã GV', width: 20 },
    { key: 'hoTen', header: 'Họ tên', width: 28 },
    { key: 'gioiTinh', header: 'Giới tính', width: 12 },
    { key: 'ngaySinh', header: 'Ngày sinh', width: 14 },
    { key: 'email', header: 'Email', width: 28 },
    { key: 'hocHamHocVi', header: 'Học hàm/Học vị', width: 18 },
    { key: 'chuyenNganh', header: 'Chuyên ngành', width: 30 },
    { key: 'quocGia', header: 'Nước tốt nghiệp', width: 18 },
    { key: 'donVi', header: 'Đơn vị', width: 45 },
    { key: 'donViCapTren', header: 'Đơn vị cấp trên', width: 40 },
] as const;

const REQUIRED_KEYS = ['maGv', 'hoTen'];

//chuẩn hóa dữ liệu trong cột học hàm (để trống = Tiến sĩ, giống phd-service)
function mapHocHam(s: string): string {
    const k = plain(s);
    if (k === '' || k === 'tien si' || k === 'ts' || k === 'tien_si') return 'TIEN_SI';
    if (k === 'giao su' || k === 'gs' || k === 'giao_su') return 'GIAO_SU';
    if (k === 'pho giao su' || k === 'pgs' || k === 'pho_giao_su') return 'PHO_GIAO_SU';
    if (k === 'tien si khoa hoc' || k === 'tskh' || k === 'tien_si_khoa_hoc') return 'TIEN_SI_KHOA_HOC';
    return s; // giữ nguyên để phd-service báo lỗi đúng dòng
}

export async function parseGvhdExcel(buffer: Buffer): Promise<ImportGvhdRow[]> {
    const wb = new ExcelJS.Workbook();
    try {
        await wb.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch {
        throw new BadRequestException("Không đọc được file, hãy dùng file .xlsx theo mẫu");

    }

    //lấy worksheet trong excel
    const ws = wb.worksheets[0];
    if (!ws) throw new BadRequestException("File không có sheet nào");

    //đọc dòng 1 (tiêu đề của file) và ghi nhớ mỗi trường nằm ở cột số mấy 
    const colOf = new Map<string, number>();

    ws.getRow(1).eachCell((cell, col) => {
        const def = COLUMNS.find((c) => plain(c.header) === plain(cellText(cell.value)));
        if (def) colOf.set(def.key, col);
    })

    //kiểm tra xem có đủ cột cần thiết không
    const missing = REQUIRED_KEYS.filter((k) => !colOf.has(k)).map(
        (k) => COLUMNS.find((c) => c.key === k)!.header,
    );

    if (missing.length) {
        throw new BadRequestException(`Thiếu cột: ${missing.join(', ')}. Hãy dùng file mẫu`);
    }

    const rows: ImportGvhdRow[] = [];

    ws.eachRow({ includeEmpty: false }, (excelRow, rowNumber) => {
        if (rowNumber === 1) return; // bỏ dòng tiêu đề

        const get = (key: string, isDate = false) => {
            const col = colOf.get(key);
            return col ? cellText(excelRow.getCell(col).value, isDate) : '';
        };

        const r: ImportGvhdRow = {
            row: rowNumber,
            maGv: get('maGv'),
            hoTen: get('hoTen'),
            gioiTinh: mapGender(get('gioiTinh')),
            ngaySinh: get('ngaySinh', true),
            hocHamHocVi: mapHocHam(get('hocHamHocVi')),
            chuyenNganh: get('chuyenNganh'),
            quocGiaTotNghiep: get('quocGia'),
            email: get('email'),
            donVi: get('donVi'),
            donViCapTren: get('donViCapTren'),
        };

        const hasData = Object.entries(r).some(([k, v]) => k !== 'row' && v);
        if (hasData) rows.push(r);
    });

    if (rows.length === 0) throw new BadRequestException('File không có dòng dữ liệu nào');
    if (rows.length > MAX_IMPORT_ROWS) {
        throw new BadRequestException(`Tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần import`);
    }
    return rows;

}

//build template for supervisor
export async function buildGvhdTemplate(): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('GVHD');
    ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
    ws.getRow(1).font = { bold: true };
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    // Ép các cột này về dạng văn bản để Excel không đổi định dạng ngày hay bỏ số 0 đầu
    for (const key of ['maGv', 'ngaySinh']) {
        ws.getColumn(key).numFmt = '@';
    }

    // Ô chọn sẵn cho hai cột có giá trị cố định
    const genderCol = COLUMNS.findIndex((c) => c.key === 'gioiTinh') + 1;
    const hocHamCol = COLUMNS.findIndex((c) => c.key === 'hocHamHocVi') + 1;
    for (let r = 2; r <= MAX_IMPORT_ROWS + 1; r++) {
        ws.getCell(r, genderCol).dataValidation = {
            type: 'list', allowBlank: true, formulae: ['"Nam,Nữ"'],
        };
        ws.getCell(r, hocHamCol).dataValidation = {
            type: 'list', allowBlank: true, formulae: ['"Giáo sư,Phó Giáo sư,Tiến sĩ khoa học,Tiến sĩ"'],
        };
    }

    const guide = wb.addWorksheet('Hướng dẫn');
    guide.getColumn(1).width = 100;
    [
        'Mỗi dòng là một giảng viên. Không đổi tên các cột ở dòng 1.',
        'Bắt buộc: Mã GV (số hiệu công chức), Họ tên.',
        'Mã GV đã có trong hệ thống thì dòng đó CẬP NHẬT thông tin; chưa có thì TẠO MỚI.',
        'Ô để trống khi cập nhật = giữ nguyên giá trị cũ, không xóa dữ liệu.',
        'Ngày sinh nhập dạng dd/mm/yyyy, ví dụ 01/09/1980.',
        'Học hàm/Học vị: Giáo sư, Phó Giáo sư, Tiến sĩ khoa học hoặc Tiến sĩ (để trống = Tiến sĩ).',
        'Số NCS tối đa được tính tự động theo học hàm: GS 7, PGS 5, Tiến sĩ khoa học 5, Tiến sĩ 3.',
        'Đơn vị: ghi đúng tên đơn vị như trong danh mục (cột t_dvi của file trường).',
        'Đơn vị cấp trên: chỉ cần khi Đơn vị bắt đầu bằng "Lãnh đạo ..." (cột dvi.ten của file trường).',
        `Tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần import.`,
    ].forEach((line) => guide.addRow([line]));

    return Buffer.from(await wb.xlsx.writeBuffer());
}