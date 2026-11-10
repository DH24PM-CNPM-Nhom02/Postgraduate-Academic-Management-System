# Luồng Quản lý Đề tài, Phân công GVHD và Đơn đề nghị điều chỉnh (Change Request): Tài liệu API cho Frontend

Hệ thống quản lý đào tạo sau đại học (PostGraduate Academic Management System). Tài liệu này mô tả chi tiết các phân hệ:
1. **Quản lý Đề tài luận án** (`/thesis`)
2. **Phân công Giảng viên hướng dẫn** (`/gvhd`)
3. **Đơn đề nghị điều chỉnh & Gia hạn đào tạo** (`/change-request`)

Tài liệu được biên soạn đồng bộ với cấu trúc của [`frontend-9moc-plan.md`](./frontend-9moc-plan.md) để đội ngũ Frontend dễ dàng xây dựng giao diện người dùng chính xác, an toàn và tối ưu trải nghiệm (UX).

---

## Mục lục

1. [Khái niệm nền & Tổng quan luồng nghiệp vụ](#1-khái-niệm-nền--tổng-quan-luồng-nghiệp-vụ)
2. [Bản đồ ID & Dữ liệu tham chiếu](#2-bản-đồ-id--dữ-liệu-tham-chiếu)
3. [Quy tắc về File & Đơn từ đính kèm](#3-quy-tắc-về-file--đơn-từ-đính-kèm)
4. [Màn hình của Nghiên cứu sinh (NCS)](#4-màn-hình-của-nghiên-cứu-sinh-ncs)
5. [Màn hình của Giảng viên hướng dẫn (GVHD)](#5-màn-hình-của-giảng-viên-hướng-dẫn-gvhd)
6. [Màn hình của Giáo vụ / Quản trị viên (Admin & Giáo vụ)](#6-màn-hình-của-giáo-vụ--quản-trị-viên-admin--giáo-vụ)
7. [Hệ thống Thông báo (Notification)](#7-hệ-thống-thông-báo-notification)
8. [Bảng API tổng hợp](#8-bảng-api-tổng-hợp)
9. [Quy tắc chung và xử lý lỗi](#9-quy-tắc-chung-và-xử-lý-lỗi)

---

## 1. Khái niệm nền & Tổng quan luồng nghiệp vụ

### 1.1 Phân hệ Đề tài luận án (`thesis`)

- **Giao đề tài lần đầu:** Do Giáo vụ thực hiện sau khi có Quyết định giao đề tài (loại `GIAO_DE_TAI`). Một NCS tại một thời điểm chỉ có **tối đa 01 đề tài ở trạng thái hiệu lực (`HIEU_LUC`)**.
- **Trạng thái đề tài (`trangThai`):**
  - `HIEU_LUC`: Đang là đề tài chính thức được giao cho NCS.
  - `DA_THAY_THE`: Đề tài cũ đã được thay thế bằng đề tài mới qua quy trình đổi đề tài (`DOI_DE_TAI`).
  - `DA_HUY`: Đề tài bị hủy do Giáo vụ thao tác nhầm/sai sót (`deactivate`).
- **Hủy đề tài (`PATCH /thesis/:id/deactivate`):** Chỉ dùng khi **giao nhầm**. Nếu NCS muốn đổi đề tài theo nguyện vọng nghiên cứu thì bắt buộc phải thông qua luồng **Đơn đề nghị đổi đề tài (`DOI_DE_TAI`)**. Không cho phép hủy đề tài khi NCS đang có đơn đề nghị điều chỉnh chờ duyệt.

---

### 1.2 Phân hệ Phân công Giảng viên hướng dẫn (`gvhd/assignments`)

- **Vai trò hướng dẫn (`vaiTro`):**
  - `HUONG_DAN_CHINH` (Hướng dẫn chính): Trọng số tính định mức là **1.0**. Mỗi NCS **chỉ có duy nhất 01 GVHD chính** tại một thời điểm.
  - `DONG_HUONG_DAN` (Đồng hướng dẫn): Trọng số tính định mức là **0.5**.
- **Định mức hướng dẫn tối đa (`maxNcsChoPhep`):**
  - Mỗi giảng viên có định mức số NCS được phép hướng dẫn đồng thời.
  - Khi phân công mới: `soNcsDangHuongDan + trongSo <= maxNcsChoPhep`. Nếu vượt định mức, hệ thống từ chối.
  - Cơ chế **Optimistic Locking** (`version`): Hệ thống bảo vệ dữ liệu khi nhiều giáo vụ cùng phân công vào một giảng viên tại cùng thời điểm.
- **Hủy phân công do giao nhầm (`PATCH /gvhd/assignments/:id/deactivate`):**
  - Trả lại định mức cho GVHD: `soNcsDangHuongDan = max(0, soNcsDangHuongDan - trongSo)`.
  - Phân công chuyển sang trạng thái `DEACTIVATE`. Bắt buộc nhập lý do.
  - Không cho phép hủy phân công nếu NCS đang có đơn đề nghị điều chỉnh chờ duyệt.

---

### 1.3 Phân hệ Đơn đề nghị điều chỉnh (`change-request`)

Mỗi NCS tại một thời điểm **chỉ được phép có tối đa 01 đơn đề nghị đang xử lý** (trạng thái `CHO_GVHD_XAC_NHAN` hoặc `CHO_DUYET`). Nếu muốn gửi đơn khác, phải đợi đơn hiện tại được duyệt/từ chối hoặc người làm đơn chủ động hủy đơn.

Hệ thống hỗ trợ 3 loại đề nghị điều chỉnh (`loai`):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               3 LOẠI ĐƠN ĐỀ NGHỊ                                      │
├────────────────────┬───────────────────────────────────┬───────────────────────────────┤
│ 1. DOI_DE_TAI      │ 2. DOI_GVHD                       │ 3. GIA_HAN                    │
│ (Đổi đề tài luận án│ (Thay đổi giảng viên hướng dẫn)   │ (Gia hạn thời gian đào tạo)   │
└────────────────────┴───────────────────────────────────┴───────────────────────────────┘
```

#### a. Đổi đề tài (`DOI_DE_TAI`)
- **Ai được nộp:** NCS nộp cho chính mình, hoặc GVHD nộp thay cho NCS mình hướng dẫn.
- **Điều kiện:** NCS chưa hoàn thành Mốc 8 (bảo vệ chuyên đề / bài báo). Nếu đã đạt Mốc 8 mà vẫn muốn đổi thì bắt buộc phải đánh dấu cờ `batKhaKhang = true` và nêu rõ lý do bất khả kháng.
- **Tùy chọn đặt lại tiến trình (`resetTuMoc`):** Khi Giáo vụ duyệt đơn đổi đề tài, có thể chọn đặt lại các mốc từ `2` đến `7`. Các mốc từ `resetTuMoc` trở đi sẽ chuyển về `LOCKED` (riêng mốc bắt đầu đặt lại sẽ là `UNLOCKED` nếu mốc trước đó đã `PASSED`).

#### b. Đổi GVHD (`DOI_GVHD`)
- **Ai được nộp:** NCS nộp cho chính mình, hoặc GVHD nộp thay cho NCS mình hướng dẫn.
- **Điều kiện:** Phải gửi chậm nhất **12 tháng trước khi kết thúc khóa học** (`hanGiaHan ?? hanChinhQuy`). Nếu quá hạn thì bắt buộc đánh dấu `batKhaKhang = true`.
- **Dữ liệu cần cung cấp:**
  - `phanCongCuId`: Phân công hướng dẫn hiện tại cần thay đổi (lấy từ API danh sách GVHD của NCS).
  - `gvhdMoiId`: Giảng viên mới được đề xuất thay thế.
  - GVHD mới không được trùng với GVHD cũ và không được đang hướng dẫn NCS này.
- **Khi duyệt:** Giáo vụ chọn Quyết định loại `PHAN_CONG_GVHD`. Hệ thống tự động vô hiệu hóa phân công cũ, tạo phân công mới, trừ định mức của GV cũ và cộng định mức cho GV mới.

#### c. Gia hạn học tập (`GIA_HAN`)
- **Ai được nộp:** **CHỈ NCS** mới có quyền nộp đơn này (GVHD và Giáo vụ không nộp thay được).
- **Điều kiện khắt khe:**
  1. NCS phải đang ở trạng thái `DANG_HOC` hoặc `GIA_HAN`.
  2. NCS **đã hoàn thành Mốc 2 (`PASSED`)** — Mốc đề cương nghiên cứu.
  3. Phải nộp trước hạn đào tạo hiện tại **ít nhất 02 tháng**.
  4. Số tháng xin gia hạn (`soThangGiaHan`): Từ **1 đến 24 tháng**.
  5. Tổng thời gian gia hạn tích lũy qua tất cả các lần **không quá 24 tháng**.
  6. Tổng thời gian đào tạo toàn khóa (kể cả gia hạn) tuyệt đối **không vượt quá 72 tháng** kể từ ngày công nhận NCS (`hanBuocThoiHoc`).
  7. NCS phải có ít nhất 01 GVHD đang hướng dẫn hiệu lực.
  8. **Bắt buộc đính kèm file báo cáo tiến độ / đơn từ** (`fileId` loại `DON_TU` hoặc `MINH_CHUNG_MOC`).
- **Quy trình 2 bước thẩm định:**

```
[NCS nộp đơn kèm file báo cáo]
             │
             ▼
      CHO_GVHD_XAC_NHAN
             │
      ┌──────┴─────────────────────────────────────────────┐
      │ Tập thể GVHD vào xem xét báo cáo tiến độ:         │
      │ • Bất kỳ 1 GVHD bấm "Từ chối"                     │
      │   ──▶ Dừng quy trình ngay, chuyển TU_CHOI         │
      │ • TẤT CẢ các GVHD đều bấm "Đồng ý"                │
      │   ──▶ Chuyển trạng thái sang CHO_DUYET            │
      └────────────────────────────────────────────────────┘
             │
             ▼
         CHO_DUYET
             │
      ┌──────┴─────────────────────────────────────────────┐
      │ Giáo vụ thẩm định:                                │
      │ • Bấm "Từ chối" kèm lý do ──▶ Chuyển TU_CHOI       │
      │ • Bấm "Duyệt" + Nhập số QĐ, ngày QĐ (hoặc chọn QĐ)│
      │   ──▶ Chuyển DA_DUYET                             │
      │   ──▶ Tự động tạo bản ghi QuyetDinh loại GIA_HAN   │
      │   ──▶ Cập nhật NCS sang GIA_HAN, cập nhật hanGiaHan│
      │   ──▶ Bắn thông báo đến NCS và tập thể GVHD        │
      └────────────────────────────────────────────────────┘
```

---

## 2. Bản đồ ID & Dữ liệu tham chiếu

| Tên ID | Định dạng | Lấy từ đâu | Sử dụng ở đâu |
| :--- | :--- | :--- | :--- |
| `ncsId` | UUID | Thông tin đăng nhập NCS, danh sách NCS (`GET /ncs`) | Giao đề tài, phân công GVHD, tạo đơn đề nghị thay |
| `gvhdId` | UUID | Danh sách GVHD (`GET /gvhd`) | Phân công GVHD, chọn GVHD mới trong đơn đổi GVHD |
| `phanCongCuId` | UUID | `GET /gvhd/my-supervisors` hoặc `GET /gvhd/assignments?ncsId=` | Chọn giảng viên cần thay thế trong đơn `DOI_GVHD` |
| `quyetDinhId` | UUID | Danh sách quyết định (`GET /decisions?loai=...`) | Căn cứ pháp lý khi giao đề tài, phân công GVHD, hoặc duyệt đơn |
| `deNghiId` | UUID | `GET /change-request` | Xem chi tiết, hủy đơn, GVHD xác nhận, Giáo vụ duyệt/từ chối |
| `fileId` | String | Upload PDF qua `POST /documents/upload` | Đính kèm minh chứng/báo cáo vào đơn đề nghị |

---

## 3. Quy tắc về File & Đơn từ đính kèm

Mọi thao tác đính kèm tài liệu đều tuân theo nguyên tắc: **Upload file lên trước để lấy `fileId`, sau đó mới truyền `fileId` vào JSON của API nghiệp vụ.**

### 3.1 Upload file: `POST /documents/upload`
- Định dạng: `multipart/form-data`, file PDF, tối đa **15 MB**.
- Trường `documentType`:
  - `DON_TU` hoặc `MINH_CHUNG_MOC`: Dành cho NCS/GVHD đính kèm đơn đề nghị hoặc báo cáo tiến độ.
  - `QUYET_DINH`: Dành cho Giáo vụ khi đính kèm bản scan quyết định.
- **Ràng buộc:** Một file chỉ được gắn cho **01 đơn đề nghị đang xử lý**. Hệ thống sẽ trả về lỗi `409 Conflict` nếu cố tình dùng lại `fileId` của một đơn đang chờ duyệt khác.

### 3.2 Tải và xem lại file: `GET /documents/:id/download`
- Cần đính kèm header `Authorization: Bearer <accessToken>`.
- FE tải dưới dạng `blob` và tạo Object URL (`URL.createObjectURL(blob)`) để nhúng vào thẻ iframe hoặc mở tab mới xem PDF.

---

## 4. Màn hình của Nghiên cứu sinh (NCS)

NCS có thể xem thông tin đề tài, giảng viên hướng dẫn của mình và thực hiện nộp các đơn đề nghị điều chỉnh.

### 4.1 Xem Đề tài & Giảng viên hướng dẫn của tôi
- **Đề tài hiện tại:** Gọi `GET /thesis/ncs/me`.
  - Trả về thông tin đề tài đang hiệu lực (`HIEU_LUC`), ngày giao, quyết định giao đề tài.
  - Kèm mảng `lichSu` các đề tài cũ đã từng đổi (`DA_THAY_THE`) nếu có.
- **Danh sách GVHD hiện tại:** Gọi `GET /gvhd/my-supervisors`.
  - Trả về mảng các GVHD đang hướng dẫn:
    ```json
    [
      {
        "phanCongId": "f784d516-...",
        "vaiTro": "HUONG_DAN_CHINH",
        "trongSo": 1.0,
        "ngayBatDau": "2024-11-01T00:00:00.000Z",
        "gvhd": {
          "id": "e12a4b...",
          "maGv": "GV001",
          "hoTen": "PGS. TS. Nguyễn Văn A",
          "hocHamHocVi": "PGS.TS",
          "email": "nva@university.edu.vn"
        },
        "quyetDinh": {
          "id": "qd-1...",
          "soQuyetDinh": "100/QĐ-ĐH",
          "ngayQuyetDinh": "2024-10-25T00:00:00.000Z"
        }
      }
    ]
    ```

---

### 4.2 Màn hình Quản lý Đơn đề nghị của tôi
- **Danh sách đơn:** Gọi `GET /change-request`.
  - Backend tự động nhận diện token NCS và chỉ trả về các đơn đề nghị của chính NCS đó.
  - Hiển thị badge trạng thái trực quan:
    - `CHO_GVHD_XAC_NHAN`: Đang chờ tập thể GVHD thẩm định báo cáo (chỉ có ở đơn gia hạn).
    - `CHO_DUYET`: Đã được tập thể GVHD đồng ý (hoặc đơn đổi đề tài/GVHD), đang chờ Giáo vụ duyệt.
    - `DA_DUYET`: Đã được phê duyệt chính thức và ban hành quyết định.
    - `TU_CHOI`: Đã bị từ chối (bấm vào để xem lý do từ chối).
    - `DA_HUY`: Đơn do người nộp tự hủy.
- **Nút "Hủy đơn" (`PATCH /change-request/:id/cancel`):**
  - Chỉ hiển thị khi đơn ở trạng thái `CHO_GVHD_XAC_NHAN` hoặc `CHO_DUYET`.
  - Bật modal xác nhận: *"Bạn có chắc chắn muốn hủy đơn đề nghị này không?"*.

---

### 4.3 Form Nộp đơn đề nghị: `POST /change-request`

FE hiển thị nút bấm **"Tạo đơn đề nghị mới"** kèm dropdown chọn 1 trong 3 loại:

#### a. Đơn Đổi đề tài luận án (`DOI_DE_TAI`)
- **Các trường nhập:**
  - *Tên đề tài hiện tại*: Hiển thị dạng read-only (lấy từ `GET /thesis/ncs/me`).
  - *Tên đề tài mới đề xuất*: Ô input text bắt buộc (tối đa 500 ký tự).
  - *Lý do thay đổi*: Textarea bắt buộc.
  - *File đơn đề nghị / minh chứng*: Upload PDF (tùy chọn).
  - *Cờ bất khả kháng (`batKhaKhang`)*: Chỉ bật khi NCS đã hoàn thành Mốc 8.
- **Payload gửi lên:**
  ```json
  {
    "loai": "DOI_DE_TAI",
    "tenDeTaiMoi": "Nghiên cứu ứng dụng trí tuệ nhân tạo trong y tế thông minh",
    "lyDo": "Định hướng nghiên cứu mở rộng sang lĩnh vực xử lý ảnh y tế",
    "fileId": "uuid-file-pdf",
    "batKhaKhang": false
  }
  ```

#### b. Đơn Thay đổi Giảng viên hướng dẫn (`DOI_GVHD`)
- **Các trường nhập:**
  - *Chọn giảng viên cần thay đổi*: Dropdown select lấy từ danh sách `GET /gvhd/my-supervisors`. Lưu giá trị `phanCongId` vào `phanCongCuId`.
  - *Chọn giảng viên mới thay thế*: Dropdown select tìm kiếm từ danh sách giảng viên toàn trường (`GET /gvhd?trangThai=true`). Lưu `id` của GV vào `gvhdMoiId`.
  - *Lý do thay đổi*: Textarea bắt buộc.
  - *File đơn từ / minh chứng*: Upload PDF (tùy chọn).
  - *Cờ bất khả kháng*: Tự động tick nếu thời gian còn lại của khóa học < 12 tháng.
- **Payload gửi lên:**
  ```json
  {
    "loai": "DOI_GVHD",
    "phanCongCuId": "uuid-phan-cong-cu",
    "gvhdMoiId": "uuid-gvhd-moi",
    "lyDo": "Giảng viên chuyển công tác, cần thay đổi người hướng dẫn",
    "fileId": "uuid-file-pdf",
    "batKhaKhang": false
  }
  ```

#### c. Đơn Đăng ký Gia hạn học tập (`GIA_HAN`)
- **Kiểm tra điều kiện ở Client (trước khi mở form):**
  - NCS phải hoàn thành Mốc 2 (`tienTrinh.moc.thuTu === 2 && tienTrinh.trangThai === 'PASSED'`). Nếu chưa, vô hiệu hóa nút và hiện tooltip: *"Bạn cần hoàn thành Mốc 2 (Báo cáo đề cương) để được xin gia hạn."*.
  - Kiểm tra hạn chót nộp đơn: Phải trước ngày kết thúc khóa học ít nhất **02 tháng**. Nếu quá hạn, hiển thị cảnh báo đỏ và khóa form.
- **Bảng tóm tắt thời gian đào tạo (Hiển thị ngay trên đầu form):**
  - Hạn học tập hiện tại: `dd/mm/yyyy`
  - Hạn tối đa toàn khóa (72 tháng): `dd/mm/yyyy` (`hanBuocThoiHoc`)
  - Tổng số tháng đã gia hạn trước đây: `N tháng`
  - Số tháng gia hạn tối đa còn được xin: `min(24 - daGiaHan, soThangToiDaConLai) tháng`
- **Các trường nhập:**
  - *Số tháng xin gia hạn*: Input number từ **1** đến **24**.
  - *Hạn mới dự kiến*: Tự động tính hiển thị (`hanHienTai + soThangGiaHan`). Nếu vượt quá `hanBuocThoiHoc`, báo lỗi đỏ ngay tại ô nhập.
  - *Lý do xin gia hạn*: Textarea bắt buộc (nêu rõ các khó khăn, khối lượng công việc còn lại).
  - *Báo cáo tiến độ & Kế hoạch hoàn thành*: **Bắt buộc upload file PDF** (`documentType = DON_TU` hoặc `MINH_CHUNG_MOC`).
- **Payload gửi lên:**
  ```json
  {
    "loai": "GIA_HAN",
    "soThangGiaHan": 6,
    "lyDo": "Cần thêm thời gian thu thập dữ liệu thử nghiệm lâm sàng và công bố bài báo quốc tế",
    "fileId": "uuid-file-bao-cao-tien-do"
  }
  ```

---

## 5. Màn hình của Giảng viên hướng dẫn (GVHD)

Giảng viên hướng dẫn có thể xem danh sách các đề nghị của NCS do mình hướng dẫn, nộp đơn thay cho NCS, và thẩm định các đơn xin gia hạn học tập.

### 5.1 Danh sách Đề nghị điều chỉnh liên quan: `GET /change-request`
- Khi tài khoản GVHD gọi API này, backend tự động lọc:
  - Các đề nghị do chính GVHD này tạo thay cho NCS.
  - Các đề nghị của các NCS mà GVHD đang hướng dẫn hiệu lực.
  - Các đơn gia hạn mà GVHD này nằm trong tập thể cần xác nhận ý kiến.
- Đặt tab riêng: **"Cần tôi xác nhận"** (dành cho các đơn `GIA_HAN` có trạng thái `CHO_GVHD_XAC_NHAN`).

---

### 5.2 Thẩm định Đơn gia hạn học tập: `PATCH /change-request/:id/supervisor-review`

Khi mở chi tiết đơn gia hạn ở trạng thái `CHO_GVHD_XAC_NHAN`, GVHD sẽ thấy:
1. **Thông tin chung:** Họ tên NCS, MSHV, số tháng xin gia hạn, lý do của NCS.
2. **Khung xem trước Báo cáo tiến độ (PDF):** Sử dụng Object URL tải từ `GET /documents/:fileId/download`.
3. **Danh sách ý kiến của Tập thể GVHD (`xacNhanGvhds`):**
   - Bảng hiển thị danh sách tất cả các GVHD hướng dẫn NCS này.
   - Trạng thái từng người: `Đã đồng ý (kèm nhận xét)` / `Đã từ chối (kèm lý do)` / `Chưa phản hồi`.
4. **Hộp thao tác thẩm định của GVHD:**
   - Textarea: *Ý kiến nhận xét / Đánh giá tiến độ* (tùy chọn nếu đồng ý, khuyến khích nhập nếu từ chối).
   - Nút xanh: **"Đồng ý gia hạn"** -> gửi `{ "dongY": true, "nhanXet": "..." }`.
   - Nút đỏ: **"Từ chối gia hạn"** -> gửi `{ "dongY": false, "nhanXet": "..." }`.

> [!WARNING]
> Nếu 1 GVHD bấm **Từ chối**, quy trình sẽ dừng ngay lập tức, đơn chuyển sang `TU_CHOI` và NCS sẽ nhận được thông báo nêu rõ GVHD nào đã từ chối kèm lý do. Nếu tất cả GVHD đều bấm **Đồng ý**, đơn sẽ tự động chuyển sang trạng thái `CHO_DUYET` để chuyển tiếp lên Giáo vụ.

---

### 5.3 GVHD tạo đơn đề nghị thay cho NCS
GVHD có thể tạo đơn `DOI_DE_TAI` hoặc `DOI_GVHD` thay cho NCS:
- Gọi `POST /change-request`.
- Trong payload bắt buộc truyền thêm trường `ncsId` (chọn từ danh sách NCS mà GVHD đang hướng dẫn).
- *Lưu ý:* GVHD không được tạo đơn `GIA_HAN` thay cho NCS.

---

## 6. Màn hình của Giáo vụ / Quản trị viên (Admin & Giáo vụ)

### 6.1 Quản lý Đề tài luận án (`/thesis`)

#### a. Giao đề tài cho NCS: `POST /thesis`
- **Khi nào dùng:** Sau khi Ban Giám hiệu ban hành Quyết định giao đề tài luận án cho NCS.
- **Form giao đề tài:**
  - *Chọn NCS*: Dropdown tìm theo MSHV hoặc họ tên NCS.
  - *Chọn Quyết định*: Dropdown lọc danh sách quyết định loại `GIAO_DE_TAI` đang có hiệu lực của NCS đó.
  - *Tên đề tài luận án*: Input text (tối đa 500 ký tự).
- **Payload:**
  ```json
  {
    "ncsId": "uuid-ncs",
    "quyetDinhId": "uuid-quyet-dinh",
    "tenDeTai": "Nghiên cứu kiến trúc vi dịch vụ trong quản lý đào tạo"
  }
  ```

#### b. Danh sách & Tra cứu đề tài: `GET /thesis`
- Bộ lọc: Khóa học (`khoaHocId`), Trạng thái (`HIEU_LUC`, `DA_THAY_THE`, `DA_HUY`), Giảng viên hướng dẫn (`gvhdId`).
- Hiển thị: MSHV, Tên NCS, Tên đề tài, Trạng thái, Quyết định giao (số QĐ, ngày ký), Danh sách GVHD.

#### c. Hủy đề tài do giao nhầm: `PATCH /thesis/:id/deactivate`
- Nút "Hủy phân công đề tài" chỉ hiển thị ở đề tài `HIEU_LUC`.
- Bật modal cảnh báo màu cam: *"Thao tác này chỉ dùng khi nhập nhầm thông tin đề tài. Nếu NCS đổi đề tài nghiên cứu, vui lòng hướng dẫn NCS nộp đơn đề nghị đổi đề tài."*.
- Bắt buộc nhập `lyDo`. Payload: `{ "lyDo": "Giao nhầm mã đề tài cho NCS" }`.

---

### 6.2 Quản lý Phân công Giảng viên hướng dẫn (`/gvhd/assignments`)

#### a. Phân công GVHD: `POST /gvhd/assignments`
- **Form phân công:**
  - *Chọn NCS*: Dropdown tìm theo MSHV / Họ tên.
  - *Chọn Quyết định*: Dropdown các quyết định loại `PHAN_CONG_GVHD` có hiệu lực của NCS.
  - *Chọn Giảng viên*: Dropdown GVHD (hiển thị kèm học hàm, học vị, và số lượng NCS hiện tại / định mức tối đa, ví dụ: *"PGS.TS Nguyễn Văn A (Đang HD: 2.5/5.0)"*).
  - *Vai trò hướng dẫn*: Radio button chọn `HUONG_DAN_CHINH` (trọng số 1.0) hoặc `DONG_HUONG_DAN` (trọng số 0.5).
- **Kiểm tra ở FE:**
  - Nếu NCS đã có GVHD chính, làm mờ lựa chọn `HUONG_DAN_CHINH` kèm ghi chú: *"NCS đã có GVHD chính"*.
  - Nếu giảng viên đã đủ định mức (`soNcs + trongSo > maxNcs`), làm mờ giảng viên đó.
- **Payload:**
  ```json
  {
    "ncsId": "uuid-ncs",
    "gvhdId": "uuid-gvhd",
    "vaiTro": "HUONG_DAN_CHINH",
    "quyetDinhId": "uuid-quyet-dinh"
  }
  ```

#### b. Hủy phân công do giao nhầm: `PATCH /gvhd/assignments/:id/deactivate`
- Nút "Hủy phân công" trên từng dòng phân công đang hiệu lực.
- Modal xác nhận: Nhập `lyDo` bắt buộc.
- Payload: `{ "lyDo": "Nhập sai quyết định phân công" }`.

---

### 6.3 Quản lý & Phê duyệt Đơn đề nghị điều chỉnh (`/change-request`)

Màn hình trung tâm xử lý các đề nghị của NCS toàn trường: `/admin/change-requests`.

#### a. Danh sách & Bộ lọc
- Lọc theo: Trạng thái (`CHO_DUYET`, `CHO_GVHD_XAC_NHAN`, `DA_DUYET`, `TU_CHOI`), Loại đề nghị (`DOI_DE_TAI`, `DOI_GVHD`, `GIA_HAN`).
- Phân trang: `page`, `limit`.

#### b. Xem chi tiết đơn đề nghị: `GET /change-request/:id`
Hiển thị đầy đủ:
- Thông tin hồ sơ NCS (MSHV, Họ tên, Khóa, Trạng thái hiện tại, Hạn học tập).
- Nội dung xin điều chỉnh (Tên đề tài mới / GVHD mới / Số tháng xin gia hạn).
- Lý do của người làm đơn, cờ bất khả kháng (nếu có).
- File đính kèm (cho phép mở xem PDF trực tiếp).
- Với đơn `GIA_HAN`: Hiển thị chi tiết bảng xác nhận ý kiến và nhận xét của từng GVHD trong tập thể.
- Với đơn đã duyệt: Hiển thị Quyết định được ban hành kèm số quyết định, ngày ký.

#### c. Thao tác Phê duyệt đơn: `PATCH /change-request/:id/approve`
Khi đơn ở trạng thái `CHO_DUYET`, hiển thị nút xanh **"Phê duyệt đơn"**. Bấm vào sẽ mở Dialog tùy theo loại đề nghị:

##### 1. Phê duyệt Đổi đề tài (`DOI_DE_TAI`):
- Dropdown chọn Quyết định: Danh sách quyết định loại `GIAO_DE_TAI` đang có hiệu lực của NCS này.
- Ô số nguyên *Đặt lại từ mốc tiến trình (`resetTuMoc`)*: Dropdown từ mốc 2 đến mốc 7 (hoặc chọn "Không đặt lại mốc").
- Payload:
  ```json
  {
    "quyetDinhId": "uuid-qd-giao-de-tai",
    "resetTuMoc": 3
  }
  ```

##### 2. Phê duyệt Đổi GVHD (`DOI_GVHD`):
- Dropdown chọn Quyết định: Danh sách quyết định loại `PHAN_CONG_GVHD` đang có hiệu lực của NCS.
- Payload:
  ```json
  {
    "quyetDinhId": "uuid-qd-phan-cong-gvhd"
  }
  ```

##### 3. Phê duyệt Gia hạn học tập (`GIA_HAN`):
Hỗ trợ 2 phương thức ban hành quyết định:
- **Cách 1: Nhập trực tiếp số quyết định mới (Khuyên dùng):**
  - *Số quyết định*: Input text (ví dụ `125/QĐ-ĐHAG`). FE tự động kiểm tra `onBlur` để chống trùng lặp.
  - *Ngày quyết định*: Date picker `YYYY-MM-DD` (không được trước ngày nộp đơn).
  - *File quyết định scan PDF*: Upload PDF (tùy chọn).
  - *Ghi chú quyết định*: Textarea (tùy chọn).
  - Payload:
    ```json
    {
      "soQuyetDinh": "125/QĐ-ĐHAG",
      "ngayQuyetDinh": "2026-11-15",
      "fileId": "uuid-file-pdf",
      "ghiChu": "Gia hạn đợt 1 năm học 2026"
    }
    ```
- **Cách 2: Chọn quyết định `GIA_HAN` đã tạo trước:**
  - Dropdown chọn `quyetDinhId` loại `GIA_HAN` có sẵn.
  - Payload: `{ "quyetDinhId": "uuid-qd-gia-han" }`.

#### d. Thao tác Từ chối đơn: `PATCH /change-request/:id/reject`
- Bấm nút đỏ **"Từ chối đơn"**.
- Bật Modal nhập lý do từ chối: Bắt buộc nhập `lyDoTuChoi` (từ 1 đến 2000 ký tự).
- Payload:
  ```json
  {
    "lyDoTuChoi": "Báo cáo tiến độ chưa thể hiện khối lượng nghiên cứu đạt yêu cầu để gia hạn"
  }
  ```

---

## 7. Hệ thống Thông báo (Notification)

Dưới đây là danh sách các thông báo tự động được hệ thống kích hoạt khi có sự kiện liên quan đến Đề tài, GVHD và Đơn đề nghị điều chỉnh:

| Mã loại thông báo | Người nhận | Tiêu đề hiển thị | Nội dung tóm tắt |
| :--- | :--- | :--- | :--- |
| `DE_NGHI_GIA_HAN_CAN_XAC_NHAN` | **Tập thể GVHD** | NCS ... gửi đề nghị gia hạn học tập | Đề nghị GVHD vào xem xét báo cáo tiến độ và xác nhận ý kiến |
| `DE_NGHI_GIA_HAN_GVHD_TU_CHOI` | **NCS** | Đề nghị gia hạn học tập không được GVHD chấp thuận | Nêu rõ GVHD nào đã từ chối kèm lý do |
| `DE_NGHI_GIA_HAN_GVHD_DONG_Y` | **NCS** | Tập thể GVHD đã đồng ý đề nghị gia hạn học tập | Báo cho NCS biết hồ sơ đã được chuyển lên Giáo vụ |
| `DE_NGHI_DIEU_CHINH_TU_CHOI` | **NCS & Người nộp đơn** | Đề nghị [loại đề nghị] đã bị từ chối | Thông báo quyết định từ chối của Giáo vụ kèm lý do |
| `DE_NGHI_DOI_DE_TAI_DUYET` | **NCS** | Đề nghị đổi đề tài luận án đã được phê duyệt | Thông báo tên đề tài mới, số QĐ, ngày ký, mốc được đặt lại |
| `GVHD_DE_NGHI_DOI_DE_TAI_DUYET` | **Tập thể GVHD** | Đề tài luận án của NCS ... đã được thay đổi | Thông báo cho GVHD biết tên đề tài mới của NCS |
| `DE_NGHI_DOI_GVHD_DUYET` | **NCS** | Đề nghị thay đổi GVHD đã được phê duyệt | Thông báo GVHD mới thay thế GVHD cũ theo số QĐ nào |
| `GVHD_CU_THAY_DOI_PHAN_CONG` | **GVHD cũ** | Quyết định thay đổi phân công hướng dẫn NCS ... | Thông báo GVHD thôi nhiệm vụ hướng dẫn NCS theo số QĐ |
| `GVHD_MOI_DUOC_PHAN_CONG` | **GVHD mới** | Bạn được phân công hướng dẫn NCS ... | Thông báo GVHD được giao hướng dẫn NCS theo số QĐ |
| `QUYET_DINH_DOI_TRANG_THAI` | **NCS** | Quyết định gia hạn | Thông báo quyết định gia hạn, hạn học tập mới |
| `GVHD_QUYET_DINH_DOI_TRANG_THAI` | **Tập thể GVHD** | Quyết định gia hạn của NCS ... | Báo cho tập thể GVHD biết hạn học tập mới của NCS |
| `NCS_DUOC_GIAO_DE_TAI` | **NCS** | Bạn đã được giao đề tài luận án | Thông báo tên đề tài và số quyết định giao |
| `GVHD_NCS_DUOC_GIAO_DE_TAI` | **Tập thể GVHD** | NCS ... đã được giao đề tài | Thông báo đề tài của NCS theo quyết định giao |
| `THAY_DOI_PHAN_CONG_GVHD` | **NCS & GVHD** | Thay đổi phân công giảng viên hướng dẫn | Thông báo khi Giáo vụ hủy phân công do giao nhầm |

---

## 8. Bảng API tổng hợp

### 8.1 Phân hệ Đề tài luận án (`/thesis`)

| Endpoint | Method | Role / Quyền | Request Body | Mô tả chức năng |
| :--- | :---: | :--- | :--- | :--- |
| `/thesis` | `POST` | `GIAO_VU`, `ADMIN`<br>(`assignment.create`) | `{ ncsId, quyetDinhId, tenDeTai }` | Giao đề tài luận án cho NCS |
| `/thesis` | `GET` | `GIAO_VU`, `ADMIN`<br>(`assignment.read`) | Query: `khoaHocId`, `trangThai`, `gvhdId` | Danh sách đề tài luận án |
| `/thesis/ncs/me` | `GET` | `NCS`<br>(`thesis_change.create`) | Không | NCS xem đề tài hiện tại và lịch sử đề tài của mình |
| `/thesis/admin/:ncsId` | `GET` | `GIAO_VU`, `ADMIN`<br>(`assignment.read`) | Không | Xem chi tiết đề tài của một NCS cụ thể |
| `/thesis/:id/deactivate` | `PATCH` | `GIAO_VU`, `ADMIN`<br>(`assignment.update`) | `{ lyDo }` | Hủy phân công đề tài do giao nhầm |

---

### 8.2 Phân hệ Phân công GVHD (`/gvhd`)

| Endpoint | Method | Role / Quyền | Request Body | Mô tả chức năng |
| :--- | :---: | :--- | :--- | :--- |
| `/gvhd/my-supervisors` | `GET` | `NCS` (Người dùng có hồ sơ NCS) | Không | NCS xem danh sách GVHD đang hướng dẫn mình |
| `/gvhd/assignments` | `POST` | `GIAO_VU`, `ADMIN`<br>(`assignment.create`) | `{ ncsId, gvhdId, vaiTro, quyetDinhId }` | Phân công GVHD cho NCS |
| `/gvhd/assignments` | `GET` | `GIAO_VU`, `ADMIN`<br>(`assignment.read`) | Query: `ncsId`, `gvhdId`, `trangThai` | Tra cứu danh sách phân công GVHD |
| `/gvhd/assignments/:id/deactivate` | `PATCH` | `GIAO_VU`, `ADMIN`<br>(`assignment.update`) | `{ lyDo }` | Hủy phân công GVHD do giao nhầm |

---

### 8.3 Phân hệ Đơn đề nghị điều chỉnh (`/change-request`)

| Endpoint | Method | Role / Quyền | Request Body | Mô tả chức năng |
| :--- | :---: | :--- | :--- | :--- |
| `/change-request` | `POST` | `NCS`, `GVHD`, `GIAO_VU`, `ADMIN`<br>(`changerequest.create`) | `CreateChangeRequestDto` | Nộp đơn đề nghị (Đổi đề tài / Đổi GVHD / Gia hạn) |
| `/change-request` | `GET` | `NCS`, `GVHD`, `GIAO_VU`, `ADMIN`<br>(`changerequest.read`) | Query: `trangThai`, `loai`, `ncsId`, `page`, `limit` | Xem danh sách đơn đề nghị (tự động phân quyền xem) |
| `/change-request/:id` | `GET` | `NCS`, `GVHD`, `GIAO_VU`, `ADMIN`<br>(`changerequest.read`) | Không | Xem chi tiết đơn đề nghị, file đính kèm, ý kiến GVHD |
| `/change-request/:id/cancel` | `PATCH` | `NCS`, `GVHD`<br>(`changerequest.cancel`) | Không | Người nộp hủy đơn khi đang chờ xử lý |
| `/change-request/:id/supervisor-review` | `PATCH` | `GVHD`, `GIAO_VU`, `ADMIN`<br>(`changerequest.supervisor_review`) | `{ dongY: boolean, nhanXet?: string }` | GVHD xác nhận ý kiến cho đơn xin gia hạn học tập |
| `/change-request/:id/approve` | `PATCH` | `GIAO_VU`, `ADMIN`<br>(`changerequest.review`) | `ApproveDeNghiDto` | Giáo vụ phê duyệt đơn và ban hành quyết định |
| `/change-request/:id/reject` | `PATCH` | `GIAO_VU`, `ADMIN`<br>(`changerequest.review`) | `{ lyDoTuChoi: string }` | Giáo vụ từ chối đơn đề nghị |

---

## 9. Quy tắc chung và xử lý lỗi

### 9.1 Bảng mã lỗi thường gặp

| Mã lỗi | Khi nào xảy ra | Thông điệp gợi ý cho người dùng |
| :--- | :--- | :--- |
| `400` | Thiếu file báo cáo khi xin gia hạn | *"Đơn đề nghị gia hạn bắt buộc phải có file minh chứng / báo cáo tiến độ."* |
| `400` | Số tháng gia hạn không hợp lệ | *"Số tháng gia hạn phải là số nguyên từ 1 đến 24 tháng."* |
| `400` | Xin gia hạn quá 72 tháng toàn khóa | *"Tổng thời gian đào tạo bao gồm gia hạn tuyệt đối không được vượt quá 72 tháng."* |
| `400` | Chưa hoàn thành Mốc 2 | *"NCS chưa hoàn thành Mốc 2, không đủ điều kiện xin gia hạn học tập."* |
| `400` | Nộp đơn gia hạn trễ (< 2 tháng) | *"Đã quá hạn gửi đề nghị gia hạn học tập (hạn chót là 02 tháng trước khi hết hạn đào tạo)."* |
| `400` | Trùng số quyết định khác ngày | *"Số quyết định này đã tồn tại trong hệ thống với ngày ký khác."* |
| `400` | Đổi đề tài khi đã đạt Mốc 8 | *"NCS đã đạt mốc 8, không thể đổi đề tài trừ trường hợp bất khả kháng."* |
| `400` | GVHD mới vượt định mức | *"GVHD mới đã đủ định mức hướng dẫn tối đa, vui lòng chọn giảng viên khác."* |
| `403` | NCS khác hoặc GVHD nộp đơn gia hạn | *"Chỉ Nghiên cứu sinh mới có quyền nộp đơn xin gia hạn học tập."* |
| `403` | GVHD không thuộc danh sách xác nhận | *"Bạn không thuộc danh sách GVHD cần xác nhận đề nghị này."* |
| `409` | NCS đang có đơn chờ xử lý | *"NCS đang có một đề nghị chờ duyệt, hãy chờ xử lý hoặc hủy đề nghị đó trước khi tạo đơn mới."* |
| `409` | Đơn đã được người khác xử lý | *"Đề nghị này vừa được cập nhật bởi người khác. Vui lòng tải lại trang."* |
| `409` | File đã bị dùng trùng | *"File này đã được gắn cho một đơn đề nghị đang xử lý khác."* |

### 9.2 Khuyến nghị UX/UI cho Frontend
1. **Kiểm tra trước ở Client (Pre-validation):**
   - Trước khi người dùng bấm gửi, hãy kiểm tra dung lượng file (<= 15MB), đuôi file (`.pdf`), số tháng gia hạn (1..24), các trường bắt buộc để báo lỗi tức thì tại chỗ mà không cần đợi server phản hồi.
2. **Luôn gọi Re-fetch dữ liệu sau thao tác ghi:**
   - Khi tạo đơn, hủy đơn, GVHD xác nhận, hoặc Giáo vụ duyệt/từ chối, luôn gọi lại API `GET` để cập nhật bảng dữ liệu mới nhất vì các thao tác này thay đổi trạng thái của nhiều bảng liên quan cùng lúc (trạng thái NCS, định mức GVHD, tiến trình mốc).
3. **Phân quyền hiển thị nút bấm:**
   - Nút "Hủy đơn" chỉ hiển thị khi `trangThai` là `CHO_GVHD_XAC_NHAN` hoặc `CHO_DUYET` và người đăng nhập là người tạo đơn.
   - Nút "Thẩm định gia hạn" chỉ hiển thị cho GVHD khi đơn có `trangThai === 'CHO_GVHD_XAC_NHAN'` và GVHD đó chưa có xác nhận (`dongY === null`).
   - Nút "Duyệt đơn" / "Từ chối đơn" chỉ hiển thị cho Giáo vụ khi đơn ở trạng thái `CHO_DUYET`.

