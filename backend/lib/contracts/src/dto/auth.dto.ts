// auth/dto/auth.dto.ts
import { Type } from 'class-transformer';
import { ArrayMinSize, IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto.js';

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
  status?: 'active' | 'locked';

  @IsOptional()
  @IsString()
  keyword?: string;
}

export class SetUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}