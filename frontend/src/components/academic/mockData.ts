// Legacy sample catalogs used outside academic pages.
// Academic Procedures Dataset
export const MOCK_PROCEDURES = [
  {
    id: "proc-01",
    code: "TT-SĐH-01",
    title: "Quy trình nộp và bảo vệ đề cương chi tiết luận án tiến sĩ (Mốc 5)",
    category: "Tiến độ đào tạo",
    timeline: "Tháng 18 - 24",
    description: "NCS hoàn thành báo cáo chuyên đề 1, 2 và thông qua Bộ môn chuyên môn trước khi thành lập Hội đồng cấp ĐVCM.",
    forms: ["Mẫu 05-ĐCCT.docx", "Mẫu 05B-PhieuNX.pdf"],
  },
  {
    id: "proc-02",
    code: "TT-SĐH-02",
    title: "Thủ tục đề nghị điều chỉnh tên đề tài luận án & thay đổi GVHD",
    category: "Hồ sơ đề tài",
    timeline: "Trước mốc bảo vệ cấp ĐVCM ít nhất 6 tháng",
    description: "Áp dụng khi NCS có nhu cầu điều chỉnh định hướng nghiên cứu hoặc thay đổi nhân sự hướng dẫn theo quy chế BR-09.",
    forms: ["Mẫu 02-DonDoiDeTai.docx", "Mẫu 02B-XacNhanGVHD.pdf"],
  },
  {
    id: "proc-03",
    code: "TT-SĐH-03",
    title: "Thẩm định điểm bài báo khoa học quốc tế (WoS/Scopus ≥ 2.0 điểm)",
    category: "Chuẩn đầu ra",
    timeline: "Trước khi đăng ký bảo vệ cấp Trường",
    description: "Bộ phận SĐH kiểm tra ISSN, chỉ số IF, danh mục WoS/Scopus (Q1, Q2, Q3) và tính điểm quy đổi theo quy chế hiện hành.",
    forms: ["Mẫu 08-KeKhaiBaiBao.xlsx", "QuyCheTinhDiem-2026.pdf"],
  },
  {
    id: "proc-04",
    code: "TT-SĐH-04",
    title: "Báo cáo tiến độ học tập 6 tháng định kỳ (Tháng 6 & Tháng 12)",
    category: "Đánh giá định kỳ",
    timeline: "Đợt 1: 15/06 • Đợt 2: 15/12",
    description: "NCS nộp báo cáo kết quả và kế hoạch nghiên cứu 6 tháng tiếp theo. GVHD nhận xét chuyên môn và ký số điện tử.",
    forms: ["Mẫu 06-BCTD-6Thang.docx"],
  },
  {
    id: "proc-05",
    code: "TT-SĐH-05",
    title: "Hồ sơ đăng ký bảo vệ luận án cấp Đơn vị Chuyên môn & Cấp Trường",
    category: "Tốt nghiệp",
    timeline: "Tháng 36 - 48",
    description: "Kiểm tra điều kiện: Hoàn tất 9 mốc đào tạo, đủ 2.0 điểm bài báo, chứng chỉ ngoại ngữ và nộp lưu chiểu thư viện.",
    forms: ["Mẫu 09-DonDangKyBV.docx", "Mẫu 09B-TrichYeuLuanAn.pdf"],
  },
  {
    id: "proc-06",
    code: "TT-SĐH-06",
    title: "Đơn xin gia hạn thời gian đào tạo trình độ tiến sĩ (Tối đa 24 tháng)",
    category: "Gia hạn & Tạm hoãn",
    timeline: "Trước khi hết hạn 72 tháng ít nhất 45 ngày",
    description: "NCS nộp đơn giải trình lý do khách quan, kế hoạch chi tiết hoàn thành luận án và có ý kiến đồng ý của GVHD chính.",
    forms: ["Mẫu 07-DonGiaHan.docx"],
  },
];

// Academic Calendar Events
export const MOCK_CALENDAR_EVENTS = [
  {
    id: "cal-1",
    title: "Hạn chót nộp Báo cáo Tiến độ 6 tháng Đợt 2 / 2026",
    date: "15/12/2026",
    scope: "Toàn bộ Nghiên cứu sinh & GVHD",
    type: "deadline",
    status: "Sắp diễn ra",
  },
  {
    id: "cal-2",
    title: "Hội đồng đánh giá luận án cấp Đơn vị chuyên môn (Đợt 4)",
    date: "25/11/2026",
    scope: "Khoa Công nghệ Thông tin & Khoa Nông nghiệp",
    type: "defense",
    status: "Đã lên lịch",
  },
  {
    id: "cal-3",
    title: "Xét duyệt và thẩm định danh mục bài báo quốc tế WoS/Scopus",
    date: "05/11/2026",
    scope: "Phòng Quản lý Sau Đại học",
    type: "review",
    status: "Đang xử lý",
  },
  {
    id: "cal-4",
    title: "Đợt bảo vệ đề cương chi tiết luận án (Mốc 5)",
    date: "28/10/2026",
    scope: "NCS Khóa 2023",
    type: "milestone",
    status: "Sắp tới",
  },
];

// Academic Forms Dataset
export const MOCK_FORMS = [
  { code: "Mẫu 01-ĐCT", name: "Đơn đăng ký đề tài luận án tiến sĩ", format: "DOCX", size: "185 KB" },
  { code: "Mẫu 02-ĐĐT", name: "Đơn đề nghị điều chỉnh tên đề tài luận án", format: "DOCX", size: "142 KB" },
  { code: "Mẫu 05-ĐCCT", name: "Bản thuyết minh đề cương chi tiết luận án", format: "DOCX", size: "320 KB" },
  { code: "Mẫu 06-BCTD", name: "Báo cáo tiến độ học tập và nghiên cứu 6 tháng", format: "DOCX", size: "168 KB" },
  { code: "Mẫu 08-KKBB", name: "Bảng kê khai và quy đổi điểm công bố khoa học", format: "XLSX", size: "95 KB" },
  { code: "Mẫu 09-ĐKBV", name: "Hồ sơ đăng ký bảo vệ luận án cấp cơ sở", format: "DOCX", size: "210 KB" },
];
