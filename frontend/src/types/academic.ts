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

/** Các Tab điều hướng trong phân hệ Học vụ */
export type AcademicTabKey =
  | "dashboard"
  | "students"
  | "supervisors"
  | "evidence"
  | "topic-changes"
  | "procedures"
  | "calendar"
  | "forms"
  | "regulations"
  | "faq";
