/**
 * types/api/audit.ts
 *
 * DTO khớp Backend:
 * - GET /audit-logs        (ListAuditQueryDto, lib/contracts/src/dto/audit.dto.ts)
 * - GET /audit-logs/:id    (AuditLogItemDto)
 * Quyền: `audit.read` (seed chỉ cấp cho ADMIN).
 */

/** Thông tin người thao tác (auth-service `auth.find-users-by-ids`) */
export interface AuditActorApi {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  roles?: string[];
}

/** NCS liên quan (phd-service) */
export interface AuditNcsApi {
  id: string;
  mshv: string;
  hoTen: string;
}

/** 1 bản ghi nhật ký kiểm toán */
export interface AuditLogApi {
  id: string;
  actorId: string;
  /** null khi không tra được tài khoản từ auth-service */
  actor: AuditActorApi | null;
  action: string;
  entityType: string;
  entityId: string;
  ncsId: string | null;
  ncs: AuditNcsApi | null;
  oldValue: unknown;
  newValue: unknown;
  clientIp: string | null;
  correlationId: string | null;
  createdAt: string;
}

/** Query `GET /audit-logs` (page + limit → server-side pagination, tối đa limit 100) */
export interface ListAuditQueryParams {
  page: number;
  limit: number;
  /** Backend quét action, entityType, entityId, actorId và Họ tên / MSHV của NCS */
  search?: string;
  /** `contains` */
  action?: string;
  /** `contains` */
  entityType?: string;
  entityId?: string;
  actorId?: string;
  ncsId?: string;
  /** YYYY-MM-DD hoặc ISO */
  fromDate?: string;
  /** YYYY-MM-DD → backend tự lấy đến 23:59:59.999 */
  toDate?: string;
}

export interface PaginatedAuditResponse {
  data: AuditLogApi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
