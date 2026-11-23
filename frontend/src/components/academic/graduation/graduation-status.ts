import type { GraduationCheckApiResponse } from "@/src/types/api/graduation";

export { studyStatusLabel } from "@/src/lib/study-status";

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
