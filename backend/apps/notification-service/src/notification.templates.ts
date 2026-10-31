import { NhomThongBao } from "./generated/prisma/index.js";


type DuLieu = Record<string, unknown>;
type Mau = {
    nhom: NhomThongBao;
    tieuDe: (d: DuLieu) => string;
    noiDung: (d: DuLieu) => string;
};

// Hàm tiện ích: chuyển đổi giá trị sang chuỗi, nếu là undefined/null thì trả về chuỗi mặc định
const chuoi = (v: unknown, macDinh = ''): string => (v === undefined || v === null ? macDinh : String(v));

// Định dạng ngày tháng: "2026-10-20" -> "20/10/2026"
const ngayVN = (v: unknown): string => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(chuoi(v));
    return m ? `${m[3]}/${m[2]}/${m[1]}` : chuoi(v);
};

const TEN_QUYET_DINH: Record<string, string> = {
    BAO_LUU: 'bảo lưu',
    HOC_TIEP: 'cho học tiếp',
    NGUNG_HOC: 'ngừng học',
    BUOC_THOI_HOC: 'buộc thôi học',
    GIA_HAN: 'gia hạn',
};
const LOAI_KHOA_TAI_KHOAN = ['BAO_LUU', 'NGUNG_HOC', 'BUOC_THOI_HOC'];

const tenQuyetDinh = (d: DuLieu) => TEN_QUYET_DINH[chuoi(d.loaiQuyetDinh)] ?? chuoi(d.loaiQuyetDinh, 'quyết định');

// Người gửi chỉ truyền loai và duLieu, câu chữ nằm hết ở đây.
// loai chưa có trong bảng này sẽ bị bỏ qua (xem NotificationService.tao)
export const MAU_THONG_BAO: Record<string, Mau> = {
    // ---- Nhóm TIEN_DO ----
    MOC_DUOC_DUYET: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Mốc ${chuoi(d.thuTu)} đã được duyệt`,
        noiDung: (d) => {
            const chuSoHuu = d.tenNcs ? `của NCS ${chuoi(d.tenNcs)}${d.mshv ? ` (${chuoi(d.mshv)})` : ''}` : 'của bạn';
            let nd = `Minh chứng mốc ${chuoi(d.thuTu)} ${chuSoHuu} đã được duyệt.`.replace(/\s+/g, ' ');
            if (d.mocKeTiep) nd += ` Mốc ${chuoi(d.mocKeTiep)} đã được mở để ${d.tenNcs ? 'NCS' : 'bạn'} nộp minh chứng.`;
            return nd;
        },
    },
    MOC_BI_TU_CHOI: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Mốc ${chuoi(d.thuTu)} cần nộp lại`,
        noiDung: (d) => {
            const chuSoHuu = d.tenNcs ? `của NCS ${chuoi(d.tenNcs)}${d.mshv ? ` (${chuoi(d.mshv)})` : ''}` : 'của bạn';
            return `Minh chứng mốc ${chuoi(d.thuTu)} ${chuSoHuu} chưa được chấp nhận. Lý do: ${chuoi(d.lyDo, 'không ghi rõ')}.`.replace(/\s+/g, ' ');
        },
    },
    GVHD_MOC_DUOC_DUYET: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Mốc ${chuoi(d.thuTu)} của NCS ${chuoi(d.tenNcs, chuoi(d.mshv))} đã được duyệt`,
        noiDung: (d) => {
            let nd = `Minh chứng mốc ${chuoi(d.thuTu)} của NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) đã được phê duyệt.`;
            if (d.mocKeTiep) nd += ` Mốc ${chuoi(d.mocKeTiep)} đã được mở để NCS nộp minh chứng.`;
            return nd;
        },
    },
    GVHD_MOC_BI_TU_CHOI: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Mốc ${chuoi(d.thuTu)} của NCS ${chuoi(d.tenNcs, chuoi(d.mshv))} cần nộp lại`,
        noiDung: (d) =>
            `Minh chứng mốc ${chuoi(d.thuTu)} của NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) chưa được chấp nhận. Lý do: ${chuoi(d.lyDo, 'không ghi rõ')}.`,
    },
    NCS_NOP_MINH_CHUNG: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `NCS ${chuoi(d.tenNcs, chuoi(d.mshv))} đã nộp minh chứng mốc ${chuoi(d.thuTu)}`,
        noiDung: (d) => `Nghiên cứu sinh ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) đã nộp minh chứng cho mốc ${chuoi(d.thuTu)}. Vui lòng kiểm tra và đánh giá/phê duyệt.`,
    },
    CO_PHIEU_NHAN_XET_MOI: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Có phiếu nhận xét mới cho mốc ${chuoi(d.thuTu)}${d.mshv ? ` (${chuoi(d.mshv)})` : ''}`,
        noiDung: (d) => {
            const chuSoHuu = d.tenNcs ? `của NCS ${chuoi(d.tenNcs)}${d.mshv ? ` (${chuoi(d.mshv)})` : ''}` : '';
            return `Mốc ${chuoi(d.thuTu)} ${chuSoHuu} đã có phiếu nhận xét mới từ ${chuoi(d.tenNguoiCham)}${d.diem !== undefined && d.diem !== null ? ` với điểm số ${chuoi(d.diem)}` : ''}.`.replace(/\s+/g, ' ');
        },
    },
    CAP_NHAT_HAN_KE_HOACH: {
        nhom: 'TIEN_DO',
        tieuDe: (d) => `Cập nhật hạn kế hoạch mốc ${chuoi(d.thuTu)}`,
        noiDung: (d) => d.hanKeHoach
            ? `Hạn kế hoạch cho mốc ${chuoi(d.thuTu)} đã được cập nhật thành ngày ${ngayVN(d.hanKeHoach)}.`
            : `Hạn kế hoạch cho mốc ${chuoi(d.thuTu)} đã được xóa bỏ.`,
    },
    NCS_DUOC_PHAN_CONG_GVHD: {
        nhom: 'TIEN_DO',
        tieuDe: () => 'Bạn đã được phân công giảng viên hướng dẫn',
        noiDung: (d) => `Giảng viên hướng dẫn của bạn: ${chuoi(d.tenGvhd, 'chưa rõ')}.`,
    },
    GVHD_NHAN_NCS: {
        nhom: 'TIEN_DO',
        tieuDe: () => 'Bạn được phân công hướng dẫn nghiên cứu sinh mới',
        noiDung: (d) => `Nghiên cứu sinh ${chuoi(d.tenNcs, 'chưa rõ')} (${chuoi(d.mshv, 'chưa rõ MSHV')}) đã được phân công cho bạn.`,
    },
    THAY_DOI_PHAN_CONG_GVHD: {
        nhom: 'TIEN_DO',
        tieuDe: () => 'Thay đổi phân công giảng viên hướng dẫn',
        noiDung: (d) => `Phân công hướng dẫn giữa NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) và GV ${chuoi(d.tenGvhd)} đã kết thúc.${d.lyDo ? ` Lý do: ${chuoi(d.lyDo)}.` : ''}`,
    },
    CAP_NHAT_TRANG_THAI_HOC_TAP: {
        nhom: 'TIEN_DO',
        tieuDe: () => 'Cập nhật trạng thái học tập',
        noiDung: (d) => `Trạng thái học tập của NCS ${chuoi(d.tenNcs, chuoi(d.mshv))} đã được cập nhật thành ${chuoi(d.trangThaiMoi)}.${d.ngayHieuLuc ? ` Ngày hiệu lực: ${ngayVN(d.ngayHieuLuc)}.` : ''}${d.lyDo ? ` Lý do: ${chuoi(d.lyDo)}.` : ''}`,
    },

    // ---- Nhóm QUYET_DINH ----
    QUYET_DINH_DOI_TRANG_THAI: {
        nhom: 'QUYET_DINH',
        tieuDe: (d) => `Quyết định ${tenQuyetDinh(d)}`,
        noiDung: (d) => {
            const loai = chuoi(d.loaiQuyetDinh);
            let nd = `Quyết định ${tenQuyetDinh(d)} số ${chuoi(d.soQuyetDinh)}`;
            if (d.ngayQuyetDinh) nd += ` ngày ${ngayVN(d.ngayQuyetDinh)}`;
            nd += ' đã được áp dụng cho hồ sơ của bạn.';
            if (loai === 'GIA_HAN' && d.hanMoi) nd += ` Hạn học tập mới: ${ngayVN(d.hanMoi)}.`;
            if (LOAI_KHOA_TAI_KHOAN.includes(loai)) nd += ' Tài khoản của bạn tạm thời bị khóa, vui lòng liên hệ Giáo vụ.';
            if (loai === 'HOC_TIEP') nd += ' Tài khoản của bạn đã được mở lại.';
            if (d.ghiChu) nd += ` Ghi chú: ${chuoi(d.ghiChu)}`;
            return nd;
        },
    },
    GVHD_QUYET_DINH_DOI_TRANG_THAI: {
        nhom: 'QUYET_DINH',
        tieuDe: (d) => `Quyết định ${tenQuyetDinh(d)} của NCS ${chuoi(d.tenNcs, chuoi(d.mshv))}`,
        noiDung: (d) => {
            const loai = chuoi(d.loaiQuyetDinh);
            let nd = `Quyết định ${tenQuyetDinh(d)} số ${chuoi(d.soQuyetDinh)}`;
            if (d.ngayQuyetDinh) nd += ` ngày ${ngayVN(d.ngayQuyetDinh)}`;
            nd += ` đã được áp dụng cho NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}). Trạng thái học tập của NCS đã chuyển sang ${tenQuyetDinh(d)}.`;
            if (loai === 'GIA_HAN' && d.hanMoi) nd += ` Hạn học tập mới: ${ngayVN(d.hanMoi)}.`;
            if (d.ghiChu) nd += ` Ghi chú: ${chuoi(d.ghiChu)}`;
            return nd;
        },
    },
    QUYET_DINH_BI_HUY: {
        nhom: 'QUYET_DINH',
        tieuDe: (d) => `Quyết định ${tenQuyetDinh(d)} đã bị vô hiệu hóa`,
        noiDung: (d) =>
            `Quyết định ${tenQuyetDinh(d)} số ${chuoi(d.soQuyetDinh)} đã bị vô hiệu hóa. ` +
            `Lý do: ${chuoi(d.lyDo, 'không ghi rõ')}. Hồ sơ của bạn đã được hoàn lại trạng thái trước quyết định này.`,
    },
    GVHD_QUYET_DINH_BI_HUY: {
        nhom: 'QUYET_DINH',
        tieuDe: (d) => `Quyết định ${tenQuyetDinh(d)} của NCS ${chuoi(d.tenNcs, chuoi(d.mshv))} đã bị vô hiệu hóa`,
        noiDung: (d) =>
            `Quyết định ${tenQuyetDinh(d)} số ${chuoi(d.soQuyetDinh)} đối với NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) đã bị vô hiệu hóa. ` +
            `Lý do: ${chuoi(d.lyDo, 'không ghi rõ')}. Hồ sơ của NCS đã được hoàn lại trạng thái trước quyết định này.`,
    },

    // ---- Nhóm CANH_BAO_KY_THUAT (chỉ gửi cho người cần xử lý) ----
    CANH_BAO_TAI_KHOAN: {
        nhom: 'CANH_BAO_KY_THUAT',
        tieuDe: () => 'Chưa cập nhật được tài khoản đăng nhập của NCS',
        noiDung: (d) => (Array.isArray(d.canhBao) ? d.canhBao.join('; ') : chuoi(d.canhBao, 'Cần kiểm tra thủ công')),
    },
    TAI_KHOAN_DOI_MAT_KHAU: {
        nhom: 'CANH_BAO_KY_THUAT',
        tieuDe: () => 'Mật khẩu tài khoản đã được thay đổi',
        noiDung: () => 'Mật khẩu tài khoản của bạn vừa được thay đổi thành công. Nếu bạn không thực hiện hành động này, vui lòng liên hệ quản trị viên ngay lập tức.',
    },

    // ---- Nhóm HE_THONG (Admin gửi, sẽ làm sau) ----
    HE_THONG_CHUNG: {
        nhom: 'HE_THONG',
        tieuDe: (d) => chuoi(d.tieuDe, 'Thông báo hệ thống'),
        noiDung: (d) => chuoi(d.noiDung),
    },

    // ---- Nhóm NHAC_HAN (tác vụ quét hạn) ----
    NHAC_HAN_HOC_TAP: {
        nhom: 'NHAC_HAN',
        tieuDe: (d) => `Sắp đến hạn: ${chuoi(d.tenHan, 'hạn học tập')}`,
        noiDung: (d) => {
            let nd = `${chuoi(d.tenHan, 'Hạn học tập')} của bạn là ngày ${ngayVN(d.ngayHan)}`;
            if (d.soNgayConLai !== undefined && d.soNgayConLai !== null) nd += ` (còn ${chuoi(d.soNgayConLai)} ngày)`;
            return nd + '.';
        },
    },
    CANH_BAO_HET_HAN_DAO_TAO: {
        nhom: 'NHAC_HAN',
        tieuDe: (d) => `Cảnh báo: Sắp hết thời gian đào tạo tối đa (${chuoi(d.mshv)})`,
        noiDung: (d) =>
            `NCS ${chuoi(d.tenNcs)} (${chuoi(d.mshv)}) chỉ còn ${chuoi(d.soThangConLai, chuoi(d.soNgayConLai))} tháng trước hạn đào tạo tối đa 72 tháng (ngày ${ngayVN(d.hanBuocThoiHoc)}). Vui lòng hoàn thành các thủ tục cần thiết.`,
    },
};
