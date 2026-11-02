# Luồng 9 mốc: tài liệu API cho Frontend

Hệ thống quản lý đào tạo sau đại học (PostGraduate Academic System). Tài liệu này mô tả luồng theo dõi **9 mốc tiến độ** của nghiên cứu sinh (NCS) để FE dựng giao diện dựa trên các API đã có ở API Gateway.

## Mục lục

1. [Khái niệm nền](#1-khái-niệm-nền)
2. [Bản đồ ID](#2-bản-đồ-id)
3. [Quy tắc về file: upload trước, lấy fileId](#3-quy-tắc-về-file-upload-trước-lấy-fileid)
4. [Màn hình của NCS](#4-màn-hình-của-ncs)
5. [Màn hình của Giáo vụ](#5-màn-hình-của-giáo-vụ)
6. [Hệ thống Thông báo (Notification)](#6-hệ-thống-thông-báo-notification)
7. [Màn hình Xét tốt nghiệp (Graduation Assessment)](#7-màn-hình-xét-tốt-nghiệp-graduation-assessment)
8. [Bảng API tổng hợp](#8-bảng-api-tổng-hợp)
9. [Quy tắc chung và xử lý lỗi](#9-quy-tắc-chung-và-xử-lý-lỗi)
10. [Ngoài phạm vi luồng này](#10-ngoài-phạm-vi-luồng-này)

---

## 1. Khái niệm nền

- Mỗi NCS có **9 mốc**, làm **tuần tự**, không nhảy cóc. Khi tạo hồ sơ NCS:
  - Mốc 1 (nhập học) tự động `PASSED`, không có minh chứng.
  - Mốc 2 ở trạng thái `UNLOCKED` (đến lượt nộp).
  - Mốc 3 đến 9 ở trạng thái `LOCKED`.
- Mỗi mốc NCS nộp **1 file PDF** minh chứng. Mốc 8 là **1 file PDF gộp tất cả bài báo**, nên form nộp của mốc 8 cần có dòng gợi ý này.
- **Mốc 2, 4, 5** (`moc.yeuCauDiem = true`) cần thêm **phiếu nhận xét**: tối thiểu **3 phiếu**, điểm trung bình **từ 7 trở lên** (thang 10). Các mốc còn lại chỉ cần Giáo vụ duyệt.
- Khi Giáo vụ duyệt, phải chọn một **quyết định** (loại `CAN_CU_DUYET_MOC`) làm căn cứ pháp lý.
- Một quyết định pháp lý có thể áp dụng cho **nhiều NCS**. Hệ thống lưu **mỗi NCS một dòng quyết định**, các dòng dùng chung số quyết định, ngày quyết định và file PDF. Với FE, mỗi dòng có `quyetDinhId` riêng, và duyệt mốc của NCS nào thì dùng dòng của đúng NCS đó (xem mục 5.5).
- Bị từ chối thì NCS **nộp lại**. Mỗi lần nộp là một dòng trong `minhChungs` (`lanNop` = 1, 2, 3...). Các lần cũ được giữ lại làm lịch sử.

### 1.1 Trạng thái của một mốc (`tienTrinh.trangThai`)

```
LOCKED ──(mốc trước được duyệt)──▶ UNLOCKED ──(NCS nộp)──▶ PENDING_REVIEW ──(Giáo vụ duyệt)──▶ PASSED
                                                                  │
                                         REJECTED ◀──(Giáo vụ từ chối)
                                             │
                                             └──(NCS nộp lại)──▶ PENDING_REVIEW
```

| Trạng thái | Nhãn gợi ý | NCS thấy gì | Nút |
| :---- | :---- | :---- | :---- |
| `LOCKED` | Chưa mở | Làm mờ, ghi "Hoàn thành mốc trước để mở" | Không có |
| `UNLOCKED` | Đến lượt nộp | Form nộp | **Nộp minh chứng** |
| `PENDING_REVIEW` | Chờ duyệt | File đã nộp, ngày nộp | Không có |
| `REJECTED` | Cần nộp lại | `lyDoTuChoi` của lần nộp gần nhất | **Nộp lại** |
| `PASSED` | Đã đạt | Ngày đạt, điểm trung bình (nếu có) | Không có |

Cờ `coTheNop` do server tính sẵn (`true` khi mốc là `UNLOCKED` hoặc `REJECTED`). FE dùng cờ này để bật nút nộp, không tự suy từ trạng thái.

### 1.2 Trạng thái của một lần nộp (`minhChungs[].trangThai`)

`PENDING_REVIEW` (đang chờ duyệt), `PASSED` (đã được duyệt), `REJECTED` (bị từ chối, kèm `lyDoTuChoi`).

---

## 2. Bản đồ ID

Có nhiều loại ID khác nhau xuất hiện trong luồng này, đây là chỗ dễ nhầm nhất:

| Tên | Lấy ở đâu | Dùng cho |
| :---- | :---- | :---- |
| `tienTrinhId` | `id` của dòng trong `GET /progress/pending`, hoặc `tienTrinhs[].id` | Duyệt, từ chối mốc |
| `minhChungId` | `minhChungMoiNhat.id` (pending) hoặc `minhChungs[].id` | Nhập hoặc xem phiếu nhận xét |
| `fileId` | `minhChungs[].fileId`, `quyetDinh.fileId` | Xem PDF qua `GET /documents/:id/download` |
| `thuTu` | `moc.thuTu` (số từ 2 đến 9) | Đường dẫn khi nộp minh chứng |
| `ncsId` | `ncs.id` | Xem tiến trình của một NCS, chọn NCS khi tạo quyết định (`ncsIds`) |
| `quyetDinhId` | `id` trong `GET /decisions` | Duyệt mốc, vô hiệu hóa quyết định |
| `soQuyetDinh` | Số ghi trên quyết định (ví dụ `123/QĐ-ĐHAG`) | Nhóm các NCS cùng một quyết định, lọc `GET /decisions?soQuyetDinh=` |

> `quyetDinhId` là id của **một dòng** (một NCS). Cùng một số quyết định áp dụng cho 5 NCS thì có 5 `quyetDinhId` khác nhau nhưng chung `soQuyetDinh`.

---

## 3. Quy tắc về file: upload trước, lấy `fileId`

**Nguyên tắc chung:** các API nghiệp vụ (nộp minh chứng, tạo quyết định) chỉ nhận JSON, **không nhận file trực tiếp**. Mọi file đều phải đi qua document-service trước, lấy `fileId`, rồi mới đưa `fileId` vào API nghiệp vụ.

```
[Chọn file PDF]
      │
      ▼
POST /documents/upload  (multipart/form-data)
      │   → response có `id`  ← đây là fileId
      ▼
Gọi API nghiệp vụ, đưa fileId vào body JSON
```

### 3.1 Bước 1: Upload

`POST /documents/upload`, kiểu `multipart/form-data`:

| Trường | Bắt buộc | Ghi chú |
| :---- | :---- | :---- |
| `file` | Có | Chỉ nhận **PDF** (đuôi `.pdf` và đúng loại PDF), tối đa **15 MB** |
| `documentType` | Có | `MINH_CHUNG_MOC`, `QUYET_DINH` hoặc `KHAC`; phải đúng loại theo bảng 3.2 |
| `ncsId` | Không | Dành cho Giáo vụ khi upload file gắn với một NCS cụ thể. NCS upload thì server tự lấy từ token |

Response trả metadata của file, lấy trường `id` làm `fileId`. FE nên kiểm tra phía client (đuôi `.pdf`, dung lượng ≤ 15 MB) trước khi gửi để báo lỗi sớm.

### 3.2 Bước 2: Dùng `fileId` ở đâu

| API | `fileId` | `documentType` phải là | Ai upload |
| :---- | :---- | :---- | :---- |
| `POST /progress/milestones/:thuTu/submit` (nộp minh chứng) | **Bắt buộc** | `MINH_CHUNG_MOC` | NCS |
| `POST /decisions` (tạo quyết định) | Không bắt buộc (nên đính kèm bản scan) | `QUYET_DINH` | Giáo vụ |

Server kiểm tra lại `fileId` ở bước 2, nên không thể gửi `fileId` bừa:

| API | Lỗi | Nghĩa là |
| :---- | :---- | :---- |
| Nộp minh chứng | 404 | File không tồn tại |
| Nộp minh chứng | 403 | File không thuộc NCS đang đăng nhập |
| Nộp minh chứng | 400 | File không phải loại `MINH_CHUNG_MOC` |
| Nộp minh chứng | 409 | File đã dùng cho một lần nộp khác |
| Tạo quyết định | 404 | File không tồn tại |
| Tạo quyết định | 400 | File không phải loại `QUYET_DINH` |

> Khi tạo một quyết định cho nhiều NCS, chỉ cần **upload 1 file** và dùng chung `fileId` đó cho tất cả các dòng. Quy tắc "file chỉ dùng cho một lần" ở trên chỉ áp dụng cho minh chứng mốc, không áp dụng cho quyết định.

### 3.3 Gợi ý xử lý trong UI

- **Thứ tự thao tác trong một dialog:** NCS chọn file, bấm "Gửi", FE upload rồi nộp mốc liền sau đó. Làm vậy khi người dùng hủy dialog thì không để lại file thừa trên server.
- **Giữ `fileId` trong state** sau khi upload thành công. Nếu bước nộp mốc lỗi (mạng, 400, 409 "mốc vừa thay đổi"), cho bấm "Thử lại" bằng chính `fileId` đó, không bắt chọn và upload lại.
- **Ngoại lệ:** lỗi 409 "file đã dùng cho lần nộp khác" thì phải upload file mới. Nộp lại sau khi bị từ chối cũng vậy: luôn dùng một file mới, không dùng lại `fileId` của lần trước.
- **Hiện tiến độ upload** (thanh phần trăm hoặc spinner) vì file lớn có thể mất vài giây.
- **Xem lại file:** `fileId` lấy từ dữ liệu (`minhChungs[].fileId`, `minhChungMoiNhat.fileId`, `quyetDinh.fileId`), rồi mở bằng `GET /documents/:fileId/download` theo cách ở mục 3.4.
- **Xóa file:** không nên hiện nút xóa cho file đã gắn vào lần nộp hoặc quyết định. `DELETE /documents/:id` chỉ dành cho Giáo vụ và Admin, và chỉ nên dùng cho file upload nhầm chưa gắn vào đâu.

### 3.4 Xem hoặc tải file PDF

`GET /documents/:fileId/download` yêu cầu header `Authorization: Bearer <token>`, nên **không dùng được** thẻ `<a href>` hay `<iframe src>` trỏ thẳng vào URL. FE phải:

1. `fetch` kèm header `Authorization`.
2. Đọc `response.blob()`.
3. Tạo `URL.createObjectURL(blob)` để mở tab mới hoặc nhúng vào khung xem PDF.
4. Gọi `URL.revokeObjectURL(...)` khi đóng để giải phóng bộ nhớ.

Server trả file ở chế độ `inline` (trình duyệt xem trực tiếp được). `GET /documents/:id` trả metadata (tên file, kích thước, loại...) nếu cần hiển thị.

---

## 4. Màn hình của NCS

### 4.1 Tiến trình của tôi: `GET /progress/me`

Dựng 9 thẻ hoặc một timeline từ `tienTrinhs` (server đã sắp theo `moc.thuTu`).

```json
{
  "ncs": { "id": "…", "mshv": "…", "hoTen": "…", "lop": "…" },
  "tienTrinhs": [
    {
      "id": "…tienTrinhId",
      "trangThai": "REJECTED",
      "openedAt": "…", "submittedAt": "…", "passedAt": null,
      "moc": { "thuTu": 3, "tenMoc": "…", "moTa": "…", "yeuCauDiem": false },
      "coTheNop": true,
      "minhChungs": [
        {
          "id": "…", "lanNop": 1, "fileId": "…", "ghiChuNcs": "…",
          "trangThai": "REJECTED", "diemTrungBinh": null,
          "lyDoTuChoi": "Thiếu dấu xác nhận", "ngayNop": "…", "ngayDuyet": "…"
        }
      ]
    }
  ]
}
```

Lưu ý:

- `diemTrungBinh` có thể về dạng chuỗi (ví dụ `"7.33"`), FE cần `Number()` trước khi hiển thị hoặc so sánh.
- Mốc 1 có `minhChungs: []`, hiển thị "Đã nhập học".
- Với mốc `REJECTED`, hiển thị `lyDoTuChoi` của lần nộp có `lanNop` lớn nhất ở vị trí nổi bật.

### 4.2 Nộp minh chứng

Điều kiện: mốc có `coTheNop = true`.

1. **Upload file:** `POST /documents/upload` với `documentType = MINH_CHUNG_MOC` (xem mục 3). Lấy `id` làm `fileId`.
2. **Nộp mốc:** `POST /progress/milestones/{thuTu}/submit`

```json
{ "fileId": "<id vừa upload>", "ghiChu": "tùy chọn, tối đa 500 ký tự" }
```

`thuTu` là số từ 2 đến 9 (mốc 1 tự động đạt nên không nộp). Response là bản ghi lần nộp mới; sau đó gọi lại `GET /progress/me` để vẽ lại giao diện.

Lỗi thường gặp:

| Mã | Khi nào | Gợi ý UI |
| :---- | :---- | :---- |
| 400 | Mốc chưa mở, đang chờ duyệt hoặc đã đạt; `thuTu` ngoài 2 đến 9; file không phải minh chứng | Hiện `message`, tải lại tiến trình |
| 403 | File không thuộc NCS này, hoặc hồ sơ không ở trạng thái đang học (ví dụ NCS đang bảo lưu, đã ngừng học) | Hiện `message` |
| 404 | Chưa có hồ sơ NCS, hoặc file không tồn tại | Hiện `message` |
| 409 | File đã dùng cho lần nộp khác, hoặc mốc vừa thay đổi | "Hãy upload file mới" hoặc "Tải lại trang" |

---

## 5. Màn hình của Giáo vụ

### 5.1 Hàng chờ duyệt: `GET /progress/pending`

Danh sách các mốc đang `PENDING_REVIEW`, sắp **nộp trước xếp trước**.

```json
[
  {
    "id": "…tienTrinhId",
    "submittedAt": "…",
    "ncs": { "id": "…", "mshv": "…", "hoTen": "…", "lop": "…" },
    "moc": { "thuTu": 2, "tenMoc": "…", "yeuCauDiem": true },
    "minhChungMoiNhat": {
      "id": "…minhChungId", "lanNop": 1, "fileId": "…",
      "ghiChuNcs": "…", "ngayNop": "…",
      "_count": { "phieuNhanXets": 2 }
    }
  }
]
```

Cột gợi ý: MSHV, họ tên, lớp, mốc, lần nộp, ngày nộp. Nếu `moc.yeuCauDiem` thì thêm cột "Phiếu: 2/3" (đọc từ `minhChungMoiNhat._count.phieuNhanXets`, tối thiểu 3). Bấm vào dòng thì mở màn chi tiết duyệt.

### 5.2 Chi tiết duyệt (một màn, nhiều khối)

**Khối lịch sử**

`GET /progress/ncs/{ncsId}` trả cùng dạng dữ liệu với `/progress/me`. Cho Giáo vụ thấy các mốc trước và các lần nộp trước của NCS, kèm lý do từ chối.

**Khối minh chứng**

Nút "Xem PDF" dùng `fileId` của `minhChungMoiNhat` (cách mở ở mục 3.4), kèm hiển thị `ghiChuNcs`.

**Khối phiếu nhận xét** (chỉ hiện khi `moc.yeuCauDiem = true`), dùng `minhChungId`:

Xem phiếu: `GET /progress/evidences/{minhChungId}/evaluations`

```json
{
  "phieus": [
    {
      "id": "…", "tenNguoiCham": "…", "donViNguoiCham": "…",
      "diem": "8.5", "nhanXet": "…", "nhapBoiId": "…", "createdAt": "…"
    }
  ],
  "tongHop": { "soPhieu": 2, "soPhieuToiThieu": 3, "diemTrungBinh": 7.5, "duPhieu": false }
}
```

Hiển thị "2/3 phiếu · Điểm TB 7.5". `duPhieu` dùng để tô xanh hoặc cảnh báo.

Nhập phiếu: `POST /progress/evidences/{minhChungId}/evaluations`

```json
{
  "tenNguoiCham": "PGS.TS Nguyễn Văn A",
  "donViNguoiCham": "Đại học Cần Thơ",
  "diem": 8.5,
  "nhanXet": "tùy chọn",
  "xacNhanTrung": false
}
```

| Trường | Bắt buộc | Quy tắc |
| :---- | :---- | :---- |
| `tenNguoiCham` | Có | 1 đến 150 ký tự |
| `donViNguoiCham` | Không | Tối đa 255 ký tự |
| `diem` | Có | Từ 0 đến 10, tối đa 1 chữ số thập phân |
| `nhanXet` | Không | Tối đa 2000 ký tự |
| `xacNhanTrung` | Không | Chỉ gửi `true` sau khi Giáo vụ xác nhận (xem bên dưới) |

Response: `{ phieu, tongHop }`. Dùng `tongHop` để cập nhật ngay "x/3 phiếu".

Điểm cần lưu ý:

- Người chấm trong hay ngoài trường **đều do Giáo vụ nhập** qua form này. Khác nhau ở `donViNguoiCham`.
- **Phiếu lưu xong không sửa, không xóa được**, nên cần bước "Xác nhận thông tin trước khi lưu" ở FE.
- Nếu trùng tên và đơn vị với một phiếu đã có, server trả **409 với `code: "PHIEU_TRUNG_NGUOI_CHAM"`**. FE hiện hộp thoại "Đã có phiếu cùng tên và đơn vị, đây có phải người chấm khác trùng tên không?". Giáo vụ đồng ý thì gửi lại đúng body đó kèm `"xacNhanTrung": true`.
- Chỉ nhập được khi lần nộp còn `PENDING_REVIEW` và mốc có `yeuCauDiem = true`. Ngoài ra trả 409 hoặc 400.

**Khối chọn quyết định (căn cứ pháp lý)**

Gọi `GET /decisions?loai=CAN_CU_DUYET_MOC&trangThai=HIEU_LUC`, rồi **lọc tiếp ở FE**: giữ dòng có `ncsId === ncs.id` (quyết định của chính NCS này, kể cả khi quyết định được ký chung cho nhiều NCS) hoặc `ncsId === null` (quyết định chung không gắn NCS nào).

> Không thêm `?ncsId=` vào URL. Server sẽ lọc đúng theo `ncsId` nên loại luôn các quyết định chung (`ncsId` rỗng), trong khi các quyết định chung vẫn dùng được để duyệt.

Hiển thị `soQuyetDinh`, `ngayQuyetDinh`, và nút xem PDF nếu có `fileId`.

### 5.3 Duyệt mốc: `POST /progress/reviews/{tienTrinhId}/approve`

```json
{ "quyetDinhId": "<id quyết định đã chọn>" }
```

Thành công trả:

```json
{ "tienTrinhId": "…", "trangThai": "PASSED", "diemTrungBinh": 7.33, "mocKeTiep": 3 }
```

`mocKeTiep` là số thứ tự mốc vừa được mở khóa, và là `null` nếu vừa duyệt xong mốc 9.

Với mốc yêu cầu điểm (2, 4, 5):

- Khi `tongHop.duPhieu = false`: **vô hiệu hóa nút Duyệt**, ghi "Cần thêm x phiếu".
- Khi `tongHop.diemTrungBinh < 7`: server từ chối duyệt (400). FE nên cảnh báo trước, chỉ mở nút **Từ chối**.

Điều kiện server kiểm tra thêm: quyết định đúng loại `CAN_CU_DUYET_MOC`, còn hiệu lực, và (nếu quyết định gắn với một NCS) đúng NCS này. Sai thì 400.

### 5.4 Từ chối mốc: `POST /progress/reviews/{tienTrinhId}/reject`

```json
{ "lyDo": "Thiếu dấu xác nhận của khoa" }
```

Bắt buộc có lý do (1 đến 1000 ký tự). NCS sẽ thấy lý do này ở `lyDoTuChoi`. Response: `{ "tienTrinhId": "…", "trangThai": "REJECTED" }`.

Sau khi duyệt hoặc từ chối, quay về hàng chờ và gọi lại `GET /progress/pending`. Nếu gặp **409** ("mốc vừa được xử lý") thì đã có người khác xử lý trước, hãy tải lại danh sách.

### 5.5 Quản lý quyết định

#### a. Các API

| Việc | API |
| :---- | :---- |
| Tạo (một hoặc nhiều NCS) | (Không bắt buộc) upload PDF `documentType = QUYET_DINH` để lấy `fileId`, rồi `POST /decisions` |
| Danh sách | `GET /decisions?ncsId=&loai=&trangThai=&soQuyetDinh=` (cả 4 tham số đều tùy chọn) |
| Chi tiết | `GET /decisions/:id` |
| Vô hiệu hóa | `PATCH /decisions/:id/deactivate` với body `{ "lyDo": "…" }` (một số loại có hoàn tác trạng thái NCS, xem mục h) |

#### b. Cách lưu: mỗi NCS một dòng

Một quyết định áp dụng cho nhiều NCS được lưu thành **nhiều dòng, mỗi NCS một dòng**, dùng chung `loai`, `soQuyetDinh`, `ngayQuyetDinh`, `fileId`, `ghiChu`. Nhờ vậy:

- Quyết định của một NCS: `GET /decisions?ncsId=<id>`.
- Các NCS thuộc cùng một quyết định: `GET /decisions?soQuyetDinh=<số>`.
- Duyệt mốc, vô hiệu hóa quyết định đều làm việc trên **một dòng** (một NCS).

Quyết định không gắn NCS nào (ví dụ `THANH_LAP_TIEU_BAN`) vẫn tạo được: bỏ trống `ncsIds`, hệ thống lưu 1 dòng có `ncsId = null`.

#### c. Body tạo quyết định: `POST /decisions`

```json
{
  "loai": "BAO_LUU",
  "soQuyetDinh": "123/QĐ-ĐHAG",
  "ngayQuyetDinh": "2026-10-01",
  "ncsIds": ["<ncsId 1>", "<ncsId 2>"],
  "fileId": "tùy chọn: id file đã upload với documentType = QUYET_DINH",
  "ghiChu": "tùy chọn (với quyết định đổi trạng thái, đây cũng là lý do hiển thị cho NCS)",
  "hanMoi": "2027-06-30"
}
```

| Trường | Bắt buộc | Quy tắc |
| :---- | :---- | :---- |
| `loai` | Có | `GIAO_DE_TAI`, `PHAN_CONG_GVHD`, `THANH_LAP_TIEU_BAN`, `CAN_CU_DUYET_MOC`, `CONG_NHAN_TOT_NGHIEP`, `GIA_HAN`, `BAO_LUU`, `HOC_TIEP`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `KHAC` |
| `soQuyetDinh` | Có | Tối đa 50 ký tự |
| `ngayQuyetDinh` | Có | Dạng `YYYY-MM-DD`, phải là ngày có thật (ví dụ `2026-02-31` bị từ chối) |
| `ncsIds` | Tùy loại | **Bắt buộc, ít nhất 1 NCS** với `BAO_LUU`, `HOC_TIEP`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `GIA_HAN`. Các loại khác có thể bỏ trống (quyết định chung). NCS bị chọn trùng sẽ được gộp lại |
| `fileId` | Không | Xem mục 3.2 |
| `ghiChu` | Không | Văn bản tự do |
| `hanMoi` | Chỉ với `GIA_HAN` | Dạng `YYYY-MM-DD`, áp dụng chung cho tất cả NCS trong danh sách. Với **từng** NCS, `hanMoi` phải sau hạn hiện tại (hạn gia hạn gần nhất, chưa từng gia hạn thì là hạn chính quy) và không vượt hạn buộc thôi học (72 tháng). Các loại khác bỏ qua trường này |

Response:

```json
{
  "quyetDinhs": [ { "id": "…", "ncsId": "…", "loai": "BAO_LUU", "soQuyetDinh": "123/QĐ-ĐHAG" } ],
  "canhBao": ["Chưa khóa được tài khoản của NCS DPM…, cần khóa thủ công"]
}
```

`quyetDinhs` có đúng một phần tử cho mỗi NCS được chọn. `canhBao` là mảng rỗng khi mọi việc suôn sẻ; FE phải hiển thị nếu có phần tử.

#### d. Quy tắc trùng số quyết định

- Cùng `loai` và cùng `soQuyetDinh` thì **được thêm NCS khác vào** (tạo lần sau cho NCS mới), nhưng phải **cùng `ngayQuyetDinh`**. Khác ngày trả 409.
- Một NCS **không** được gắn hai lần vào cùng (`loai`, `soQuyetDinh`). Trùng thì 409.

#### e. Tác dụng phụ lên hồ sơ NCS

Một số loại quyết định **tự đổi trạng thái học tập** của NCS khi tạo thành công. Quyết định và việc đổi trạng thái được lưu trong **một giao dịch**, đồng thời ghi nhật ký (audit) cho từng NCS.

| Loại | Trạng thái NCS sau khi tạo | NCS phải đang ở trạng thái | Tác động khác |
| :---- | :---- | :---- | :---- |
| `BAO_LUU` | `BAO_LUU` | `DANG_HOC`, `GIA_HAN` | Khóa tài khoản đăng nhập. Các hạn giữ nguyên (thời gian bảo lưu vẫn tính vào 72 tháng) |
| `NGUNG_HOC` | `NGUNG_HOC` | `DANG_HOC`, `GIA_HAN`, `BAO_LUU` | Khóa tài khoản đăng nhập |
| `BUOC_THOI_HOC` | `BUOC_THOI_HOC` | `DANG_HOC`, `GIA_HAN`, `BAO_LUU` | Khóa tài khoản đăng nhập |
| `GIA_HAN` | `GIA_HAN` | `DANG_HOC`, `GIA_HAN` | Cập nhật hạn học tập mới = `hanMoi`. Hạn mới phải sau hạn hiện tại và không vượt hạn buộc thôi học (72 tháng) |
| `HOC_TIEP` | `GIA_HAN` nếu NCS đã từng được gia hạn, ngược lại `DANG_HOC` | `BAO_LUU` (chỉ trạng thái này) | **Mở khóa** tài khoản đăng nhập. Các hạn giữ nguyên (thời gian bảo lưu vẫn tính vào 72 tháng) |
| Các loại còn lại | Không đổi | Không giới hạn | Chỉ lưu quyết định |

Ngày hiệu lực của việc đổi trạng thái lấy theo `ngayQuyetDinh`, lý do lấy theo `ghiChu`.

Các chuyển trạng thái hợp lệ (dùng để FE ẩn hoặc làm mờ loại quyết định không phù hợp với NCS đã chọn):

```
DANG_HOC / GIA_HAN ──BAO_LUU──▶ BAO_LUU ──HOC_TIEP──▶ DANG_HOC (hoặc GIA_HAN nếu đã từng gia hạn)
DANG_HOC / GIA_HAN ──GIA_HAN──▶ GIA_HAN
DANG_HOC / GIA_HAN / BAO_LUU ──NGUNG_HOC────────▶ NGUNG_HOC       (kết thúc)
DANG_HOC / GIA_HAN / BAO_LUU ──BUOC_THOI_HOC────▶ BUOC_THOI_HOC   (kết thúc)
```

`NGUNG_HOC` và `BUOC_THOI_HOC` là trạng thái kết thúc: NCS ở hai trạng thái này không nhận thêm quyết định đổi trạng thái nào, và không có đường quay lại.

Quy tắc **tất cả hoặc không có gì**: chỉ cần một NCS không hợp lệ (sai trạng thái, hạn mới không đúng, không tồn tại) thì **cả lô không được lưu**, và `message` nêu rõ MSHV hoặc id của NCS gây lỗi.

Việc khóa hoặc mở khóa tài khoản chạy **sau khi** dữ liệu đã lưu. Nếu khóa hoặc mở khóa lỗi ở một NCS thì quyết định và trạng thái vẫn được lưu, và lỗi nằm trong `canhBao` để Giáo vụ xử lý thủ công.

#### f. Lỗi của `POST /decisions`

| Mã | Khi nào |
| :---- | :---- |
| 400 | Ngày không hợp lệ; thiếu `ncsIds` với loại bắt buộc; thiếu `hanMoi` khi `GIA_HAN`, hoặc `hanMoi` không sau hạn hiện tại / vượt hạn buộc thôi học của một NCS; NCS đang ở trạng thái không được nhận loại quyết định này (ví dụ `HOC_TIEP` cho NCS không phải `BAO_LUU`); `fileId` không phải loại `QUYET_DINH` |
| 404 | Có NCS không tồn tại (message liệt kê id), hoặc file không tồn tại |
| 409 | Số quyết định đã tồn tại với ngày khác, hoặc NCS đã gắn với số quyết định này |

#### g. Gợi ý UI chi tiết và luồng tạo quyết định

##### 1. Khung form chung

```
┌─ Tạo quyết định ────────────────────────────────┐
│ Loại quyết định:  [ Bảo lưu            ▼ ]       │  ← chọn trước, các khối dưới đổi theo
│                                                  │
│ Số quyết định:    [ 123/QĐ-ĐHAG ]                │
│ Ngày quyết định:  [ 2026-10-01 ]                 │
│ File PDF:         [Chọn file]  (không bắt buộc)  │
│ Ghi chú / Lý do:  [ ........................ ]   │
│                                                  │
│ ── KHỐI RIÊNG THEO LOẠI (xem mục 2) ──           │
│  chọn NCS / hạn mới / cảnh báo...                │
│                                                  │
│                      [Hủy]  [Tạo quyết định]     │
└──────────────────────────────────────────────────┘
```

Hai chỗ nên làm cho tiện:
- **Kiểm tra trùng số quyết định khi nhập xong (onBlur `soQuyetDinh`):** gọi `GET /decisions?soQuyetDinh=...` rồi lọc theo `loai` ở FE. Nếu số này đã tồn tại, tự điền `ngayQuyetDinh` cũ, khóa ô ngày lại và hiện dòng: *"Số này đã áp dụng cho N NCS, bạn đang thêm NCS vào quyết định này"*. Cách này tránh triệt để lỗi 409 "khác ngày".
- **Đổi nhãn ô `ghiChu` linh hoạt:** Với loại quyết định đổi trạng thái, đổi nhãn thành **"Lý do (NCS sẽ thấy)"** vì nội dung này hiển thị trực tiếp cho NCS khi xem hồ sơ/thông báo. Với các loại khác, giữ nhãn thông thường "Ghi chú".

##### 2. Khối riêng theo 4 nhóm quyết định

Chia 11 loại quyết định thành 4 nhóm nghiệp vụ:

| Nhóm | Loại quyết định | `ncsIds` | Khối giao diện riêng |
| :---- | :---- | :---- | :---- |
| **A. Đổi trạng thái, khóa tài khoản** | `BAO_LUU`, `NGUNG_HOC`, `BUOC_THOI_HOC` | Bắt buộc | Chọn NCS có lọc theo trạng thái + Modal cảnh báo xác nhận |
| **B. Quay lại học** | `HOC_TIEP` | Bắt buộc | Chỉ liệt kê NCS đang `BAO_LUU` + Modal xác nhận mở khóa |
| **C. Gia hạn đào tạo** | `GIA_HAN` | Bắt buộc | Chọn NCS + Ô "Hạn mới" chung + Bảng so sánh hạn từng NCS |
| **D. Chỉ lưu quyết định** | `GIAO_DE_TAI`, `PHAN_CONG_GVHD`, `THANH_LAP_TIEU_BAN`, `CAN_CU_DUYET_MOC`, `CONG_NHAN_TOT_NGHIEP`, `KHAC` | Tùy chọn | Công tắc "Áp dụng cho NCS cụ thể / Chung" |

**Nguồn dữ liệu danh sách NCS (`GET /ncs`):**
FE gọi `GET /ncs` để lấy toàn bộ danh sách NCS cho ô Multi-Select. API trả về các trường cần thiết:
- `id`, `mshv`, `hoTen`, `lop`, `trangThai`
- `hanChinhQuy`, `hanGiaHan`, `hanBuocThoiHoc`
- **Hạn hiện tại** = `hanGiaHan ?? hanChinhQuy`
- **Hạn tối đa 72 tháng** = `hanBuocThoiHoc` (server đã tính sẵn từ ngày nhập học)

**Chi tiết xử lý từng nhóm:**

- **Nhóm A (`BAO_LUU`, `NGUNG_HOC`, `BUOC_THOI_HOC`):**
  - Multi-select NCS có tìm theo MSHV hoặc họ tên, hiển thị "Đã chọn N NCS".
  - Theo sơ đồ chuyển trạng thái: `BAO_LUU` chỉ áp dụng cho NCS đang `DANG_HOC` hoặc `GIA_HAN`. `NGUNG_HOC` và `BUOC_THOI_HOC` áp dụng cho cả `DANG_HOC`, `GIA_HAN`, `BAO_LUU`.
  - Các NCS không đúng trạng thái hợp lệ thì **làm mờ (disabled)** kèm tooltip *"Đang ở trạng thái X"* để Giáo vụ hiểu lý do.
  - Ô "Lý do (NCS sẽ thấy)" nên bắt buộc nhập ở client.
  - Hộp thoại xác nhận trước khi gửi:
    * `BAO_LUU`: Hộp cảnh báo màu vàng/cam ghi rõ: *"Quyết định này sẽ chuyển N NCS sang trạng thái Bảo lưu và khóa tài khoản đăng nhập."*
    * `NGUNG_HOC`, `BUOC_THOI_HOC`: Đây là trạng thái kết thúc không có đường hoàn tác. Hộp xác nhận dùng **màu đỏ**, thêm dòng chữ *"Thao tác này là dứt điểm, không thể khôi phục"* và bắt người dùng tick chọn *"Tôi đã kiểm tra kỹ danh sách NCS"* hoặc gõ lại số quyết định để mở nút bấm gửi.

- **Nhóm B (`HOC_TIEP`):**
  - Multi-select chỉ liệt kê các NCS đang ở trạng thái `BAO_LUU`. Nếu không có ai thì hiển thị *"Hiện không có NCS nào đang bảo lưu"*.
  - Hộp xác nhận ghi rõ: *"N NCS sẽ trở lại học tập và được mở khóa tài khoản đăng nhập."*
  - Hiện kèm dòng nhắc: *"Thời hạn học tập của NCS được giữ nguyên (không tự động gia hạn thêm). Nếu cần gia hạn thêm thời gian, vui lòng lập quyết định Gia hạn riêng."*

- **Nhóm C (`GIA_HAN`):**
  - Chỉ cho phép chọn NCS đang `DANG_HOC` hoặc `GIA_HAN`.
  - Ô "Hạn mới" (date picker `YYYY-MM-DD`) áp dụng chung cho cả lô được chọn.
  - Dưới ô chọn NCS, hiển thị ngay **Bảng kiểm tra hạn:**

| MSHV | Họ tên | Hạn hiện tại | Hạn tối đa (72 tháng) | Hạn mới | Đánh giá |
| :---- | :---- | :---- | :---- | :---- | :---- |
| DPM2001 | Nguyễn Văn A | 2026-10-31 | 2029-09-30 | 2027-04-30 | <span style="color:green">✔ Hợp lệ</span> |
| DPM2002 | Trần Thị B | 2027-06-30 | 2029-09-30 | 2027-04-30 | <span style="color:red">✘ Trước hạn hiện tại</span> |

  - FE kiểm tra client-side cho từng NCS: `hanMoi > hanHienTai` VÀ `hanMoi <= hanBuocThoiHoc`. Nếu có bất kỳ dòng nào vi phạm, tô đỏ và vô hiệu hóa nút "Tạo quyết định" (vì server chạy transaction: 1 người sai sẽ từ chối toàn bộ).
  - Hộp xác nhận ghi: *"Gia hạn học tập đến ngày dd/mm/yyyy cho N NCS."*

- **Nhóm D (Chỉ lưu quyết định):**
  - Trên đầu khối có công tắc Toggle: **"Áp dụng cho: ◉ NCS cụ thể ○ Chung (không gắn NCS)"**.
  - Nếu chọn "NCS cụ thể": hiện Multi-select NCS (chọn bao nhiêu tùy ý).
  - Nếu chọn "Chung": ẩn Multi-select, gửi `ncsIds: []`.
  - Mặc định:
    * `GIAO_DE_TAI`, `PHAN_CONG_GVHD`: mặc định là **NCS cụ thể**.
    * `THANH_LAP_TIEU_BAN`, `KHAC`: mặc định là **Chung**.
    * `CAN_CU_DUYET_MOC`: Mặc định NCS cụ thể. Cần có dòng hướng dẫn: *"Chọn 'Chung' nếu quyết định này là quy chế/hội đồng chung áp dụng để duyệt mốc cho mọi NCS."*
    * `CONG_NHAN_TOT_NGHIEP`: Mặc định NCS cụ thể. Quyết định này sẽ được dùng khi xác nhận tốt nghiệp, nên có dòng gợi ý: *"Khuyến khích đính kèm file scan PDF và chọn đúng NCS để tra cứu khi xét tốt nghiệp."*

##### 3. Xử lý sau khi bấm "Tạo quyết định"

- Hộp xác nhận: Bật modal với nhóm A, B, C; nhóm D cho gửi trực tiếp.
- Thành công: Nếu server trả về mảng `canhBao` có phần tử (ví dụ lỗi đồng bộ khóa/mở tài khoản), hiển thị **Banner vàng cố định trên đầu trang** liệt kê từng cảnh báo để Giáo vụ xử lý thủ công (không dùng toast tự biến mất). Sau đó tự động tải lại danh sách quyết định.
- Lỗi 400, 409: Hiển thị nguyên văn `message` từ server vì backend đã chỉ đích danh MSHV vi phạm. Nếu `message` là một mảng chuỗi (lỗi validate class-validator), hiển thị thành danh sách gạch đầu dòng.

##### 4. Màn hình danh sách quyết định & Vô hiệu hóa

- **Hiển thị theo Accordion nhóm theo `soQuyetDinh`:** Mỗi nhóm là một hàng cha, click để mở danh sách các NCS bên trong:
  * Dòng cha: `123/QĐ-ĐHAG · [Badge: Bảo lưu] · 01/10/2026 · 5 NCS · [Nút: Xem PDF]`
  * Khi mở: Bảng con hiển thị danh sách 5 NCS (MSHV, Họ tên, Trạng thái hiệu lực, Ghi chú, Nút thao tác).
- **Bộ lọc:** Lọc theo Loại quyết định, Trạng thái (`HIEU_LUC` / `DEACTIVATE`), Số quyết định, hoặc tìm kiếm theo NCS.
- **Badge màu theo nhóm:** Giúp phân biệt trực quan quyết định có làm thay đổi hồ sơ NCS hay không. Quyết định đã bị `DEACTIVATE` thì làm mờ chữ và gạch ngang (strikethrough).
- **Vô hiệu hóa từng dòng NCS:** Nút "Vô hiệu hóa" nằm ở **từng dòng của mỗi NCS** (vì API thực hiện trên từng dòng `quyetDinhId`).
- **Modal xác nhận vô hiệu hóa:**
  * Bắt buộc có ô nhập `lyDo` (1 đến 1000 ký tự).
  * 5 loại có hoàn tác (`BAO_LUU`, `HOC_TIEP`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `GIA_HAN`): Modal cảnh báo ghi rõ: *"Hồ sơ của NCS sẽ được hoàn lại trạng thái trước quyết định này, tài khoản đăng nhập có thể được khóa hoặc mở lại."*
  * Các loại khác: Modal xác nhận bình thường.
  * Nếu server trả lỗi 400 do hủy sai thứ tự (còn quyết định mới hơn): Hiển thị modal lỗi nguyên văn message của server, kèm nút điều hướng đến quyết định mới hơn cần hủy trước nếu có.

##### 5. Gợi ý cấu hình gọn trong mã nguồn (`LOAI_QUYET_DINH`)

```ts
export const CAU_HINH_QUYET_DINH: Record<string, {
  nhan: string;
  nhom: 'A' | 'B' | 'C' | 'D';
  batBuocNcs: boolean;
  trangThaiHopLe?: string[];
  canHanMoi?: boolean;
  canXacNhan?: boolean;
  canhBao?: string;
  mauSac?: string;
}> = {
  BAO_LUU: {
    nhan: 'Bảo lưu',
    nhom: 'A',
    batBuocNcs: true,
    trangThaiHopLe: ['DANG_HOC', 'GIA_HAN'],
    canXacNhan: true,
    canhBao: 'sẽ chuyển sang Bảo lưu và khóa tài khoản đăng nhập',
    mauSac: 'warning',
  },
  NGUNG_HOC: {
    nhan: 'Ngừng học',
    nhom: 'A',
    batBuocNcs: true,
    trangThaiHopLe: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
    canXacNhan: true,
    canhBao: 'sẽ chuyển sang Ngừng học và khóa tài khoản vĩnh viễn',
    mauSac: 'destructive',
  },
  BUOC_THOI_HOC: {
    nhan: 'Buộc thôi học',
    nhom: 'A',
    batBuocNcs: true,
    trangThaiHopLe: ['DANG_HOC', 'GIA_HAN', 'BAO_LUU'],
    canXacNhan: true,
    canhBao: 'sẽ bị Buộc thôi học và khóa tài khoản vĩnh viễn',
    mauSac: 'destructive',
  },
  HOC_TIEP: {
    nhan: 'Học tiếp',
    nhom: 'B',
    batBuocNcs: true,
    trangThaiHopLe: ['BAO_LUU'],
    canXacNhan: true,
    canhBao: 'sẽ trở lại học và được mở khóa tài khoản',
    mauSac: 'info',
  },
  GIA_HAN: {
    nhan: 'Gia hạn',
    nhom: 'C',
    batBuocNcs: true,
    trangThaiHopLe: ['DANG_HOC', 'GIA_HAN'],
    canHanMoi: true,
    canXacNhan: true,
    canhBao: 'sẽ được gia hạn học tập',
    mauSac: 'primary',
  },
  GIAO_DE_TAI: { nhan: 'Giao đề tài', nhom: 'D', batBuocNcs: false },
  PHAN_CONG_GVHD: { nhan: 'Phân công GVHD', nhom: 'D', batBuocNcs: false },
  THANH_LAP_TIEU_BAN: { nhan: 'Thành lập tiểu ban', nhom: 'D', batBuocNcs: false },
  CAN_CU_DUYET_MOC: { nhan: 'Căn cứ duyệt mốc', nhom: 'D', batBuocNcs: false },
  CONG_NHAN_TOT_NGHIEP: { nhan: 'Công nhận tốt nghiệp', nhom: 'D', batBuocNcs: false },
  KHAC: { nhan: 'Quyết định khác', nhom: 'D', batBuocNcs: false },
};
```

---

#### h. Vô hiệu hóa quyết định

`PATCH /decisions/:id/deactivate`, body `{ "lyDo": "…" }`. Response:

```json
{
  "quyetDinh": { "id": "…", "trangThai": "DEACTIVATE", "ghiChu": "…\nVô hiệu hóa với lý do: …" },
  "canhBao": []
}
```

- Quyết định **không xóa được**, chỉ vô hiệu hóa (`trangThai = DEACTIVATE`). Quyết định đã vô hiệu hóa không dùng làm căn cứ duyệt nữa, và vô hiệu hóa lần hai thì 400.
- Vô hiệu hóa áp dụng cho **một dòng** (một NCS), không phải cả số quyết định. Muốn hủy cho cả nhóm thì phải vô hiệu hóa từng dòng.
- `lyDo` được ghi nối vào `ghiChu` của quyết định.

**Hai nhóm loại quyết định:**

| Loại | Khi vô hiệu hóa |
| :---- | :---- |
| `BAO_LUU`, `HOC_TIEP`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `GIA_HAN` | **Hoàn tác**: hồ sơ NCS trở về đúng trạng thái, hạn gia hạn, ngày và lý do chuyển trạng thái như trước khi có quyết định này. Tài khoản được khóa hoặc mở lại theo trạng thái vừa khôi phục (xem bên dưới) |
| Các loại còn lại (`CAN_CU_DUYET_MOC`, `GIAO_DE_TAI`...) | Chỉ đánh dấu `DEACTIVATE`, không đụng tới hồ sơ NCS |

**Quy tắc hoàn tác (như một ngăn xếp):** chỉ vô hiệu hóa được quyết định đổi trạng thái **mới nhất còn hiệu lực** của NCS đó. Ví dụ NCS có `BAO_LUU` (q1) rồi `HOC_TIEP` (q2):

1. Vô hiệu hóa q1 trước: **400**, `message` nêu quyết định mới hơn (loại và số) cần hủy trước.
2. Vô hiệu hóa q2: NCS quay lại `BAO_LUU` và bị khóa tài khoản lại.
3. Sau đó vô hiệu hóa q1: NCS về `DANG_HOC` và được mở khóa.

**Khóa hoặc mở khóa tài khoản** dựa vào trạng thái NCS vừa được khôi phục, không dựa vào loại quyết định bị hủy:

- Khôi phục về `BAO_LUU`, `NGUNG_HOC` hoặc `BUOC_THOI_HOC`: tài khoản bị khóa.
- Khôi phục về trạng thái khác: tài khoản được mở.
- Quyết định `GIA_HAN` không đụng tới tài khoản.
- Nếu khóa hoặc mở khóa lỗi thì dữ liệu vẫn được lưu và lỗi nằm trong `canhBao`.

---

## 6. Hệ thống Thông báo (Notification)

Hệ thống thông báo tự động gửi thông tin cho NCS, Giảng viên hướng dẫn (GVHD), và Giáo vụ/Admin khi có sự kiện thay đổi tiến trình, quyết định hoặc nhắc hạn.

### 6.1 Các API Gateway

| Phương thức & Đường dẫn | Chức năng | Query / Body | Response gợi ý |
| :---- | :---- | :---- | :---- |
| `GET /notifications` | Danh sách thông báo của người dùng đăng nhập | `?unread=true` (chỉ chưa đọc), `?group=TIEN_DO` (lọc nhóm), `?page=1&limit=20` | `{ items: Notification[], tong: number, trang: number, soLuong: number }` |
| `GET /notifications/unread-count` | Lấy số lượng thông báo chưa đọc (cho Badge chuông) | Không | `{ soLuong: number }` |
| `PATCH /notifications/:id/read` | Đánh dấu 1 thông báo đã đọc | Không | Thông báo vừa cập nhật (`daDoc: true`, `readAt: ISO`) |
| `PATCH /notifications/read-all` | Đánh dấu tất cả thông báo của người dùng đã đọc | Không | `{ soLuong: number }` (số lượng thông báo vừa cập nhật) |

### 6.2 Cấu trúc một thông báo (`Notification`)

```json
{
  "id": "e45f...uuid",
  "userId": "usr...uuid",
  "nhom": "TIEN_DO",
  "loai": "MOC_DUOC_DUYET",
  "tieuDe": "Mốc 3 đã được duyệt",
  "noiDung": "Minh chứng mốc 3 của bạn đã được duyệt. Mốc 4 đã được mở để bạn nộp minh chứng.",
  "duLieu": { "thuTu": 3, "mocKeTiep": 4 },
  "daDoc": false,
  "readAt": null,
  "createdAt": "2026-11-02T10:30:00.000Z"
}
```

- **Các nhóm thông báo (`nhom`):**
  * `TIEN_DO`: Duyệt mốc (`MOC_DUOC_DUYET`), từ chối mốc (`MOC_BI_TU_CHOI`), nộp minh chứng (`NCS_NOP_MINH_CHUNG`), có phiếu nhận xét mới (`CO_PHIEU_NHAN_XET_MOI`), phân công GVHD (`NCS_DUOC_PHAN_CONG_GVHD`), v.v.
  * `QUYET_DINH`: Quyết định đổi trạng thái (`QUYET_DINH_DOI_TRANG_THAI`), công nhận tốt nghiệp (`TOT_NGHIEP`, `GVHD_NCS_TOT_NGHIEP`), quyết định bị hủy (`QUYET_DINH_BI_HUY`).
  * `NHAC_HAN`: Nhắc hạn học tập định kỳ (`NHAC_HAN_HOC_TAP`), cảnh báo sắp hết hạn 72 tháng (`CANH_BAO_HET_HAN_DAO_TAO`).
  * `CANH_BAO_KY_THUAT`: Cảnh báo không cập nhật được tài khoản Keycloak, đổi mật khẩu.
  * `HE_THONG`: Thông báo hệ thống chung.

### 6.3 Gợi ý UI / UX cho Frontend

1. **Chuông thông báo trên Header / Topbar:**
   - Gọi `GET /notifications/unread-count` khi khởi tạo ứng dụng hoặc sau các thao tác lớn.
   - Nếu `soLuong > 0`, hiển thị Badge đỏ (ví dụ `3` hoặc `99+`).
   - Click vào chuông mở **Notification Popover (Dropdown)**:
     * Hiển thị 5 đến 10 thông báo gần nhất.
     * Nút "Đánh dấu tất cả đã đọc" (gọi `PATCH /notifications/read-all`).
     * Dưới cùng có link "Xem tất cả thông báo" chuyển hướng sang trang `/notifications`.
2. **Trang Quản lý Thông báo (`/notifications`):**
   - Header có nút "Đánh dấu tất cả đã đọc".
   - Bộ lọc theo Tabs: `Tất cả`, `Tiến độ`, `Quyết định`, `Nhắc hạn`, `Hệ thống`.
   - Toggle switch: *"Chỉ hiện thông báo chưa đọc"*.
   - Danh sách thông báo có icon/badge riêng theo từng nhóm, hiển thị thời gian tương đối (ví dụ "5 phút trước", "Hôm qua").
   - Trạng thái chưa đọc có nền highlight nhẹ (ví dụ nền xanh nhạt) kèm chấm tròn xanh.
3. **Điều hướng ngữ cảnh (Deep-linking) khi click thông báo:**
   - Khi bấm vào thông báo:
     * Gọi ngay `PATCH /notifications/:id/read` để cập nhật trạng thái đã đọc và giảm badge chuông.
     * Dựa vào `nhom`, `loai` và `duLieu` để navigate:
       - Mốc tiến trình (`MOC_DUOC_DUYET`, `MOC_BI_TU_CHOI`...): chuyển đến màn hình tiến trình mốc tương ứng.
       - Quyết định (`QUYET_DINH_DOI_TRANG_THAI`...): chuyển đến trang danh sách quyết định hoặc hồ sơ NCS.
       - Tốt nghiệp (`TOT_NGHIEP`): chuyển đến hồ sơ / chứng nhận tốt nghiệp.

---

## 7. Màn hình Xét tốt nghiệp (Graduation Assessment)

Sau khi NCS hoàn thành mốc 9, hệ thống không tự động cấp bằng tốt nghiệp. Giáo vụ tiến hành quy trình rà soát 6 điều kiện tốt nghiệp, xác nhận ngoại ngữ, công nợ và ra quyết định công nhận tốt nghiệp.

### 7.1 6 Điều kiện tốt nghiệp được kiểm tra tự động

Server đánh giá 6 điều kiện dựa trên hồ sơ NCS (`tinhKetQuaTotNghiep`):

| STT | Mã điều kiện (`ma`) | Tên điều kiện (`ten`) | Tiêu chí đạt (`dat = true`) | Ghi chú & Minh chứng |
| :---: | :---- | :---- | :---- | :---- |
| 1 | `HOAN_THANH_MOC` | Hoàn thành tất cả các mốc | Đã đạt đủ 9/9 mốc tiến trình (`trangThai = PASSED`) | Báo số mốc đã đạt: 9/9 |
| 2 | `TRANG_THAI_HOC_TAP` | Đang học | Đang ở trạng thái `DANG_HOC` hoặc `GIA_HAN` (không bảo lưu, ngừng học, thôi học) | Báo trạng thái hiện tại |
| 3 | `THOI_HAN` | Chưa quá hạn tối đa (72 tháng) | Ngày hoàn thành mốc cuối ≤ `hanBuocThoiHoc` | Báo ngày đạt mốc cuối và hạn 72 tháng |
| 4 | `NGOAI_NGU` | Đạt chuẩn đầu ra ngoại ngữ | Giáo vụ đã xác nhận đạt chuẩn ngoại ngữ | Báo tên chuẩn ngoại ngữ, ngày công nhận, đính kèm `fileId` |
| 5 | `CONG_NO` | Hoàn thành nghĩa vụ tài chính | Giáo vụ đã xác nhận không còn công nợ | Báo tình trạng công nợ, đính kèm `fileId` nếu có |
| 6 | `DE_NGHI_CHO_DUYET` | Không còn đề nghị điều chỉnh chờ duyệt | Số đề nghị điều chỉnh đang chờ duyệt = 0 | Báo số lượng đề nghị đang chờ |

> **Quy tắc đủ điều kiện:** `duDieuKien = true` khi và chỉ khi **toàn bộ 6 điều kiện** đều `dat = true`.

### 7.2 Các API Xét tốt nghiệp

| Phương thức & Endpoint | Quyền | Mục đích |
| :---- | :---- | :---- |
| `GET /graduation` | `GRADUATION_CHECK` | Danh sách NCS đã hoàn tất các mốc. Query `?duDieuKien=true` hoặc `?duDieuKien=false` |
| `GET /graduation/ncs/:ncsId` | `GRADUATION_CHECK` | Xem chi tiết kết quả 6 điều kiện xét tốt nghiệp của 1 NCS |
| `PUT /graduation/ncs/:ncsId/ngoai-ngu` | `GRADUATION_CHECK` | Giáo vụ xác nhận kết quả chuẩn đầu ra ngoại ngữ |
| `PUT /graduation/ncs/:ncsId/cong-no` | `GRADUATION_CHECK` | Giáo vụ xác nhận tình trạng công nợ của NCS |
| `GET /graduation/ncs/:ncsId/quyet-dinh` | `GRADUATION_CHECK` | Danh sách quyết định `CONG_NHAN_TOT_NGHIEP` còn hiệu lực & chưa dùng của NCS này |
| `POST /graduation/confirm` | `GRADUATION_CHECK` | Xác nhận tốt nghiệp: gắn quyết định, chuyển trạng thái `DA_TOT_NGHIEP`, gửi thông báo |

### 7.3 Chi tiết Body & Dữ liệu API

#### a. Xác nhận Ngoại ngữ: `PUT /graduation/ncs/:ncsId/ngoai-ngu`
Nếu đính kèm minh chứng, upload trước qua `POST /documents/upload` (`documentType: MINH_CHUNG_NGOAI_NGU`):

```json
{
  "dat": true,
  "chuanDauRa": "TOEIC 750 / B2 Vstep",
  "ngayCongNhanNgoaiNgu": "2026-09-15",
  "ghiChu": "Chứng chỉ nộp đợt 2",
  "fileId": "uuid-file-pdf"
}
```
*Lưu ý:* Khi `dat = true`, bắt buộc phải có `chuanDauRa` và `ngayCongNhanNgoaiNgu`.

#### b. Xác nhận Công nợ: `PUT /graduation/ncs/:ncsId/cong-no`

```json
{
  "khongConCongNo": true,
  "ghiChu": "Đã thanh toán học phí đầy đủ",
  "fileId": "uuid-file-pdf (nếu có giấy xác nhận)"
}
```

#### c. Danh sách quyết định công nhận tốt nghiệp chưa dùng: `GET /graduation/ncs/:ncsId/quyet-dinh`
Trả về mảng các quyết định loại `CONG_NHAN_TOT_NGHIEP` của chính NCS đó, đang có hiệu lực (`HIEU_LUC`) và chưa từng dùng để duyệt tốt nghiệp:

```json
[
  {
    "id": "qd-uuid-1",
    "soQuyetDinh": "456/QĐ-ĐHAG",
    "ngayQuyetDinh": "2026-11-01",
    "fileId": "file-uuid",
    "ghiChu": "Đợt tốt nghiệp tháng 11/2026"
  }
]
```

#### d. Xác nhận tốt nghiệp: `POST /graduation/confirm`
Xác nhận cho 1 hoặc nhiều NCS cùng lúc:

```json
{
  "danhSach": [
    {
      "ncsId": "ncs-uuid-1",
      "quyetDinhId": "qd-uuid-1",
      "ngayTotNghiep": "2026-11-01"
    }
  ]
}
```
*Lưu ý:* `ngayTotNghiep` là tùy chọn; nếu bỏ trống, server tự lấy theo `ngayQuyetDinh`.

- **Khi thành công (201):**
  ```json
  {
    "ketQua": [
      {
        "ncsId": "ncs-uuid-1",
        "mshv": "DPM2001",
        "quyetDinhId": "qd-uuid-1",
        "ngayTotNghiep": "2026-11-01"
      }
    ]
  }
  ```
  Hồ sơ NCS chuyển sang `DA_TOT_NGHIEP`. Hệ thống tự động gửi thông báo đến NCS và các GVHD được phân công.

- **Khi có lỗi (400):** Server kiểm tra lại điều kiện ngay lúc xác nhận. Nếu có NCS chưa đủ điều kiện hoặc đã duyệt trước đó, server trả lỗi 400 kèm mảng `chiTiet`:
  ```json
  {
    "statusCode": 400,
    "message": "Có 1 NCS chưa đủ điều kiện tốt nghiệp",
    "chiTiet": [
      {
        "ncsId": "ncs-uuid-2",
        "mshv": "DPM2002",
        "hoTen": "Trần Thị B",
        "lyDo": "Chưa đạt: Đạt chuẩn đầu ra ngoại ngữ, Hoàn thành nghĩa vụ tài chính"
      }
    ]
  }
  ```

### 7.4 Gợi ý UI / UX cho Màn hình Xét tốt nghiệp

1. **Màn hình Danh sách xét tốt nghiệp (`/graduation`):**
   - **Tabs lọc:** `Tất cả`, `Đủ điều kiện (xanh)`, `Chưa đủ điều kiện (cam)`.
   - **Bảng dữ liệu:**
     * Cột thông tin NCS: MSHV, Họ tên, Trạng thái học tập.
     * Cột trạng thái duyệt: Badge `Đã tốt nghiệp` / `Chưa tốt nghiệp`.
     * Cột 6 điều kiện: Hiển thị 6 icon hoặc checklist thu nhỏ (ví dụ: `Mốc: ✔`, `TT: ✔`, `Hạn: ✔`, `NN: ✘`, `Nợ: ✔`, `ĐN: ✔`). Hover vào từng icon hiển thị tooltip ghi chú chi tiết.
     * Cột thao tác: Nút "Kiểm tra chi tiết", Nút "Xác nhận ngoại ngữ/công nợ".
     * Hàng đầu bảng có nút **"Xác nhận tốt nghiệp"** (bật khi tick chọn ít nhất 1 NCS đủ điều kiện).
2. **Modal / Drawer Xác nhận Ngoại ngữ & Công nợ:**
   - Mở nhanh khi bấm vào biểu tượng Ngoại ngữ hoặc Công nợ trên từng hàng.
   - Cho phép upload file scan chứng chỉ/phiếu thu và lưu kết quả. Sau khi lưu, tự động tải lại bảng.
3. **Quy trình Xác nhận tốt nghiệp (Modal Xác nhận):**
   - **Bước 1:** Giáo vụ tạo trước quyết định loại `CONG_NHAN_TOT_NGHIEP` cho các NCS ở module Quyết định (upload scan PDF QĐ tốt nghiệp).
   - **Bước 2:** Tại màn hình Xét tốt nghiệp, chọn các NCS đã đủ điều kiện, bấm "Xác nhận tốt nghiệp".
   - **Bước 3:** Modal hiện danh sách các NCS được chọn. Với mỗi NCS, hiển thị một **Dropdown chọn quyết định** (gọi `GET /graduation/ncs/:ncsId/quyet-dinh` để nạp các quyết định công nhận tốt nghiệp chưa dùng).
   - **Bước 4:** Bấm "Xác nhận". Nếu có lỗi `chiTiet`, hiển thị Modal popup chi tiết từng NCS bị từ chối để Giáo vụ kịp thời xử lý.

---

## 8. Bảng API tổng hợp

| Vai trò | Method và đường dẫn | Quyền | Chức năng |
| :---- | :---- | :---- | :---- |
| **NCS** | `GET /progress/me` | `MILESTONE_READ` | Xem 9 mốc tiến trình của bản thân |
| **NCS** | `POST /progress/milestones/:thuTu/submit` | `MILESTONE_SUBMIT` | Nộp file minh chứng mốc (kèm fileId) |
| **NCS, Giáo vụ** | `POST /documents/upload` | `DOCUMENT_UPLOAD` | Upload file PDF (minh chứng mốc, quyết định, ngoại ngữ...) |
| **NCS, Giáo vụ** | `GET /documents/:id`, `GET /documents/:id/download` | `DOCUMENT_READ` | Đọc metadata / Download hoặc xem PDF |
| **NCS, GVHD, Giáo vụ** | `GET /notifications` | Mọi user đã đăng nhập | Danh sách thông báo (phân trang, lọc nhóm, chưa đọc) |
| **NCS, GVHD, Giáo vụ** | `GET /notifications/unread-count` | Mọi user đã đăng nhập | Số lượng thông báo chưa đọc (cho Badge chuông) |
| **NCS, GVHD, Giáo vụ** | `PATCH /notifications/:id/read` | Mọi user đã đăng nhập | Đánh dấu 1 thông báo đã đọc |
| **NCS, GVHD, Giáo vụ** | `PATCH /notifications/read-all` | Mọi user đã đăng nhập | Đánh dấu tất cả thông báo đã đọc |
| **Giáo vụ** | `GET /ncs` | `NCS_READ` | Danh sách NCS kèm trạng thái, hạn chính quy, gia hạn, hạn 72 tháng |
| **Giáo vụ** | `DELETE /documents/:id` | `DOCUMENT_DELETE` | Xóa file PDF rác chưa gắn nghiệp vụ |
| **Giáo vụ** | `GET /progress/pending` | `MILESTONE_APPROVE` | Hàng đợi mốc chờ duyệt |
| **Giáo vụ** | `GET /progress/ncs/:ncsId` | `MILESTONE_APPROVE` | Xem lịch sử 9 mốc của 1 NCS |
| **Giáo vụ** | `GET, POST /progress/evidences/:minhChungId/evaluations` | `MILESTONE_APPROVE` | Xem / Nhập phiếu nhận xét chấm điểm (mốc 2, 4, 5) |
| **Giáo vụ** | `POST /progress/reviews/:tienTrinhId/approve` | `MILESTONE_APPROVE` | Duyệt đạt mốc tiến trình (kèm quyetDinhId) |
| **Giáo vụ** | `POST /progress/reviews/:tienTrinhId/reject` | `MILESTONE_REJECT` | Từ chối mốc tiến trình (kèm lý do) |
| **Giáo vụ** | `POST /decisions` | `DECISION_CREATE` | Tạo quyết định (1 hoặc nhiều NCS, có thể đổi trạng thái NCS) |
| **Giáo vụ** | `GET /decisions`, `GET /decisions/:id` | `DECISION_READ` | Danh sách quyết định (lọc số QĐ, loại, NCS...) / Chi tiết |
| **Giáo vụ** | `PATCH /decisions/:id/deactivate` | `DECISION_UPDATE` | Vô hiệu hóa quyết định (hoàn tác trạng thái hồ sơ NCS nếu có) |
| **Giáo vụ** | `GET /graduation` | `GRADUATION_CHECK` | Danh sách NCS xét tốt nghiệp (lọc `duDieuKien`) |
| **Giáo vụ** | `GET /graduation/ncs/:ncsId` | `GRADUATION_CHECK` | Chi tiết kết quả 6 điều kiện xét tốt nghiệp của 1 NCS |
| **Giáo vụ** | `PUT /graduation/ncs/:ncsId/ngoai-ngu` | `GRADUATION_CHECK` | Xác nhận chuẩn đầu ra ngoại ngữ |
| **Giáo vụ** | `PUT /graduation/ncs/:ncsId/cong-no` | `GRADUATION_CHECK` | Xác nhận tình trạng công nợ tài chính |
| **Giáo vụ** | `GET /graduation/ncs/:ncsId/quyet-dinh` | `GRADUATION_CHECK` | Lấy quyết định `CONG_NHAN_TOT_NGHIEP` chưa dùng của NCS |
| **Giáo vụ** | `POST /graduation/confirm` | `GRADUATION_CHECK` | Xác nhận tốt nghiệp cho 1 hoặc nhiều NCS |

Admin có toàn bộ quyền. Việc phân quyền và ẩn menu theo role ở FE nhằm tối ưu giao diện, server luôn kiểm tra quyền thực tế (403).

---

## 9. Quy tắc chung và xử lý lỗi

- **Xác thực:** Mọi API đều yêu cầu header `Authorization: Bearer <accessToken>`.
- **Định dạng lỗi:** Lỗi trả về có dạng `{ "statusCode": 400, "message": "…" }`. Với lỗi kiểm tra dữ liệu đầu vào (class-validator), `message` có thể là một **mảng các chuỗi**. Lỗi xét tốt nghiệp có thêm trường `chiTiet`. Lỗi trùng phiếu nhận xét có thêm `code: "PHIEU_TRUNG_NGUOI_CHAM"`.
- **Ý nghĩa mã lỗi HTTP:**

| Mã lỗi | Ý nghĩa | Cách xử lý gợi ý ở UI |
| :---- | :---- | :---- |
| 400 | Dữ liệu không hợp lệ hoặc vi phạm điều kiện nghiệp vụ | Hiển thị nguyên văn `message` (nếu là mảng thì hiện từng dòng) |
| 401 | Token hết hạn hoặc không hợp lệ | Tự động gọi `POST /auth/refresh` hoặc redirect về trang đăng nhập |
| 403 | Không đủ quyền hạn thao tác | Hiển thị thông báo không có quyền truy cập |
| 404 | Bản ghi hoặc tài nguyên không tìm thấy | Hiển thị `message` thông báo |
| 409 | Xung đột dữ liệu (bị trùng lặp, hoặc bản ghi vừa bị thay đổi) | Hiển thị thông báo và tải lại dữ liệu mới nhất từ server |
| 502, 503, 504 | Microservice nội bộ gián đoạn hoặc phản hồi chậm | Hiển thị thông báo "Hệ thống đang bận, vui lòng thử lại sau" |

- **Cơ chế cập nhật dữ liệu (Re-fetch):** Sau mỗi thao tác ghi (nộp minh chứng, duyệt/từ chối mốc, nhập phiếu, tạo/hủy quyết định, xác nhận tốt nghiệp), **luôn gọi lại API GET** thay vì tự biến đổi state tại chỗ. Lý do: các nghiệp vụ này thường kích hoạt giao dịch phức tạp (mở khóa mốc kế tiếp, cập nhật trạng thái học tập của nhiều NCS, cập nhật cờ hoàn tất tốt nghiệp).
- **Múi giờ & Định dạng ngày:** Các mốc thời gian ISO 8601 hiển thị theo giờ Việt Nam (UTC+7). Các trường ngày thuần (`ngayQuyetDinh`, `hanMoi`, `ngayTotNghiep`) luôn có định dạng `YYYY-MM-DD`.
- **Tránh race condition:** Hai Giáo vụ cùng duyệt 1 mốc hoặc cùng thao tác trên 1 quyết định: người gửi sau sẽ nhận 409. FE xử lý bằng cách bắt 409 và reload danh sách.

---

## 10. Ngoài phạm vi luồng này

Các phần sau **chưa có** trong giai đoạn này, FE chưa cần dựng màn hình:

- Giảng viên hướng dẫn (GVHD) theo dõi tiến trình trực quan của toàn bộ NCS do mình hướng dẫn.
- Quản lý định mức giờ hướng dẫn của GVHD và thủ tục điều chỉnh thay đổi đề tài/cán bộ hướng dẫn.