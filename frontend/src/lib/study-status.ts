import type { StudentDossier } from "@/src/types/academic";

export const STUDY_STATUS_LABELS: Record<string, string> = {
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

export function getStudyStatus(student: StudentDossier) {
  const status = student.trangThai ?? student.rawDetails?.trangThai;
  return typeof status === "string" ? status : "";
}

export function canAssignSupervisor(student: StudentDossier) {
  const status = getStudyStatus(student);
  return status === "DANG_HOC" || status === "GIA_HAN";
}
