import { SkipThrottle, Throttle } from '@nestjs/throttler';

const MIN = 60_000; // 1 phút (đơn vị mili giây)

export const LimitStrict    = () => Throttle({ default: { limit: 5,  ttl: MIN } }); // bảo mật, parse Excel
export const LimitBulk      = () => Throttle({ default: { limit: 3,  ttl: MIN } }); // tạo hàng loạt
export const LimitMedium    = () => Throttle({ default: { limit: 10, ttl: MIN } }); // upload, thao tác nhạy cảm
export const LimitHeavyRead = () => Throttle({ default: { limit: 30, ttl: MIN } }); // đọc nặng

// Bỏ qua CẢ 2 quy tắc (default và write)
export const SkipAllLimits  = () => SkipThrottle({ default: true, write: true });