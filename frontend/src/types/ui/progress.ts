/**
 * UI Types cho màn hình "Tiến trình 9 mốc đào tạo" (NCS).
 * Chuẩn hóa tại tầng `src/types/ui/` phục vụ render thuần UI và mock data.
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
  fileSize?: number;
  fileUrl?: string;
  ghiChuNcs?: string;
  trangThai: EvidenceStatus;
  ngayNop: string;
  ngayDuyet?: string;
  nguoiDuyet?: string;
  diemTrungBinh?: string | number;
  lyDoTuChoi?: string;
}

/**
 * Bản ghi phiếu nhận xét / đánh giá của thành viên Hội đồng hoặc Người chấm
 */
export interface PhieuNhanXetItem {
  id: string;
  tenNguoiCham: string;
  chucDanh: string;
  diem: number;
  fileUrl?: string;
  fileName: string;
  ngayDanhGia?: string;
  nhanXet?: string;
}

/**
 * Dữ liệu một mốc trong 9 mốc tiến trình
 */
export interface MilestoneProgressItem {
  id: string;
  thuTu: number;
  tenMoc: string;
  moTa?: string;
  thoiGianDuKien?: string;
  yeuCauDiem: boolean;
  diemTrungBinh?: string | number;
  trangThai: MilestoneStatus;
  coTheNop: boolean;
  ngayMoKhoa?: string;
  ngayHoanThanh?: string;
  lyDoTuChoi?: string;
  ghiChuHeThong?: string;
  minhChungHienTai?: EvidenceItem;
  lichSuMinhChung: EvidenceItem[];
  phieuNhanXets?: PhieuNhanXetItem[];
}

/**
 * Thông tin hồ sơ Nghiên cứu sinh
 */
export interface StudentProgressProfile {
  id: string;
  mshv: string;
  hoTen: string;
  lop: string;
  khoaHoc?: string;
  maKhoaHoc?: string;
  namTuyenSinh?: number;
  /** Chuỗi niên khóa hiển thị: e.g. "Niên khóa: NCS01 - 2025" */
  nienKhoa?: string;
  nganh: string;
  chuyenNganh?: string;
  khoaVi: string;
  gvhd: string;
  gvhdDongHuongDan?: string;
  ngayNhapHoc: string;
  thoiHanToiDa: string;
  soThangConLai?: number;
}

/**
 * Tổng hợp dữ liệu màn hình Tiến trình 9 mốc của NCS
 */
export interface StudentProgressData {
  ncs: StudentProgressProfile;
  tongSoMoc: number;
  soMocHoanThanh: number;
  mocHienTai: number;
  milestones: MilestoneProgressItem[];
}
