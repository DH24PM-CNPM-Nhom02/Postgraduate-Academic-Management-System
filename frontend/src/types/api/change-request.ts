import type { BackendDecision } from "@/src/services/decision";
import type { BackendThesisItem } from "@/src/types/api/thesis";

export type ChangeRequestType = "DOI_DE_TAI" | "DOI_GVHD" | "GIA_HAN";

export type ChangeRequestStatus =
  | "CHO_GVHD_XAC_NHAN"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI"
  | "DA_HUY";

export interface ChangeRequestStudent {
  id: string;
  mshv: string;
  hoTen: string;
}

export interface ChangeRequestSupervisor {
  id: string;
  hoTen: string;
  hocHamHocVi: string | null;
}

export interface ChangeRequestConfirmation {
  id: string;
  deNghiId: string;
  gvhdId: string;
  gvhd: ChangeRequestSupervisor;
  dongY: boolean | null;
  nhanXet: string | null;
  ngayXacNhan: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeRequestItem {
  id: string;
  ncsId: string;
  nguoiDeNghiId: string;
  ncs: ChangeRequestStudent;
  loai: ChangeRequestType;
  trangThai: ChangeRequestStatus;
  lyDo: string;
  fileId: string | null;
  batKhaKhang: boolean;
  tenDeTaiMoi: string | null;
  hanMoiDeNghi: string | null;
  soThangGiaHan: number | null;
  gvhdMoi: ChangeRequestSupervisor | null;
  xacNhanGvhds: ChangeRequestConfirmation[];
  lyDoTuChoi: string | null;
  ngayDuyet: string | null;
  nguoiDuyetId: string | null;
  phanCongCuId: string | null;
  gvhdMoiId: string | null;
  quyetDinhId: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

interface ChangeRequestSupervisorDetail extends ChangeRequestSupervisor {
  email: string | null;
}

type ChangeRequestAuthor = {
  hoTen: string;
  email: string | null;
} & (
  | { loai: "NCS"; mshv: string; khoaHoc: string | null }
  | {
    loai: "GVHD";
    maGv: string | null;
    hocHamHocVi: string;
    chuyenNganh: string | null;
    donVi: { ten: string } | null;
  }
);

export interface ChangeRequestDetail extends ChangeRequestItem {
  nguoiDeNghi: ChangeRequestAuthor | null;
  ncs: ChangeRequestStudent & {
    email: string | null;
    trangThai: string;
    hanChinhQuy: string;
    hanGiaHan: string | null;
    hanBuocThoiHoc: string;
  };
  gvhdMoi: ChangeRequestSupervisorDetail | null;
  xacNhanGvhds: (ChangeRequestConfirmation & { gvhd: ChangeRequestSupervisorDetail })[];
  phanCongCu: {
    id: string;
    ncsId: string;
    gvhdId: string;
    gvhd: ChangeRequestSupervisorDetail;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
    trongSo: string;
    quyetDinhId: string;
    trangThai: "DANG_HIEU_LUC" | "DEACTIVATE";
    ngayBatDau: string | null;
    ngayKetThuc: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  quyetDinh: (Omit<BackendDecision, "ncs"> & { nguoiTaoId: string }) | null;
  deTaiHienTai?: BackendThesisItem | null;
  hanHienTai?: string | null;
  tongThangDaGiaHanTruoc?: number;
}

export interface ChangeRequestListQuery {
  loai?: ChangeRequestType;
  trangThai?: ChangeRequestStatus;
  page: number;
  limit: number;
}

export interface ChangeRequestListResponse {
  data: ChangeRequestItem[];
  total: number;
  page: number;
  limit: number;
}

export type ApproveChangeRequestPayload =
  | { quyetDinhId: string; resetTuMoc?: number }
  | { soQuyetDinh: string; ngayQuyetDinh: string; ghiChu?: string; fileId?: string };

export interface CreateChangeRequestApiPayload {
  loai: ChangeRequestType;
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
  loai: ChangeRequestType;
  trangThai: ChangeRequestStatus;
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
