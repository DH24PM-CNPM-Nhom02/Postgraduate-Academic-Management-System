import ExcelJS from 'exceljs';
import type { GraduatedNcsRecord } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';

export async function buildGraduationWorkbook(records: GraduatedNcsRecord[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('NCS đã tốt nghiệp', {
        views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = [
        { header: 'Mã NCS', width: 17, style: { numFmt: '@' } },
        { header: 'Họ tên', width: 30 },
        { header: 'Ngành', width: 28 },
        { header: 'Khóa', width: 13, style: { numFmt: '@' } },
        { header: 'Người hướng dẫn', width: 38 },
        { header: 'Ngày bảo vệ cấp trường', width: 26, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Số quyết định công nhận', width: 26, style: { numFmt: '@' } },
        { header: 'Ngày quyết định công nhận', width: 28, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Số hiệu bằng', width: 19, style: { numFmt: '@' } },
        { header: 'Ngày cấp bằng', width: 17, style: { numFmt: 'dd/mm/yyyy' } },
    ];

    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF164E9B' } };

    for (const record of records) {
        sheet.addRow([
            record.mshv,
            record.hoTen,
            record.nganh,
            record.khoaHoc,
            record.nguoiHuongDan.length ? record.nguoiHuongDan.join(', ') : null,
            record.ngayBaoVeCapTruong ? new Date(record.ngayBaoVeCapTruong) : null,
            record.soQuyetDinh,
            record.ngayQuyetDinh ? new Date(record.ngayQuyetDinh) : null,
            record.soHieuBang,
            record.ngayCapBang ? new Date(record.ngayCapBang) : null,
        ]);
    }

    sheet.autoFilter = `A1:J${sheet.rowCount}`;
    return Buffer.from(await workbook.xlsx.writeBuffer());
}
