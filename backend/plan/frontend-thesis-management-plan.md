# Phân hệ Quản trị Đào tạo Sau Đại học: Kế hoạch & Đặc tả Kỹ thuật Frontend Trang Quản lý Đề tài Luận án (Thesis Management)

> **Dành cho:** Đội ngũ Frontend (FE)  
> **Phân hệ:** Quản lý Học vụ - Đề tài Luận án Tiến sĩ (Academic Affairs / Thesis Management)  
> **Trang triển khai:** `/academic/theses` (hoặc `/academic/thesis`)  
> **Route Group Frontend:** `frontend/src/app/(academic)/academic/theses/`  
> **Backend Service phụ trách:** `phd-service` (Module `thesis`, `decision`), `api-gateway` (`ThesisController`, `DecisionController`)  
> **Mã nguồn Backend tham chiếu:** [`thesis.service.ts`](../apps/phd-service/src/thesis/thesis.service.ts), [`thesis.controller.ts (API Gateway)`](../apps/api-gateway/src/thesis/thesis.controller.ts), [`thesis.dto.ts`](../lib/contracts/src/dto/thesis.dto.ts)  
> **Tài liệu liên quan:** [`frontend-thesis-change-request-plan.md`](./frontend-thesis-change-request-plan.md), [`frontend-9moc-plan.md`](./frontend-9moc-plan.md), [`backend-plan-phd.md`](./backend-plan-phd.md)

---

## Mục lục

1. [Tổng quan Nghiệp vụ & Phạm vi Quyền hạn (RBAC)](#1-tổng-quan-nghiệp-vụ--phạm-vi-quyền-hạn-rbac)
2. [Khảo sát & Phân tích Chi tiết API Backend Hiện có](#2-khảo-sát--phân-tích-chi-tiết-api-backend-hiện-có)
3. [Kiến trúc Mã nguồn Frontend & Định danh Router](#3-kiến-trúc-mã-nguồn-frontend--định-danh-router)
4. [Đặc tả TypeScript Interfaces & DTOs Chuẩn hóa](#4-đặc-tả-typescript-interfaces--dtos-chuẩn-hóa)
5. [Thiết kế Chi tiết Giao diện & Trải nghiệm Người dùng (UI/UX)](#5-thiết-kế-chi-tiết-giao-diện--trải-nghiệm-người-dùng-uiux)
   - 5.1 [Thanh Thống kê Nhanh (KPI Summary Cards)](#51-thanh-thống-kê-nhanh-kpi-summary-cards)
   - 5.2 [Thanh Bộ lọc & Tìm kiếm Tích hợp (Filter Bar)](#52-thanh-bộ-lọc--tìm-kiếm-tích-hợp-filter-bar)
   - 5.3 [Bảng Danh sách Quản lý Đề tài Luận án (Theses Data Table)](#53-bảng-danh-sách-quản-lý-đề-tài-luận-án-theses-data-table)
   - 5.4 [Modal Giao Đề tài Luận án Mới (`ThesisAssignmentModal`)](#54-modal-giao-đề-tài-luận-án-mới-thesisassignmentmodal)
   - 5.5 [Modal Hủy Giao Đề tài do Sai sót (`ThesisDeactivateModal`)](#55-modal-hủy-giao-đề-tài-do-sai-sót-thesisdeactivatemodal)
   - 5.6 [Drawer Chi tiết Hồ sơ & Lịch sử Đề tài (`ThesisDetailDrawer`)](#56-drawer-chi-tiết-hồ-sơ--lịch-sử-đề-tài-thesisdetaildrawer)
6. [Quy tắc Nghiệp vụ Nghiêm ngặt & Xử lý Ngoại lệ (Edge Cases)](#6-quy-tắc-nghiệp-vụ-nghiêm-ngặt--xử-lý-ngoại-lệ-edge-cases)
7. [Tích hợp Hệ sinh thái Hệ thống (Ecosystem Integration)](#7-tích-hợp-hệ-sinh-thái-hệ-thống-ecosystem-integration)
8. [Kế hoạch Triển khai Từng bước (Implementation Roadmap)](#8-kế-hoạch-triển-khai-từng-bước-implementation-roadmap)
9. [Bảng Kiểm thử & Checklist Nghiệm thu (Test Checklist)](#9-bảng-kiểm-thử--checklist-nghiệm-thu-test-checklist)

---

## 1. Tổng quan Nghiệp vụ & Phạm vi Quyền hạn (RBAC)

### 1.1 Mục tiêu phân hệ
Trong quy trình đào tạo Tiến sĩ, việc giao tên đề tài nghiên cứu chính thức cho Nghiên cứu sinh (NCS) là mốc pháp lý đặc biệt quan trọng (thường diễn ra sau khi có quyết định công nhận NCS hoặc quyết định giao đề tài nghiên cứu từ Ban Giám hiệu / Phòng Đào tạo SĐH).

Mục tiêu của trang **Quản lý Đề tài Luận án (Thesis Management)** dành cho Giáo vụ / Chuyên viên đào tạo SĐH là:
1. **Theo dõi bao quát:** Nắm bắt toàn bộ hiện trạng đề tài của tất cả NCS trong cơ sở dữ liệu (Ai đã được giao đề tài? Ai chưa có đề tài? Tên đề tài là gì? Quyết định số mấy?).
2. **Thực thi nghiệp vụ giao đề tài chuẩn hóa:** Thực hiện thao tác gán đề tài theo đúng Quyết định giao đề tài (`GIAO_DE_TAI`) đã được số hóa trên hệ thống, kèm kiểm tra ràng buộc tự động.
3. **Quản lý sai sót hành chính:** Hủy bỏ đề tài bị giao sai người/nhập nhầm quyết định với đầy đủ biên bản lý do và lưu vết kiểm toán (Audit Trail).
4. **Truy cứu lịch sử biến động:** Nắm rõ lịch sử từng lần đổi đề tài, thay thế đề tài qua các giai đoạn nghiên cứu của NCS.

### 1.2 Phân quyền & RBAC Guard
Trang quản lý này được đặt dưới sự bảo vệ của hệ thống phân quyền RBAC qua API Gateway:

| Quyền hạn (`Permission`) | Key trong hệ thống | Ý nghĩa trên giao diện Giáo vụ |
|---|---|---|
| **Xem danh sách & chi tiết** | `assignment.read` (`PERMISSIONS.ASSIGNMENT_READ`) | Được truy cập trang `/academic/theses`, xem bảng dữ liệu, lọc và xem drawer chi tiết lịch sử đề tài của NCS. |
| **Giao đề tài mới** | `assignment.create` (`PERMISSIONS.ASSIGNMENT_CREATE`) | Hiển thị nút bấm `+ Giao đề tài mới` và các nút giao đề tài nhanh tại từng hàng NCS chưa có đề tài. |
| **Hủy đề tài do sai sót** | `assignment.update` (`PERMISSIONS.ASSIGNMENT_UPDATE`) | Hiển thị nút `Hủy đề tài` (Destructive action) đối với đề tài đang hiệu lực. |
| **Xem quyết định** | `decision.read` (`PERMISSIONS.DECISION_READ`) | Truy vấn danh sách quyết định `GIAO_DE_TAI` hiệu lực để chọn khi giao đề tài. |

---

## 2. Khảo sát & Phân tích Chi tiết API Backend Hiện có

Các API đã được xây dựng hoàn chỉnh tại `phd-service` và expose qua `api-gateway`:

### 2.1 API Lấy danh sách tổng hợp NCS & Đề tài
- **Endpoint:** `GET /thesis`
- **Quyền:** `assignment.read`
- **Query Parameters (`ThesisListQueryDto`):**
  - `page?: number` (Mặc định `1`, tối thiểu `1`)
  - `limit?: number` (Mặc định `10` hoặc `20`, tối đa `100`)
  - `khoaHocId?: UUID` (Lọc theo khóa học đào tạo của NCS)
  - `trangThai?: 'HIEU_LUC' | 'DA_THAY_THE' | 'DA_HUY' | 'CHUA_GIAO'` (Lọc theo trạng thái đề tài)
  - `gvhdId?: UUID` (Lọc các NCS có GVHD chỉ định đang phân công hiệu lực)
- **Cấu trúc Dữ liệu Trả về (Pagination Response):**
```json
{
  "data": [
    {
      "id": "e4a7a8d5-1b32-4bf1-8e41-b84742fba50a",
      "mshv": "NCS2024001",
      "hoTen": "Nguyễn Văn A",
      "khoaHoc": "Khóa 2024 - 2027",
      "trangThaiDeTai": "HIEU_LUC",
      "deTaiHienTai": {
        "id": "7fa12c98-47c1-4b16-bb70-4352ff6aa7b1",
        "tenDeTai": "Nghiên cứu ứng dụng Deep Learning trong phân tích ảnh y tế",
        "trangThai": "HIEU_LUC",
        "quyetDinhId": "3cb15bf6-6b45-42f0-ba3e-90822fa6efd2",
        "quyetDinh": {
          "soQuyetDinh": "123/QĐ-ĐHQG",
          "ngayQuyetDinh": "2024-03-15T00:00:00.000Z"
        },
        "createdAt": "2024-03-16T08:30:00.000Z"
      },
      "deTais": [
        {
          "id": "7fa12c98-47c1-4b16-bb70-4352ff6aa7b1",
          "tenDeTai": "Nghiên cứu ứng dụng Deep Learning trong phân tích ảnh y tế",
          "trangThai": "HIEU_LUC",
          "quyetDinh": {
            "soQuyetDinh": "123/QĐ-ĐHQG",
            "ngayQuyetDinh": "2024-03-15T00:00:00.000Z"
          },
          "createdAt": "2024-03-16T08:30:00.000Z"
        }
      ],
      "phanCongs": [
        {
          "id": "11111111-2222-3333-4444-555555555555",
          "gvhd": {
            "id": "gvhd-uuid-1",
            "hoTen": "PGS.TS. Trần Thị B"
          },
          "quyetDinh": {
            "soQuyetDinh": "110/QĐ-ĐHQG",
            "ngayQuyetDinh": "2024-02-01T00:00:00.000Z"
          }
        }
      ]
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### 2.2 API Giao đề tài luận án
- **Endpoint:** `POST /thesis`
- **Quyền:** `assignment.create`
- **Payload (`AssignThesisDto`):**
```json
{
  "ncsId": "e4a7a8d5-1b32-4bf1-8e41-b84742fba50a",
  "quyetDinhId": "3cb15bf6-6b45-42f0-ba3e-90822fa6efd2",
  "tenDeTai": "Nghiên cứu tối ưu hóa mô hình Transformer cho bài toán xử lý tiếng Việt"
}
```
- **Ràng buộc nghiệp vụ tự động tại Backend:**
  - `tenDeTai`: Bắt buộc, chuỗi từ 1 đến 500 ký tự (đã tự động `.trim()`).
  - `ncsId`: Phải tồn tại và đang ở trạng thái `DANG_HOC` hoặc `GIA_HAN`.
  - `quyetDinhId`: Phải thuộc loại `GIAO_DE_TAI`, trạng thái `HIEU_LUC`, và `ncsId` của quyết định phải khớp với `dto.ncsId`.
  - NCS **chưa được có đề tài nào đang `HIEU_LUC`** (HTTP 409 nếu đã có).
  - NCS **không có bất kỳ đơn đề nghị điều chỉnh nào đang ở trạng thái `CHO_DUYET`** (HTTP 409 nếu có).
  - Quyết định này chưa từng được gán cho đề tài đang hiệu lực nào khác (HTTP 409).
- **Tác vụ ngầm sau khi lưu thành công:**
  - Ghi vết `AuditLog` với action `THESIS_ASSIGN`.
  - Gửi thông báo Notification đến tài khoản NCS (`NCS_DUOC_GIAO_DE_TAI`).
  - Gửi thông báo Notification đến tất cả các GVHD đang hướng dẫn NCS (`GVHD_NCS_DUOC_GIAO_DE_TAI`).

### 2.3 API Hủy giao đề tài (Do sai sót hành chính)
- **Endpoint:** `PATCH /thesis/:id/deactivate`
- **Quyền:** `assignment.update`
- **Path Param:** `:id` (UUID của bản ghi `DeTai`)
- **Payload (`DeactivateThesisAssignmentDto`):**
```json
{
  "lyDo": "Nhập nhầm tên đề tài theo Quyết định giao đề tài của NCS khác"
}
```
- **Ràng buộc nghiệp vụ tự động tại Backend:**
  - Đề tài phải tồn tại và đang ở trạng thái `HIEU_LUC`.
  - `lyDo`: Bắt buộc có nội dung sau khi trim.
  - NCS không được có đơn đề nghị điều chỉnh nào đang `CHO_DUYET` (tránh xung đột dữ liệu).
- **Tác vụ ngầm sau khi hủy thành công:**
  - Chuyển trạng thái `DeTai` thành `DA_HUY`, ghi nhận `ngayKetThuc = new Date()`.
  - Ghi vết `AuditLog` với action `THESIS_CANCEL` kèm lý do chi tiết.
  - Gửi thông báo thu hồi/hủy đề tài đến NCS và GVHD (`NCS_DE_TAI_BI_HUY`, `GVHD_DE_TAI_NCS_BI_HUY`).

### 2.4 API Xem chi tiết toàn diện hồ sơ đề tài NCS
- **Endpoint:** `GET /thesis/admin/:ncsId`
- **Quyền:** `assignment.read`
- **Path Param:** `:ncsId` (UUID của NCS)
- **Trả về:** Hồ sơ đầy đủ của NCS gồm toàn bộ lịch sử đề tài (`deTais` kèm `quyetDinh.fileId`), toàn bộ lịch sử phân công GVHD (`phanCongs` kèm học hàm học vị, mã GV, email, quyết định và `fileId`), tách riêng `deTaiHienTai` và `phanCongsHienTai`.

### 2.5 API Tham chiếu: Lấy danh sách Quyết định giao đề tài
- **Endpoint:** `GET /decisions`
- **Query Params:**
  - `loai=GIAO_DE_TAI`
  - `trangThai=HIEU_LUC`
  - `ncsId={selectedNcsId}`
- Phục vụ cho Dropdown chọn Quyết định trong Modal Giao đề tài.

---

## 3. Kiến trúc Mã nguồn Frontend & Định danh Router

### 3.1 Định vị Router & Layout
Trang quản lý đề tài nằm trong route group `(academic)`:
- URL truy cập: `/academic/theses` (hoặc alias `/academic/thesis`)
- File page: `frontend/src/app/(academic)/academic/theses/page.tsx`
- Tuân thủ mô hình **Thin Route Page**: Page component chỉ đóng vai trò mount View Component chính `ThesesManagementView`.

### 3.2 Tích hợp Sidebar Navigation
Cập nhật `frontend/src/components/academic/sidebar.tsx`:
- Vị trí: Nhóm `main` (Nghiệp vụ chính), đặt ngay cạnh mục "Quản lý NCS" (`/academic/students`) và "Phân công GVHD" (`/academic/supervisors`).
- Icon đề xuất: `BookOpenCheck` hoặc `GraduationCap` từ `lucide-react`.
- Badge: Hiển thị số lượng NCS **chưa được giao đề tài** (màu hổ phách `amber` hoặc cam để nhắc nhở giáo vụ cần bổ sung đề tài).

```typescript
// Trích đoạn bổ sung vào navigationItems trong sidebar.tsx
{
  id: "theses",
  title: "Quản lý Đề tài Luận án",
  icon: BookOpenCheck,
  group: "main",
  href: "/academic/theses",
  matchPaths: ["/academic/theses", "/academic/thesis"],
}
```

### 3.3 Bản đồ Tổ chức Tệp tin (Folder Tree)
```
frontend/src/
├── app/
│   └── (academic)/
│       └── academic/
│           └── theses/
│               └── page.tsx                    <-- Thin page router
├── components/
│   └── academic/
│       ├── index.ts                            <-- Export public components
│       └── theses/
│           ├── ThesesManagementView.tsx        <-- Container View chính
│           ├── ThesesKpiCards.tsx              <-- 4 Card thống kê trạng thái
│           ├── ThesesFilterBar.tsx             <-- Thanh tìm kiếm & bộ lọc
│           ├── ThesesTable.tsx                 <-- Bảng danh sách NCS & đề tài
│           ├── ThesesPagination.tsx            <-- Thanh phân trang server-side
│           ├── ThesisStatusBadge.tsx           <-- Badge trạng thái chuẩn màu
│           ├── ThesisAssignmentModal.tsx       <-- Modal giao đề tài mới
│           ├── ThesisDeactivateModal.tsx       <-- Modal xác nhận hủy đề tài
│           └── ThesisDetailDrawer.tsx          <-- Drawer xem lịch sử chi tiết
├── hooks/
│   └── use-theses.ts                           <-- React Query hooks chuyên biệt
├── services/
│   └── thesis.ts                               <-- API Client service mở rộng
└── types/
    └── api/
        └── thesis.ts                           <-- DTOs & TypeScript types
```

---

## 4. Đặc tả TypeScript Interfaces & DTOs Chuẩn hóa

Bổ sung các types tương ứng vào `frontend/src/types/api/thesis.ts`:

```typescript
// Trạng thái của một bản ghi đề tài
export type BackendTrangThaiDeTai = "HIEU_LUC" | "DA_THAY_THE" | "DA_HUY";

// Trạng thái tổng hợp hiển thị cho NCS
export type ThesisViewFilterStatus = "ALL" | "HIEU_LUC" | "CHUA_GIAO" | "DA_THAY_THE" | "DA_HUY";

export interface BackendQuyetDinhSummary {
  id?: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  fileId?: string | null;
}

export interface BackendThesisItem {
  id: string;
  ncsId?: string;
  tenDeTai: string;
  trangThai: BackendTrangThaiDeTai;
  quyetDinhId?: string | null;
  quyetDinh?: BackendQuyetDinhSummary | null;
  ngayKetThuc?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface BackendSupervisorSimple {
  id: string;
  hoTen: string;
  hocHamHocVi?: string;
  email?: string | null;
  maGv?: string | null;
}

export interface BackendPhanCongSimple {
  id: string;
  vaiTro?: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
  gvhd: BackendSupervisorSimple;
  quyetDinh?: BackendQuyetDinhSummary | null;
}

// Đối tượng NCS trả về trong danh sách GET /thesis
export interface AcademicThesisNcsItem {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string;
  trangThaiDeTai: "HIEU_LUC" | "CHUA_GIAO";
  deTaiHienTai: BackendThesisItem | null;
  deTais: BackendThesisItem[];
  phanCongs: BackendPhanCongSimple[];
}

// Phản hồi phân trang từ GET /thesis
export interface AcademicThesisListResponse {
  data: AcademicThesisNcsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tham số truy vấn GET /thesis
export interface AcademicThesisListQuery {
  page?: number;
  limit?: number;
  khoaHocId?: string;
  trangThai?: "HIEU_LUC" | "DA_THAY_THE" | "DA_HUY" | "CHUA_GIAO";
  gvhdId?: string;
  search?: string; // Dùng cho client-side filter tên/MSHV nếu cần
}

// Payload giao đề tài POST /thesis
export interface AssignThesisPayload {
  ncsId: string;
  quyetDinhId: string;
  tenDeTai: string;
}

// Payload hủy đề tài PATCH /thesis/:id/deactivate
export interface DeactivateThesisPayload {
  lyDo: string;
}

// Phản hồi chi tiết GET /thesis/admin/:ncsId
export interface AcademicThesisAdminDetailResponse {
  id: string;
  mshv: string;
  hoTen: string;
  khoaHoc: string;
  deTais: BackendThesisItem[];
  deTaiHienTai: BackendThesisItem | null;
  phanCongs: Array<{
    id: string;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
    trongSo: number | string;
    trangThai: string;
    gvhd: BackendSupervisorSimple;
    quyetDinh?: BackendQuyetDinhSummary | null;
    createdAt: string;
  }>;
  phanCongsHienTai: Array<{
    id: string;
    vaiTro: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
    trongSo: number | string;
    trangThai: string;
    gvhd: BackendSupervisorSimple;
    quyetDinh?: BackendQuyetDinhSummary | null;
  }>;
}
```

---

## 5. Thiết kế Chi tiết Giao diện & Trải nghiệm Người dùng (UI/UX)

Giao diện quản lý đề tài được thiết kế theo phong cách hiện đại của hệ thống (Tailwind CSS, Radix UI/Shadcn, Lucide Icons, font chữ rõ ràng, độ tương phản chuẩn WCAG 2.1).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Header] QUẢN LÝ ĐỀ TÀI LUẬN ÁN TIẾN SĨ                 [ + Giao đề tài mới ] [ Xuất Excel ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ KPI 1: Tổng NCS ]   [ KPI 2: Đã giao đề tài ]  [ KPI 3: Chưa giao ]  [ KPI 4: Đã thay thế/Hủy ] │
│        124 NCS                 108 (87%)               16 (13%)                   12           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Tìm kiếm Tên/MSHV...] [ Khóa học ▼ ] [ Trạng thái đề tài ▼ ] [ Giảng viên HD ▼ ] [Làm mới]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ BẢNG DỮ LIỆU ĐỀ TÀI LUẬN ÁN                                                            │
│ ┌─────────┬──────────────┬────────────┬─────────────────────────────┬───────────┬────┐ │
│ │ MSHV    │ NCS          │ Khóa học   │ Tên đề tài & Quyết định     │ GVHD      │Thao│ │
│ ├─────────┼──────────────┼────────────┼─────────────────────────────┼───────────┼────┤ │
│ │ 2024001 │ Nguyễn Văn A │ Khóa 2024  │ Nghiên cứu ứng dụng Deep... │ PGS. B    │ [⋮]│ │
│ │         │              │            │ QĐ: 123/QĐ-ĐHQG (15/03/2024)│ (HD Chính)│    │ │
│ ├─────────┼──────────────┼────────────┼─────────────────────────────┼───────────┼────┤ │
│ │ 2024002 │ Trần Thị C   │ Khóa 2024  │ ⚠️ Chưa giao đề tài         │ TS. D     │ [⋮]│ │
│ │         │              │            │ [ + Giao đề tài ngay ]      │ (HD Chính)│    │ │
│ └─────────┴──────────────┴────────────┴─────────────────────────────┴───────────┴────┘ │
│ Trang 1/5 (Hiển thị 10/45 bản ghi)                             [< Trước] [1] [2] [Sau >]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Thanh Thống kê Nhanh (KPI Summary Cards)
Bao gồm 4 Card thông tin trực quan nằm ở đầu trang:
1. **Tổng số NCS trong hệ thống / Khóa:** Số lượng NCS tính theo bộ lọc hiện thời.
2. **Đã có đề tài chính thức (`HIEU_LUC`):** Số lượng NCS đã có đề tài hợp lệ, kèm tỷ lệ % hoàn thành phân công đề tài. Màu xanh lá cây (`emerald-600`).
3. **Chưa được giao đề tài (`CHUA_GIAO`):** Số lượng NCS đang học nhưng chưa được ban hành quyết định giao đề tài. Màu hổ phách/cam (`amber-600`), có cảnh báo cần xử lý.
4. **Lịch sử điều chỉnh đề tài:** Số đề tài đã chuyển trạng thái `DA_THAY_THE` hoặc `DA_HUY`. Màu xanh tím (`indigo-600`).

### 5.2 Thanh Bộ lọc & Tìm kiếm Tích hợp (Filter Bar)
- **Input Tìm kiếm:** Cho phép nhập Họ tên hoặc MSHV (Debounced 300ms).
- **Lọc Khóa học (`khoaHocId`):** Dropdown lấy danh sách các khóa đào tạo (VD: Khóa 2021, Khóa 2022, Khóa 2023, Khóa 2024).
- **Lọc Trạng thái Đề tài:**
  - `Tất cả trạng thái`
  - `Đã giao đề tài (Đang hiệu lực)` (`HIEU_LUC`)
  - `Chưa giao đề tài` (`CHUA_GIAO`)
  - `Đã thay thế` (`DA_THAY_THE`)
  - `Đã hủy bỏ` (`DA_HUY`)
- **Lọc Giảng viên Hướng dẫn (`gvhdId`):** Tìm theo giảng viên đang hướng dẫn để xem các đề tài thuộc lab/hướng nghiên cứu của giảng viên đó.
- **Nút "Đặt lại bộ lọc":** Xóa toàn bộ điều kiện lọc về mặc định.

### 5.3 Bảng Danh sách Quản lý Đề tài Luận án (Theses Data Table)
Các cột hiển thị:
1. **Mã số NCS (MSHV):** Hiển thị dạng badge xám nổi bật (VD: `NCS2024001`), click vào mở chi tiết hồ sơ NCS.
2. **Họ và tên NCS:** Tên đậm, hiển thị kèm email/số điện thoại dạng phụ đề nhỏ bên dưới.
3. **Khóa học:** Tên khóa học (VD: `Khóa 2023 - 2026`).
4. **Tên đề tài Luận án & Quyết định:**
   - Nếu đã có đề tài: Tên đề tài in đậm, hiển thị icon tài liệu, bên dưới có dòng chú thích Số quyết định (VD: `QĐ số: 123/QĐ-ĐHQG ngày 15/03/2024`).
   - Nếu chưa giao đề tài: Hiển thị badge màu xám nhạt `Chưa giao đề tài` kèm nút hành động nhanh `+ Giao đề tài`.
   - Nếu có lịch sử nhiều lần đổi đề tài: Hiển thị badge nhỏ `Đã đổi N lần` màu tím nhạt.
5. **Cán bộ Hướng dẫn (GVHD):**
   - Danh sách các GVHD đang hiệu lực kèm nhãn `(Chính)` hoặc `(Đồng HD)`.
   - Nếu chưa phân công GVHD: Hiển thị cảnh báo `Chưa phân công GVHD`.
6. **Trạng thái Đề tài (Status Badge):**
   - `HIEU_LUC`: Xanh lá cây ("Đang hiệu lực").
   - `CHUA_GIAO`: Hổ phách/Vàng ("Chưa giao").
   - `DA_THAY_THE`: Tím ("Đã thay thế").
   - `DA_HUY`: Đỏ xám ("Đã hủy").
7. **Thao tác (Actions Menu `...`):**
   - `Xem chi tiết & Lịch sử đề tài`: Mở Drawer chi tiết bên phải màn hình.
   - `Giao đề tài mới`: (Chỉ hiển thị khi NCS chưa có đề tài hiệu lực).
   - `Hủy đề tài (Giao sai)`: (Chỉ hiển thị khi đề tài đang `HIEU_LUC` - Mở modal cảnh báo màu đỏ).
   - `Xem Quyết định giao đề tài`: Mở modal xem trước file PDF quyết định nếu có `fileId`.

---

### 5.4 Modal Giao Đề tài Luận án Mới (`ThesisAssignmentModal`)

#### Mục đích
Cho phép Giáo vụ chọn một NCS và chính thức gán Tên đề tài Luận án theo đúng Quyết định giao đề tài của trường.

#### Giao diện & Các trường nhập liệu
1. **Thông tin NCS tiếp nhận:**
   - Nếu mở từ nút chung `+ Giao đề tài mới`: Dropdown tìm kiếm NCS (chỉ hiển thị những NCS đang học/gia hạn và chưa có đề tài hiệu lực).
   - Nếu mở từ dòng NCS cụ thể: Hiển thị Card thông tin tĩnh của NCS (MSHV, Họ tên, Khóa học, Trạng thái đào tạo, GVHD đang hướng dẫn).
2. **Tên Đề tài Luận án (`tenDeTai`):**
   - Textarea nhiều dòng với cơ chế đếm ký tự (Character Counter: `.../500 ký tự`).
   - Hướng dẫn nhập: "Ghi rõ tên đề tài bằng tiếng Việt có dấu, viết hoa chữ cái đầu và tên riêng theo đúng văn bản quyết định."
   - Validation: Bắt buộc, không quá 500 ký tự, không được chỉ chứa khoảng trắng.
3. **Quyết định giao đề tài (`quyetDinhId`):**
   - Component Select gọi API: `GET /decisions?loai=GIAO_DE_TAI&trangThai=HIEU_LUC&ncsId={ncsId}`.
   - Mỗi option hiển thị: `[Số QĐ] - Ngày ban hành [dd/mm/yyyy]`.
   - Nếu NCS chưa có quyết định loại `GIAO_DE_TAI`: Hiển thị thông báo màu vàng cam kèm liên kết tắt:
     > *"NCS này chưa có Quyết định giao đề tài loại `GIAO_DE_TAI` còn hiệu lực. Vui lòng tạo Quyết định trước khi giao đề tài."* -> Nút: `[ + Tạo Quyết định mới ]` (mở modal tạo quyết định).
4. **Cảnh báo nghiệp vụ tự động (Dynamic Alerts):**
   - Nếu NCS đang có đơn đề nghị điều chỉnh ở trạng thái `CHO_DUYET`: Disable nút lưu và hiện cảnh báo:
     > *"NCS đang có đơn đề nghị điều chỉnh chờ duyệt. Không thể giao đề tài lúc này. Vui lòng xử lý đơn tại trang Duyệt đề nghị đổi đề tài."*

```typescript
// Sơ đồ luồng logic của ThesisAssignmentModal
// 1. Kiểm tra ncsId -> Fetch danh sách Quyết định hợp lệ
// 2. Validate form bằng Zod:
const assignThesisSchema = z.object({
  ncsId: z.string().uuid("Vui lòng chọn NCS"),
  quyetDinhId: z.string().uuid("Vui lòng chọn Quyết định giao đề tài hợp lệ"),
  tenDeTai: z.string().trim().min(5, "Tên đề tài tối thiểu 5 ký tự").max(500, "Tên đề tài không vượt quá 500 ký tự"),
});
```

---

### 5.5 Modal Hủy Giao Đề tài do Sai sót (`ThesisDeactivateModal`)

#### Mục đích
Chỉ dành cho trường hợp **Giáo vụ giao nhầm người / chọn sai quyết định / sai sót thông tin hành chính**. Tuyệt đối không dùng khi NCS đổi đề tài nghiên cứu (phải dùng luồng Đổi đề tài).

#### Giao diện & Ràng buộc An toàn
1. **Hộp thoại Cảnh báo Đỏ (Destructive Dialog):**
   - Icon cảnh báo hình tam giác đỏ (`AlertTriangle`).
   - Tiêu đề: **Xác nhận Hủy giao Đề tài Luận án**.
2. **Thông tin xác thực:**
   - Tên đề tài hiện tại bị hủy.
   - Tên NCS & MSHV.
   - Quyết định giao đề tài đang liên kết.
3. **Lưu ý nghiệp vụ bắt buộc hiển thị trên UI:**
   > *"Hành động này sẽ hủy đề tài hiện tại và đưa NCS về trạng thái Chưa giao đề tài. Nếu NCS có nguyện vọng đổi đề tài do hướng nghiên cứu thay đổi, vui lòng yêu cầu NCS nộp đơn Đổi đề tài thay vì hủy trực tiếp."*
4. **Trường Lý do Hủy (`lyDo`):**
   - Textarea bắt buộc nhập (Min 10 ký tự).
   - Lý do này sẽ được ghi vĩnh viễn vào Nhật ký Kiểm toán (`AuditLog`) và gửi thông báo trực tiếp đến NCS cùng các GVHD liên quan.
5. **Nút xác nhận:**
   - Nút `Hủy đề tài này` màu đỏ (`bg-rose-600 hover:bg-rose-700`), yêu cầu đang xử lý hiển thị spinner loading tránh double click.

---

### 5.6 Drawer Chi tiết Hồ sơ & Lịch sử Đề tài (`ThesisDetailDrawer`)

Khi giáo vụ bấm xem chi tiết một NCS trên bảng, một Drawer trượt từ bên phải ra (Slide-over Sheet) hiển thị toàn bộ hồ sơ:

#### Các phần nội dung trong Drawer:
1. **Header Hồ sơ NCS:**
   - Họ tên, MSHV, Avatar chữ cái đầu.
   - Khóa học, Chuyên ngành, Trạng thái học tập (`DANG_HOC`, `GIA_HAN`).
2. **Đề tài hiện tại (Current Active Thesis Card):**
   - Tên đề tài in đậm, nổi bật trong khung viền xanh dương.
   - Số Quyết định, ngày ký ban hành.
   - Nếu có `fileId`: Nút "Xem văn bản Quyết định" (PDF Preview) hoặc "Tải về".
   - Ngày cập nhật gần nhất.
3. **Dòng thời gian Lịch sử Đề tài (Thesis Evolution Timeline):**
   - Hiển thị theo thứ tự thời gian đảo ngược (mới nhất ở trên).
   - Mỗi mốc thời gian thể hiện:
     - Tên đề tài qua từng thời kỳ.
     - Trạng thái tại mốc đó: `Đang hiệu lực` (Xanh lá), `Đã thay thế` (Tím), `Đã hủy` (Đỏ xám).
     - Quyết định gắn liền với lần giao/thay thế đó.
     - Thời gian bắt đầu - kết thúc.
4. **Đội ngũ Cán bộ Hướng dẫn (Supervisors Team):**
   - Danh sách GVHD hiện tại kèm chức danh, email, học vị, vai trò (`Hướng dẫn chính` / `Đồng hướng dẫn`).
   - Lịch sử các đời GVHD trước đây nếu đã từng có thay đổi.
5. **Đường dẫn nhanh (Quick Links):**
   - Nút liên kết tới trang Hồ sơ NCS chi tiết (`/academic/students/[id]`).
   - Nút liên kết tới trang Đơn điều chỉnh đề tài của NCS (`/academic/topic-changes`).

---

## 6. Quy tắc Nghiệp vụ Nghiêm ngặt & Xử lý Ngoại lệ (Edge Cases)

| Tình huống thực tế / Edge Case | Phản hồi Backend | Xử lý UX/UI tối ưu trên Frontend |
|---|---|---|
| **NCS đã có đề tài hiệu lực** nhưng bấm nhầm giao thêm đề tài | `409 Conflict: NCS đã có đề tài đang hiệu lực` | Vô hiệu hóa nút "Giao đề tài" trên dòng của NCS đó; nếu mở modal thì hiển thị tooltip giải thích "NCS đã có đề tài hiệu lực. Để thay đổi đề tài, NCS cần nộp đơn đề nghị đổi đề tài". |
| **NCS đang có đơn đổi đề tài chờ duyệt (`CHO_DUYET`)** | `409 Conflict: NCS đang có đề nghị điều chỉnh chờ duyệt...` | Hiển thị Badge cảnh báo `Đang có đơn chờ duyệt` tại cột thao tác; ẩn nút Hủy đề tài và vô hiệu hóa form giao đề tài; kèm nút dẫn nhanh tới `/academic/topic-changes`. |
| **Quyết định đã dùng cho đề tài khác** | `409 Conflict: Quyết định này đã gắn với một đề tài đang hiệu lực` | Khi fetch danh sách quyết định, chỉ hiển thị các quyết định chưa bị gắn với đề tài đang hiệu lực; nếu backend trả 409 thì hiển thị toast thông báo lỗi đỏ chi tiết. |
| **NCS chưa có Quyết định giao đề tài hợp lệ** | Không có dữ liệu trong dropdown quyết định | Hiển thị Empty State trong dropdown: "Không tìm thấy Quyết định loại GIAO_DE_TAI hợp lệ", kèm nút bấm chuyển nhanh sang mở Modal tạo Quyết định (`DecisionIssueModal`). |
| **Hủy đề tài nhưng bỏ trống lý do** | `400 Bad Request: Lý do hủy đề tài là bắt buộc` | Frontend validate chặn submit trước khi gọi API (chuẩn hóa `.trim()`, tối thiểu 1 ký tự). |
| **Tên đề tài quá dài (> 500 ký tự)** | `400 Bad Request` | Textarea có bộ đếm ký tự realtime (`0/500`) và thuộc tính `maxLength={500}`, hiển thị cảnh báo đỏ khi chạm mốc 500 ký tự. |
| **NCS bị buộc thôi học / đã tốt nghiệp** | `400 Bad Request: NCS không ở trạng thái được phép giao đề tài` | Badge trạng thái NCS thể hiện rõ, nút giao đề tài bị disable hoàn toàn kèm lý do. |

---

## 7. Tích hợp Hệ sinh thái Hệ thống (Ecosystem Integration)

### 7.1 Tích hợp với Phân hệ Quyết định (`/academic/decisions`)
- Khi Giáo vụ vừa tạo mới một Quyết định loại `GIAO_DE_TAI` cho một NCS bên trang Quyết định, Query Cache React Query `["academic", "theses-decisions"]` sẽ được tự động invalidate để sẵn sàng chọn bên trang Quản lý Đề tài mà không cần F5 trang.

### 7.2 Tích hợp với Phân hệ Đơn Đề nghị Đổi đề tài (`/academic/topic-changes`)
- Sau khi Giáo vụ phê duyệt một đơn Đổi đề tài (`DOI_DE_TAI`), Backend tự động đóng đề tài cũ thành `DA_THAY_THE` và tạo đề tài mới `HIEU_LUC`.
- Do đó, khi quay lại trang Quản lý Đề tài, giao diện sẽ phản ánh ngay lập tức tên đề tài mới cùng trạng thái lịch sử đã cập nhật.

### 7.3 Tích hợp với Hệ thống Thông báo (Notification Bell)
- Ngay sau khi hành động Giao đề tài hoặc Hủy đề tài hoàn tất, Notification Service gửi Socket/Push event.
- Các hook của Giáo vụ tự động gọi Toast Notification:
  - `"Đã giao đề tài thành công cho NCS [Họ tên]"`
  - `"Đã hủy đề tài thành công. Thông báo đã được gửi đến NCS và GVHD liên quan"`

---

## 8. Kế hoạch Triển khai Từng bước (Implementation Roadmap)

### Bước 1: Mở rộng Service & Types (Frontend Foundation)
- Cập nhật `frontend/src/types/api/thesis.ts` với đầy đủ interfaces đã đặc tả ở Mục 4.
- Cập nhật `frontend/src/services/thesis.ts`:
  - `listTheses(params: AcademicThesisListQuery)`
  - `assignThesis(payload: AssignThesisPayload)`
  - `deactivateThesis(id: string, payload: DeactivateThesisPayload)`
  - `getAdminThesisDetail(ncsId: string)`
  - `getAvailableDecisionsForThesis(ncsId: string)`

### Bước 2: Xây dựng React Query Hooks (`use-theses.ts`)
- Tạo file `frontend/src/hooks/use-theses.ts` chứa:
  - `useAcademicTheses(params)`
  - `useAcademicThesisDetail(ncsId)`
  - `useThesisDecisions(ncsId)`
  - `useAssignThesisMutation()` (Kèm cơ chế auto invalidate `["academic", "theses"]`, `["academic", "students"]`)
  - `useDeactivateThesisMutation()`

### Bước 3: Xây dựng các Thành phần Giao diện Cốt lõi
1. `ThesesKpiCards.tsx`: 4 thẻ chỉ số nhanh.
2. `ThesesFilterBar.tsx`: Thanh tìm kiếm, filter theo Khóa học, Trạng thái, GVHD.
3. `ThesisStatusBadge.tsx`: Component hiển thị màu sắc và nhãn trạng thái đồng nhất.
4. `ThesesTable.tsx`: Bảng hiển thị thông tin kèm phân trang server-side và contextual menu.

### Bước 4: Xây dựng các Modal Tương tác
1. `ThesisAssignmentModal.tsx`:
   - Lựa chọn NCS (nếu chưa chọn trước)
   - Input tên đề tài có đếm ký tự
   - Select quyết định giao đề tài
   - Validation & thông báo lỗi
2. `ThesisDeactivateModal.tsx`:
   - Xác nhận hủy đề tài giao nhầm
   - Bắt buộc nhập lý do hủy
3. `ThesisDetailDrawer.tsx`:
   - Xem timeline lịch sử các đời đề tài và danh sách GVHD.

### Bước 5: Ghép nối Page, Sidebar & Kiểm thử Tổng thể
- Tạo file `frontend/src/app/(academic)/academic/theses/page.tsx`.
- Cập nhật Sidebar mục "Quản lý Đề tài Luận án".
- Rà soát toàn bộ các kịch bản kiểm thử theo Checklist Mục 9.

---

## 9. Bảng Kiểm thử & Checklist Nghiệm thu (Test Checklist)

| STT | Kịch bản kiểm thử (Test Scenario) | Kết quả mong đợi (Expected Result) | Đạt/Chưa |
|:---:|---|---|:---:|
| 1 | Truy cập `/academic/theses` với tài khoản Giáo vụ | Màn hình tải dữ liệu mượt mà, hiển thị đúng 4 thẻ KPI và bảng danh sách NCS có đề tài/chưa có đề tài. | [ ] |
| 2 | Lọc theo trạng thái `CHUA_GIAO` | Bảng chỉ hiển thị danh sách các NCS chưa có đề tài đang hiệu lực; thẻ KPI cập nhật tương ứng. | [ ] |
| 3 | Lọc theo Khóa học hoặc Giảng viên HD | Dữ liệu bảng lọc chính xác theo `khoaHocId` hoặc `gvhdId`. | [ ] |
| 4 | Tìm kiếm tên NCS hoặc MSHV | Kết quả trả về đúng sau khoảng trễ debounce 300ms. | [ ] |
| 5 | Bấm `+ Giao đề tài` trên hàng của NCS chưa có đề tài | Modal mở lên với thông tin NCS đã được điền sẵn; trường Quyết định tự động tải danh sách quyết định `GIAO_DE_TAI` của NCS đó. | [ ] |
| 6 | Giao đề tài thành công | Toast thông báo thành công; Modal đóng; Bảng tự động cập nhật dòng NCS sang trạng thái `HIEU_LUC` với tên đề tài vừa nhập. | [ ] |
| 7 | Giao đề tài khi NCS đã có đề tài hiệu lực | Bị chặn từ giao diện; nếu bypass gửi request thì nhận lỗi 409 và hiển thị thông báo lỗi rõ ràng. | [ ] |
| 8 | Giao đề tài khi NCS đang có đơn đổi đề tài `CHO_DUYET` | Hiển thị cảnh báo vàng, khóa form và hướng dẫn xử lý đơn trước. | [ ] |
| 9 | Mở Modal Hủy đề tài (`ThesisDeactivateModal`) | Cảnh báo đỏ nổi bật; nút xác nhận bị disable cho đến khi người dùng nhập lý do hủy hợp lệ. | [ ] |
| 10 | Xác nhận Hủy đề tài thành công | Bản ghi chuyển sang trạng thái `DA_HUY` trong lịch sử; dòng NCS trở về `CHUA_GIAO`; thẻ KPI cập nhật. | [ ] |
| 11 | Mở Drawer Chi tiết & Lịch sử | Drawer hiển thị đầy đủ dòng thời gian các đề tài cũ (nếu có), quyết định kèm link xem file scan (nếu có), và danh sách GVHD. | [ ] |
| 12 | Kiểm tra quyền truy cập không đủ quyền (Non-admin) | Không xem được các nút hành động Giao/Hủy đề tài; chỉ xem được dữ liệu nếu có quyền đọc. | [ ] |

---
*Tài liệu được biên soạn phục vụ phát triển giao diện hệ thống Quản lý Đào tạo Sau Đại học.*
