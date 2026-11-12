import type { StudentGraduationOverview } from "@/src/types/ui/graduation";

/**
 * Kịch bản 1: NCS đã đạt đầy đủ 6/6 điều kiện — sẵn sàng trình Hội đồng xét tốt nghiệp.
 */
export const mockGraduationEligibleOverview: StudentGraduationOverview = {
  ncsId: "ncs-01",
  hoTenNcs: "Nguyễn Văn A",
  mshv: "NCS2024001",
  chuyenNganh: "Khoa học máy tính (9480101)",
  khoaHoc: "Khóa 32 (2024 - 2028)",
  duDieuKien: true,
  daDatCount: 6,
  tongDieuKien: 6,
  ngayKiemTraGanNhat: "2026-11-10T09:30:00Z",
  ghiChuHoiDong:
    "Hồ sơ đáp ứng đầy đủ cả 06 điều kiện xét công nhận trình độ và cấp bằng Tiến sĩ theo Quy chế hiện hành. Phòng Đào tạo Sau Đại học sẽ đưa vào danh sách xét tốt nghiệp đợt gần nhất.",
  dieuKienList: [
    {
      maDieuKien: "HOAN_THANH_MOC",
      thuTu: 1,
      tenHienThi: "Hoàn thành 9 mốc đào tạo & bảo vệ luận án",
      moTaYeuCau:
        "Hoàn tất đủ 9/9 mốc tiến trình học vụ, đạt điểm công bố khoa học (>= 2.0đ) và có biên bản đạt cấp Trường.",
      dat: true,
      giaTriThucTe: "9/9 mốc đạt (Mốc 9 đã duyệt)",
      ghiChu: "Đã hoàn thành bảo vệ luận án tiến sĩ cấp Trường ngày 18/10/2026.",
      actionHref: "/student/progress",
      actionLabel: "Xem tiến trình 9 mốc",
      taiLieuChungMinh: {
        fileName: "QD_CongNhanBaoVe_CapTruong_NCS2024001.pdf",
        fileUrl: "mock://tot-nghiep/QD_CongNhanBaoVe_CapTruong_NCS2024001.pdf",
        subtitle: "Xác nhận hoàn thành Mốc 9 & Nghiệm thu luận án",
      },
    },
    {
      maDieuKien: "TRANG_THAI_HOC_TAP",
      thuTu: 2,
      tenHienThi: "Trạng thái học tập hợp lệ",
      moTaYeuCau:
        "Nghiên cứu sinh đang ở trạng thái theo học chính quy, không bị đình chỉ hoặc đang bảo lưu học vụ.",
      dat: true,
      giaTriThucTe: "Đang theo học chính quy",
      ghiChu: "Hồ sơ học vụ liên tục, không ghi nhận vi phạm quy chế đào tạo.",
    },
    {
      maDieuKien: "THOI_HAN",
      thuTu: 3,
      tenHienThi: "Thời hạn đào tạo tối đa (72 tháng)",
      moTaYeuCau:
        "Thời điểm xét tốt nghiệp phải nằm trong giới hạn tối đa 72 tháng (kể cả thời gian gia hạn được phê duyệt).",
      dat: true,
      giaTriThucTe: "34/72 tháng (Còn hiệu lực)",
      ghiChu: "Hạn đào tạo tối đa đến ngày 15/01/2030.",
    },
    {
      maDieuKien: "NGOAI_NGU",
      thuTu: 4,
      tenHienThi: "Chuẩn trình độ ngoại ngữ đầu ra",
      moTaYeuCau:
        "Có chứng chỉ ngoại ngữ đạt bậc 4/6 (B2) theo Khung năng lực ngoại ngữ 6 bậc hoặc tương đương còn thời hạn 2 năm.",
      dat: true,
      giaTriThucTe: "B2 Vstep - Hợp lệ",
      ghiChu: "Chứng chỉ cấp ngày 14/12/2025, còn thời hạn đến 14/12/2027.",
      taiLieuChungMinh: {
        fileName: "ChungChi_VSTEP_B2_NCS2024001.pdf",
        fileUrl: "mock://tot-nghiep/ChungChi_VSTEP_B2_NCS2024001.pdf",
        subtitle: "Minh chứng chuẩn ngoại ngữ đầu ra B2 Vstep",
      },
    },
    {
      maDieuKien: "CONG_NO",
      thuTu: 5,
      tenHienThi: "Nghĩa vụ tài chính & công nợ học phí",
      moTaYeuCau:
        "Hoàn tất 100% học phí các học kỳ, lệ phí chấm luận án và hoàn trả đầy đủ tài sản/tài liệu thư viện.",
      dat: true,
      giaTriThucTe: "Không nợ học phí",
      ghiChu: "Đã đối soát xong công nợ với Phòng Kế hoạch - Tài chính.",
      taiLieuChungMinh: {
        fileName: "GiayXacNhan_KhongCongNo_NCS2024001.pdf",
        fileUrl: "mock://tot-nghiep/GiayXacNhan_KhongCongNo_NCS2024001.pdf",
        subtitle: "Xác nhận hoàn tất nghĩa vụ học phí & thư viện",
      },
    },
    {
      maDieuKien: "DE_NGHI_CHO_DUYET",
      thuTu: 6,
      tenHienThi: "Đơn đề nghị học vụ đang chờ xử lý",
      moTaYeuCau:
        "Không còn đơn đề nghị (đổi đề tài, đổi GVHD, gia hạn) đang ở trạng thái Chờ GVHD xác nhận hoặc Chờ duyệt.",
      dat: true,
      giaTriThucTe: "0 đơn đang chờ duyệt",
      ghiChu: "Tất cả hồ sơ đề nghị điều chỉnh trước đây đã được đóng hoàn tất.",
      actionHref: "/student/extensions",
      actionLabel: "Lịch sử đơn đề nghị",
    },
  ],
};

/**
 * Kịch bản 2: NCS mới đạt 4/6 điều kiện — còn vướng chuẩn ngoại ngữ & 1 đề nghị chờ duyệt.
 */
export const mockGraduationNotEligibleOverview: StudentGraduationOverview = {
  ncsId: "ncs-01",
  hoTenNcs: "Nguyễn Văn A",
  mshv: "NCS2024001",
  chuyenNganh: "Khoa học máy tính (9480101)",
  khoaHoc: "Khóa 32 (2024 - 2028)",
  duDieuKien: false,
  daDatCount: 4,
  tongDieuKien: 6,
  ngayKiemTraGanNhat: "2026-11-11T08:15:00Z",
  ghiChuHoiDong:
    "NCS cần bổ sung chứng chỉ ngoại ngữ còn hiệu lực và hoàn tất xử lý đơn gia hạn DN-2026-004 trước khi chốt danh sách trình Hội đồng xét tốt nghiệp.",
  dieuKienList: [
    {
      ...mockGraduationEligibleOverview.dieuKienList[0],
    },
    {
      ...mockGraduationEligibleOverview.dieuKienList[1],
    },
    {
      ...mockGraduationEligibleOverview.dieuKienList[2],
    },
    {
      maDieuKien: "NGOAI_NGU",
      thuTu: 4,
      tenHienThi: "Chuẩn trình độ ngoại ngữ đầu ra",
      moTaYeuCau:
        "Có chứng chỉ ngoại ngữ đạt bậc 4/6 (B2) theo Khung năng lực ngoại ngữ 6 bậc hoặc tương đương còn thời hạn 2 năm.",
      dat: false,
      mucDo: "error",
      giaTriThucTe: "IELTS 5.5 (Hết hạn 10/08/2026)",
      ghiChu:
        "Chứng chỉ ngoại ngữ đã quá thời hạn hiệu lực 2 năm tính đến ngày kiểm tra điều kiện tốt nghiệp. Vui lòng nộp bổ sung chứng chỉ B2 Vstep hoặc IELTS/TOEFL còn hiệu lực tại Phòng ĐT-SĐH.",
      taiLieuChungMinh: {
        fileName: "IELTS_Certificate_Expired_NCS2024001.pdf",
        fileUrl: "mock://tot-nghiep/IELTS_Certificate_Expired_NCS2024001.pdf",
        subtitle: "Chứng chỉ ngoại ngữ đã hết hiệu lực",
      },
    },
    {
      ...mockGraduationEligibleOverview.dieuKienList[4],
    },
    {
      maDieuKien: "DE_NGHI_CHO_DUYET",
      thuTu: 6,
      tenHienThi: "Đơn đề nghị học vụ đang chờ xử lý",
      moTaYeuCau:
        "Không còn đơn đề nghị (đổi đề tài, đổi GVHD, gia hạn) đang ở trạng thái Chờ GVHD xác nhận hoặc Chờ duyệt.",
      dat: false,
      mucDo: "warning",
      giaTriThucTe: "Còn 01 đơn chờ duyệt (DN-2026-004)",
      ghiChu:
        "Đơn gia hạn học tập DN-2026-004 đang ở trạng thái Chờ GVHD xác nhận. Bạn cần chờ phê duyệt xong hoặc hủy đơn nếu không còn nhu cầu.",
      actionHref: "/student/extensions",
      actionLabel: "Kiểm tra đơn đề nghị",
    },
  ],
};
