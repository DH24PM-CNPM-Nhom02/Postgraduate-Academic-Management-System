import { RpcException } from '@nestjs/microservices';
import type { Prisma } from '../generated/prisma/index.js';

// Khóa trước lần đọc đầu tiên để thấy cả lượt giao vừa commit trong khi chờ khóa.
export async function lockThesisDecision(tx: Prisma.TransactionClient, id: string) {
  await tx.$queryRaw`SELECT id FROM quyet_dinh WHERE id = ${id} FOR UPDATE`;
}

export async function assertUnusedThesisDecision(tx: Prisma.TransactionClient, quyetDinhId: string) {
  const usages = await tx.deTai.count({ where: { quyetDinhId } });
  if (usages > 0) {
    throw new RpcException({
      statusCode: 409,
      message: 'Quyết định này đã được dùng để giao đề tài. Vui lòng chọn quyết định giao đề tài mới.',
    });
  }
}
