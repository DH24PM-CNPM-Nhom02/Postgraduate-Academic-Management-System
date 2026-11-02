import { NotificationItem } from "@/src/types/notification";

export const INITIAL_MOCK_NOTIFICATIONS: NotificationItem[] = [
  // 1. [STUDENT] Mốc được duyệt
  {
    id: "notif-student-moc-duyet-1",
    nhom: "TIEN_DO",
    loai: "MOC_DUOC_DUYET",
    tieuDe: "Mốc 3 đã được duyệt",
    noiDung: "Minh chứng mốc 3 của bạn đã được duyệt. Mốc 4 đã được mở để bạn nộp minh chứng.",
    duLieu: { thuTu: 3, mocKeTiep: 4 },
    daDoc: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 2. [STUDENT] Mốc bị từ chối / cần nộp lại
  {
    id: "notif-student-moc-tuchoi-1",
    nhom: "TIEN_DO",
    loai: "MOC_BI_TU_CHOI",
    tieuDe: "Mốc 4 cần nộp lại",
    noiDung: "Minh chứng mốc 4 của bạn chưa được chấp nhận. Lý do: Thiếu chữ ký xác nhận của GVHD chính trên bản tóm tắt.",
    duLieu: { thuTu: 4, lyDo: "Thiếu chữ ký xác nhận của GVHD chính trên bản tóm tắt" },
    daDoc: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 3. [STUDENT] Có phiếu nhận xét mới cho bản thân
  {
    id: "notif-student-phieu-nx-1",
    nhom: "TIEN_DO",
    loai: "CO_PHIEU_NHAN_XET_MOI",
    tieuDe: "Có phiếu nhận xét mới cho mốc 2 của bạn",
    noiDung: "Mốc 2 của bạn đã có phiếu nhận xét mới từ PGS.TS. Huỳnh Văn Minh với điểm số 8.5/10.",
    duLieu: { thuTu: 2, tenNguoiCham: "PGS.TS. Huỳnh Văn Minh", diem: 8.5 },
    daDoc: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 4. [STUDENT] NCS được phân công GVHD
  {
    id: "notif-student-phan-cong-1",
    nhom: "TIEN_DO",
    loai: "NCS_DUOC_PHAN_CONG_GVHD",
    tieuDe: "Bạn đã được phân công giảng viên hướng dẫn",
    noiDung: "Giảng viên hướng dẫn của bạn: PGS.TS. Trần Quốc Tuấn (GVHD Chính).",
    duLieu: { tenGvhd: "PGS.TS. Trần Quốc Tuấn", vaiTro: "CHINH" },
    daDoc: false,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 5. [STUDENT] Quyết định đổi trạng thái (Gia hạn)
  {
    id: "notif-student-quyet-dinh-1",
    nhom: "QUYET_DINH",
    loai: "QUYET_DINH_DOI_TRANG_THAI",
    tieuDe: "Quyết định gia hạn đào tạo",
    noiDung: "Quyết định gia hạn số 142/QĐ-ĐHAG ngày 15/10/2026 đã được áp dụng cho hồ sơ của bạn. Hạn học tập mới: 15/10/2027.",
    duLieu: { loaiQuyetDinh: "GIA_HAN", soQuyetDinh: "142/QĐ-ĐHAG", ngayQuyetDinh: "2026-10-15", hanMoi: "2027-10-15" },
    daDoc: true,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 6. [STUDENT] Nhắc hạn học tập
  {
    id: "notif-student-nhac-han-1",
    nhom: "NHAC_HAN",
    loai: "NHAC_HAN_HOC_TAP",
    tieuDe: "Sắp đến hạn: Báo cáo tiến độ định kỳ 6 tháng đợt 2",
    noiDung: "Báo cáo tiến độ định kỳ 6 tháng đợt 2 của bạn là ngày 15/12/2026 (còn 43 ngày).",
    duLieu: { tenHan: "Báo cáo tiến độ định kỳ 6 tháng đợt 2", ngayHan: "2026-12-15", soNgayConLai: 43 },
    daDoc: false,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 7. [STUDENT] Cập nhật hạn kế hoạch
  {
    id: "notif-student-han-ke-hoach-1",
    nhom: "TIEN_DO",
    loai: "CAP_NHAT_HAN_KE_HOACH",
    tieuDe: "Cập nhật hạn kế hoạch mốc 5",
    noiDung: "Hạn kế hoạch cho mốc 5 đã được cập nhật thành ngày 30/11/2026.",
    duLieu: { thuTu: 5, hanKeHoach: "2026-11-30" },
    daDoc: true,
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },
  // 8. [STUDENT] Quyết định bị hủy
  {
    id: "notif-student-qd-huy-1",
    nhom: "QUYET_DINH",
    loai: "QUYET_DINH_BI_HUY",
    tieuDe: "Quyết định tạm đình chỉ đã bị vô hiệu hóa",
    noiDung: "Quyết định tạm đình chỉ số 88/QĐ-ĐHAG đã bị vô hiệu hóa. Lý do: Đã hoàn tất bổ sung hồ sơ học vụ.",
    duLieu: { loaiQuyetDinh: "NGUNG_HOC", soQuyetDinh: "88/QĐ-ĐHAG" },
    daDoc: true,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    targetRole: "student",
    targetUrl: "/student/progress",
  },

  // ==================== SUPERVISOR ====================
  // 9. [SUPERVISOR] GVHD nhận NCS mới
  {
    id: "notif-supervisor-nhan-ncs-1",
    nhom: "TIEN_DO",
    loai: "GVHD_NHAN_NCS",
    tieuDe: "Bạn được phân công hướng dẫn nghiên cứu sinh mới",
    noiDung: "Nghiên cứu sinh Nguyễn Văn An (NCS230104) đã được phân công cho bạn theo QĐ số 89/QĐ-ĐHAG.",
    duLieu: { tenNcs: "Nguyễn Văn An", mshv: "NCS230104" },
    daDoc: false,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },
  // 10. [SUPERVISOR] Mốc của NCS hướng dẫn được duyệt
  {
    id: "notif-supervisor-moc-duyet-1",
    nhom: "TIEN_DO",
    loai: "GVHD_MOC_DUOC_DUYET",
    tieuDe: "Mốc 3 của NCS Nguyễn Văn An (NCS230104) đã được duyệt",
    noiDung: "Minh chứng mốc 3 của NCS Nguyễn Văn An (NCS230104) đã được phê duyệt. Mốc 4 đã được mở để NCS nộp minh chứng.",
    duLieu: { tenNcs: "Nguyễn Văn An", mshv: "NCS230104", thuTu: 3, mocKeTiep: 4 },
    daDoc: true,
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },
  // 11. [SUPERVISOR] Mốc của NCS hướng dẫn bị từ chối
  {
    id: "notif-supervisor-moc-tuchoi-1",
    nhom: "TIEN_DO",
    loai: "GVHD_MOC_BI_TU_CHOI",
    tieuDe: "Mốc 4 của NCS Trần Thị Mai (NCS230105) cần nộp lại",
    noiDung: "Minh chứng mốc 4 của NCS Trần Thị Mai (NCS230105) chưa được chấp nhận. Lý do: Thiếu chữ ký xác nhận của GVHD chính.",
    duLieu: { tenNcs: "Trần Thị Mai", mshv: "NCS230105", thuTu: 4, lyDo: "Thiếu chữ ký xác nhận của GVHD chính" },
    daDoc: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },
  // 12. [SUPERVISOR] Có phiếu nhận xét mới cho NCS hướng dẫn
  {
    id: "notif-supervisor-phieu-nx-1",
    nhom: "TIEN_DO",
    loai: "CO_PHIEU_NHAN_XET_MOI",
    tieuDe: "Có phiếu nhận xét mới cho mốc 2 của NCS Nguyễn Văn An",
    noiDung: "Mốc 2 của NCS Nguyễn Văn An (NCS230104) đã có phiếu nhận xét mới từ PGS.TS. Huỳnh Văn Minh với điểm số 8.5/10.",
    duLieu: { thuTu: 2, mshv: "NCS230104", tenNcs: "Nguyễn Văn An", tenNguoiCham: "PGS.TS. Huỳnh Văn Minh", diem: 8.5 },
    daDoc: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },
  // 13. [SUPERVISOR] Quyết định đổi trạng thái của NCS hướng dẫn
  {
    id: "notif-supervisor-qd-1",
    nhom: "QUYET_DINH",
    loai: "GVHD_QUYET_DINH_DOI_TRANG_THAI",
    tieuDe: "Quyết định gia hạn của NCS Lê Văn Bình (NCS220201)",
    noiDung: "Quyết định gia hạn số 145/QĐ-ĐHAG ngày 20/10/2026 đã được áp dụng cho NCS Lê Văn Bình (NCS220201). Trạng thái chuyển sang gia hạn, hạn mới: 20/10/2027.",
    duLieu: { loaiQuyetDinh: "GIA_HAN", soQuyetDinh: "145/QĐ-ĐHAG", tenNcs: "Lê Văn Bình", mshv: "NCS220201" },
    daDoc: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },
  // 14. [SUPERVISOR] Thay đổi phân công GVHD
  {
    id: "notif-supervisor-thay-doi-1",
    nhom: "TIEN_DO",
    loai: "THAY_DOI_PHAN_CONG_GVHD",
    tieuDe: "Thay đổi phân công giảng viên hướng dẫn",
    noiDung: "Phân công hướng dẫn giữa NCS Trần Minh Trí (NCS220102) và GV TS. Lê Hoàng Nam đã kết thúc. Lý do: Giảng viên đi công tác nước ngoài dài hạn.",
    duLieu: { tenNcs: "Trần Minh Trí", mshv: "NCS220102", tenGvhd: "TS. Lê Hoàng Nam" },
    daDoc: true,
    createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    targetRole: "supervisor",
    targetUrl: "/supervisor/dashboard",
  },

  // ==================== ACADEMIC (GIÁO VỤ) ====================
  // 15. [ACADEMIC] NCS nộp minh chứng mới cần thẩm định
  {
    id: "notif-academic-ncs-nop-1",
    nhom: "TIEN_DO",
    loai: "NCS_NOP_MINH_CHUNG",
    tieuDe: "NCS Trần Thị Mai (NCS230105) nộp minh chứng mốc 3",
    noiDung: "Nghiên cứu sinh Trần Thị Mai (NCS230105) vừa nộp minh chứng cho mốc 3 đã được GVHD xác nhận. Vui lòng kiểm tra và phê duyệt.",
    duLieu: { tenNcs: "Trần Thị Mai", mshv: "NCS230105", thuTu: 3 },
    daDoc: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    targetRole: "academic",
    targetUrl: "/academic?tab=evidences",
  },
  // 16. [ACADEMIC] Cảnh báo tài khoản NCS
  {
    id: "notif-academic-canhbao-tk-1",
    nhom: "CANH_BAO_KY_THUAT",
    loai: "CANH_BAO_TAI_KHOAN",
    tieuDe: "Chưa cập nhật được tài khoản đăng nhập của NCS",
    noiDung: "Cần kiểm tra thủ công tài khoản NCS Nguyễn Hoàng Nam do trùng số CMND/CCCD với học viên cao học khóa trước.",
    duLieu: { canhBao: ["Trùng số CCCD với học viên cao học khóa trước", "Cần kiểm tra thủ công"] },
    daDoc: false,
    createdAt: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString(),
    targetRole: "academic",
    targetUrl: "/academic?tab=students",
  },
  // 17. [ACADEMIC] Cảnh báo hết hạn đào tạo tối đa
  {
    id: "notif-academic-canh-bao-het-han-1",
    nhom: "NHAC_HAN",
    loai: "CANH_BAO_HET_HAN_DAO_TAO",
    tieuDe: "Cảnh báo: Sắp hết thời gian đào tạo tối đa (NCS210101)",
    noiDung: "NCS Đỗ Văn Hùng (NCS210101) chỉ còn 3 tháng trước hạn đào tạo tối đa 72 tháng (ngày 15/02/2027). Vui lòng gửi thông báo và chuẩn bị hồ sơ xử lý.",
    duLieu: { tenNcs: "Đỗ Văn Hùng", mshv: "NCS210101", soThangConLai: 3, hanBuocThoiHoc: "2027-02-15" },
    daDoc: false,
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    targetRole: "academic",
    targetUrl: "/academic?tab=students",
  },

  // ==================== TẤT CẢ (ALL) ====================
  // 18. [ALL] Thông báo bảo trì hệ thống
  {
    id: "notif-system-all-1",
    nhom: "HE_THONG",
    loai: "HE_THONG_CHUNG",
    tieuDe: "Bảo trì nâng cấp hạ tầng Cổng Sau Đại học",
    noiDung: "Hệ thống sẽ tạm dừng để nâng cấp bảo mật định kỳ từ 23:00 ngày 05/11/2026 đến 02:00 ngày 06/11/2026.",
    daDoc: true,
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    targetRole: "all",
  },
];

const LOCAL_STORAGE_KEY = "agu_pg_notifications_store_v2";

export function getLocalNotifications(): NotificationItem[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_NOTIFICATIONS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
      return INITIAL_MOCK_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_NOTIFICATIONS;
  }
}

export function saveLocalNotifications(items: NotificationItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save local notifications:", e);
  }
}
