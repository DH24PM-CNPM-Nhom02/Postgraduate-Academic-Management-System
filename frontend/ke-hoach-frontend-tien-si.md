KẾ HOẠCH THIẾT KẾ FRONTEND

*Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ — AGU*

Phiên bản 1.0 \| Ngày lập: 09/10/2026 \| Dựa trên SRS v2.0

1\. Tổng quan

Tài liệu này là kế hoạch thiết kế frontend cho phân hệ Quản lý Đào tạo Tiến sĩ của Trường Đại học An Giang. Căn cứ trên SRS v2.0 với 23 Use Case, 4 nhóm chức năng và 5 nhóm người dùng.

Tech Stack

|               |                                       |                                                      |
|---------------|---------------------------------------|------------------------------------------------------|
| **Hạng mục**  | **Công nghệ**                         | **Lý do chọn**                                       |
| Framework     | Next.js 15 (App Router) + TypeScript  | SRS quy định Next.js 14+; App Router tối ưu SSR      |
| UI / Styling  | Tailwind CSS + shadcn/ui (Radix)      | Headless, accessible; tương thích Chrome/Safari/Edge |
| State & Cache | TanStack Query + Zustand              | Cache API, invalidation khi mutation                 |
| Form          | react-hook-form + Zod                 | Validation nhất quán client-side                     |
| Table         | TanStack Table                        | Phân trang, lọc, sort cho danh sách NCS              |
| PDF Viewer    | react-pdf (PDF.js)                    | Xem minh chứng inline, hỗ trợ chấm điểm song song    |
| Ngày giờ      | date-fns + locale vi                  | dd/MM/yyyy, múi giờ UTC+7                            |
| Type từ API   | openapi-typescript (codegen)          | Đồng bộ type với Swagger backend                     |
| Test          | Vitest + Testing Library + Playwright | Unit, component, E2E các luồng nghiệp vụ             |

2\. Cấu trúc thư mục dự án

```text
app/
  (auth)/                    # đăng nhập, quên mật khẩu
  (student)/                 # NCS
    dashboard/               # Tổng quan & timeline 9 mốc
    milestones/[id]/         # Chi tiết mốc: nộp & xem minh chứng
    publications/            # Khai báo công bố khoa học
    defense/                 # Đăng ký bảo vệ luận án
    graduation/              # Xét hoàn tất tốt nghiệp
    extensions/              # Đơn gia hạn
  (supervisor)/              # GVHD
    students/                # Danh sách NCS đang hướng dẫn
    quota/                   # Theo dõi hạn ngạch cá nhân
    progress-reports/        # Báo cáo định kỳ tháng 6/12
  (academic)/                # Giáo vụ / ĐVCM
    review-queue/            # Hàng chờ duyệt minh chứng
    students/[id]/           # Hồ sơ NCS đầy đủ
    supervisors/             # Quản lý GVHD & hạn ngạch
    committees/              # Quản lý hội đồng bảo vệ
    publications/            # Thẩm định công bố khoa học
    blind-review/            # Gửi & theo dõi phản biện kín
    graduation-check/        # Xét tốt nghiệp
  (committee)/               # Hội đồng / Phản biện
    review-forms/[id]/       # Phiếu đánh giá & chấm điểm
    voting/[id]/             # Bỏ phiếu luận án
  (admin)/                   # Quản trị viên
    users/                   # Quản lý tài khoản & RBAC
    audit-log/               # Nhật ký thao tác
    system/                  # Cấu hình danh mục WoS/Scopus

components/
  ui/                        # shadcn/ui — Button, Dialog, Toast…
  milestone/                 # MilestoneTimeline, MilestoneCard, StatusBadge
  upload/                    # PdfUploader, PdfViewer, UploadProgress
  review/                    # ReviewForm, ScoreInput, ScoreSummaryTable
  supervisor/                # QuotaBar, SupervisorSelector
  publication/               # PublicationForm, ScoreAccumulator
  defense/                   # DefenseStepper, BlindReviewStatus
  notification/              # NotificationBell, NotificationList
  shared/                    # DeadlineCountdown, DeadlineWarningBanner

lib/
  api/                       # fetch wrappers + TanStack Query hooks
  auth/                      # JWT helpers, middleware
  schemas/                   # Zod schemas (dùng chung với BE nếu monorepo)
  utils/                     # formatDate, formatFileSize…

middleware.ts                 # RBAC: chặn route theo role từ JWT
types/                        # openapi-typescript codegen output
```

3\. Danh sách màn hình & Component

> *📌 Các màn hình được tổ chức theo vai trò người dùng. Component dùng chung đặt trong components/shared/ và components/ui/.*

|             |                                  |                                                                                         |                                                                                                                                                                                                                                                                                               |              |
|-------------|----------------------------------|-----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| **Vai trò** | **Màn hình**                     | **Component chính**                                                                     | **Wireframe mô tả bằng chữ**                                                                                                                                                                                                                                                                  | **UC**       |
| NCS         | **Dashboard / Timeline 9 mốc**   | MilestoneTimeline, MilestoneCard, StatusBadge, DeadlineCountdown, DeadlineWarningBanner | Header thông tin NCS (tên, khóa, GVHD). Thanh cảnh báo 72 tháng đổi màu (vàng \<12 tháng, đỏ \<3 tháng). Timeline ngang 9 mốc trên desktop, danh sách dọc trên mobile. Mỗi mốc có icon trạng thái (xám/xanh/vàng/đỏ/tick xanh lá) + tên mốc + ngày dự kiến. Click mốc mở side panel chi tiết. | UC-PHD-01    |
| NCS         | **Nộp minh chứng mốc**           | PdfUploader, UploadProgress, MilestoneStatusPanel                                       | Form 2 vùng: thông tin báo cáo (text) bên trái, vùng upload PDF bên phải. Validate client trước khi gửi (chỉ PDF, max 15MB). Progress bar khi upload. Nút "Gửi phê duyệt" bị khóa khi đang upload hoặc chưa có file. Sau khi gửi, form chuyển sang chế độ chỉ đọc.                            | UC-PHD-02    |
| NCS         | **Khai báo công bố khoa học**    | PublicationForm, ScoreAccumulator, PublicationList                                      | Danh sách bài báo đã khai báo + nút "Thêm bài báo mới". Form khai báo: tên bài, tạp chí, ISSN (validate XXXX-XXXX), năm, link, phương thức, upload PDF. Bên dưới: bảng tổng điểm công trình với thanh tiến độ đến ngưỡng 2.0 điểm, màu xanh khi đạt.                                          | UC-PHD-08    |
| NCS         | **Đăng ký bảo vệ luận án**       | DefenseRegistrationForm, DefenseStepper                                                 | Stepper 3 bước: Cấp Bộ môn → Phản biện kín → Cấp Trường. Điều kiện mở từng bước hiển thị rõ. Form nộp hồ sơ đăng ký (PDF luận án). Trạng thái phản biện kín chỉ hiện "Đang phản biện" / "Đã có kết quả" (ẩn danh tính).                                                                       | UC-PHD-09    |
| NCS         | **Xét hoàn tất tốt nghiệp**      | GraduationChecklist, FileUploader                                                       | Checklist: 9 mốc Passed ✓, ngoại ngữ ✓, học phí ✓, đã nộp lưu thư viện ✓. Mỗi mục có link đến nơi xử lý nếu chưa đạt. Upload Giấy xác nhận thư viện. Nút xét tốt nghiệp chỉ hiện khi tất cả ✓.                                                                                                | UC-PHD-11,12 |
| NCS         | **Đơn gia hạn học tập**          | ExtensionForm                                                                           | Form điền lý do, thời gian xin gia hạn, upload quyết định. Hiển thị lịch sử đơn đã gửi.                                                                                                                                                                                                       | FR1.6        |
| GVHD        | **Danh sách NCS đang hướng dẫn** | StudentList, QuotaBar, MilestoneProgress                                                | Bảng NCS: tên, mốc hiện tại, trạng thái, ngày deadline. QuotaBar hiển thị "2.5/3 NCS" theo màu. Click tên NCS → xem hồ sơ tóm tắt.                                                                                                                                                            | UC-PHD-01    |
| GVHD        | **Báo cáo tiến độ định kỳ**      | ProgressReportForm, StudentProgressCard                                                 | Danh sách NCS cần xác nhận (tháng 6/12). Form xác nhận per NCS: tiến độ, nhận xét, ký tên điện tử.                                                                                                                                                                                            | FR3.1        |
| Giáo vụ     | **Hàng chờ duyệt minh chứng**    | ReviewQueue, MilestoneReviewPanel, PdfViewer                                            | Bảng ưu tiên: NCS gần hạn lên đầu. Click hàng → mở side panel: thông tin mốc bên trái, PDF viewer bên phải. Nút "Passed" (xanh) và "Từ chối" (đỏ, bắt buộc nhập lý do). Badge đếm hồ sơ chờ trên menu.                                                                                        | UC-PHD-03,05 |
| Giáo vụ     | **Phiếu nhận xét & chấm điểm**   | ReviewForm, ScoreInput, ScoreSummaryTable, PdfViewer                                    | Layout 2 cột: PDF viewer trái, form nhận xét phải. Điểm thang 10, 1 chữ số thập phân. Bảng tổng hợp điểm: trung bình, chênh lệch lớn nhất, cảnh báo đỏ nếu chênh \> 3.0. Hộp xác nhận trước khi lưu (vĩnh viễn).                                                                              | UC-PHD-04    |
| Giáo vụ     | **Quản lý GVHD & phân công**     | SupervisorSelector, QuotaBar, AssignmentForm                                            | Form phân công: chọn GVHD từ dropdown, hiển thị ngay QuotaBar. Tính toán hạn ngạch client-side (Độc lập=1.0, Đồng HD=0.5) trước khi gửi. Nút Lưu bị khóa nếu vượt định mức, hiện thông báo đỏ theo đúng nguyên văn BR-09.                                                                     | UC-PHD-06,07 |
| Giáo vụ     | **Thẩm định công bố khoa học**   | PublicationReviewTable, PublicationDetail                                               | Bảng bài báo chờ thẩm định. Mỗi bài: tên, tạp chí, ISSN, link, file PDF, loại danh mục. Nút "Xác nhận" / "Từ chối". Sau khi đủ điểm, hệ thống tự unlock điều kiện mốc 8.                                                                                                                      | UC-PHD-08    |
| Giáo vụ     | **Quản lý hội đồng bảo vệ**      | CommitteeForm, DefenseTimeline, BlindReviewManager                                      | Tạo hội đồng: chọn thành viên, nhập ngày, upload quyết định PDF. Gửi phản biện kín: chọn 2 nhà khoa học ngoài trường, track trạng thái phản biện. Xử lý PB3 nếu có 1 không đồng ý.                                                                                                            | UC-PHD-10    |
| Hội đồng    | **Phiếu đánh giá online**        | CommitteeReviewForm, PdfViewer, VotingPanel                                             | Layout 2 cột: PDF luận án trái, form đánh giá phải. Các trường: nhận xét ưu điểm/hạn chế/câu hỏi, điểm. Voting panel: nút "Tán thành" / "Không tán thành" với xác nhận. Lưu vĩnh viễn.                                                                                                        | UC-PHD-04,10 |
| Admin       | **Quản lý người dùng & RBAC**    | UserTable, RoleSelector                                                                 | CRUD tài khoản, gán vai trò, reset mật khẩu. Bảng lọc theo vai trò, khoa, trạng thái.                                                                                                                                                                                                         | NFR          |
| Admin       | **Nhật ký thao tác**             | AuditLogTable, FilterPanel                                                              | Bảng audit log: User ID, UTC timestamp, hành động, giá trị cũ/mới, IP. Lọc theo ngày, người dùng, loại hành động. Chỉ đọc, không xóa được.                                                                                                                                                    | NFR-Security |

Component dùng chung quan trọng

- StatusBadge — 5 trạng thái mốc: Khóa / Đang mở / Chờ duyệt / Từ chối / Đạt. Luôn có icon + màu + chữ (không chỉ dùng màu).

- DeadlineWarningBanner — Thanh cảnh báo thời hạn 72 tháng: bình thường ẩn, vàng khi \< 12 tháng, đỏ khi \< 3 tháng.

- PdfViewer — Xem PDF ngay trên trình duyệt không cần tải về. Lazy load (next/dynamic) để tránh làm nặng bundle.

- ConfirmDialog — Bắt buộc dùng cho mọi thao tác không hoàn tác: duyệt Passed, lưu phiếu nhận xét, gửi phản biện kín, xét tốt nghiệp.

- NotificationBell — Icon chuông ở header, hiển thị số thông báo chưa đọc, dropdown danh sách thông báo.

4\. Design System & UX

Màu sắc trạng thái (Status Color Tokens)

|                     |             |             |          |
|---------------------|-------------|-------------|----------|
| **Trạng thái**      | **Màu nền** | **Màu chữ** | **Icon** |
| Khóa (Locked)       | \#F3F4F6    | \#6B7280    | 🔒       |
| Đang mở (Unlocked)  | \#EFF6FF    | \#2563EB    | 🔓       |
| Chờ duyệt (Pending) | \#FFFBEB    | \#D97706    | ⏳       |
| Từ chối (Rejected)  | \#FEF2F2    | \#DC2626    | ✕        |
| Đạt (Passed)        | \#F0FDF4    | \#16A34A    | ✓        |

Typography

- Font chính: Be Vietnam Pro — hỗ trợ đầy đủ dấu tiếng Việt, fallback: Inter, system-ui.

- Font code: Courier New / monospace — dùng trong audit log và tên file.

- Cỡ chữ: 14px body, 13px table, 12px label phụ. Không nhỏ hơn 12px để đảm bảo mobile.

Ngày giờ

- Hiển thị: dd/MM/yyyy cho ngày, dd/MM/yyyy HH:mm cho ngày giờ.

- Backend lưu UTC, frontend convert sang UTC+7 bằng date-fns với timezone offset.

- Deadline countdown hiển thị: "Còn X ngày" hoặc "Còn X tháng Y ngày".

Responsive Strategy

- Thiết kế Mobile-first. Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px.

- Timeline 9 mốc: ngang trên lg+, dọc (accordion) trên mobile.

- Bảng dữ liệu rộng: cuộn ngang trong overflow-x: auto container riêng.

- Layout 2 cột PDF Viewer + Form: chuyển thành Tab (Xem PDF \| Nhận xét) trên mobile.

Accessibility (tối thiểu WCAG AA)

- Không dùng màu làm thông tin duy nhất — luôn kèm icon và chữ.

- Tất cả input, button, upload phải có label rõ ràng (aria-label hoặc \<label\>).

- Điều hướng bằng Tab qua toàn bộ form nộp minh chứng và phiếu nhận xét.

- Focus visible rõ ràng — polyfill cho Safari 14 nếu cần.

5\. Auth, RBAC & Bảo mật phía Frontend

- JWT 15 phút lưu trong HttpOnly Cookie — không lưu localStorage.

- Auto-refresh: route handler /api/auth/refresh gọi ngầm trước khi token hết hạn. TanStack Query interceptor 401 → trigger refresh → retry request.

- middleware.ts chặn route theo role decoded từ JWT. Không chỉ ẩn menu — phải chặn cả URL trực tiếp.

- RBAC 6 role: NCS, GVHD, GIAO_VU, DON_VI_CHUYEN_MON, HOI_DONG, ADMIN. Mỗi route group chỉ cho phép role tương ứng.

- Upload PDF: validate type và size phía client trước — đây là UX, không phải bảo mật. Backend PHẢI validate lại.

- Luận án trong phản biện kín: chỉ xem trong PdfViewer, không có nút tải xuống, không in được (CSS print:hidden + PDF.js disableDownload).

> *📌 Mọi thao tác không hoàn tác phải có ConfirmDialog. Đây là biện pháp bảo vệ quan trọng trước khi dữ liệu được lưu vĩnh viễn theo BR-04.*

6\. Phân chia Sprint (9 tuần)

|              |               |                                           |                                                                                                                                                                                                                                                                                                                                                                                                     |                   |
|--------------|---------------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| **Sprint**   | **Thời gian** | **Chủ đề**                                | **Nội dung công việc**                                                                                                                                                                                                                                                                                                                                                                              | **UC liên quan**  |
| **Sprint 1** | Tuần 1–2      | **Nền tảng**                              | • Khởi tạo Next.js 15, Tailwind, shadcn/ui, TypeScript • Cấu hình route groups, middleware RBAC • Auth: login, logout, auto-refresh JWT • Design tokens, StatusBadge, layout skeleton per vai trò • Codegen type từ OpenAPI (mock Swagger)                                                                                                                                                          | Toàn bộ           |
| **Sprint 2** | Tuần 3–4      | **Timeline & Minh chứng (luồng cốt lõi)** | • MilestoneTimeline, MilestoneCard — desktop + mobile responsive • DeadlineWarningBanner (72 tháng, đổi màu) • PdfUploader: validate client, presigned URL upload, UploadProgress • PdfViewer: lazy load PDF.js • Màn hình nộp minh chứng (NCS) + xem xét hồ sơ (Giáo vụ) • Passed/Rejected flow với ConfirmDialog + lý do từ chối • E2E test luồng NCS nộp → Giáo vụ duyệt                         | UC-01,02,03,04,05 |
| **Sprint 3** | Tuần 5–6      | **GVHD, Hạn ngạch & Công bố**             | • SupervisorSelector + QuotaBar (tính toán client-side Độc lập/Đồng HD) • Khóa nút Lưu + cảnh báo vượt định mức BR-09 • Form phân công GVHD, lịch sử quyết định, Deactivate • PublicationForm (khai báo bài báo, ISSN validate) • ScoreAccumulator (thanh tiến độ điểm công trình đến 2.0) • Thẩm định công bố (Giáo vụ)                                                                            | UC-06,07,08       |
| **Sprint 4** | Tuần 7–8      | **Bảo vệ, Phản biện kín & Tốt nghiệp**    | • DefenseStepper 3 cấp: Bộ môn → Phản biện kín → Cấp Trường • CommitteeForm: thành viên hội đồng, ngày bảo vệ, quyết định PDF • BlindReviewManager: gửi PB1, PB2, xử lý PB3 • CommitteeReviewForm: layout 2 cột PDF+Form, VotingPanel, ConfirmDialog • ScoreSummaryTable: cảnh báo chênh lệch điểm \> 3.0 • GraduationChecklist: 9 điều kiện, nộp thư viện • NotificationBell + danh sách thông báo | UC-09,10,11,12    |
| **Sprint 5** | Tuần 9        | **Admin, Tối ưu & UAT**                   | • UserTable, RoleSelector (Admin) • AuditLogTable (chỉ đọc, không xóa) • Cấu hình danh mục WoS/Scopus • Tối ưu hiệu năng: bundle phân tích, lazy load, Server Components • Kiểm thử tương thích: Chrome 90+, Safari 14+, Edge 90+ • E2E Playwright đủ 6 luồng chính • UAT với Phòng Đào tạo SĐH                                                                                                     | NFR               |

> *📌 Sprint 2 (Timeline & Minh chứng) là sprint quan trọng nhất — nên demo với Giáo vụ SĐH ngay cuối tuần 4 để lấy phản hồi sớm trước khi tiếp tục.*

7\. Điểm cần làm rõ với BA / Backend trước khi code

- Trạng thái mốc: SRS enum chỉ có 4 giá trị nhưng UI cần 5 (thiếu trạng thái "Đang mở/Unlocked" tách khỏi "Chưa mở khóa"). Cần thống nhất enum với backend.

- Schema phiếu nhận xét: UC-04 lưu phiếu vĩnh viễn nhưng DB không có bảng. Frontend cần biết cấu trúc JSON trước khi render form.

- Schema người dùng, vai trò, thông báo: chưa có trong SRS — cần DB design bổ sung.

- Điều kiện tốt nghiệp (ngoại ngữ, học phí): dữ liệu lấy từ đâu? API nào? Màn hình nhập liệu ở đâu?

- Nộp lại sau Rejected: tạo bản ghi minh chứng mới hay ghi đè? Ảnh hưởng đến hiển thị lịch sử nộp.

- Bảo mật luận án phản biện kín: có cho tải xuống không? Có watermark không? Ảnh hưởng cấu hình PdfViewer.

- Phản biện kín "giữa mốc 8 và 9": là bước phụ trong mốc 9 hay mốc riêng? Ảnh hưởng logic timeline.

- Upload file: presigned URL (R2/S3) hay qua API server? Ảnh hưởng thiết kế PdfUploader.

- FR1.2 ghi "NCS nhập thông tin điểm" — không rõ NCS nhập điểm gì khi điểm do Hội đồng chấm. Cần xác nhận lại.
