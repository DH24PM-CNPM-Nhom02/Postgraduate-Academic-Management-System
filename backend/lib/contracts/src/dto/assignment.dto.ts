import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export const VAI_TRO_HUONG_DAN = ['HUONG_DAN_CHINH', 'DONG_HUONG_DAN'] as const;
export type VaiTroHuongDanValue = (typeof VAI_TRO_HUONG_DAN)[number];

export class CreateAssignmentDto {
  @IsUUID()
  ncsId!: string;

  @IsUUID()
  gvhdId!: string;

  @IsIn(VAI_TRO_HUONG_DAN)
  vaiTro!: VaiTroHuongDanValue;

  /// Quyết định phân công GVHD đã tồn tại (loại PHAN_CONG_GVHD, hiệu lực)
  @IsUUID()
  quyetDinhId!: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayBatDau phải có dạng YYYY-MM-DD' })
  ngayBatDau?: string;
}

export class DeactivateAssignmentDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayKetThuc phải có dạng YYYY-MM-DD' })
  ngayKetThuc?: string;
}

export class ListAssignmentQueryDto {
  @IsOptional()
  @IsUUID()
  ncsId?: string;

  @IsOptional()
  @IsUUID()
  gvhdId?: string;

  @IsOptional()
  @IsString()
  trangThai?: string;
}
