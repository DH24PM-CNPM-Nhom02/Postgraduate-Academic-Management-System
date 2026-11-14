# ĐẶC TẢ CHI TIẾT CÁC API THEO DANH SÁCH TEST CASE (TC01 - TC56)

> **Tài liệu đặc tả kỹ thuật API**: Mô tả chi tiết toàn bộ các Endpoint có trong bộ 56 Test Cases của Hệ thống Quản lý Đào tạo Sau Đại học (Postgraduate Academic Management System).  
> **Cấu trúc bao gồm**: Phương thức (Method), Đường dẫn (Endpoint), Quyền hạn (Permissions/RBAC), Path Parameters, Query Parameters, Request Body (Validation Rules, kiểu dữ liệu), Body mẫu (JSON/Form-data) và HTTP Response Codes liên quan đến từng kịch bản kiểm thử.

---

## MỤC LỤC TỔNG HỢP CÁC API

| STT | Phương thức | Endpoint | Chức năng chính | Test Cases áp dụng |
|:---:|:---|:---|:---|:---|
| **I** | **NHÓM XÁC THỰC & TÀI KHOẢN (AUTH & USER)** | | | |
| 1 | `POST` | `/auth/login` | Đăng nhập hệ thống (cấp Access & Refresh Token) | TC01, TC02, TC03 |
| 2 | `POST` | `/auth/refresh` | Cấp cặp token mới bằng Refresh Token (Token Rotation) | TC04, TC05, TC06 |
| 3 | `POST` | `/auth/logout` | Đăng xuất (Thu hồi Refresh Token hiện tại) | TC04 |
| 4 | `GET` | `/auth/me` | Lấy thông tin tài khoản đăng nhập & danh sách quyền | TC01, TC05, TC12 |
| 5 | `POST` | `/auth/change-password` | Đổi mật khẩu người dùng | TC07, TC08 |
| 6 | `GET` | `/auth/users` | Lấy danh sách tài khoản người dùng | TC13 |
| 7 | `PATCH` | `/auth/users/:id/reset-password` | Giáo vụ reset mật khẩu tài khoản về mặc định | TC10 |
| **II** | **NHÓM QUẢN LÝ QUYẾT ĐỊNH (DECISIONS)** | | | |
| 8 | `POST` | `/decisions` | Tạo quyết định mới (Bảo lưu, Buộc thôi học, Ngưng học, ...) | TC09 |
| 9 | `PATCH` | `/decisions/:id/deactivate` | Hủy hiệu lực (Vô hiệu hóa) quyết định | TC09 |
| **III**| **NHÓM HỒ SƠ NGHIÊN CỨU SINH (NCS)** | | | |
| 10 | `GET` | `/ncs` | Lấy danh sách hồ sơ NCS (Phân trang / Lọc) | TC11 |
| 11 | `POST` | `/ncs/import/confirm` | Import danh sách NCS hàng loạt từ file Excel | TC15 |
| **IV** | **NHÓM GIẢNG VIÊN HƯỚNG DẪN & PHÂN CÔNG (GVHD)** | | | |
| 12 | `GET` | `/gvhd/me/ncs/:ncsId` | GVHD xem chi tiết NCS thuộc quyền hướng dẫn | TC17 |
| 13 | `POST` | `/gvhd/assignments` | Phân công GVHD cho NCS (Kiểm soát định mức) | TC33, TC34, TC35, TC36, TC37, TC38, TC40 |
| 14 | `PATCH` | `/gvhd/assignments/:id/deactivate` | Hủy hiệu lực phân công (Giảm định mức GVHD) | TC39 |
| **V** | **NHÓM TIẾN TRÌNH 9 MỐC & ĐÁNH GIÁ (PROGRESS)** | | | |
| 15 | `GET` | `/progress/me` | NCS xem toàn bộ tiến trình 9 mốc của bản thân | TC19, TC23 |
| 16 | `POST` | `/progress/milestones/:thuTu/submit` | NCS nộp file minh chứng cho mốc tiến trình | TC20, TC21, TC22, TC27 |
| 17 | `POST` | `/progress/reviews/:tienTrinhId/approve` | Giáo vụ phê duyệt đạt mốc tiến trình | TC14, TC23, TC24, TC28, TC29, TC30, TC31 |
| 18 | `POST` | `/progress/reviews/:tienTrinhId/reject` | Giáo vụ từ chối mốc kèm lý do | TC25, TC26 |
| 19 | `POST` | `/progress/evidences/:minhChungId/evaluations` | Nhập phiếu nhận xét/chấm điểm minh chứng mốc | TC28, TC29, TC30, TC31, TC32 |
| **VI** | **NHÓM ĐƠN ĐỀ NGHỊ ĐIỀU CHỈNH & GIA HẠN (CHANGE REQUEST)** | | | |
| 20 | `POST` | `/change-request` | Tạo đơn đề nghị (Gia hạn thời gian, Đổi đề tài, Đổi GVHD) | TC41, TC42, TC43, TC44, TC45 |
| 21 | `PATCH` | `/change-request/:id/supervisor-review` | GVHD xác nhận/từ chối đơn đề nghị của NCS | TC46, TC47 |
| 22 | `PATCH` | `/change-request/:id/approve` | Giáo vụ phê duyệt đơn đề nghị gia hạn | TC48 |
| **VII**| **NHÓM QUẢN LÝ TÀI LIỆU PDF (DOCUMENTS)** | | | |
| 23 | `POST` | `/documents/upload` | Tải lên file PDF (Minh chứng mốc, đơn từ, quyết định) | TC20, TC49, TC50, TC51, TC52, TC53, TC54 |
| 24 | `GET` | `/documents/:id` | Xem metadata thông tin tài liệu | TC16, TC56 |
| 25 | `GET` | `/documents/:id/download` | Tải xuống nội dung file PDF | TC16, TC55, TC56 |
| 26 | `DELETE`| `/documents/:id` | Xóa mềm tài liệu | TC56 |
| **VIII**| **NHÓM NHẬT KÝ KIỂM TOÁN (AUDIT LOGS)** | | | |
| 27 | `GET` | `/audit-logs` | Xem nhật ký kiểm toán hệ thống (Chỉ dành cho Admin) | TC18 |

---

# CHI TIẾT ĐẶC TẢ TỪNG API

---

## 1. POST /auth/login
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC01`, `TC02`, `TC03`
* **Mục đích**: Xác thực người dùng bằng username và password; cấp cặp `access_token` (JWT) và `refresh_token`. Kiểm tra trạng thái tài khoản `isActive`.
* **Quyền truy cập (Auth/Permissions)**: Public (Không yêu cầu token).
* **Headers**: `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`LoginDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `username` | string | Có | `@IsString()`, `@IsNotEmpty()` | Tên đăng nhập (vd: `NCS014`, `GVU006`, `GV007`) |
| `password` | string | Có | `@IsString()`, `@IsNotEmpty()` | Mật khẩu tài khoản (vd: `ncs123123`) |

```json
{
  "username": "NCS014",
  "password": "ncs123123"
}
```

### Phản hồi & Mã trạng thái HTTP (Response)
* **`200 OK` (TC01)**: Đăng nhập thành công.
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d2919d7d-..."
  }
  ```
* **`401 Unauthorized` (TC02)**: Sai mật khẩu hoặc username không tồn tại (Thông báo bảo mật chung, không tiết lộ tài khoản có tồn tại hay không).
* **`401/403 Forbidden` (TC03)**: Tài khoản bị vô hiệu hóa / đã bị khóa (`isActive = false`).

---

## 2. POST /auth/refresh
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC04`, `TC05`, `TC06`
* **Mục đích**: Cấp mới `accessToken` và `refreshToken` mới (Token Rotation), thu hồi token cũ. Áp dụng cơ chế Reuse Detection (nếu dùng lại token đã bị thu hồi sau grace period 15 giây, toàn bộ session sẽ bị thu hồi).
* **Quyền truy cập (Auth/Permissions)**: Public / `@AllowMustChange()`
* **Headers**: `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`RefreshDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `refreshToken` | string | Có | `@IsString()`, `@IsNotEmpty()` | Chuỗi Refresh Token đang nắm giữ |

```json
{
  "refreshToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC05)**: Trả về cặp `accessToken` và `refreshToken` mới (RT2 khác RT1).
* **`401 Unauthorized` (TC04, TC06)**: Token đã bị thu hồi, logout trước đó, hoặc bị phát hiện hành vi tái sử dụng (Reuse Detection).

---

## 3. POST /auth/logout
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC04`
* **Mục đích**: Thu hồi phiên làm việc gắn liền với `refreshToken`.
* **Quyền truy cập (Auth/Permissions)**: Public / `@AllowMustChange()`
* **Headers**: `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`RefreshDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `refreshToken` | string | Có | `@IsString()`, `@IsNotEmpty()` | Refresh token của phiên muốn kết thúc |

```json
{
  "refreshToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC04)**: Đăng xuất thành công, token bị đưa vào blacklist / revoked.

---

## 4. GET /auth/me
* **Nhóm chức năng**: F1 - Xác thực & tài khoản, F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC01`, `TC05`, `TC12`
* **Mục đích**: Lấy thông tin tài khoản hiện tại, vai trò (roles) và danh sách mã quyền hạn (permissions) được phân bổ.
* **Quyền truy cập (Auth/Permissions)**: Đã xác thực (JWT hợp lệ), `@AllowMustChange()`.
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC01, TC05)**:
  ```json
  {
    "id": "e44d3106-c6e7-49d2-b06d-74d3d2db73b6",
    "username": "NCS014",
    "fullName": "Nguyễn Văn A",
    "email": "ncs014@school.edu.vn",
    "mustChangePassword": false,
    "roles": ["NCS"],
    "permissions": ["milestone.submit", "milestone.read", "document.read", "document.upload", ...]
  }
  ```
* **`401 Unauthorized` (TC12)**: Token bị sửa đổi chữ ký hoặc không hợp lệ.

---

## 5. POST /auth/change-password
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC07`, `TC08`
* **Mục đích**: Cho phép người dùng đổi mật khẩu tài khoản của mình. Sau khi đổi thành công, cờ `mustChangePassword` chuyển thành `false`.
* **Quyền truy cập (Auth/Permissions)**: Đã xác thực (JWT hợp lệ), `@AllowMustChange()`.
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`ChangePasswordDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `oldPassword` | string | Có | `@IsString()`, `@IsNotEmpty()` | Mật khẩu hiện tại của tài khoản |
| `newPassword` | string | Có | `@IsString()`, `@MinLength(8)` | Mật khẩu mới, tối thiểu 8 ký tự |

```json
{
  "oldPassword": "ncs123123",
  "newPassword": "ncs123456"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC07)**: Mật khẩu đổi thành công, hủy các refresh token cũ.
* **`400 Bad Request` / `401 Unauthorized` (TC08)**: Mật khẩu cũ không chính xác hoặc mật khẩu mới vi phạm độ dài tối thiểu.

---

## 6. GET /auth/users
* **Nhóm chức năng**: F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC13`
* **Mục đích**: Lấy danh sách tài khoản người dùng trong hệ thống (chỉ dành cho Quản trị viên/Giáo vụ).
* **Quyền truy cập (Auth/Permissions)**: `user.read` (`PERMISSIONS.USER_READ`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
*Không có.*

### Query Parameters (`ListUsersQueryDto`)
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `page` | number | Không | Trang hiện tại (tối thiểu 1) |
| `limit` | number | Không | Số bản ghi mỗi trang (1 - 100) |
| `role` | string | Không | Lọc theo mã vai trò (vd: `ADMIN`, `GIAO_VU`, `GVHD`, `NCS`) |
| `status` | string | Không | Lọc theo trạng thái tài khoản: `'active'` hoặc `'locked'` |
| `keyword` | string | Không | Tìm kiếm theo username, họ tên, email |

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK`**: Trả về danh sách tài khoản người dùng.
* **`403 Forbidden` (TC13)**: NCS gọi API này bị từ chối do thiếu quyền `user.read`.

---

## 7. PATCH /auth/users/:id/reset-password
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC10`
* **Mục đích**: Giáo vụ reset mật khẩu của một tài khoản về mật khẩu mặc định của hệ thống. Tài khoản được đặt cờ `mustChangePassword = true`.
* **Quyền truy cập (Auth/Permissions)**: `user.reset-password` (`PERMISSIONS.USER_RESET_PASSWORD`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `id` | string (UUID) | Có | `id` của tài khoản người dùng (User ID) cần reset mật khẩu |

### Query Parameters
*Không có.*

### Request Body
*Không có.*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC10)**: Reset thành công. Mật khẩu được chuyển về mặc định (theo cấu hình hệ thống, vd: `Default@123` hoặc tên mã số). Khi người dùng đăng nhập lại, hệ thống trả về `mustChangePassword = true`.

---

## 8. POST /decisions
* **Nhóm chức năng**: F1 - Xác thực & tài khoản, F4 - Phân công GVHD
* **Test cases liên quan**: `TC09` (Tạo quyết định Buộc thôi học/Bảo lưu/Ngưng học làm khóa tài khoản), `TC33`, `TC38`
* **Mục đích**: Ban hành quyết định đào tạo (Giao đề tài, phân công GVHD, gia hạn, bảo lưu, ngưng học, buộc thôi học, công nhận tốt nghiệp,...).
* **Quyền truy cập (Auth/Permissions)**: `decision.create` (`PERMISSIONS.DECISION_CREATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`CreateDecisionDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `loai` | string (Enum) | Có | `@IsIn(...)` thuộc: `GIAO_DE_TAI`, `PHAN_CONG_GVHD`, `THANH_LAP_TIEU_BAN`, `CAN_CU_DUYET_MOC`, `CONG_NHAN_TOT_NGHIEP`, `GIA_HAN`, `BAO_LUU`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `HOC_TIEP`, `KHAC` | Phân loại quyết định |
| `soQuyetDinh` | string | Có | `@IsString()`, `@Length(1, 50)` | Số hiệu văn bản (vd: `123/QĐ-ĐHBK`) |
| `ngayQuyetDinh` | string | Có | `@Matches(/^\d{4}-\d{2}-\d{2}$/)` | Ngày ký ban hành định dạng `YYYY-MM-DD` |
| `ncsIds` | string[] | Không | `@IsArray()`, `@IsUUID('all', {each:true})` | Danh sách NCS áp dụng (nếu là quyết định cá thể) |
| `fileId` | string (UUID) | Không | `@IsUUID()` | ID file scan PDF đính kèm (upload từ document-service) |
| `ghiChu` | string | Không | `@IsString()`, `@MaxLength(1000)` | Ghi chú bổ sung |
| `hanMoi` | string | Không | `@Matches(/^\d{4}-\d{2}-\d{2}$/)` | Hạn học tập mới (nếu là gia hạn/bảo lưu) |

```json
{
  "loai": "BUOC_THOI_HOC",
  "soQuyetDinh": "890/QD-DHBK",
  "ngayQuyetDinh": "2026-11-01",
  "ncsIds": ["8a7b9c6d-1234-5678-90ab-cdef12345678"],
  "ghiChu": "Buộc thôi học do quá hạn đào tạo"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`201 Created` / `200 OK` (TC09)**: Tạo quyết định thành công. Với loại `BUOC_THOI_HOC`, `NGUNG_HOC`, `BAO_LUU`, hệ thống tự động cập nhật trạng thái hồ sơ NCS và khóa tài khoản người dùng tương ứng (`isActive = false`).

---

## 9. PATCH /decisions/:id/deactivate
* **Nhóm chức năng**: F1 - Xác thực & tài khoản
* **Test cases liên quan**: `TC09`
* **Mục đích**: Vô hiệu hóa (hủy hiệu lực) một quyết định đã ban hành. Khi quyết định kỷ luật/ngừng học/buộc thôi học bị hủy, tài khoản NCS được khôi phục trạng thái hoạt động.
* **Quyền truy cập (Auth/Permissions)**: `decision.update` (`PERMISSIONS.DECISION_UPDATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `id` | string (UUID) | Có | ID của quyết định cần hủy hiệu lực |

### Query Parameters
*Không có.*

### Request Body (`DeactivateDecisionDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `lyDo` | string | Có | `@IsString()`, `@Length(1, 500)` | Lý do hủy hiệu lực quyết định |

```json
{
  "lyDo": "Quyết định ban hành nhầm đối tượng, phục hồi quyền học tập"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC09)**: Quyết định chuyển sang trạng thái `DEACTIVATE`, tài khoản NCS được mở khóa lại (`isActive = true`).

---

## 10. GET /ncs
* **Nhóm chức năng**: F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC11`
* **Mục đích**: Lấy danh sách hồ sơ nghiên cứu sinh trong trường.
* **Quyền truy cập (Auth/Permissions)**: `ncs.read` (`PERMISSIONS.NCS_READ`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
*Không có.*

### Query Parameters (`ListNcsQueryDto`)
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `page` | number | Không | Số trang |
| `limit` | number | Không | Số bản ghi trên trang (1 - 100) |
| `trangThai` | string | Không | Trạng thái NCS (`DANG_HOC`, `BAO_LUU`, `NGUNG_HOC`, ...) |
| `khoaHocId`| string (UUID) | Không | Lọc theo ID khóa đào tạo |
| `nganhId` | string | Không | Lọc theo ngành đào tạo |

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK`**: Trả về danh sách NCS.
* **`401 Unauthorized` (TC11)**: Gọi API khi không đính kèm header `Authorization` bị từ chối truy cập.

---

## 11. POST /ncs/import/confirm
* **Nhóm chức năng**: F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC15`
* **Mục đích**: Tải lên file Excel danh sách NCS để import hàng loạt vào cơ sở dữ liệu và tạo tài khoản tự động.
* **Quyền truy cập (Auth/Permissions)**: `ncs.create` (`PERMISSIONS.NCS_CREATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: multipart/form-data`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (Multipart Form-Data)
| Tên Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `file` | Binary (File) | Có | File `.xlsx`, kích thước tối đa 2MB | File Excel theo template chuẩn chứa thông tin các NCS |

### Phản hồi & Mã trạng thái HTTP
* **`200 OK`**: Import thành công danh sách NCS.
* **`403 Forbidden` (TC15)**: GVHD gọi API này bị từ chối do thiếu quyền `ncs.create`.

---

## 12. GET /gvhd/me/ncs/:ncsId
* **Nhóm chức năng**: F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC17`
* **Mục đích**: Giảng viên hướng dẫn xem chi tiết tiến trình học tập của một NCS do mình phụ trách hướng dẫn.
* **Quyền truy cập (Auth/Permissions)**: Đã xác thực (JWT hợp lệ của tài khoản có vai trò GVHD).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `ncsId` | string (UUID) | Có | ID hồ sơ của NCS muốn xem |

### Query Parameters
*Không có.*

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK`**: Trả về chi tiết thông tin hồ sơ và tiến trình của NCS (khi GVHD có phân công hướng dẫn NCS này).
* **`403 Forbidden` / `404 Not Found` (TC17)**: GVHD xem một NCS không thuộc danh sách phân công của mình (Chống lộ lọt dữ liệu IDOR).

---

## 13. POST /gvhd/assignments
* **Nhóm chức năng**: F4 - Phân công & định mức GVHD
* **Test cases liên quan**: `TC33`, `TC34`, `TC35`, `TC36`, `TC37`, `TC38`, `TC40`
* **Mục đích**: Giáo vụ thực hiện phân công GVHD (Hướng dẫn chính: trọng số 1.0, Đồng hướng dẫn: trọng số 0.5) cho một NCS dựa trên Quyết định pháp lý đã ban hành. Kiểm tra chặt chẽ định mức tối đa (Tiến sĩ: tối đa 3.0; PGS/GS: tối đa 5.0) và ngăn ngừa Race Condition / Concurrency bằng Optimistic Lock.
* **Quyền truy cập (Auth/Permissions)**: `assignment.create` (`PERMISSIONS.ASSIGNMENT_CREATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`CreateAssignmentDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `ncsId` | string (UUID) | Có | `@IsUUID()` | ID hồ sơ của NCS |
| `gvhdId` | string (UUID) | Có | `@IsUUID()` | ID hồ sơ của Giảng viên hướng dẫn |
| `vaiTro` | string (Enum) | Có | `@IsIn(['HUONG_DAN_CHINH', 'DONG_HUONG_DAN'])` | Vai trò: `HUONG_DAN_CHINH` (+1.0) hoặc `DONG_HUONG_DAN` (+0.5) |
| `quyetDinhId` | string (UUID) | Có | `@IsUUID()` | ID quyết định phân công GVHD đã ban hành (loại `PHAN_CONG_GVHD` đang hiệu lực) |

```json
{
  "ncsId": "b3e0c03c-d3fe-4bca-9883-9b6343c1626f",
  "gvhdId": "4a5814bf-4279-4a94-8255-7d5d590115b8",
  "vaiTro": "HUONG_DAN_CHINH",
  "quyetDinhId": "912e73f4-4191-4cf1-8302-2a912bbbc561"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`201 Created` / `200 OK` (TC33, TC35)**: Phân công thành công, số lượng NCS đang hướng dẫn tăng thêm tương ứng trọng số.
* **`400 Bad Request` (TC34, TC36, TC37)**: Vượt quá định mức quy định (Tiến sĩ vượt quá 3.0; PGS vượt quá 5.0).
* **`400 Bad Request` (TC38)**: Quyết định gửi lên không đúng loại `PHAN_CONG_GVHD` hoặc không tồn tại/hết hiệu lực.
* **`409 Conflict` (TC40)**: Khi có 2 request gửi đồng thời tới một GV chỉ còn 1 suất, cơ chế Optimistic Lock chặn đứng 1 request, chỉ chấp nhận 1 request.

---

## 14. PATCH /gvhd/assignments/:id/deactivate
* **Nhóm chức năng**: F4 - Phân công & định mức GVHD
* **Test cases liên quan**: `TC39`
* **Mục đích**: Hủy hiệu lực (kết thúc) một phân công hướng dẫn. Giảm định mức tương ứng của GVHD.
* **Quyền truy cập (Auth/Permissions)**: `assignment.update` (`PERMISSIONS.ASSIGNMENT_UPDATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|:---|:---|:---:|:---|
| `id` | string (UUID) | Có | ID của bản ghi phân công (`assignmentId`) |

### Query Parameters
*Không có.*

### Request Body (`DeactivateAssignmentDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `lyDo` | string | Có | `@IsString()`, `@MinLength(1)` | Lý do hủy hiệu lực / thay đổi phân công |

```json
{
  "lyDo": "Chấm dứt phân công theo đơn đề nghị thay đổi GVHD"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC39)**: Phân công chuyển sang trạng thái hết hiệu lực, `ngayKetThuc` được cập nhật, định mức của GVHD giảm 1.0 hoặc 0.5.

---

## 15. GET /progress/me
* **Nhóm chức năng**: F3 - Tiến trình 9 mốc
* **Test cases liên quan**: `TC19`, `TC23`
* **Mục đích**: NCS tra cứu toàn bộ trạng thái tiến trình 9 mốc học tập của chính mình.
* **Quyền truy cập (Auth/Permissions)**: `milestone.read` (`PERMISSIONS.MILESTONE_READ`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC19, TC23)**: Trả về danh sách chi tiết 9 mốc.
  * *NCS mới (TC19)*: Mốc 1 có trạng thái `PASSED`; mốc 2 có trạng thái `UNLOCKED`; các mốc từ 3 đến 9 có trạng thái `LOCKED`.
  * *Sau khi duyệt mốc (TC23)*: Mốc hiện tại chuyển `PASSED`, mốc kế tiếp chuyển `UNLOCKED`.

---

## 16. POST /progress/milestones/:thuTu/submit
* **Nhóm chức năng**: F3 - Tiến trình 9 mốc
* **Test cases liên quan**: `TC20`, `TC21`, `TC22`, `TC27`
* **Mục đích**: NCS nộp tài liệu minh chứng cho mốc tiến trình thứ `:thuTu` (từ mốc 2 đến 9). Mốc phải đang ở trạng thái `UNLOCKED` hoặc `REJECTED`.
* **Quyền truy cập (Auth/Permissions)**: `milestone.submit` (`PERMISSIONS.MILESTONE_SUBMIT`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `thuTu` | integer | Có | `@ParseIntPipe`, từ `2` đến `9` | Số thứ tự của mốc nộp minh chứng (vd: 2 hoặc 3) |

### Query Parameters
*Không có.*

### Request Body (`SubmitMilestoneDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `fileId` | string (UUID) | Có | `@IsUUID()` | ID của file PDF đã upload lên document-service (loại `MINH_CHUNG_MOC`) |
| `ghiChu` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(500)` | Ghi chú của NCS khi nộp bài |

```json
{
  "fileId": "6c459871-33da-47be-a50e-561ce8cb7fa9",
  "ghiChu": "Nộp báo cáo chuyên đề tiến sĩ đợt 1"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` / `201 Created` (TC20, TC27)**: Mốc chuyển sang `PENDING_REVIEW`. Tạo bản ghi minh chứng mới với `lanNop` tự động tăng dần (lần đầu là 1, nộp lại là 2).
* **`400 Bad Request` (TC21)**: Nộp mốc khi mốc chưa mở khóa (đang `LOCKED`).
* **`400 Bad Request` (TC22)**: Nộp mốc khi mốc đang ở trạng thái `PENDING_REVIEW` (chưa được duyệt hoặc từ chối).

---

## 17. POST /progress/reviews/:tienTrinhId/approve
* **Nhóm chức năng**: F2 - Phân quyền RBAC, F3 - Tiến trình 9 mốc
* **Test cases liên quan**: `TC14`, `TC23`, `TC24`, `TC28`, `TC29`, `TC30`, `TC31`
* **Mục đích**: Giáo vụ duyệt ĐẠT cho một mốc tiến trình. Với các mốc có chấm điểm (như mốc 2), yêu cầu phải có tối thiểu 3 phiếu nhận xét và điểm trung bình $\ge 7.0$. Yêu cầu bắt buộc phải đính kèm Quyết định làm căn cứ phê duyệt (`quyetDinhId`). Mở khóa mốc kế tiếp.
* **Quyền truy cập (Auth/Permissions)**: `milestone.approve` (`PERMISSIONS.MILESTONE_APPROVE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `tienTrinhId` | string (UUID) | Có | `@ParseUUIDPipe` | ID của bản ghi tiến trình mốc (`tienTrinhId`) đang ở `PENDING_REVIEW` |

### Query Parameters
*Không có.*

### Request Body (`ApproveMilestoneDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `quyetDinhId` | string (UUID) | Có | `@IsUUID()` | ID của quyết định căn cứ duyệt mốc (loại `CAN_CU_DUYET_MOC`) |

```json
{
  "quyetDinhId": "73c683b5-3162-4217-bf27-14fa01205391"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC23, TC30, TC31)**: Duyệt thành công. Mốc chuyển `PASSED`, mốc sau chuyển `UNLOCKED`, ghi log audit và gửi thông báo cho NCS.
* **`403 Forbidden` (TC14)**: NCS tự duyệt mốc của chính mình bị từ chối truy cập.
* **`400 Bad Request` (TC24)**: Thiếu hoặc không gửi `quyetDinhId`.
* **`400 Bad Request` (TC28)**: Mốc có chấm điểm nhưng chưa đủ 3 phiếu nhận xét.
* **`400 Bad Request` (TC29)**: Điểm trung bình các phiếu $< 7.0$ (vd: 6.9).

---

## 18. POST /progress/reviews/:tienTrinhId/reject
* **Nhóm chức năng**: F3 - Tiến trình 9 mốc
* **Test cases liên quan**: `TC25`, `TC26`
* **Mục đích**: Giáo vụ từ chối mốc tiến trình kèm lý do cụ thể để NCS chỉnh sửa nộp lại.
* **Quyền truy cập (Auth/Permissions)**: `milestone.reject` (`PERMISSIONS.MILESTONE_REJECT`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `tienTrinhId` | string (UUID) | Có | `@ParseUUIDPipe` | ID của tiến trình mốc cần từ chối |

### Query Parameters
*Không có.*

### Request Body (`RejectMilestoneDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `lyDo` | string | Có | `@IsString()`, `@Length(1, 1000)` | Lý do từ chối (không được để trống) |

```json
{
  "lyDo": "Thiếu chữ ký xác nhận của cán bộ hướng dẫn trong báo cáo"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC25)**: Từ chối thành công; mốc chuyển sang trạng thái `REJECTED`, thông báo được gửi đến NCS kèm lý do.
* **`400 Bad Request` (TC26)**: Không nhập lý do hoặc lý do là chuỗi rỗng `""`.

---

## 19. POST /progress/evidences/:minhChungId/evaluations
* **Nhóm chức năng**: F3 - Tiến trình 9 mốc
* **Test cases liên quan**: `TC28`, `TC29`, `TC30`, `TC31`, `TC32`
* **Mục đích**: Giáo vụ nhập phiếu đánh giá / điểm chấm nhận xét cho lần nộp minh chứng của NCS.
* **Quyền truy cập (Auth/Permissions)**: `milestone.approve` (`PERMISSIONS.MILESTONE_APPROVE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `minhChungId` | string (UUID) | Có | `@ParseUUIDPipe` | ID của bản ghi minh chứng nộp mốc |

### Query Parameters
*Không có.*

### Request Body (`CreateEvaluationDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `tenNguoiCham` | string | Có | `@IsString()`, `@Length(1, 150)` | Họ tên người chấm đánh giá |
| `donViNguoiCham` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(255)` | Cơ quan/đơn vị công tác của người chấm |
| `diem` | number (float) | Có | `@IsNumber({ maxDecimalPlaces: 1 })`, `@Min(0)`, `@Max(10)` | Điểm số theo thang điểm 10 (tối đa 1 chữ số thập phân) |
| `nhanXet` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(2000)` | Nhận xét chi tiết |
| `xacNhanTrung` | boolean | Không | `@IsOptional()`, `@IsBoolean()` | Cờ xác nhận nếu trùng tên người chấm |

```json
{
  "tenNguoiCham": "PGS.TS. Trần Văn Nam",
  "donViNguoiCham": "Trường Công nghệ Thông tin",
  "diem": 7.5,
  "nhanXet": "Nội dung nghiên cứu đạt yêu cầu mốc"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`201 Created` / `200 OK` (TC28, TC29, TC30, TC31)**: Lưu phiếu đánh giá thành công.
* **`400 Bad Request` (TC32)**: Điểm ngoài thang quy định ($<0$ hoặc $>10$, ví dụ: -1 hoặc 11).

---

## 20. POST /change-request
* **Nhóm chức năng**: F5 - Đơn gia hạn & điều chỉnh
* **Test cases liên quan**: `TC41`, `TC42`, `TC43`, `TC44`, `TC45`
* **Mục đích**: NCS khởi tạo đơn xin điều chỉnh học tập (Gia hạn thời gian, Đổi tên đề tài, Thay đổi GVHD). Hệ thống kiểm tra: hạn mới không được vượt hạn buộc thôi học, không được tạo thêm đơn khi đang có đơn chờ duyệt, bắt buộc có file tài liệu đính kèm với đơn gia hạn.
* **Quyền truy cập (Auth/Permissions)**: `change-request.create` (`PERMISSIONS.CHANGE_REQUEST_CREATE`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (`CreateChangeRequestDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `loai` | string (Enum) | Có | `@IsIn(['DOI_DE_TAI', 'DOI_GVHD', 'GIA_HAN'])` | Loại đơn đề nghị |
| `lyDo` | string | Có | `@IsString()`, `@IsNotEmpty()` | Lý do viết đơn |
| `fileId` | string (UUID) | Có (khi `loai` = `GIA_HAN`) | Bắt buộc đối với loại `GIA_HAN` | ID file PDF báo cáo tiến độ/đơn từ đã upload lên document-service |
| `soThangGiaHan` | integer | Có (khi `loai` = `GIA_HAN`) | `@IsInt()`, `@Min(1)`, `@Max(24)` | Số tháng xin gia hạn (từ 1 đến 24 tháng) |
| `batKhaKhang` | boolean | Không | `@IsOptional()`, `@IsBoolean()` | Cờ bất khả kháng (nếu nộp muộn) |
| `tenDeTaiMoi` | string | Có (khi `loai` = `DOI_DE_TAI`) | `@IsString()`, `@MaxLength(500)` | Tên đề tài nghiên cứu mới |
| `phanCongCuId` | string (UUID) | Có (khi `loai` = `DOI_GVHD`) | `@IsUUID()` | ID bản ghi phân công GVHD cũ |
| `gvhdMoiId` | string (UUID) | Có (khi `loai` = `DOI_GVHD`) | `@IsUUID()` | ID của GVHD mới thay thế |

```json
{
  "loai": "GIA_HAN",
  "soThangGiaHan": 6,
  "lyDo": "Cần thêm thời gian hoàn thiện các thí nghiệm thực nghiệm",
  "fileId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`201 Created` (TC41, TC42)**: Tạo đơn thành công; đơn ở trạng thái `CHO_GVHD_XAC_NHAN`; tạo các bản ghi xác nhận cho toàn bộ GVHD đang hướng dẫn NCS.
* **`400 Bad Request` (TC43)**: Hạn mới đề nghị vượt quá hạn buộc thôi học của NCS.
* **`400 Bad Request` (TC44)**: NCS đã có 1 đơn khác đang ở trạng thái chờ xử lý (`CHO_GVHD_XAC_NHAN` hoặc `CHO_DUYET`).
* **`400 Bad Request` (TC45)**: Thiếu file minh chứng đính kèm (`fileId`) khi tạo đơn gia hạn.

---

## 21. PATCH /change-request/:id/supervisor-review
* **Nhóm chức năng**: F5 - Đơn gia hạn & điều chỉnh
* **Test cases liên quan**: `TC46`, `TC47`
* **Mục đích**: Giảng viên hướng dẫn ghi nhận ý kiến đồng ý hoặc từ chối đơn đề nghị của NCS. Nếu 1 GVHD từ chối -> Đơn lập tức bị từ chối. Khi TẤT CẢ các GVHD đều đồng ý -> Đơn chuyển sang `CHO_DUYET`.
* **Quyền truy cập (Auth/Permissions)**: `change-request.supervisor-review` (`PERMISSIONS.CHANGE_REQUEST_SUPERVISOR_REVIEW`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | string (UUID) | Có | `@ParseUUIDPipe` | ID của đơn đề nghị điều chỉnh |

### Query Parameters
*Không có.*

### Request Body (`SupervisorReviewDeNghiDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `dongY` | boolean | Có | `@IsBoolean()` | `true` nếu đồng ý, `false` nếu từ chối |
| `nhanXet` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(2000)` | Ý kiến nhận xét của GVHD |

```json
{
  "dongY": true,
  "nhanXet": "Đồng ý cho NCS gia hạn thêm 6 tháng để hoàn thành bài báo"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC46)**: Khi GVHD cuối cùng xác nhận `dongY = true`, đơn chuyển trạng thái sang `CHO_DUYET`.
* **`200 OK` (TC47)**: Bất kỳ GVHD nào chọn `dongY = false`, đơn lập tức chuyển trạng thái sang `TU_CHOI` và dừng quy trình.

---

## 22. PATCH /change-request/:id/approve
* **Nhóm chức năng**: F5 - Đơn gia hạn & điều chỉnh
* **Test cases liên quan**: `TC48`
* **Mục đích**: Giáo vụ ra quyết định phê duyệt đơn xin gia hạn/điều chỉnh của NCS. Cập nhật hạn đào tạo mới của NCS và tạo Quyết định tương ứng trong hệ thống.
* **Quyền truy cập (Auth/Permissions)**: `change-request.review` (`PERMISSIONS.CHANGE_REQUEST_REVIEW`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: application/json`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | string (UUID) | Có | `@ParseUUIDPipe` | ID của đơn đề nghị đang ở `CHO_DUYET` |

### Query Parameters
*Không có.*

### Request Body (`ApproveDeNghiDto`)
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc Validation | Mô tả |
|:---|:---|:---:|:---|:---|
| `soQuyetDinh` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(100)` | Số hiệu quyết định phê duyệt gia hạn |
| `ngayQuyetDinh` | string | Không | `@IsOptional()`, `@IsString()` (`YYYY-MM-DD`) | Ngày ký quyết định |
| `quyetDinhId` | string (UUID) | Không | `@IsOptional()`, `@IsUUID()` | ID quyết định có sẵn (nếu chọn từ danh sách) |
| `fileId` | string (UUID) | Không | `@IsOptional()`, `@IsString()` | ID file PDF văn bản quyết định |
| `ghiChu` | string | Không | `@IsOptional()`, `@IsString()`, `@MaxLength(500)` | Ghi chú phê duyệt |
| `resetTuMoc` | integer | Không | `@IsOptional()`, `@IsInt()`, `@Min(2)`, `@Max(7)` | Số thứ tự mốc cần reset tiến trình (nếu là đổi đề tài) |

```json
{
  "soQuyetDinh": "456/QD-SĐH",
  "ngayQuyetDinh": "2026-11-15",
  "ghiChu": "Đồng ý cho NCS gia hạn theo quyết định của Hiệu trưởng"
}
```

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC48)**: Phê duyệt thành công; đơn chuyển `DA_DUYET`; hồ sơ NCS cập nhật `hanGiaHan = hanMoiDeNghi`, trạng thái `GIA_HAN`; tự động tạo bản ghi `QuyetDinh` loại `GIA_HAN`; ghi log audit.

---

## 23. POST /documents/upload
* **Nhóm chức năng**: F3 - Tiến trình, F6 - Upload tài liệu PDF
* **Test cases liên quan**: `TC20`, `TC49`, `TC50`, `TC51`, `TC52`, `TC53`, `TC54`
* **Mục đích**: Tải lên file tài liệu PDF vào hệ thống. Kiểm tra: kích thước tối đa 15MB, phần mở rộng file `.pdf`, kiểm tra Magic Bytes `%PDF-` ở 5 byte đầu, phân quyền loại tài liệu (NCS chỉ được upload `MINH_CHUNG_MOC` và `DON_TU`). Tự động tính mã băm SHA-256 để kiểm tra toàn vẹn.
* **Quyền truy cập (Auth/Permissions)**: `document.upload` (`PERMISSIONS.DOCUMENT_UPLOAD`).
* **Headers**:
  * `Authorization: Bearer <access_token>`
  * `Content-Type: multipart/form-data`

### Path Parameters
*Không có.*

### Query Parameters
*Không có.*

### Request Body (Multipart Form-Data)
| Tên Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `file` | Binary (File) | Có | File PDF thật (bắt đầu bằng `%PDF-`), tối đa 15MB (15.728.640 bytes) | File nội dung PDF cần lưu trữ |
| `documentType` | string (Enum) | Có | Thuộc: `MINH_CHUNG_MOC`, `QUYET_DINH`, `MINH_CHUNG_NGOAI_NGU`, `MINH_CHUNG_CONG_NO`, `DON_TU`, `BIEU_MAU`, `QUY_DINH`, `KHAC` | Phân loại tài liệu |
| `ncsId` | string (UUID) | Không | Bắt buộc với Giáo vụ khi upload loại `MINH_CHUNG_MOC`. Đối với NCS hệ thống tự gán theo hồ sơ. | ID hồ sơ NCS sở hữu |
| `refType` | string | Không | `@IsString()`, `@MaxLength(50)` | Loại thực thể liên kết (vd: `MINH_CHUNG_MOC`) |
| `refId` | string | Không | `@IsString()`, `@MaxLength(100)` | ID của thực thể liên kết |

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` / `201 Created` (TC49, TC50)**: Upload thành công. Trả về thông tin tài liệu gồm `id`, `checksum` (mã SHA-256), `status: "ACTIVE"`.
* **`400 Bad Request` / `413 Payload Too Large` (TC51)**: File vượt quá kích thước 15MB (ví dụ: 15.728.641 bytes).
* **`400 Bad Request` (TC52)**: File giả mạo đổi tên đuôi `.pdf` nhưng không có header `%PDF-`.
* **`400 Bad Request` (TC53)**: File không phải định dạng PDF (`.docx`, `.png`).
* **`403 Forbidden` (TC54)**: NCS cố tình upload loại tài liệu vượt quyền (ví dụ: `QUYET_DINH`).

---

## 24. GET /documents/:id
* **Nhóm chức năng**: F2 - Phân quyền RBAC, F6 - Upload tài liệu PDF
* **Test cases liên quan**: `TC16`, `TC56`
* **Mục đích**: Lấy thông tin metadata của một tài liệu PDF (tên file, dung lượng, mã checksum, ngày tạo, trạng thái). Có kiểm tra quyền sở hữu IDOR (NCS chỉ xem được tài liệu thuộc hồ sơ của mình).
* **Quyền truy cập (Auth/Permissions)**: `document.read` (`PERMISSIONS.DOCUMENT_READ`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | string (UUID) | Có | `@ParseUUIDPipe` | ID tài liệu (`documentId`) |

### Query Parameters
*Không có.*

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK`**: Trả về metadata của tài liệu.
* **`403 Forbidden` / `404 Not Found` (TC16)**: NCS A cố tình truy cập tài liệu thuộc sở hữu của NCS B.

---

## 25. GET /documents/:id/download
* **Nhóm chức năng**: F2 - Phân quyền RBAC, F6 - Upload tài liệu PDF
* **Test cases liên quan**: `TC16`, `TC55`, `TC56`
* **Mục đích**: Tải xuống nội dung file nhị phân PDF. Trình duyệt có thể mở xem trực tiếp hoặc tải về máy.
* **Quyền truy cập (Auth/Permissions)**: `document.read` (`PERMISSIONS.DOCUMENT_READ`).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | string (UUID) | Có | `@ParseUUIDPipe` | ID tài liệu cần tải xuống |

### Query Parameters
*Không có.*

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC55)**: Trả về luồng file nhị phân (`application/pdf`) cùng header `Content-Disposition`. Mã băm SHA-256 của file tải về trùng khớp hoàn toàn với checksum khi upload.
* **`403 Forbidden` / `404 Not Found` (TC16)**: Chặn tải file nếu người gọi là NCS không sở hữu tài liệu.
* **`404 Not Found` (TC56)**: File đã bị xóa mềm (`DELETED`) không còn tải xuống được qua API thông thường.

---

## 26. DELETE /documents/:id
* **Nhóm chức năng**: F6 - Upload tài liệu PDF
* **Test cases liên quan**: `TC56`
* **Mục đích**: Xóa mềm một tài liệu trong hệ thống (cập nhật `status = DELETED`, gán `deletedAt = now()`).
* **Quyền truy cập (Auth/Permissions)**: `document.delete` (`PERMISSIONS.DOCUMENT_DELETE`) (Dành cho Giáo vụ, Quản trị viên).
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `id` | string (UUID) | Có | `@ParseUUIDPipe` | ID của tài liệu muốn xóa |

### Query Parameters
*Không có.*

### Request Body
*Không có.*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC56)**: Xóa mềm thành công.

---

## 27. GET /audit-logs
* **Nhóm chức năng**: F2 - Phân quyền RBAC
* **Test cases liên quan**: `TC18`
* **Mục đích**: Tra cứu nhật ký kiểm toán hệ thống ghi lại lịch sử thao tác của người dùng.
* **Quyền truy cập (Auth/Permissions)**: `audit.read` (`PERMISSIONS.AUDIT_READ`) - Chỉ cấp cho vai trò `ADMIN`.
* **Headers**: `Authorization: Bearer <access_token>`

### Path Parameters
*Không có.*

### Query Parameters (`ListAuditQueryDto`)
| Tham số | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|:---|:---|:---:|:---|:---|
| `page` | number | Không | `@IsInt()`, `@Min(1)` | Trang hiện tại |
| `limit` | number | Không | `@IsInt()`, `@Min(1)`, `@Max(100)` | Số bản ghi mỗi trang |
| `action` | string | Không | `@IsString()` | Tên hành động (vd: `LOGIN`, `SUBMIT_MILESTONE`, `APPROVE_CHANGE_REQUEST`) |
| `entityType` | string | Không | `@IsString()` | Thực thể bị tác động (vd: `NCS`, `TIEN_TRINH`, `QUYET_DINH`) |
| `entityId` | string | Không | `@IsString()` | ID thực thể |
| `actorId` | string | Không | `@IsString()` | ID người thực hiện |
| `ncsId` | string (UUID) | Không | `@IsUUID()` | ID của NCS liên quan |
| `keyword` | string | Không | `@IsString()` | Từ khóa tìm kiếm |
| `fromDate` | string | Không | `@IsDateString()` | Từ ngày |
| `toDate` | string | Không | `@IsDateString()` | Đến ngày |

### Request Body
*Không có (GET).*

### Phản hồi & Mã trạng thái HTTP
* **`200 OK` (TC18 - Admin)**: Trả về danh sách nhật ký kiểm toán.
* **`403 Forbidden` (TC18 - Giáo vụ, GVHD, NCS)**: Bị từ chối do không có quyền `audit.read`.

---

# MA TRẬN ÁNH XẠ TEST CASE VỚI API (TRACEABILITY MATRIX)

| TC ID | Tiêu đề Test Case | Endpoint sử dụng | Phân loại Body / Params / Query chính |
|:---:|:---|:---|:---|
| **TC01** | Đăng nhập thành công với tài khoản hợp lệ | `POST /auth/login`<br>`GET /auth/me` | Body: `{ username, password }`<br>Header: `Authorization: Bearer <token>` |
| **TC02** | Đăng nhập thất bại: sai mật khẩu hoặc user không tồn tại | `POST /auth/login` | Body: `{ username, password }` |
| **TC03** | Đăng nhập thất bại với tài khoản bị khóa | `POST /auth/login` | Body: `{ username, password }` |
| **TC04** | Đăng xuất thu hồi refresh token | `POST /auth/logout`<br>`POST /auth/refresh` | Body: `{ refreshToken }` |
| **TC05** | Refresh token hợp lệ cấp cặp token mới | `POST /auth/refresh`<br>`GET /auth/me` | Body: `{ refreshToken }` |
| **TC06** | Reuse detection: dùng lại refresh token đã thu hồi | `POST /auth/refresh` | Body: `{ refreshToken }` |
| **TC07** | Đổi mật khẩu thành công | `POST /auth/change-password` | Body: `{ oldPassword, newPassword }` |
| **TC08** | Đổi mật khẩu thất bại khi sai mật khẩu cũ | `POST /auth/change-password` | Body: `{ oldPassword, newPassword }` |
| **TC09** | Khóa/Mở khóa tài khoản qua quyết định kỷ luật | `POST /decisions`<br>`PATCH /decisions/:id/deactivate` | Body Decision: `{ loai, soQuyetDinh, ngayQuyetDinh, ncsIds }`<br>Params: `:id`, Body: `{ lyDo }` |
| **TC10** | Giáo vụ reset mật khẩu về mặc định | `PATCH /auth/users/:id/reset-password` | Params: `:id` |
| **TC11** | Gọi API khi không có token | `GET /ncs` | Không kèm header Authorization |
| **TC12** | Gọi API với token bị sửa đổi | `GET /auth/me` | Header: `Authorization: Bearer <tampered_token>` |
| **TC13** | NCS gọi API quản trị người dùng | `GET /auth/users` | Header token NCS (Thiếu quyền `user.read`) |
| **TC14** | NCS tự duyệt mốc của mình | `POST /progress/reviews/:tienTrinhId/approve` | Params: `:tienTrinhId`, Token NCS (Thiếu quyền `milestone.approve`) |
| **TC15** | GVHD gọi API import NCS | `POST /ncs/import/confirm` | Form-data: `file`, Token GVHD (Thiếu quyền `ncs.create`) |
| **TC16** | IDOR: NCS A truy cập tài liệu của NCS B | `GET /documents/:id`<br>`GET /documents/:id/download` | Params: `:id` (documentId của NCS B), Token của NCS A |
| **TC17** | GVHD xem NCS không thuộc quyền hướng dẫn | `GET /gvhd/me/ncs/:ncsId` | Params: `:ncsId`, Token GVHD không phụ trách |
| **TC18** | Truy cập nhật ký kiểm toán theo vai trò | `GET /audit-logs` | Query: Pagination/Filter, Thử nghiệm 4 vai trò |
| **TC19** | Trạng thái 9 mốc của NCS mới khởi tạo | `GET /progress/me` | Token của NCS mới |
| **TC20** | NCS nộp minh chứng mốc 2 hợp lệ | `POST /documents/upload`<br>`POST /progress/milestones/2/submit` | Form-data: `file`, `documentType: "MINH_CHUNG_MOC"`<br>Params: `:thuTu` = 2, Body: `{ fileId }` |
| **TC21** | NCS nộp mốc 3 khi mốc 2 chưa đạt | `POST /progress/milestones/3/submit` | Params: `:thuTu` = 3, Body: `{ fileId }` |
| **TC22** | NCS nộp lại khi mốc đang chờ duyệt | `POST /progress/milestones/2/submit` | Params: `:thuTu` = 2, Body: `{ fileId }` |
| **TC23** | Giáo vụ duyệt đạt mốc không chấm điểm | `POST /progress/reviews/:tienTrinhId/approve`<br>`GET /progress/me` | Params: `:tienTrinhId`, Body: `{ quyetDinhId }` |
| **TC24** | Giáo vụ duyệt đạt mốc nhưng thiếu Quyết định | `POST /progress/reviews/:tienTrinhId/approve` | Params: `:tienTrinhId`, Body: `{}` (Thiếu `quyetDinhId`) |
| **TC25** | Giáo vụ từ chối mốc kèm lý do | `POST /progress/reviews/:tienTrinhId/reject` | Params: `:tienTrinhId`, Body: `{ lyDo: "Thiếu chữ ký..." }` |
| **TC26** | Giáo vụ từ chối mốc không nhập lý do | `POST /progress/reviews/:tienTrinhId/reject` | Params: `:tienTrinhId`, Body: `{ lyDo: "" }` |
| **TC27** | NCS nộp lại sau khi bị từ chối | `POST /progress/milestones/3/submit` | Params: `:thuTu` = 3, Body: `{ fileId }` |
| **TC28** | Duyệt mốc 2 khi chỉ có 2 phiếu nhận xét | `POST /progress/evidences/:id/evaluations`<br>`POST /progress/reviews/:id/approve` | Params: `:id`, Body Evaluation: `{ tenNguoiCham, diem: 8.0 }`<br>Thử duyệt mốc |
| **TC29** | Duyệt mốc 2 khi điểm trung bình 6.9 | `POST /progress/evidences/:id/evaluations`<br>`POST /progress/reviews/:id/approve` | Nhập 3 phiếu (7.0, 7.0, 6.7), thử duyệt |
| **TC30** | Duyệt mốc 2 khi điểm trung bình đúng 7.0 | `POST /progress/evidences/:id/evaluations`<br>`POST /progress/reviews/:id/approve` | Nhập 3 phiếu (7.0, 7.0, 7.0), duyệt mốc |
| **TC31** | Duyệt mốc 2 khi điểm trung bình 7.1 | `POST /progress/evidences/:id/evaluations`<br>`POST /progress/reviews/:id/approve` | Nhập 3 phiếu (7.0, 7.0, 7.3), duyệt mốc |
| **TC32** | Nhập phiếu nhận xét có điểm ngoài thang | `POST /progress/evidences/:id/evaluations` | Body: `{ diem: 11 }` và `{ diem: -1 }` |
| **TC33** | Phân công GVHD thành công | `POST /gvhd/assignments` | Body: `{ ncsId, gvhdId, vaiTro: "HUONG_DAN_CHINH", quyetDinhId }` |
| **TC34** | Tiến sĩ đã đủ 3 NCS nhận thêm NCS | `POST /gvhd/assignments` | Body: Thử phân công vượt mức (3.0/3.0) |
| **TC35** | Tiến sĩ 2.0 nhận thêm 1 đồng hướng dẫn | `POST /gvhd/assignments` | Body: `{ vaiTro: "DONG_HUONG_DAN" }` |
| **TC36** | Tiến sĩ 2.5 nhận thêm 1 hướng dẫn chính | `POST /gvhd/assignments` | Body: `{ vaiTro: "HUONG_DAN_CHINH" }` (Vượt mức 3.5 > 3) |
| **TC37** | Phó giáo sư đủ 5 NCS nhận thêm NCS | `POST /gvhd/assignments` | Body: Thử phân công vượt mức PGS (5.0/5.0) |
| **TC38** | Phân công không có Quyết định hợp lệ | `POST /gvhd/assignments` | Body: Thiếu hoặc sai loại `quyetDinhId` |
| **TC39** | Hủy hiệu lực phân công giảm định mức | `PATCH /gvhd/assignments/:id/deactivate` | Params: `:id`, Body: `{ lyDo }` |
| **TC40** | Hai phân công đồng thời cho GV chỉ còn 1 suất | `POST /gvhd/assignments` | Gửi đồng thời 2 request bằng `Promise.all` |
| **TC41** | NCS tạo đơn gia hạn hợp lệ | `POST /change-request` | Body: `{ loai: "GIA_HAN", soThangGiaHan: 6, lyDo, fileId }` |
| **TC42** | Hạn mới đề nghị đúng bằng hạn buộc thôi học | `POST /change-request` | Body: `{ hanMoiDeNghi = hanBuocThoiHoc }` |
| **TC43** | Hạn mới đề nghị vượt hạn buộc thôi học 1 ngày | `POST /change-request` | Body: `{ hanMoiDeNghi = hanBuocThoiHoc + 1 }` |
| **TC44** | Tạo đơn thứ hai khi đơn đầu đang chờ xử lý | `POST /change-request` | Gửi đơn hợp lệ thứ 2 khi đơn 1 đang pending |
| **TC45** | Tạo đơn gia hạn không đính kèm PDF | `POST /change-request` | Body: Thiếu trường `fileId` |
| **TC46** | Tất cả GVHD đồng ý thì đơn chuyển chờ duyệt | `PATCH /change-request/:id/supervisor-review` | Params: `:id`, Body: `{ dongY: true }` |
| **TC47** | Một GVHD từ chối thì đơn bị từ chối ngay | `PATCH /change-request/:id/supervisor-review` | Params: `:id`, Body: `{ dongY: false, nhanXet }` |
| **TC48** | Giáo vụ phê duyệt đơn gia hạn | `PATCH /change-request/:id/approve` | Params: `:id`, Body: `{ soQuyetDinh, ngayQuyetDinh }` |
| **TC49** | Upload PDF hợp lệ | `POST /documents/upload` | Form-data: PDF 1MB, `documentType: "MINH_CHUNG_MOC"` |
| **TC50** | Upload file PDF đúng 15MB (biên) | `POST /documents/upload` | Form-data: PDF đúng 15.728.640 bytes |
| **TC51** | Upload file PDF vượt 15MB 1 byte | `POST /documents/upload` | Form-data: PDF 15.728.641 bytes |
| **TC52** | Upload file giả mạo đuôi .pdf | `POST /documents/upload` | Form-data: file không có magic bytes `%PDF-` |
| **TC53** | Upload file không phải PDF | `POST /documents/upload` | Form-data: `.docx` hoặc `.png` |
| **TC54** | NCS upload loại tài liệu không được phép | `POST /documents/upload` | Form-data: `documentType: "QUYET_DINH"` bằng token NCS |
| **TC55** | NCS tải xuống tài liệu của chính mình | `GET /documents/:id/download` | Params: `:id` của tài liệu do chính NCS upload |
| **TC56** | Xóa mềm tài liệu | `DELETE /documents/:id`<br>`GET /documents/:id`<br>`GET /documents/:id/download` | Params: `:id` của tài liệu |

