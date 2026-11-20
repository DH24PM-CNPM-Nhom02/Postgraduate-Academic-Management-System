import { z } from "zod";
import { DECISION_TYPES } from "@/src/services/decision";

const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const requiredIsoDate = (label: string) =>
  z.string().refine(isIsoDate, `${label} không hợp lệ`);

export const decisionCreateFormSchema = z.object({
  loai: z.enum(DECISION_TYPES),
  soQuyetDinh: z.string().trim().min(1, "Vui lòng nhập số quyết định").max(50, "Số quyết định tối đa 50 ký tự"),
  ngayQuyetDinh: requiredIsoDate("Ngày ký quyết định"),
  ncsIds: z.array(z.string().uuid("Mã NCS không hợp lệ")).min(1, "Chọn ít nhất một NCS áp dụng quyết định"),
  file: z.custom<File>((value) => typeof File !== "undefined" && value instanceof File, "Vui lòng đính kèm file quyết định PDF")
    .refine((file) => file.size > 0, "File PDF không được rỗng")
    .refine((file) => file.size <= 15 * 1024 * 1024, "Dung lượng file PDF tối đa 15MB")
    .refine((file) => file.name.toLowerCase().endsWith(".pdf"), "File đính kèm phải có định dạng PDF")
    .refine((file) => !file.type || file.type === "application/pdf", "File đính kèm phải có định dạng PDF"),
  hanMoi: z.string(),
  ghiChu: z.string().trim().max(1000, "Ghi chú tối đa 1000 ký tự"),
}).superRefine((value, ctx) => {
  if (value.loai === "GIA_HAN") {
    if (!value.hanMoi || !isIsoDate(value.hanMoi)) {
      ctx.addIssue({ code: "custom", path: ["hanMoi"], message: "Hạn mới không hợp lệ" });
    }
    ctx.addIssue({
      code: "custom",
      path: ["loai"],
      message: "Quyết định gia hạn phải được tạo qua quy trình xét duyệt đề nghị gia hạn của NCS.",
    });
  }
});

export type DecisionCreateFormValues = z.infer<typeof decisionCreateFormSchema>;
