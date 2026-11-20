import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto.js';

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

}

// export class DeactivateAssignmentDto {
//   @IsOptional()
//   @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayKetThuc phải có dạng YYYY-MM-DD' })
//   ngayKetThuc?: string;
// }

export class DeactivateAssignmentDto {
  @IsString()
  @MinLength(1)
  lyDo!: string;

  /** Required when deactivating the current primary supervisor unless an active co-supervisor is promoted. */
  @IsOptional()
  @IsUUID()
  gvhdChinhMoiId?: string;

  /** Required when assigning a new primary supervisor; ignored when promoting the active co-supervisor. */
  @IsOptional()
  @IsUUID()
  quyetDinhMoiId?: string;
}

export class ListAssignmentQueryDto extends PaginationQueryDto {
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
