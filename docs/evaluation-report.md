# BÁO CÁO TOÀN DIỆN KẾT QUẢ TRIỂN KHAI SPRINT 5
**Phân hệ Quản lý Quá trình Đào tạo Tiến sĩ — Hệ thống Quản lý Học vụ Sau đại học**

---

## 1. CỤM 1: EVALUATION (CHẤM ĐIỂM & TIẾN TRÌNH) — TASKS S5-01 ĐẾN S5-11

### 1.1. Tổng quan & Mục tiêu
Cụm 1 hiện thực toàn bộ quy trình nghiệp vụ Đánh giá & Chấm điểm mốc tiến trình đào tạo Tiến sĩ (Mốc 2: Tiểu luận tổng quan, Mốc 4: Chuyên đề 1, Mốc 5: Chuyên đề 2 theo SRS Phân hệ Tiến sĩ và BR-08, BR-Evaluation).

Hệ thống tuân thủ 2 ràng buộc cốt lõi:
1. **Không sửa database**: Tận dụng nguyên vẹn cấu trúc bảng Prisma Schema hiện hữu đã pull từ MariaDB (`minh_chung_moc`, `phieu_nhan_xet`, `tien_trinh_ncs`, `moc_tien_trinh`, `quyet_dinh`, `audit_log`, `nghien_cuu_sinh`).
2. **Cấu trúc đồng nhất Clean Architecture & Microservices**: Chuẩn NestJS TCP Message Pattern, DTO Validation, Custom Exceptions, Audit Interceptor, RBAC Guard (`@Roles(...)`) và OpenAPI/Swagger.

### 1.2. Luồng xử lý dữ liệu chi tiết (Data Flow)
* **[S5-02] Khởi tạo đợt chấm & Phân công hội đồng**: Khi Giáo vụ khởi tạo đợt chấm cho mốc yêu cầu điểm (`yeuCauDiem = true`), mốc chuyển sang `PENDING_REVIEW`, bản ghi `minh_chung_moc` được tạo. Endpoint `POST /phd/evaluations/:id/assign` gán danh sách người chấm kèm quyết định thành lập tiểu ban (`THANH_LAP_TIEU_BAN`).
* **[S5-03] Quản lý phiếu nhận xét online**: Hỗ trợ lưu nháp (`isDraft = true`) và nộp chính thức (`SUBMITTED`). Cấm sửa và cấm xóa (chặn hard-delete) phiếu đã submit để đảm bảo tính pháp lý (`PHD_EVALUATION_CANNOT_DELETE_SUBMITTED`).
* **[S5-04] Validate điểm số**: Thang điểm 0.0 – 10.0, lẻ tối đa 1 chữ số thập phân.
* **[S5-05] Quy tắc độ lệch điểm (BR-Evaluation)**: Chỉ tính trên các phiếu đã SUBMIT. Nếu độ lệch giữa người chấm cao nhất và thấp nhất $(Max - Min) > 3.0$ điểm, hệ thống khóa không cho duyệt (`PHD_SCORE_DIFFERENCE_EXCEEDED`), yêu cầu họp hội đồng thống nhất lại.
* **[S5-06] Tự động chuyển mốc tiến trình**: Khi phê duyệt (`POST /phd/evaluations/:id/approve`):
  * Điểm TB $\ge 7.0$ (`PASSED`): Đợt chấm và mốc hiện tại chuyển `PASSED`, **tự động mở khóa mốc tiếp theo $N+1$ sang `UNLOCKED`**.
  * Điểm TB $< 7.0$ (`REJECTED`): Mốc chuyển sang `REJECTED`, không mở mốc tiếp theo, NCS phải nộp lại đợt sau.

---

## 2. CỤM 2: SUPERVISOR & THESIS (GVHD & ĐỀ TÀI) — TASKS S5-12 ĐẾN S5-18, S5-23, S5-24

### 2.1. Tổng quan & Mục tiêu
Cụm 2 hiện thực toàn bộ quy trình quản lý lý lịch khoa học Giảng viên Hướng dẫn, giám sát định mức tải theo học hàm (BR-09), cơ chế chống Race Condition khi phân công đồng thời, và quản lý đề tài nghiên cứu kèm quyết định pháp lý (BR-04).

### 2.2. Chi tiết nghiệp vụ cốt lõi
* **[S5-13] CRUD Lý lịch khoa học & Danh mục GVHD**: Quản lý học hàm, đơn vị công tác, email, hướng nghiên cứu, tự động tính hạn ngạch tối đa dựa trên học hàm:
  * GS (GIAO_SU): tối đa 7.0 NCS
  * PGS (PHO_GIAO_SU): tối đa 5.0 NCS
  * TS (TIEN_SI) / TSKH: tối đa 3.0 NCS
* **[S5-14] Công thức tính tải hướng dẫn (BR-09)**:
  $$\text{Tải hiện tại} = (\text{Số NCS Hướng dẫn chính} \times 1.0) + (\text{Số NCS Đồng hướng dẫn} \times 0.5)$$
* **[S5-15, S5-24] Phân công GVHD & Chống Race Condition**:
  * Sử dụng Database Transaction với mức cô lập `SERIALIZABLE`.
  * Khóa hàng GVHD bằng **Pessimistic Lock (`SELECT ... FOR UPDATE`)**, ép các request đồng thời phải tuần tự hóa.
  * Khi 2 request phân công đồng thời gửi đến cho cùng 1 GVHD đã chạm ngưỡng trần: 1 request thành công, request còn lại tự động rollback và báo lỗi `PHD_SUPERVISOR_QUOTA_EXCEEDED`.
* **[S5-16] Thay đổi GVHD theo quy tắc bảo toàn pháp lý (BR-04)**:
  * Không xóa cứng dữ liệu. Phân công cũ được chuyển trạng thái sang `DEACTIVATE`.
  * Tạo bản ghi phân công mới `DANG_HIEU_LUC` kèm số quyết định điều chỉnh và ghi `audit_log`.
* **[S5-18] Quản lý Đề tài Luận án**:
  * Giao đề tài mới gắn quyết định `GIAO_DE_TAI`.
  * Khi điều chỉnh tên đề tài (BR-04): Chuyển đề tài cũ sang `DA_THAY_THE`, tạo đề tài mới `HIEU_LUC` và lưu vết toàn bộ lịch sử.

---

## 3. CỤM 3: CHANGE REQUEST & EVENTS — TASKS S5-19 ĐẾN S5-22

### 3.1. Tổng quan & Mục tiêu
Cụm 3 hoàn thiện quy trình tiếp nhận, xử lý và phê duyệt các đơn đề nghị thay đổi từ NCS (đổi đề tài, đổi GVHD, gia hạn học tập) và phát các sự kiện TCP sang `notification-service`.

### 3.2. Luồng tự động cập nhật dữ liệu chính khi đơn được Phê duyệt (Approve Workflow)
Khi Giáo vụ gọi endpoint `POST /api/v1/phd/change-requests/:id/approve` kèm số quyết định pháp lý và ngày ký, `ChangeRequestService` thực thi một Database Transaction nguyên tử:

```
[Tiếp nhận đơn CHO_DUYET] 
         │
         ▼
[Kiểm tra tính hợp lệ & Loại đơn]
         │
         ├───► DOI_DE_TAI:
         │      ├─ 1. Đề tài đang HIEU_LUC của NCS chuyển sang DA_THAY_THE (BR-04)
         │      ├─ 2. Tạo quyết định pháp lý mới (GIAO_DE_TAI)
         │      └─ 3. Tạo bản ghi đề tài mới với tenDeTaiMoi, trạng thái HIEU_LUC
         │
         ├───► DOI_GVHD:
         │      ├─ 1. Khóa GVHD mới với SELECT ... FOR UPDATE (Pessimistic Lock)
         │      ├─ 2. Kiểm tra định mức BR-09: Tải hiện tại + trọng số mới <= Quota trần
         │      │     (Nếu vượt trần ➔ Rollback và ném PHD_SUPERVISOR_QUOTA_EXCEEDED)
         │      ├─ 3. Phân công cũ (phanCongCuId) chuyển sang DEACTIVATE (BR-04)
         │      ├─ 4. Giảm soNcsDangHuongDan của GVHD cũ, tăng soNcsDangHuongDan của GVHD mới
         │      ├─ 5. Tạo quyết định điều chỉnh GVHD (PHAN_CONG_GVHD)
         │      └─ 6. Tạo phân công mới DANG_HIEU_LUC gắn với quyết định
         │
         └───► GIA_HAN:
                ├─ 1. Cập nhật nghienCuuSinh.hanGiaHan = hanMoiDeNghi (<= hanBuocThoiHoc)
                ├─ 2. Cập nhật nghienCuuSinh.trangThai = GIA_HAN
                └─ 3. Tạo quyết định gia hạn học tập (GIA_HAN)
         │
         ▼
[Cập nhật de_nghi_dieu_chinh: trangThai = DA_DUYET, nguoiDuyetId, ngayDuyet, quyetDinhId]
         │
         ▼
[Ghi nhật ký Audit Log: CHANGE_REQUEST_APPROVE]
         │
         ▼
[COMMIT TRANSACTION]
         │
         ▼
[Bắn Event TCP sang notification-service: phd.change_request.approved]
```

* **Trường hợp Từ chối (`REJECTED`)**:
  * Bắt buộc phải có lý do từ chối (`lyDoTuChoi`). Nếu để trống hệ thống ném `PHD_CHANGE_REQUEST_REJECT_REASON_REQUIRED`.
  * Cập nhật trạng thái đơn sang `TU_CHOI`, lưu vết người duyệt và ghi `audit_log`.

---

### 3.3. Cấu trúc Payload chi tiết của các Event TCP phát đi ([S5-22])

Mọi sự kiện TCP bắn sang `notification-service` đều tuân thủ cấu trúc đóng gói chuẩn:

#### 1. Sự kiện Phân công GVHD thành công: `phd.supervisor.assigned`
Phát sinh khi hoàn tất phân công GVHD tại `SupervisorService.assignSupervisor`:
```json
{
  "eventId": "b3e5c789-1234-4a56-8b90-123456789abc",
  "eventType": "phd.supervisor.assigned",
  "occurredAt": "2026-10-14T19:20:00.000Z",
  "actorId": "usr-admin-uuid",
  "ncsId": "ncs-2026-0001",
  "correlationId": "req-trace-uuid",
  "data": {
    "assignmentId": "pc-2026-uuid",
    "gvhdId": "gvhd-gs-001",
    "vaiTro": "HUONG_DAN_CHINH",
    "trongSo": 1.0,
    "quyetDinhId": "qd-2026-001",
    "soQuyetDinh": "105/QĐ-ĐHAG"
  }
}
```

#### 2. Sự kiện Đơn đề nghị thay đổi được phê duyệt: `phd.change_request.approved`
Phát sinh khi hoàn tất phê duyệt tại `ChangeRequestService.approveChangeRequest`:
```json
{
  "eventId": "f7d8e9a0-5678-4b12-9c34-abcdef012345",
  "eventType": "phd.change_request.approved",
  "occurredAt": "2026-10-14T19:22:00.000Z",
  "actorId": "usr-giaovu-uuid",
  "ncsId": "ncs-2026-0001",
  "correlationId": "req-trace-uuid",
  "data": {
    "changeRequestId": "cr-2026-001",
    "loai": "DOI_DE_TAI",
    "soQuyetDinh": "120/QĐ-ĐHAG",
    "quyetDinhId": "qd-2026-002",
    "tenDeTaiMoi": "Nghiên cứu ứng dụng Deep Learning trong phân loại ảnh y tế",
    "gvhdMoiId": null
  }
}
```

---

## 4. BẢNG TỔNG KẾT TOÀN BỘ 24 TASKS CỦA SPRINT 5

| STT | Mã Task | Tên Nhiệm vụ | Cụm | Trạng thái | Kiểm thử liên quan |
|:---:|:---:|:---|:---:|:---:|:---|
| 1 | `S5-01` | Khai báo Contracts, Permissions & DTOs cho Evaluation | Cụm 1 | ✅ Hoàn thành | TypeScript validation |
| 2 | `S5-02` | Quản lý đợt chấm & phân công hội đồng | Cụm 1 | ✅ Hoàn thành | `evaluation.service.spec.ts` |
| 3 | `S5-03` | Quản lý phiếu nhận xét online (nháp/submit, chặn xóa) | Cụm 1 | ✅ Hoàn thành | `evaluation.service.spec.ts` |
| 4 | `S5-04` | Validate điểm số (thang 0-10, lẻ 1 chữ số) | Cụm 1 | ✅ Hoàn thành | `evaluation.util.spec.ts` |
| 5 | `S5-05` | Tính điểm TB & Quy tắc độ lệch Max-Min > 3.0 (BR-Evaluation) | Cụm 1 | ✅ Hoàn thành | `evaluation.util.spec.ts` |
| 6 | `S5-06` | Cập nhật mốc tự động (PASSED >= 7.0 ➔ Mở khóa mốc N+1) | Cụm 1 | ✅ Hoàn thành | `evaluation.service.spec.ts` |
| 7 | `S5-07` | TCP Controller cho Evaluation trong phd-service | Cụm 1 | ✅ Hoàn thành | TCP pattern validation |
| 8 | `S5-08` | RBAC Guard (`@Roles(...)`) bảo vệ API Evaluation | Cụm 1 | ✅ Hoàn thành | `roles.guard.ts` |
| 9 | `S5-09` | Audit Interceptor ghi vết thao tác vào CSDL | Cụm 1 | ✅ Hoàn thành | `audit.interceptor.ts` |
| 10 | `S5-10` | Swagger OpenAPI Documentation cho Evaluation | Cụm 1 | ✅ Hoàn thành | `/api/docs` |
| 11 | `S5-11` | Bộ kiểm thử Unit Tests cho Evaluation | Cụm 1 | ✅ Hoàn thành | 25/25 Tests Passed |
| 12 | `S5-12` | Khai báo Contracts & DTOs cho Supervisor & Thesis | Cụm 2 | ✅ Hoàn thành | `supervisor.dto.ts`, `thesis.dto.ts` |
| 13 | `S5-13` | CRUD Lý lịch khoa học & Danh mục GVHD | Cụm 2 | ✅ Hoàn thành | `supervisor.service.spec.ts` |
| 14 | `S5-14` | Cài đặt quy tắc hạn ngạch GVHD BR-09 (GS: 7, PGS: 5, TS: 3) | Cụm 2 | ✅ Hoàn thành | `supervisor.service.spec.ts` |
| 15 | `S5-15` | Transaction phân công GVHD + Pessimistic Lock chống race condition | Cụm 2 | ✅ Hoàn thành | `supervisor.service.spec.ts` |
| 16 | `S5-16` | Thay đổi GVHD theo BR-04 (cập nhật DEACTIVATE, không hard-delete) | Cụm 2 | ✅ Hoàn thành | `supervisor.service.spec.ts` |
| 17 | `S5-17` | API Gateway REST Controller cho Supervisor & Thesis | Cụm 2 | ✅ Hoàn thành | `supervisor.controller.ts`, `thesis.controller.ts` |
| 18 | `S5-18` | Module Thesis (Giao đề tài, đổi tên DA_THAY_THE theo BR-04) | Cụm 2 | ✅ Hoàn thành | `thesis.service.spec.ts` |
| 19 | `S5-19` | Khai báo Contracts, Permissions & DTOs cho Change Request | Cụm 3 | ✅ Hoàn thành | `change-request.dto.ts` |
| 20 | `S5-20` | Workflow xử lý đơn đề nghị (Approve/Reject trong Transaction BR-04) | Cụm 3 | ✅ Hoàn thành | `change-request.service.spec.ts` |
| 21 | `S5-21` | API Gateway Endpoints cho Change Request | Cụm 3 | ✅ Hoàn thành | `change-request.controller.ts` |
| 22 | `S5-22` | Bắn Event TCP sang notification-service (phd.supervisor.assigned, phd.change_request.approved) | Cụm 3 | ✅ Hoàn thành | `change-request.service.spec.ts`, `supervisor.service.spec.ts` |
| 23 | `S5-23` | Tích hợp các Module vào phd-service & api-gateway | Cụm 2,3 | ✅ Hoàn thành | Monorepo module wiring |
| 24 | `S5-24` | Concurrency Test giả lập 2 request đồng thời chạm trần quota | Cụm 2 | ✅ Hoàn thành | `supervisor.service.spec.ts` |

---

## 5. DANH SÁCH TOÀN BỘ API GATEWAY ENDPOINTS SPRINT 5

Tất cả các API đều có tiền tố `/api/v1` và yêu cầu xác thực Bearer Token (JWT).

### 5.1. Module Evaluation (Chấm điểm mốc)
| STT | Phương thức | Endpoint | Vai trò (`@Roles`) | Chức năng |
|:---:|:---:|:---|:---|:---|
| 1 | `GET` | `/api/v1/phd/evaluations` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Danh sách các đợt chấm điểm |
| 2 | `POST` | `/api/v1/phd/evaluations` | `GIAO_VU`, `ADMIN` | Khởi tạo đợt chấm mới |
| 3 | `GET` | `/api/v1/phd/evaluations/:id` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Chi tiết đợt chấm |
| 4 | `POST` | `/api/v1/phd/evaluations/:id/assign` | `GIAO_VU`, `ADMIN` | Phân công người chấm/hội đồng |
| 5 | `POST` | `/api/v1/phd/evaluations/:id/forms` | `GIAO_VU`, `GVHD`, `ADMIN` | Tạo phiếu nhận xét online (nháp/submit) |
| 6 | `PATCH` | `/api/v1/phd/evaluations/:id/forms/:formId` | `GIAO_VU`, `GVHD`, `ADMIN` | Sửa phiếu nhận xét nháp |
| 7 | `POST` | `/api/v1/phd/evaluations/:id/forms/:formId/submit` | `GIAO_VU`, `GVHD`, `ADMIN` | Nộp chính thức phiếu nhận xét |
| 8 | `DELETE` | `/api/v1/phd/evaluations/:id/forms/:formId` | `GIAO_VU`, `ADMIN` | Xóa phiếu nháp (chặn xóa phiếu đã submit) |
| 9 | `GET` | `/api/v1/phd/evaluations/:id/summary` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Bảng tổng hợp điểm TB & độ lệch Max-Min |
| 10 | `POST` | `/api/v1/phd/evaluations/:id/approve` | `GIAO_VU`, `ADMIN` | Phê duyệt kết quả và tự động chuyển mốc N+1 |

### 5.2. Module Supervisor & Thesis (GVHD & Đề tài)
| STT | Phương thức | Endpoint | Vai trò (`@Roles`) | Chức năng |
|:---:|:---:|:---|:---|:---|
| 11 | `GET` | `/api/v1/phd/supervisors` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Danh sách lý lịch khoa học GVHD |
| 12 | `POST` | `/api/v1/phd/supervisors` | `GIAO_VU`, `ADMIN` | Thêm mới GVHD (tự tính quota trần) |
| 13 | `GET` | `/api/v1/phd/supervisors/:id` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Chi tiết GVHD |
| 14 | `PATCH` | `/api/v1/phd/supervisors/:id` | `GIAO_VU`, `ADMIN` | Cập nhật hồ sơ GVHD |
| 15 | `GET` | `/api/v1/phd/supervisors/:id/quota` | `GIAO_VU`, `GVHD`, `ADMIN` | Tra cứu tải và hạn ngạch khả dụng (BR-09) |
| 16 | `POST` | `/api/v1/phd/supervisors/assign` | `GIAO_VU`, `ADMIN` | Phân công GVHD (Pessimistic Lock chống race condition) |
| 17 | `POST` | `/api/v1/phd/supervisors/change` | `GIAO_VU`, `ADMIN` | Đổi GVHD (chuyển cũ sang DEACTIVATE theo BR-04) |
| 18 | `GET` | `/api/v1/phd/supervisors/assignments/list` | `GIAO_VU`, `ADMIN`, `GVHD` | Danh sách lịch sử phân công |
| 19 | `GET` | `/api/v1/phd/theses` | `GIAO_VU`, `GVHD`, `NCS`, `ADMIN` | Danh sách đề tài luận án |
| 20 | `POST` | `/api/v1/phd/theses` | `GIAO_VU`, `ADMIN` | Giao đề tài luận án mới kèm số quyết định |
| 21 | `PATCH` | `/api/v1/phd/theses/:id` | `GIAO_VU`, `ADMIN` | Điều chỉnh tên đề tài (đổi cũ sang DA_THAY_THE) |
| 22 | `GET` | `/api/v1/phd/theses/ncs/:ncsId/history` | `GIAO_VU`, `ADMIN`, `NCS`, `GVHD` | Toàn bộ lịch sử thay đổi đề tài của NCS |

### 5.3. Module Change Request (Đề nghị thay đổi)
| STT | Phương thức | Endpoint | Vai trò (`@Roles`) | Chức năng |
|:---:|:---:|:---|:---|:---|
| 23 | `POST` | `/api/v1/phd/change-requests` | `NCS`, `GIAO_VU`, `ADMIN` | Nộp đơn xin đổi đề tài / đổi GVHD / gia hạn |
| 24 | `GET` | `/api/v1/phd/change-requests` | `GIAO_VU`, `ADMIN`, `GVHD` | Danh sách các đơn đề nghị thay đổi |
| 25 | `GET` | `/api/v1/phd/change-requests/:id` | `GIAO_VU`, `ADMIN`, `NCS`, `GVHD` | Chi tiết đơn đề nghị |
| 26 | `POST` | `/api/v1/phd/change-requests/:id/approve` | `GIAO_VU`, `ADMIN` | Phê duyệt đơn (Transaction cập nhật dữ liệu tự động) |
| 27 | `POST` | `/api/v1/phd/change-requests/:id/reject` | `GIAO_VU`, `ADMIN` | Từ chối đơn (bắt buộc nhập lý do) |

---

## 6. KẾT QUẢ KIỂM THỬ (UNIT TESTS & CONCURRENCY TESTS)

Toàn bộ **60 tests** trên **5 test suites** đều vượt qua thành công (**100% Passed**):

```bash
 RUN  v4.1.11 D:/CNPM/Postgraduate-Academic-Management-System/backend

 ✓ apps/phd-service/src/evaluation/evaluation.util.spec.ts (17 tests)
 ✓ apps/phd-service/src/evaluation/evaluation.service.spec.ts (8 tests)
 ✓ apps/phd-service/src/supervisor/supervisor.service.spec.ts (13 tests)
 ✓ apps/phd-service/src/supervisor/thesis.service.spec.ts (8 tests)
 ✓ apps/phd-service/src/change-request/change-request.service.spec.ts (14 tests)

 Test Files  5 passed (5)
      Tests  60 passed (60)
```

### Hướng dẫn kiểm thử tự động
1. **Chạy toàn bộ Unit Tests**:
   ```bash
   cd backend
   npm test
   ```
2. **Chạy kiểm tra Coverage**:
   ```bash
   npm run test:cov
   ```
3. **Chạy Linter kiểm tra tĩnh mã nguồn**:
   ```bash
   npm run lint
   ```
4. **Kiểm tra biên dịch Type-check**:
   ```bash
   npx tsc --noEmit
   ```
