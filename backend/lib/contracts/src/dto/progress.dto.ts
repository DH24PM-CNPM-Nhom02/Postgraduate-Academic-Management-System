import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

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