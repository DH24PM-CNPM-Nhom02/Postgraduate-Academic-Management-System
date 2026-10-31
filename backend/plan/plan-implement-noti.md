
----
Qua rà soát toàn bộ các phân hệ nghiệp vụ trong hệ thống (Tiến độ học vụ, Quyết định, Phân công GVHD, Hồ sơ NCS, Tài khoản và Tác vụ ngầm), dưới đây là danh sách chi tiết các **API & Sự kiện cần được tích hợp gửi thông báo (Notification)**:

### 1. Phân hệ Tiến độ học vụ (`progress`)

| STT | API Endpoint | Hành động kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | `POST /progress/reviews/:tienTrinhId/approve` | Giáo vụ duyệt mốc | **NCS** *(và GVHD)* | `MOC_DUOC_DUYET` *(Đã làm)* | Báo NCS mốc đã đạt, mở mốc kế tiếp; báo GVHD nắm tiến độ học viên |
| **2** | `POST /progress/reviews/:tienTrinhId/reject` | Giáo vụ từ chối mốc | **NCS** *(và GVHD)* | `MOC_BI_TU_CHOI` *(Đã làm)* | Báo NCS lý do bị từ chối để nộp lại; báo GVHD hỗ trợ |
| **3** | `POST /progress/milestones/:thuTu/submit` | NCS nộp minh chứng mốc | **Giáo vụ**, **GVHD** | `NCS_NOP_MINH_CHUNG` | Báo Giáo vụ/GVHD có minh chứng mới cần đánh giá/phê duyệt |
| **4** | `POST /progress/evaluations` | Nhập phiếu nhận xét / chấm điểm mốc | **NCS**, **GVHD** | `CO_PHIEU_NHAN_XET_MOI` | Báo NCS và GVHD biết đã có đánh giá mới từ hội đồng |
| **5** | `PATCH /progress/milestones/:tienTrinhId/plan-deadline` | Giáo vụ đặt hạn kế hoạch cá nhân cho mốc | **NCS** | `CAP_NHAT_HAN_KE_HOACH` | Báo NCS biết mốc tiến độ vừa được ấn định thời hạn mới |

---

### 2. Phân hệ Quyết định học vụ (`decisions`)

| STT | API Endpoint | Hành động kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **6** | `POST /decisions` *(loại: `BAO_LUU`, `GIA_HAN`, `NGUNG_HOC`, `BUOC_THOI_HOC`, `HOC_TIEP`)* | Ban hành quyết định đổi trạng thái học tập | **NCS**, **GVHD** | `QUYET_DINH_DOI_TRANG_THAI` *(Đã có template)* | Báo NCS hiệu lực quyết định, cảnh báo khóa tài khoản (nếu bảo lưu/ngừng học) hoặc hạn học mới (nếu gia hạn) |
| **7** | `PATCH /decisions/:id/deactivate` | Hủy / Vô hiệu hóa quyết định trước đó | **NCS**, **GVHD** | `QUYET_DINH_BI_HUY` *(Đã có template)* | Báo quyết định đã bị hủy và hồ sơ NCS được phục hồi về trạng thái cũ |

---

### 3. Phân hệ Phân công GVHD (`gvhd`)

| STT | API Endpoint | Hành động kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **8** | `POST /gvhd/assignments` | Phân công GVHD cho NCS | **NCS** | `NCS_DUOC_PHAN_CONG_GVHD` *(Đã có template)* | Báo cho NCS họ tên GVHD chính / đồng hướng dẫn được giao |
| **9** | `POST /gvhd/assignments` | Phân công GVHD cho NCS | **GVHD** | `GVHD_NHAN_NCS` *(Đã có template)* | Báo cho GVHD biết vừa nhận hướng dẫn NCS mới (kèm MSHV, họ tên) |
| **10** | `PATCH /gvhd/assignments/:id/deactivate` | Rút / Hủy phân công GVHD | **GVHD**, **NCS** | `THAY_DOI_PHAN_CONG_GVHD` | Báo cho GVHD và NCS biết việc phân công hướng dẫn đã kết thúc/thay đổi |

---

### 4. Phân hệ Hồ sơ NCS & Quản lý Tài khoản (`ncs`, `auth`)

| STT | API Endpoint | Hành động kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **11** | `POST /ncs/import/confirm` | Import danh sách NCS nhưng bị lỗi tạo tài khoản Auth | **Giáo vụ**, **Admin** | `CANH_BAO_TAI_KHOAN` *(Đã có template)* | Cảnh báo nội bộ danh sách NCS chưa sinh được tài khoản đăng nhập để xử lý thủ công |
| **12** | `PATCH /ncs/:id/status` | Giáo vụ đổi trạng thái học tập trực tiếp | **NCS**, **GVHD** | `CAP_NHAT_TRANG_THAI_HOC_TAP` | Báo NCS và GVHD về sự thay đổi trạng thái hồ sơ |
| **13** | `POST /auth/change-password` | Người dùng đổi mật khẩu thành công | **Chính User đó** | `TAI_KHOAN_DOI_MAT_KHAU` | Thông báo bảo mật giúp người dùng phát hiện nếu tài khoản bị truy cập trái phép |

---

### 5. Tác vụ ngầm tự động (Scheduled Cron Jobs)

*(Dù không phải API HTTP người dùng gọi trực tiếp, nhưng đây là các tác vụ nội bộ cốt lõi cần phát tán thông báo)*

| STT | Tác vụ ngầm (Cron) | Điều kiện kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **14** | `DeadlineReminderCron` *(Chạy hàng ngày 06:00 sáng)* | Sắp đến hạn nộp mốc (còn 30 ngày, 15 ngày, 7 ngày) | **NCS**, **GVHD** | `NHAC_HAN_HOC_TAP` *(Đã có template)* | Đôn đốc NCS nộp minh chứng đúng hạn; nhắc GVHD theo dõi |
| **15** | `PeriodicReportCron` *(Chạy đầu tháng 6 và tháng 12)* | Đến kỳ báo cáo tiến độ 6 tháng (Mốc 6) | **Tất cả NCS đang học**, **GVHD** | `NHAC_HAN_HOC_TAP` | Nhắc nộp báo cáo định kỳ theo quy chế trường |
| **16** | `TrainingLimitCron` *(Chạy hàng tuần/tháng)* | NCS còn dưới 6 tháng là hết hạn 72 tháng (buộc thôi học) | **NCS**, **GVHD**, **Giáo vụ** | `CANH_BAO_HET_HAN_DAO_TAO` | Cảnh báo nguy cơ bị buộc thôi học để kịp thời làm thủ tục bảo vệ/gia hạn |

---

### 6. Phân hệ Quản trị & Hệ thống (`system`)

| STT | API Endpoint | Hành động kích hoạt | Người nhận thông báo | Mẫu thông báo (`loai`) | Mục đích thông báo |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **17** | `POST /notifications/broadcast` *(API dự kiến)* | Admin / Giáo vụ phát thông báo toàn trường | **Tất cả người dùng** *(hoặc lọc theo Role)* | `HE_THONG_CHUNG` *(Đã có template)* | Báo lịch nghỉ lễ, lịch bảo trì hệ thống, thông báo học vụ chung |




