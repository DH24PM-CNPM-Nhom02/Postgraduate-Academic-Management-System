/**
 * Request & Response types cho API Quản lý Đơn đề nghị & Gia hạn học tập (/change-request).
 */

export type LoaiDeNghiApi = "DOI_DE_TAI" | "DOI_GVHD" | "GIA_HAN";
export type TrangThaiDeNghiApi =
  | "CHO_GVHD_XAC_NHAN"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI"
  | "DA_HUY";

export interface CreateChangeRequestApiPayload {
  loai: LoaiDeNghiApi;
  lyDo: string;
  ncsId?: string;
  fileId?: string;
  batKhaKhang?: boolean;
  soThangGiaHan?: number;
  tenDeTaiMoi?: string;
  phanCongCuId?: string;
  gvhdMoiId?: string;
}

export interface XacNhanGvhdDeNghiApi {
  id: string;
  gvhdId: string;
  dongY: boolean | null;
  nhanXet: string | null;
  ngayXacNhan: string | null;
  gvhd?: {
    id: string;
    hoTen: string;
    hocHamHocVi?: string | null;
    email?: string | null;
  };
}

export interface ChangeRequestApiItem {
  id: string;
  ncsId: string;
  loai: LoaiDeNghiApi;
  trangThai: TrangThaiDeNghiApi;
  lyDo: string;
  fileId?: string | null;
  batKhaKhang?: boolean;
  soThangGiaHan?: number | null;
  hanMoiDeNghi?: string | null;
  tenDeTaiMoi?: string | null;
  tenDeTaiCu?: string | null;
  phanCongCuId?: string | null;
  gvhdMoiId?: string | null;
  lyDoTuChoi?: string | null;
  nguoiDuyetId?: string | null;
  ngayDuyet?: string | null;
  createdAt: string;
  updatedAt: string;
  ncs?: {
    id: string;
    mshv: string;
    hoTen: string;
    lop?: string | null;
  };
  phanCongCu?: {
    id: string;
    vaiTro: string;
    gvhd?: {
      id: string;
      hoTen: string;
      hocHamHocVi?: string | null;
    };
  } | null;
  gvhdMoi?: {
    id: string;
    hoTen: string;
    hocHamHocVi?: string | null;
    donViCongTac?: string | null;
  } | null;
  xacNhanGvhds?: XacNhanGvhdDeNghiApi[];
  quyetDinh?: {
    id: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    fileId?: string | null;
    coQuanBanHanh?: string | null;
  } | null;
}

export interface ListChangeRequestsApiResponse {
  data: ChangeRequestApiItem[];
  total: number;
  page: number;
  limit: number;
}
