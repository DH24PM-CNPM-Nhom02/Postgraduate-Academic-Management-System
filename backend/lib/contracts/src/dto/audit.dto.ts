import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from './pagination.dto.js';

export class ListAuditQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsUUID()
  ncsId?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}

export interface AuditActorView {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  roles?: string[];
}

export interface AuditNcsView {
  id: string;
  mshv: string;
  hoTen: string;
}

export interface AuditLogItemDto {
  id: string;
  actorId: string;
  actor?: AuditActorView | null;
  action: string;
  entityType: string;
  entityId: string;
  ncsId?: string | null;
  ncs?: AuditNcsView | null;
  oldValue: unknown;
  newValue: unknown;
  clientIp?: string | null;
  correlationId?: string | null;
  createdAt: Date | string;
}
