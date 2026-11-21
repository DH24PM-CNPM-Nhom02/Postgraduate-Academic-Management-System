import { StreamableFile } from '@nestjs/common';
import { ArrayUnique, IsArray, IsUUID, ValidateIf } from 'class-validator';
import ExcelJS from 'exceljs';

export class ExportExcelDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  ids?: string[];
}

export function selectExportRows<T extends { id: string }>(records: T[], ids?: string[]): T[] {
  if (!ids) return records;

  const byId = new Map(records.map((record) => [record.id, record]));
  return ids.flatMap((id) => {
    const record = byId.get(id);
    return record ? [record] : [];
  });
}

export function addListWorksheet(
  workbook: ExcelJS.Workbook,
  name: string,
  columns: Partial<ExcelJS.Column>[],
  rows: ExcelJS.CellValue[][],
) {
  const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = columns;
  sheet.addRows(rows);

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF164E9B' } };
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: sheet.rowCount, column: columns.length },
  };
}

export async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  return new StreamableFile(Buffer.from(await workbook.xlsx.writeBuffer()), {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    disposition: `attachment; filename="${filename}"`,
  });
}
