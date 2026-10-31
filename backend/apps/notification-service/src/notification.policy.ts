import { NhomThongBao } from "./generated/prisma/index.js";


const NGAY_MS = 24 * 60 * 60 * 1000; //24 tiếng

// Chính sách lưu trữ theo nhóm:
//  - sauKhiDocNgay: đã đọc thì giữ bao nhiêu ngày, tính từ lúc đọc
//  - chuaDocNgay:   chưa đọc thì giữ tối đa bao nhiêu ngày, tính từ lúc tạo (null = không tự xóa)
export const CHINH_SACH_LUU_TRU: Record<NhomThongBao, { sauKhiDocNgay: number; chuaDocNgay: number | null }> = {
    QUYET_DINH: { sauKhiDocNgay: 730, chuaDocNgay: null },
    TIEN_DO: { sauKhiDocNgay: 180, chuaDocNgay: 365 },
    NHAC_HAN: { sauKhiDocNgay: 30, chuaDocNgay: null }, // hạn riêng, xem gioiHanTheoSuKien
    HE_THONG: { sauKhiDocNgay: 30, chuaDocNgay: 90 },
    CANH_BAO_KY_THUAT: { sauKhiDocNgay: 14, chuaDocNgay: 30 },
};

// Nhắc hạn: hết hạn muộn nhất 30 ngày sau ngày hạn. Không có ngayHan thì giữ 90 ngày kể từ lúc tạo
const NHAC_HAN_SAU_NGAY_HAN = 30;
const NHAC_HAN_KHONG_CO_NGAY_HAN = 90;

type DuLieu = Record<string, unknown> | null | undefined;

// Cộng thêm số ngày vào mốc thời gian
const congNgay = (moc: Date, soNgay: number) => new Date(moc.getTime() + soNgay * NGAY_MS);

// Chuyển string sang Date
function docNgay(v: unknown): Date | null {
    if (typeof v !== 'string') return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
}

// Lấy thời gian sớm nhất trong các mốc thời gian
function somNhat(...ds: (Date | null)[]): Date | null {
    const co = ds.filter((d): d is Date => d !== null);
    return co.length === 0 ? null : new Date(Math.min(...co.map((d) => d.getTime())));
}

// Mốc hết hạn do chính nội dung sự kiện quy định (áp dụng cả khi đã đọc lẫn chưa đọc)
function gioiHanTheoSuKien(nhom: NhomThongBao, taoLuc: Date, duLieu: DuLieu): Date | null {
    if (nhom === 'NHAC_HAN') {
        const ngayHan = docNgay(duLieu?.ngayHan);
        return ngayHan
            ? congNgay(ngayHan, NHAC_HAN_SAU_NGAY_HAN)
            : congNgay(taoLuc, NHAC_HAN_KHONG_CO_NGAY_HAN);
    }
    if (nhom === 'HE_THONG') {
        return docNgay(duLieu?.ketThucAt); // Admin có thể đặt ngày kết thúc
    }
    return null;
}

// Hạn tự xóa lúc vừa tạo (thông báo chưa đọc)
export function tinhHetHanKhiTao(nhom: NhomThongBao, taoLuc: Date, duLieu?: DuLieu): Date | null {
    const cs = CHINH_SACH_LUU_TRU[nhom];
    return somNhat(
        cs.chuaDocNgay === null ? null : congNgay(taoLuc, cs.chuaDocNgay),
        gioiHanTheoSuKien(nhom, taoLuc, duLieu),
    );
}

// Hạn tự xóa tính lại khi người dùng đánh dấu đã đọc
export function tinhHetHanKhiDoc(nhom: NhomThongBao, docLuc: Date, taoLuc: Date, duLieu?: DuLieu): Date | null {
    const cs = CHINH_SACH_LUU_TRU[nhom];
    return somNhat(congNgay(docLuc, cs.sauKhiDocNgay), gioiHanTheoSuKien(nhom, taoLuc, duLieu));
}
