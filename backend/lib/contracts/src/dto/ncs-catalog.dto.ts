import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

const trim = () => Transform(({ value }) => typeof value === 'string' ? value.trim() : value);

export class CreateMajorDto {
  @trim()
  @IsString()
  @Length(1, 20, { message: 'Mã ngành phải có từ 1 đến 20 ký tự.' })
  maNganh!: string;

  @trim()
  @IsString()
  @Length(1, 150, { message: 'Tên ngành phải có từ 1 đến 150 ký tự.' })
  tenNganh!: string;
}

export class CreateCohortDto {
  @trim()
  @IsString()
  @Length(1, 20, { message: 'Mã niên khóa phải có từ 1 đến 20 ký tự.' })
  maKhoaHoc!: string;

  @IsOptional()
  @IsInt({ message: 'Năm tuyển sinh phải là số nguyên.' })
  @Min(1000, { message: 'Năm tuyển sinh phải có 4 chữ số.' })
  @Max(9999, { message: 'Năm tuyển sinh phải có 4 chữ số.' })
  namTuyenSinh?: number | null;

  @IsOptional()
  @trim()
  @IsString({ message: 'Ghi chú phải là văn bản.' })
  ghiChu?: string | null;
}

export class UpdateMajorDto extends PartialType(CreateMajorDto, { skipNullProperties: false }) {}
export class UpdateCohortDto extends PartialType(CreateCohortDto, { skipNullProperties: false }) {}
