import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  StudentDossier,
  ListAcademicStudentsQuery,
  ImportNcsPreviewResponse,
  ImportNcsConfirmResponse,
} from "@/src/types/academic";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";

/**
 * Cấu trúc dữ liệu thô nhận về từ Backend API
 */
export interface BackendNcsRaw {  
  id?: string;
  name?: string;
  code?: string;
  hoTen?: string;
  mshv?: string;
  ngaySinh?: string | Date | null;
  gioiTinh?: "NAM" | "NU" | string | null;
  cccd?: string | null;
  lop?: string;
  trangThai?: string;
  ngayChuyenTrangThai?: string | Date | null;
  lyDoChuyenTrangThai?: string | null;
  ngayNhapHoc?: string | Date;
  trinhDoDauVao?: "THAC_SI" | "DAI_HOC" | string;
  phuongThucDaoTao?: string;
  phuongThucDaoTaoText?: string;
  hanChinhQuy?: string | Date;
  hanGiaHan?: string | Date | null;
  hanBuocThoiHoc?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  khoaHocNcs?: { id?: string; maKhoaHoc?: string; namTuyenSinh?: number };
  nganh?: { id?: number; maNganh?: string; tenNganh?: string };
  namTuyenSinh?: number | null;
  admissionYear?: number | string | null;
  deTai?: string | null;
  thesisTopic?: string | null;
  deTais?: Array<{ id?: string; tenDeTai?: string; trangThai?: string }>;
  gvhd?: string | null;
  dongGvhd?: string | null;
  supervisorMain?: string | null;
  supervisorCo?: string | null;
  phanCongs?: Array<{
    vaiTro?: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN" | string;
    gvhd?: {
      id?: string;
      maGv?: string;
      hoTen?: string;
      hocHamHocVi?: string | null;
      email?: string | null;
      chuyenNganh?: string | null;
    };
    quyetDinh?: {
      id?: string;
      soQuyetDinh?: string;
      ngayQuyetDinh?: string | Date;
      fileId?: string | null;
    };
  }>;
  quyetDinhs?: Array<{
    id?: string;
    soQuyetDinh?: string;
    ngayQuyetDinh?: string | Date;
    loai?: string;
    ghiChu?: string | null;
    trangThai?: string;
    fileId?: string | null;
  }>;
  diemBaiBao?: number;
  publicationPoints?: number;
  email?: string;
  soDienThoai?: string;
  sdt?: string;
  phone?: string;
  tienTrinhs?: Array<{
    id?: string;
    mocId?: number;
    trangThai?: string;
    openedAt?: string | Date | null;
    submittedAt?: string | Date | null;
    passedAt?: string | Date | null;
    hanKeHoach?: string | Date | null;
    hanQuyDinh?: string | null;
    moTaHan?: string | null;
    hanApDung?: string | null;
    loaiHan?: "KE_HOACH" | "QUY_DINH" | "KHONG_CO" | string;
    moc?: { id?: number; thuTu?: number; tenMoc?: string; yeuCauDiem?: boolean; moTa?: string | null };
    minhChungs?: BackendNcsEvidenceRaw[];
  }>;
}

export interface BackendNcsReviewRaw {
  id?: string;
  tenNguoiCham?: string;
  donViNguoiCham?: string | null;
  diem?: number | string | null;
  createdAt?: string;
  nhanXet?: string | null;
}

export interface BackendNcsEvidenceRaw {
  id?: string;
  lanNop?: number;
  fileId?: string | null;
  ghiChuNcs?: string | null;
  trangThai?: string;
  diemTrungBinh?: number | string | null;
  lyDoTuChoi?: string | null;
  ngayNop?: string | Date;
  ngayDuyet?: string | Date | null;
  phieuNhanXets?: BackendNcsReviewRaw[];
  quyetDinh?: {
    id?: string;
    soQuyetDinh?: string;
    ngayQuyetDinh?: string | Date;
    fileId?: string | null;
  };
}

export interface UpdateNcsPayload {
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh?: "NAM" | "NU";
  email?: string;
  soDienThoai?: string;
  nganh?: string;
  khoaHoc?: string;
  lop?: string;
}

export interface NcsMajorCatalogItem {
  id: number;
  maNganh: string;
  tenNganh: string;
}

export interface NcsCohortCatalogItem {
  id: string;
  maKhoaHoc: string;
  namTuyenSinh: number | null;
  ghiChu: string | null;
}

export interface UpdateMyNcsProfilePayload {
  email?: string;
  soDienThoai?: string;
}

/**
 * Hàm chuyển đổi dữ liệu thô từ Backend sang cấu trúc hiển thị giao diện Frontend (StudentDossier).
 * Giúp giao diện luôn hiển thị mượt mà kể cả khi cấu trúc database dùng tiếng Việt (hoTen, mshv...).
 */
export function mapBackendNcsToStudentDossier(raw: BackendNcsRaw): StudentDossier {
  // Nếu dữ liệu đã chuẩn cấu trúc StudentDossier hoàn chỉnh
  if (raw.name && raw.code && raw.thesisTopic && raw.supervisorMain && raw.publicationPoints !== undefined) {
    return raw as unknown as StudentDossier;
  }

  // Xác định thời gian đào tạo chuẩn theo trình độ đầu vào (Đại học: 48 tháng, Thạc sĩ: 36 tháng)
  const isDaiHoc =
    raw.trinhDoDauVao === "DAI_HOC" ||
    (typeof raw.trinhDoDauVao === "string" && raw.trinhDoDauVao.toUpperCase().includes("DAI_HOC"));
  const defaultDurationMonths = isDaiHoc ? 48 : 36;

  // 1. Tính số tháng đào tạo còn lại dựa vào hạn chính quy hoặc hạn gia hạn
  let targetDeadline = raw.hanGiaHan
    ? new Date(raw.hanGiaHan)
    : raw.hanChinhQuy
    ? new Date(raw.hanChinhQuy)
    : null;

  // Nếu chưa có hạn chính quy nhưng có ngày nhập học, tính hạn dựa trên trình độ đầu vào
  if ((!targetDeadline || isNaN(targetDeadline.getTime())) && raw.ngayNhapHoc) {
    const startDate = new Date(raw.ngayNhapHoc);
    if (!isNaN(startDate.getTime())) {
      targetDeadline = new Date(startDate);
      targetDeadline.setMonth(targetDeadline.getMonth() + defaultDurationMonths);
    }
  }

  let remainingMonths = defaultDurationMonths;
  if (targetDeadline && !isNaN(targetDeadline.getTime())) {
    const diffMs = targetDeadline.getTime() - Date.now();
    remainingMonths = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44)));
  }

  // 2. Chuyển đổi trạng thái từ Backend sang StudentStatus ("active" | "warning" | "overdue")
  let status: StudentDossier["status"] = "active";
  if (raw.trangThai === "BUOC_THOI_HOC" || raw.trangThai === "NGUNG_HOC" || remainingMonths < 3) {
    status = "overdue";
  } else if (raw.trangThai === "BAO_LUU" || remainingMonths < 12) {
    status = "warning";
  } else {
    status = "active";
  }

  // 3. Tính mốc tiến trình hiện tại (dựa vào danh sách tiến trình đã hoàn thành)
  let currentMilestoneIndex = 1;
  if (Array.isArray(raw.tienTrinhs) && raw.tienTrinhs.length > 0) {
    const passedMocs = raw.tienTrinhs
      .filter((t) => t.trangThai === "PASSED")
      .map((t) => t.moc?.thuTu ?? 0);
    const maxPassed = passedMocs.length > 0 ? Math.max(...passedMocs) : 0;
    currentMilestoneIndex = Math.min(9, Math.max(1, maxPassed + 1));
  }

  // 4. Lấy GVHD chính và Đồng GVHD
  const gvhdChinh = raw.phanCongs?.find((p) => p.vaiTro === "HUONG_DAN_CHINH");
  const dongGvhd = raw.phanCongs?.find((p) => p.vaiTro === "DONG_HUONG_DAN");

  const cleanAcademicTitle = (name?: string | null): string => {
    if (!name) return "";
    return name
      .replace(/^PHO_GIAO_SU[.:]?\s*/i, "PGS.TS. ")
      .replace(/^GIAO_SU[.:]?\s*/i, "GS.TS. ")
      .replace(/^TIEN_SI[.:]?\s*TS\.?\s*/i, "TS. ")
      .replace(/^TIEN_SI[.:]?\s*/i, "TS. ")
      .replace(/^THAC_SI[.:]?\s*/i, "ThS. ")
      .trim();
  };

  const formatGv = (g?: { hoTen?: string; hocHamHocVi?: string | null }) => {
    if (!g || !g.hoTen) return undefined;
    const title = cleanAcademicTitle(g.hocHamHocVi);
    if (!title) return g.hoTen;
    if (g.hoTen.startsWith("TS.") || g.hoTen.startsWith("PGS.") || g.hoTen.startsWith("GS.") || g.hoTen.startsWith("ThS.")) {
      return g.hoTen;
    }
    return `${title} ${g.hoTen}`;
  };

  const supervisorMain = cleanAcademicTitle(
    raw.gvhd ||
    raw.supervisorMain ||
    formatGv(gvhdChinh?.gvhd) ||
    "Chưa phân công"
  );

  const supervisorCo = cleanAcademicTitle(
    raw.dongGvhd ||
    raw.supervisorCo ||
    formatGv(dongGvhd?.gvhd) ||
    undefined
  ) || undefined;

  const thesisTopic =
    raw.deTai ||
    raw.thesisTopic ||
    raw.deTais?.[0]?.tenDeTai ||
    "Chưa đăng ký đề tài";

  const admissionYear =
    raw.admissionYear ||
    raw.namTuyenSinh ||
    raw.khoaHocNcs?.namTuyenSinh ||
    (raw.ngayNhapHoc ? new Date(raw.ngayNhapHoc).getFullYear() : undefined) ||
    "2023";

  return {
    id: raw.id || `std-${raw.mshv || Date.now()}`,
    name: raw.hoTen || raw.name || "Chưa cập nhật tên",
    code: raw.mshv || raw.code || "N/A",
    cohort: raw.khoaHocNcs?.maKhoaHoc || raw.lop || "Khóa 2023",
    department: raw.nganh?.tenNganh || "Kỹ thuật phần mềm",
    admissionYear,
    trinhDoDauVao: raw.trinhDoDauVao,
    phuongThucDaoTao: raw.phuongThucDaoTao,
    phuongThucDaoTaoText: raw.phuongThucDaoTaoText,
    thesisTopic,
    supervisorMain,
    supervisorCo,
    remainingMonths,
    currentMilestoneIndex,
    publicationPoints: raw.diemBaiBao ?? raw.publicationPoints ?? 0,
    status,
    email: raw.email || `${raw.mshv?.toLowerCase() || "ncs"}@agu.edu.vn`,
    phone: raw.soDienThoai || raw.sdt || raw.phone || "Chưa cập nhật",
    ngaySinh: raw.ngaySinh,
    gioiTinh: raw.gioiTinh,
    cccd: raw.cccd,
    lop: raw.lop,
    ngayNhapHoc: raw.ngayNhapHoc,
    hanChinhQuy: raw.hanChinhQuy,
    hanBuocThoiHoc: raw.hanBuocThoiHoc,
    hanGiaHan: raw.hanGiaHan,
    ngayChuyenTrangThai: raw.ngayChuyenTrangThai,
    lyDoChuyenTrangThai: raw.lyDoChuyenTrangThai,
    createdAt: raw.createdAt,
    rawDetails: raw as Record<string, unknown>,
  };
}

/**
 * Service kết nối toàn bộ API của Phân hệ Quản lý Nghiên cứu sinh (NCS).
 * Gọi qua apiClient (tự động đính kèm access token của phiên hiện tại).
 */
export const NcsService = {
  exportExcel: async (ids?: string[]): Promise<Blob> => {
    const { data } = await apiClient.post<Blob>("/ncs/export", { ids }, { responseType: "blob" });
    return data;
  },

  getTrainingMajors: async (): Promise<NcsMajorCatalogItem[]> => {
    try {
      const response = await apiClient.get<NcsMajorCatalogItem[]>("/ncs/catalogs/nganh-dao-tao");
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  getNcsCohorts: async (): Promise<NcsCohortCatalogItem[]> => {
    try {
      const response = await apiClient.get<NcsCohortCatalogItem[]>("/ncs/catalogs/khoa-hoc");
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 1. Lấy danh sách toàn bộ Nghiên cứu sinh
   * Endpoint: GET /ncs
   */
  getAllStudents: async (params?: ListAcademicStudentsQuery): Promise<StudentDossier[]> => {
    const response = await apiClient.get<BackendNcsRaw[] | { data: BackendNcsRaw[] }>("/ncs", {
      params,
    });
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data as { data: BackendNcsRaw[] })?.data ?? [];
    return data.map(mapBackendNcsToStudentDossier);
  },

  /**
   * Hàm tương thích với code cũ đã gọi trước đây
   */
  getAllStudentsWithPagination: async (params?: ListAcademicStudentsQuery): Promise<StudentDossier[]> => {
    return NcsService.getAllStudents(params);
  },

  /**
   * 2. Lấy thông tin hồ sơ chi tiết của chính NCS đang đăng nhập
   * Endpoint: GET /ncs/me
   */
  getMyProfile: async (): Promise<BackendNcsMeResponse> => {
    try {
      const response = await apiClient.get<BackendNcsMeResponse>("/ncs/me");
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /** Cập nhật các trường cá nhân được phép của hồ sơ NCS hiện tại. */
  updateMyProfile: async (
    payload: UpdateMyNcsProfilePayload,
  ): Promise<Pick<BackendNcsMeResponse, "email" | "soDienThoai">> => {
    try {
      const { data } = await apiClient.patch<Pick<BackendNcsMeResponse, "email" | "soDienThoai">>("/ncs/me", payload);
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 3. Lấy thông tin chi tiết của 1 NCS (kèm 9 mốc tiến trình & ngành học)
   * Endpoint: GET /ncs/:id
   */
  getStudentById: async (id: string): Promise<BackendNcsRaw> => {
    const response = await apiClient.get<BackendNcsRaw>(`/ncs/${id}`);
    return response.data;
  },

  /**
   * 3. Cập nhật thông tin lý lịch NCS
   * Endpoint: PATCH /ncs/:id
   */
  updateStudent: async (
    id: string,
    data: UpdateNcsPayload
  ): Promise<BackendNcsRaw> => {
    try {
      const response = await apiClient.patch<BackendNcsRaw>(`/ncs/${id}`, data);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 4. Cập nhật trạng thái học vụ (DANG_HOC, BAO_LUU, GIA_HAN, BUOC_THOI_HOC...)
   * Endpoint: PATCH /ncs/:id/status
   */
  updateStudentStatus: async (
    id: string,
    trangThai: string,
    lyDo?: string
  ): Promise<BackendNcsRaw> => {
    const response = await apiClient.patch<BackendNcsRaw>(`/ncs/${id}/status`, {
      trangThai,
      lyDo,
    });
    return response.data;
  },

  /**
   * 5. Tải file Excel mẫu import NCS
   * Endpoint: GET /ncs/import/template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get("/ncs/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * 6. Upload file Excel để xem trước dữ liệu hợp lệ/lỗi (chưa lưu)
   * Endpoint: POST /ncs/import/preview
   */
  previewImportExcel: async (file: File): Promise<ImportNcsPreviewResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ImportNcsPreviewResponse>(
      "/ncs/import/preview",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 7. Xác nhận nạp file Excel vào cơ sở dữ liệu thật
   * Endpoint: POST /ncs/import/confirm
   */
  confirmImportExcel: async (file: File): Promise<ImportNcsConfirmResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ImportNcsConfirmResponse>(
      "/ncs/import/confirm",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};
