/**
 * types/api/change-request.ts
 *
 * DTO khớp Backend (api-gateway ChangeRequestController + phd-service ChangeRequestService):
 * - lib/contracts/src/dto/change-request.dto.ts
 * - model DeNghiDieuChinh / XacNhanGvhdDeNghi (phd-service/prisma/schema.prisma)
 */

export type ChangeRequestTypeApi = "DOI_DE_TAI" | "DOI_GVHD" | "GIA_HAN";

export type ChangeRequestStatusApi =
  | "CHO_GVHD_XAC_NHAN"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI"
  | "DA_HUY";

export interface ChangeRequestGvhdRef {
  id: string;
  hoTen: string;
  hocHamHocVi: string | null;
  email?: string | null;
}

/** 1 dòng ý kiến GVHD với đơn GIA_HAN (dongY: null = chưa phản hồi) */
export interface ChangeRequestSupervisorOpinionApi {
  id: string;
  deNghiId: string;
  gvhdId: string;
  dongY: boolean | null;
  nhanXet: string | null;
  ngayXacNhan: string | null;
  createdAt: string;
  updatedAt: string;
  gvhd: ChangeRequestGvhdRef;
}

/** Các cột của model DeNghiDieuChinh */
interface ChangeRequestBaseApi {
  id: string;
  ncsId: string;
  loai: ChangeRequestTypeApi;
  lyDo: string;
  fileId: string | null;
  batKhaKhang: boolean;
  tenDeTaiMoi: string | null;
  hanMoiDeNghi: string | null;
  soThangGiaHan: number | null;
  phanCongCuId: string | null;
  gvhdMoiId: string | null;
  nguoiDeNghiId: string;
  trangThai: ChangeRequestStatusApi;
  lyDoTuChoi: string | null;
  nguoiDuyetId: string | null;
  ngayDuyet: string | null;
  quyetDinhId: string | null;
  createdAt: string;
  updatedAt: string;
  /** Người đang đăng nhập là người tạo đơn (hoặc NCS chủ đơn) */
  isOwner: boolean;
}

/** 1 dòng trong `GET /change-request` */
export interface ChangeRequestListItemApi extends ChangeRequestBaseApi {
  ncs: { id: string; mshv: string; hoTen: string };
  gvhdMoi: ChangeRequestGvhdRef | null;
  xacNhanGvhds: ChangeRequestSupervisorOpinionApi[];
}

/** `GET /change-request` — luôn phân trang (mặc định page 1, limit 20, tối đa 100) */
export interface ChangeRequestListResponse {
  data: ChangeRequestListItemApi[];
  total: number;
  page: number;
  limit: number;
}

export interface ListChangeRequestParams {
  trangThai?: ChangeRequestStatusApi;
  loai?: ChangeRequestTypeApi;
  ncsId?: string;
  page?: number;
  limit?: number;
}

/** `GET /change-request/:id` */
export interface ChangeRequestDetailApi extends ChangeRequestBaseApi {
  ncs: {
    id: string;
    mshv: string;
    hoTen: string;
    email: string | null;
    hanChinhQuy: string | null;
    hanGiaHan: string | null;
    hanBuocThoiHoc: string | null;
    trangThai: string;
  };
  gvhdMoi: ChangeRequestGvhdRef | null;
  phanCongCu: {
    id: string;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
    gvhd: ChangeRequestGvhdRef;
  } | null;
  xacNhanGvhds: ChangeRequestSupervisorOpinionApi[];
  quyetDinh: {
    id: string;
    soQuyetDinh: string;
    ngayQuyetDinh: string;
    fileId: string | null;
    loai: string;
    ghiChu: string | null;
  } | null;
  /** Chỉ có với DOI_DE_TAI */
  deTaiHienTai?: { id: string; tenDeTai: string } | null;
  /** Chỉ có với GIA_HAN */
  hanHienTai?: string | null;
  tongThangDaGiaHanTruoc?: number;
}

/** Body `POST /change-request` (CreateChangeRequestDto) */
export interface CreateChangeRequestPayload {
  loai: ChangeRequestTypeApi;
  /** Chỉ GVHD gửi thay NCS (DOI_DE_TAI / DOI_GVHD) */
  ncsId?: string;
  lyDo: string;
  /** Bắt buộc với GIA_HAN (documentType DON_TU hoặc MINH_CHUNG_MOC) */
  fileId?: string;
  batKhaKhang?: boolean;
  soThangGiaHan?: number;
  tenDeTaiMoi?: string;
  phanCongCuId?: string;
  gvhdMoiId?: string;
}

/** Body `PATCH /change-request/:id/supervisor-review` */
export interface SupervisorReviewPayload {
  dongY: boolean;
  nhanXet?: string;
}

/** Body `PATCH /change-request/:id/approve` (ApproveDeNghiDto) */
export interface ApproveChangeRequestPayload {
  quyetDinhId?: string;
  soQuyetDinh?: string;
  ngayQuyetDinh?: string;
  fileId?: string;
  ghiChu?: string;
  resetTuMoc?: number;
}
