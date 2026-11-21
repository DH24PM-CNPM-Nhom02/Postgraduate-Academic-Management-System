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
