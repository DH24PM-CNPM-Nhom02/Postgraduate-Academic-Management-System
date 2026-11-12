/**
 * types/api/progress.ts
 *
 * Khai báo Request DTO & Response DTO khớp với Backend:
 * - GET /progress/me (ProgressController & DeadlineService)
 * - POST /progress/milestones/:thuTu/submit (SubmitMilestoneDto)
 * - GET /ncs/me (NcsController & NcsService.getDetailNcs)
 */

import type { VaiTroHuongDan } from "@/src/services/gvhd";

/** Trạng thái của 1 mốc tiến trình trong 9 mốc */
export type MilestoneStatusApi =
  | "LOCKED"
  | "UNLOCKED"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "PASSED";

/** Trạng thái của 1 lần nộp minh chứng */
export type EvidenceStatusApi = "PENDING_REVIEW" | "PASSED" | "REJECTED";

/** Tình trạng thời hạn của 1 mốc do DeadlineService tính */
export type DeadlineConditionStatusApi =
  | "DA_DAT"
  | "CHUA_CO_HAN"
  | "CON_HAN"
  | "SAP_HET_HAN"
  | "QUA_HAN";

/** Chi tiết 1 quy tắc hạn cấu thành nên hạn của mốc */
export interface MilestoneSubDeadlineApi {
  maHan: string;
  tenHan: string;
  han: string | null;
  laHanMem: boolean;
  canCu: string | null;
}

/** Thông tin hạn hiệu lực của 1 mốc */
export interface MilestoneDeadlineApi {
  hanHieuLuc: string | null;
  hanKeHoach: string | null;
  hanCung: string | null;
  tinhTrang: DeadlineConditionStatusApi;
  soNgayConLai: number | null;
  cacHan: MilestoneSubDeadlineApi[];
}

/** 1 lần nộp minh chứng trong lịch sử nộp của mốc */
export interface MilestoneEvidenceApi {
  id: string;
  lanNop: number;
  fileId: string;
  ghiChuNcs: string | null;
  trangThai: EvidenceStatusApi;
  diemTrungBinh: number | string | null;
  lyDoTuChoi: string | null;
  ngayNop: string;
  ngayDuyet: string | null;
}

/** Thông tin từng mốc tiến trình trả về từ GET /progress/me */
export interface MilestoneItemApi {
  id: string;
  trangThai: MilestoneStatusApi;
  openedAt: string | null;
  submittedAt: string | null;
  passedAt: string | null;
  coTheNop: boolean;
  moc: {
    thuTu: number;
    tenMoc: string;
    moTa: string | null;
    yeuCauDiem: boolean;
  };
  minhChungs: MilestoneEvidenceApi[];
  han: MilestoneDeadlineApi | null;
}

/** Payload tổng hợp Backend trả về từ GET /progress/me */
export interface MyProgressResponse {
  ncs: {
    id: string;
    mshv: string;
    hoTen: string;
    lop: string | null;
  };
  hanCuaNcs: {
    hanChinhQuy: string | null;
    hanGiaHan: string | null;
    hanBuocThoiHoc: string | null;
  };
  tienTrinhs: MilestoneItemApi[];
}

/** Body gửi lên POST /progress/milestones/:thuTu/submit */
export interface SubmitMilestoneRequest {
  /** ID tài liệu PDF đã upload trước đó qua POST /documents/upload */
  fileId: string;
  /** Ghi chú thêm của NCS (tối đa 500 ký tự) */
  ghiChu?: string;
}

/** Tham số đầu vào cho hook nộp mốc khi đã có sẵn fileId */
export interface SubmitMilestoneVariables {
  thuTu: number;
  payload: SubmitMilestoneRequest;
}

/** Tham số đầu vào cho luồng tiện ích 2 bước: chọn File PDF -> tự upload -> nộp mốc */
export interface SubmitMilestoneWithFileVariables {
  thuTu: number;
  file: File;
  ghiChu?: string;
  onUploadProgress?: (percent: number) => void;
}

/** Dữ liệu Backend trả về sau khi nộp minh chứng thành công */
export interface SubmitMilestoneResponse {
  id: string;
  tienTrinhId: string;
  lanNop: number;
  fileId: string;
  ghiChuNcs: string | null;
  trangThai: EvidenceStatusApi;
  diemTrungBinh: number | string | null;
  lyDoTuChoi: string | null;
  ngayNop: string;
  ngayDuyet: string | null;
}

/**
 * Dữ liệu hồ sơ chi tiết của chính NCS từ GET /ncs/me
 * (Bổ sung thông tin Ngành, Khóa, Ngày nhập học, GVHD cho phần đầu trang Tiến độ)
 */
export interface BackendNcsMeResponse {
  id: string;
  userId: string | null;
  mshv: string;
  hoTen: string;
  ngaySinh: string | null;
  gioiTinh: string | null;
  cccd: string | null;
  email: string | null;
  soDienThoai: string | null;
  nganhId: number | null;
  khoaHoc: string | null;
  khoaHocId: string | null;
  lop: string | null;
  ngayNhapHoc: string;
  trinhDoDauVao: string;
  phuongThucDaoTao: string;
  hanChinhQuy: string;
  hanBuocThoiHoc: string;
  hanGiaHan: string | null;
  trangThai: string;
  ngayChuyenTrangThai: string | null;
  lyDoChuyenTrangThai: string | null;
  createdAt: string;
  updatedAt: string;
  nganh: {
    id: number;
    maNganh: string;
    tenNganh: string;
  } | null;
  khoaHocNcs: {
    id: string;
    maKhoaHoc: string;
    namTuyenSinh: number | null;
    ghiChu: string | null;
  } | null;
  phanCongs: Array<{
    id: string;
    vaiTro: VaiTroHuongDan;
    trongSo: number | string;
    ngayBatDau: string | null;
    gvhd: {
      id: string;
      maGv: string | null;
      hoTen: string;
      hocHamHocVi: string;
      email: string | null;
    };
    quyetDinh: {
      id: string;
      soQuyetDinh: string;
      ngayQuyetDinh: string;
    };
  }>;
  tienTrinhs: Array<{
    id: string;
    trangThai: MilestoneStatusApi;
    openedAt: string | null;
    submittedAt: string | null;
    passedAt: string | null;
    hanKeHoach: string | null;
    moc: {
      id: string;
      thuTu: number;
      tenMoc: string;
      moTa: string | null;
      yeuCauDiem: boolean;
    };
  }>;
}
