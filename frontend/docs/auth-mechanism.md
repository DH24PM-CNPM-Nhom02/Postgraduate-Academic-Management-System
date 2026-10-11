# Cơ chế Xác thực (Authentication) tại Frontend

Tài liệu này giải thích chi tiết kiến trúc và luồng hoạt động của hệ thống Authentication trên Frontend (sử dụng Next.js 16 và Auth.js / NextAuth v5). Cơ chế này xử lý đăng nhập, bắt lỗi từ API, duy trì phiên đăng nhập bằng JWT, an toàn khi refresh token, và phân quyền (RBAC).

---

## 1. Mở rộng Kiểu dữ liệu (Type Augmentation)

Do NextAuth mặc định không lưu các trường tuỳ chỉnh như `access_token`, `refresh_token`, hay `role`, chúng ta cần mở rộng hệ thống Type của NextAuth.
**File:** [`types/next-auth.d.ts`]

- Mở rộng `JWT` và `Session` để chứa `access_token`, `access_expire`, và thông tin chi tiết `user`.
- Mở rộng `User` để mang thêm `access_token` và `refresh_token` trả về từ API lúc đăng nhập.

## 2. Dịch vụ Gọi API và Bắt lỗi (Error Handling)

Thay vì trả về lỗi chung chung, hệ thống biến đổi các HTTP Status Code của Backend thành các đối tượng Lỗi (Error) chuyên biệt kế thừa từ `CredentialsSignin` của NextAuth. Điều này giúp đẩy chính xác mã lỗi về Client.

**File:** [`types/errors.ts`]
- `UnauthorizedError` (401)
- `InActiveAccountError` (403)
- `InvalidParameters` (400)
- `ConflictAccountError` (409)

**File:** [`src/services/auth.ts`]
- Hàm `login` gọi API backend không cần gắn token (dùng `publicApiClient`). Khi có lỗi, nó kiểm tra `error.response.data.statusCode` và `throw` ra một trong các Error Class ở trên.
- Cung cấp các hàm khác như `refreshToken`, `logout`, và `getMe`.

## 3. Cấu hình Cốt lõi của NextAuth (NextAuth Config)

Đây là "trái tim" của hệ thống Auth. Nó quy định chiến lược lưu token, gọi authorize, xử lý refresh và signout.
**File:** [`src/auth.ts`]

### A. Hàm `authorize`
Thực hiện gọi `authService.login`. 
- Nếu thành công, nó bóc tách đối tượng `data` từ Backend (gồm `user`, `access_token`, `refresh_token`) và trả về đúng chuẩn mở rộng của NextAuth.
- Nếu thất bại, do Exception đã bị ném ra từ `authService`, NextAuth sẽ lập tức huỷ luồng login và trả lỗi về Client.

### B. Callback `jwt`
Mỗi khi Token được tạo hoặc đọc lại, callback này chạy để kiểm tra:
1. **Khởi tạo:** Lưu thông tin token và tính toán thời gian `access_expire` bằng cách decode JWT (thông qua `getTokenExpire` trong `src/lib/utils/jwt.ts`).
2. **Kiểm tra Hết hạn:** Nếu token còn sống cộng thêm khoảng đệm 60s (buffer time), giữ nguyên token.
3. **Làm mới Token (Auto Refresh):** Nếu hết hạn, gọi API refresh thông qua cơ chế Lock (đọc ở mục 4).
4. **Xử lý lỗi Refresh:** Bất kỳ lỗi nào phát sinh (token chết, server từ chối) sẽ gán `token.error = "RefreshTokenError"`.

### C. Callback `session`
Đồng bộ các thuộc tính như `access_token` và `error` từ `token` lên `session` để client (React/Middleware) có thể sử dụng.

## 4. Ngăn chặn Race Condition khi Refresh Token

Khi một ứng dụng có nhiều lệnh gọi API (components) hoặc tài nguyên cùng tải một lúc lúc token vừa hết hạn, Next.js sẽ gọi API refresh token song song nhiều lần, dẫn đến lỗi bất đồng bộ. Hệ thống khắc phục bằng **Promise Lock**.
**File:** [`src/lib/auth/refresh-lock.ts`]

- Hàm `withRefreshLock` sử dụng `Map` để giữ Request Refresh Token duy nhất cho mỗi User. 
- Các lệnh gọi phụ thuộc sinh ra cùng lúc sẽ không khởi tạo request mới mà "Chờ" (await) và sử dụng chung kết quả của request đầu tiên.

## 5. Bảo vệ Routes tại Cấp độ Request (Middleware Proxy)

Sử dụng Middleware của Next.js (chạy ở môi trường Edge) để xử lý chặn luồng truy cập mà không cần render trang.
**File:** [`src/middleware.ts`]

- Lấy `req.auth` chứa dữ liệu Session.
- Lọc các Route công cộng (`PUBLIC_ROUTES`) và Route xác thực (`isAuthPage`).
- **Trường hợp Token hết hạn (`authError === "RefreshTokenError"`):** Trực tiếp đẩy user văng ra trang `/login`. 
- Nếu truy cập trang Protected mà chưa có Auth, đá về `/login`. Nếu có Auth mà vô `/login` thì đá về `/`.
- Dễ dàng mở rộng cho cơ chế RBAC (Route Group vs Role).

## 6. Client Hook và UI hiển thị Lỗi

Trải nghiệm người dùng khi login cần nhận thông báo thân thiện chứ không phải log kỹ thuật.
**File:** [`src/hooks/use-auth.ts`]

- Hook gọi hàm `signIn("credentials", { redirect: false })`.
- Nhận phản hồi về từ `result.code`. Từ mã code (Ví dụ: `UNAUTHORIZED`), hook sử dụng `switch/case` để set State `error` với các câu tiếng Việt dễ hiểu.
- `login-form.tsx` lấy `error` từ hook và hiển thị trực tiếp lên UI.
