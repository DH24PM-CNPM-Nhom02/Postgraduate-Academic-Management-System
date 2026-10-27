import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';

// Body khi NCS nộp minh chứng cho một mốc (số thứ tự mốc nằm trên URL)
export class SubmitMilestoneDto {
  // id file đã upload qua POST /documents/upload (documentType = MINH_CHUNG_MOC)
  @IsUUID()
  fileId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ghiChu?: string;
}

export class ApproveMilestoneDto {
  // Quyết định CAN_CU_DUYET_MOC làm căn cứ pháp lý (tạo ở bước 2c)
  @IsUUID()
  quyetDinhId!: string;
}

export class RejectMilestoneDto {
  @IsString()
  @Length(1, 1000)
  lyDo!: string;
}

export class CreateEvaluationDto {
  @IsString()
  @Length(1, 150)
  tenNguoiCham!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  donViNguoiCham?: string;

  // Thang 10, tối đa 1 chữ số thập phân
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  diem!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  nhanXet?: string;

  @IsOptional()
  @IsBoolean()
  xacNhanTrung?: boolean;
}