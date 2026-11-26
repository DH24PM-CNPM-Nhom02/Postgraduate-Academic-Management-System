import { z } from "zod";
import { getSupervisorQuotaLimit } from "@/src/lib/supervisor-quota";

const degreeSchema = z.string().refine(
  (degree) => getSupervisorQuotaLimit(degree) !== undefined,
  "Học hàm/học vị không hợp lệ. Vui lòng chọn TS, TSKH, PGS hoặc GS."
);

function validateQuota({ degree, maxQuota }: { degree: string; maxQuota: number }, ctx: z.RefinementCtx) {
  const limit = getSupervisorQuotaLimit(degree);
  if (limit !== undefined && maxQuota > limit) {
    ctx.addIssue({
      code: "custom",
      path: ["maxQuota"],
      message: `Định mức tối đa của ${degree.trim()} là ${limit} NCS.`,
    });
  }
}

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
  degree: degreeSchema,
  independentCount: z.number().int().min(0, "Số lượng NCS độc lập phải ≥ 0"),
  coCount: z.number().int().min(0, "Số lượng NCS đồng HD phải ≥ 0"),
  usedQuota: z.number().min(0, "Hạn ngạch đã dùng phải ≥ 0"),
  maxQuota: z
    .number()
    .min(1.0, "Định mức tối thiểu là 1.0 NCS"),
  remainingQuota: z.number().min(0, "Chỉ tiêu còn lại không được âm"),
  statusText: z.string(),
  statusColor: z.string(),
  assignedStudents: z.array(z.string()),
}).superRefine(validateQuota);

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
  degree: degreeSchema,
  email: z.string().email("Địa chỉ email không đúng định dạng chuẩn"),
  phone: z
    .string()
    .min(9, "Số điện thoại tối thiểu 9 số")
    .regex(/^[0-9+() -]{9,15}$/, "Số điện thoại không hợp lệ"),
  department: z.string().min(1, "Khoa / Bộ môn không được để trống"),
  maxQuota: z
    .number()
    .min(1.0, "Định mức tối thiểu là 1.0"),
  researchField: z.string().optional(),
}).superRefine(validateQuota);

export type RawSupervisorRow = z.infer<typeof rawSupervisorRowSchema>;
