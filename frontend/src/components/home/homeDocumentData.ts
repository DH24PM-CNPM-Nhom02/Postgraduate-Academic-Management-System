export interface StaticFormItem {
  code: string;
  name: string;
  format: "DOCX" | "PDF" | "XLSX";
  size: string;
  category: string;
  summary: string;
}

export interface StaticRegulationItem {
  id: string;
  code: string;
  title: string;
  authority: string;
  date: string;
  format: "PDF";
  size: string;
  summary: string;
  keyPoints: string[];
}

export const FALLBACK_FORMS: StaticFormItem[] = [
  {
    code: "BM-01",
    name: "Đơn đề nghị điều chỉnh tên đề tài luận án & thay đổi GVHD",
    format: "DOCX",
    size: "142 KB",
    category: "Đề tài",
    summary:
      "Dùng khi NCS có nguyện vọng điều chỉnh hướng nghiên cứu, tên đề tài hoặc thay đổi/bổ sung cán bộ hướng dẫn theo quy chế BR-09.",
  },
  {
    code: "BM-02",
    name: "Bản thuyết minh đề cương chi tiết luận án tiến sĩ (Mốc 5)",
    format: "DOCX",
    size: "320 KB",
    category: "Đề cương",
    summary:
      "Khung thuyết minh đề cương chuẩn gồm: Tính cấp thiết, mục tiêu, đối tượng, phương pháp và kế hoạch thực nghiệm chi tiết 36 tháng.",
  },
  {
    code: "BM-03",
    name: "Phiếu nhận xét tiến độ nghiên cứu của GVHD định kỳ 6 tháng",
    format: "DOCX",
    size: "168 KB",
    category: "Tiến độ",
    summary:
      "GVHD chính và đồng hướng dẫn đánh giá khối lượng công việc, tinh thần nghiên cứu và cho ý kiến phê duyệt kế hoạch tiếp theo.",
  },
  {
    code: "BM-04",
    name: "Hồ sơ đăng ký đánh giá luận án cấp Đơn vị Chuyên môn (Cấp Cơ sở)",
    format: "DOCX",
    size: "210 KB",
    category: "Tốt nghiệp",
    summary:
      "Biểu mẫu kiểm tra điều kiện bảo vệ cơ sở: Điểm các chuyên đề, chứng chỉ ngoại ngữ, xác nhận tính liêm chính và chữ ký của GVHD.",
  },
  {
    code: "BM-05",
    name: "Bảng kê khai và tính điểm quy đổi công bố khoa học WoS/Scopus",
    format: "XLSX",
    size: "95 KB",
    category: "Công bố",
    summary:
      "Bảng tính tự động quy đổi điểm bài báo chuẩn đầu ra theo danh mục Q1 (1.5đ), Q2 (1.25đ), Scopus (0.75 - 1.0đ) của ĐHQG-HCM.",
  },
  {
    code: "BM-06",
    name: "Đơn xin gia hạn thời gian đào tạo trình độ tiến sĩ",
    format: "DOCX",
    size: "125 KB",
    category: "Học vụ",
    summary:
      "Dành cho NCS khóa sắp hết thời hạn học tập chuẩn 36 tháng, nộp kèm kế hoạch hoàn thành luận án có xác nhận của GVHD chính.",
  },
];

export const FALLBACK_REGULATIONS: StaticRegulationItem[] = [
  {
    id: "reg-01",
    code: "QĐ 45/QĐ-ĐHQG",
    title: "Quy chế Tuyển sinh và Đào tạo Trình độ Tiến sĩ - ĐHQG-HCM",
    authority: "Đại học Quốc gia TP. Hồ Chí Minh",
    date: "15/08/2021",
    format: "PDF",
    size: "680 KB",
    summary:
      "Văn bản quy định khung toàn diện về thời gian đào tạo chuẩn (3 - 4 năm), thời gian gia hạn tối đa không quá 72 tháng, quy trình 9 mốc tiến độ và tổ chức Hội đồng đánh giá luận án các cấp.",
    keyPoints: [
      "Thời gian đào tạo tiêu chuẩn: 36 - 48 tháng",
      "Tổng thời gian tối đa (kể cả gia hạn): Không quá 72 tháng",
      "Khung đào tạo chuẩn hóa: 09 mốc tiến độ bắt buộc",
      "Quy trình đánh giá luận án qua 2 cấp: Đơn vị chuyên môn & Cấp Trường",
    ],
  },
  {
    id: "reg-02",
    code: "BR-09 ĐHQG-HCM",
    title: "Quy định Hạn ngạch và Tiêu chuẩn Giảng viên Hướng dẫn",
    authority: "Đại học Quốc gia TP. Hồ Chí Minh",
    date: "10/11/2022",
    format: "PDF",
    size: "420 KB",
    summary:
      "Quy định chi tiết về tải trọng và hạn ngạch hướng dẫn: GVHD độc lập tính 1.0 NCS; Đồng hướng dẫn tính 0.5 NCS. Mỗi giảng viên hướng dẫn không quá 3.0 NCS tại cùng một thời điểm.",
    keyPoints: [
      "Hướng dẫn chính / Độc lập: 1.0 NCS",
      "Đồng hướng dẫn: 0.5 NCS",
      "Trần định mức chuẩn: Không quá 3.0 NCS tại cùng một thời điểm",
      "Đặc cách GS/PGS chủ trì đề tài cấp Bộ: Tối đa 4.0 NCS",
    ],
  },
  {
    id: "reg-03",
    code: "BR-08 AGU",
    title: "Quy định Chuẩn đầu ra Công bố Khoa học Quốc tế (WoS/Scopus)",
    authority: "Trường Đại học An Giang - ĐHQG-HCM",
    date: "20/03/2023",
    format: "PDF",
    size: "350 KB",
    summary:
      "Điều kiện bắt buộc để NCS được phép đăng ký bảo vệ luận án cấp cơ sở: Phải đạt tổng điểm quy đổi công bố khoa học ≥ 2.0 điểm từ các bài báo WoS/Scopus có ghi tên đơn vị Trường Đại học An Giang.",
    keyPoints: [
      "Tổng điểm bài báo tích lũy tối thiểu: ≥ 2.0 điểm",
      "Danh mục công nhận: WoS (SCI, SCIE, SSCI, AHCI) & Scopus",
      "Vai trò tác giả: Tác giả thứ nhất (First) hoặc tác giả liên hệ (Corresponding)",
      "Đơn vị công tác: Bắt buộc ghi An Giang University - VNU-HCM",
    ],
  },
  {
    id: "reg-04",
    code: "TT 38/2021/TT-BGDĐT",
    title: "Thông tư Ban hành Quy chế Đào tạo Tiến sĩ Toàn quốc",
    authority: "Bộ Giáo dục và Đào tạo",
    date: "28/12/2021",
    format: "PDF",
    size: "510 KB",
    summary:
      "Thông tư quy định tiêu chuẩn đầu vào, chuẩn đầu ra ngoại ngữ, trách nhiệm của cơ sở đào tạo và quy chế tổ chức Hội đồng bảo vệ luận án.",
    keyPoints: [
      "Quy chuẩn văn bằng và chứng chỉ ngoại ngữ quốc tế",
      "Tiêu chuẩn thành viên Hội đồng: Tối thiểu 5 - 7 nhà khoa học",
      "Nguyên tắc liêm chính học thuật và phản biện độc lập",
    ],
  },
  {
    id: "reg-05",
    code: "Quy trình AGU-SĐH",
    title: "Quy trình Xét duyệt Minh chứng & Bảo vệ Luận án Tiến sĩ",
    authority: "Trường Đại học An Giang",
    date: "05/01/2024",
    format: "PDF",
    size: "290 KB",
    summary:
      "Hướng dẫn cụ thể các bước chuẩn bị hồ sơ bảo vệ, kiểm tra điều kiện tốt nghiệp, nộp lưu chiểu Thư viện và công nhận cấp bằng tiến sĩ.",
    keyPoints: [
      "Quy trình thẩm định minh chứng 2 cấp: Khoa & Phòng Đào tạo SĐH",
      "Thủ tục ký số và xác thực điện tử hồ sơ nghiên cứu",
      "Lưu chiểu Thư viện Trung tâm ĐHQG-HCM và Thư viện Quốc gia",
    ],
  },
];
