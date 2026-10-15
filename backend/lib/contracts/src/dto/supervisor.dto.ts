import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

// ─── Enum mirrors ────────────────────────────────────────────────────────────
export enum HocHamHocViDto {
  GIAO_SU = 'GIAO_SU',
  PHO_GIAO_SU = 'PHO_GIAO_SU',
  TIEN_SI_KHOA_HOC = 'TIEN_SI_KHOA_HOC',
  TIEN_SI = 'TIEN_SI',
}

export enum VaiTroHuongDanDto {
  HUONG_DAN_CHINH = 'HUONG_DAN_CHINH',
  DONG_HUONG_DAN = 'DONG_HUONG_DAN',
}

export enum GioiTinhDto {
  NAM = 'NAM',
  NU = 'NU',
}

// ─── [S5-13] CRUD Lý lịch khoa học GVHD ─────────────────────────────────────

/**
 * DTO tạo mới hồ sơ giảng viên hướng dẫn.
 */
export class CreateSupervisorDto {
  @ApiPropertyOptional({ description: 'Mã giảng viên (SHCC), null nếu ngoài trường', example: 'GV0123' })
  @IsOptional()
  @IsString()
  maGv?: string;

  @ApiProperty({ description: 'Họ và tên giảng viên', example: 'GS.TS. Nguyễn Văn An' })
  @IsString()
  @IsNotEmpty()
  hoTen: string;

  @ApiPropertyOptional({ description: 'Giới tính', enum: GioiTinhDto })
  @IsOptional()
  @IsEnum(GioiTinhDto)
  gioiTinh?: GioiTinhDto;

  @ApiPropertyOptional({ description: 'Ngày sinh (YYYY-MM-DD)', example: '1970-05-15' })
  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ', example: 'nguyenvanan@agu.edu.vn' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Học hàm / học vị', enum: HocHamHocViDto, example: HocHamHocViDto.PHO_GIAO_SU })
  @IsEnum(HocHamHocViDto)
  hocHamHocVi: HocHamHocViDto;

  @ApiPropertyOptional({ description: 'Chuyên ngành đào tạo tiến sĩ', example: 'Khoa học cây trồng' })
  @IsOptional()
  @IsString()
  chuyenNganh?: string;

  @ApiPropertyOptional({ description: 'Nước cấp bằng tiến sĩ', example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  quocGiaTotNghiep?: string;

  @ApiProperty({ description: 'Cơ quan / trường công tác', example: 'Trường Đại học An Giang' })
  @IsString()
  @IsNotEmpty()
  coQuanCongTac: string;

  @ApiPropertyOptional({ description: 'ID đơn vị nội bộ (don_vi.id)', example: 'uuid-don-vi-123' })
  @IsOptional()
  @IsUUID()
  donViId?: string;

  @ApiPropertyOptional({ description: 'Bộ môn công tác', example: 'Bộ môn Cây lương thực' })
  @IsOptional()
  @IsString()
  boMon?: string;

  @ApiPropertyOptional({ description: 'Khoa công tác', example: 'Khoa Nông nghiệp - TNTN' })
  @IsOptional()
  @IsString()
  khoa?: string;

  @ApiPropertyOptional({
    description: 'Lịch sử công bố khoa học 5 năm gần nhất (JSON array). Mỗi phần tử là {title, journal, year, doi?}',
    example: [{ title: 'Rice yield model', journal: 'J. Agro', year: 2024 }],
  })
  @IsOptional()
  lichSuCongBo5Nam?: any[];

  @ApiPropertyOptional({
    description: 'Định mức tối đa NCS được hướng dẫn. Nếu không điền, hệ thống tự tính theo học hàm: GS=7, PGS=5, TS=3',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  maxNcsChoPhep?: number;

  @ApiPropertyOptional({ description: 'ID tài khoản đăng nhập (nếu GVHD có account)', example: 'user-uuid-456' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

/**
 * DTO cập nhật hồ sơ giảng viên hướng dẫn (tất cả trường đều optional).
 */
export class UpdateSupervisorDto {
  @ApiPropertyOptional({ description: 'Họ và tên giảng viên' })
  @IsOptional()
  @IsString()
  hoTen?: string;

  @ApiPropertyOptional({ description: 'Giới tính', enum: GioiTinhDto })
  @IsOptional()
  @IsEnum(GioiTinhDto)
  gioiTinh?: GioiTinhDto;

  @ApiPropertyOptional({ description: 'Ngày sinh (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Học hàm / học vị', enum: HocHamHocViDto })
  @IsOptional()
  @IsEnum(HocHamHocViDto)
  hocHamHocVi?: HocHamHocViDto;

  @ApiPropertyOptional({ description: 'Chuyên ngành đào tạo tiến sĩ' })
  @IsOptional()
  @IsString()
  chuyenNganh?: string;

  @ApiPropertyOptional({ description: 'Nước cấp bằng tiến sĩ' })
  @IsOptional()
  @IsString()
  quocGiaTotNghiep?: string;

  @ApiPropertyOptional({ description: 'Cơ quan / trường công tác' })
  @IsOptional()
  @IsString()
  coQuanCongTac?: string;

  @ApiPropertyOptional({ description: 'ID đơn vị nội bộ' })
  @IsOptional()
  @IsUUID()
  donViId?: string;

  @ApiPropertyOptional({ description: 'Bộ môn công tác' })
  @IsOptional()
  @IsString()
  boMon?: string;

  @ApiPropertyOptional({ description: 'Khoa công tác' })
  @IsOptional()
  @IsString()
  khoa?: string;

  @ApiPropertyOptional({ description: 'Lịch sử công bố khoa học 5 năm gần nhất (JSON array)' })
  @IsOptional()
  lichSuCongBo5Nam?: any[];

  @ApiPropertyOptional({ description: 'Định mức tối đa NCS' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  maxNcsChoPhep?: number;
}

/**
 * DTO lọc danh sách giảng viên hướng dẫn.
 */
export class QuerySupervisorsDto {
  @ApiPropertyOptional({ description: 'Tìm kiếm theo họ tên hoặc mã GV', example: 'Nguyễn' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo học hàm/học vị', enum: HocHamHocViDto })
  @IsOptional()
  @IsEnum(HocHamHocViDto)
  hocHamHocVi?: HocHamHocViDto;

  @ApiPropertyOptional({ description: 'Lọc theo ID đơn vị' })
  @IsOptional()
  @IsUUID()
  donViId?: string;

  @ApiPropertyOptional({ description: 'Chỉ lấy GVHD còn chỗ trống (soNcsDangHuongDan < maxNcsChoPhep)', example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  coChoTrong?: boolean;
}

// ─── [S5-15] Phân công GVHD ──────────────────────────────────────────────────

/**
 * DTO phân công GVHD cho NCS (Transaction + Quota Check BR-09).
 */
export class AssignSupervisorDto {
  @ApiProperty({ description: 'ID NCS cần phân công', example: 'ncs-uuid-abc' })
  @IsUUID()
  ncsId: string;

  @ApiProperty({ description: 'ID giảng viên hướng dẫn chính', example: 'gvhd-uuid-xyz' })
  @IsUUID()
  gvhdId: string;

  @ApiProperty({ description: 'Vai trò hướng dẫn', enum: VaiTroHuongDanDto, example: VaiTroHuongDanDto.HUONG_DAN_CHINH })
  @IsEnum(VaiTroHuongDanDto)
  vaiTro: VaiTroHuongDanDto;

  @ApiProperty({ description: 'Số quyết định phân công GVHD', example: '100/QĐ-ĐHAG' })
  @IsString()
  @IsNotEmpty()
  soQuyetDinh: string;

  @ApiProperty({ description: 'Ngày ký quyết định (YYYY-MM-DD)', example: '2026-10-15' })
  @IsDateString()
  ngayQuyetDinh: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu hướng dẫn (YYYY-MM-DD)', example: '2026-10-20' })
  @IsOptional()
  @IsDateString()
  ngayBatDau?: string;

  @ApiPropertyOptional({ description: 'Ghi chú quyết định' })
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ description: 'ID file scan quyết định (document-service)' })
  @IsOptional()
  @IsString()
  fileId?: string;
}

/**
 * DTO thay đổi GVHD (deactivate phân công cũ, tạo phân công mới) - BR-04.
 */
export class ChangeSupervisorDto {
  @ApiProperty({ description: 'ID NCS cần thay đổi GVHD', example: 'ncs-uuid-abc' })
  @IsUUID()
  ncsId: string;

  @ApiProperty({ description: 'ID phân công hiện tại cần vô hiệu hóa', example: 'phan-cong-uuid-old' })
  @IsUUID()
  phanCongCuId: string;

  @ApiProperty({ description: 'ID GVHD mới', example: 'gvhd-uuid-new' })
  @IsUUID()
  gvhdMoiId: string;

  @ApiProperty({ description: 'Vai trò hướng dẫn mới', enum: VaiTroHuongDanDto })
  @IsEnum(VaiTroHuongDanDto)
  vaiTro: VaiTroHuongDanDto;

  @ApiProperty({ description: 'Lý do thay đổi GVHD', example: 'GVHD cũ nghỉ hưu' })
  @IsString()
  @IsNotEmpty()
  lyDo: string;

  @ApiProperty({ description: 'Số quyết định thay đổi GVHD', example: '200/QĐ-ĐHAG' })
  @IsString()
  @IsNotEmpty()
  soQuyetDinh: string;

  @ApiProperty({ description: 'Ngày ký quyết định (YYYY-MM-DD)', example: '2026-10-20' })
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
 * DTO lọc danh sách phân công hướng dẫn.
 */
export class QueryAssignmentsDto {
  @ApiPropertyOptional({ description: 'Lọc theo ID NCS' })
  @IsOptional()
  @IsUUID()
  ncsId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo ID GVHD' })
  @IsOptional()
  @IsUUID()
  gvhdId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái (DANG_HIEU_LUC / DEACTIVATE)', example: 'DANG_HIEU_LUC' })
  @IsOptional()
  @IsString()
  trangThai?: string;

  @ApiPropertyOptional({ description: 'Lọc theo vai trò hướng dẫn', enum: VaiTroHuongDanDto })
  @IsOptional()
  @IsEnum(VaiTroHuongDanDto)
  vaiTro?: VaiTroHuongDanDto;
}
