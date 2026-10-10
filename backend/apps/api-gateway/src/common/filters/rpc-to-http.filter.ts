import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch()
export class RpcToHttpFilter implements ExceptionFilter {
  catch(ex: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    if (ex instanceof HttpException) return res.status(ex.getStatus()).json(ex.getResponse());
    if (ex?.statusCode) return res.status(ex.statusCode).json(ex); // lỗi từ RpcException
    if (ex?.name === 'TimeoutError') return res.status(504).json({ statusCode: 504, message: 'Service phản hồi quá chậm' });
    if (String(ex?.message).includes('ECONNREFUSED')) {
      return res.status(503).json({ statusCode: 503, message: 'Service không khả dụng' });
    }
    return res.status(500).json({ statusCode: 500, message: 'Lỗi hệ thống' });
  }
}