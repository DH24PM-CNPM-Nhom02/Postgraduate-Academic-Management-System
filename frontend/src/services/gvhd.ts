import { apiClient } from "@/src/lib/api";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

export type VaiTroHuongDan = "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";

/**
 * Cấu trúc Đơn vị công tác từ Backend
 */
export interface BackendDonViRaw {
  id?: string;
  ten?: string;
  parent?: {
    id?: string;
    ten?: string;
  } | null;
}

/**
 * Cấu trúc bản ghi Phân công hướng dẫn nhận từ GET /gvhd/assignments
 */
export interface BackendAssignmentRaw {
  id: string;
  ncsId: string;
  gvhdId: string;
  vaiTro: VaiTroHuongDan;
  trongSo: number | string;
  quyetDinhId: string;
  trangThai: "DANG_HIEU_LUC" | "DEACTIVATE";
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  gvhd?: {
    id: string;
    hoTen?: string;
    email?: string | null;
    hocHamHocVi?: string;
    soNcsDangHuongDan?: number | string;
    maxNcsChoPhep?: number;
    donVi?: BackendDonViRaw | null;
  } | null;
  ncs?: {
    id: string;
    mshv?: string;
    hoTen?: string;
    trangThai?: string;
  } | null;
  quyetDinh?: {
    id: string;
    soQuyetDinh?: string;
    ngayQuyetDinh?: string;
    loai?: string;
  } | null;
}

/**
 * Cấu trúc dữ liệu thô GVHD nhận về từ Backend API (GET /gvhd)
 */
export interface BackendGvhdRaw {
  id: string;
  maGv?: string | null;
  hoTen: string;
  gioiTinh?: string | null;
  ngaySinh?: string | null;
  email?: string | null;
  hocHamHocVi?: string;
  maxNcsChoPhep?: number;
  soNcsDangHuongDan?: number | string;
  chuyenNganh?: string | null;
  quocGiaTotNghiep?: string | null;
  trangThai?: boolean;
  donVi?: BackendDonViRaw | null;
  phanCongs?: BackendAssignmentRaw[];
}

/**
 * Cấu trúc Quyết định phân công GVHD lấy từ GET /decisions
 */
export interface BackendAssignmentDecisionRaw {
  id: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  loai: string;
  ncsId?: string | null;
  trangThai: string;
  ghiChu?: string | null;
}

/**
 * Payload gửi lên POST /gvhd/assignments
 */
export interface CreateAssignmentPayload {
  ncsId: string;
  gvhdId: string;
  vaiTro: VaiTroHuongDan;
  quyetDinhId: string;
}

/**
 * Tách mảng an toàn cho cả response mảng thuần T[] và dạng phân trang { data: T[] }
 */
function unwrapArrayResponse<T>(payload: T[] | { data?: T[] } | unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

/**
 * Quy đổi enum học hàm/học vị sang nhãn hiển thị tiếng Việt
 */
export function formatDegreeLabel(hocHamHocVi?: string): string {
  switch (hocHamHocVi) {
    case "GIAO_SU":
      return "Giáo sư";
    case "PHO_GIAO_SU":
      return "Phó Giáo sư";
    case "TIEN_SI_KHOA_HOC":
      return "Tiến sĩ Khoa học";
    case "TIEN_SI":
    default:
      return "Tiến sĩ";
  }
}

/**
 * Tạo tiền tố học hàm/học vị trước tên nếu tên gốc chưa có
 */
export function formatSupervisorDisplayName(hoTen: string, hocHamHocVi?: string): string {
  const trimmed = hoTen.trim();
  if (/^(GS\.|PGS\.|TSKH\.|TS\.)/i.test(trimmed)) {
    return trimmed;
  }
  switch (hocHamHocVi) {
    case "GIAO_SU":
      return `GS.TS. ${trimmed}`;
    case "PHO_GIAO_SU":
      return `PGS.TS. ${trimmed}`;
    case "TIEN_SI_KHOA_HOC":
      return `TSKH. ${trimmed}`;
    case "TIEN_SI":
    default:
      return `TS. ${trimmed}`;
  }
}

/**
 * Chuẩn hóa dữ liệu GVHD từ Backend + danh sách phân công hiệu lực thành SupervisorQuotaRecord
 */
export function mapBackendGvhdToSupervisorQuota(
  raw: BackendGvhdRaw,
  activeAssignments: BackendAssignmentRaw[] = []
): SupervisorQuotaRecord {
  const myAssignments = activeAssignments.filter(
    (a) => a.gvhdId === raw.id && a.trangThai === "DANG_HIEU_LUC"
  );

  const independentCount = myAssignments.filter(
    (a) => a.vaiTro === "HUONG_DAN_CHINH"
  ).length;
  const coCount = myAssignments.filter(
    (a) => a.vaiTro === "DONG_HUONG_DAN"
  ).length;

  const computedUsed = Number((independentCount * 1.0 + coCount * 0.5).toFixed(1));
  const rawCacheUsed =
    raw.soNcsDangHuongDan !== undefined
      ? Number(raw.soNcsDangHuongDan)
      : myAssignments[0]?.gvhd?.soNcsDangHuongDan !== undefined
      ? Number(myAssignments[0].gvhd.soNcsDangHuongDan)
      : undefined;

  const usedQuota =
    myAssignments.length > 0
      ? computedUsed
      : rawCacheUsed !== undefined && !isNaN(rawCacheUsed)
      ? Number(rawCacheUsed.toFixed(1))
      : 0;

  const maxQuota = Number(raw.maxNcsChoPhep ?? 3);
  const remainingQuota = Math.max(0, Number((maxQuota - usedQuota).toFixed(1)));
  const isFull = remainingQuota <= 0;

  const assignedStudents = myAssignments.map((a) => {
    const ncsName = a.ncs?.hoTen || "NCS";
    const mshv = a.ncs?.mshv ? ` (${a.ncs.mshv})` : "";
    const roleLabel = a.vaiTro === "HUONG_DAN_CHINH" ? "Độc lập" : "Đồng HD";
    return `${ncsName}${mshv} — ${roleLabel}`;
  });

  return {
    id: raw.id,
    name: formatSupervisorDisplayName(raw.hoTen, raw.hocHamHocVi),
    code: raw.maGv || "N/A",
    department: raw.donVi?.ten || raw.donVi?.parent?.ten || raw.chuyenNganh || "Chưa cập nhật đơn vị",
    degree: formatDegreeLabel(raw.hocHamHocVi),
    independentCount,
    coCount,
    usedQuota,
    maxQuota,
    remainingQuota,
    statusText: isFull
      ? "Đã đủ định mức"
      : `Còn ${remainingQuota.toFixed(1)} chỉ tiêu`,
    statusColor: isFull
      ? "bg-rose-100 text-rose-800 border-rose-200"
      : "bg-emerald-100 text-emerald-800 border-emerald-200",
    assignedStudents,
  };
}

/**
 * Service kết nối API Phân hệ Quản lý Giảng viên Hướng dẫn & Hạn ngạch (BR-09).
 * Gọi qua apiClient (tự động đính kèm Bearer Token từ NextAuth session).
 */
export const GvhdService = {
  /**
   * 1. Lấy danh sách toàn bộ GVHD kèm định mức & danh sách NCS đang hướng dẫn
   * Kết hợp GET /gvhd và GET /gvhd/assignments?trangThai=DANG_HIEU_LUC
   */
  getAllSupervisors: async (): Promise<SupervisorQuotaRecord[]> => {
    const [gvhdRes, assignmentsRes] = await Promise.all([
      apiClient.get<BackendGvhdRaw[]>("/gvhd"),
      apiClient
        .get<BackendAssignmentRaw[]>("/gvhd/assignments", {
          params: { trangThai: "DANG_HIEU_LUC" },
        })
        .catch(() => ({ data: [] as BackendAssignmentRaw[] })),
    ]);

    const gvhdList = unwrapArrayResponse<BackendGvhdRaw>(gvhdRes.data);
    const assignments = unwrapArrayResponse<BackendAssignmentRaw>(assignmentsRes.data);

    return gvhdList.map((raw) => mapBackendGvhdToSupervisorQuota(raw, assignments));
  },

  /**
   * 2. Lấy chi tiết 1 GVHD (bao gồm danh sách phân công hiệu lực)
   * Endpoint: GET /gvhd/:id
   */
  getSupervisorById: async (id: string): Promise<BackendGvhdRaw> => {
    const response = await apiClient.get<BackendGvhdRaw>(`/gvhd/${id}`);
    return response.data;
  },

  /**
   * 3. Lấy danh sách phân công GVHD (lọc theo NCS, GVHD, trạng thái)
   * Endpoint: GET /gvhd/assignments
   */
  getAssignments: async (params?: {
    ncsId?: string;
    gvhdId?: string;
    trangThai?: string;
  }): Promise<BackendAssignmentRaw[]> => {
    const response = await apiClient.get<BackendAssignmentRaw[]>("/gvhd/assignments", {
      params,
    });
    return unwrapArrayResponse<BackendAssignmentRaw>(response.data);
  },

  /**
   * 4. Tạo phân công GVHD mới cho NCS
   * Endpoint: POST /gvhd/assignments
   */
  createAssignment: async (
    payload: CreateAssignmentPayload
  ): Promise<BackendAssignmentRaw> => {
    const response = await apiClient.post<BackendAssignmentRaw>(
      "/gvhd/assignments",
      payload
    );
    return response.data;
  },

  /**
   * 5. Hủy phân công GVHD (hoàn trả định mức cho GVHD)
   * Endpoint: PATCH /gvhd/assignments/:id/deactivate
   */
  deactivateAssignment: async (
    id: string,
    lyDo: string
  ): Promise<BackendAssignmentRaw> => {
    const response = await apiClient.patch<BackendAssignmentRaw>(
      `/gvhd/assignments/${id}/deactivate`,
      { lyDo }
    );
    return response.data;
  },

  /**
   * 6. Lấy danh sách Quyết định phân công GVHD đang hiệu lực (loai = PHAN_CONG_GVHD)
   * Endpoint: GET /decisions
   */
  getAssignmentDecisions: async (
    ncsId?: string
  ): Promise<BackendAssignmentDecisionRaw[]> => {
    const response = await apiClient.get<BackendAssignmentDecisionRaw[]>("/decisions", {
      params: {
        loai: "PHAN_CONG_GVHD",
        trangThai: "HIEU_LUC",
        ...(ncsId ? { ncsId } : {}),
      },
    });
    return unwrapArrayResponse<BackendAssignmentDecisionRaw>(response.data);
  },

  /**
   * 7. Tải file Excel mẫu import GVHD
   * Endpoint: GET /gvhd/import/template
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await apiClient.get("/gvhd/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * 8. Upload file Excel xem trước dữ liệu GVHD
   * Endpoint: POST /gvhd/import/preview
   */
  previewImportExcel: async (file: File): Promise<Record<string, unknown>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<Record<string, unknown>>(
      "/gvhd/import/preview",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * 9. Xác nhận nạp file Excel GVHD vào cơ sở dữ liệu
   * Endpoint: POST /gvhd/import/confirm
   */
  confirmImportExcel: async (file: File): Promise<Record<string, unknown>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<Record<string, unknown>>(
      "/gvhd/import/confirm",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};
