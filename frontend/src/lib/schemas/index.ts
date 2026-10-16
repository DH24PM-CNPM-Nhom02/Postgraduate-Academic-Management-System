import { z } from "zod";

/**
 * lib/schemas — Zod validation schemas
 *
 * Dùng chung với backend nếu monorepo.
 * Dùng với react-hook-form hoặc Excel import cho client-side validation.
 */

/**
 * Schema kiểm tra dữ liệu đầu vào khi import Nghiên cứu sinh (Student Dossier)
 */
export const studentImportSchema = z.object({
  id: z.string().min(1, "Mã định danh không được để trống"),
  name: z.string().min(2, "Họ và tên NCS phải có ít nhất 2 ký tự"),
  code: z
    .string()
    .min(1, "Mã số NCS không được để trống")
    .regex(/^NCS\d{6}$/i, "Mã NCS phải có định dạng chuẩn NCS + 6 số (VD: NCS240101)"),
  cohort: z.string().min(1, "Khóa đào tạo không được để trống"),
  department: z.string().min(1, "Khoa / Chuyên ngành đào tạo không được để trống"),
  thesisTopic: z.string().min(5, "Tên đề tài luận án phải có ít nhất 5 ký tự"),
  supervisorMain: z.string().min(2, "Họ tên GVHD chính không được để trống"),
  supervisorCo: z.string().optional(),
  remainingMonths: z.number().int().min(0, "Thời gian đào tạo còn lại (tháng) phải ≥ 0"),
  currentMilestoneIndex: z.number().int().min(1).max(9, "Mốc tiến độ phải từ 1 đến 9"),
  publicationPoints: z.number().min(0, "Điểm bài báo khoa học phải ≥ 0"),
  status: z.enum(["active", "warning", "overdue"], {
    message: "Trạng thái tiến độ phải là active, warning hoặc overdue",
  }),
  email: z.string().email("Địa chỉ email liên hệ không đúng định dạng chuẩn"),
  phone: z
    .string()
    .min(9, "Số điện thoại liên lạc phải có ít nhất 9 chữ số")
    .regex(/^[0-9+() -]{9,15}$/, "Số điện thoại chứa ký tự không hợp lệ"),
});

export type StudentImportItem = z.infer<typeof studentImportSchema>;

/**
 * Schema kiểm tra dòng dữ liệu thô nhập từ bảng tính Excel / CSV của NCS
 */
export const rawStudentRowSchema = z.object({
  code: z
    .string()
    .min(1, "Mã NCS không được để trống")
    .regex(/^NCS\d{6}$/i, "Mã số nghiên cứu sinh phải theo chuẩn NCS + 6 số (VD: NCS240101)"),
  name: z.string().min(2, "Họ và tên NCS tối thiểu 2 ký tự"),
  email: z.string().email("Địa chỉ email không đúng định dạng chuẩn"),
  phone: z
    .string()
    .min(9, "Số điện thoại tối thiểu 9 số")
    .regex(/^[0-9+() -]{9,15}$/, "Số điện thoại không hợp lệ"),
  department: z.string().min(1, "Khoa / Chuyên ngành không được để trống"),
  supervisorMain: z.string().min(2, "GVHD Chính không được để trống"),
  supervisorCo: z.string().optional(),
  thesisTopic: z.string().min(5, "Tên đề tài luận án không được để trống (tối thiểu 5 ký tự)"),
  cohort: z.string().min(1, "Khóa học không được để trống"),
});

export type RawStudentRow = z.infer<typeof rawStudentRowSchema>;

/**
 * Schema kiểm tra dữ liệu đầu vào khi import Giảng viên Hướng dẫn (Supervisor Quota Record)
 */
export const supervisorImportSchema = z.object({
  id: z.string().min(1, "Mã định danh không được để trống"),
  name: z.string().min(2, "Họ và tên giảng viên phải có ít nhất 2 ký tự"),
  code: z
    .string()
    .min(1, "Mã GVHD không được để trống")
    .regex(/^CB-\d{4}-\d{3}$/i, "Mã cán bộ GVHD phải có định dạng CB-YYYY-XXX (VD: CB-2024-090)"),
  department: z.string().min(1, "Khoa / Bộ môn công tác không được để trống"),
  degree: z.string().refine(
    (deg) => {
      const lower = deg.toLowerCase();
      return (
        lower.includes("tiến sĩ") ||
        lower.includes("phó giáo sư") ||
        lower.includes("giáo sư") ||
        lower.includes("ts") ||
        lower.includes("pgs") ||
        lower.includes("gs")
      );
    },
    {
      message: "Học vị không đủ tiêu chuẩn hướng dẫn NCS theo Quy chế BR-09 (Yêu cầu tối thiểu Tiến sĩ).",
    }
  ),
  independentCount: z.number().int().min(0, "Số lượng NCS độc lập phải ≥ 0"),
  coCount: z.number().int().min(0, "Số lượng NCS đồng HD phải ≥ 0"),
  usedQuota: z.number().min(0, "Hạn ngạch đã dùng phải ≥ 0"),
  maxQuota: z
    .number()
    .min(1.0, "Định mức tối thiểu là 1.0 NCS")
    .max(4.0, "Định mức tối đa vượt trần quy định (Tối đa 3.0 với TS, 4.0 với PGS/GS theo quy chế BR-09)."),
  remainingQuota: z.number().min(0, "Chỉ tiêu còn lại không được âm"),
  statusText: z.string(),
  statusColor: z.string(),
  assignedStudents: z.array(z.string()),
});

export type SupervisorImportItem = z.infer<typeof supervisorImportSchema>;

/**
 * Schema kiểm tra dòng dữ liệu thô nhập từ bảng tính Excel / CSV của GVHD
 */
export const rawSupervisorRowSchema = z.object({
  code: z
    .string()
    .min(1, "Mã GVHD không được để trống")
    .regex(/^CB-\d{4}-\d{3}$/i, "Mã GVHD phải đúng chuẩn CB-YYYY-XXX (VD: CB-2024-090)"),
  name: z.string().min(2, "Họ và tên GVHD tối thiểu 2 ký tự"),
  degree: z.string().refine(
    (deg) => {
      const lower = deg.toLowerCase();
      return (
        lower.includes("tiến sĩ") ||
        lower.includes("phó giáo sư") ||
        lower.includes("giáo sư") ||
        lower.includes("ts") ||
        lower.includes("pgs") ||
        lower.includes("gs")
      );
    },
    {
      message: "Học vị không đủ tiêu chuẩn hướng dẫn NCS theo Quy chế BR-09 (Yêu cầu tối thiểu Tiến sĩ).",
    }
  ),
  email: z.string().email("Địa chỉ email không đúng định dạng chuẩn"),
  phone: z
    .string()
    .min(9, "Số điện thoại tối thiểu 9 số")
    .regex(/^[0-9+() -]{9,15}$/, "Số điện thoại không hợp lệ"),
  department: z.string().min(1, "Khoa / Bộ môn không được để trống"),
  maxQuota: z
    .number()
    .min(1.0, "Định mức tối thiểu là 1.0")
    .max(4.0, "Định mức vượt trần quy chế BR-09 (Tối đa 3.0 với TS, 4.0 với PGS/GS)."),
  researchField: z.string().optional(),
});

export type RawSupervisorRow = z.infer<typeof rawSupervisorRowSchema>;
