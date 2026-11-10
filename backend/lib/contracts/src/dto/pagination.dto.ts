import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * DTO phân trang tùy chọn (Hybrid Pagination).
 * - Không truyền page/limit → Backend trả toàn bộ mảng T[] (cho TanStack Table client-side).
 * - Truyền page + limit   → Backend trả PaginatedResult<T> (server-side pagination).
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
