import { apiClient, throwApiError } from "@/src/lib/api";

export const DECISION_TYPES = [
  "GIAO_DE_TAI",
  "PHAN_CONG_GVHD",
  "THANH_LAP_TIEU_BAN",
  "CAN_CU_DUYET_MOC",
  "CONG_NHAN_TOT_NGHIEP",
  "GIA_HAN",
  "BAO_LUU",
  "NGUNG_HOC",
  "BUOC_THOI_HOC",
  "HOC_TIEP",
  "KHAC",
] as const;

export type DecisionType = (typeof DECISION_TYPES)[number];

export interface CreateDecisionPayload {
  loai: DecisionType;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  ncsIds: string[];
  fileId: string;
  ghiChu?: string;
  hanMoi?: string;
}

export interface CreateDecisionResponse {
  quyetDinhs: Array<{ id: string; ncsId: string | null; soQuyetDinh: string }>;
  canhBao: string[];
}

export interface BackendDecision {
  id: string;
  ncsId: string | null;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  loai: DecisionType;
  trangThai: "HIEU_LUC" | "DEACTIVATE";
  ncs: { mshv: string; hoTen: string } | null;
  fileId: string | null;
  ghiChu: string | null;
  createdAt: string;
}

interface DecisionListFilters {
  ncsId?: string;
  loai?: DecisionType;
  trangThai?: BackendDecision["trangThai"];
  soQuyetDinh?: string;
}

export const DecisionService = {
  list: async (signal?: AbortSignal, params?: DecisionListFilters): Promise<import("@/src/types/academic").DecisionItem[]> => {
    try {
      const response = await apiClient.get<BackendDecision[] | { data: BackendDecision[] }>("/decisions", {
        signal,
        params,
        timeout: 15_000,
      });
      const items = Array.isArray(response.data) ? response.data : response.data.data;
      return items.map((item) => ({
        ...item,
        ngayQuyetDinh: item.ngayQuyetDinh.slice(0, 10),
        trangThai: item.trangThai === "DEACTIVATE" ? "VO_HIEU_HOA" : "HIEU_LUC",
        ncs: item.ncs && item.ncsId ? { ...item.ncs, id: item.ncsId } : null,
        ngayTao: item.createdAt,
      }));
    } catch (error) {
      throwApiError(error);
    }
  },
  deactivate: async (id: string, lyDo: string): Promise<{ canhBao: string[] }> => {
    try {
      const response = await apiClient.patch<{ canhBao: string[] }>(`/decisions/${id}/deactivate`, { lyDo });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
  create: async (payload: CreateDecisionPayload): Promise<CreateDecisionResponse> => {
    try {
      const response = await apiClient.post<CreateDecisionResponse>("/decisions", payload);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
