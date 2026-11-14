/**
 * DTO dữ liệu Backend cho phân hệ Đề tài Luận án (Thesis)
 * Khớp với phản hồi từ API Gateway: `GET /thesis/ncs/me`
 */

export type BackendTrangThaiDeTai = "HIEU_LUC" | "DA_THAY_THE" | "DA_HUY";

export interface BackendQuyetDinhDto {
  soQuyetDinh: string;
  ngayQuyetDinh: string;
}

export interface BackendDeTaiDto {
  id: string;
  ncsId?: string;
  tenDeTai: string;
  trangThai: BackendTrangThaiDeTai;
  quyetDinhId?: string | null;
  quyetDinh?: BackendQuyetDinhDto | null;
  ngayKetThuc?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface BackendThesisNcsMeResponse {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string;
  deTais: BackendDeTaiDto[];
  deTaiHienTai: BackendDeTaiDto | null;
  phanCongs?: Array<{
    id: string;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
    trongSo: number | string;
    trangThai: string;
    gvhd: {
      id: string;
      hoTen: string;
      hocHamHocVi: string;
      email?: string | null;
      maGv?: string | null;
    };
    quyetDinh?: BackendQuyetDinhDto | null;
  }>;
}
