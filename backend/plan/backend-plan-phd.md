# Backend Implementation Plan — Hệ thống Quản lý Học vụ Sau đại học
## Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ

> **Nguồn chính:** SRS Phân hệ Quản lý Tiến sĩ — V2.0, ngày 12/09/2026.  
> **Phạm vi tài liệu này:** chỉ Backend, theo kiến trúc NestJS Microservices + MariaDB + Docker, với file/document tách qua Document Service/Object Storage.

---

## 1. Mục tiêu Backend

Backend phải hiện thực toàn bộ nghiệp vụ của phân hệ Tiến sĩ, tập trung vào:

1. Quản lý hồ sơ Nghiên cứu sinh (NCS).
2. Quản lý 9 mốc tiến trình đào tạo.
3. Nộp, lưu trữ, xem xét và phê duyệt minh chứng PDF.
4. Nhận xét/chấm điểm online tại các mốc có hội đồng/người chấm.
5. Quản lý đề tài và tập thể Giảng viên hướng dẫn (GVHD).
6. Kiểm soát định mức GVHD.
7. Quản lý công bố khoa học và chuẩn đầu ra công bố.
8. Quản lý quy trình bảo vệ luận án 3 cấp và phản biện kín.
9. Quản lý hồ sơ sau bảo vệ và điều kiện hoàn tất tốt nghiệp.
10. Gửi notification cho các sự kiện nghiệp vụ.
11. Kiểm soát trạng thái học phí/công nợ phục vụ xét hoàn tất.
12. RBAC, audit log, validation, bảo mật, transaction, logging và API documentation.

SRS xác định Backend dùng NestJS Microservices, Clean Architecture, Docker và MariaDB; file PDF tối đa 15MB có thể lưu qua Cloudflare R2/AWS S3 hoặc file store tương đương.

---

# 2. Kiến trúc Backend đề xuất

## 2.1 Danh sách service

| Service | Trách nhiệm chính | Mức ưu tiên |
|---|---|---:|
| `api-gateway` | REST API cho Frontend, auth context, routing tới microservices | P0 |
| `auth-service` | Authentication, JWT, RBAC, user/role/permission | P0 |
| `student-service` | Hồ sơ NCS, thông tin học viên, trạng thái đào tạo | P0 |
| `academic-service` | Dữ liệu học vụ dùng chung, điều kiện tín chỉ/ngoại ngữ nếu hệ thống tổng có quản lý | P1 |
| `phd-service` | Toàn bộ nghiệp vụ cốt lõi của phân hệ Tiến sĩ | P0 |
| `document-service` | File PDF, metadata file, upload/download/access control | P0 |
| `notification-service` | Email/in-app notification, event notification | P1 |
| `tuition-service` | Trạng thái công nợ/học phí để kiểm tra điều kiện hoàn tất | P1 |
| `admission-service` | Dữ liệu đầu vào/tuyển sinh nếu cần liên kết hồ sơ NCS | P2 |
| `schedule-service` | Lịch bảo vệ/hội đồng nếu dùng service lịch dùng chung | P2 |

### Nguyên tắc

- `phd-service` là service nghiệp vụ trung tâm của phân hệ.
- Không để `api-gateway` chứa business logic.
- `api-gateway` chỉ xử lý HTTP contract, authentication context, mapping request/response và gọi client của service.
- Các service giao tiếp nội bộ bằng TCP/NestJS Microservices theo kiến trúc hiện tại của project.
- Không cho service truy cập trực tiếp database của service khác.
- Mỗi service sở hữu dữ liệu của mình.
- Các nghiệp vụ cần dữ liệu từ service khác phải gọi service hoặc sử dụng event phù hợp.
- Các thao tác thay đổi trạng thái quan trọng phải có audit log.
- Các nghiệp vụ nhiều bước phải có transaction trong phạm vi database của service sở hữu transaction.

---

# 3. Thứ tự triển khai tổng thể

## Phase 0 — Backend Foundation

### Việc cần làm

- [ ] Tạo cấu trúc monorepo/backend.
- [ ] Chuẩn hóa NestJS version.
- [ ] Chuẩn hóa TypeScript config.
- [ ] Thiết lập ESLint/Prettier.
- [ ] Thiết lập Docker/Docker Compose.
- [ ] Thiết lập environment config.
- [ ] Thiết lập MariaDB.
- [ ] Thiết lập Prisma ORM.
- [ ] Thiết lập Prisma migration.
- [ ] Chuẩn hóa UUID.
- [ ] Chuẩn hóa response/error format.
- [ ] Chuẩn hóa exception filter.
- [ ] Chuẩn hóa validation pipe.
- [ ] Chuẩn hóa logging.
- [ ] Thiết lập health check.
- [ ] Thiết lập Swagger/OpenAPI cho API Gateway.
- [ ] Thiết lập TCP transport giữa các microservice.
- [ ] Tạo shared DTO/interface/constants nếu cần.
- [ ] Tạo correlation/request ID.
- [ ] Tạo audit infrastructure.

### Definition of Done

- Có thể chạy toàn bộ backend bằng Docker.
- Các service khởi động độc lập.
- API Gateway gọi được service bằng TCP.
- Prisma migration chạy thành công.
- Có health endpoint.
- Có global validation/error handling.
- Có Swagger.
- Có logging và request ID.

---

# 4. `auth-service`

## 4.1 Mục tiêu

Quản lý identity và quyền truy cập.

## 4.2 Module

```text
auth-service
├── auth
├── users
├── roles
├── permissions
├── sessions
└── audit
```

## 4.3 Entity chính

### User

- `id`
- `username`
- `email`
- `password_hash`
- `status`
- `created_at`
- `updated_at`

### Role

- `id`
- `code`
- `name`

### Permission

- `id`
- `code`
- `name`

### UserRole

- `user_id`
- `role_id`

### RolePermission

- `role_id`
- `permission_id`

### Session/RefreshToken

Nếu project dùng refresh token:

- `id`
- `user_id`
- `token_hash`
- `expires_at`
- `revoked_at`

## 4.4 Role nghiệp vụ cần hỗ trợ

- NCS
- GVHD
- Giáo vụ SĐH
- Đơn vị chuyên môn
- Trưởng khoa
- Thành viên hội đồng
- Phản biện độc lập
- System Admin

## 4.5 API

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /users/:id`
- `GET /roles`
- `GET /permissions`

## 4.6 Backend rules

- Password hash bằng bcrypt work factor >= 10.
- JWT access token theo yêu cầu SRS.
- Cookie HttpOnly nếu authentication flow sử dụng cookie.
- Mọi API nghiệp vụ phải kiểm tra role/permission.
- Không tin `userId` do client gửi lên nếu có thể lấy từ authentication context.

---

# 5. `student-service`

## 5.1 Mục tiêu

Quản lý hồ sơ NCS và trạng thái học tập cơ bản.

SRS xác định entity `nghien_cuu_sinh` với mã học viên, họ tên, ngày sinh, email, ngày nhập học, trình độ đầu vào, phương thức đào tạo, hạn chính quy, hạn buộc thôi học và trạng thái học tập.

## 5.2 Module

```text
student-service
├── students
├── student-status
├── student-profile
└── academic-deadline
```

## 5.3 Entity `NghienCuuSinh`

- `id`
- `mshv`
- `ho_ten`
- `ngay_sinh`
- `email`
- `so_dien_thoai`
- `ngay_nhap_hoc`
- `trinh_do_dau_vao`
- `phuong_thuc_dao_tao`
- `han_chinh_quy`
- `han_buoc_thoi_hoc`
- `trang_thai`
- `created_at`
- `updated_at`

## 5.4 Nghiệp vụ

- Tạo hồ sơ NCS.
- Cập nhật thông tin hồ sơ.
- Tính hạn đào tạo chính quy.
- Tính hạn 72 tháng.
- Cảnh báo sắp quá hạn.
- Cập nhật trạng thái:
  - `DANG_HOC`
  - `DA_TOT_NGHIEP`
  - `GIA_HAN`
  - `BUOC_THOI_HOC`

## 5.5 API

- `POST /students`
- `GET /students`
- `GET /students/:id`
- `PATCH /students/:id`
- `GET /students/:id/status`
- `GET /students/:id/deadline`

## 5.6 Integration

`phd-service` cần lấy NCS để:

- xác định owner của tiến trình;
- hiển thị hồ sơ;
- kiểm tra trạng thái học tập;
- liên kết đề tài, GVHD, công bố và bảo vệ.

---

# 6. `phd-service` — SERVICE QUAN TRỌNG NHẤT

## 6.1 Mục tiêu

Chứa toàn bộ domain nghiệp vụ đặc thù của đào tạo Tiến sĩ.

## 6.2 Cấu trúc module

```text
phd-service
├── phd
│   ├── progress
│   ├── milestones
│   ├── evidences
│   ├── evaluations
│   ├── thesis
│   ├── supervisors
│   ├── supervisor-assignments
│   ├── change-requests
│   ├── publications
│   ├── output-standards
│   ├── defense
│   │   ├── registration
│   │   ├── department-defense
│   │   ├── peer-review
│   │   ├── university-defense
│   │   └── defense-results
│   ├── graduation
│   └── audit
└── shared
    ├── constants
    ├── enums
    ├── validators
    └── policies
```

---

# 7. `phd-service`: Milestone/Progress Module

## 7.1 9 mốc

Seed 9 mốc theo SRS:

1. Nhập học
2. Tiểu luận tổng quan
3. Đề cương chi tiết
4. Chuyên đề 1
5. Chuyên đề 2
6. Bảo vệ giữa kỳ
7. Seminar cuối khóa
8. Bảo vệ cấp Bộ môn
9. Bảo vệ cấp Trường và Phản biện kín

## 7.2 Entity

### `moc_tien_trinh`

- `id`
- `ten_moc`
- `thu_tu`
- `mo_ta`
- `bat_buoc_minh_chung`

### `tien_trinh_ncs`

Nên bổ sung entity liên kết NCS với 9 mốc:

- `id`
- `ncs_id`
- `moc_id`
- `status`
- `opened_at`
- `submitted_at`
- `passed_at`
- `rejected_at`
- `rejection_reason`
- `version`
- `created_at`
- `updated_at`

### Status đề xuất

```text
LOCKED
UNLOCKED
PENDING_REVIEW
NEED_REVISION
PASSED
REJECTED
```

## 7.3 Business rules

### BR-08 — Sequential Progress

```text
Mốc N chỉ được mở khi mốc N-1 = PASSED.
```

Đối với mốc 1:

```text
Mốc 1 mặc định UNLOCKED khi hồ sơ NCS được khởi tạo.
```

Không được dựa vào Frontend để enforce rule này.

Backend phải kiểm tra lại trong transaction.

## 7.4 API

- `GET /phd/students/:ncsId/progress`
- `GET /phd/students/:ncsId/milestones`
- `GET /phd/milestones/:id`
- `POST /phd/milestones/:id/submit`
- `POST /phd/milestones/:id/approve`
- `POST /phd/milestones/:id/reject`
- `POST /phd/milestones/:id/request-revision`

---

# 8. `phd-service`: Evidence Module

## 8.1 Mục tiêu

Quản lý minh chứng của từng mốc.

## 8.2 Entity `minh_chung_moc`

Các field tối thiểu:

- `id`
- `ncs_id`
- `moc_id`
- `file_id`
- `diem_trung_binh`
- `status`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `rejection_reason`
- `created_at`
- `updated_at`

## 8.3 Workflow

```text
NCS
 ↓
Upload PDF
 ↓
Document Service
 ↓
Create Evidence
 ↓
PENDING_REVIEW
 ↓
Reviewer
 ↓
Evaluation / Review
 ↓
PASSED / REJECTED / NEED_REVISION
```

## 8.4 Validation

- Chỉ PDF.
- Max 15MB.
- Mốc phải ở `UNLOCKED`.
- NCS chỉ được submit cho chính mình.
- Không cho submit mốc bị `LOCKED`.
- Không cho vượt mốc.

## 8.5 API

- `POST /phd/milestones/:milestoneId/evidence`
- `GET /phd/milestones/:milestoneId/evidence`
- `GET /phd/evidence/:id`
- `PATCH /phd/evidence/:id`
- `POST /phd/evidence/:id/submit-review`
- `POST /phd/evidence/:id/request-revision`

---

# 9. `phd-service`: Evaluation/Review Module

## 9.1 Mục tiêu

Xử lý các mốc có người chấm/hội đồng và phiếu nhận xét online.

## 9.2 Entity

### `evaluation_session`

- `id`
- `ncs_id`
- `milestone_id`
- `status`
- `opened_at`
- `closed_at`

### `evaluation_assignment`

- `id`
- `session_id`
- `evaluator_id`
- `role`
- `status`

### `evaluation_form`

- `id`
- `assignment_id`
- `comment`
- `strengths`
- `weaknesses`
- `score`
- `submitted_at`

## 9.3 Business rules

- Score từ 0–10.
- Cho phép 1 chữ số thập phân.
- Kiểm tra điểm trung bình.
- Với các mốc áp dụng rule trong SRS:
  - điểm trung bình >= 7.0;
  - chênh lệch điểm <= 3.0.
- Nếu chênh lệch > 3.0: cảnh báo và không cho approve.
- Phiếu nhận xét phải lưu vết.
- Không hard-delete phiếu đã submit.

## 9.4 API

- `GET /phd/evaluations`
- `GET /phd/evaluations/:id`
- `POST /phd/evaluations/:id/forms`
- `PATCH /phd/evaluations/:id/forms/:formId`
- `POST /phd/evaluations/:id/forms/:formId/submit`
- `GET /phd/evaluations/:id/summary`

---

# 10. `phd-service`: Thesis & Supervisor Module

## 10.1 Mục tiêu

Quản lý đề tài, GVHD và thay đổi đề tài/GVHD.

## 10.2 Entity

### Thesis

- `id`
- `ncs_id`
- `title`
- `title_en` nếu cần
- `status`
- `decision_number`
- `decision_date`
- `effective_date`
- `created_at`
- `updated_at`

### Supervisor

Có thể đặt dữ liệu nghiệp vụ GVHD trong `phd-service` hoặc service dùng chung nếu project đã có staff/faculty service.

Thông tin SRS yêu cầu:

- học hàm;
- học vị;
- chuyên ngành;
- đơn vị công tác;
- lịch sử công bố 5 năm.

### SupervisorAssignment

- `id`
- `ncs_id`
- `supervisor_id`
- `role`
- `start_date`
- `end_date`
- `decision_number`
- `decision_date`
- `status`

## 10.3 Định mức

```text
GS  <= 7 NCS
PGS <= 5 NCS
TS  <= 3 NCS
```

Backend phải kiểm tra trước khi insert/update assignment.

## 10.4 Transaction quan trọng

```text
BEGIN
  lock/query current supervisor assignments
  count active NCS
  validate quota
  create assignment
  create audit log
COMMIT
```

Phải xử lý race condition để hai request đồng thời không vượt quota.

## 10.5 API

- `GET /phd/supervisors`
- `GET /phd/supervisors/:id`
- `GET /phd/supervisors/:id/quota`
- `POST /phd/students/:ncsId/supervisors`
- `PATCH /phd/students/:ncsId/supervisors/:assignmentId`
- `GET /phd/students/:ncsId/supervisors`

---

# 11. `phd-service`: Change Request Module

## 11.1 Mục tiêu

Xử lý đề nghị:

- đổi tên đề tài;
- thay đổi GVHD;
- các điều chỉnh cần phê duyệt.

## 11.2 Entity

### `change_request`

- `id`
- `ncs_id`
- `type`
- `old_value`
- `new_value`
- `reason`
- `status`
- `requested_by`
- `reviewed_by`
- `reviewed_at`
- `decision_number`
- `decision_date`

## 11.3 Status

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

## 11.4 API

- `POST /phd/change-requests`
- `GET /phd/change-requests`
- `GET /phd/change-requests/:id`
- `POST /phd/change-requests/:id/approve`
- `POST /phd/change-requests/:id/reject`

---

# 12. `phd-service`: Publication Module

## 12.1 Mục tiêu

Quản lý công bố khoa học và tính chuẩn đầu ra.

## 12.2 Entity

### `cong_bo_khoa_hoc`

Các field cần hỗ trợ theo SRS:

- `id`
- `ncs_id`
- `title`
- `journal`
- `issn`
- `publication_year`
- `url`
- `authors`
- `publication_type`
- `index_type`
- `quartile`
- `rank`
- `converted_score`
- `evidence_file_id`
- `status`
- `verified_by`
- `verified_at`
- `created_at`
- `updated_at`

## 12.3 Danh mục publication

Backend cần có catalog/config cho:

- WoS
- Scopus
- Chương sách quốc tế
- Danh mục/HĐGSNN
- Q1/Q2...
- Rank B nếu có
- Điểm quy đổi

Không hard-code toàn bộ catalog vào controller/service.

Nên có bảng cấu hình hoặc bảng danh mục.

## 12.4 Workflow

```text
NCS khai báo
 ↓
Upload evidence
 ↓
PENDING
 ↓
Giáo vụ verify
 ↓
ĐVCM xác nhận phù hợp
 ↓
Calculate score
 ↓
Check output standard
 ↓
QUALIFIED / NOT_QUALIFIED
```

## 12.5 Business rules

Phương thức 2:

```text
Tổng điểm >= 2.0
```

Phương thức 1:

```text
Có >= 3 bài WoS/Scopus
và có ít nhất 1 bài Q2/Rank B
```

Ngoài ra SRS mô tả trường hợp miễn phản biện độc lập khi đạt điều kiện công bố tương ứng.

## 12.6 API

- `POST /phd/publications`
- `GET /phd/publications`
- `GET /phd/publications/:id`
- `PATCH /phd/publications/:id`
- `POST /phd/publications/:id/verify`
- `POST /phd/publications/:id/reject`
- `GET /phd/students/:ncsId/publication-summary`
- `GET /phd/students/:ncsId/output-standard`

---

# 13. `phd-service`: Defense Module

Đây là module phức tạp nhất sau Progress.

## 13.1 Sub-module

```text
defense
├── registration
├── committees
├── department-defense
├── peer-review
├── university-defense
├── ballots
├── minutes
└── results
```

---

# 14. Defense Registration

## 14.1 Điều kiện trước khi đăng ký

Backend phải kiểm tra:

- Mốc trước đó đã Passed.
- Đủ tín chỉ/điều kiện học vụ.
- Đạt chuẩn công bố khoa học.
- Không vi phạm điều kiện thời gian đào tạo.
- Các điều kiện khác được cấu hình.

## 14.2 Entity

### `defense_registration`

- `id`
- `ncs_id`
- `level`
- `status`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `rejection_reason`

### Level

```text
DEPARTMENT
UNIVERSITY
```

## 14.3 API

- `POST /phd/defense/registrations`
- `GET /phd/defense/registrations`
- `GET /phd/defense/registrations/:id`
- `POST /phd/defense/registrations/:id/approve`
- `POST /phd/defense/registrations/:id/reject`

---

# 15. Committee Module

## 15.1 Entity `hoi_dong_bao_ve`

- `id`
- `ncs_id`
- `level`
- `decision_number`
- `decision_date`
- `meeting_date`
- `location`
- `status`

### Committee Member

- `id`
- `committee_id`
- `person_id`
- `role`
- `is_internal`
- `status`

## 15.2 API

- `POST /phd/defense/committees`
- `GET /phd/defense/committees/:id`
- `POST /phd/defense/committees/:id/members`
- `PATCH /phd/defense/committees/:id`
- `POST /phd/defense/committees/:id/close`

---

# 16. Department Defense

## 16.1 Workflow

```text
Đăng ký
 ↓
Thành lập hội đồng
 ↓
Hội đồng đánh giá
 ↓
Phiếu online
 ↓
Bỏ phiếu
 ↓
Tổng hợp
 ↓
PASSED / FAILED
```

## 16.2 Rule

Theo SRS, điều kiện tán thành được xác định theo quy mô hội đồng:

- >= 4/5
- 5/6
- 6/7

Backend không nên hard-code công thức trong controller; tạo policy/service:

```text
DefenseVotingPolicy
```

## 16.3 API

- `GET /phd/defense/:defenseId/evaluations`
- `POST /phd/defense/:defenseId/evaluations`
- `POST /phd/defense/:defenseId/ballots`
- `GET /phd/defense/:defenseId/result`

---

# 17. Peer Review — Phản biện kín

## 17.1 Mục tiêu

Quản lý 2 nhà khoa học ngoài trường và trường hợp phải gửi phản biện thứ 3.

## 17.2 Entity

### `peer_review`

- `id`
- `defense_id`
- `reviewer_id`
- `reviewer_external`
- `review_round`
- `thesis_file_id`
- `status`
- `sent_at`
- `due_at`
- `received_at`
- `result`
- `review_file_id`

## 17.3 Rule

Ban đầu:

```text
2 reviewers
```

Nếu:

```text
1 reviewer = KHÔNG ĐỒNG Ý
```

thì:

```text
create reviewer #3
```

Nếu cả 2 không đồng ý:

```text
FAILED
→ trả luận án về chỉnh sửa
→ đăng ký bảo vệ lại cấp Bộ môn
```

Không cho tạo PB3 lần thứ ba theo SRS.

## 17.4 API

- `POST /phd/defense/:id/peer-reviews`
- `GET /phd/defense/:id/peer-reviews`
- `POST /phd/peer-reviews/:id/send`
- `POST /phd/peer-reviews/:id/submit`
- `POST /phd/peer-reviews/:id/approve`
- `GET /phd/peer-reviews/:id`

---

# 18. University Defense

## 18.1 Dữ liệu

- Quyết định thành lập hội đồng.
- Danh sách thành viên.
- Phiếu đánh giá.
- Phiếu bỏ phiếu.
- Biên bản.
- Bản luận án chỉnh sửa.
- Kết quả cuối cùng.

## 18.2 API

- `POST /phd/defense/university`
- `GET /phd/defense/university/:id`
- `POST /phd/defense/university/:id/evaluations`
- `POST /phd/defense/university/:id/ballots`
- `POST /phd/defense/university/:id/minutes`
- `POST /phd/defense/university/:id/final-thesis`
- `POST /phd/defense/university/:id/complete`

---

# 19. `phd-service`: Graduation Module

## 19.1 Mục tiêu

Kiểm tra điều kiện hoàn tất sau bảo vệ.

## 19.2 Checklist Backend

```text
[ ] 9 mốc Passed
[ ] Đạt chuẩn công bố
[ ] Đạt chuẩn ngoại ngữ
[ ] Không còn công nợ quá hạn
[ ] Đã nộp luận án hoàn chỉnh
[ ] Đã nộp lưu thư viện
[ ] Đã hoàn thành yêu cầu sau bảo vệ
```

SRS nêu ví dụ:

- IELTS >= 5.5 hoặc VSTEP Bậc 4;
- không nợ học phí quá hạn.

## 19.3 Entity

### `graduation_check`

- `id`
- `ncs_id`
- `all_milestones_passed`
- `publication_qualified`
- `language_qualified`
- `tuition_cleared`
- `library_submission_completed`
- `final_thesis_completed`
- `status`
- `checked_at`
- `checked_by`

## 19.4 API

- `GET /phd/students/:ncsId/graduation-check`
- `POST /phd/students/:ncsId/graduation-check`
- `POST /phd/students/:ncsId/graduation/approve`

---

# 20. `document-service`

## 20.1 Mục tiêu

Không lưu binary PDF trực tiếp trong MariaDB.

MariaDB lưu metadata:

```text
file_id
owner_id
document_type
object_key
mime_type
size
checksum
status
created_at
```

Binary lưu Object Storage:

- Cloudflare R2
- AWS S3
- hoặc storage tương đương.

## 20.2 Module

```text
document-service
├── upload
├── download
├── metadata
├── access-control
├── checksum
└── storage
```

## 20.3 API

- `POST /documents/upload`
- `GET /documents/:id`
- `GET /documents/:id/download`
- `DELETE /documents/:id` nếu nghiệp vụ cho phép
- `POST /documents/:id/presigned-url`

## 20.4 Validation

- PDF.
- <= 15MB.
- MIME type.
- Extension.
- Magic bytes/file signature.
- Checksum.
- Antivirus scan nếu hạ tầng hỗ trợ.

## 20.5 Security

Không cho client tải file bằng `object_key` trực tiếp.

Phải kiểm tra:

```text
user → authorization → document ownership/access → signed URL
```

---

# 21. `notification-service`

## 21.1 Mục tiêu

Gửi thông báo theo event nghiệp vụ.

## 21.2 Events

Các event cần hỗ trợ:

```text
MILESTONE_SUBMITTED
MILESTONE_NEED_REVISION
MILESTONE_PASSED
MILESTONE_REJECTED

SUPERVISOR_ASSIGNED
CHANGE_REQUEST_CREATED
CHANGE_REQUEST_APPROVED
CHANGE_REQUEST_REJECTED

PUBLICATION_SUBMITTED
PUBLICATION_VERIFIED
PUBLICATION_REJECTED
PUBLICATION_QUALIFIED

DEFENSE_REGISTERED
DEFENSE_APPROVED
PEER_REVIEW_ASSIGNED
PEER_REVIEW_DUE
PEER_REVIEW_RECEIVED

DEFENSE_PASSED
DEFENSE_FAILED

GRADUATION_CONDITION_MISSING
GRADUATION_APPROVED

TRAINING_DEADLINE_WARNING
```

## 21.3 Channel

- In-app.
- Email.

## 21.4 API

- `GET /notifications`
- `PATCH /notifications/:id/read`
- `POST /notifications/read-all`

---

# 22. `academic-service`

## 22.1 Mục tiêu

Cung cấp dữ liệu học vụ dùng chung để `phd-service` kiểm tra điều kiện.

## 22.2 Có thể quản lý

- học phần;
- tín chỉ;
- kết quả học tập;
- chuẩn ngoại ngữ;
- chứng chỉ;
- điều kiện hoàn thành chương trình.

## 22.3 API nội bộ

- `getAcademicStatus(ncsId)`
- `checkCreditRequirement(ncsId)`
- `checkLanguageRequirement(ncsId)`
- `getAcademicResults(ncsId)`

`phd-service` không truy cập trực tiếp DB của academic-service.

---

# 23. `tuition-service`

## 23.1 Mục tiêu

Chỉ cung cấp trạng thái công nợ cho nghiệp vụ xét hoàn tất.

SRS không yêu cầu xây dựng hệ thống tài chính/học phí đầy đủ trong phân hệ Tiến sĩ.

## 23.2 API nội bộ

```text
getTuitionStatus(ncsId)
checkOutstandingDebt(ncsId)
```

Kết quả:

```text
CLEAR
OUTSTANDING
UNKNOWN
```

Nếu `OUTSTANDING`:

```text
graduation = BLOCKED
```

---

# 24. `admission-service`

Chỉ cần phần integration cần thiết nếu hồ sơ tuyển sinh đã tồn tại trong hệ thống tổng.

## Nhiệm vụ

- Lấy dữ liệu NCS được công nhận.
- Lấy quyết định/căn cứ đầu vào.
- Đồng bộ mã học viên.
- Đồng bộ ngày nhập học.

Không duplicate toàn bộ nghiệp vụ tuyển sinh trong `phd-service`.

---

# 25. `schedule-service`

Dùng khi cần quản lý:

- lịch họp hội đồng;
- lịch bảo vệ;
- deadline phản biện;
- địa điểm/phòng.

Nếu project hiện tại chưa cần service này, có thể triển khai sau `phd-service`.

---

# 26. API Gateway

## 26.1 Module

```text
api-gateway
├── auth
├── student
├── phd
├── document
├── notification
├── academic
├── tuition
├── admission
└── schedule
```

## 26.2 Nguyên tắc

Ví dụ:

```text
Frontend
   ↓ HTTP
API Gateway
   ↓ TCP
phd-service
```

Không:

```text
Frontend → phd-service trực tiếp
```

## 26.3 Client pattern

Tạo:

```text
clients/
├── auth.client.ts
├── student.client.ts
├── phd.client.ts
├── document.client.ts
├── notification.client.ts
├── academic.client.ts
├── tuition.client.ts
├── admission.client.ts
└── schedule.client.ts
```

Không cần tạo một client method cho mọi HTTP endpoint nếu có thể nhóm theo domain; nhưng mỗi pattern/message nghiệp vụ của microservice phải có contract rõ ràng.

---

# 27. Database Design

## 27.1 MariaDB

Sử dụng:

```text
MariaDB 10.11+
InnoDB
UTF8MB4
Foreign Keys
JSON khi cần
```

## 27.2 Các nhóm bảng chính trong `phd-service`

### Progress

```text
moc_tien_trinh
tien_trinh_ncs
minh_chung_moc
```

### Evaluation

```text
evaluation_session
evaluation_assignment
evaluation_form
```

### Thesis/Supervisor

```text
de_tai
giang_vien_huong_dan
phan_cong_huong_dan
change_request
```

### Publication

```text
cong_bo_khoa_hoc
publication_catalog
publication_verification
```

### Defense

```text
defense_registration
hoi_dong_bao_ve
hoi_dong_thanh_vien
defense_evaluation
defense_ballot
defense_minutes
peer_review
```

### Graduation

```text
graduation_check
post_defense_document
```

### Audit

```text
audit_log
```

---

# 28. Transaction Requirements

Các operation sau bắt buộc phải có transaction hoặc cơ chế đảm bảo atomicity.

## 28.1 Approve milestone

```text
BEGIN
  validate current milestone
  update milestone = PASSED
  unlock next milestone
  create audit log
  create notification event
COMMIT
```

## 28.2 Assign supervisor

```text
BEGIN
  lock/check supervisor quota
  create assignment
  update related records
  create audit log
COMMIT
```

## 28.3 Verify publication

```text
BEGIN
  verify publication
  calculate score
  update total score
  evaluate output standard
  update qualification status
  create audit log
COMMIT
```

## 28.4 Peer review

Nếu một phản biện không đồng ý:

```text
BEGIN
  save reviewer result
  evaluate current reviewers
  create reviewer #3
  audit
COMMIT
```

## 28.5 Graduation

```text
BEGIN
  check 9 milestones
  check publication
  check language
  check tuition
  check library submission
  update graduation status
  audit
COMMIT
```

---

# 29. Audit Trail

SRS yêu cầu lưu vết vĩnh viễn các hành vi quan trọng.

## Entity

```text
audit_log
```

Field:

- `id`
- `actor_user_id`
- `action`
- `entity_type`
- `entity_id`
- `old_value`
- `new_value`
- `client_ip`
- `user_agent`
- `timestamp`
- `correlation_id`

## Những action bắt buộc audit

- Approve milestone.
- Reject milestone.
- Request revision.
- Change score.
- Assign supervisor.
- Change supervisor.
- Change thesis title.
- Verify/reject publication.
- Create committee.
- Add/remove committee member.
- Submit peer review.
- Change peer review result.
- Record defense result.
- Approve graduation.

Không hard-delete audit log.

---

# 30. Security Backend

## Checklist

- [ ] Password bcrypt >= 10.
- [ ] JWT.
- [ ] HttpOnly cookie nếu dùng cookie auth.
- [ ] RBAC guard.
- [ ] Permission guard.
- [ ] DTO validation.
- [ ] Rate limiting cho auth.
- [ ] CORS config.
- [ ] File validation.
- [ ] Access control document.
- [ ] Không log password/token.
- [ ] Không trả stack trace production.
- [ ] SQL injection được ORM xử lý nhưng vẫn validate input.
- [ ] Audit trail.
- [ ] Secrets nằm trong environment/secret manager.
- [ ] HTTPS ở deployment.
- [ ] Encryption cho dữ liệu/file nhạy cảm nếu hạ tầng yêu cầu.

---

# 31. Performance

SRS yêu cầu:

- tối thiểu 200 concurrent users;
- GET API < 2 giây;
- upload PDF <= 15MB < 5 giây trong điều kiện triển khai mục tiêu.

## Backend tasks

- [ ] Index FK.
- [ ] Index `mshv`.
- [ ] Index status.
- [ ] Index `ncs_id`.
- [ ] Index `milestone_id`.
- [ ] Index `supervisor_id`.
- [ ] Index publication status.
- [ ] Pagination.
- [ ] Không trả file binary qua API Gateway nếu có thể dùng signed URL.
- [ ] Không N+1 query.
- [ ] Cache catalog/config nếu cần.
- [ ] Connection pool.
- [ ] Load test 200 concurrent users.

---

# 32. Error Code Convention

Đề xuất chuẩn:

```text
AUTH_001
AUTH_002

PHD_MILESTONE_LOCKED
PHD_MILESTONE_NOT_FOUND
PHD_MILESTONE_ALREADY_PASSED
PHD_EVIDENCE_INVALID_FILE
PHD_EVIDENCE_FILE_TOO_LARGE

PHD_SUPERVISOR_QUOTA_EXCEEDED
PHD_PUBLICATION_NOT_QUALIFIED

PHD_DEFENSE_NOT_ELIGIBLE
PHD_PEER_REVIEW_LIMIT_REACHED
PHD_GRADUATION_CONDITION_NOT_MET

DOCUMENT_INVALID_TYPE
DOCUMENT_TOO_LARGE
DOCUMENT_ACCESS_DENIED
```

Frontend không nên phụ thuộc vào message tiếng Việt để xử lý logic.

---

# 33. Testing Plan

## 33.1 Unit Test

### `phd-service`

- [ ] Sequential milestone policy.
- [ ] Milestone status transition.
- [ ] Evidence validation.
- [ ] Evaluation score calculation.
- [ ] Score difference rule.
- [ ] Supervisor quota calculation.
- [ ] Publication score calculation.
- [ ] Publication qualification.
- [ ] Defense voting rule.
- [ ] Peer review rule.
- [ ] Graduation condition checker.
- [ ] Deadline calculation.

## 33.2 Integration Test

- [ ] Gateway → auth.
- [ ] Gateway → student.
- [ ] Gateway → phd.
- [ ] phd → document.
- [ ] phd → notification.
- [ ] phd → academic.
- [ ] phd → tuition.
- [ ] phd → admission nếu sử dụng.
- [ ] phd → schedule nếu sử dụng.

## 33.3 E2E Test

### Flow 1 — Milestone

```text
Create NCS
→ Open milestone 1
→ Submit evidence
→ Review
→ Evaluation
→ Passed
→ Unlock milestone 2
```

### Flow 2 — Reject

```text
Submit
→ Review
→ Reject
→ Notification
→ Resubmit
```

### Flow 3 — Supervisor quota

```text
Supervisor at quota
→ Assign new NCS
→ Reject request
```

### Flow 4 — Publication

```text
Declare publication
→ Verify
→ Calculate score
→ Check >= 2.0
→ Qualify defense
```

### Flow 5 — Peer review

```text
Reviewer 1 agree
Reviewer 2 disagree
→ Create reviewer 3
→ Reviewer 3 agree
→ Continue
```

### Flow 6 — Graduation

```text
M9 Passed
→ Upload final thesis
→ Library confirmation
→ Academic check
→ Language check
→ Tuition check
→ Graduation approved
```

---

# 34. Seed Data

Cần tạo seed:

## Roles

```text
NCS
GVHD
DAO_TAO_SDH
DON_VI_CHUYEN_MON
TRUONG_KHOA
HOI_DONG
PHAN_BIEN
ADMIN
```

## Milestones

Seed đủ 9 mốc.

## Publication catalog

Seed dữ liệu mẫu:

- WoS.
- Scopus.
- Q1/Q2.
- HĐGSNN.
- Điểm quy đổi mẫu.

## Demo data

- 3–5 NCS.
- GVHD GS/PGS/TS.
- Một NCS đang ở mốc 2.
- Một NCS ở mốc 8.
- Một NCS đang phản biện kín.
- Một NCS đủ điều kiện tốt nghiệp.

---

# 35. API Documentation

Mỗi endpoint phải có:

- HTTP method.
- Path.
- Authentication.
- Required role.
- Request DTO.
- Response DTO.
- Error codes.
- Validation.
- Business rules.
- Example request.
- Example response.

Swagger chỉ là lớp documentation; contract nội bộ TCP cũng phải được định nghĩa rõ.

---

# 36. Event/Message Contract

Đề xuất pattern:

```text
phd.milestone.submitted
phd.milestone.passed
phd.milestone.rejected

phd.publication.verified
phd.publication.qualified

phd.supervisor.assigned

phd.defense.registered
phd.peer-review.assigned
phd.peer-review.completed
phd.defense.completed

phd.graduation.ready
phd.graduation.approved
```

Payload tối thiểu:

```json
{
  "eventId": "uuid",
  "eventType": "phd.milestone.passed",
  "occurredAt": "UTC timestamp",
  "actorId": "uuid",
  "ncsId": "uuid",
  "entityId": "uuid",
  "correlationId": "uuid",
  "data": {}
}
```

---

# 37. Development Order chi tiết

## Sprint 1 — Foundation

- [ ] Monorepo.
- [ ] Docker.
- [ ] MariaDB.
- [ ] Prisma.
- [ ] Shared config.
- [ ] TCP transport.
- [ ] API Gateway.
- [ ] Logging.
- [ ] Validation.
- [ ] Swagger.

## Sprint 2 — Auth + Student

- [ ] Auth.
- [ ] RBAC.
- [ ] JWT.
- [ ] User/role/permission.
- [ ] NCS CRUD.
- [ ] Deadline calculation.

## Sprint 3 — Document

- [ ] Object storage.
- [ ] Upload.
- [ ] Metadata.
- [ ] Signed URL.
- [ ] PDF/15MB validation.
- [ ] Access control.

## Sprint 4 — PhD Progress

- [ ] 9 milestones.
- [ ] NCS progress.
- [ ] Status machine.
- [ ] Evidence.
- [ ] Submit/review.
- [ ] Sequential unlock.
- [ ] Audit.

## Sprint 5 — Evaluation + Supervisor

- [ ] Online evaluation.
- [ ] Score calculation.
- [ ] Pass/reject.
- [ ] Supervisor.
- [ ] Quota.
- [ ] Thesis.
- [ ] Change request.

## Sprint 6 — Publication

- [ ] Publication CRUD.
- [ ] Catalog.
- [ ] Verification.
- [ ] Score calculation.
- [ ] Output standard.
- [ ] Defense eligibility.

## Sprint 7 — Defense

- [ ] Defense registration.
- [ ] Committee.
- [ ] Department defense.
- [ ] Ballot.
- [ ] Peer review.
- [ ] PB3 rule.
- [ ] University defense.
- [ ] Minutes.
- [ ] Final thesis.

## Sprint 8 — Graduation

- [ ] Post-defense documents.
- [ ] Library submission.
- [ ] Academic integration.
- [ ] Language requirement.
- [ ] Tuition integration.
- [ ] Graduation checker.
- [ ] Graduation approval.

## Sprint 9 — Notification + Hardening

- [ ] Email.
- [ ] In-app notification.
- [ ] Deadline reminders.
- [ ] Retry mechanism.
- [ ] Security review.
- [ ] Audit review.

## Sprint 10 — Testing + Deployment

- [ ] Unit tests.
- [ ] Integration tests.
- [ ] E2E.
- [ ] Load test.
- [ ] Docker production.
- [ ] Backup.
- [ ] Monitoring.
- [ ] CI/CD.

---

# 38. Definition of Done cho từng module

Một module chỉ được xem là hoàn thành khi:

```text
[ ] Entity/Prisma schema
[ ] Migration
[ ] Repository
[ ] Domain/service
[ ] Business rules
[ ] DTO
[ ] Validation
[ ] Controller/message handler
[ ] TCP contract
[ ] API Gateway endpoint
[ ] RBAC
[ ] Error codes
[ ] Audit log nếu nghiệp vụ yêu cầu
[ ] Notification event nếu cần
[ ] Unit test
[ ] Integration test
[ ] Swagger
[ ] Seed/demo data nếu cần
```

---

# 39. Thứ tự ưu tiên triển khai Backend

## P0 — Bắt buộc

```text
auth-service
student-service
phd-service
document-service
api-gateway
```

## P1 — Bắt buộc để hoàn thiện nghiệp vụ

```text
notification-service
academic-service
tuition-service
```

## P2 — Tích hợp/bổ trợ

```text
admission-service
schedule-service
```

---

# 40. Các Business Rule tuyệt đối phải đặt ở Backend

Không được chỉ kiểm tra ở NextJS:

1. Mốc N+1 chỉ mở khi N = Passed.
2. File phải là PDF và <= 15MB.
3. Điểm phải nằm trong range hợp lệ.
4. Chênh lệch điểm > 3.0 phải bị chặn/cảnh báo theo nghiệp vụ.
5. Điểm trung bình phải đạt >= 7.0 ở các mốc áp dụng.
6. GVHD không được vượt quota.
7. Chỉ publication hợp lệ mới được tính vào chuẩn đầu ra.
8. Tổng điểm công bố phải đạt ngưỡng.
9. Chỉ NCS đủ điều kiện mới được đăng ký bảo vệ.
10. Phản biện kín thứ 3 chỉ được tạo trong trường hợp được quy định.
11. Không cho PB3 lần thứ ba.
12. Chỉ đủ toàn bộ điều kiện mới được hoàn tất tốt nghiệp.
13. Không hard-delete dữ liệu pháp lý/audit quan trọng.
14. Mọi thao tác phê duyệt/chấm điểm/thay đổi quyết định phải được audit.

---

# 41. Milestone hoàn thành toàn Backend

## M1 — Infrastructure Ready

```text
Docker + MariaDB + Prisma + TCP + Gateway + Auth
```

## M2 — Student Ready

```text
NCS + deadline + status
```

## M3 — Document Ready

```text
Upload + storage + access control
```

## M4 — Progress Ready

```text
9 milestones + evidence + review + sequential unlock
```

## M5 — Academic Workflow Ready

```text
Evaluation + Supervisor + Thesis + Publication
```

## M6 — Defense Ready

```text
Registration + Committee + Peer Review + Voting + Minutes
```

## M7 — Graduation Ready

```text
Post-defense + Academic + Language + Tuition + Graduation
```

## M8 — Production Ready

```text
Security + Audit + Notification + Tests + Backup + Monitoring
```

---

# 42. Checklist cuối cùng

### Architecture

- [ ] Microservices chạy độc lập.
- [ ] Không shared DB giữa service.
- [ ] API Gateway không chứa business logic.
- [ ] TCP contract rõ ràng.
- [ ] Clean Architecture.

### Database

- [ ] Prisma schema.
- [ ] Migration.
- [ ] FK/index.
- [ ] Transaction.
- [ ] Audit.
- [ ] Seed.

### Business

- [ ] 9 mốc.
- [ ] Sequential unlock.
- [ ] Evidence.
- [ ] Evaluation.
- [ ] Supervisor quota.
- [ ] Thesis.
- [Publication.
- [ ] Defense 3 cấp.
- [ ] Peer review.
- [ ] Graduation.

### Integration

- [ ] Auth.
- [ ] Student.
- [Document.
- [Notification.
- [ ] Academic.
- [ ] Tuition.
- [ ] Admission nếu cần.
- [ ] Schedule nếu cần.

### Security

- [ ] JWT.
- [ ] RBAC.
- [ ] HttpOnly cookie.
- [ ] Validation.
- [ ] File security.
- [ ] Audit.
- [ ] HTTPS.
- [ ] Secret management.

### Quality

- [ ] Unit.
- [ ] Integration.
- [ ] E2E.
- [ ] Load test 200 concurrent users.
- [ ] Swagger.
- [ ] Error codes.
- [ ] Logging.
- [ ] Monitoring.

---

## 43. Tài liệu tham chiếu

Kế hoạch này được xây dựng dựa trên SRS `Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ — V2.0`, trong đó phạm vi bao gồm 9 mốc tiến trình, minh chứng PDF, công bố khoa học, lý lịch/định mức GVHD, bảo vệ luận án 3 cấp và phản biện kín; Backend được yêu cầu dùng NestJS Microservices và MariaDB.

Các phần cần đặc biệt đối chiếu khi implement:

- Functional Requirements: FR1.x → FR4.x.
- Use Cases: UC-PHD-01 → UC-PHD-12.
- DFD Process 1.0 → 4.0.
- MariaDB schema ở Section 8.
- Business Rules BR-02, BR-04, BR-08, BR-09.
- Non-functional requirements về performance, security, availability và maintainability.
