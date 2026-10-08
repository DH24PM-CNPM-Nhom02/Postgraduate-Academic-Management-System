TRƯỜNG ĐẠI HỌC AN GIANG
KHOA CÔNG NGHỆ THÔNG TIN
-----------------------------------

ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
PHÂN HỆ QUẢN LÝ QUÁ TRÌNH ĐÀO TẠO TIẾN SĨ

| Tên dự án | Hệ thống Quản lý Học vụ Sau đại học (Phân hệ Đào tạo Tiến sĩ) |
| --- | --- |
| Mô tả ngắn | Đặc tả chi tiết các yêu cầu quản lý tiến trình 9 mốc nghiên cứu, công bố khoa học, lý lịch khoa học và định mức hướng dẫn của GVHD, và quy trình bảo vệ luận án 3 cấp cho Nghiên cứu sinh. |
| Phiên bản SRS | V2.0 |
| Ngày tạo | 12/09/2026 |
| Phạm vi thực hiện | Chỉ tập trung Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ |
| Tài liệu tham khảo | Thông tư 18/2021/TT-BGDĐT, Quyết định 655/QĐ-ĐHAG, Tài liệu đặc tả yêu cầu |

# MỤC LỤC

# 1. GIỚI THIỆU (INTRODUCTION)

## 1.1 Mục đích tài liệu

Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) này được biên soạn nhằm định nghĩa chi tiết và toàn diện các yêu cầu chức năng, phi chức năng, các quy tắc nghiệp vụ (Business Rules), mô tả luồng sử dụng (Use Cases), luồng dữ liệu (DFD) và phác thảo cơ sở dữ liệu cho Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ thuộc Hệ thống Quản lý Học vụ Sau đại học tại Trường Đại học An Giang. Tài liệu đóng vai trò là hợp đồng kỹ thuật và bản cam kết giữa Ban Quản lý Đào tạo, Phòng Đào tạo SĐH, các Khoa chuyên môn và đội ngũ phát triển phần mềm.

## 1.2 Phạm vi dự án

Phạm vi bao gồm (Included):
• Quản lý và trực quan hóa tiến trình đào tạo Tiến sĩ cá nhân hóa qua sơ đồ 9 mốc bắt buộc (từ Nhập học, Tiểu luận tổng quan, Đề cương chi tiết, Chuyên đề 1 và 2, Bảo vệ giữa kỳ, Seminar cuối khóa, Bảo vệ cấp Bộ môn, đến Bảo vệ cấp Trường và Phản biện kín).
• Quy trình nộp, kiểm tra và phê duyệt các tệp minh chứng đính kèm dạng PDF (dung lượng tối đa 15MB) cho từng mốc tiến độ theo cơ chế tuần tự cứng (mốc N Passed mới mở khóa mốc N+1).
• Quản lý và kiểm tra chuẩn công bố khoa học (WoS/Scopus, chương sách quốc tế, điểm công trình HĐGSNN >= 2.0) của Nghiên cứu sinh trước khi mở mốc bảo vệ luận án (Theo điều 9; điều 13 khoản 6 và khoản 7; điều 21 khoản 7; điều 23 khoản 1c - 655/QĐ-ĐHAG - 16/03/2026).
• Quản lý Lý lịch khoa học và kiểm soát tự động định mức hướng dẫn tối đa của Giảng viên hướng dẫn (GS tối đa 07 NCS, PGS tối đa 05 NCS, TS tối đa 03 NCS).
• Số hóa quy trình Đánh giá luận án 3 cấp (Đánh giá luận án cấp đơn vị chuyên môn, Phản biện độc lập luận án, Đánh giá luận án cấp cơ sở đào tạo) và gửi Phản biện độc lập kín đối với 2 nhà khoa học ngoài trường (Theo điều 22 khoản 1; điều 23; điều 24; điều 25 - 655/QĐ-ĐHAG - 16/03/2026).
• Quản lý thời gian đào tạo chính quy (Đối với người học có bằng đại học: 04 năm học, đối với người học có bằng thạc sĩ: 03 năm học) và giới hạn buộc thôi học (6 năm / 72 tháng), hỗ trợ biểu mẫu đăng ký gia hạn học tập trực tuyến (Theo điều 5 khoản 1, 2, 3 - 655/QĐ-ĐHAG - 16/03/2026).

Phạm vi không bao gồm (Excluded):
• Quản lý tuyển sinh, chương trình đào tạo, đăng ký môn học và xét tốt nghiệp cho bậc đào tạo Thạc sĩ (đã được tách biệt khỏi phân hệ này).
• Thu chi tài chính và thanh toán học phí tổng thể của nhà trường (chỉ tiếp nhận trạng thái công nợ để phục vụ điều kiện học vụ).
• Đào tạo trình độ Đại học và Cao đẳng.

## 1.3 Đối tượng người sử dụng (Target Users/Stakeholders)

Hệ thống phục vụ trực tiếp các nhóm người dùng với vai trò và trách nhiệm rõ ràng:

• Nghiên cứu sinh (NCS): Theo dõi lộ trình 9 mốc trên Dashboard cá nhân, nộp báo cáo và biên bản minh chứng (PDF <= 15MB), khai báo bài báo khoa học, gửi đơn gia hạn học tập.

• Giảng viên hướng dẫn (GVHD): Theo dõi danh sách NCS đang hướng dẫn, theo dõi hạn ngạch cá nhân, xác nhận báo cáo tiến độ định kỳ (tháng 6 và tháng 12) và đôn đốc nghiên cứu.

• Giáo vụ Phòng Đào tạo SĐH: Kiểm tra hồ sơ minh chứng, bấm phê duyệt Passed/Rejected mốc tiến trình, ghi nhận số/ngày quyết định giao đề tài và quyết định thành lập hội đồng, gửi phản biện kín.

• Đơn vị chuyên môn / Trưởng Khoa: Phê duyệt phân công GVHD, đánh giá đề cương, tổ chức bảo vệ cấp bộ môn và quản lý lý lịch khoa học giảng viên thuộc khoa.

• Hội đồng Đánh giá và Phản biện độc lập: Đánh giá luận án tại đơn vị chuyên môn, phản biện kín ngoài trường và bỏ phiếu đánh giá luận án cấp Trường.

• Quản trị viên (System Admin): Cấu hình hệ thống, phân quyền RBAC, sao lưu dữ liệu và giám sát vận hành hạ tầng.

## 1.4 Tài liệu tham khảo (References)

• Thông tư số 18/2021/TT-BGDĐT ngày 28/06/2021 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Quy chế tuyển sinh và đào tạo trình độ tiến sĩ.

• Quyết định số 655/QĐ-ĐHAG ngày 16/03/2026 của Hiệu trưởng Trường Đại học An Giang ban hành Quy định chương trình và tổ chức đào tạo trình độ tiến sĩ.

• Tài liệu Đặc tả Yêu cầu Phần mềm (Dacta.pdf) – Nhóm 2 đã thực hiện trước đó.

• Tiêu chuẩn ISO/IEC/IEEE 29148:2018 Systems and software engineering — Life cycle processes — Requirements engineering.

# 2. MÔ TẢ TỔNG QUÁT HỆ THỐNG (SYSTEM OVERVIEW)

## 2.1 Tổng quan (Overview)

Đào tạo trình độ Tiến sĩ là bậc đào tạo cao nhất, đòi hỏi tính cá nhân hóa sâu sắc trong lộ trình nghiên cứu và sự tuân thủ khắt khe các quy định pháp lý của Bộ GDvàĐT. Phân hệ Quản lý Tiến sĩ được xây dựng như một nền tảng chuyển đổi số chuyên biệt, giúp số hóa toàn trình từ khâu công nhận NCS, phân công tập thể GVHD, kiểm soát 9 mốc tiến trình, thẩm định bài báo công bố quốc tế, đến tổ chức đánh giá luận án 3 cấp và gửi phản biện kín độc lập.

## 2.2 Mục tiêu hệ thống (System Goals)

## 1. Số hóa 100% hồ sơ minh chứng và biên bản đánh giá của 9 mốc đào tạo Tiến sĩ dưới dạng file PDF mã hóa an toàn.

## 2. Tự động hóa kiểm soát logic tiến trình tuần tự (BR-08): Mốc N đạt Passed mới tự động mở khóa mốc N+1, ngăn ngừa triệt để sai sót bỏ mốc hoặc duyệt vượt cấp.

## 3. Kiểm soát tự động định mức hướng dẫn tối đa của giảng viên (BR-09): Tự động khóa không cho phép phân công GVHD vượt quá số lượng NCS cho phép tại cùng một thời điểm.

## 4. Minh bạch hóa quy trình phản biện kín và đánh giá 3 cấp (BR-02): Bảo đảm tính độc lập, lưu trữ vĩnh viễn phiếu điểm, biên bản bỏ phiếu và lịch sử chỉnh sửa luận án.

## 2.3 Dòng quy trình hiện tại (Current Workflow)

Trước khi triển khai hệ thống số hóa, quy trình quản lý NCS tại nhà trường gặp nhiều rào cản hành chính:

• Theo dõi thủ công bằng file Excel rời rạc dẫn đến nguy cơ thất lạc dữ liệu hoặc chậm trễ thông báo thời hạn gia hạn đào tạo (6 năm).

• NCS phải nộp nhiều bản cứng hồ sơ, biên bản chấm điểm tiểu luận và chuyên đề trực tiếp cho Phòng Đào tạo SĐH gây tốn kém thời gian và chi phí đi lại.

• Khó khăn trong việc kiểm soát công khai hạn ngạch hướng dẫn của giảng viên liên khoa/liên trường, dễ dẫn đến vi phạm định mức quy định của Bộ GDvàĐT.

• Quy trình gửi phản biện độc lập kín phụ thuộc vào thư bưu điện, khó theo dõi tiến độ phản biện và quản lý bảo mật bản thảo luận án.

## 2.4 Quy trình được đề xuất (Proposed Workflow)

Quy trình mới trên hệ thống trực tuyến được chuẩn hóa như sau:

Bước 1: Khởi tạo hồ sơ NCS trên Cổng thông tin, lưu Quyết định công nhận NCS, đề tài dự kiến và phân công tập thể GVHD (kiểm tra định mức tự động).

Bước 2: NCS thực hiện lộ trình qua 9 mốc tiến trình. Tại mỗi mốc, NCS nộp báo cáo và file minh chứng PDF (max 15MB) lên Portal.

Bước 3: Giáo vụ SĐH thẩm định hồ sơ, kiểm tra điểm số hội đồng (tiểu luận/chuyên đề >= 7.0/10) và chọn 'Duyệt' (Passed). Hệ thống tự động mở khóa mốc tiếp theo.

Bước 4: NCS khai báo công bố khoa học. Hệ thống đối chiếu chuẩn WoS/Scopus/Chương sách và tổng điểm công trình (>= 2.0) để kích hoạt mốc Bảo vệ.

Bước 5: Hệ thống hỗ trợ quản lý quy trình Bảo vệ 3 cấp và gửi Phản biện độc lập kín (2 nhà khoa học ngoài trường), lưu vết phiếu bỏ phiếu và bản chỉnh sửa cuối cùng (Mốc 8 và 9).

# 3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

Các yêu cầu chức năng (FR) dành riêng cho Phân hệ Quản lý Tiến sĩ được phân loại ưu tiên: MUST (Bắt buộc), SHOULD (Nên có), COULD (Tùy chọn).

## 3.1 Nhóm 1: Quản lý Tiến trình 9 Mốc Đào tạo Tiến sĩ

| Mã YC | Tiêu đề yêu cầu | Mô tả chi tiết chức năng | Ưu tiên |
| --- | --- | --- | --- |
| FR1.1 | Sơ đồ 9 Mốc tiến trình | Hiển thị sơ đồ Timeline trực quan hóa 9 mốc tiến trình đào tạo cá nhân cho NCS và Giáo vụ theo dõi. | MUST |
| FR1.2 | Nộp hồ sơ và minh chứng PDF | Cho phép NCS nhập thông tin điểm, upload file PDF minh chứng (max 15MB) cho từng mốc tiến trình. | MUST |
| FR1.3 | Ràng buộc tiến trình tuần tự | Tự động khóa không cho NCS nộp mốc N+1 khi mốc N chưa đạt trạng thái 'Passed' (BR-08). | MUST |
| FR1.4 | Phê duyệt mốc đào tạo | Cho phép Giáo vụ duyệt 'Passed' hoặc từ chối 'Rejected' (bắt buộc nhập lý do) kèm thông báo tự động. | MUST |
| FR1.5 | Ghi nhận Quyết định pháp lý | Lưu số/ngày Quyết định giao đề tài, thành lập tiểu ban. Tuyệt đối không xóa hard delete (BR-04). | MUST |
| FR1.6 | Cảnh báo thời hạn 72 tháng | Tự động tính toán ngày quá hạn chính quy (3-4 năm) và ngày buộc thôi học (6 năm / 72 tháng), cảnh báo đỏ. | SHOULD |

## 3.2 Nhóm 2: Quản lý Công bố Khoa học và Chuẩn Đầu ra

| Mã YC | Tiêu đề yêu cầu | Mô tả chi tiết chức năng | Ưu tiên |
| --- | --- | --- | --- |
| FR2.1 | Khai báo bài báo khoa học | Cho phép NCS khai báo tên bài báo, tạp chí, ISSN, link URL, tác giả và upload file minh chứng PDF. | MUST |
| FR2.2 | Thẩm định danh mục công bố | Cho phép Giáo vụ đối soát, xác nhận bài báo thuộc WoS/Scopus/Chương sách quốc tế hoặc HĐGSNN. | MUST |
| FR2.3 | Tính điểm công trình tự động (điểm này đạt yêu cầu → cho phép NCS đăng ký mốc 8) | Hệ thống tự động cộng dồn điểm công trình quy đổi, kiểm tra điều kiện đạt tổng điểm >= 2.0. | MUST |
| FR2.4 | Xét miễn Phản biện độc lập | Tự động xác nhận miễn phản biện độc lập nếu NCS có ít nhất 3 công trình WoS/Scopus (1 bài Q2/Rank B). | SHOULD |

## 3.3 Nhóm 3: Quản lý Lý lịch Khoa học và Định mức Hướng dẫn GVHD

| Mã YC | Tiêu đề yêu cầu | Mô tả chi tiết chức năng | Ưu tiên |
| --- | --- | --- | --- |
| FR3.1 | Cơ sở dữ liệu lý lịch GVHD | Lưu trữ thông tin học hàm, học vị, chuyên ngành, công tác và lịch sử công bố 5 năm gần nhất của giảng viên. | MUST |
| FR3.2 | Kiểm soát định mức hướng dẫn | Tự động kiểm tra hạn ngạch: GS max 7 NCS, PGS max 5 NCS, TS max 3 NCS tại cùng thời điểm (BR-09). | MUST |
| FR3.3 | Khóa phân công quá hạn ngạch | Hệ thống cảnh báo đỏ và tự động khóa nút lưu nếu gán GVHD vượt quá định mức cho phép. | MUST |

## 3.4 Nhóm 4: Quản lý Quy trình Bảo vệ Luận án 3 Cấp và Phản biện Kín (Mốc 8 và 9)

| Mã YC | Tiêu đề yêu cầu | Mô tả chi tiết chức năng | Ưu tiên |
| --- | --- | --- | --- |
| FR4.1 | Đánh giá cấp Bộ môn (Giai đoạn 1 – mốc 8) | Ghi nhận kết quả đánh giá của Hội đồng cấp cơ sở (>= 5 thành viên, tán thành >= 4/5 hoặc 5/6, 6/7) mỗi người trong hội đồng sẽ có 1 form phiếu nhận xét để nhập và lưu lại trong hệ thống tương ứng với 1 nghiên cứu sinh. | MUST |
| FR4.2 | Gửi Phản biện độc lập kín (Giai đoạn 2 – trung gian bắt buộc giữa mốc 8 và 9) | Quản lý danh sách gửi 2 nhà khoa học ngoài trường phản biện kín. Xử lý gửi phản biện thứ 3 nếu có 1 ý kiến không đồng ý. | MUST |
| FR4.3 | Đánh giá cấp Trường (Giai đoạn 3 – mốc 9) | Ghi nhận quyết định thành lập hội đồng cấp Trường, phiếu bỏ phiếu, biên bản họp và bản luận án sửa đổi PDF. | MUST |
| FR4.4 | Xử lý kết quả không đạt | Ghi nhận trả luận án về bảo vệ lại cấp bộ môn nếu phản biện độc lập lần 2 không đạt. Chặn PB3 lần thứ ba. | MUST |

# 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

## 4.1 Yêu cầu hiệu năng (Performance)

• Tải đồng thời: Đảm bảo phục vụ mượt mà tối thiểu 200 truy cập đồng thời của NCS, GVHD và Giáo vụ mà không phát sinh lỗi HTTP 5xx.

• Thời gian phản hồi: Các API truy xuất dữ liệu (GET) phản hồi trong dưới 2.0 giây. Tác vụ upload file minh chứng PDF (max 15MB) xử lý trong dưới 5.0 giây.

## 4.2 Yêu cầu bảo mật (Security)

• Mã hóa mật khẩu: Sử dụng thuật toán Bcrypt với Work Factor >= 10.

• Quản lý phiên: Chuẩn JWT Token (thời hạn 15 phút) lưu trữ HttpOnly Cookie chống tấn công XSS/CSRF.

• Nhật ký nhật ký (Audit Trail): Lưu vết vĩnh viễn hành vi duyệt mốc, sửa điểm, giao GVHD (bao gồm User ID, UTC Timestamp, Old Value, New Value, Client IP).

## 4.3 Yêu cầu khả dụng (Availability và Backup)

• Uptime hệ thống: Cam kết tỷ lệ hoạt động đạt 99.5% liên tục 24/7.

• Sao lưu dữ liệu: Tự động sao lưu MariaDB hàng ngày vào lúc 02:00 AM, lưu trữ mã hóa độc lập trên Cloud Storage (Retention Policy 30 ngày). RTO <= 4 giờ, RPO <= 24 giờ.

## 4.4 Yêu cầu khả năng bảo trì (Maintainability)

• Mã nguồn Backend xây dựng bằng NestJS Microservices, Frontend bằng NextJS 14+, tuân thủ thiết kế Clean Architecture.

• Cung cấp đầy đủ tài liệu API Specification theo chuẩn OpenAPI / Swagger.

## 4.5 Yêu cầu tính tương thích (Compatibility)

• Hỗ trợ hiển thị mượt mà trên các trình duyệt phổ biến: Google Chrome 90+, Safari 14+, Microsoft Edge 90+ trên PC, Laptop, Tablet và Mobile.

# 5. RÀNG BUỘC VÀ GIẢ ĐỊNH (CONSTRAINTS và ASSUMPTIONS)

## 5.1 Ràng buộc kỹ thuật (Technical Constraints)

• Kiến trúc Backend NestJS Microservices chạy trên hạ tầng Container Docker.

• Cơ sở dữ liệu quan hệ MariaDB, hỗ trợ lưu trữ dữ liệu JSON linh hoạt.

• Tệp đính kèm minh chứng bắt buộc định dạng PDF, dung lượng không quá 15MB/file (có thể dùng cloud bên thứ 3 như Cloudflare R2 hoặc AWS S3).

## 5.2 Ràng buộc kinh doanh và Thời gian (Business Constraints)

• Triển khai phân hệ Tiến sĩ theo đúng tiến độ phê duyệt của Ban Giám hiệu Trường Đại học An Giang.

## 5.3 Ràng buộc quy định (Regulatory Constraints)

• Bắt buộc tuân thủ nghiêm ngặt các quy định của Thông tư 18/2021/TT-BGDĐT và Quyết định 655/QĐ-ĐHAG.

## 5.4 Giả định (Assumptions)

• NCS và GVHD có thiết bị kết nối Internet để thực hiện thao tác trực tuyến.

• Máy chủ hạ tầng của Trường Đại học An Giang hoạt động ổn định.

# 6. CÁC TRƯỜNG HỢP SỬ DỤNG (USE CASES)

## 6.1 Bảng tổng hợp Danh sách 12 Use Cases

Dưới đây là bảng thống kê toàn bộ 12 Use Cases bao phủ toàn bộ vòng đời học vụ và nghiên cứu của Nghiên cứu sinh Tiến sĩ:

| ID | Use Case | Actor chính | Mục đích nghiệp vụ |
| --- | --- | --- | --- |
| UC-PHD-01 | Xem tiến trình đào tạo | NCS, GVHD, Giáo vụ | Xem các mốc, trạng thái (Passed/Pending/Locked) và đếm ngược deadline mốc tiếp theo. |
| UC-PHD-02 | Nộp minh chứng mốc đào tạo | NCS | Nộp thông tin báo cáo + upload file PDF minh chứng (max 15MB) cho mốc đang mở. |
| UC-PHD-03 | Xem xét minh chứng | Giáo vụ / ĐVCM | Kiểm tra chi tiết hồ sơ và file đính kèm do NCS đã nộp trên hệ thống. |
| UC-PHD-04 | Nhận xét/đánh giá mốc đào tạo | Người chấm / Hội đồng | Điền trực tiếp phiếu nhận xét online, chấm điểm tiểu luận/chuyên đề nếu có. |
| UC-PHD-05 | Phê duyệt kết quả mốc | Giáo vụ / ĐVCM | Xác nhận kết quả Passed (mở mốc tiếp theo) hoặc Rejected (nhập lý do từ chối). |
| UC-PHD-06 | Quản lý đề tài và GVHD | Giáo vụ / ĐVCM | Ghi nhận tên đề tài, phân công tập thể GVHD, kiểm soát tự động định mức hướng dẫn (BR-09). |
| UC-PHD-07 | Đề nghị thay đổi đề tài/GVHD | NCS, GVHD | Gửi yêu cầu điều chỉnh tên đề tài hoặc thay đổi GVHD; Giáo vụ duyệt và lưu quyết định mới. |
| UC-PHD-08 | Xác nhận công bố khoa học | NCS, Giáo vụ / ĐVCM | NCS khai báo bài báo; Giáo vụ/ĐVCM kiểm tra danh mục WoS/Scopus/HĐGSNN và tính tổng điểm (>= 2.0). |
| UC-PHD-09 | Đăng ký bảo vệ luận án | NCS | Nộp hồ sơ đăng ký bảo vệ cấp Đơn vị chuyên môn (Mốc 8) hoặc cấp Trường (Mốc 9) khi đủ điều kiện. |
| UC-PHD-10 | Tổ chức và đánh giá bảo vệ | Hội đồng / ĐVCM | Quản lý hội đồng bảo vệ 3 cấp, gửi phản biện kín, lập phiếu đánh giá online và lưu biên bản. |
| UC-PHD-11 | Nộp minh chứng sau bảo vệ | NCS | Nộp minh chứng như quyết định, phiếu nhận xét của Hội đồng |
| UC-PHD-12 | Xét và hoàn tất tốt nghiệp | Giáo vụ / ĐVCM | Kiểm tra tự động toàn bộ điều kiện (9 mốc Passed, đủ CĐR ngoại ngữ, tài chính) và cấp bằng. |

# Hình 1. Sơ đồ Use case tổng quan của hệ thống

## 6.2 Đặc tả Kịch bản Chi tiết các Use Cases Cốt lõi

### 6.2.1 Use Case 1: UC-PHD-01, UC-PHD-02 & UC-PHD-03 — Nộp và Xem xét Minh chứng Mốc Đào tạo Tiến sĩ

| Mã & Tên Use Case | UC-PHD-01, UC-PHD-02 & UC-PHD-03: Nộp và Xem xét Minh chứng Mốc Đào tạo Tiến sĩ |
| --- | --- |
| Tác nhân chính | Nghiên cứu sinh (NCS), Giáo vụ Phòng Đào tạo SĐH / ĐVCM |
| Mô tả ngắn gọn | NCS xem lộ trình 9 mốc, nộp báo cáo và tệp minh chứng PDF (<= 15MB). Giáo vụ/ĐVCM truy cập xem xét hồ sơ chi tiết. |
| Điều kiện tiên quyết | 1. NCS và Giáo vụ đăng nhập thành công vào Cổng thông tin.
2. Mốc N-1 đã đạt trạng thái Passed (tick xanh).
3. Mốc N đang ở trạng thái 'Đang mở khóa' (Unlocked). |
| Sự kiện kích hoạt | NCS nhấp chọn mốc hiện tại trên sơ đồ Timeline tiến trình. |
| Luồng sự kiện chính | 1. NCS chọn mốc tiến trình đang mở (VD Mốc 2: Tiểu luận tổng quan).
2. NCS nhập thông tin báo cáo và chọn upload tệp PDF minh chứng (max 15MB).
3. NCS nhấn 'Gửi phê duyệt'. Hệ thống chuyển trạng thái mốc sang 'Pending Review' và thông báo cho Giáo vụ.
4. Giáo vụ / ĐVCM tiếp nhận thông báo, mở giao diện xem xét minh chứng.
5. Giáo vụ kiểm tra tính đầy đủ của tệp PDF và hợp lệ của thông tin khai báo. |
| Luồng thay thế | A1. Hồ sơ thiếu thông tin:
- Tại bước 5, nếu file không rõ ràng, Giáo vụ chọn 'Yêu cầu bổ sung' và gửi thông báo cho NCS. |
| Luồng ngoại lệ | E1. Tệp upload sai định dạng hoặc quá dung lượng:
- Tại bước 2, nếu file không phải PDF hoặc > 15MB, hệ thống báo lỗi ngay trên giao diện và chặn nhấn Gửi.
E2. Vi phạm ràng buộc mốc tuần tự (BR-08):
- Hệ thống tự động chặn nộp mốc N+1 nếu mốc N chưa Passed. |
| Điều kiện hậu quyết | Hồ sơ minh chứng được ghi nhận trên hệ thống ở trạng thái Pending Review sẵn sàng cho bước chấm điểm / phê duyệt. |

# Hình 2. Sơ đồ tuần tự của Use case Nộp và Xem xét Minh chứng Mốc Đào tạo Tiến sĩ

### 6.2.2 Use Case 2: UC-PHD-04 & UC-PHD-05 — Lập Phiếu Nhận xét Online & Phê duyệt Kết quả Mốc

| Mã & Tên Use Case | UC-PHD-04 & UC-PHD-05: Lập Phiếu Nhận xét Online & Phê duyệt Kết quả Mốc |
| --- | --- |
| Tác nhân chính | Người chấm / Thành viên Hội đồng, Giáo vụ Phòng Đào tạo SĐH / ĐVCM |
| Mô tả ngắn gọn | Thành viên tiểu ban/hội đồng xem minh chứng online và điền Phiếu nhận xét / điểm số trực tuyến. Giáo vụ xác nhận kết quả Passed/Rejected để chuyển mốc. |
| Điều kiện tiên quyết | 1. Mốc N của NCS đang ở trạng thái Pending Review.
2. Thành viên chấm điểm / Giáo vụ được cấp quyền truy cập đợt đánh giá. |
| Sự kiện kích hoạt | Người chấm hoặc Giáo vụ mở danh sách hồ sơ cần đánh giá. |
| Luồng sự kiện chính | 1. Người chấm xem tệp minh chứng PDF của NCS trực tuyến trên trình duyệt.
2. Người chấm mở Form 'Phiếu nhận xét Online', nhập nội dung nhận xét, đánh giá ưu/nhược điểm và nhập điểm số (thang điểm 10, lẻ 1 chữ số thập phân).
3. Người chấm nhấn 'Lưu Phiếu nhận xét'. Hệ thống lưu trữ vĩnh viễn phiếu nhận xét vào CSDL.
4. Giáo vụ kiểm tra tổng hợp phiếu nhận xét: xác nhận điểm trung bình >= 7.0/10, chênh lệch điểm <= 3.0 điểm.
5. Giáo vụ bấm 'Phê duyệt Passed'. Hệ thống cập nhật mốc N sang 'Passed' (tick xanh) và tự động mở khóa mốc N+1. |
| Luồng thay thế | A1. Từ chối kết quả mốc:
- Tại bước 5, nếu điểm trung bình < 7.0 hoặc nhận xét không đạt, Giáo vụ chọn 'Rejected' và ghi rõ lý do.
- Hệ thống chuyển mốc về trạng thái Rejected, gửi email thông báo yêu cầu NCS nộp lại. |
| Luồng ngoại lệ | E1. Điểm chấm chênh lệch quá 3.0 điểm giữa các người chấm:
- Tại bước 4, hệ thống phát hiện chênh lệch điểm > 3.0, đưa ra cảnh báo yêu cầu Tiểu ban họp thống nhất lại điểm trước khi duyệt. |
| Điều kiện hậu quyết | Phiếu nhận xét online được lưu vết vĩnh viễn (Audit Log), mốc N chuyển Passed, mốc N+1 được mở khóa. |

# Hình 3. Sơ đồ tuần tự của Use case Lập Phiếu Nhận xét Online & Phê duyệt Kết quả Mốc

### 6.2.3 Use Case 3: UC-PHD-06 & UC-PHD-07 — Quản lý Đề tài, GVHD & Đề nghị Điều chỉnh

| Mã & Tên Use Case | UC-PHD-06 & UC-PHD-07: Quản lý Đề tài & GVHD |
| --- | --- |
| Tác nhân chính | Nghiên cứu sinh (NCS), Giảng viên hướng dẫn (GVHD), Giáo vụ |
| Mô tả ngắn gọn | Quản lý thông tin tên đề tài, phân công tập thể GVHD và xử lý các yêu cầu điều chỉnh tên đề tài hoặc GVHD. |
| Điều kiện tiên quyết | NCS đã khởi tạo hồ sơ ở Mốc 1; Thông tin lý lịch GVHD có sẵn trong CSDL. |
| Sự kiện kích hoạt | NCS chọn đăng ký tên đề tài dự kiến / nộp đơn xin đổi đề tài, hoặc Giáo vụ chọn phân công GVHD. |
| Luồng sự kiện chính | 1. NCS nhập Tên đề tài dự kiến ở Mốc 1 (hoặc gửi đơn xin điều chỉnh tên đề tài/GVHD).
2. Giáo vụ ghi nhận Số/Ngày Quyết định giao đề tài chính thức và chọn GVHD.
3. Hệ thống kiểm tra tự động định mức hướng dẫn (GS <= 7, PGS <= 5, TS <= 3 NCS). Nếu hợp lệ, hệ thống lưu bản ghi và hiển thị trên Cổng thông tin NCS. |
| Luồng ngoại lệ | E1. Phân công vượt hạn ngạch quy định (BR-09): Nếu GVHD đã đủ hạn ngạch, hệ thống báo lỗi và không cho lưu phân công. |
| Điều kiện hậu quyết | Tên đề tài chính thức và tập thể GVHD được ghi nhận chính thức trên hệ thống. |

# Hình 4. Sơ đồ tuần tự của Use case Quản lý Đề tài, GVHD & Đề nghị Điều chỉnh

### 6.2.4 Use Case 4: UC-PHD-08 — Xác nhận Công bố Khoa học & Chuẩn Đầu ra

| Mã & Tên Use Case | UC-PHD-08: Xác nhận Công bố Khoa học & Chuẩn Đầu ra |
| --- | --- |
| Tác nhân chính | Nghiên cứu sinh (NCS), Giáo vụ / ĐVCM |
| Mô tả ngắn gọn | NCS khai báo danh mục bài báo khoa học đã công bố. Giáo vụ/ĐVCM đối soát danh mục WoS/Scopus/HĐGSNN và tính tổng điểm công trình (>= 2.0 điểm). |
| Điều kiện tiên quyết | 1. NCS đã hoàn thành học phần tiến sĩ, Tiểu luận tổng quan và 2 Chuyên đề.
2. Bài báo công bố ghi tên Trường Đại học An Giang và ĐHQG-HCM. |
| Sự kiện kích hoạt | NCS mở chức năng Khai báo công bố khoa học trên Student Portal. |
| Luồng sự kiện chính | 1. NCS nhập Tên bài báo, Tạp chí, mã ISSN, Năm công bố, Link URL và upload file PDF minh chứng.
2. NCS chọn Phương thức đào tạo (Phương thức 1 hoặc Phương thức 2) và gửi khai báo.
3. Giáo vụ đối soát mã ISSN và tạp chí trên CSDL danh mục WoS/Scopus/HĐGSNN đã cấu hình.
4. Đơn vị chuyên môn xác nhận bài báo có nội dung phù hợp với đề tài luận án.
5. Hệ thống tính điểm quy đổi công trình (Phương thức 2: tổng điểm >= 2.0; Phương thức 1: đủ 3 bài WoS/Scopus có 1 bài Q2/rank B).
6. Hệ thống xác nhận 'Đạt chuẩn công bố khoa học' và mở điều kiện đăng ký Mốc 8 (Bảo vệ cấp Bộ môn). |
| Luồng thay thế | A1. Công trình là Bằng độc quyền sáng chế:
- NCS upload văn bằng sáng chế thay thế bài báo khoa học. |
| Luồng ngoại lệ | E1. Bài báo không nằm trong danh mục quy định:
- Giáo vụ chọn 'Từ chối', hệ thống thông báo yêu cầu NCS bổ sung bài báo mới. |
| Điều kiện hậu quyết | Công bố khoa học được xác nhận, tổng điểm công trình ghi nhận CSDL, kích hoạt điều kiện bảo vệ luận án. |

# Hình 5. Sơ đồ tuần tự của Use case Xác nhận Công bố Khoa học & Chuẩn Đầu ra

### 6.2.5 Use Case 5: UC-PHD-09 & UC-PHD-10 — Đăng ký, Tổ chức & Đánh giá Bảo vệ Luận án (3 Cấp & Phản biện Kín)

| Mã & Tên Use Case | UC-PHD-09 & UC-PHD-10: Đăng ký, Tổ chức & Đánh giá Bảo vệ Luận án (3 Cấp & Phản biện Kín) |
| --- | --- |
| Tác nhân chính | NCS, Giáo vụ / ĐVCM, Hội đồng Đánh giá, Phản biện độc lập |
| Mô tả ngắn gọn | NCS đăng ký bảo vệ. Hệ thống hỗ trợ quản lý hội đồng 3 cấp, gửi phản biện độc lập kín ngoài trường, lập phiếu đánh giá online và ghi nhận biên bản. |
| Điều kiện tiên quyết | 1. Mốc 8: NCS đạt đủ tín chỉ và đạt chuẩn công bố khoa học.
2. Cấp 2: Đã bảo vệ thành công Cấp 1 (Bộ môn) tán thành >= 4/5.
3. Mốc 9: Cả 02 nhà khoa học phản biện kín chọn 'Đồng ý tán thành'. |
| Sự kiện kích hoạt | NCS nộp đơn đăng ký bảo vệ luận án tại Mốc 8 hoặc Mốc 9. |
| Luồng sự kiện chính | 1. NCS nộp hồ sơ đăng ký bảo vệ trên Cổng thông tin.
2. Giáo vụ ghi nhận Quyết định thành lập Hội đồng cấp Bộ môn (Mốc 8) hoặc cấp Trường (Mốc 9).
3. Giai đoạn Cấp 2 (Phản biện kín): Giáo vụ gửi bản thảo luận án mã hóa cho 02 nhà khoa học ngoài trường. Phản biện kín gửi phiếu nhận xét online mã hóa trong vòng 30 ngày.
4. Tại buổi họp Hội đồng (Mốc 8 hoặc Mốc 9): Các thành viên Hội đồng điền 'Phiếu đánh giá Online' và bỏ phiếu bầu.
5. Giáo vụ upload Biên bản họp hội đồng (PDF) và bản Luận án chỉnh sửa.
6. Hệ thống cập nhật kết quả 'Passed' cho đợt bảo vệ. |
| Luồng thay thế | A1. Có 01 phản biện kín không đồng ý:
- Giáo vụ gửi thêm phản biện kín thứ 3. Nếu PB3 đồng ý, luận án đạt quy trình phản biện. |
| Luồng ngoại lệ | E1. Cả 02 phản biện kín không đồng ý (hoặc Hội đồng bỏ phiếu không đạt):
- Luận án không đạt, trả về cho NCS chỉnh sửa để đăng ký bảo vệ lại cấp Bộ môn. |
| Điều kiện hậu quyết | Kết quả bảo vệ và phiếu đánh giá online lưu vĩnh viễn, mở đường cho bước xét hoàn tất tốt nghiệp. |

# Hình 6. Sơ đồ tuần tự của Use case Đăng ký, Tổ chức & Đánh giá Bảo vệ Luận án (3 Cấp & Phản biện Kín)

### 6.2.6 Use Case 6: UC-PHD-11 & UC-PHD-12 — Nộp Hồ sơ sau Bảo vệ & Xét Hoàn tất Tốt nghiệp

| Mã & Tên Use Case | UC-PHD-11 & UC-PHD-12: Nộp Hồ sơ sau Bảo vệ & Xét Hoàn tất Tốt nghiệp |
| --- | --- |
| Tác nhân chính | Nghiên cứu sinh, Giáo vụ / ĐVCM |
| Mô tả ngắn gọn | NCS nộp bản thảo luận án hoàn chỉnh sau bảo vệ và tài liệu thư viện. Hệ thống tự động kiểm tra đủ các điều kiện và khởi tạo quyết định công nhận tốt nghiệp. |
| Điều kiện tiên quyết | 1. NCS đã bảo vệ thành công Mốc 9 (Cấp Trường) đạt Passed.
2. Luận án đã được chỉnh sửa theo đúng nghị quyết của Hội đồng. |
| Sự kiện kích hoạt | NCS thực hiện thủ tục hoàn tất sau bảo vệ trên Cổng thông tin. |
| Luồng sự kiện chính | 1. NCS upload bản Luận án hoàn chỉnh (PDF) và Giấy xác nhận nộp lưu tại Thư viện Trường, Thư viện Trung tâm ĐHQG-HCM và Thư viện Quốc gia.
2. Giáo vụ đối soát bản nộp lưu và phê duyệt hoàn thành Mốc nộp hồ sơ.
3. Hệ thống kích hoạt Module quét điều kiện tốt nghiệp tự động:
 - Kiểm tra đủ 9 mốc Passed (tick xanh).
 - Kiểm tra đạt chuẩn ngoại ngữ đầu ra (IELTS >= 5.5 / VSTEP Bậc 4).
 - Kiểm tra không nợ học phí quá hạn.
4. Tất cả điều kiện thỏa mãn, hệ thống chuyển trạng thái NCS sang 'Đã tốt nghiệp'.
5. Giáo vụ xuất Quyết định công nhận học vị Tiến sĩ. |
| Luồng thay thế | A1. NCS chưa hoàn thành nộp lưu thư viện:
- Hệ thống tạm hoãn phát bằng cho đến khi có xác nhận nộp lưu. |
| Luồng ngoại lệ | E1. Phát hiện nợ tài chính hoặc thiếu chứng chỉ ngoại ngữ:
- Hệ thống cảnh báo đỏ các điều kiện còn thiếu và dừng quy trình xét tốt nghiệp. |
| Điều kiện hậu quyết | Hồ sơ NCS được lưu trữ lịch sử tốt nghiệp vĩnh viễn, Quyết định công nhận học vị được công khai trên Portal. |

# Hình 7. Sơ đồ tuần tự của Use case Nộp Hồ sơ sau Bảo vệ & Xét Hoàn tất Tốt nghiệp

# 7. SƠ ĐỒ LUỒNG DỮ LIỆU (DATA FLOW DIAGRAMS

## 7.1 Luồng dữ liệu Tổng quan (DFD Level 0)

# Hình 8. Mô hình DFD tổng quan của hệ thông

## 7.2 Luồng dữ liệu Chi tiết (DFD Level 1 - Detailed Process Flows Text Description)

### 7.2.1. Process 1.0 - Quản lý Mốc tiến trình và Minh chứng:

# Hình 9. Mô hình DFD phân rã mức 1 luồng Quản lý Mốc tiến trình và Minh chứng

### 7.2.2. Process 2.0 - Thẩm định Công bố khoa học và Chuẩn đầu ra:

# Hình 10. Mô hình DFD phân rã mức 1 luồng Thẩm định Công bố khoa học và Chuẩn đầu ra

### 7.2.3. Process 3.0 - Kiểm soát Định mức và Phân công GVHD:

# Hình 11. Mô hình DFD phân rã mức 1 luồng Kiểm soát Định mức và Phân công GVHD

### 7.2.4. Process 4.0 - Quản lý Bảo vệ 3 Cấp và Phản biện Kín:

# Hình 12. Mô hình DFD phân rã mức 1 luồng Quản lý Bảo vệ 3 Cấp và Phản biện Kín

## 7.3 Mô tả các luồng dữ liệu chính

### 1. Process 1.0 - Quản lý Mốc tiến trình và Minh chứng:

- Input: Request nộp minh chứng từ NCS -> Validate định dạng PDF và size <= 15MB -> Lưu File Store -> Tạo Record Status 'Pending Review' -> Notify Giáo vụ -> Giáo vụ duyệt -> Update Status 'Passed' -> Unlock Mốc N+1 trong DB.

### 2. Process 2.0 - Thẩm định Công bố khoa học và Chuẩn đầu ra:

- Input: Thông tin bài báo từ NCS -> Lưu Temp_CongBo -> Giáo vụ verify danh mục WoS/Scopus/HĐGS -> Update System Score -> Check Total Score >= 2.0 -> Update Student CĐR Status.

### 3. Process 3.0 - Kiểm soát Định mức và Phân công GVHD:

- Input: Yêu cầu gán GVHD cho NCS -> Query DB kiểm tra số NCS hiện tại của GVHD theo học hàm/học vị (BR-09) -> IF Valid: Lưu Quyết định gán GVHD; ELSE: Thăng cảnh báo lỗi 'Vượt định mức' và Chặn lưu.

### 4. Process 4.0 - Quản lý Bảo vệ 3 Cấp và Phản biện Kín:

- Input: Hồ sơ đủ điều kiện bảo vệ -> Khởi tạo tiến trình Bảo vệ Cấp 1 (Bộ môn) -> Gửi Phản biện độc lập kín (Cấp 2) -> Tiếp nhận 2 kết quả PB -> IF OK: Mở Bảo vệ Cấp 3 (Hội đồng cấp Trường) -> Lưu Phiếu điểm, Biên bản và File Luận án sửa đổi PDF.

# 8. PHÁC THẢO SCHEMA CƠ SỞ DỮ LIỆU (DATABASE SCHEMA OVERVIEW - PHÁC THẢO DB MẪU)

Ghi chú: Cơ sở dữ liệu được chuyển đổi và tối ưu hóa cho MariaDB 10.11+ với Engine InnoDB, bảng mã UTF8MB4, ràng buộc toàn vẹn khóa ngoại (Foreign Keys) và lưu trữ JSON chuẩn.

## 8.1 Bảng chi tiết các Entity và DDL Schema MariaDB mẫu

### 8.1.1. Table: nghien_cuu_sinh (Quản lý thông tin Học viên Tiến sĩ)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID duy nhất của NCS |
| mshv | VARCHAR(20) | UNIQUE NOT NULL | Mã số học viên sau đại học |
| ho_ten | VARCHAR(100) | NOT NULL | Họ và tên nghiên cứu sinh |
| ngay_sinh | DATE | NULL | Ngày tháng năm sinh |
| email | VARCHAR(100) | NULL | Địa chỉ email liên lạc chính |
| so_dien_thoai | VARCHAR(20) | NULL | Số điện thoại cá nhân |
| ngay_nhap_hoc | DATE | NOT NULL | Ngày công nhận nhập học chính thức |
| trinh_do_dau_vao | ENUM('THAC_SI', 'DAI_HOC') | NOT NULL DEFAULT 'THAC_SI' | Bằng cấp đầu vào |
| phuong_thuc_dao_tao | ENUM('PHUONG_THUC_1', 'PHUONG_THUC_2') | NOT NULL DEFAULT 'PHUONG_THUC_2' | Phương thức đào tạo NCS theo QĐ 655 |
| han_chinh_quy | DATE | NOT NULL | Hạn đào tạo chính quy (3 năm với Thạc sĩ, 4 năm với Đại học) |
| han_buoc_thoi_hoc | DATE | NOT NULL | Hạn tối đa buộc thôi học (6 năm / 72 tháng từ ngày nhập học) |
| trang_thai | ENUM('DANG_HOC', 'DA_TOT_NGHIEP', 'GIA_HAN', 'BUOC_THOI_HOC') | NOT NULL DEFAULT 'DANG_HOC' | Trạng thái học tập hiện tại |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời điểm tạo bản ghi |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Thời điểm cập nhật bản ghi |

### 8.1.2. Table: moc_tien_trinh (Danh mục 9 mốc bắt buộc)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | INT | PRIMARY KEY AUTO_INCREMENT | Mã mốc tiến trình (1 đến 9) |
| ten_moc | VARCHAR(100) | NOT NULL | Tên mốc (VD: 'Tiểu luận tổng quan') |
| thu_tu | INT | UNIQUE NOT NULL | Thứ tự thực hiện mốc (1 đến 9) |
| mo_ta | TEXT | NULL | Mô tả yêu cầu và kết quả cần đạt của mốc |
| bat_buoc_minh_chung | TINYINT(1) | DEFAULT 1 | Cờ bắt buộc phải nộp file PDF minh chứng |

### 8.1.3. Table: minh_chung_moc (Lịch sử nộp và phê duyệt minh chứng mốc)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID bản ghi minh chứng |
| ncs_id | CHAR(36) | NOT NULL, FK | Khóa ngoại tham chiếu `nghien_cuu_sinh.id` |
| moc_id | INT | NOT NULL, FK | Khóa ngoại tham chiếu `moc_tien_trinh.id` |
| diem_trung_binh | DECIMAL(4,2) | NULL | Điểm trung bình hội đồng (thang 10, >= 7.0) |
| file_url | VARCHAR(500) | NULL | Đường dẫn lưu file PDF minh chứng trên máy chủ |
| file_size_bytes | BIGINT | NULL | Dung lượng file bytes (giới hạn <= 15MB) |
| trang_thai | ENUM('CHUA_MO_KHOA', 'PENDING_REVIEW', 'PASSED', 'REJECTED') | NOT NULL DEFAULT 'CHUA_MO_KHOA' | Trạng thái mốc (BR-08) |
| ly_do_tu_choi | TEXT | NULL | Lý do Giáo vụ từ chối nếu status = REJECTED |
| ngay_nop | DATETIME | NULL | Thời điểm NCS bấm gửi phê duyệt |
| ngay_duyet | DATETIME | NULL | Thời điểm Giáo vụ bấm duyệt Passed/Rejected |
| nguoi_duyet_id | CHAR(36) | NULL | ID của Giáo vụ thực hiện phê duyệt |

### 8.1.4. Table: cong_bo_khoa_hoc (Danh mục công bố bài báo của NCS)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID công bố khoa học |
| ncs_id | CHAR(36) | NOT NULL, FK | Khóa ngoại tham chiếu `nghien_cuu_sinh.id` |
| ten_bai_bao | VARCHAR(500) | NOT NULL | Tên đầy đủ của bài báo/báo cáo khoa học |
| ten_tap_chi_hoi_nghi | VARCHAR(255) | NOT NULL | Tên tạp chí hoặc hội nghị công bố |
| issn | VARCHAR(20) | NULL | Mã số tiêu chuẩn quốc tế ISSN của tạp chí |
| link_url | VARCHAR(500) | NULL | Đường dẫn URL bài báo công bố trực tuyến |
| file_pdf_url | VARCHAR(500) | NULL | Đường dẫn file PDF minh chứng bài báo |
| loai_danh_muc | ENUM('WOS_Q1_Q2', 'WOS_SCOPUS_KHAC', 'CHUONG_SACH_QUOC_TE', 'HDGSNN_075') | NOT NULL | Phân loại danh mục uy tín |
| diem_quy_doi | DECIMAL(3,2) | NOT NULL DEFAULT 0.00 | Điểm công trình tối đa HĐGSNN quy định |
| trang_thai_duyet | ENUM('CHO_THAM_DINH', 'DA_XAC_NHAN', 'TU_CHOI') | NOT NULL DEFAULT 'CHO_THAM_DINH' | Trạng thái thẩm định của Giáo vụ |

### 8.1.5. Table: giang_vien_huong_dan (Lý lịch khoa học GVHD)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID của Giảng viên |
| ho_ten | VARCHAR(100) | NOT NULL | Họ và tên giảng viên |
| hoc_ham_hoc_vi | ENUM('GIAO_SU', 'PHO_GIAO_SU', 'TIEN_SI_KHOA_HOC', 'TIEN_SI') | NOT NULL | Chức danh khoa học và Học vị |
| co_quan_cong_tac | VARCHAR(255) | NOT NULL | Cơ quan công tác chính thức |
| max_ncs_cho_phep | INT | NOT NULL | Hạn ngạch tối đa: GS=7, PGS=5, TS=3 (BR-09) |
| so_ncs_dang_huong_dan | DECIMAL(3,1) | NOT NULL DEFAULT 0.0 | Số NCS hiện tại (Độc lập = 1.0, Đồng HD = 0.5) |

### 8.1.6. Table: phan_cong_huong_dan (Gán tập thể GVHD cho NCS)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID bản ghi gán GVHD |
| ncs_id | CHAR(36) | NOT NULL, FK | Khóa ngoại tham chiếu `nghien_cuu_sinh.id` |
| gvhd_id | CHAR(36) | NOT NULL, FK | Khóa ngoại tham chiếu `giang_vien_huong_dan.id` |
| vai_tro | ENUM('HUONG_DAN_CHINH', 'DONG_HUONG_DAN', 'HUONG_DAN_PHU') | NOT NULL DEFAULT 'HUONG_DAN_CHINH' | Vai trò hướng dẫn |
| quyet_dinh_so | VARCHAR(50) | NOT NULL | Số hiệu quyết định giao đề tài và GVHD |
| ngay_quyet_dinh | DATE | NOT NULL | Ngày ban hành quyết định |
| trang_thai | ENUM('DANG_HIEU_LUC', 'DEACTIVATE') | NOT NULL DEFAULT 'DANG_HIEU_LUC' | Trạng thái quyết định (BR-04) |

### 8.1.7. Table: hoi_dong_bao_ve (Thông tin Hội đồng bảo vệ luận án 3 cấp)

| Tên trường (Column) | Kiểu dữ liệu (MariaDB) | Ràng buộc (Constraint) | Diễn giải nghiệp vụ |
| --- | --- | --- | --- |
| id | CHAR(36) | PRIMARY KEY | Định danh UUID đợt bảo vệ |
| ncs_id | CHAR(36) | NOT NULL, FK | Khóa ngoại tham chiếu `nghien_cuu_sinh.id` |
| cap_hoi_dong | ENUM('BO_MON_CAP_1', 'PHAN_BIEN_KIN_CAP_2', 'CAP_TRUONG_CAP_3') | NOT NULL | Cấp đánh giá luận án (BR-02) |
| ngay_bao_ve | DATE | NULL | Ngày tổ chức họp đánh giá |
| ket_qua | ENUM('CHO_BAO_VE', 'PASSED', 'REJECTED') | NOT NULL DEFAULT 'CHO_BAO_VE' | Kết quả đánh giá luận án |
| file_bien_ban_url | VARCHAR(500) | NULL | File PDF biên bản họp hội đồng |
| file_luan_an_sua_doi_url | VARCHAR(500) | NULL | File PDF luận án chỉnh sửa hoàn thiện |

# Hình 13. Sơ đồ ERD

## 8.2 Mối quan hệ giữa các Entity trong MariaDB

• One-to-Many giữa `nghien_cuu_sinh` và `minh_chung_moc`: Một NCS có nhiều bản ghi nộp minh chứng tương ứng với các mốc tiến trình.
• One-to-Many giữa `nghien_cuu_sinh` và `cong_bo_khoa_hoc`: Một NCS có nhiều bài báo công bố khoa học.
• Many-to-Many giữa `nghien_cuu_sinh` và `giang_vien_huong_dan` (thông qua bảng trung gian `phan_cong_huong_dan`): Kiểm soát hạn ngạch GS max 7, PGS max 5, TS max 3 NCS qua trigger/backend transaction trong MariaDB.
• One-to-Many giữa `nghien_cuu_sinh` và `hoi_dong_bao_ve`: Một NCS trải qua các đợt đánh giá bảo vệ 3 cấp.

# Hình 14. Sơ đồ mối quan hệ giữa các entities

# 9. TỪ ĐIỂN THUẬT NGỮ (GLOSSARY)

| Thuật ngữ / Viết tắt | Định nghĩa / Giải thích chi tiết |
| --- | --- |
| NCS | Nghiên cứu sinh (Học viên đang theo học chương trình đào tạo trình độ Tiến sĩ). |
| SĐH | Sau đại học (Bao gồm đào tạo trình độ Thạc sĩ và Tiến sĩ). |
| GVHD | Giảng viên hướng dẫn (Cá nhân hoặc tập thể giảng viên chịu trách nhiệm khoa học hướng dẫn NCS). |
| MSHV | Mã số học viên (Mã định danh duy nhất của học viên/NCS trong suốt khóa học). |
| RBAC | Role-Based Access Control (Mô hình kiểm soát truy cập hệ thống dựa trên vai trò người dùng). |
| WoS / Scopus | Web of Science / Scopus (Các cơ sở dữ liệu trích dẫn khoa học quốc tế uy tín làm chuẩn đầu ra công bố). |
| Phản biện độc lập kín | Quy trình gửi luận án tiến sĩ cho 2 nhà khoa học ngoài trường đánh giá kín không lộ danh tính. |
| AGU | Trường Đại học An Giang, Đại học Quốc gia Thành phố Hồ Chí Minh. |
| HĐGSNN | Hội đồng giáo sư nhà nước |
| ISSN | Mã số tiêu chuẩn quốc tế cho xuất bản phẩm nhiều kỳ, được sử dụng phổ biến để định danh các tạp chí khoa học, kỷ yếu hội thảo định kỳ trên toàn thế giới, gồm 8 chữ số, được chia làm hai nhóm 4 chữ số phân cách bởi dấu gạch nối. |
| CĐR | Chuẩn đầu ra |

# 10. PHÊ DUYỆT VÀ XÁC NHẬN (APPROVAL và SIGN-OFF)

Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) v2.0 - Phân hệ Quản lý Tiến sĩ này được thống nhất phê duyệt bởi các bên liên quan:

| Đại diện Khách hàng / Phòng Đào tạo | Trưởng Nhóm Phát triển | Giảng viên Hướng dẫn |
| --- | --- | --- |
| (Ký và ghi rõ họ tên)

Ngày: ..../..../2026 | (Ký và ghi rõ họ tên)

Ngày: ..../..../2026 | (Ký và ghi rõ họ tên)

Ngày: ..../..../2026 |

## Lịch sử phiên bản tài liệu

| Phiên bản | Ngày | Nội dung thay đổi | Tác giả |
| --- | --- | --- | --- |
| v1.0 | 21/08/2026 | Khởi tạo tài liệu SRS tổng thể cho hệ thống SĐH (Thạc sĩ và Tiến sĩ). | Nhóm sinh viên thực hiện |
| v2.0 | 12/09/2026 | Refactor toàn bộ tài liệu theo SRS Template chuẩn, loại bỏ các phân hệ ngoài Tiến sĩ, bổ sung chi tiết DFD luồng chữ, DB schema phác thảo, và bảng MoSCoW. | Nhóm sinh viên thực hiện |

Hết.

> **Ghi chú:** Tài liệu gốc chứa 14 hình/đối tượng nhúng. Nội dung văn bản và chú thích hình đã được chuyển sang Markdown; hình ảnh nhúng không được nhúng trực tiếp vào file `.md` này.
