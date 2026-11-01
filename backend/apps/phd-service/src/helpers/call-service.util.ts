import { RpcException, type ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';

// Gọi service khác qua TCP, lỗi thì giữ nguyên statusCode (403/404...) để trả về client
export function goiService<T>(client: ClientProxy, cmd: string, payload: unknown, ms = 5000): Promise<T> {
  return firstValueFrom(
    client.send<T>({ cmd }, payload).pipe(
      timeout(ms),
      catchError((err) =>
        throwError(
          () =>
            new RpcException(
              err?.statusCode ? err : { statusCode: 502, message: 'Không gọi được service' },
            ),
        ),
      ),
    ),
  );
}