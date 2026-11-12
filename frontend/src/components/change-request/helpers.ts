import {
  Ban,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Hourglass,
  UserCog,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type {
  ChangeRequestItem,
  ChangeRequestStatus,
  ChangeRequestType,
} from "@/src/types/ui/change-request";

export function formatDateVi(iso?: string | null): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTimeVi(iso?: string | null): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} ${formatDateVi(iso)}`;
}

export function formatFileSize(bytes?: number): string | null {
  if (bytes === undefined || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Cộng thêm `months` tháng theo lịch UTC, xử lý kẹp ngày cuối tháng an toàn.
 */
export function addMonthsUtc(iso: string, months: number): string | null {
  const base = new Date(iso);
  if (Number.isNaN(base.getTime()) || !Number.isInteger(months)) return null;

  const startYear = base.getUTCFullYear();
  const startMonth = base.getUTCMonth();
  const startDay = base.getUTCDate();

  const totalMonths = startMonth + months;
  const targetYear = startYear + Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;

  const daysInTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();
  const clampedDay = Math.min(startDay, daysInTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      clampedDay,
      base.getUTCHours(),
      base.getUTCMinutes(),
      base.getUTCSeconds()
    )
  ).toISOString();
}

/**
 * So sánh theo ngày UTC (bỏ qua lệch giờ) xem `dateAIso` có muộn hơn `dateBIso` không.
 */
export function isUtcDayAfter(dateAIso: string, dateBIso: string): boolean {
  const a = new Date(dateAIso);
  const b = new Date(dateBIso);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
  const dayA = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const dayB = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return dayA > dayB;
}

export function isPendingRequestStatus(status: ChangeRequestStatus): boolean {
  return status === "CHO_GVHD_XAC_NHAN" || status === "CHO_DUYET";
}

export const CHANGE_REQUEST_TYPE_META: Record<
  ChangeRequestType,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
    Icon: LucideIcon;
  }
> = {
  DOI_DE_TAI: {
    label: "Điều chỉnh đề tài luận án",
    shortLabel: "Đổi đề tài",
    description: "Cập nhật tên đề tài luận án theo góp ý chuyên môn hoặc bất khả kháng",
    badgeClass: "border-blue-200 bg-blue-50 text-[#164E9B]",
    Icon: BookOpen,
  },
  DOI_GVHD: {
    label: "Thay đổi giảng viên hướng dẫn",
    shortLabel: "Đổi GVHD",
    description: "Đề xuất thay thế người hướng dẫn chính hoặc đồng hướng dẫn",
    badgeClass: "border-indigo-200 bg-indigo-50 text-indigo-800",
    Icon: UserCog,
  },
  GIA_HAN: {
    label: "Gia hạn thời gian học tập",
    shortLabel: "Gia hạn",
    description: "Xin gia hạn thêm tối đa tích lũy 24 tháng (trong trần 72 tháng)",
    badgeClass: "border-slate-200 bg-slate-100 text-[#0F2744]",
    Icon: CalendarClock,
  },
};

export const CHANGE_REQUEST_STATUS_META: Record<
  ChangeRequestStatus,
  {
    label: string;
    badgeClass: string;
    Icon: LucideIcon;
  }
> = {
  CHO_GVHD_XAC_NHAN: {
    label: "Chờ GVHD xác nhận",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    Icon: Hourglass,
  },
  CHO_DUYET: {
    label: "Chờ Phòng ĐT-SĐH duyệt",
    badgeClass: "border-blue-200 bg-blue-50 text-[#164E9B]",
    Icon: Clock,
  },
  DA_DUYET: {
    label: "Đã phê duyệt",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Icon: CheckCircle2,
  },
  TU_CHOI: {
    label: "Từ chối",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-800",
    Icon: XCircle,
  },
  DA_HUY: {
    label: "Đã hủy",
    badgeClass: "border-border bg-muted text-muted-foreground",
    Icon: Ban,
  },
};

export function summarizeChangeRequest(request: ChangeRequestItem): string {
  switch (request.loaiDon) {
    case "DOI_DE_TAI":
      return request.tenDeTaiMoi
        ? `Đề tài mới: ${request.tenDeTaiMoi}`
        : request.lyDo;
    case "DOI_GVHD":
      if (request.tenGvhdCu && request.tenGvhdMoi) {
        return `${request.tenGvhdCu} → ${request.tenGvhdMoi}`;
      }
      return request.tenGvhdMoi
        ? `Đề xuất GVHD mới: ${request.tenGvhdMoi}`
        : request.lyDo;
    case "GIA_HAN": {
      const months = request.soThangGiaHan
        ? `Gia hạn +${request.soThangGiaHan} tháng`
        : "Gia hạn học tập";
      return request.hanMoiDuKien
        ? `${months} (đến ${formatDateVi(request.hanMoiDuKien)})`
        : months;
    }
  }
}
