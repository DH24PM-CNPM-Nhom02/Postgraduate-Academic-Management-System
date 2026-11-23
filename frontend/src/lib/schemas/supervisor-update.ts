import { z } from "zod";
import { PROFILE_PHONE_MESSAGE, PROFILE_PHONE_PATTERN } from "./profile";

const HOC_HAM_HOC_VI = ["", "GIAO_SU", "PHO_GIAO_SU", "TIEN_SI_KHOA_HOC", "TIEN_SI"] as const;

export const supervisorUpdateSchema = z.object({
  hoTen: z.string().trim().min(1, "Họ và tên không được để trống").max(100, "Họ và tên tối đa 100 ký tự"),
  ngaySinh: z.string().refine((value) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Ngày sinh không hợp lệ"),
  gioiTinh: z.enum(["", "NAM", "NU"], { message: "Giới tính không hợp lệ" }),
  email: z.string().trim().max(100, "Email tối đa 100 ký tự").refine(
    (value) => !value || z.email().safeParse(value).success,
    "Email không hợp lệ"
  ),
  soDienThoai: z.string().trim().refine(
    (value) => !value || PROFILE_PHONE_PATTERN.test(value),
    PROFILE_PHONE_MESSAGE,
  ),
  hocHamHocVi: z.enum(HOC_HAM_HOC_VI, { message: "Học hàm/học vị không hợp lệ" }),
  chuyenNganh: z.string().trim().max(255, "Chuyên ngành tối đa 255 ký tự"),
  donVi: z.string().trim().max(36, "Mã đơn vị tối đa 36 ký tự").refine(
    (value) => !value || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
    "Mã đơn vị không hợp lệ"
  ),
  quocGiaTotNghiep: z.string().trim().max(50, "Quốc gia tốt nghiệp tối đa 50 ký tự"),
});

export type SupervisorUpdateFormValues = z.infer<typeof supervisorUpdateSchema>;
