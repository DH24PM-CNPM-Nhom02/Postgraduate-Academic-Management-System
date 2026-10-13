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

  @IsOptional()
  @IsString()
  @Length(1, 100)
  hoTen?: string;      // bỏ trống thì lấy fullName của tài khoản

  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @IsOptional()
  @IsIn(GIOI_TINH)
  gioiTinh?: (typeof GIOI_TINH)[number];

  // Bỏ trống thì không kiểm tra; CCCD là @unique nên mỗi số chỉ thuộc 1 hồ sơ
  @IsOptional()
  @Matches(CCCD_PATTERN, { message: 'CCCD phải là 12 chữ số (hoặc 9 chữ số với CMND cũ)' })
  cccd?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  soDienThoai?: string;

  // Mã hoặc tên ngành trong danh mục nganh_dao_tao (vd 9620110)
  @IsOptional()
  @IsString()
  @Length(1, 150)
  nganh?: string;

  // Mã khóa tuyển sinh trong danh mục khoa_hoc_ncs (vd NCS01)
  @IsOptional()
  @IsString()
  @Length(1, 20)
  khoaHoc?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  lop?: string;

  @IsDateString()
  ngayNhapHoc: string;                           // YYYY-MM-DD

  @IsOptional()
  @IsIn(TRINH_DO_DAU_VAO)
  trinhDoDauVao?: (typeof TRINH_DO_DAU_VAO)[number];

  @IsOptional()
  @IsIn(PHUONG_THUC_DAO_TAO)
  phuongThucDaoTao?: (typeof PHUONG_THUC_DAO_TAO)[number];
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
  hoTen?: string;
  ngaySinh?: string;        // YYYY-MM-DD
  gioiTinh?: string;        // NAM | NU
  cccd?: string;            // 12 hoặc 9 chữ số, giữ nguyên số 0 đầu
  email?: string;
  soDienThoai?: string;
  nganh?: string;           // mã hoặc tên ngành
  khoaHoc?: string;         // mã khóa, vd NCS01
  lop?: string;
  ngayNhapHoc?: string;     // YYYY-MM-DD
  trinhDoDauVao?: string;   // THAC_SI | DAI_HOC
  phuongThucDaoTao?: string; // PHUONG_THUC_1 | PHUONG_THUC_2
};