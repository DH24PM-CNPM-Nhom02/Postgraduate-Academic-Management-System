import type { ChangeRequestStatus } from "@/src/types/ui/change-request";
import type { EvidenceStatus } from "@/src/types/ui/progress";
import type {
  SupervisorProxyRequestType,
  SupervisorRole,
} from "@/src/types/ui/supervisor";

export function formatSupervisorDateUtc(
  isoString?: string | null,
  includeTime = false
): string {
  if (!isoString) return "--/--/----";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hh}:${mm}`;
}

export function formatFileSizeBytes(bytes?: number): string | null {
  if (bytes === undefined || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getRoleShortLabel(role: SupervisorRole): string {
  if (role === "HUONG_DAN_CHINH") return "Hướng dẫn chính (1.0)";
  if (role === "DONG_HUONG_DAN") return "Đồng hướng dẫn (0.5)";
  return "Chưa xác định";
}

export function getMilestoneEvidenceStatusMeta(status: EvidenceStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "PASSED":
      return {
        label: "Đã duyệt",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "REJECTED":
      return {
        label: "Cần bổ sung",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "PENDING_REVIEW":
    default:
      return {
        label: "Đang chờ duyệt",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
      };
  }
}

export function getSupervisorRequestStatusMeta(status: ChangeRequestStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "CHO_GVHD_XAC_NHAN":
      return {
        label: "Chờ GVHD thẩm định",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
      };
    case "CHO_DUYET":
      return {
        label: "Chờ Giáo vụ duyệt",
        badgeClass: "border-[#164E9B]/25 bg-[#164E9B]/10 text-[#164E9B]",
      };
    case "DA_DUYET":
      return {
        label: "Đã phê duyệt",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "TU_CHOI":
      return {
        label: "Từ chối",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "DA_HUY":
    default:
      return {
        label: "Đã thu hồi / Hủy",
        badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
      };
  }
}

export const PROXY_REQUEST_TYPE_META: Record<
  SupervisorProxyRequestType,
  { label: string; badgeClass: string }
> = {
  DOI_DE_TAI: {
    label: "Đổi đề tài",
    badgeClass: "border-[#164E9B]/25 bg-[#164E9B]/10 text-[#164E9B]",
  },
  DOI_GVHD: {
    label: "Đổi GVHD",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-800",
  },
};
