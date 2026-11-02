import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID, Length, Matches, MaxLength, ValidateNested } from "class-validator";

export class XacNhanNgoaiNguDto {
  @IsBoolean() 
  dat!: boolean;

  @IsOptional() 
  @IsString() 
  @MaxLength(100)
  chuanDauRa?: string;

  @IsOptional() 
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayCongNhan phải có dạng YYYY-MM-DD' }) 
  ngayCongNhanNgoaiNgu?: string;

  @IsOptional() 
  @IsString()
  @MaxLength(500) 
  ghiChu?: string;

  @IsOptional() 
  @IsUUID() 
  fileId?: string;   
}

export class XacNhanCongNoDto {
  @IsBoolean() 
  khongConCongNo!: boolean;

  @IsOptional() 
  @IsString() 
  ghiChu?: string;
  
  @IsOptional() 
  @IsUUID() 
  fileId?: string;   
}

export class ListXetTotNghiepQueryDto {
  // 'true': chỉ NCS đủ điều kiện, 'false': chỉ NCS còn thiếu, bỏ trống: cả hai
  @IsOptional()
  @IsIn(['true','false'])
  duDieuKien?: 'true'|'false';
}

// Giáo vụ xác nhận tốt nghiệp theo quyết định công nhận tốt nghiệp của trường
export class XacNhanTotNghiepItemDto {
  // Một dòng xác nhận tốt nghiệp: NCS và quyết định công nhận tốt nghiệp tương ứng
  @IsUUID()
  ncsId!: string;

  // id quyết định loại CONG_NHAN_TOT_NGHIEP của chính NCS này (tạo trước bằng API quyết định)
  @IsUUID()
  quyetDinhId!: string;

  // Ngày hiệu lực công nhận tốt nghiệp theo quyết định (YYYY-MM-DD), bỏ trống thì lấy theo ngayQuyetDinh
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'ngayTotNghiep phải có dạng YYYY-MM-DD' })
  ngayTotNghiep?: string;
}

// Giáo vụ xác nhận tốt nghiệp: chọn NCS nào thì chọn quyết định tương ứng
export class XacNhanTotNghiepDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => XacNhanTotNghiepItemDto)
  danhSach!: XacNhanTotNghiepItemDto[];
 }