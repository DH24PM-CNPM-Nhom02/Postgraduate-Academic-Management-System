import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayMaxSize, IsDateString, IsEmail, IsIn, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
export const TRINH_DO_DAU_VAO = ['THAC_SI', 'DAI_HOC'] as const;
export const PHUONG_THUC_DAO_TAO = ['PHUONG_THUC_1', 'PHUONG_THUC_2'] as const;
export const GIOI_TINH = ['NAM', 'NU'] as const;

// 12 số = CCCD, 9 số = CMND cũ; lưu dạng chuỗi để giữ số 0 đầu
export const CCCD_PATTERN = /^(\d{12}|\d{9})$/;

export class CreateNcsItemDto {
  @IsString()
  @Length(1, 20)
  mshv: string;

  @IsString()
  @Length(1, 100)
  hoTen!: string;

  @IsDateString()
  ngaySinh!: string;

  @IsIn(GIOI_TINH)
  gioiTinh!: (typeof GIOI_TINH)[number];

  @Matches(CCCD_PATTERN, { message: 'CCCD phải là 12 chữ số (hoặc 9 chữ số với CMND cũ)' })
  cccd!: string;

  @IsEmail()
  @Length(1, 100)
  email!: string;

  @IsString()
  @Length(1, 20)
  soDienThoai!: string;

  // Mã hoặc tên ngành trong danh mục nganh_dao_tao (vd 9620110)
  @IsString()
  @Length(1, 150)
  nganh!: string;

  // Mã khóa tuyển sinh trong danh mục khoa_hoc_ncs (vd NCS01)
  @IsString()
  @Length(1, 20)
  khoaHoc!: string;

  @IsString()
  @Length(1, 30)
  lop!: string;

  @IsDateString()
  ngayNhapHoc!: string; // YYYY-MM-DD

  @IsIn(TRINH_DO_DAU_VAO)
  trinhDoDauVao!: (typeof TRINH_DO_DAU_VAO)[number];

  @IsIn(PHUONG_THUC_DAO_TAO)
  phuongThucDaoTao!: (typeof PHUONG_THUC_DAO_TAO)[number];
}

export const TRANG_THAI_NCS_CAP_NHAT = ['DANG_HOC', 'BAO_LUU', 'NGUNG_HOC'] as const;

export class UpdateNcsStatusDto {
  @IsIn(TRANG_THAI_NCS_CAP_NHAT)
  trangThai!: (typeof TRANG_THAI_NCS_CAP_NHAT)[number];

  @IsDateString()
  ngayChuyenTrangThai!: string;

  @IsOptional()
  @IsString()
  lyDoChuyenTrangThai?: string;
}

export class UpdateNcsDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  hoTen?: string;

  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @IsOptional()
  @IsIn(GIOI_TINH)
  gioiTinh?: (typeof GIOI_TINH)[number];

  @IsOptional()
  @Matches(CCCD_PATTERN, { message: 'CCCD phải là 12 chữ số (hoặc 9 chữ số với CMND cũ)' })
  cccd?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  soDienThoai?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  nganh?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  khoaHoc?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  lop?: string;
}

export class CreateNcsBatchDto {
  @ValidateNested({ each: true })
  @Type(() => CreateNcsItemDto)
  @ArrayMinSize(1) @ArrayMaxSize(200)
  items: CreateNcsItemDto[];
}

// Một dòng đọc từ file Excel (mọi ô đều là chuỗi; `row` là số dòng trong file để báo lỗi)
export type ImportNcsRow = {
  row: number;
  mshv: string;
  hoTen: string;
  ngaySinh: string;        // YYYY-MM-DD
  gioiTinh: string;        // NAM | NU
  cccd: string;            // 12 hoặc 9 chữ số, giữ nguyên số 0 đầu
  email: string;
  soDienThoai: string;
  nganh: string;           // mã hoặc tên ngành
  khoaHoc: string;         // mã khóa, vd NCS01
  lop: string;
  ngayNhapHoc: string;     // YYYY-MM-DD
  trinhDoDauVao: string;   // THAC_SI | DAI_HOC
  phuongThucDaoTao: string; // PHUONG_THUC_1 | PHUONG_THUC_2
};