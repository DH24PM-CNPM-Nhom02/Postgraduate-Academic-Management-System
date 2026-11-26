import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";

export function canManageThesis(status: AcademicThesisNcsItem["trangThaiHocTap"] | undefined) {
  return status === "DANG_HOC" || status === "GIA_HAN";
}

export function getAssignmentBlock(student: AcademicThesisNcsItem) {
  if (!canManageThesis(student.trangThaiHocTap)) return "Chỉ có thể giao đề tài cho NCS đang học hoặc gia hạn.";
  if (student.trangThaiDeTai !== "CHUA_GIAO" || student.deTaiHienTai) return "NCS đã có đề tài đang hiệu lực.";
  if (student.hasPendingChangeRequest) return "NCS đang có đề nghị điều chỉnh chờ duyệt.";
  return null;
}

export function canDeactivateThesis(student: AcademicThesisNcsItem) {
  return canManageThesis(student.trangThaiHocTap) && !student.hasPendingChangeRequest &&
    student.trangThaiDeTai === "HIEU_LUC" && student.deTaiHienTai?.trangThai === "HIEU_LUC";
}
