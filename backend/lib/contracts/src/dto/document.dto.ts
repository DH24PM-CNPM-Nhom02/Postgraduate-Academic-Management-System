import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export const DOCUMENT_TYPES = ['MINH_CHUNG_MOC', 'QUYET_DINH', 'KHAC'] as const;
export type DocumentTypeValue = (typeof DOCUMENT_TYPES)[number];

// Tối đa 15MB mỗi file PDF
export const MAX_PDF_SIZE = 15 * 1024 * 1024;

// Người đang gọi API. Gateway tạo ra từ token, KHÔNG lấy từ client.
// - laNhanVien: Giáo vụ hoặc Admin (xem được mọi tài liệu)
// - ncsId: id hồ sơ NCS của người gọi (chỉ có khi là NCS)
export type NguoiDungTaiLieu = {
  id: string;
  laNhanVien: boolean;
  ncsId?: string;
};

// Các trường kèm theo file khi upload (form-data)
export class UploadDocumentDto {
  @IsIn(DOCUMENT_TYPES)
  documentType: DocumentTypeValue;

  // Chỉ Giáo vụ cần gửi. Với NCS, hệ thống tự lấy theo tài khoản đăng nhập
  @IsOptional()
  @IsUUID()
  ncsId?: string;

  // Tài liệu này thuộc về thực thể nào (vd MINH_CHUNG_MOC + id minh chứng)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  refType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  refId?: string;
}