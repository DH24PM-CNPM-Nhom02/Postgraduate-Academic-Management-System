import { RpcException } from '@nestjs/microservices';
import type { Prisma } from '../generated/prisma/index.js';

// INSERT ... ON DUPLICATE KEY UPDATE takes a row lock until the caller commits.
// Both deletion and attachment acquire it before reading any business records.
export async function lockDocument(tx: Prisma.TransactionClient, id: string) {
  await tx.$executeRaw`
    INSERT INTO document_link_guard (document_id, deleting) VALUES (${id}, false)
    ON DUPLICATE KEY UPDATE document_id = VALUES(document_id)
  `;
}

export async function guardDocumentAttachment(
  tx: Prisma.TransactionClient,
  id?: string | null,
) {
  if (!id) return;
  await lockDocument(tx, id);
  const guard = await tx.documentLinkGuard.findUniqueOrThrow({
    where: { documentId: id },
  });
  if (guard.deleting) {
    throw new RpcException({
      statusCode: 409,
      message: 'Tài liệu đã được yêu cầu xóa. Vui lòng chọn tệp khác.',
    });
  }
}
