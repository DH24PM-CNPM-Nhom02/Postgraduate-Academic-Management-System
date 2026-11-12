# Phân hệ Quản trị Hệ thống (Admin Console): Tài liệu Đặc tả & Kế hoạch Triển khai Frontend

> **Dành cho:** Đội ngũ Frontend (FE)  
> **Phân hệ:** Quản trị Hệ thống (Admin Console Flow)  
> **Các trang phụ trách:**
> - `/users` — Quản lý Tài khoản Người dùng & Phân quyền RBAC
> - `/system` — Cấu hình Hệ thống & Danh mục Tạp chí WoS/Scopus/HĐGSNN
> - `/audit-log` — Nhật ký Kiểm toán & Lưu vết Thao tác Hệ thống  
> **Route Group Frontend:** `frontend/src/app/(admin)/`  
> **Backend Microservices tương ứng:** `api-gateway` (Auth, Audit, System proxies), `auth-service`, `phd-service` (`audit` & `system` modules)  
> **Tài liệu tham chiếu:** [`SRS_PhanHe_QuanLy_TienSi-FINAL.md`](./SRS_PhanHe_QuanLy_TienSi-FINAL.md), [`backend-plan-phd.md`](./backend-plan-phd.md), [`frontend-9moc-plan.md`](./frontend-9moc-plan.md)

---

## Mục lục

1. [Kiến trúc Tổng thể Luồng Admin & Cơ chế Bảo vệ Quyền (RBAC Guard)](#1-kiến-trúc-tổng-thể-luồng-admin--cơ-chế-bảo-vệ-quyền-rbac-guard)
2. [Thiết kế Bộ khung Giao diện Quản trị (Admin Shell & Layout)](#2-thiết-kế-bộ-khung-giao-diện-quản-trị-admin-shell--layout)
3. [Màn hình 1: Quản lý Người dùng & Tài khoản (`/users`)](#3-màn-hình-1-quản-lý-người-dùng--tài-khoản-users)
   - 3.1 [Tổng quan nghiệp vụ](#31-tổng-quan-nghiệp-vụ)
   - 3.2 [Đặc tả API Gateway Endpoint](#32-đặc-tả-api-gateway-endpoint)
   - 3.3 [Đặc tả Dữ liệu & Typescript Interfaces](#33-đặc-tả-dữ-liệu--typescript-interfaces)
   - 3.4 [Thiết kế UI/UX & Thành phần Tương tác](#34-thiết-kế-uiux--thành-phần-tương-tác)
4. [Màn hình 2: Cấu hình Hệ thống & Danh mục Xuất bản Khoa học (`/system`)](#4-màn-hình-2-cấu-hình-hệ-thống--danh-mục-xuất-bản-khoa-học-system)
   - 4.1 [Tổng quan nghiệp vụ](#41-tổng-quan-nghiệp-vụ)
   - 4.2 [Chi tiết các Tab chức năng cấu hình](#42-chi-tiết-các-tab-chức-năng-cấu-hình)
   - 4.3 [Đặc tả Dữ liệu & Tương tác API](#43-đặc-tả-dữ-liệu--tương-tác-api)
   - 4.4 [Thiết kế UI/UX & Thành phần Tương tác](#44-thiết-kế-uiux--thành-phần-tương-tác)
5. [Màn hình 3: Nhật ký Kiểm toán Thao tác (`/audit-log`)](#5-màn-hình-3-nhật-ký-kiểm-toán-thao-tác-audit-log)
   - 5.1 [Tổng quan nghiệp vụ & Mục tiêu](#51-tổng-quan-nghiệp-vụ--mục-tiêu)
   - 5.2 [Chi tiết API Gateway Endpoint](#52-chi-tiết-api-gateway-endpoint)
   - 5.3 [Cơ chế Phân trang Server-side & Bộ lọc Truy vấn](#53-cơ-chế-phân-trang-server-side--bộ-lọc-truy-vấn)
   - 5.4 [Đặc tả Dữ liệu & Typescript Interfaces](#54-đặc-tả-dữ-liệu--typescript-interfaces)
   - 5.5 [Từ điển Ánh xạ Hành động (Action Dictionary & Badges)](#55-từ-điển-ánh-xạ-hành-động-action-dictionary--badges)
   - 5.6 [Thiết kế UI/UX & Thành phần So sánh Visual Diff](#56-thiết-kế-uiux--thành-phần-so-sánh-visual-diff)
6. [Cấu trúc Thư mục & Mã nguồn Khuyến nghị cho Frontend](#6-cấu-trúc-thư-mục--mã-nguồn-khuyến-nghị-cho-frontend)
7. [Kế hoạch Triển khai Chi tiết Từng Bước (Implementation Roadmap)](#7-kế-hoạch-triển-khai-chi-tiết-từng-bước-implementation-roadmap)
8. [Quy tắc An toàn Thông tin & Xử lý Ngoại lệ](#8-quy-tắc-an-toàn-thông-tin--xử-lý-ngoại-lệ)

---

## 1. Kiến trúc Tổng thể Luồng Admin & Cơ chế Bảo vệ Quyền (RBAC Guard)

### 1.1 Vai trò & Phạm vi Quyền hạn
Quản trị viên (**System Admin**) là chủ thể nắm quyền kiểm soát cao nhất về mặt kỹ thuật và vận hành hạ tầng ứng dụng Đào tạo Sau Đại học:
- **Quản lý Định danh:** Cấp phát tài khoản cho các vai trò (`ADMIN`, `GIAO_VU`, `GVHD`, `NCS`), kích hoạt/khóa tài khoản khi có vi phạm hoặc nghỉ việc/thôi học, hỗ trợ cấp lại mật khẩu.
- **Quản trị Tham số Học vụ:** Cập nhật bảng quy đổi danh mục tạp chí khoa học quốc tế (WoS/Scopus), danh mục HĐGSNN hàng năm, cùng các hằng số đào tạo (định mức hướng dẫn, thời gian đào tạo tối đa).
- **Thanh tra & Kiểm toán:** Giám sát toàn vẹn hệ thống thông qua bảng ghi vết vĩnh viễn (Audit Log), ngăn ngừa gian lận học thuật và hỗ trợ giải quyết tranh chấp pháp lý hồ sơ tiến sĩ.

### 1.2 Luồng Điều hướng Người dùng (Admin User Navigation Flow)

```
                       ┌────────────────────────┐
                       │   Đăng nhập Hệ thống   │
                       └───────────┬────────────┘
                                   │ Token có Role: ADMIN
                                   ▼
                       ┌────────────────────────┐
                       │  Admin Route Guard     │ ──── Không có quyền ──► 403 Forbidden / Redirect
                       └───────────┬────────────┘
                                   │ Hợp lệ
                                   ▼
                    ┌───────────────────────────────┐
                    │  Admin Shell Layout           │
                    │  (Sidebar + Header + Footer)  │
                    └───────┬───────────────┬───────┘
                            │               │
       ┌────────────────────┼───────────────┴───────────────────┐
       ▼                    ▼                                   ▼
┌──────────────┐     ┌──────────────┐                   ┌──────────────┐
│ Quản lý Users│     │ Cấu hình     │                   │ Nhật ký      │
│  (`/users`)  │     │ (`/system`)  │                   │ (`/audit-log`)
└──────┬───────┘     └──────┬───────┘                   └──────┬───────┘
       │                    │                                  │
       ├─ Thêm tài khoản    ├─ WoS / Scopus Catalog            ├─ Tìm kiếm log
       ├─ Khóa / Mở khóa    ├─ Tham số Đào tạo Tiến sĩ         ├─ Lọc theo actor/NCS
       └─ Reset mật khẩu    └─ Thiết lập Thông tin Viện/Trường └─ So sánh Diff giá trị
```

### 1.3 Cơ chế Route Guard tại Frontend
Mọi trang thuộc nhóm `frontend/src/app/(admin)/` bắt buộc phải được bảo vệ bởi middleware hoặc component Guard:
1. **Kiểm tra phiên đăng nhập:** Nếu chưa đăng nhập (`!user`), lưu lại đường dẫn hiện tại và chuyển hướng về `/login?redirect=...`.
2. **Kiểm tra Vai trò:** Xác thực `user.roles.includes('ADMIN')`. Nếu người dùng đăng nhập với role khác (ví dụ `NCS`, `GVHD`), chuyển hướng về trang chủ tương ứng của role đó hoặc hiển thị component cảnh báo truy cập trái phép.

---

## 2. Thiết kế Bộ khung Giao diện Quản trị (Admin Shell & Layout)

Tệp bố cục chính: `frontend/src/app/(admin)/layout.tsx`.  
Hiện tại, dự án đã có sẵn các component cơ sở tại `frontend/src/components/admin/`:
- `AdminHeader` (`frontend/src/components/admin/header.tsx`): Chứa logo, nhãn vai trò "Quản trị viên Hệ thống", thông báo, trạng thái Console v1.0.0, và dropdown người dùng (đổi mật khẩu, đăng xuất).
- `AdminSidebar` (`frontend/src/components/admin/sidebar.tsx`): Menu điều hướng bên trái với 3 mục chính (`/users`, `/system`, `/audit-log`), kèm widget hiển thị trạng thái DB/Cluster online.
- `AdminFooter` (`frontend/src/components/admin/footer.tsx`): Thông tin phiên bản, bản quyền và trạng thái kiểm soát an toàn RBAC.

### Mã nguồn hoàn thiện khuyến nghị cho `AdminLayout`:

```tsx
"use client";

import { useState } from "react";
import { AdminHeader } from "@/src/components/admin/header";
import { AdminSidebar } from "@/src/components/admin/sidebar";
import { AdminFooter } from "@/src/components/admin/footer";
import { useAuth } from "@/src/hooks/use-auth";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Trạng thái kiểm tra token
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Đang xác thực quyền Quản trị viên...</p>
        </div>
      </div>
    );
  }

  // Chặn nếu không phải ADMIN
  const isAdmin = user?.roles?.includes("ADMIN");
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 dark:bg-rose-950/50">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Khu vực Giới hạn Truy cập</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Tài khoản của bạn không có đặc quyền Quản trị viên (ADMIN) để truy cập Admin Console.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
        >
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
```

---

## 3. Màn hình 1: Quản lý Người dùng & Tài khoản (`/users`)

### 3.1 Tổng quan nghiệp vụ
Trang `/users` cho phép Quản trị viên kiểm soát định danh của toàn bộ người dùng trong hệ sinh thái đào tạo:
1. **Tìm kiếm & Giám sát:** Xem danh sách người dùng kèm vai trò, trạng thái hoạt động (`active` hoặc `locked`), ngày khởi tạo và email liên hệ.
2. **Khởi tạo Tài khoản (Single & Bulk Create):**
   - Tạo tài khoản cá lẻ cho Giáo vụ / Giảng viên hướng dẫn / Quản trị viên.
   - Nhập danh sách tài khoản theo đợt nhập học của Nghiên cứu sinh (tự động gán role `NCS` và kích hoạt cờ yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên `mustChangePassword = true`).
3. **Khóa / Mở khóa Tài khoản (Set Status):** Lập tức đình chỉ quyền truy cập của người dùng mà không xóa dữ liệu lịch sử để đảm bảo tính toàn vẹn học vụ.
4. **Cấp lại Mật khẩu (Reset Password):** Đặt lại mật khẩu về mặc định bảo mật hoặc sinh mật khẩu ngẫu nhiên để hỗ trợ người dùng bị quên mật khẩu.

### 3.2 Đặc tả API Gateway Endpoint

Tất cả các lệnh gọi API đều đi qua `api-gateway` và yêu cầu Header: `Authorization: Bearer <access_token>`.

#### 3.2.1 Lấy danh sách người dùng (List Users)
* **Method:** `GET`
* **Path:** `/api/v1/auth/users`
* **Quyền yêu cầu:** `user.read` (hoặc role `ADMIN`)
* **Query Parameters:**
  - `page` (`number`, mặc định `1`): Số thứ tự trang.
  - `limit` (`number`, mặc định `20`, tối đa `100`): Số bản ghi/trang.
  - `role` (`string`, tùy chọn): Lọc theo vai trò (`ADMIN`, `GIAO_VU`, `GVHD`, `NCS`).
  - `status` (`string`, tùy chọn): Lọc theo `active` hoặc `locked`.
  - `keyword` (`string`, tùy chọn): Tìm kiếm theo Username, Họ tên (`fullName`) hoặc `email`.
* **Phản hồi mẫu thành công (200 OK):**
```json
{
  "data": [
    {
      "id": "e4b6c8f2-3e2c-467a-9a91-76a08901b0d1",
      "username": "2024NCS001",
      "fullName": "Nguyễn Văn An",
      "email": "an.nv24@agu.edu.vn",
      "isActive": true,
      "mustChangePassword": false,
      "roles": ["NCS"],
      "createdAt": "2026-09-01T08:00:00.000Z",
      "updatedAt": "2026-10-15T14:20:00.000Z"
    }
  ],
  "total": 128,
  "page": 1,
  "limit": 20,
  "totalPages": 7
}
```

#### 3.2.2 Lấy chi tiết một người dùng
* **Method:** `GET`
* **Path:** `/api/v1/auth/users/:id`
* **Quyền yêu cầu:** `user.read`

#### 3.2.3 Tạo mới người dùng (Đơn lẻ hoặc Hàng loạt)
* **Method:** `POST`
* **Path:** `/api/v1/auth/users`
* **Quyền yêu cầu:** `user.create`
* **Body Request:**
```json
{
  "users": [
    {
      "username": "gv.tranvanb",
      "fullName": "PGS.TS. Trần Văn B",
      "email": "tvb@agu.edu.vn",
      "role": "GVHD",
      "password": "Password123@"
    }
  ]
}
```

#### 3.2.4 Đổi trạng thái Khóa / Mở khóa tài khoản
* **Method:** `PATCH`
* **Path:** `/api/v1/auth/users/:id/status`
* **Quyền yêu cầu:** `user.update`
* **Body Request:**
```json
{
  "isActive": false
}
```

#### 3.2.5 Đặt lại Mật khẩu (Reset Password)
* **Method:** `PATCH`
* **Path:** `/api/v1/auth/users/:id/reset-password`
* **Quyền yêu cầu:** `user.reset_password`
* **Phản hồi:** Trả về thông báo thành công kèm mật khẩu tạm thời mới (nếu có sinh ngẫu nhiên) hoặc thông báo đã reset về mật khẩu mặc định của trường.

### 3.3 Đặc tả Dữ liệu & Typescript Interfaces

Tạo file `frontend/src/types/api/users.ts`:

```typescript
export type SystemRole = 'ADMIN' | 'GIAO_VU' | 'GVHD' | 'NCS';

export interface UserItem {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  isActive: boolean;
  mustChangePassword?: boolean;
  roles: SystemRole[];
  createdAt: string;
  updatedAt?: string;
}

export interface ListUsersQueryParams {
  page?: number;
  limit?: number;
  role?: SystemRole | string;
  status?: 'active' | 'locked';
  keyword?: string;
}

export interface PaginatedUsersResponse {
  data: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserPayloadItem {
  username: string;
  fullName: string;
  email?: string;
  role: SystemRole;
  password?: string;
}

export interface CreateUsersRequest {
  users: CreateUserPayloadItem[];
}

export interface SetUserStatusRequest {
  isActive: boolean;
}
```

### 3.4 Thiết kế UI/UX & Thành phần Tương tác

```
┌────────────────────────────────────────────────────────────────────────┐
│  Admin Console / Quản lý người dùng & Phân quyền                       │
│  [Tiêu đề trang]                               [+ Thêm người dùng]     │
├────────────────────────────────────────────────────────────────────────┤
│  QUICK STATS CARDS                                                     │
│  [👥 Tổng người dùng: 342] [🛡️ Quản trị: 4] [🎓 NCS: 215] [🔒 Bị khóa: 3]│
├────────────────────────────────────────────────────────────────────────┤
│  FILTERS & SEARCH TOOLBAR                                              │
│  [🔍 Tìm kiếm Username, Tên, Email...] [Vai trò: Tất cả ▾] [Trạng thái ▾]│
├────────────────────────────────────────────────────────────────────────┤
│  USERS TABLE                                                           │
│  Người dùng     │ Username   │ Vai trò   │ Trạng thái   │ Ngày tạo │ Thao tác
│  Nguyễn Văn A   │ 2024NCS001 │ [NCS]     │ ● Hoạt động  │ 12/09/24 │ [Khóa] [Reset Pass] [Chi tiết]
│  Trần Thị B     │ giaovu_b   │ [GIAO_VU] │ ● Hoạt động  │ 05/01/24 │ [Khóa] [Reset Pass] [Chi tiết]
│  Lê Hoàng C     │ gv_hoangc  │ [GVHD]    │ ○ Bị khóa    │ 10/03/23 │ [Mở]   [Reset Pass] [Chi tiết]
├────────────────────────────────────────────────────────────────────────┤
│  PAGINATION BAR                                                        │
│  Hiển thị 1 - 20 trong 342 người dùng              [Trang trước] [1] [2] [Trang sau] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Các Thành phần UI cốt lõi cần xây dựng:
1. **`UserStatsOverview`:** Hiển thị 4 thẻ số liệu tóm tắt:
   - Tổng số tài khoản.
   - Số Nghiên cứu sinh (NCS).
   - Số Giảng viên / Cán bộ đào tạo (GVHD & GIAO_VU).
   - Số tài khoản đang bị vô hiệu hóa (Locked).
2. **`UserTable` & `UserRoleBadge`:**
   - Role badge: `ADMIN` (Đỏ / Rose), `GIAO_VU` (Tím / Indigo), `GVHD` (Xanh dương / Sky), `NCS` (Xanh ngọc / Emerald).
   - Trạng thái: Chấm tròn xanh nhấp nháy cho `Đang hoạt động`, Chấm xám cho `Đã khóa`.
3. **`CreateUserModal`:**
   - Form thêm người dùng đơn lẻ: Username, Họ tên, Email, Vai trò (Dropdown), Mật khẩu khởi tạo (tự động gợi ý mật khẩu mạnh hoặc cho phép nhập).
   - Tab chuyển đổi: Cho phép tải file mẫu CSV/Excel để nhập hàng loạt học viên cao học / nghiên cứu sinh mới trúng tuyển.
4. **`UserStatusConfirmDialog`:** Cảnh báo trước khi khóa tài khoản: *"Khóa tài khoản này sẽ ngăn người dùng đăng nhập ngay lập tức. Các tiến trình học tập hiện có sẽ không bị ảnh hưởng."*
5. **`ResetPasswordDialog`:** Hiển thị xác nhận reset mật khẩu và hộp sao chép mật khẩu mới an toàn với nút Copy to Clipboard.

---

## 4. Màn hình 2: Cấu hình Hệ thống & Danh mục Xuất bản Khoa học (`/system`)

### 4.1 Tổng quan nghiệp vụ
Theo quy định đào tạo tiến sĩ của Bộ Giáo dục & Đào tạo và Quy chế Đại học An Giang (Quyết định 655/QĐ-ĐHAG):
- Nghiên cứu sinh bắt buộc phải có công bố khoa học thuộc danh mục uy tín (**Web of Science / Scopus / Chương sách quốc tế / Tạp chí HĐGSNN**) đạt tổng điểm tối thiểu $\ge 2.0$ điểm (hoặc đạt tối thiểu 3 bài WoS/Scopus với 1 bài Q2/Rank B) mới đủ điều kiện bảo vệ luận án.
- Giáo vụ và Ban Giám hiệu cần một bảng danh mục tra cứu chuẩn để đối soát tự động khi NCS nộp minh chứng công bố tại Mốc 8 & Mốc 9.
- Trang `/system` cung cấp giao diện quản trị cho Admin để thiết lập dữ liệu nền tảng này cùng các tham số học vụ trọng yếu.

### 4.2 Chi tiết các Tab chức năng cấu hình

Giao diện `/system` được chia thành **3 Tab chính**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  Admin Console / Cấu hình Hệ thống & Danh mục                          │
│                                                                        │
│  [Tab 1: Danh mục WoS/Scopus/HĐGSNN] [Tab 2: Quy chế Đào tạo] [Tab 3: Thông tin Viện] │
└────────────────────────────────────────────────────────────────────────┘
```

#### Tab 1: Danh mục Tạp chí & Chuẩn Xuất bản Khoa học
- **Quản lý danh mục tạp chí:**
  - Tên tạp chí khoa học (Journal Title).
  - Mã chuẩn quốc tế: `ISSN`, `e-ISSN`.
  - Phân loại danh mục: `WOS_Q1_Q2` (Hạng 1), `WOS_SCOPUS_KHAC` (Hạng 2), `CHUONG_SACH_QUOC_TE` (Hạng 3), `HDGSNN_075` (Hạng 4 - Tạp chí ngành từ 0.75 điểm trở lên).
  - Điểm quy đổi công trình tương ứng: `1.0`, `0.75`, `0.5`, `0.25`.
- **Hành động quản trị:**
  - Tìm kiếm nhanh theo ISSN hoặc tên tạp chí.
  - Thêm mới tạp chí vào danh mục được công nhận.
  - Nút **"Nhập danh mục từ Excel"**: Nhập danh mục tạp chí được HĐGSNN phê duyệt hàng năm để tự động cập nhật hệ thống.
  - Xuất danh mục ra file Excel/CSV.

#### Tab 2: Tham số & Quy định Đào tạo Tiến sĩ (Academic Parameters)
Admin có thể cấu hình các tham số tự động kiểm tra (Validation Rules) mà hệ thống dùng để duyệt hồ sơ:
- **Thời gian đào tạo chuẩn:** Mặc định `36` tháng (đối với người có bằng Thạc sĩ) và `48` tháng (đối với người có bằng Đại học loại Giỏi).
- **Thời gian gia hạn tối đa:** `24` tháng (tổng thời gian đào tạo không vượt quá 6 năm).
- **Định mức hướng dẫn tối đa của GVHD:**
  - Giáo sư (GS): Tối đa `5` NCS cùng thời điểm.
  - Phó Giáo sư / Tiến sĩ khoa học (PGS/TSKH): Tối đa `4` NCS.
  - Tiến sĩ (TS): Tối đa `3` NCS.
- **Ngưỡng điểm công bố khoa học tối thiểu:** Mặc định `2.0` điểm để kích hoạt Mốc Đánh giá luận án tại Đơn vị chuyên môn.

#### Tab 3: Thông tin Viện / Cơ sở Đào tạo Sau Đại học
- Tên trường: Trường Đại học An Giang - ĐHQG-HCM.
- Tên đơn vị phụ trách: Phòng Đào tạo / Bộ phận Sau Đại học.
- Địa chỉ, Số điện thoại hỗ trợ học vụ, Email chính thức nhận phản hồi.
- Cấu hình Email gửi thông báo hệ thống tự động (SMTP / System Sender).

### 4.3 Đặc tả Dữ liệu & Tương tác API

```typescript
export interface JournalCatalogItem {
  id: string;
  name: string;
  issn: string;
  eIssn?: string | null;
  category: 'WOS_Q1_Q2' | 'WOS_SCOPUS_KHAC' | 'CHUONG_SACH_QUOC_TE' | 'HDGSNN_075';
  score: number;
  publisher?: string | null;
  field: string; // Ngành / Chuyên ngành
  isActive: boolean;
  updatedAt: string;
}

export interface SystemParametersConfig {
  standardDurationMonthsMaster: number;     // 36
  standardDurationMonthsBachelor: number;   // 48
  maxExtensionMonths: number;               // 24
  maxSupervisionQuotaProfessor: number;     // 5
  maxSupervisionQuotaAssociateProf: number; // 4
  maxSupervisionQuotaDoctor: number;        // 3
  minPublicationScoreForDefense: number;    // 2.0
}
```

### 4.4 Thiết kế UI/UX & Thành phần Tương tác

- **Bảng Tra cứu & Cập nhật Tạp chí:** Bảng hiển thị có bộ lọc theo Loại danh mục (`WOS_Q1_Q2`, `SCOPUS`, `HDGSNN`) và thanh tìm kiếm ISSN tức thời (Instant Search).
- **Thao tác nhanh trên dòng (Row Actions):** Cho phép bật/tắt trạng thái công nhận của tạp chí (Toggle Active) hoặc chỉnh sửa điểm quy đổi.
- **Form cấu hình Tham số với Validations chặt chẽ:** Sử dụng `react-hook-form` và `zod` để bảo đảm các số nhập vào là số dương nguyên hợp lệ, tránh lỗi tính toán logic tiến độ của nghiên cứu sinh.

---

## 5. Màn hình 3: Nhật ký Kiểm toán Thao tác (`/audit-log`)

### 5.1 Tổng quan nghiệp vụ & Mục tiêu
Phân hệ **Audit Log (Nhật ký kiểm toán / Nhật ký thao tác)** là thành phần an toàn thông tin bắt buộc theo tài liệu SRS (Mục 4.2 & NFR-Security). Hệ thống tự động ghi nhận vĩnh viễn (append-only) các hành vi thay đổi dữ liệu trọng yếu trong cùng transaction nghiệp vụ.

Trang `/audit-log` cung cấp cho **Quản trị viên hệ thống (Admin)** công cụ toàn diện để:
- **Theo dõi & Giám sát:** Nắm bắt ai đã làm gì, vào thời điểm nào, từ địa chỉ IP nào.
- **Truy vết thay đổi (Audit Trail):** Xem lại chính xác trạng thái trước (`oldValue`) và sau (`newValue`) của từng thao tác (đổi trạng thái học tập của NCS, giao/hủy đề tài, duyệt mốc tiến độ, ban hành/hủy quyết định, duyệt đơn gia hạn...).
- **Khắc phục sự cố & Đối soát:** Tìm kiếm nhanh theo mã số NCS, người thực hiện hoặc khoảng thời gian để đối soát dữ liệu khi có tranh chấp hoặc khiếu nại học vụ.

---

### 5.2 Chi tiết API Gateway Endpoint

Tất cả request phải đính kèm Header: `Authorization: Bearer <access_token>`.

#### 5.2.1 Lấy danh sách nhật ký thao tác
* **Method:** `GET`
* **Path:** `/api/v1/audit-logs` (hoặc alias `/audits`)
* **URL đầy đủ:** `http://localhost:8080/api/v1/audit-logs`
* **Quyền hạn yêu cầu:** Role `ADMIN` hoặc sở hữu permission `audit.read`.
* **Mô tả:** Trả về danh sách nhật ký kèm thông tin đã làm giàu của Actor (người thao tác) và NCS liên quan.

#### 5.2.2 Xem chi tiết 1 bản ghi nhật ký
* **Method:** `GET`
* **Path:** `/api/v1/audit-logs/:id` (hoặc alias `/audits/:id`)
* **Quyền hạn yêu cầu:** Role `ADMIN` hoặc sở hữu permission `audit.read`.
* **Path Params:** `id` (UUID của bản ghi audit log).
* **Mô tả:** Trả về chi tiết đầy đủ 1 log bao gồm `oldValue`, `newValue`, `clientIp`, `correlationId`, `actor`, `ncs`.

---

### 5.3 Cơ chế Phân trang Server-side & Bộ lọc Truy vấn

Do dữ liệu audit log liên tục tăng trưởng theo thời gian (có thể lên đến hàng vạn bản ghi), **Frontend bắt buộc sử dụng Server-side Pagination** khi render bảng chính:
* Gửi `page` (bắt đầu từ `1`) và `limit` (ví dụ `10`, `20`, `50`).
* Backend trả về đối tượng phân trang chuẩn:
```json
{
  "data": [ ... ],
  "total": 1420,
  "page": 1,
  "limit": 20,
  "totalPages": 71
}
```

#### Các tham số lọc Query (Query Parameters):

| Tham số | Kiểu | Mặc định | Ý nghĩa & Quy cách sử dụng |
| :--- | :--- | :--- | :--- |
| `page` | `number` | `1` | Số trang cần lấy. |
| `limit` | `number` | `20` | Số lượng bản ghi trên một trang (tối đa `100`). |
| `search` / `keyword` | `string` | `undefined` | Tìm kiếm tự do. Backend tự động quét qua: `action`, `entityType`, `entityId`, `actorId`, và **tìm theo Họ tên / MSHV** của NCS. |
| `action` | `string` | `undefined` | Lọc theo mã hành động (khớp chuỗi chứa hoặc chính xác). |
| `entityType` | `string` | `undefined` | Lọc theo loại đối tượng (vd: `NghienCuuSinh`, `QuyetDinh`, `DeTai`, `TienTrinhNcs`...). |
| `entityId` | `string` | `undefined` | Lọc theo ID chính xác của đối tượng bị thay đổi. |
| `actorId` | `string` | `undefined` | Lọc theo ID tài khoản người thực hiện thao tác. |
| `ncsId` | `UUID` | `undefined` | Lọc theo ID của Nghiên cứu sinh liên quan. |
| `fromDate` | `string` (ISO) | `undefined` | Lọc log tạo từ ngày này (dạng `YYYY-MM-DD` hoặc ISO 8601). |
| `toDate` | `string` (ISO) | `undefined` | Lọc log tạo đến ngày này (nếu truyền `YYYY-MM-DD`, backend tự lấy đến `23:59:59.999`). |

---

### 5.4 Đặc tả Dữ liệu & Typescript Interfaces

Tạo file định nghĩa kiểu dữ liệu tại `frontend/src/types/api/audit.ts`:

```typescript
export interface AuditActorView {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  roles?: string[];
}

export interface AuditNcsView {
  id: string;
  mshv: string;
  hoTen: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actor?: AuditActorView | null;
  action: string;
  entityType: string;
  entityId: string;
  ncsId?: string | null;
  ncs?: AuditNcsView | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  clientIp?: string | null;
  correlationId?: string | null;
  createdAt: string; // ISO DateTime
}

export interface ListAuditQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  keyword?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  ncsId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaginatedAuditResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### 5.5 Từ điển Ánh xạ Hành động (Action Dictionary & Badges)

Để giao diện thân thiện với người dùng, Frontend cần ánh xạ các mã hành động kỹ thuật sang nhãn tiếng Việt và màu sắc trực quan:

| Nhóm hành động | Mã Action (`action`) | Nhãn Tiếng Việt | Loại Badge (Màu) |
| :--- | :--- | :--- | :--- |
| **Hồ sơ NCS** | `NCS_CREATE` / `NCS_IMPORT` | Thêm mới hồ sơ NCS | `default` (Xanh dương / Blue) |
| | `NCS_UPDATE` | Cập nhật thông tin NCS | `secondary` (Xám / Slate) |
| | `NCS_STATUS_UPDATE` | Đổi trạng thái học tập NCS | `warning` (Hổ phách / Amber) |
| **Đề tài Luận án** | `THESIS_ASSIGN` | Giao đề tài luận án | `info` (Xanh ngọc / Cyan) |
| | `THESIS_CANCEL` | Hủy phân công đề tài | `destructive` (Đỏ / Rose) |
| **Phân công GVHD** | `ASSIGNMENT_CREATE` | Phân công GVHD | `info` (Xanh tím / Indigo) |
| | `ASSIGNMENT_DEACTIVATE` | Hủy phân công GVHD | `destructive` (Đỏ / Rose) |
| **Tiến độ 9 Mốc** | `SUBMIT_PROGRESS` | Nộp minh chứng mốc | `secondary` (Tím nhạt / Purple) |
| | `APPROVE_PROGRESS` | Phê duyệt đạt mốc | `success` (Xanh lá / Emerald) |
| | `REJECT_PROGRESS` | Từ chối minh chứng mốc | `destructive` (Đỏ / Rose) |
| **Quyết định** | `TAO_QUYET_DINH` | Ban hành quyết định | `default` (Xanh dương đậm / Blue) |
| | `VO_HIEU_QUYET_DINH` | Vô hiệu hóa quyết định | `destructive` (Đỏ cam / Orange) |
| **Đơn đề nghị** | `CHANGE_REQUEST_CREATE` | Gửi đơn đề nghị | `secondary` (Xám tím) |
| | `CHANGE_REQUEST_GVHD_APPROVE` | GVHD xác nhận đơn | `info` (Xanh biển) |
| | `CHANGE_REQUEST_APPROVE` | Giáo vụ duyệt đơn đề nghị | `success` (Xanh lá / Emerald) |
| | `CHANGE_REQUEST_REJECT` | Từ chối đơn đề nghị | `destructive` (Đỏ / Rose) |
| | `CHANGE_REQUEST_CANCEL` | Hủy đơn đề nghị | `outline` (Xám viền) |
| **Tốt nghiệp** | `XAC_NHAN_TOT_NGHIEP` | Xác nhận hoàn tất tốt nghiệp | `success` (Xanh lục bảo) |

---

### 5.6 Thiết kế UI/UX & Thành phần So sánh Visual Diff

```
┌────────────────────────────────────────────────────────────────────────┐
│  Admin Console / Nhật ký kiểm toán                                     │
│  [Tiêu đề trang & Mô tả]                    [Nút Làm mới] [Nút Xuất dữ liệu] │
├────────────────────────────────────────────────────────────────────────┤
│  FILTERS BAR                                                           │
│  [🔍 Tìm kiếm từ khóa / MSHV...]  [Tất cả Hành động ▾]  [Tất cả Thực thể ▾] │
│  [📅 Từ ngày - Đến ngày]          [Đang lọc: ...]       [Nút Đặt lại lọc]   │
├────────────────────────────────────────────────────────────────────────┤
│  TABLE                                                                 │
│  Thời gian      │ Người thao tác │ Hành động    │ Đối tượng  │ NCS liên quan │ Thao tác
│  12/11 14:30:15 │ Admin (admin)  │ [Duyệt mốc]  │ Tiến trình │ Nguyễn Văn A │ [Xem chi tiết]
│  12/11 10:15:02 │ Gv. Hùng (hung)│ [Đổi đề tài] │ Đề tài     │ Trần Thị B   │ [Xem chi tiết]
├────────────────────────────────────────────────────────────────────────┤
│  PAGINATION                                                            │
│  Hiển thị 1 - 20 trong tổng số 1,420 bản ghi       [◀] [ 1 ] [ 2 ] [▶]  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Chi tiết các khối hiển thị:
1. **Khối 1: Header & Quick Actions:**
   - Tiêu đề: "Nhật ký kiểm toán hệ thống" kèm icon `History` hoặc `ShieldCheck`.
   - Phụ đề: "Lưu vết toàn bộ thao tác thay đổi dữ liệu, cấp quyền và pháp lý phục vụ thanh tra, kiểm tra".
   - Nút **Làm mới (Refresh)** & Nút **Xuất CSV/Excel (Export)**.
2. **Khối 2: Bộ lọc linh hoạt (Filter Panel):**
   - Search input có debounce (300ms–500ms).
   - Dropdown Loại hành động (Action).
   - Dropdown Thực thể (Entity Type).
   - Date Range Picker (Từ ngày - Đến ngày).
3. **Khối 3: Bảng dữ liệu chính (Audit Table):**
   - Cột Thời gian (`createdAt`): Ngày giờ chuẩn + thời gian tương đối ("15 phút trước").
   - Cột Người thực hiện (`actor`): Avatar, Tên đầy đủ, Username, Badge vai trò.
   - Cột Hành động (`action`): Badge màu trực quan theo từ điển.
   - Cột Đối tượng (`entityType` & `entityId`): Tên thực thể + ID rút gọn kèm nút copy UUID.
   - Cột NCS liên quan (`ncs`): Họ tên & MSHV (nếu có).
4. **Khối 4: Dialog So sánh Chi tiết (Visual Diff Viewer):**
   - **Tab 1: Tổng quan:** ID bản ghi, Thời gian chi tiết, Client IP, Correlation ID, Actor profile, NCS profile.
   - **Tab 2: So sánh thay đổi (Old Value vs New Value):**
     - Bố cục 2 cột song song (Side-by-Side Diff):
       - Cột trái: `Giá trị cũ` (Nền đỏ nhạt, text gạch ngang hoặc đỏ).
       - Cột phải: `Giá trị mới` (Nền xanh lá nhạt, text xanh).
     - Tự động phát hiện trường thay đổi để làm nổi bật (Highlight Changed Keys).

---

## 6. Cấu trúc Thư mục & Mã nguồn Khuyến nghị cho Frontend

Để mã nguồn rõ ràng, dễ bảo trì và phân tách đúng trách nhiệm, cấu trúc thư mục phân hệ Admin được chuẩn hóa như sau:

```text
frontend/src/
├── types/
│   └── api/
│       ├── users.ts                     # Interfaces danh sách người dùng, create, status
│       ├── system-config.ts             # Interfaces danh mục WoS/Scopus & tham số đào tạo
│       └── audit.ts                     # Interfaces Audit Log, Action, Actor, Query params
├── services/
│   ├── users.service.ts                 # Service gọi API /auth/users
│   ├── system-config.service.ts         # Service gọi API cấu hình hệ thống & tạp chí
│   └── audit.service.ts                 # Service gọi API /audit-logs
├── hooks/
│   └── api/
│       ├── use-users.ts                 # React Query hook cho danh sách users & mutations
│       ├── use-system-config.ts         # React Query hook cho system configs
│       └── use-audit.ts                 # React Query hook cho audit logs
├── components/
│   └── admin/
│       ├── header.tsx                   # [Đã có] Header thanh công cụ Admin
│       ├── sidebar.tsx                  # [Đã có] Sidebar điều hướng Admin
│       ├── footer.tsx                   # [Đã có] Footer thông tin phiên bản
│       │
│       ├── users/
│       │   ├── user-stats.tsx           # Thẻ thống kê tổng số users, active, locked
│       │   ├── user-table.tsx           # Bảng danh sách người dùng
│       │   ├── user-filters.tsx         # Thanh tìm kiếm & lọc theo role, status
│       │   ├── create-user-modal.tsx    # Modal tạo mới tài khoản (đơn lẻ / bulk)
│       │   ├── user-status-dialog.tsx   # Dialog xác nhận khóa / mở khóa
│       │   └── reset-password-dialog.tsx# Dialog xác nhận đặt lại mật khẩu
│       │
│       ├── system/
│       │   ├── journal-catalog-tab.tsx  # Tab quản lý danh mục tạp chí WoS/Scopus
│       │   ├── journal-import-modal.tsx # Modal tải lên file Excel tạp chí HĐGSNN
│       │   ├── academic-params-tab.tsx  # Tab cấu hình tham số thời gian, định mức GVHD
│       │   └── institution-info-tab.tsx # Tab cấu hình thông tin viện / cơ sở đào tạo
│       │
│       └── audit/
│           ├── audit-table.tsx          # Bảng dữ liệu TanStack Table / UI Table
│           ├── audit-filters.tsx        # Thanh công cụ lọc & tìm kiếm
│           ├── audit-badge.tsx          # Render badge màu theo loại action
│           ├── audit-detail-dialog.tsx  # Modal xem chi tiết log & thông tin actor
│           └── audit-diff-viewer.tsx    # Thành phần so sánh Old Value vs New Value
└── app/
    └── (admin)/
        ├── layout.tsx                   # Bố cục bảo vệ phân quyền Admin & Shell
        ├── users/
        │   └── page.tsx                 # Trang /users
        ├── system/
        │   └── page.tsx                 # Trang /system
        └── audit-log/
            └── page.tsx                 # Trang /audit-log
```

### 6.1 Mẫu code `frontend/src/services/users.service.ts`

```typescript
import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  CreateUsersRequest,
  ListUsersQueryParams,
  PaginatedUsersResponse,
  SetUserStatusRequest,
  UserItem,
} from "@/src/types/api/users";

export const UsersService = {
  /**
   * Lấy danh sách người dùng có phân trang và bộ lọc
   */
  getUsers: async (params?: ListUsersQueryParams): Promise<PaginatedUsersResponse> => {
    try {
      const response = await apiClient.get<PaginatedUsersResponse>("/auth/users", {
        params,
      });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Lấy chi tiết một người dùng theo UUID
   */
  getUserById: async (id: string): Promise<UserItem> => {
    try {
      const response = await apiClient.get<UserItem>(`/auth/users/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Tạo một hoặc nhiều tài khoản mới
   */
  createUsers: async (payload: CreateUsersRequest): Promise<unknown> => {
    try {
      const response = await apiClient.post("/auth/users", payload);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Khóa hoặc mở khóa tài khoản
   */
  setUserStatus: async (id: string, payload: SetUserStatusRequest): Promise<UserItem> => {
    try {
      const response = await apiClient.patch<UserItem>(`/auth/users/${id}/status`, payload);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Đặt lại mật khẩu người dùng
   */
  resetPassword: async (id: string): Promise<{ message: string; tempPassword?: string }> => {
    try {
      const response = await apiClient.patch(`/auth/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
```

### 6.2 Mẫu code `frontend/src/services/audit.service.ts`

```typescript
import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  AuditLogItem,
  ListAuditQueryParams,
  PaginatedAuditResponse,
} from "@/src/types/api/audit";

export const AuditService = {
  /**
   * Lấy danh sách nhật ký kiểm toán kèm phân trang và bộ lọc
   */
  getAuditLogs: async (params?: ListAuditQueryParams): Promise<PaginatedAuditResponse> => {
    try {
      const response = await apiClient.get<PaginatedAuditResponse>("/audit-logs", {
        params,
      });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Lấy chi tiết một bản ghi audit log
   */
  getAuditLogById: async (id: string): Promise<AuditLogItem> => {
    try {
      const response = await apiClient.get<AuditLogItem>(`/audit-logs/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
```

### 6.3 Mẫu code Hook `frontend/src/hooks/api/use-audit.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { AuditService } from "@/src/services/audit.service";
import type { ListAuditQueryParams } from "@/src/types/api/audit";

export function useAuditLogs(params: ListAuditQueryParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => AuditService.getAuditLogs(params),
    placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ trong lúc fetch trang mới (mượt mà)
    staleTime: 30_000, // Cache 30 giây
  });
}

export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: ["audit-log-detail", id],
    queryFn: () => (id ? AuditService.getAuditLogById(id) : null),
    enabled: Boolean(id),
  });
}
```

---

## 7. Kế hoạch Triển khai Chi tiết Từng Bước (Implementation Roadmap)

### Giai đoạn 1: Chuẩn hóa Bộ khung & Phân quyền Admin Layout
- [ ] Cập nhật `frontend/src/app/(admin)/layout.tsx`:
  - Tích hợp `AdminSidebar`, `AdminHeader`, `AdminFooter`.
  - Bổ sung Guard kiểm tra trạng thái đăng nhập và role `ADMIN`.
  - Hỗ trợ responsive Drawer trên giao diện điện thoại/máy tính bảng.
- [ ] Tạo các thư mục types & services nền tảng:
  - `frontend/src/types/api/users.ts`
  - `frontend/src/types/api/system-config.ts`
  - `frontend/src/types/api/audit.ts`
  - `frontend/src/services/users.service.ts`
  - `frontend/src/services/audit.service.ts`

### Giai đoạn 2: Triển khai Trang Quản lý Người dùng (`/users`)
- [ ] Xây dựng UI Component `UserStatsOverview`: 4 thẻ thống kê số lượng tài khoản theo phân loại.
- [ ] Xây dựng `UserFilters`: Ô tìm kiếm keyword (debounce 300ms), Dropdown lọc theo vai trò (`ADMIN`, `GIAO_VU`, `GVHD`, `NCS`), Dropdown lọc trạng thái (`active`, `locked`).
- [ ] Xây dựng `UserTable`: Hiển thị danh sách, avatar, nhãn role, badge trạng thái hoạt động, các nút thao tác.
- [ ] Xây dựng `CreateUserModal`: Hỗ trợ thêm đơn lẻ và chuyển tab upload danh sách CSV.
- [ ] Xây dựng `UserStatusConfirmDialog` & `ResetPasswordDialog`: Xác nhận an toàn trước khi thay đổi trạng thái tài khoản.
- [ ] Hoàn thiện `frontend/src/app/(admin)/users/page.tsx`: Kết nối React Query `useUsers` với URL search params để hỗ trợ back/forward trình duyệt và chia sẻ liên kết.

### Giai đoạn 3: Triển khai Trang Cấu hình Hệ thống (`/system`)
- [ ] Thiết lập giao diện điều hướng Tabs tại `frontend/src/app/(admin)/system/page.tsx`:
  - **Tab 1: Danh mục WoS/Scopus/HĐGSNN:** Bảng tra cứu ISSN, điểm quy đổi, nút Import Excel danh mục HĐGSNN.
  - **Tab 2: Quy chế Đào tạo:** Form nhập thời gian đào tạo chuẩn, thời gian gia hạn, hạn mức hướng dẫn tối đa của GVHD kèm validation.
  - **Tab 3: Thông tin Học vụ:** Thông tin liên hệ, phòng đào tạo, thông số gửi email.
- [ ] Kết nối API hoặc Mock service để lưu cấu hình hệ thống an toàn.

### Giai đoạn 4: Triển khai Trang Nhật ký Kiểm toán (`/audit-log`)
- [ ] `AuditBadge`: Nhận vào mã `action`, hiển thị nhãn tiếng Việt và màu sắc trực quan theo bảng từ điển.
- [ ] `AuditFilters`: Thanh tìm kiếm từ khóa/MSHV, dropdown thực thể, dropdown hành động, bộ chọn khoảng ngày (Date Range Picker).
- [ ] `AuditDiffViewer`: Component render so sánh 2 cột trực quan giữa `oldValue` và `newValue`.
- [ ] `AuditDetailDialog`: Dialog hiển thị chi tiết nhật ký thao tác và thông tin Actor, NCS.
- [ ] `AuditTable`: Bảng dữ liệu có server-side pagination, skeleton loading, empty state.
- [ ] Hoàn thiện `frontend/src/app/(admin)/audit-log/page.tsx`.

### Giai đoạn 5: Kiểm thử Toàn diện & Tối ưu Trải nghiệm (Testing & Polish)
- [ ] **Kiểm thử phân quyền RBAC:** Đăng nhập tài khoản role `NCS` hoặc `GVHD` truy cập trực tiếp URL `/users` hoặc `/audit-log` -> Đảm bảo bị chặn và hiển thị màn hình 403 thân thiện.
- [ ] **Kiểm thử tìm kiếm & phân trang:** Kiểm tra bộ lọc từ khóa, phân trang URL params, giữ trạng thái lọc khi F5 trang.
- [ ] **Kiểm thử thao tác nhạy cảm:** Kiểm tra khóa tài khoản, reset password, đảm bảo có thông báo Toast rõ ràng bằng tiếng Việt.
- [ ] **Kiểm thử Responsive:** Đảm bảo thanh điều hướng Sidebar co giãn mượt mà trên Mobile / Tablet / Desktop.

---

## 8. Quy tắc An toàn Thông tin & Xử lý Ngoại lệ

1. **Bảo vệ Định danh & Thông tin Nhạy cảm:**
   - Không bao giờ hiển thị mật khẩu dạng clear-text trong bảng dữ liệu hoặc nhật ký kiểm toán.
   - Khi reset mật khẩu, chỉ hiển thị mật khẩu tạm thời một lần duy nhất trong Dialog xác nhận kèm nút sao chép nhanh, đồng thời bắt buộc người dùng đổi mật khẩu ở lần đăng nhập kế tiếp (`mustChangePassword: true`).
2. **Ngăn chặn Tự khóa Tài khoản (Self-lock Prevention):**
   - Trên giao diện `/users`, vô hiệu hóa nút "Khóa tài khoản" đối với chính tài khoản Admin đang đăng nhập để tránh tình trạng vô tình tự khóa quyền truy cập của bản thân.
3. **Xử lý Dữ liệu Rỗng & Lỗi Mạng:**
   - Khi `oldValue` hoặc `newValue` trong Audit Log là `null` hoặc `{}`: Hiển thị nhãn *"Không có dữ liệu thay đổi"* thay vì để trống.
   - Khi tài khoản thực hiện thao tác đã bị xóa vĩnh viễn (`actor` là `null`): Hiển thị ID rút gọn kèm tooltip chú thích *"Tài khoản người dùng này không còn tồn tại trên hệ thống"*.
   - Xử lý lỗi tập trung thông qua `parseApiError` từ `@/src/lib/api` để hiển thị Toast thông báo lỗi tiếng Việt thân thiện, không làm sập giao diện (Crash UI).
