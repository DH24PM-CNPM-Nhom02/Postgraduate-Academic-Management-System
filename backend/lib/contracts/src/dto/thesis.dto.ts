import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto.js';

export class AssignThesisDto {
  @IsUUID()
  quyetDinhId!: string;

  @IsUUID()
  ncsId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  tenDeTai!: string;
}

export class DeactivateThesisAssignmentDto {
  @IsString()
  @MinLength(1)
  lyDo!: string;
}

export class ThesisListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  khoaHocId?: string;

  @IsOptional()
  @IsIn(['HIEU_LUC', 'DA_THAY_THE', 'DA_HUY', 'CHUA_GIAO'])
  trangThai?: string;

  @IsOptional()
  @IsUUID()
  gvhdId?: string;
}
