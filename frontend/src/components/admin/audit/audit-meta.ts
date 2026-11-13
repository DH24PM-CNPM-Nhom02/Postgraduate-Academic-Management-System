import type {
  AuditActionType,
  AuditActorView,
  AuditLogItem,
  AuditNcsView,
} from "@/src/types/ui/admin";

/**
 * Kiểu mở rộng cho tầng UI Nhật ký kiểm toán, tương thích 100% với `AuditLogItem`
 * đồng thời hỗ trợ các trường hợp biên từ backend (actor null, clientIp, correlationId).
 */
export interface AuditLogViewItem
  extends Omit<AuditLogItem, "actor" | "ncs" | "ipAddress"> {
  actor: AuditActorView | null;
  actorId?: string;
  ipAddress?: string;
  clientIp?: string;
  correlationId?: string;
  ncs?: (AuditNcsView & { hoTen?: string }) | null;
}

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  NCS: "Hồ sơ NCS",
  NghienCuuSinh: "Hồ sơ NCS",
  NCS_BATCH: "Import danh sách NCS",
  THESIS: "Đề tài luận án",
  DeTai: "Đề tài luận án",
  SUPERVISOR_ASSIGNMENT: "Phân công GVHD",
  PhanCongGvhd: "Phân công GVHD",
  MILESTONE_PROGRESS: "Tiến độ 9 mốc",
  TienTrinhNcs: "Tiến độ 9 mốc",
  DECISION: "Quyết định",
  QuyetDinh: "Quyết định",
  CHANGE_REQUEST: "Đơn đề nghị điều chỉnh",
  DeNghiDieuChinh: "Đơn đề nghị điều chỉnh",
  GRADUATION: "Xét tốt nghiệp",
  TotNghiep: "Xét tốt nghiệp",
};

export function getEntityTypeLabel(entityType: string): string {
  return ENTITY_TYPE_LABELS[entityType] ?? entityType;
}

/**
 * Rút gọn ID/UUID dài để hiển thị gọn trong bảng kiểm toán.
 */
export function shortenEntityId(id: string, head = 8, tail = 4): string {
  if (!id) return "—";
  if (id.length <= head + tail + 3) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

/**
 * Định dạng thời gian đầy đủ dd/MM/yyyy HH:mm:ss.
 */
export function formatAuditDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Tính nhãn thời gian tương đối tiếng Việt từ mốc tham chiếu.
 */
export function formatRelativeAuditTime(
  iso: string,
  referenceDate: Date = new Date()
): string {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return "";

  const diffSeconds = Math.floor(
    (referenceDate.getTime() - target.getTime()) / 1000
  );
  if (diffSeconds < 0) return "Vừa mới";
  if (diffSeconds < 60) return "Vài giây trước";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} tháng trước`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} năm trước`;
}

/**
 * Tạo chuỗi correlationId fallback ổn định khi dữ liệu mock không cung cấp sẵn.
 */
export function getAuditCorrelationId(log: AuditLogViewItem): string {
  if (log.correlationId) return log.correlationId;
  return `corr-${log.id}-${log.entityId}`.toLowerCase();
}

export function getAuditClientIp(log: AuditLogViewItem): string {
  return log.clientIp || log.ipAddress || "Không ghi nhận";
}

export function getAuditNcsName(
  ncs?: (AuditNcsView & { hoTen?: string }) | null
): string | null {
  if (!ncs) return null;
  return ncs.fullName || ncs.hoTen || null;
}

export type AuditActionFilterValue = AuditActionType | "ALL";
