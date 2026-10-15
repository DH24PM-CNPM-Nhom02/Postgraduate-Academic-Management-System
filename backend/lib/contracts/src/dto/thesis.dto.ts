import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

// ─── [S5-18] Quản lý Đề tài luận án ─────────────────────────────────────────

/**
 * DTO tạo đề tài mới cho NCS (kèm số quyết định giao đề tài).
 */
export class CreateThesisDto {
  @ApiProperty({ description: 'ID NCS chủ đề tài', example: 'ncs-uuid-abc' })
  @IsUUID()
  ncsId: string;

  @ApiProperty({ description: 'Tên đề tài luận án', example: 'Nghiên cứu ảnh hưởng của phân bón vi sinh đến năng suất lúa' })
  @IsString()
  @IsNotEmpty()
  tenDeTai: string;

  @ApiProperty({ description: 'Số quyết định giao đề tài', example: '150/QĐ-ĐHAG' })
  @IsString()
  @IsNotEmpty()
  soQuyetDinh: string;

  @ApiProperty({ description: 'Ngày ký quyết định giao đề tài (YYYY-MM-DD)', example: '2026-10-15' })
  @IsDateString()
  ngayQuyetDinh: string;

  @ApiPropertyOptional({ description: 'ID file scan quyết định (document-service)' })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú bổ sung' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

/**
 * DTO cập nhật tên đề tài (thay thế đề tài cũ - BR-04: set DA_THAY_THE, tạo đề tài mới).
 */
export class UpdateThesisDto {
  @ApiProperty({ description: 'Tên đề tài mới sau khi điều chỉnh', example: 'Nghiên cứu ảnh hưởng của phân bón vi sinh đến năng suất lúa nếp' })
  @IsString()
  @IsNotEmpty()
  tenDeTaiMoi: string;

  @ApiProperty({ description: 'Lý do thay đổi tên đề tài', example: 'Bổ sung phạm vi nghiên cứu theo góp ý của Hội đồng' })
  @IsString()
  @IsNotEmpty()
  lyDo: string;

  @ApiProperty({ description: 'Số quyết định điều chỉnh đề tài', example: '250/QĐ-ĐHAG' })
  @IsString()
  @IsNotEmpty()
  soQuyetDinh: string;

  @ApiProperty({ description: 'Ngày ký quyết định điều chỉnh (YYYY-MM-DD)', example: '2026-11-01' })
  @IsDateString()
  ngayQuyetDinh: string;

  @ApiPropertyOptional({ description: 'ID file scan quyết định' })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

/**
 * DTO lọc danh sách đề tài.
 */
export class QueryThesisDto {
  @ApiPropertyOptional({ description: 'Lọc theo ID NCS', example: 'ncs-uuid-abc' })
  @IsOptional()
  @IsUUID()
  ncsId?: string;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên đề tài', example: 'lúa' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái (HIEU_LUC / DA_THAY_THE)', example: 'HIEU_LUC' })
  @IsOptional()
  @IsString()
  trangThai?: string;
}
