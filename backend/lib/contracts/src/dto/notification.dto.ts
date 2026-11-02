import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export const NhomThongBao = ['QUYET_DINH', 'TIEN_DO', 'NHAC_HAN', 'HE_THONG', 'CANH_BAO_KY_THUAT'] as const;

export class ListNotificationQueryDto {
  @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;
 
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number;
 
    // ?chiChuaDoc=true
    @IsOptional()
    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    unread?: boolean;
 
    @IsOptional()
    @IsIn(['QUYET_DINH', 'TIEN_DO', 'NHAC_HAN', 'HE_THONG', 'CANH_BAO_KY_THUAT'])
    group?: string;
}