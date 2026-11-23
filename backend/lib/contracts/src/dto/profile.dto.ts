import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export const PHONE_NUMBER_PATTERN = /^0[1-9]\d{8}$/;
export const PHONE_NUMBER_MESSAGE = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';

export function trimProfileField({ value }: { value: unknown }) {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateContactProfileDto {
  @IsOptional()
  @Transform(trimProfileField)
  @IsEmail({}, { message: 'Email liên hệ không hợp lệ' })
  @MaxLength(100, { message: 'Email liên hệ tối đa 100 ký tự' })
  email?: string;

  @IsOptional()
  @Transform(trimProfileField)
  @Matches(PHONE_NUMBER_PATTERN, { message: PHONE_NUMBER_MESSAGE })
  soDienThoai?: string;
}
