/**
 * DTO dữ liệu Backend cho phân hệ Đề tài Luận án (Thesis)
 * Chuẩn hóa theo kiến trúc Clean Architecture phục vụ cả phân hệ NCS và Giáo vụ/Admin
 */

export type BackendTrangThaiDeTai = "HIEU_LUC" | "DA_THAY_THE" | "DA_HUY";

export type ThesisViewFilterStatus =
  | "ALL"
  | "HIEU_LUC"
  | "CHUA_GIAO"
  | "DA_THAY_THE"
  | "DA_HUY";

export interface BackendQuyetDinhSummary {
  id?: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  fileId?: string | null;
}

export type BackendQuyetDinhDto = BackendQuyetDinhSummary;

export interface BackendThesisItem {
  id: string;
  ncsId?: string;
  tenDeTai: string;
  trangThai: BackendTrangThaiDeTai;
  quyetDinhId?: string | null;
  quyetDinh?: BackendQuyetDinhSummary | null;
  ngayKetThuc?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type BackendDeTaiDto = BackendThesisItem;

export interface BackendSupervisorSimple {
  id: string;
  hoTen: string;
  hocHamHocVi?: string | null;
  email?: string | null;
  maGv?: string | null;
}

export interface BackendPhanCongSimple {
  id: string;
  vaiTro?: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN" | string;
  trongSo?: number | string;
  trangThai?: string;
  gvhd: BackendSupervisorSimple;
  quyetDinh?: BackendQuyetDinhSummary | null;
}

export interface AcademicThesisNcsItem {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string;
  trangThaiDeTai: "HIEU_LUC" | "CHUA_GIAO";
  deTaiHienTai?: BackendThesisItem | null;
  deTais?: BackendThesisItem[];
  phanCongs?: BackendPhanCongSimple[];
  hasPendingChangeRequest?: boolean;
  trangThaiHocTap?: "DANG_HOC" | "GIA_HAN" | "THOI_HOC" | "TOT_NGHIEP";
}

export interface AcademicThesisListResponse {
  data: AcademicThesisNcsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AcademicThesisListQuery {
  page?: number;
  limit?: number;
  khoaHocId?: string;
  trangThai?: ThesisViewFilterStatus;
  gvhdId?: string;
  search?: string;
}

export interface AssignThesisPayload {
  ncsId: string;
  quyetDinhId: string;
  tenDeTai: string;
}

export interface DeactivateThesisPayload {
  lyDo: string;
}

export interface AcademicThesisAdminDetailResponse {
  id?: string;
  mshv?: string;
  hoTen?: string;
  khoaHoc?: string;
  deTais: BackendThesisItem[];
  deTaiHienTai: BackendThesisItem | null;
  phanCongs: BackendPhanCongSimple[];
  phanCongsHienTai: BackendPhanCongSimple[];
}

export interface BackendThesisNcsMeResponse {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string;
  deTais: BackendThesisItem[];
  deTaiHienTai: BackendThesisItem | null;
  phanCongs?: BackendPhanCongSimple[];
}
