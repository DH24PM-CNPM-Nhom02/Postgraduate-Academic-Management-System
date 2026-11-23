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
