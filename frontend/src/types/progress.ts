/**
 * types/progress.ts
 *
 * Định nghĩa cấu trúc dữ liệu cho trang Tiến trình 9 mốc của Nghiên cứu sinh (NCS).
 * Chuẩn hóa khớp với schema backend (MocTienTrinh, TienTrinhNcs, MinhChungMoc)
 * và payload của API GET /progress/me.
 */

export type MilestoneStatus =
  | "LOCKED"
  | "UNLOCKED"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "PASSED";

export type EvidenceStatus = "PENDING_REVIEW" | "PASSED" | "REJECTED";

/**
 * Bản ghi minh chứng cho một lần nộp
 */
export interface EvidenceItem {
  id: string;
  lanNop: number;
  fileId: string;
  fileName: string;
  fileSize?: number; // Dung lượng file tính bằng bytes
  fileUrl?: string;
  ghiChuNcs?: string;
  trangThai: EvidenceStatus;
  ngayNop: string; // ISO date string
  ngayDuyet?: string;
  nguoiDuyet?: string;
  diemTrungBinh?: string | number; // Thang 10, lẻ 1 chữ số thập phân (e.g. "8.2")
  lyDoTuChoi?: string;
}

/**
 * Dữ liệu một mốc trong 9 mốc tiến trình
 */
export interface MilestoneProgressItem {
  id: string;
  thuTu: number; // 1 đến 9
  tenMoc: string;
  moTa?: string;
  thoiGianDuKien?: string; // e.g. "Tháng 0-3", "Tháng 3-9"
  yeuCauDiem: boolean;
  diemTrungBinh?: string | number;
  trangThai: MilestoneStatus;
  coTheNop: boolean;
  ngayMoKhoa?: string;
  ngayHoanThanh?: string;
  lyDoTuChoi?: string; // Lý do từ chối của lần nộp mới nhất nếu REJECTED
  ghiChuHeThong?: string; // Ghi chú hệ thống (vd: "Đã hoàn thành khi nhập học")
  minhChungHienTai?: EvidenceItem;
  lichSuMinhChung: EvidenceItem[];
}

/**
 * Thông tin hồ sơ Nghiên cứu sinh
 */
export interface StudentProgressProfile {
  id: string;
  mshv: string;
  hoTen: string;
  lop: string;
  nganh: string;
  chuyenNganh?: string;
  khoaVi: string;
  gvhd: string;
  gvhdDongHuongDan?: string;
  ngayNhapHoc: string;
  thoiHanToiDa: string; // Tối đa 72 tháng
  soThangConLai?: number;
}

/**
 * Payload toàn diện trả về từ GET /progress/me
 */
export interface StudentProgressData {
  ncs: StudentProgressProfile;
  tongSoMoc: number;
  soMocHoanThanh: number;
  mocHienTai: number;
  milestones: MilestoneProgressItem[];
}
