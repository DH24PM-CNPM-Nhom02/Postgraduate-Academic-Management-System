import type { PaginatedResult } from '../../../../lib/contracts/src/dto/pagination.dto.js';

/**
 * Hybrid Pagination Helper cho Prisma.
 * - page VÀ limit đều được truyền → trả PaginatedResult<R> (server-side pagination).
 * - Không truyền page/limit → trả R[] thuần (toàn bộ dữ liệu, cho TanStack Table client-side).
 * - Hỗ trợ tùy chọn transform: (item) => ... để định dạng lại dữ liệu trước khi trả về.
 */
export async function paginatePrisma<T, R = T>(
  model: any,
  params: {
    page?: number;
    limit?: number;
    where?: any;
    orderBy?: any;
    select?: any;
    include?: any;
    transform?: (item: T) => R;
  },
): Promise<R[] | PaginatedResult<R>> {
  const { where, orderBy, select, include, transform } = params;
  const wantPagination = params.page != null && params.limit != null;

  const queryBase: any = {
    ...(where !== undefined && { where }),
    ...(orderBy !== undefined && { orderBy }),
    ...(select !== undefined && { select }),
    ...(include !== undefined && { include }),
  };

  if (!wantPagination) {
    // Trả toàn bộ mảng — giữ nguyên hành vi hiện tại cho TanStack Table
    const data = await model.findMany(queryBase);
    return transform ? data.map(transform) : data;
  }

  // Server-side pagination
  const page = Math.max(1, Number(params.page));
  const limit = Math.min(100, Math.max(1, Number(params.limit)));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({ ...queryBase, skip, take: limit }),
    model.count(where !== undefined ? { where } : {}),
  ]);

  return {
    data: transform ? data.map(transform) : data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
