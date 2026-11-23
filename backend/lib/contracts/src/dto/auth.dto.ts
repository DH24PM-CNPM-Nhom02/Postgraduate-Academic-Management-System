// auth/dto/auth.dto.ts
import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto.js';
import { trimProfileField } from './profile.dto.js';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
export class UpdateMyAccountProfileDto {
  @IsOptional()
  @Transform(trimProfileField)
  @IsString({ message: 'Họ và tên phải là chuỗi' })
  @Length(1, 191, { message: 'Họ và tên phải có từ 1 đến 191 ký tự' })
  fullName?: string;

  @IsOptional()
  @Transform(trimProfileField)
  @IsEmail({}, { message: 'Email tài khoản không hợp lệ' })
  @MaxLength(191, { message: 'Email tài khoản tối đa 191 ký tự' })
  email?: string;
}

export class CreateUserItemDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
export class CreateUsersDto {
  @ValidateNested({ each: true }) @Type(() => CreateUserItemDto) @ArrayMinSize(1)
  users: CreateUserItemDto[];
}

export class ListUsersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  @IsIn(["active", "locked"])
  status?: 'active' | 'locked';

  @IsOptional()
  @IsString()
  keyword?: string;
}

export class SetUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}
