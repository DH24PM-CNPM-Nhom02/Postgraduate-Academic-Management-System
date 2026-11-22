import type { GraduationCheckApiResponse } from "@/src/types/api/graduation";

const STUDY_STATUS_LABELS: Record<string, string> = {
  DANG_HOC: "Đang học",
  GIA_HAN: "Gia hạn",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
  DA_TOT_NGHIEP: "Đã tốt nghiệp",
};

export function studyStatusLabel(status: string) {
  return STUDY_STATUS_LABELS[status] ?? status;
}

export function hasGraduated(student: GraduationCheckApiResponse) {
  return student.daDuyetTotNghiep || student.trangThaiHocTap === "DA_TOT_NGHIEP";
}

export function canConfirmGraduation(student: GraduationCheckApiResponse) {
  return student.duDieuKien && !hasGraduated(student);
}

export function isGraduationDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
