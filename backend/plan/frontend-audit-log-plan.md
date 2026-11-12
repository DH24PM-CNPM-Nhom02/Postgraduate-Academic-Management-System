# Phân hệ Nhật ký Kiểm toán (Audit Log): Tài liệu Đặc tả & Kế hoạch Triển khai cho Frontend

> **Dành cho:** Đội ngũ Frontend (FE)  
> **Màn hình:** Admin Console — Nhật ký kiểm toán (`/audit-log`)  
> **Phân hệ Backend tương ứng:** `api-gateway` (`/api/v1/audit-logs`) & `phd-service` (`audit` module)  
> **Tài liệu tham chiếu:** [`frontend-9moc-plan.md`](./frontend-9moc-plan.md), [`frontend-thesis-change-request-plan.md`](./frontend-thesis-change-request-plan.md)

---

## Mục lục

1. [Tổng quan nghiệp vụ & Mục tiêu](#1-tổng-quan-nghiệp-vụ--mục-tiêu)
2. [Chi tiết API Gateway Endpoint](#2-chi-tiết-api-gateway-endpoint)
3. [Cơ chế Phân trang & Bộ lọc truy vấn](#3-cơ-chế-phân-trang--bộ-lọc-truy-vấn)
4. [Đặc tả Dữ liệu & Typescript Interfaces](#4-đặc-tả-dữ-liệu--typescript-interfaces)
5. [Từ điển Ánh xạ Hành động (Action Dictionary & UI Badges)](#5-từ-điển-ánh-xạ-hành-động-action-dictionary--ui-badges)
6. [Thiết kế Giao diện Người dùng (UI/UX Specification)](#6-thiết-kế-giao-diện-người-dùng-uiux-specification)
7. [Cấu trúc Thư mục & Mã nguồn Khuyến nghị](#7-cấu-trúc-thư-mục--mã-nguồn-khuyến-nghị)
8. [Kế hoạch Triển khai Chi tiết từng Bước (Step-by-Step Plan)](#8-kế-hoạch-triển-khai-chi-tiết-từng-bước-step-by-step-plan)
9. [Bảo mật & Xử lý Ngoại lệ](#9-bảo-mật--xử-lý-ngoại-lệ)

---

## 1. Tổng quan nghiệp vụ & Mục tiêu

Phân hệ **Audit Log (Nhật ký kiểm toán / Nhật ký thao tác)** là thành phần an toàn thông tin bắt buộc theo tài liệu SRS (Mục 4.2 & NFR-Security). Hệ thống tự động ghi nhận vĩnh viễn (append-only) các hành vi thay đổi dữ liệu trọng yếu trong cùng transaction nghiệp vụ.

Trang `/audit-log` cung cấp cho **Quản trị viên hệ thống (Admin)** công cụ toàn diện để:
- **Theo dõi & Giám sát:** Nắm bắt ai đã làm gì, vào thời điểm nào, từ địa chỉ IP nào.
- **Truy vết thay đổi (Audit Trail):** Xem lại chính xác trạng thái trước (`oldValue`) và sau (`newValue`) của từng thao tác (đổi trạng thái học tập của NCS, giao/hủy đề tài, duyệt mốc tiến độ, ban hành/hủy quyết định, duyệt đơn gia hạn...).
- **Khắc phục sự cố & Đối soát:** Tìm kiếm nhanh theo mã số NCS, người thực hiện hoặc khoảng thời gian để đối soát dữ liệu khi có tranh chấp hoặc khiếu nại học vụ.

---

## 2. Chi tiết API Gateway Endpoint

Tất cả request phải đính kèm Header: `Authorization: Bearer <access_token>`.

### 2.1 Lấy danh sách nhật ký thao tác
* **Method:** `GET`
* **Path:** `/audit-logs` (hoặc alias `/audits`)
* **URL đầy đủ:** `http://localhost:8080/api/v1/audit-logs`
* **Quyền hạn yêu cầu:** Role `ADMIN` hoặc sở hữu permission `audit.read`.
* **Mô tả:** Trả về danh sách nhật ký kèm thông tin đã làm giàu của Actor (người thao tác) và NCS liên quan.

### 2.2 Xem chi tiết 1 bản ghi nhật ký
* **Method:** `GET`
* **Path:** `/audit-logs/:id` (hoặc alias `/audits/:id`)
* **Quyền hạn yêu cầu:** Role `ADMIN` hoặc sở hữu permission `audit.read`.
* **Path Params:** `id` (UUID của bản ghi audit log).
* **Mô tả:** Trả về chi tiết đầy đủ 1 log bao gồm `oldValue`, `newValue`, `clientIp`, `correlationId`, `actor`, `ncs`.

---

## 3. Cơ chế Phân trang & Bộ lọc truy vấn

API hỗ trợ cơ chế **Hybrid Pagination** (phân trang linh hoạt):

### 3.1 Khuyến nghị cho trang Audit Log: **Server-side Pagination**
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

### 3.2 Các tham số lọc Query (Query Parameters)

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

## 4. Đặc tả Dữ liệu & Typescript Interfaces

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

## 5. Từ điển Ánh xạ Hành động (Action Dictionary & UI Badges)

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

## 6. Thiết kế Giao diện Người dùng (UI/UX Specification)

Giao diện trang `/audit-log` được cấu thành từ 4 khối thành phần chính:

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

### 6.1 Khối 1: Header & Quick Stats
* **Tiêu đề:** "Nhật ký kiểm toán hệ thống" kèm icon `History` hoặc `ShieldCheck`.
* **Phụ đề:** "Lưu vết toàn bộ thao tác thay đổi dữ liệu, cấp quyền và pháp lý phục vụ thanh tra, kiểm tra".
* **Nút bấm hành động:**
  * **Làm mới (Refresh):** Tải lại dữ liệu nhanh.
  * **Xuất CSV/Excel (Export):** Xuất danh sách log hiện tại ra file để lưu trữ báo cáo.

### 6.2 Khối 2: Bộ lọc linh hoạt (Filter Panel)
* **Search Input:** Ô tìm kiếm có debounce (300ms–500ms). Người dùng có thể gõ MSHV (vd `2024NCS001`), tên NCS, hoặc mã action.
* **Dropdown Loại Hành động (Action):** Nhóm các hành động phổ biến (Tất cả, Đổi trạng thái, Giao đề tài, Duyệt mốc, Ban hành quyết định...).
* **Dropdown Thực thể (Entity Type):** `NghienCuuSinh`, `QuyetDinh`, `DeTai`, `TienTrinhNcs`, `PhanCongHuongDan`, `DeNghiDieuChinh`.
* **Date Range Picker (Khoảng thời gian):** Lựa chọn ngày bắt đầu (`fromDate`) và ngày kết thúc (`toDate`).
* **Nút "Đặt lại (Reset)":** Xóa toàn bộ bộ lọc và quay về trang 1.

### 6.3 Khối 3: Bảng dữ liệu chính (Audit Table)
Các cột hiển thị:
1. **Thời gian (`createdAt`):**
   * Dòng 1: Định dạng chuẩn `DD/MM/YYYY HH:mm:ss`.
   * Dòng 2: Thời gian tương đối màu xám nhạt (vd: *"10 phút trước"*).
2. **Người thực hiện (`actor`):**
   * Avatar chữ cái đầu.
   * Tên đầy đủ (`fullName`), username trong ngoặc `(username)`.
   * Badge hiển thị vai trò (vd: `ADMIN`, `GIAO_VU`).
   * Nếu không tìm thấy actor (do tài khoản đã bị xóa hoàn toàn): Hiển thị `actorId` rút gọn.
3. **Hành động (`action`):**
   * Badge màu theo bảng từ điển mục 5.
4. **Đối tượng bị tác động (`entityType` & `entityId`):**
   * Tên loại thực thể (vd: *Quyết định*, *Đề tài*).
   * ID rút gọn kèm nút copy UUID tiện lợi.
5. **NCS liên quan (`ncs`):**
   * Nếu có: Hiển thị Họ tên + MSHV (có thể click để xem thông tin NCS).
   * Nếu không có: Dấu gạch ngang `-`.
6. **Thao tác:**
   * Nút bấm biểu tượng con mắt `Eye` hoặc chữ **"Xem chi tiết"** mở Dialog.

### 6.4 Khối 4: Dialog/Drawer So sánh Chi tiết (Audit Detail Dialog)
Khi người dùng bấm vào một dòng:
* **Tab 1: Tổng quan:**
  * Mã bản ghi (ID), Thời gian chi tiết, Client IP, Correlation ID.
  * Thông tin tài khoản người thực hiện (Username, Họ tên, Email).
  * Thông tin NCS liên quan (MSHV, Họ tên).
* **Tab 2: So sánh thay đổi (Visual Diff / Old vs New Value):**
  * Hiển thị dạng 2 cột trực quan:
    * **Cột trái:** Giá trị trước khi sửa (`Giá trị cũ` - Màu đỏ nhạt/xám).
    * **Cột phải:** Giá trị sau khi sửa (`Giá trị mới` - Màu xanh lá nhạt).
  * Hỗ trợ format JSON đẹp hoặc liệt kê từng trường thay đổi (ví dụ: `Trạng thái: DANG_HOC ➔ GIA_HAN`).

---

## 7. Cấu trúc Thư mục & Mã nguồn Khuyến nghị

```text
frontend/src/
├── types/
│   └── api/
│       └── audit.ts                     # Interfaces DTO & Query params
├── services/
│   └── audit.service.ts                 # Service gọi API qua apiClient
├── hooks/
│   └── api/
│       └── use-audit.ts                 # React Query hook quản lý fetch, filter, pagination
└── components/
    └── admin/
        └── audit/
            ├── audit-table.tsx          # Bảng dữ liệu TanStack Table / UI Table
            ├── audit-filters.tsx        # Thanh công cụ lọc & tìm kiếm
            ├── audit-badge.tsx          # Render badge màu theo loại action
            ├── audit-detail-dialog.tsx  # Modal xem chi tiết log & thông tin actor
            └── audit-diff-viewer.tsx    # Thành phần so sánh Old Value vs New Value
```

### 7.1 Mẫu code `frontend/src/services/audit.service.ts`

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

### 7.2 Mẫu code `frontend/src/hooks/api/use-audit.ts`

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

## 8. Kế hoạch Triển khai Chi tiết từng Bước (Step-by-Step Plan)

### Bước 1: Khai báo Types & Service
- [ ] Tạo file `frontend/src/types/api/audit.ts` với đầy đủ interfaces như mục 4.
- [ ] Tạo file `frontend/src/services/audit.service.ts` kết nối với API `/audit-logs`.
- [ ] Tạo custom hook `frontend/src/hooks/api/use-audit.ts` sử dụng `@tanstack/react-query`.

### Bước 2: Xây dựng các UI Components con
- [ ] `AuditBadge`: Nhận vào `action`, hiển thị nhãn Tiếng Việt và màu badge phù hợp (mục 5).
- [ ] `AuditFilters`: Ô tìm kiếm (MSHV, Tên, Action), Dropdown chọn Action, Dropdown Entity, Date Picker (từ ngày - đến ngày), nút Reset.
- [ ] `AuditDiffViewer`: Component nhận `oldValue` và `newValue`, hiển thị so sánh đẹp mắt (Key-Value table hoặc JSON visualizer).
- [ ] `AuditDetailDialog`: Dialog hiển thị chi tiết log khi người dùng click vào một hàng.

### Bước 3: Hoàn thiện Bảng `AuditTable` & Trang `page.tsx`
- [ ] Xây dựng `AuditTable` hiển thị các cột theo đặc tả mục 6.3.
- [ ] Tích hợp Pagination controls: Chuyển trang (Next/Prev), nhảy đến trang cụ thể, chọn kích thước trang (Page Size: 10, 20, 50).
- [ ] Cập nhật file `frontend/src/app/(admin)/audit-log/page.tsx`:
  - Kết nối `useAuditLogs` với state của bộ lọc và phân trang từ URL Search Params (giúp chia sẻ link lọc và giữ trạng thái khi reload).
  - Xử lý trạng thái Loading (Skeleton table), Empty state (Không có dữ liệu), và Error state (Hiển thị thông báo lỗi thân thiện kèm nút Thử lại).

### Bước 4: Kiểm thử & Tối ưu hóa (Testing & Polish)
- [ ] Kiểm tra phân quyền: Thử truy cập với tài khoản không phải `ADMIN` -> Kiểm tra xem có bị chặn 403 hoặc chuyển hướng đúng không.
- [ ] Kiểm tra tìm kiếm: Tìm kiếm theo MSHV của NCS (vd: `2024NCS001`), kiểm tra kết quả trả về.
- [ ] Kiểm tra bộ lọc ngày: Chọn khoảng ngày và kiểm tra các bản ghi đúng trong khoảng `fromDate` đến `toDate`.
- [ ] Kiểm tra modal so sánh Diff: Đảm bảo các JSON phức tạp (như mảng hoặc object lồng) hiển thị rõ ràng, không bị vỡ layout trên màn hình nhỏ.

---

## 9. Bảo mật & Xử lý Ngoại lệ

1. **Kiểm soát Truy cập Phía Frontend:**
   - Trang `/audit-log` thuộc Route Group `(admin)`. Cần đảm bảo component kiểm tra `user.roles?.includes('ADMIN')` hoặc bọc bởi Guard phân quyền của Admin Layout.
   - Nếu người dùng không có quyền: Chuyển hướng về `/` hoặc hiển thị màn hình 403 Forbidden.
2. **Xử lý Khi Dữ liệu Trống hoặc Lỗi:**
   - Khi `oldValue` hoặc `newValue` là `null` / `{}`: Hiển thị nhãn *"Không có dữ liệu thay đổi"* thay vì để trống.
   - Khi `actor` bị `null`: Hiển thị ID người dùng dạng rút gọn (vd: `usr-5285...`) và tooltip chú thích *"Tài khoản người dùng này có thể đã bị xóa khỏi hệ thống"*.
   - Khi mạng mất kết nối hoặc Backend trả lỗi 500: Dùng `parseApiError` từ `@/src/lib/api` để hiển thị Toast thông báo lỗi tiếng Việt dễ hiểu.

