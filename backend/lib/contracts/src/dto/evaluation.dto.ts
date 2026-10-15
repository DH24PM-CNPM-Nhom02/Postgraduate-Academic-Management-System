import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * DTO đại diện cho một thành viên hội đồng / người chấm được phân công.
 */
export class AssignEvaluatorItemDto {
  @ApiProperty({ description: 'Họ và tên người chấm / thành viên hội đồng', example: 'TS. Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  tenNguoiCham: string;

  @ApiPropertyOptional({ description: 'Đơn vị công tác', example: 'Khoa Công nghệ thông tin' })
  @IsOptional()
  @IsString()
  donViNguoiCham?: string;

  @ApiPropertyOptional({ description: 'Vai trò trong hội đồng', example: 'TRUONG_TIEU_BAN' })
  @IsOptional()
  @IsString()
  vaiTro?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ', example: 'nguyenvana@agu.edu.vn' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

/**
 * DTO tạo mới một đợt chấm điểm (evaluation session).
 */
export class CreateEvaluationSessionDto {
  @ApiProperty({ description: 'ID của NCS', example: 'uuid-ncs-123' })
  @IsString()
  @IsNotEmpty()
  ncsId: string;

  @ApiProperty({ description: 'ID thứ tự mốc tiến trình (ví dụ: 2, 4, 5)', example: 2 })
  @IsInt()
  @Min(1)
  @Max(9)
  @Type(() => Number)
  mocId: number;

  @ApiPropertyOptional({ description: 'Lần nộp / đợt nộp', example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  lanNop?: number;

  @ApiPropertyOptional({ description: 'ID tệp tài liệu / minh chứng liên quan', example: 'doc-file-123' })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú bổ sung', example: 'Đợt chấm tiểu luận tổng quan đợt 1' })
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ description: 'Số quyết định thành lập hội đồng/tiểu ban', example: '123/QĐ-ĐHAG' })
  @IsOptional()
  @IsString()
  soQuyetDinh?: string;

  @ApiPropertyOptional({ description: 'Ngày ban hành quyết định (YYYY-MM-DD)', example: '2026-10-15' })
  @IsOptional()
  @IsDateString()
  ngayQuyetDinh?: string;

  @ApiPropertyOptional({ description: 'Danh sách thành viên hội đồng được phân công', type: [AssignEvaluatorItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AssignEvaluatorItemDto)
  evaluators?: AssignEvaluatorItemDto[];
}

/**
 * DTO phân công hội đồng chấm cho đợt chấm.
 */
export class AssignEvaluatorsDto {
  @ApiProperty({ description: 'Danh sách thành viên hội đồng chấm', type: [AssignEvaluatorItemDto] })
  @ValidateNested({ each: true })
  @Type(() => AssignEvaluatorItemDto)
  @ArrayMinSize(1)
  evaluators: AssignEvaluatorItemDto[];

  @ApiPropertyOptional({ description: 'Số quyết định thành lập hội đồng', example: '456/QĐ-ĐHAG' })
  @IsOptional()
  @IsString()
  soQuyetDinh?: string;

  @ApiPropertyOptional({ description: 'Ngày ban hành quyết định (YYYY-MM-DD)', example: '2026-10-15' })
  @IsOptional()
  @IsDateString()
  ngayQuyetDinh?: string;

  @ApiPropertyOptional({ description: 'Ghi chú hội đồng', example: 'Hội đồng chuyên đề 1 gồm 3 thành viên' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

/**
 * DTO lập phiếu nhận xét online (hỗ trợ lưu nháp hoặc submit).
 */
export class CreateEvaluationFormDto {
  @ApiProperty({ description: 'Tên người chấm', example: 'PGS.TS. Trần Thị B' })
  @IsString()
  @IsNotEmpty()
  tenNguoiCham: string;

  @ApiPropertyOptional({ description: 'Đơn vị người chấm', example: 'Trường Đại học An Giang' })
  @IsOptional()
  @IsString()
  donViNguoiCham?: string;

  @ApiProperty({
    description: 'Điểm số thang điểm 0.0 - 10.0 (tối đa 1 chữ số thập phân)',
    example: 8.5,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber({}, { message: 'Điểm phải là số' })
  @Min(0, { message: 'Điểm không được nhỏ hơn 0.0' })
  @Max(10, { message: 'Điểm không được lớn hơn 10.0' })
  @Type(() => Number)
  diem: number;

  @ApiPropertyOptional({ description: 'Nhận xét chung', example: 'NCS nắm vững kiến thức chuyên ngành.' })
  @IsOptional()
  @IsString()
  nhanXet?: string;

  @ApiPropertyOptional({ description: 'Đánh giá ưu điểm', example: 'Phương pháp nghiên cứu rõ ràng, kết quả tin cậy.' })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiPropertyOptional({ description: 'Đánh giá hạn chế / nhược điểm', example: 'Cần bổ sung thêm tài liệu tham khảo quốc tế.' })
  @IsOptional()
  @IsString()
  weaknesses?: string;

  @ApiPropertyOptional({
    description: 'Cờ lưu nháp (true = lưu nháp, false = nộp chính thức). Mặc định false.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}

/**
 * DTO chỉnh sửa phiếu nhận xét (chỉ áp dụng khi phiếu còn ở trạng thái nháp).
 */
export class UpdateEvaluationFormDto {
  @ApiPropertyOptional({ description: 'Tên người chấm', example: 'PGS.TS. Trần Thị B' })
  @IsOptional()
  @IsString()
  tenNguoiCham?: string;

  @ApiPropertyOptional({ description: 'Đơn vị người chấm', example: 'Trường Đại học An Giang' })
  @IsOptional()
  @IsString()
  donViNguoiCham?: string;

  @ApiPropertyOptional({
    description: 'Điểm số thang điểm 0.0 - 10.0 (tối đa 1 chữ số thập phân)',
    example: 9.0,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Điểm phải là số' })
  @Min(0, { message: 'Điểm không được nhỏ hơn 0.0' })
  @Max(10, { message: 'Điểm không được lớn hơn 10.0' })
  @Type(() => Number)
  diem?: number;

  @ApiPropertyOptional({ description: 'Nhận xét chung' })
  @IsOptional()
  @IsString()
  nhanXet?: string;

  @ApiPropertyOptional({ description: 'Đánh giá ưu điểm' })
  @IsOptional()
  @IsString()
  strengths?: string;

  @ApiPropertyOptional({ description: 'Đánh giá hạn chế / nhược điểm' })
  @IsOptional()
  @IsString()
  weaknesses?: string;

  @ApiPropertyOptional({ description: 'Cờ lưu nháp (chuyển sang nộp chính thức nếu set false)', example: false })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}

/**
 * DTO duyệt kết quả đợt chấm (Approve / Finalize).
 */
export class ApproveEvaluationDto {
  @ApiPropertyOptional({ description: 'Ghi chú phê duyệt', example: 'Đạt yêu cầu chuyên đề 1' })
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ description: 'Số quyết định công nhận kết quả (nếu có)', example: '789/QĐ-ĐHAG' })
  @IsOptional()
  @IsString()
  soQuyetDinh?: string;

  @ApiPropertyOptional({ description: 'Ngày quyết định công nhận (YYYY-MM-DD)', example: '2026-10-20' })
  @IsOptional()
  @IsDateString()
  ngayQuyetDinh?: string;
}

/**
 * DTO lọc danh sách đợt chấm.
 */
export class QueryEvaluationSessionsDto {
  @ApiPropertyOptional({ description: 'Lọc theo ID NCS', example: 'uuid-ncs-123' })
  @IsOptional()
  @IsString()
  ncsId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID mốc tiến trình', example: 2 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  mocId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái (PENDING_REVIEW, PASSED, REJECTED)', example: 'PENDING_REVIEW' })
  @IsOptional()
  @IsString()
  trangThai?: string;
}
