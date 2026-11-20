export const NOTIFICATION_GROUP_LABELS = {
  QUYET_DINH: "Quyết định",
  TIEN_DO: "Tiến độ",
  NHAC_HAN: "Nhắc hạn",
  HE_THONG: "Hệ thống",
  CANH_BAO_KY_THUAT: "Cảnh báo kỹ thuật",
} as const;

export type NotificationGroup = keyof typeof NOTIFICATION_GROUP_LABELS;

export type NotificationRole = "student" | "supervisor" | "academic";

export type NotificationType =
  // Tiến độ học vụ
  | "MOC_DUOC_DUYET"
  | "MOC_BI_TU_CHOI"
  | "GVHD_MOC_DUOC_DUYET"
  | "GVHD_MOC_BI_TU_CHOI"
  | "NCS_NOP_MINH_CHUNG"
  | "CO_PHIEU_NHAN_XET_MOI"
  | "CAP_NHAT_HAN_KE_HOACH"
  | "NCS_DUOC_PHAN_CONG_GVHD"
  | "GVHD_NHAN_NCS"
  | "GVHD_TRO_THANH_GVHD_CHINH"
  | "THAY_DOI_PHAN_CONG_GVHD"
  | "CAP_NHAT_TRANG_THAI_HOC_TAP"
  // Quyết định pháp lý
  | "QUYET_DINH_DOI_TRANG_THAI"
  | "GVHD_QUYET_DINH_DOI_TRANG_THAI"
  | "QUYET_DINH_BI_HUY"
  | "GVHD_QUYET_DINH_BI_HUY"
  // Nhắc hạn
  | "NHAC_HAN_HOC_TAP"
  | "CANH_BAO_HET_HAN_DAO_TAO"
  // Hệ thống & Kỹ thuật
  | "HE_THONG_CHUNG"
  | "CANH_BAO_TAI_KHOAN"
  | "TAI_KHOAN_DOI_MAT_KHAU";

export interface NotificationItem {
  id: string;
  userId?: string;
  nhom: NotificationGroup;
  loai: NotificationType | string;
  tieuDe: string;
  noiDung: string;
  duLieu?: Record<string, unknown>;
  daDoc: boolean;
  readAt?: string | null;
  hetHanAt?: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  tong: number;
  trang: number;
  soLuong: number;
}

export interface NotificationQueryFilter {
  group?: NotificationGroup | string;
  unread?: boolean;
  page?: number;
  limit?: number;
}
