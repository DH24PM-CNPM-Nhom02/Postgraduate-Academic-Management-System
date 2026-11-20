import type { AuditLogApi } from "@/src/types/api/audit";
import type {
  AuditActionType,
  AuditActorView,
  AuditLogItem,
  AuditNcsView,
  SystemRole,
} from "@/src/types/ui/admin";

/**
 * Kiểu mở rộng cho tầng UI Nhật ký kiểm toán, tương thích 100% với `AuditLogItem`
 * đồng thời hỗ trợ các trường hợp biên từ backend (actor null, clientIp, correlationId).
 */
/** Người thao tác ở tầng hiển thị: `role` null khi backend không trả vai trò thuộc hệ thống */
export interface AuditActorViewModel extends Omit<AuditActorView, "role"> {
  role: SystemRole | null;
}

export interface AuditLogViewItem
  extends Omit<AuditLogItem, "actor" | "ncs" | "ipAddress"> {
  actor: AuditActorViewModel | null;
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
  // entityType thực tế backend ghi vào audit_log
  GiangVienHuongDan: "Giảng viên hướng dẫn",
  PhanCongHuongDan: "Phân công GVHD",
  PhieuNhanXet: "Phiếu nhận xét",
  XetTotNghiep: "Xét tốt nghiệp",
};

/** Danh sách entityType thực tế (phd-service) cho dropdown lọc */
export const BACKEND_AUDIT_ENTITY_OPTIONS: { value: string; label: string }[] = [
  { value: "NghienCuuSinh", label: "Hồ sơ NCS (NghienCuuSinh)" },
  { value: "GiangVienHuongDan", label: "Giảng viên hướng dẫn (GiangVienHuongDan)" },
  { value: "DeTai", label: "Đề tài luận án (DeTai)" },
  { value: "PhanCongHuongDan", label: "Phân công GVHD (PhanCongHuongDan)" },
  { value: "TienTrinhNcs", label: "Tiến độ 9 mốc (TienTrinhNcs)" },
  { value: "PhieuNhanXet", label: "Phiếu nhận xét (PhieuNhanXet)" },
  { value: "QuyetDinh", label: "Quyết định (QuyetDinh)" },
  { value: "DeNghiDieuChinh", label: "Đơn đề nghị (DeNghiDieuChinh)" },
  { value: "XetTotNghiep", label: "Xét tốt nghiệp (XetTotNghiep)" },
];

const ROLE_PRIORITY: SystemRole[] = ["ADMIN", "GIAO_VU", "GVHD", "NCS"];

/** Chuẩn hóa oldValue/newValue (Json) về object để AuditDiffViewer so sánh theo key */
function toRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return { giaTri: value };
}

/**
 * Chuyển 1 bản ghi `GET /audit-logs` sang kiểu hiển thị của bảng / dialog.
 * Backend không có trường `summary` → FE tự dựng mô tả ngắn từ action + đối tượng.
 */
export function mapAuditLogApiToView(
  log: AuditLogApi,
  getActionLabel: (action: string) => string
): AuditLogViewItem {
  const roles = log.actor?.roles ?? [];
  // Chỉ nhận vai trò thuộc SystemRole; vai trò lạ hoặc không có → null (không ép kiểu)
  const role: SystemRole | null = ROLE_PRIORITY.find((r) => roles.includes(r)) ?? null;

  return {
    id: log.id,
    action: log.action as AuditActionType,
    entityType: log.entityType,
    entityId: log.entityId,
    summary: `${getActionLabel(log.action)} • ${getEntityTypeLabel(log.entityType)}`,
    actorId: log.actorId,
    actor: log.actor
      ? {
          id: log.actor.id,
          username: log.actor.username,
          fullName: log.actor.fullName,
          // Không suy đoán vai trò khi auth-service không trả roles → null, UI hiển thị "Không rõ vai trò"
          role,
        }
      : null,
    ncs: log.ncs
      ? { id: log.ncs.id, mshv: log.ncs.mshv, fullName: log.ncs.hoTen, hoTen: log.ncs.hoTen }
      : null,
    oldValue: toRecord(log.oldValue),
    newValue: toRecord(log.newValue),
    clientIp: log.clientIp ?? undefined,
    correlationId: log.correlationId ?? undefined,
    createdAt: log.createdAt,
  };
}

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
 * correlationId thật từ backend; không tự sinh giá trị giả khi trống.
 */
export function getAuditCorrelationId(log: AuditLogViewItem): string {
  return log.correlationId || "Không ghi nhận";
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
