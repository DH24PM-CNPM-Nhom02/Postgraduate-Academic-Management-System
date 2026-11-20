# QUY ĐỊNH THỜI HẠN 9 MỐC TIẾN TRÌNH ĐÀO TẠO TIẾN SĨ

> Căn cứ Quy chế đào tạo trình độ Tiến sĩ (QĐ 655/QĐ-ĐHAG) và cấu hình nguồn sự thật trong Cơ sở dữ liệu: bảng `moc_han` (Model `MocHan`).
> Thời hạn của từng Nghiên cứu sinh (NCS) không lưu chết mà được hệ thống tính toán động dựa trên ngày nhập học, ngày đạt của các mốc tiên quyết, thời hạn đào tạo chính quy và gia hạn.

---

## 1. Nguyên Tắc Tính Hạn Trong Hệ Thống

1. **Thứ tự ưu tiên áp dụng:**
   - **Hạn kế hoạch (`hanKeHoach`)**: Nếu NCS đã lập Kế hoạch học tập & nghiên cứu toàn khóa và được phê duyệt, hạn này được ưu tiên áp dụng cao nhất.
   - **Hạn quy định (`hanQuyDinh`)**: Tính toán tự động theo quy chế từ cấu hình bảng `moc_han` khi chưa có hạn kế hoạch.
2. **Giới hạn thời gian tối đa:**
   - Mọi mốc và hạn gia hạn đều không được vượt quá **Thời hạn buộc thôi học (`hanBuocThoiHoc`)** = **72 tháng (6 năm)** kể từ ngày nhập học.
3. **Mốc gốc tính hạn (`MocGoc`):**
   - `NGAY_NHAP_HOC`: Tính cộng dồn từ ngày NCS chính thức nhập học (`ngayNhapHoc`).
   - `NGAY_MOC_DAT`: Tính từ ngày mốc tiên quyết được duyệt đạt (`passedAt` của mốc `gocThuTu`).
   - `HET_HAN_CHINH_QUY`: Tính lùi hoặc tiến từ thời điểm kết thúc thời gian chính quy (`hanGiaHan` nếu có, ngược lại là `hanChinhQuy`). Số âm biểu thị thời gian lùi trước khi hết hạn chính quy.
4. **Phân loại hạn:**
   - **Hạn cứng (`laHanMem: false`)**: Bắt buộc phải hoàn thành trước hoặc đúng hạn để không bị quá hạn.
   - **Hạn mềm (`laHanMem: true`)**: Hạn tham khảo/nhắc nhở nội bộ (ví dụ: GVHD gửi phiếu đăng ký chuyên đề).

---

## 2. Bảng Cấu Hình Hạn 9 Mốc Từ Model `MocHan` (CSDL)

| Mốc | Tên mốc | Mã hạn (`maHan`) | Tên hạn quy định (`tenHan`) | Mốc gốc (`mocGoc`) | Gốc mốc (`gocThuTu`) | Đơn vị & Số lượng (`soDonVi`, `donVi`) | Loại hạn (`laHanMem`) | Căn cứ quy chế (`canCu`) |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **Mốc 1** | Nhập học & Ban hành QĐ | — | Tiếp nhận & Công nhận NCS, đề tài | — | — | — | Cứng | Hoàn thành khi ban hành Quyết định công nhận NCS và Đề tài |
| **Mốc 2** | Tiểu luận tổng quan | `HOAN_THANH` | Hoàn thành tiểu luận tổng quan | `NGAY_NHAP_HOC` | — | +6 THÁNG | Cứng | Thực hiện trong 06 tháng đầu khóa |
| **Mốc 3** | Đề cương nghiên cứu (Đề cương chi tiết) | `HOAN_THANH` | Hoàn thành đề cương nghiên cứu | `NGAY_NHAP_HOC` | — | +6 THÁNG | Cứng | Thực hiện trong 06 tháng đầu khóa |
| **Mốc 4** | Chuyên đề tiến sĩ 1 | `DANG_KY_CHUYEN_DE` | GVHD gửi phiếu đăng ký chuyên đề | `NGAY_NHAP_HOC` | — | +12 THÁNG | Mềm | Chậm nhất đầu năm học thứ 2 (ước tính 12 tháng từ ngày nhập học) |
| **Mốc 4** | Chuyên đề tiến sĩ 1 | `HOAN_THANH` | Hoàn thành chuyên đề 1 | `HET_HAN_CHINH_QUY` | — | -3 THÁNG | Cứng | Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy |
| **Mốc 5** | Chuyên đề tiến sĩ 2 | `HOAN_THANH` | Hoàn thành chuyên đề 2 | `HET_HAN_CHINH_QUY` | — | -3 THÁNG | Cứng | Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy |
| **Mốc 6** | Bảo vệ giữa kỳ (Báo cáo tiến độ định kỳ) | `KY_BAO_CAO` | Báo cáo tiến độ định kỳ | Lịch định kỳ | — | Tháng 6 và Tháng 12 hàng năm | Cứng | Định kỳ 02 lần mỗi năm vào tháng 6 và tháng 12 (không lưu dòng cứng trong bảng `moc_han`) |
| **Mốc 7** | Seminar cuối khóa | `HOAN_THANH` | Hoàn thành seminar cuối khóa | `HET_HAN_CHINH_QUY` | — | -3 THÁNG | Cứng | Phải xong trước khi đăng ký bảo vệ mốc 8; hồ sơ mốc 8 nộp chậm nhất 3 tháng trước khi hết hạn chính quy |
| **Mốc 8** | Bảo vệ cấp đơn vị chuyên môn (Cấp Bộ môn) | `NOP_HO_SO` | Nộp hồ sơ đăng ký bảo vệ cấp đơn vị chuyên môn | `HET_HAN_CHINH_QUY` | — | -3 THÁNG | Cứng | Chậm nhất 03 tháng trước khi hết thời hạn chính quy |
| **Mốc 9** | Bảo vệ cấp cơ sở đào tạo (Cấp Trường & Phản biện kín) | `HOAN_THIEN_GUI_PHAN_BIEN` | Hoàn thiện luận án gửi phản biện độc lập | `NGAY_MOC_DAT` | 8 | +60 NGÀY LÀM VIỆC | Cứng | Tối đa 60 ngày làm việc sau khi hội đồng cấp đơn vị thông qua (mốc 8) |
| **Mốc 9** | Bảo vệ cấp cơ sở đào tạo (Cấp Trường & Phản biện kín) | `BAO_VE_CO_SO` | Bảo vệ luận án cấp cơ sở đào tạo | `NGAY_MOC_DAT` | 8 | +12 THÁNG | Cứng | Nhà trường tổ chức trong vòng 12 tháng kể từ ngày mốc 8 được thông qua |

---

## 3. Quy Định Phương Thức Đào Tạo

Theo Quyết định số 655/QĐ-ĐHAG, hệ thống hiển thị chính xác tên phương thức đào tạo:

1. **Phương thức 1**: **Nghiên cứu chuyên sâu toàn thời gian**
   - Áp dụng cho NCS dành trọn vẹn thời gian học tập, nghiên cứu tại cơ sở đào tạo.
   - Thời gian chính quy: 36 tháng (đối với người có bằng Thạc sĩ) hoặc 48 tháng (đối với người có bằng Đại học).
2. **Phương thức 2**: **Nghiên cứu kết hợp các học phần chuyên môn**
   - Áp dụng cho NCS vừa hoàn thành các học phần bổ sung/nâng cao, vừa thực hiện đề tài luận án.
   - Thời gian chính quy: 36 tháng (đối với người có bằng Thạc sĩ) hoặc 48 tháng (đối với người có bằng Đại học).

---

## 4. Quy Định Hồ Sơ Minh Chứng, Phiếu Điểm & Quyết Định Pháp Lý

1. **File Quyết định học vụ của NCS (`QuyetDinh`):**
   - Lưu trữ tại `document-service` với `fileId`.
   - Các quyết định: Công nhận NCS, Giao đề tài, Phân công GVHD, Thành lập tiểu ban chấm, Gia hạn học tập, Công nhận tốt nghiệp...
   - Người dùng (Giáo vụ, GVHD, NCS) có quyền xem trực tiếp dạng PDF và tải về máy.
2. **File Minh chứng mốc (`MinhChungMoc`):**
   - Mỗi lần nộp mốc được lưu trữ 1 dòng với `fileId` (tệp PDF dung lượng tối đa 15MB).
   - Lưu vết toàn bộ lịch sử các lần nộp (kể cả lần bị từ chối) kèm ghi chú NCS và lý do từ chối của Giáo vụ.
   - Có thể xem trực tiếp trên giao diện và tải về máy bản gốc đã nộp.
3. **Phiếu điểm / Phiếu nhận xét đánh giá (`PhieuNhanXet`):**
   - Áp dụng bắt buộc cho các mốc có yêu cầu điểm (Mốc 2, Mốc 4, Mốc 5).
   - Điều kiện nghiệm thu mốc: Phải có **ít nhất 3 phiếu chấm** của Hội đồng/chuyên gia và **Điểm trung bình cộng $\ge 7.0$**.
   - Được số hóa và lưu trữ trực tiếp dưới dạng trường dữ liệu CSDL (họ tên chuyên gia chấm, cơ quan công tác/đơn vị, điểm số thang 10, nội dung nhận xét chi tiết), không đính kèm tệp file riêng biệt.
   - Giao diện hiển thị trực quan thông tin điểm số và nhận xét của từng thành viên hội đồng ngay trong thẻ minh chứng của mốc mà không cần tệp tải về.
