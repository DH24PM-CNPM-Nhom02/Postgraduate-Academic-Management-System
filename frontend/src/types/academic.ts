/**
 * types/academic.ts
 * Clean Architecture Shared Types for Postgraduate Academic Affairs Module
 */

/** Trạng thái của Nghiên cứu sinh */
export type StudentStatus = "active" | "warning" | "overdue";

/** Hồ sơ Nghiên cứu sinh (Student Dossier) */
export interface StudentDossier {
  id: string;
  name: string;
  code: string;
  cohort: string;
  department: string;
  thesisTopic: string;
  supervisorMain: string;
  supervisorCo?: string;
  remainingMonths: number;
  currentMilestoneIndex: number; // 1 to 9
  publicationPoints: number; // Điểm tích lũy bài báo (ngưỡng 2.0)
  status: StudentStatus;
  email: string;
  phone: string;
}

/** Hồ sơ & Hạn ngạch Giảng viên Hướng dẫn theo Quy chế BR-09 */
export interface SupervisorQuotaRecord {
  id: string;
  name: string;
  code: string;
  department: string;
  degree: string;
  independentCount: number;
  coCount: number;
  usedQuota: number;
  maxQuota: number;
  remainingQuota: number;
  statusText: string;
  statusColor: string;
  assignedStudents: string[];
}

/** Mục Minh chứng học vụ / Báo cáo chuyên đề chờ duyệt */
export interface EvidenceItem {
  id: string;
  studentName: string;
  studentCode: string;
  department: string;
  milestone: string;
  documentTitle: string;
  fileSize: string;
  submittedAt: string;
  step: "gvhd_confirm" | "academic_review";
  status: string;
  badgeColor: string;
}

/** Đề nghị điều chỉnh tên đề tài luận án tiến sĩ */
export interface TopicChangeItem {
  id: string;
  studentName: string;
  studentCode: string;
  cohort: string;
  department: string;
  currentTopic: string;
  proposedTopic: string;
  reason: string;
  supervisorName: string;
  supervisorOpinion: string;
  requestDate: string;
  status: "pending_review" | "approved" | "rejected";
}

/** Sự kiện lịch học vụ sau đại học */
export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  scope: string;
  type: "deadline" | "defense" | "review" | "milestone" | "meeting" | "exam";
  status: string;
}

/** Quy trình thủ tục học vụ */
export interface AcademicProcedureItem {
  id: string;
  code: string;
  title: string;
  category: string;
  timeline: string;
  description: string;
  forms: string[];
}

/** Biểu mẫu học vụ */
export interface AcademicFormItem {
  code: string;
  name: string;
  format: string;
  size: string;
}

/** Loại thực thể khi import Excel */
export type EntityImportType = "student" | "supervisor";

/** Bản ghi dữ liệu import từ Excel/CSV */
export interface ImportedEntityItem {
  id: string;
  code: string;
  name: string;
  department: string;
  extraField1: string; // Khóa / Học hàm học vị
  extraField2: string; // GVHD / Email
  status: "valid" | "warning" | "error";
  validationNotes?: string[];
}

/** Các loại Quyết định pháp lý */
export type DecisionType =
  | "CAN_CU_DUYET_MOC"
  | "GIA_HAN"
  | "BAO_LUU"
  | "NGUNG_HOC"
  | "BUOC_THOI_HOC"
  | "GIAO_DE_TAI"
  | "PHAN_CONG_GVHD"
  | "THANH_LAP_TIEU_BAN"
  | "CONG_NHAN_TOT_NGHIEP"
  | "KHAC";

/** Trạng thái quyết định */
export type DecisionStatus = "HIEU_LUC" | "VO_HIEU_HOA";

/** Bản ghi Quyết định */
export interface DecisionItem {
  id: string;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  loai: DecisionType;
  ncsId?: string | null;
  ncs?: {
    id: string;
    mshv: string;
    hoTen: string;
    lop?: string;
  } | null;
  trangThai: DecisionStatus;
  fileId?: string | null;
  fileName?: string | null;
  ghiChu?: string | null;
  hanMoi?: string | null;
  lyDoVoHieuHoa?: string | null;
  ngayTao?: string;
}

/** Phiếu nhận xét / chấm điểm của chuyên gia (cho mốc 2, 4, 5) */
export interface EvaluationItem {
  id: string;
  tenNguoiCham: string;
  donViNguoiCham?: string;
  diem: number;
  nhanXet?: string;
  createdAt?: string;
}

/** Tổng hợp điểm đánh giá mốc */
export interface EvaluationSummary {
  soPhieu: number;
  soPhieuToiThieu: number;
  diemTrungBinh: number;
  duPhieu: boolean;
}

/** Bản ghi mốc tiến độ đang chờ duyệt (Pending Review) */
export interface PendingMilestoneItem {
  id: string; // tienTrinhId
  submittedAt: string;
  ncs: {
    id: string;
    mshv: string;
    hoTen: string;
    lop: string;
    nganh?: string;
    gvhd?: string;
  };
  moc: {
    thuTu: number;
    tenMoc: string;
    yeuCauDiem: boolean;
  };
  minhChungMoiNhat: {
    id: string;
    lanNop: number;
    fileId: string;
    ghiChuNcs?: string;
    ngayNop: string;
    _count?: {
      phieuNhanXets: number;
    };
  };
  evaluations?: EvaluationItem[];
  evaluationSummary?: EvaluationSummary;
  lichSuNop?: MilestoneSubmissionHistory[];
}

/** Lịch sử một lần nộp mốc */
export interface MilestoneSubmissionHistory {
  id: string;
  lanNop: number;
  ngayNop: string;
  fileId: string;
  fileName?: string;
  trangThai: "PENDING_REVIEW" | "PASSED" | "REJECTED";
  lyDoTuChoi?: string;
  diemTrungBinh?: number;
  soPhieu?: number;
}

/** Các Tab điều hướng trong phân hệ Học vụ */
export type AcademicTabKey =
  | "dashboard"
  | "students"
  | "supervisors"
  | "milestone-review"
  | "decisions"
  | "evidence"
  | "topic-changes"
  | "procedures"
  | "calendar"
  | "forms"
  | "regulations"
  | "faq";
