import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    if (req.user?.id) return `user:${req.user.id}`;                  // đã đăng nhập: đếm theo user
    if (req.body?.username) return `login:${String(req.body.username).toLowerCase()}`; // đăng nhập: đếm theo username
    return `ip:${req.ip}`;                                           // còn lại: đếm theo IP
  }
}