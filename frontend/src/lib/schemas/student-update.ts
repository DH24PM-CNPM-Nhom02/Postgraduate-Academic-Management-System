import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} không được vượt quá ${max} ký tự`);

export const studentUpdateSchema = z.object({
  hoTen: z.string().trim().min(1, "Họ và tên không được để trống").max(100, "Họ và tên không được vượt quá 100 ký tự"),
  ngaySinh: z.string().refine((value) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Ngày sinh không hợp lệ"),
  gioiTinh: z.enum(["", "NAM", "NU"], { message: "Giới tính không hợp lệ" }),
  email: optionalText(100, "Email").refine(
    (value) => !value || /^[^\s@<>(),;:\\[\]".]+(?:\.[^\s@<>(),;:\\[\]".]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(value),
    "Email không hợp lệ"
  ),
  soDienThoai: optionalText(10, "Số điện thoại").refine(
    (value) => !value || /^0[1-9]{2}[0-9]{7}$/.test(value),
    "Số điện thoại phải gồm 10 chữ số và đúng định dạng Việt Nam"
  ),
  nganh: optionalText(150, "Ngành"),
  khoaHoc: optionalText(20, "Khóa học"),
  lop: optionalText(30, "Lớp"),
});

export type StudentUpdateFormValues = z.infer<typeof studentUpdateSchema>;
