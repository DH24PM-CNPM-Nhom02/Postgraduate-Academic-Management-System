# Luồng 9 mốc: tài liệu API cho Frontend

Hệ thống quản lý đào tạo sau đại học (PostGraduate Academic System). Tài liệu này mô tả luồng theo dõi **9 mốc tiến độ** của nghiên cứu sinh (NCS) để FE dựng giao diện dựa trên các API đã có ở API Gateway.

## Mục lục

1. [Khái niệm nền](#1-khái-niệm-nền)
2. [Bản đồ ID](#2-bản-đồ-id)
3. [Quy tắc về file: upload trước, lấy fileId](#3-quy-tắc-về-file-upload-trước-lấy-fileid)
4. [Màn hình của NCS](#4-màn-hình-của-ncs)
5. [Màn hình của Giáo vụ](#5-màn-hình-của-giáo-vụ)
6. [Bảng API tổng hợp](#6-bảng-api-tổng-hợp)
7. [Quy tắc chung và xử lý lỗi](#7-quy-tắc-chung-và-xử-lý-lỗi)
8. [Ngoài phạm vi luồng này](#8-ngoài-phạm-vi-luồng-này)

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

#### g. Gợi ý UI

- **Chọn NCS:** ô chọn nhiều (multi-select) có tìm theo MSHV hoặc họ tên, hiển thị số NCS đã chọn. Với các loại đổi trạng thái, nên lọc hoặc làm mờ NCS không hợp lệ theo sơ đồ chuyển trạng thái ở mục e (ví dụ `HOC_TIEP` chỉ liệt kê NCS đang `BAO_LUU`).
- **Loại `GIA_HAN`:** hiện thêm ô chọn ngày "Hạn mới", và hiển thị hạn hiện tại của từng NCS đã chọn nếu có.
- **Loại `BAO_LUU`, `NGUNG_HOC`, `BUOC_THOI_HOC`:** có hộp xác nhận trước khi gửi, ví dụ "Quyết định này sẽ đổi trạng thái và khóa tài khoản của N NCS". Thao tác này ảnh hưởng trực tiếp đến NCS nên không nên cho gửi bằng một cú bấm.
- **Loại `HOC_TIEP`:** hộp xác nhận ghi "N NCS sẽ trở lại học và được mở khóa tài khoản". Hạn học tập không đổi, nên NCS có thể quay lại khi hạn đã gần hoặc đã hết; nếu cần thì Giáo vụ ra thêm quyết định `GIA_HAN`.
- **Sau khi tạo thành công:** hiển thị `canhBao` (nếu có) và tải lại danh sách.
- **Danh sách quyết định:** nên nhóm các dòng theo `soQuyetDinh` để Giáo vụ thấy một quyết định áp dụng cho những NCS nào.
- **Chi tiết khi xem một dòng:** hiển thị `soQuyetDinh`, `ngayQuyetDinh`, tên NCS (`ncs.mshv`, `ncs.hoTen`), trạng thái hiệu lực, nút xem PDF nếu có `fileId`.

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

**Các lỗi 400 cần hiển thị `message` nguyên văn:**

| Tình huống | Gợi ý xử lý ở UI |
| :---- | :---- |
| NCS có quyết định đổi trạng thái mới hơn còn hiệu lực | Cho Giáo vụ mở quyết định mới hơn đó để vô hiệu hóa trước |
| Quyết định không có đủ dữ liệu để hoàn tác (tạo trước khi hệ thống ghi nhật ký giá trị cũ) | Báo cần xử lý thủ công, không thử lại |
| Trạng thái hiện tại của NCS khác với lúc ra quyết định (có người sửa trực tiếp hồ sơ) | Báo cần xử lý thủ công, không thử lại |

**Gợi ý UI:**

- Với 5 loại có hoàn tác, hộp xác nhận nên ghi rõ: "Hồ sơ của NCS sẽ được hoàn lại trạng thái trước quyết định này, tài khoản có thể được khóa hoặc mở lại". Với các loại còn lại chỉ cần xác nhận thông thường.
- Sau khi vô hiệu hóa, hiển thị `canhBao` nếu có, rồi tải lại danh sách quyết định và hồ sơ NCS.
- Mọi lần vô hiệu hóa có hoàn tác đều được ghi nhật ký (audit) để truy vết.

---

## 6. Bảng API tổng hợp

| Vai trò | Method và đường dẫn | Quyền |
| :---- | :---- | :---- |
| NCS | `GET /progress/me` | `MILESTONE_READ` |
| NCS | `POST /progress/milestones/:thuTu/submit` | `MILESTONE_SUBMIT` |
| NCS, Giáo vụ | `POST /documents/upload` | `DOCUMENT_UPLOAD` |
| NCS, Giáo vụ | `GET /documents/:id`, `GET /documents/:id/download` | `DOCUMENT_READ` |
| Giáo vụ | `DELETE /documents/:id` | `DOCUMENT_DELETE` |
| Giáo vụ | `GET /progress/pending` | `MILESTONE_APPROVE` |
| Giáo vụ | `GET /progress/ncs/:ncsId` | `MILESTONE_APPROVE` |
| Giáo vụ | `GET, POST /progress/evidences/:minhChungId/evaluations` | `MILESTONE_APPROVE` |
| Giáo vụ | `POST /progress/reviews/:tienTrinhId/approve` | `MILESTONE_APPROVE` |
| Giáo vụ | `POST /progress/reviews/:tienTrinhId/reject` | `MILESTONE_REJECT` |
| Giáo vụ | `POST /decisions` (một hoặc nhiều NCS, có thể đổi trạng thái NCS) | `DECISION_CREATE` |
| Giáo vụ | `GET /decisions`, `GET /decisions/:id` | `DECISION_READ` |
| Giáo vụ | `PATCH /decisions/:id/deactivate` | `DECISION_UPDATE` |

Admin có toàn bộ quyền. Việc ẩn menu theo role ở FE chỉ để giao diện gọn, server vẫn là nơi chặn thật (403).

---

## 7. Quy tắc chung và xử lý lỗi

- Mọi API cần header `Authorization: Bearer <accessToken>`.
- Lỗi trả về dạng `{ "statusCode": 400, "message": "…" }`. Với lỗi kiểm tra dữ liệu đầu vào, `message` có thể là một **mảng chuỗi**. Chỉ lỗi trùng phiếu nhận xét có thêm trường `code`.
- Ý nghĩa mã lỗi dùng chung:

| Mã | Ý nghĩa | Cách xử lý ở UI |
| :---- | :---- | :---- |
| 400 | Dữ liệu không hợp lệ hoặc vi phạm điều kiện nghiệp vụ | Hiện `message` |
| 401 | Token hết hạn hoặc thiếu | Gọi `POST /auth/refresh` hoặc chuyển về đăng nhập |
| 403 | Không đủ quyền hoặc không phải dữ liệu của mình | Hiện thông báo không có quyền |
| 404 | Không tìm thấy | Hiện `message` |
| 409 | Xung đột (trùng, hoặc dữ liệu vừa bị thay đổi) | Thường là "tải lại" |
| 502, 503, 504 | Service khác lỗi hoặc phản hồi chậm | "Hệ thống đang bận, thử lại sau" |

- Sau mỗi thao tác ghi (nộp, duyệt, từ chối, nhập phiếu, tạo hoặc vô hiệu hóa quyết định), **gọi lại API đọc** thay vì tự sửa state tại chỗ. Một lần duyệt thay đổi nhiều mốc cùng lúc (mốc hiện tại thành `PASSED`, mốc kế thành `UNLOCKED`), và một lần tạo quyết định có thể đổi trạng thái của nhiều NCS, một lần vô hiệu hóa có thể hoàn tác trạng thái của NCS đó.
- Thời điểm trả về là chuỗi ISO 8601, hiển thị theo giờ Việt Nam. `ngayQuyetDinh` và `hanMoi` là ngày thuần.
- Hai Giáo vụ cùng duyệt một mốc: chỉ một người thành công, người còn lại nhận 409. FE nên xử lý bằng cách tải lại hàng chờ.

---

## 8. Ngoài phạm vi luồng này

Các phần sau **chưa có** trong luồng 9 mốc, FE chưa cần dựng màn hình:

- Xét tốt nghiệp sau khi hoàn thành mốc 9 (mốc 9 `PASSED` không tự cấp tốt nghiệp).
- Thông báo cho NCS khi mốc được duyệt hoặc bị từ chối.
- GVHD xem tiến trình của NCS mình hướng dẫn.
- Định mức hướng dẫn của GVHD và thay đổi đề tài.