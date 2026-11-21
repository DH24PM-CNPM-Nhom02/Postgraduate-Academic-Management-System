import { formatDate } from "@/src/lib/utils";
import type { GraduatedNcsRecord } from "@/src/types/api/graduation";

export const graduatedRecordFields = [
  { key: "mshv", label: "Mã NCS" },
  { key: "hoTen", label: "Họ tên" },
  { key: "nganh", label: "Ngành" },
  { key: "khoaHoc", label: "Khóa" },
  { key: "nguoiHuongDan", label: "Người hướng dẫn" },
  { key: "ngayBaoVeCapTruong", label: "Ngày bảo vệ cấp trường" },
  { key: "soQuyetDinh", label: "Số quyết định công nhận" },
  { key: "ngayQuyetDinh", label: "Ngày quyết định công nhận" },
  { key: "soHieuBang", label: "Số hiệu bằng" },
  { key: "ngayCapBang", label: "Ngày cấp bằng" },
] as const;

type RecordField = (typeof graduatedRecordFields)[number]["key"];

export function formatGraduatedRecordField(record: GraduatedNcsRecord, key: RecordField) {
  const value = record[key];
  if (Array.isArray(value)) return value.join(", ") || null;
  if (!value) return null;
  return key === "ngayBaoVeCapTruong" || key === "ngayQuyetDinh" || key === "ngayCapBang"
    ? formatDate(value)
    : value;
}
