# Quy tắc Rate Limit - PAMS API Gateway

Tài liệu này gom toàn bộ quy tắc rate limit của `apps/api-gateway`. Mục đích: ai thêm API mới cũng biết cần gắn giới hạn gì, và vì sao cấu hình như hiện tại.

## 1. Nguyên tắc chung

1. **Chỉ rate limit ở API Gateway.** Các service phía sau (auth, phd, document, notification) giao tiếp qua TCP trong mạng nội bộ, không mở ra ngoài.
2. **Dùng `@nestjs/throttler`** (bản 6.x, tương thích NestJS 12), lưu bộ đếm trong bộ nhớ của gateway.
3. **Bộ đếm tính riêng cho từng route.** Mỗi API có bộ đếm 100 lần/phút của riêng nó, không phải tổng 100 lần cho mọi API.
4. **Mặc định là an toàn.** API mới không cần ghi gì vẫn được bảo vệ bởi 2 quy tắc chung (mục 3). Chỉ gắn thêm khi API thuộc nhóm đặc biệt (mục 4).
5. **Mọi con số nằm ở một chỗ** (`rate-limit.decorator.ts` và `ThrottlerModule.forRoot`). Không viết số trực tiếp trong controller.

## 2. Đếm theo ai (tracker)

Thứ tự ưu tiên, kiểm tra từ trên xuống:

| Điều kiện | Khóa đếm | Lý do |
|---|---|---|
| Có `req.user.id` (đã đăng nhập) | `user:<id>` | Mỗi người dùng một bộ đếm riêng |
| Body có `username` (đăng nhập) | `login:<username viết thường>` | Xem lưu ý bên dưới |
| Còn lại | `ip:<req.ip>` | API public như `/ping` |

**Lưu ý quan trọng về đăng nhập:** frontend đăng nhập qua NextAuth ở server Next.js, rồi server này gọi gateway qua `API_INTERNAL_URL`. Vì vậy gateway thấy mọi lượt đăng nhập đến từ **cùng một IP** (IP container frontend). Nếu đếm đăng nhập theo IP thì cả trường dùng chung một giới hạn. Do đó đăng nhập phải đếm theo `username`.

File: `apps/api-gateway/src/common/guards/app-throttler.guard.ts`

```ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    if (req.user?.id) return `user:${req.user.id}`;
    if (req.body?.username) return `login:${String(req.body.username).toLowerCase()}`;
    return `ip:${req.ip}`;
  }
}
```

## 3. Hai quy tắc chung (áp dụng tự động)

Cấu hình trong `auth/auth.module.ts`:

```ts
ThrottlerModule.forRoot([
  // Quy tắc 1: mọi API được 100 lần/phút
  { name: 'default', ttl: 60_000, limit: 100 },
  // Quy tắc 2: API ghi dữ liệu (không phải GET) chỉ được 30 lần/phút
  {
    name: 'write',
    ttl: 60_000,
    limit: 30,
    skipIf: (ctx) => ctx.switchToHttp().getRequest().method === 'GET',
  },
]),
```

| Quy tắc | Áp dụng cho | Giới hạn | Khóa đếm |
|---|---|---|---|
| `default` | Mọi API | 100 lần/phút | Theo mục 2 |
| `write` | Mọi API khác `GET` (POST, PATCH, PUT, DELETE) | 30 lần/phút | Theo mục 2 |

Một API ghi dữ liệu chịu cả hai quy tắc, cái nào chạm trần trước thì trả 429.

**Thứ tự guard bắt buộc** (trong `providers` của `AuthModule`): `AppThrottlerGuard` phải nằm **ngay sau `JwtAuthGuard`**, để `req.user` đã có khi đếm.

```ts
{ provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_GUARD, useClass: AppThrottlerGuard },   // sau JwtAuthGuard
{ provide: APP_GUARD, useClass: MustChangePasswordGuard },
{ provide: APP_GUARD, useClass: PermissionGuard },
```

## 4. Các mức giới hạn riêng (decorator dùng lại)

File: `apps/api-gateway/src/common/decorators/rate-limit.decorator.ts`

```ts
import { SkipThrottle, Throttle } from '@nestjs/throttler';

const MIN = 60_000; // 1 phút (mili giây)

export const LimitStrict    = () => Throttle({ default: { limit: 5,  ttl: MIN } }); // bảo mật, parse Excel
export const LimitBulk      = () => Throttle({ default: { limit: 3,  ttl: MIN } }); // tạo hàng loạt
export const LimitMedium    = () => Throttle({ default: { limit: 10, ttl: MIN } }); // upload, thao tác nhạy cảm
export const LimitHeavyRead = () => Throttle({ default: { limit: 30, ttl: MIN } }); // đọc nặng

// Bỏ qua CẢ 2 quy tắc (default và write)
export const SkipAllLimits  = () => SkipThrottle({ default: true, write: true });
```

| Decorator | Giới hạn | Dùng khi |
|---|---|---|
| `@LimitStrict()` | 5 lần/phút | Liên quan mật khẩu, hoặc parse file Excel |
| `@LimitBulk()` | 3 lần/phút | Tạo tài khoản/hồ sơ hàng loạt (bước xác nhận import) |
| `@LimitMedium()` | 10 lần/phút | Upload file, tạo tài khoản, reset mật khẩu, API public gọi nhiều service |
| `@LimitHeavyRead()` | 30 lần/phút | Đọc nặng: trả nguyên danh sách, tải file |
| `@SkipAllLimits()` | Không giới hạn | Health check, refresh/logout (xem mục 5) |

Lưu ý: `@SkipThrottle()` không tham số chỉ bỏ qua quy tắc `default`, không bỏ qua `write`. Vì vậy phải dùng `SkipAllLimits()`.

## 5. Danh sách API gắn mức riêng

| API | Controller | Mức | Giới hạn | Lý do |
|---|---|---|---|---|
| `POST /auth/login` | auth | `@LimitStrict()` | 5/phút/username | Mật khẩu ban đầu = MSHV, dễ bị dò |
| `POST /auth/change-password` | auth | `@LimitStrict()` | 5/phút | Chống dò `oldPassword` bằng token bị lộ |
| `POST /auth/users` | auth | `@LimitMedium()` | 10/phút | Tạo tài khoản hàng loạt |
| `PATCH /auth/users/:id/reset-password` | auth | `@LimitMedium()` | 10/phút | Thao tác nhạy cảm |
| `POST /documents/upload` | documents | `@LimitMedium()` | 10/phút | PDF tối đa 15MB, chuyển qua TCP dạng base64 |
| `GET /documents/:id/download` | documents | `@LimitHeavyRead()` | 30/phút | Đọc cả file vào bộ nhớ, timeout 60 giây |
| `POST /ncs/import/preview` | ncs | `@LimitStrict()` | 5/phút | Parse Excel |
| `POST /ncs/import/confirm` | ncs | `@LimitBulk()` | 3/phút | Tạo tài khoản hàng loạt |
| `GET /ncs` | ncs | `@LimitHeavyRead()` | 30/phút | Không truyền page/limit thì trả toàn bộ danh sách |
| `POST /gvhd/batch` | gvhd | `@LimitStrict()` | 5/phút | Tạo hàng loạt |
| `POST /gvhd/import/preview` | gvhd | `@LimitStrict()` | 5/phút | Parse Excel |
| `POST /gvhd/import/confirm` | gvhd | `@LimitBulk()` | 3/phút | Tạo tài khoản hàng loạt |
| `GET /gvhd` | gvhd | `@LimitHeavyRead()` | 30/phút | Trả toàn bộ danh sách |
| `GET /ping` | api-gateway | `@LimitMedium()` | 10/phút/IP | Public, nhưng gọi tới cả 4 service |

### API bỏ qua giới hạn (`@SkipAllLimits()`)

| API | Lý do |
|---|---|
| `GET /health` | Docker healthcheck không được bị chặn |
| `POST /auth/refresh` | Do NextAuth gọi từ server nên không phân biệt được người dùng; refresh token là chuỗi ngẫu nhiên, khó bị dò |
| `POST /auth/logout` | Như `refresh` |

### API không cần gắn gì (dùng quy tắc chung)

Toàn bộ API còn lại: `progress`, `decisions`, `change-request`, `thesis`, `graduation`, `notifications`, `audit-logs`, các API `GET` chi tiết, và các API `PATCH`/`PUT`/`DELETE` thông thường. API `GET` chịu 100 lần/phút, API ghi dữ liệu chịu 30 lần/phút.

## 6. Cách gắn vào controller

```ts
import { LimitStrict } from '../common/decorators/rate-limit.decorator.js';

@Post('import/preview')
@LimitStrict()
@RequirePermissions(PERMISSIONS.NCS_CREATE)
@UseInterceptors(FileInterceptor('file', uploadOptions))
async importPreview(...) { ... }
```

Quy ước đặt decorator:

- Đặt dòng rate limit **ngay trên `@RequirePermissions`** (hoặc ngay dưới `@Post`/`@Get` nếu route không có `@RequirePermissions`).
- Thứ tự giữa các decorator metadata (`@Throttle`, `@Public`, `@RequirePermissions`, `@Post`...) **không ảnh hưởng** kết quả. Đây chỉ là quy ước để code đồng nhất.
- Mỗi route chỉ dùng **một** decorator rate limit. Nếu có hai `@Throttle` trên cùng một route thì cái ghi sau thắng.
- Có thể đặt decorator trên `@Controller(...)` để áp dụng cho cả controller.

## 7. Khi thêm API mới, làm theo thứ tự này

1. API có là public không (không cần đăng nhập)? Nếu có, bắt buộc xem xét gắn giới hạn riêng (như `/ping`).
2. API có liên quan mật khẩu/xác thực không? Dùng `@LimitStrict()`.
3. API có parse file Excel, hoặc tạo hồ sơ/tài khoản hàng loạt không? Dùng `@LimitStrict()` (xem trước) hoặc `@LimitBulk()` (xác nhận ghi).
4. API có upload hoặc tải file không? `@LimitMedium()` cho upload, `@LimitHeavyRead()` cho tải về.
5. API `GET` có trả toàn bộ danh sách không phân trang không? Dùng `@LimitHeavyRead()`.
6. API có bị gọi tự động từ server Next.js, nhiều người dùng chung một IP, mà không có token người dùng không? Cân nhắc `@SkipAllLimits()`.
7. Không thuộc các trường hợp trên: **không gắn gì**, quy tắc chung đã đủ.

## 8. Phản hồi khi vượt giới hạn

- Gateway trả **HTTP 429**. `RpcToHttpFilter` hiện đã cho `HttpException` đi qua đúng mã trạng thái.
- Frontend cần bắt mã 429 (hiện `frontend/src/lib/api/axios.ts` mới xử lý 401) và hiện thông báo kiểu "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút".

## 9. Kiểm thử

Dùng collection `rate-limit-tests.postman_collection.json` (21 request) để kiểm tra toàn bộ các case ở mục 3 và 5.

- Chạy bằng Postman Collection Runner hoặc `newman run rate-limit-tests.postman_collection.json`.
- Chờ ít nhất 60 giây giữa hai lần chạy vì bộ đếm reset theo phút.
- Chỉ chạy trên môi trường dev.
- Khi thêm API mới vào danh sách mục 5, thêm một case tương ứng vào collection.

## 10. Hạn chế đã biết

| Vấn đề | Ảnh hưởng | Hướng xử lý |
|---|---|---|
| Đếm đăng nhập theo username | Ai đó có thể cố tình gõ sai username của người khác để khóa đăng nhập tài khoản đó 1 phút | Chấp nhận với đồ án; nếu cần, thêm khóa tài khoản ở `auth-service` |
| Bộ đếm lưu trong bộ nhớ | Restart gateway thì bộ đếm về 0; chạy nhiều instance gateway thì mỗi instance đếm riêng | Chạy 1 instance thì đủ; nhiều instance thì chuyển sang Redis |
| Chưa có `trust proxy` | Hiện gateway nhận request trực tiếp (chưa có Nginx) nên chưa cần | Khi đặt Nginx phía trước, thêm `app.set('trust proxy', 1)` trong `main.ts` |
| Auth-service chưa khóa tài khoản khi đăng nhập sai nhiều lần | Rate limit chỉ làm chậm kẻ dò mật khẩu, không chặn hẳn | Tùy chọn: thêm cột `soLanSaiMatKhau` và `khoaDen`, sai 5 lần thì khóa 15 phút |
| Tên header `X-RateLimit-Limit-write` | Dựa vào quy ước của `@nestjs/throttler` 6.x, chưa kiểm chứng trên hệ thống thật | Nếu test header trong collection fail, đối chiếu với header thực tế của response |

## 11. Các file liên quan

| Việc | File |
|---|---|
| Tạo mới | `apps/api-gateway/src/common/guards/app-throttler.guard.ts` |
| Tạo mới | `apps/api-gateway/src/common/decorators/rate-limit.decorator.ts` |
| Sửa | `apps/api-gateway/src/auth/auth.module.ts` |
| Thêm decorator | `auth.controller.ts`, `document.controller.ts`, `ncs.controller.ts`, `gvhd.controller.ts`, `api-gateway.controller.ts` |
| Thư viện | `npm install @nestjs/throttler` (trong `backend/`) |