import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

// ─── Enum mirrors ────────────────────────────────────────────────────────────
export enum LoaiDeNghiDieuChinhDto {
  DOI_DE_TAI = 'DOI_DE_TAI',
  DOI_GVHD = 'DOI_GVHD',
  GIA_HAN = 'GIA_HAN',
}

export enum TrangThaiDeNghiDto {
  CHO_DUYET = 'CHO_DUYET',
  DA_DUYET = 'DA_DUYET',
  TU_CHOI = 'TU_CHOI',
}

export enum VaiTroMoiDto {
  HUONG_DAN_CHINH = 'HUONG_DAN_CHINH',
  DONG_HUONG_DAN = 'DONG_HUONG_DAN',
}

// ─── [S5-20] Nộp đơn đề nghị thay đổi ─────────────────────────────────────────
export class CreateChangeRequestDto {
  @ApiProperty({ description: 'ID Nghiên cứu sinh (UUID)', example: 'a0000000-0000-0000-0000-000000000001' })
  @IsUUID('4', { message: 'ncsId phải là UUID v4 hợp lệ' })
  @IsNotEmpty({ message: 'ncsId không được để trống' })
  ncsId: string;

  @ApiProperty({
    description: 'Loại đề nghị điều chỉnh',
    enum: LoaiDeNghiDieuChinhDto,
    example: LoaiDeNghiDieuChinhDto.DOI_DE_TAI,
  })
  @IsEnum(LoaiDeNghiDieuChinhDto, { message: 'loai phải là DOI_DE_TAI, DOI_GVHD hoặc GIA_HAN' })
  @IsNotEmpty({ message: 'loai không được để trống' })
  loai: LoaiDeNghiDieuChinhDto;

  @ApiProperty({ description: 'Lý do xin thay đổi', example: 'Cập nhật hướng tiếp cận mới và mở rộng dữ liệu nghiên cứu' })
  @IsString({ message: 'lyDo phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'lyDo không được để trống' })
  lyDo: string;

  // Dành cho DOI_DE_TAI
  @ApiPropertyOptional({ description: 'Tên đề tài mới (bắt buộc khi loai = DOI_DE_TAI)', example: 'Nghiên cứu ứng dụng Deep Learning trong xử lý ảnh y tế' })
  @IsOptional()
  @IsString({ message: 'tenDeTaiMoi phải là chuỗi ký tự' })
  tenDeTaiMoi?: string;

  // Dành cho DOI_GVHD
  @ApiPropertyOptional({ description: 'ID bản ghi phân công cũ cần thay đổi (bắt buộc khi loai = DOI_GVHD)' })
  @IsOptional()
  @IsUUID('4', { message: 'phanCongCuId phải là UUID v4 hợp lệ' })
  phanCongCuId?: string;

  @ApiPropertyOptional({ description: 'ID Giảng viên hướng dẫn mới (bắt buộc khi loai = DOI_GVHD)' })
  @IsOptional()
  @IsUUID('4', { message: 'gvhdMoiId phải là UUID v4 hợp lệ' })
  gvhdMoiId?: string;

  @ApiPropertyOptional({ description: 'Vai trò mới của GVHD (HUONG_DAN_CHINH hoặc DONG_HUONG_DAN)', enum: VaiTroMoiDto })
  @IsOptional()
  @IsEnum(VaiTroMoiDto, { message: 'vaiTroMoi không hợp lệ' })
  vaiTroMoi?: VaiTroMoiDto;

  // Dành cho GIA_HAN
  @ApiPropertyOptional({ description: 'Hạn học tập mới đề nghị (YYYY-MM-DD, bắt buộc khi loai = GIA_HAN)', example: '2027-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'hanMoiDeNghi phải theo định dạng YYYY-MM-DD' })
  hanMoiDeNghi?: string;
}

// ─── Query danh sách đơn đề nghị ─────────────────────────────────────────────
export class QueryChangeRequestsDto {
  @ApiPropertyOptional({ description: 'Lọc theo ID NCS (UUID)' })
  @IsOptional()
  @IsUUID('4')
  ncsId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo loại đơn', enum: LoaiDeNghiDieuChinhDto })
  @IsOptional()
  @IsEnum(LoaiDeNghiDieuChinhDto)
  loai?: LoaiDeNghiDieuChinhDto;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái đơn', enum: TrangThaiDeNghiDto })
  @IsOptional()
  @IsEnum(TrangThaiDeNghiDto)
  trangThai?: TrangThaiDeNghiDto;

  @ApiPropertyOptional({ description: 'Số bản ghi trên trang', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Trang cần xem (1-indexed)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}

// ─── Phê duyệt đơn đề nghị ────────────────────────────────────────────────────
export class ApproveChangeRequestDto {
  @ApiProperty({ description: 'Số quyết định pháp lý ban hành kèm phê duyệt', example: '123/QĐ-ĐHAG' })
  @IsString({ message: 'soQuyetDinh phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'soQuyetDinh không được để trống' })
  soQuyetDinh: string;

  @ApiProperty({ description: 'Ngày ký quyết định (YYYY-MM-DD)', example: '2026-10-15' })
  @IsDateString({}, { message: 'ngayQuyetDinh phải theo định dạng YYYY-MM-DD' })
  @IsNotEmpty({ message: 'ngayQuyetDinh không được để trống' })
  ngayQuyetDinh: string;

  @ApiPropertyOptional({ description: 'ID file đính kèm quyết định (từ document-service)' })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú phê duyệt', example: 'Đã thông qua Hội đồng Khoa học Đào tạo' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

// ─── Từ chối đơn đề nghị ─────────────────────────────────────────────────────
export class RejectChangeRequestDto {
  @ApiProperty({ description: 'Lý do từ chối bắt buộc', example: 'Hồ sơ chưa đủ minh chứng bài báo hoặc GVHD mới đã hết hạn ngạch' })
  @IsString({ message: 'lyDoTuChoi phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'lyDoTuChoi không được để trống khi từ chối đơn' })
  lyDoTuChoi!: string;
}

// ─── [S5-22] Cấu trúc chuẩn của Event TCP phát đi ────────────────────────────
export interface PhdEventPayload<T = any> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId: string;
  ncsId: string;
  correlationId?: string;
  data: T;
}
