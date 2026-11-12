import type { AuditActionType } from "@/src/types/ui/admin";

export interface AuditActionMeta {
  label: string;
  group: string;
  badgeClass: string;
}

export const AUDIT_ACTION_META: Record<AuditActionType, AuditActionMeta> = {
  // Hồ sơ NCS
  NCS_CREATE: {
    label: "Thêm mới hồ sơ NCS",
    group: "Hồ sơ NCS",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/70 dark:bg-blue-950/60 dark:text-blue-300",
  },
  NCS_IMPORT: {
    label: "Thêm mới hồ sơ NCS",
    group: "Hồ sơ NCS",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/70 dark:bg-blue-950/60 dark:text-blue-300",
  },
  NCS_UPDATE: {
    label: "Cập nhật thông tin NCS",
    group: "Hồ sơ NCS",
    badgeClass:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  NCS_STATUS_UPDATE: {
    label: "Đổi trạng thái học tập NCS",
    group: "Hồ sơ NCS",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300",
  },

  // Đề tài Luận án
  THESIS_ASSIGN: {
    label: "Giao đề tài luận án",
    group: "Đề tài Luận án",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-800/70 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
  THESIS_CANCEL: {
    label: "Hủy phân công đề tài",
    group: "Đề tài Luận án",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300",
  },

  // Phân công GVHD
  ASSIGNMENT_CREATE: {
    label: "Phân công GVHD",
    group: "Phân công GVHD",
    badgeClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  ASSIGNMENT_DEACTIVATE: {
    label: "Hủy phân công GVHD",
    group: "Phân công GVHD",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300",
  },

  // Tiến độ 9 Mốc
  SUBMIT_PROGRESS: {
    label: "Nộp minh chứng mốc",
    group: "Tiến độ 9 Mốc",
    badgeClass:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/70 dark:bg-purple-950/60 dark:text-purple-300",
  },
  APPROVE_PROGRESS: {
    label: "Phê duyệt đạt mốc",
    group: "Tiến độ 9 Mốc",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  REJECT_PROGRESS: {
    label: "Từ chối minh chứng mốc",
    group: "Tiến độ 9 Mốc",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300",
  },

  // Quyết định
  TAO_QUYET_DINH: {
    label: "Ban hành quyết định",
    group: "Quyết định",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/70 dark:bg-blue-950/60 dark:text-blue-300",
  },
  VO_HIEU_QUYET_DINH: {
    label: "Vô hiệu hóa quyết định",
    group: "Quyết định",
    badgeClass:
      "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800/70 dark:bg-orange-950/60 dark:text-orange-300",
  },

  // Đơn đề nghị
  CHANGE_REQUEST_CREATE: {
    label: "Gửi đơn đề nghị",
    group: "Đơn đề nghị",
    badgeClass:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  CHANGE_REQUEST_GVHD_APPROVE: {
    label: "GVHD xác nhận đơn",
    group: "Đơn đề nghị",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300",
  },
  CHANGE_REQUEST_APPROVE: {
    label: "Giáo vụ duyệt đơn đề nghị",
    group: "Đơn đề nghị",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  CHANGE_REQUEST_REJECT: {
    label: "Từ chối đơn đề nghị",
    group: "Đơn đề nghị",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300",
  },
  CHANGE_REQUEST_CANCEL: {
    label: "Hủy đơn đề nghị",
    group: "Đơn đề nghị",
    badgeClass:
      "border-slate-300 bg-background text-slate-600 dark:border-slate-700 dark:text-slate-300",
  },

  // Tốt nghiệp
  XAC_NHAN_TOT_NGHIEP: {
    label: "Xác nhận hoàn tất tốt nghiệp",
    group: "Tốt nghiệp",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
};

export function getAuditActionMeta(action: string): AuditActionMeta {
  if (action in AUDIT_ACTION_META) {
    return AUDIT_ACTION_META[action as AuditActionType];
  }
  return {
    label: action || "Hành động hệ thống",
    group: "Khác",
    badgeClass:
      "border-border bg-muted text-muted-foreground",
  };
}

export interface AuditBadgeProps {
  action: AuditActionType | string;
  showCode?: boolean;
  className?: string;
}

export function AuditBadge({
  action,
  showCode = false,
  className = "",
}: AuditBadgeProps) {
  const meta = getAuditActionMeta(action);

  return (
    <span
      title={action}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${meta.badgeClass} ${className}`}
    >
      <span>{meta.label}</span>
      {showCode && (
        <span className="font-mono text-[10px] opacity-75">({action})</span>
      )}
    </span>
  );
}

export default AuditBadge;
