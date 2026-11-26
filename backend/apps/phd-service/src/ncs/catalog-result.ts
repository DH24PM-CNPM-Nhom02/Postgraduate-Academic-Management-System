import { RpcException } from '@nestjs/microservices';
import { Prisma } from '../generated/prisma/index.js';

export async function catalogResult<T>(operation: Promise<T>, label: string) {
  try {
    return await operation;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') throw new RpcException({ statusCode: 409, message: `Mã ${label} đã tồn tại.` });
      if (error.code === 'P2003') throw new RpcException({ statusCode: 409, message: `Không thể xóa ${label} đang được sử dụng trong hồ sơ NCS.` });
      if (error.code === 'P2025') throw new RpcException({ statusCode: 404, message: `Không tìm thấy ${label}.` });
    }
    throw error;
  }
}

export function requireCatalogChanges(data: object) {
  if (Object.values(data).every(value => value === undefined)) {
    throw new RpcException({ statusCode: 400, message: 'Chưa có trường nào để cập nhật.' });
  }
}
