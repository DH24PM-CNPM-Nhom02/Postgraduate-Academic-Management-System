import { IsArray, IsIn, IsOptional, IsString, IsUUID, Length, Matches, MaxLength } from 'class-validator';

export const LOAI_QUYET_DINH = [
  'GIAO_DE_TAI', 'PHAN_CONG_GVHD', 'THANH_LAP_TIEU_BAN', 'CAN_CU_DUYET_MOC',
  'CONG_NHAN_TOT_NGHIEP', 'GIA_HAN', 'BAO_LUU', 'NGUNG_HOC', 'BUOC_THOI_HOC', 'HOC_TIEP', 'KHAC',
] as const;
export const TRANG_THAI_QUYET_DINH = ['HIEU_LUC', 'DEACTIVATE'] as const;

export type LoaiQuyetDinhValue = (typeof LOAI_QUYET_DINH)[number];
export type TrangThaiQuyetDinhValue = (typeof TRANG_THAI_QUYET_DINH)[number];

export class CreateDecisionDto {
  @IsIn(LOAI_QUYET_DINH)
  loai!: LoaiQuyetDinhValue;

  @IsString()
  @Length(1, 50)
  soQuyetDinh!: string;

  // Dạng YYYY-MM-DD
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayQuyetDinh phải có dạng YYYY-MM-DD' })
  ngayQuyetDinh!: string;

  // Quyết định áp dụng riêng cho một NCS thì điền, quyết định chung thì bỏ trống
  @IsOptional()
  @IsArray()
  @IsUUID('all', {each:true})
  ncsIds?: string[];

  // id file scan đã upload với documentType = QUYET_DINH
  @IsOptional()
  @IsUUID()
  fileId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  ghiChu?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'hanMoi phải có dạng YYYY-MM-DD' })
  hanMoi?: string;
}

export class ListDecisionQueryDto {
  @IsOptional()
  @IsUUID()
  ncsId?: string;

  @IsOptional()
  @IsString()
  soQuyetDinh?: string;

  @IsOptional()
  @IsIn(LOAI_QUYET_DINH)
  loai?: LoaiQuyetDinhValue;

  @IsOptional()
  @IsIn(TRANG_THAI_QUYET_DINH)
  trangThai?: TrangThaiQuyetDinhValue;
}

export class DeactivateDecisionDto {
  @IsString()
  @Length(1, 500)
  lyDo!: string;
}