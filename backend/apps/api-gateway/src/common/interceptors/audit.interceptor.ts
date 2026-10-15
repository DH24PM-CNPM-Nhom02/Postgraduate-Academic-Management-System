import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditTrail');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
    req.correlationId = correlationId;
    if (res.setHeader) {
      res.setHeader('x-correlation-id', correlationId);
    }

    const { method, originalUrl, ip } = req;
    const user = req.user ? `${req.user.username} (${req.user.id})` : 'Anonymous';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode;
          this.logger.log(
            `[${correlationId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms | User: ${user} | IP: ${ip}`,
          );
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err?.status || err?.statusCode || 500;
          this.logger.warn(
            `[${correlationId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms | User: ${user} | IP: ${ip} | Error: ${err?.message}`,
          );
        },
      }),
    );
  }
}
