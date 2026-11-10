
import {
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
    ValidateIf,
} from "class-validator";
import { LoaiDeNghiDieuChinh, TrangThaiDeNghi } from "../../../../apps/phd-service/src/generated/prisma/index.js";
import { Type } from "class-transformer";

const TRANG_THAI_DE_NGHI = ["CHO_GVHD_XAC_NHAN", "CHO_DUYET", "DA_DUYET", "TU_CHOI", "DA_HUY"]
const LOAI_TRANG_THAI_DE_NGHI = ['DOI_DE_TAI', 'DOI_GVHD', 'GIA_HAN']

export type TrangThaiDeNghiValue = (typeof TRANG_THAI_DE_NGHI)[number];
export type LoaiDeNghiValue = (typeof LOAI_TRANG_THAI_DE_NGHI)[number];
export class CreateChangeRequestDto {
    @IsIn(LOAI_TRANG_THAI_DE_NGHI)
    loai: LoaiDeNghiValue;

    /** Chỉ GVHD cần gửi (gửi thay cho NCS khi đổi đề tài/GVHD). NCS gửi thì bỏ qua, hệ thống lấy theo tài khoản. Với GIA_HAN, chỉ NCS được gửi. */
    @IsOptional()
    @IsUUID()
    ncsId?: string;

    @IsString()
    @IsNotEmpty()
    lyDo: string;

    /** File đơn đề nghị / báo cáo tiến độ (documentId từ document-service) - bắt buộc với GIA_HAN */
    @ValidateIf((o) => o.loai === 'GIA_HAN')
    @IsNotEmpty({ message: 'Đơn đề nghị gia hạn bắt buộc phải có file minh chứng / báo cáo tiến độ' })
    @IsString()
    @IsOptional()
    fileId?: string;

    /** Gửi quá hạn nhưng thuộc trường hợp bất khả kháng */
    @IsOptional()
    @IsBoolean()
    batKhaKhang?: boolean;

    // ---- GIA_HAN ----
    @ValidateIf((o) => o.loai === 'GIA_HAN')
    @IsNotEmpty({ message: 'Vui lòng nhập số tháng xin gia hạn' })
    @Type(() => Number)
    @IsInt({ message: 'Số tháng gia hạn phải là số nguyên' })
    @Min(1, { message: 'Số tháng gia hạn tối thiểu là 1 tháng' })
    @Max(24, { message: 'Số tháng gia hạn tối đa là 24 tháng' })
    soThangGiaHan?: number;

    // ---- DOI_DE_TAI ----
    @ValidateIf((o) => o.loai === 'DOI_DE_TAI')
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    tenDeTaiMoi?: string;

    // ---- DOI_GVHD ----
    @ValidateIf((o) => o.loai === 'DOI_GVHD')
    @IsUUID()
    phanCongCuId?: string;

    @ValidateIf((o) => o.loai === 'DOI_GVHD')
    @IsUUID()
    gvhdMoiId?: string;
}

export class ListDeNghiQuery {
    @IsOptional()
    @IsIn(TRANG_THAI_DE_NGHI)
    trangThai?: TrangThaiDeNghiValue;

    @IsOptional()
    @IsIn(LOAI_TRANG_THAI_DE_NGHI)
    loai?: LoaiDeNghiValue;

    @IsOptional()
    @IsUUID()
    ncsId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}

export class RejectDeNghiDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    lyDoTuChoi: string;
}

export class SupervisorReviewDeNghiDto {
    @IsBoolean()
    dongY: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    nhanXet?: string;
}

export class ApproveDeNghiDto {
    @IsOptional()
    @IsUUID()
    quyetDinhId?: string;

    /** Số quyết định gia hạn/thay đổi (nếu nhập trực tiếp thay vì chọn quyetDinhId có sẵn) */
    @IsOptional()
    @IsString()
    @MaxLength(100)
    soQuyetDinh?: string;

    /** Ngày quyết định (định dạng YYYY-MM-DD) */
    @IsOptional()
    @IsString()
    ngayQuyetDinh?: string;

    /** File quyết định đính kèm */
    @IsOptional()
    @IsString()
    fileId?: string;

    /** Ghi chú quyết định */
    @IsOptional()
    @IsString()
    @MaxLength(500)
    ghiChu?: string;

    @IsOptional()
    @IsInt()
    @Min(2)
    @Max(7)
    resetTuMoc?: number;
}