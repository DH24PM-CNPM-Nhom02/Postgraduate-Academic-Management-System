import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayMaxSize, IsDateString, IsEmail, IsIn, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { GIOI_TINH } from './ncs.dto.js';

// Học hàm/học vị theo enum trong schema (bảng giang_vien_huong_dan)
export const HOC_HAM_HOC_VI = ['GIAO_SU', 'PHO_GIAO_SU', 'TIEN_SI_KHOA_HOC', 'TIEN_SI'] as const;

// Mã số công chức của trường: D + 6 số + dấu chấm + 6 số (vd D4300276.010803)
export const MA_GV_PATTERN = /^D\d{6}\.\d{6}$/;

export class CreateGvhdItemDto {
  @IsString()
  @Length(1, 20)
  ma_gv: string;

  @IsString()
  @Length(1, 100)
  hoTen: string;

  @IsOptional()
  @IsDateString()
  ngaySinh?: string;


  @IsOptional()
  @IsIn(GIOI_TINH)
  gioiTinh?: (typeof GIOI_TINH)[number];

  @IsOptional()
  @IsEmail()
  email?: string;

  // Phải khớp giá trị enum trong schema, đúng mục đích để tính định mức (BR-09)
  @IsIn(HOC_HAM_HOC_VI)
  hocHamHocVi: (typeof HOC_HAM_HOC_VI)[number];


  // Chuyên ngành đào tạo tiến sĩ (t_cmdtao) — text tự do, không có mã
  @IsOptional()
  @IsString()
  @Length(1, 255)
  chuyenNganh?: string;

  // Nước cấp bằng tiến sĩ (ten_qg)
  @IsOptional()
  @IsString()
  @Length(1, 50)
  quocGiaTotNghiep?: string;

  // Mã đơn vị trong danh mục don_vi (dvi.ten) nếu có thể khớp
  @IsOptional()
  @IsString()
  @Length(1, 255)
  donVi?: string;

  // Chỉ dùng khi Đơn vị trống: ghi thẳng tên đơn vị chưa có trong danh mục.
  // Có Đơn vị thì trường này bị bỏ qua (BR dùng donViId để tính định mức theo khoa).
  @IsOptional()
  @IsString()
  @Length(1, 255)
  donViCapTren?: string;
}

export class CreateGvhdBatchDto {
  @ValidateNested({ each: true })
  @Type(() => CreateGvhdItemDto)
  @ArrayMinSize(1) @ArrayMaxSize(200)
  items: CreateGvhdItemDto[];
}

export class UpdateGvhdStatusDto {
  @IsIn([true, false])
  trangThai!: boolean;
}

export class UpdateGvhdDto {

  @IsString()
  @Length(1, 100)
  @IsOptional()
  hoTen?: string;

  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @IsOptional()
  @IsIn(GIOI_TINH)
  gioiTinh?: (typeof GIOI_TINH)[number];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(HOC_HAM_HOC_VI)
  hocHamHocVi?: (typeof HOC_HAM_HOC_VI)[number];

  @IsOptional()
  @IsString()
  @Length(1, 255)
  chuyenNganh?: string;

  // ID đơn vị được chọn từ danh sách đơn vị
  @IsOptional()
  @IsString()
  @Length(1, 36)
  donVi?: string;

  // Nước cấp bằng tiến sĩ (ten_qg)
  @IsOptional()
  @IsString()
  @Length(1, 50)
  quocGiaTotNghiep?: string;
}



// Một dòng đọc từ file Excel (mọi ô đều là chuỗi; `row` là số dòng trong file để báo lỗi)
export type ImportGvhdRow = {
  row: number;
  maGv: string;             // shcc, vd D4300276.010803; MSHV với GVHD ngoài trường
  hoTen: string;
  ngaySinh: string;        // YYYY-MM-DD
  gioiTinh: string;        // NAM | NU
  email: string;
  hocHamHocVi: string;     // GIAO_SU | PHO_GIAO_SU | TIEN_SI_KHOA_HOC | TIEN_SI
  chuyenNganh: string;     // t_cmdtao
  quocGiaTotNghiep: string; // ten_qg
  donVi: string;           // dvi.ten / t_dvi
  donViCapTren?: string 
};