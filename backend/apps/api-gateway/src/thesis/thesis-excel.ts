import ExcelJS from 'exceljs';
import { addListWorksheet } from '../common/list-excel.js';

interface ThesisRecord {
  tenDeTai: string;
  trangThai: 'HIEU_LUC' | 'DA_THAY_THE' | 'DA_HUY';
  quyetDinh: { soQuyetDinh: string; ngayQuyetDinh: string } | null;
}

export interface ThesisExportRecord {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string | null;
  deTaiHienTai: ThesisRecord | null;
  deTais: ThesisRecord[];
  phanCongs: { vaiTro: 'HUONG_DAN_CHINH' | 'DONG_HUONG_DAN'; gvhd: { hoTen: string } }[];
}

export function buildThesisListWorkbook(records: ThesisExportRecord[]) {
  const workbook = new ExcelJS.Workbook();
  const identityColumns = [
    { header: 'MSHV', width: 17, style: { numFmt: '@' } },
    { header: 'Họ tên NCS', width: 30 },
    { header: 'Khóa học', width: 15, style: { numFmt: '@' } },
  ];
  const decisionColumns = [
    { header: 'Số quyết định', width: 22, style: { numFmt: '@' } },
    { header: 'Ngày ký', width: 15, style: { numFmt: 'dd/mm/yyyy' } },
  ];
  const statusColumn = { header: 'Trạng thái đề tài', width: 30 };
  const titleStyle = { alignment: { wrapText: true } };
  const currentRows = records.map((record) => {
    const thesis = record.deTaiHienTai;
    const decision = thesis?.quyetDinh;
    return [
      record.mshv, record.hoTen, record.khoaHoc,
      thesis ? 'Có đề tài đang hiệu lực' : 'Chưa có đề tài hiệu lực',
      thesis?.tenDeTai, decision?.soQuyetDinh, decision ? new Date(decision.ngayQuyetDinh) : null,
      record.phanCongs.filter(({ vaiTro }) => vaiTro === 'HUONG_DAN_CHINH').map(({ gvhd }) => gvhd.hoTen).join(', '),
      record.phanCongs.filter(({ vaiTro }) => vaiTro === 'DONG_HUONG_DAN').map(({ gvhd }) => gvhd.hoTen).join(', '),
    ];
  });
  addListWorksheet(workbook, 'Đề tài hiện tại', [
    ...identityColumns,
    statusColumn,
    { header: 'Tên đề tài hiện tại', width: 56, style: titleStyle },
    ...decisionColumns,
    { header: 'GVHD chính', width: 30 },
    { header: 'Đồng hướng dẫn', width: 30 },
  ], currentRows);

  const historyRows = records.flatMap((record) =>
    record.deTais.filter(({ trangThai }) => trangThai !== 'HIEU_LUC').map((thesis) => [
      record.mshv, record.hoTen, record.khoaHoc,
      thesis.trangThai === 'DA_HUY' ? 'Đã hủy' : 'Đã thay thế', thesis.tenDeTai,
      thesis.quyetDinh?.soQuyetDinh, thesis.quyetDinh ? new Date(thesis.quyetDinh.ngayQuyetDinh) : null,
    ]),
  );
  addListWorksheet(workbook, 'Lịch sử đề tài', [
    ...identityColumns,
    statusColumn,
    { header: 'Tên đề tài', width: 56, style: titleStyle },
    ...decisionColumns,
  ], historyRows);
  return workbook;
}
