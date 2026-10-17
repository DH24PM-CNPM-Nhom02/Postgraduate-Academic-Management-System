import { z } from "zod";

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
