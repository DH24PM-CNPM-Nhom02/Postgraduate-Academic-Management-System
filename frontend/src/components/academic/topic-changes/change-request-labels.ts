import type { DecisionType } from "@/src/services/decision";
import type { ChangeRequestStatus, ChangeRequestSupervisor, ChangeRequestType } from "@/src/types/api/change-request";

export const REQUEST_TYPES = [
  { value: "DOI_DE_TAI", label: "Đổi đề tài", decisionType: "GIAO_DE_TAI" },
  { value: "DOI_GVHD", label: "Đổi GVHD", decisionType: "PHAN_CONG_GVHD" },
  { value: "GIA_HAN", label: "Gia hạn học tập", decisionType: "GIA_HAN" },
] satisfies { value: ChangeRequestType; label: string; decisionType: DecisionType }[];

export const REQUEST_STATUSES: Record<ChangeRequestStatus, { label: string; color: string }> = {
  CHO_DUYET: { label: "Chờ Giáo vụ duyệt", color: "border-amber-200 bg-amber-50 text-amber-800" },
  CHO_GVHD_XAC_NHAN: { label: "Chờ GVHD xác nhận", color: "border-blue-200 bg-blue-50 text-blue-800" },
  DA_DUYET: { label: "Đã duyệt", color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  TU_CHOI: { label: "Từ chối", color: "border-rose-200 bg-rose-50 text-rose-800" },
  DA_HUY: { label: "Đã hủy", color: "border-slate-200 bg-slate-50 text-slate-600" },
};

export const REQUEST_STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  ...Object.entries(REQUEST_STATUSES).map(([value, { label }]) => ({ value, label })),
];

export const STUDY_STATUSES: Record<string, string> = {
  DANG_HOC: "Đang học",
  GIA_HAN: "Gia hạn",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
  TOT_NGHIEP: "Tốt nghiệp",
};

const ACADEMIC_TITLES: Record<string, string> = {
  GIAO_SU: "GS.",
  PHO_GIAO_SU: "PGS.",
  TIEN_SI_KHOA_HOC: "TSKH.",
  TIEN_SI: "TS.",
};

export function supervisorName(supervisor: Pick<ChangeRequestSupervisor, "hoTen" | "hocHamHocVi"> | null | undefined) {
  if (!supervisor) return "—";
  const title = supervisor.hocHamHocVi;
  return title ? `${ACADEMIC_TITLES[title] ?? title} ${supervisor.hoTen}` : supervisor.hoTen;
}
