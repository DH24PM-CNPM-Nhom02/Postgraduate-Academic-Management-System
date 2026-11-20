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

export const DecisionService = {
  create: async (payload: CreateDecisionPayload): Promise<CreateDecisionResponse> => {
    try {
      const response = await apiClient.post<CreateDecisionResponse>("/decisions", payload);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
