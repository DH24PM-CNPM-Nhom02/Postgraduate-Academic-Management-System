/**
 * Request & Response types cho API Xét tốt nghiệp (/graduation).
 */

export interface GraduationConditionApiItem {
  ma: string;
  ten: string;
  dat: boolean;
  ghiChu: string;
  fileId?: string | null;
}

export interface GraduationCheckApiResponse {
  ncsId: string;
  mshv: string;
  hoTen: string;
  trangThaiHocTap: string;
  daDuyetTotNghiep: boolean;
  duDieuKien: boolean;
  dieuKien: GraduationConditionApiItem[];
}

export interface GraduationDetail extends GraduationCheckApiResponse {
  xacNhan: {
    ngoaiNgu: {
      dat: boolean;
      chuanDauRa: string | null;
      ngayCongNhanNgoaiNgu: string | null;
      ghiChu: string | null;
    } | null;
    congNo: {
      khongConCongNo: boolean;
      ghiChu: string | null;
    } | null;
  };
}

export type GraduationEvidenceUpdate = {
  ncsId: string;
  fileId?: string;
  ghiChu?: string;
} & (
  | { kind: "ngoai-ngu"; dat: boolean; chuanDauRa?: string; ngayCongNhanNgoaiNgu?: string }
  | { kind: "cong-no"; khongConCongNo: boolean }
);

export interface GraduationDecision {
  id: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  fileId: string | null;
  ghiChu: string | null;
}

export interface GraduationConfirmation {
  ncsId: string;
  quyetDinhId: string;
  ngayTotNghiep?: string;
  ngayBaoVeCapTruong?: string;
  soHieuBang?: string;
  ngayCapBang?: string;
}

export interface GraduationConfirmationResponse {
  ketQua: (GraduationConfirmation & { mshv: string })[];
}

export interface GraduationConfirmationIssue {
  ncsId: string;
  mshv: string;
  hoTen: string;
  lyDo: string;
}

export interface GraduatedNcsRecord {
  ncsId: string;
  mshv: string;
  hoTen: string;
  nganh: string | null;
  khoaHoc: string | null;
  nguoiHuongDan: string[];
  ngayBaoVeCapTruong: string | null;
  soQuyetDinh: string | null;
  ngayQuyetDinh: string | null;
  soHieuBang: string | null;
  ngayCapBang: string | null;
}
