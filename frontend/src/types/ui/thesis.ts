/**
 * UI Types cho màn hình "Đề tài luận án của tôi" và "Giảng viên hướng dẫn của tôi" (NCS).
 * Tách riêng khỏi DTO backend để phục vụ render thuần UI và mock data.
 */

export type ThesisStatus = "HIEU_LUC" | "DA_THAY_THE" | "DA_HUY";

export interface ThesisDecisionDocument {
  /** Số hiệu quyết định (vd: "124/QĐ-ĐHAG") */
  soQuyetDinh: string;
  /** Ngày ký quyết định (ISO string) */
  ngayKy: string;
  /** Cơ quan ban hành */
  coQuanBanHanh?: string;
  /** Tên file PDF quyết định */
  fileName: string;
  /** Đường dẫn file PDF quyết định */
  fileUrl: string;
}

export interface ThesisItem {
  id: string;
  /** Mã đề tài nội bộ */
  maDeTai?: string;
  /** Tên đề tài tiếng Việt */
  tenDeTaiTiengViet: string;
  /** Tên đề tài tiếng Anh */
  tenDeTaiTiengAnh?: string;
  /** Tên chuyên ngành đào tạo */
  chuyenNganh: string;
  /** Mã chuyên ngành */
  maNganh?: string;
  /** Tóm tắt mục tiêu/phạm vi nghiên cứu */
  moTaNgan?: string;
  /** Trạng thái hiệu lực của đề tài */
  trangThai: ThesisStatus;
  /** Ngày bắt đầu hiệu lực (ISO string) */
  ngayBatDau: string;
  /** Ngày kết thúc/thay thế (ISO string) */
  ngayKetThuc?: string;
  /** Lý do điều chỉnh/hủy (nếu là bản ghi lịch sử) */
  lyDoThayDoi?: string;
  /** Quyết định giao/điều chỉnh đề tài */
  quyetDinh: ThesisDecisionDocument;
}

export interface StudentThesisOverview {
  ncsId: string;
  hoTenNcs: string;
  mshv: string;
  khoaHoc: string;
  ngayNhapHoc: string;
  /** Thời hạn đào tạo tối đa 72 tháng (ISO string) */
  hanDaoTao72Thang: string;
  /** Đề tài đang có hiệu lực */
  deTaiHienTai: ThesisItem | null;
  /** Lịch sử các đề tài đã thay thế hoặc đã hủy */
  lichSuDeTai: ThesisItem[];
}

export type SupervisorRoleType = "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";

export type SupervisorAssignmentStatus = "DANG_HUONG_DAN" | "DA_KET_THUC";

export interface SupervisorAssignmentItem {
  id: string;
  giangVienId: string;
  /** Họ và tên giảng viên */
  hoTen: string;
  /** Học hàm, học vị (vd: "PGS.TS.", "TS.") */
  hocHamHocVi: string;
  /** Vai trò hướng dẫn */
  vaiTro: SupervisorRoleType;
  /** Trọng số định mức theo BR-09 (Hướng dẫn chính: 1.0, Đồng hướng dẫn: 0.5) */
  trongSo: 1.0 | 0.5;
  /** Email liên hệ */
  email: string;
  /** Số điện thoại (tùy chọn) */
  soDienThoai?: string;
  /** Đơn vị công tác */
  donViCongTac: string;
  /** Lĩnh vực nghiên cứu chuyên sâu */
  linhVucNghienCuu?: string;
  /** Trạng thái phân công */
  trangThai: SupervisorAssignmentStatus;
  /** Số quyết định phân công GVHD */
  soQuyetDinh: string;
  /** Ngày ký quyết định phân công (ISO string) */
  ngayKyQuyetDinh: string;
  /** Ngày bắt đầu hướng dẫn (ISO string) */
  ngayBatDau: string;
  /** Tên file PDF quyết định phân công */
  fileNameQuyetDinh?: string;
  /** Đường dẫn PDF quyết định phân công */
  fileUrlQuyetDinh?: string;
}

export interface StudentSupervisorsOverview {
  ncsId: string;
  hoTenNcs: string;
  mshv: string;
  /** Danh sách giảng viên được phân công */
  danhSachGvhd: SupervisorAssignmentItem[];
}
