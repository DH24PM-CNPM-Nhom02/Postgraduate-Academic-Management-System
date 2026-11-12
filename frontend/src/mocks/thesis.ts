import type {
  StudentSupervisorsOverview,
  StudentThesisOverview,
} from "@/src/types/ui/thesis";

/**
 * Mock data thuần UI cho màn hình "Đề tài luận án của tôi" (/student/thesis).
 * Nhất quán với hồ sơ mẫu NCS Nguyễn Văn A (NCS2024001 - K32-CNTT).
 */
export const mockStudentThesisOverview: StudentThesisOverview = {
  ncsId: "ncs-01",
  hoTenNcs: "Nguyễn Văn A",
  mshv: "NCS2024001",
  khoaHoc: "Khóa 32 (2024 - 2028)",
  ngayNhapHoc: "2024-01-15T08:00:00Z",
  hanDaoTao72Thang: "2030-01-15T08:00:00Z",
  deTaiHienTai: {
    id: "dt-2025-01",
    maDeTai: "NCS-CNTT-32-01",
    tenDeTaiTiengViet:
      "Nghiên cứu mô hình học sâu kết hợp đồ thị tri thức trong phân tích và chuẩn hóa hồ sơ y tế tiếng Việt",
    tenDeTaiTiengAnh:
      "Deep Learning Combined with Knowledge Graphs for Vietnamese Electronic Health Record Analysis and Standardization",
    chuyenNganh: "Khoa học máy tính",
    maNganh: "9480101",
    moTaNgan:
      "Đề tài tập trung xây dựng kiến trúc trích xuất thực thể lâm sàng, ánh xạ thuật ngữ y khoa chuẩn hóa và đánh giá độ tin cậy trên tập dữ liệu bệnh án tiếng Việt.",
    trangThai: "HIEU_LUC",
    ngayBatDau: "2025-03-10T08:00:00Z",
    quyetDinh: {
      soQuyetDinh: "248/QĐ-ĐHAG",
      ngayKy: "2025-03-10T08:00:00Z",
      coQuanBanHanh: "Hiệu trưởng Trường Đại học An Giang - ĐHQG-HCM",
      fileName: "QD_248_DieuChinhDeTai_NCS2024001.pdf",
      fileUrl: "mock://quyet-dinh/QD_248_DieuChinhDeTai_NCS2024001.pdf",
    },
  },
  lichSuDeTai: [
    {
      id: "dt-2024-01",
      maDeTai: "NCS-CNTT-32-01-V1",
      tenDeTaiTiengViet:
        "Ứng dụng học sâu trong phân loại văn bản y tế tiếng Việt",
      tenDeTaiTiengAnh:
        "Applying Deep Learning to Vietnamese Medical Text Classification",
      chuyenNganh: "Khoa học máy tính",
      maNganh: "9480101",
      moTaNgan:
        "Phiên bản đề tài ban đầu tập trung vào bài toán phân loại văn bản đơn thuần, sau đó được mở rộng kết hợp đồ thị tri thức theo góp ý của Hội đồng đề cương.",
      trangThai: "DA_THAY_THE",
      ngayBatDau: "2024-01-15T08:00:00Z",
      ngayKetThuc: "2025-03-09T17:00:00Z",
      lyDoThayDoi:
        "Điều chỉnh tên đề tài để phản ánh đúng phạm vi bổ sung đồ thị tri thức y khoa theo kết luận của Hội đồng đánh giá tiểu luận tổng quan.",
      quyetDinh: {
        soQuyetDinh: "124/QĐ-ĐHAG",
        ngayKy: "2024-01-15T08:00:00Z",
        coQuanBanHanh: "Hiệu trưởng Trường Đại học An Giang - ĐHQG-HCM",
        fileName: "QD_124_GiaoDeTai_NCS2024001.pdf",
        fileUrl: "mock://quyet-dinh/QD_124_GiaoDeTai_NCS2024001.pdf",
      },
    },
    {
      id: "dt-2023-draft",
      maDeTai: "NCS-CNTT-32-00",
      tenDeTaiTiengViet:
        "Khai phá dữ liệu văn bản hành chính công bằng mô hình ngôn ngữ cỡ nhỏ",
      tenDeTaiTiengAnh:
        "Public Administration Text Mining Using Compact Language Models",
      chuyenNganh: "Khoa học máy tính",
      maNganh: "9480101",
      trangThai: "DA_HUY",
      ngayBatDau: "2023-11-20T08:00:00Z",
      ngayKetThuc: "2024-01-10T17:00:00Z",
      lyDoThayDoi:
        "Đề xuất sơ bộ trước khi nhập học không tiếp tục triển khai do chuyển hướng sang nguồn dữ liệu bệnh án thực tế tại đơn vị phối hợp.",
      quyetDinh: {
        soQuyetDinh: "092/QĐ-SĐH",
        ngayKy: "2023-11-20T08:00:00Z",
        coQuanBanHanh: "Phòng Đào tạo Sau Đại học - AGU",
        fileName: "QD_092_DeXuatSoBo_NCS2024001.pdf",
        fileUrl: "mock://quyet-dinh/QD_092_DeXuatSoBo_NCS2024001.pdf",
      },
    },
  ],
};

/**
 * Mock data thuần UI cho màn hình "Giảng viên hướng dẫn của tôi" (/student/supervisors).
 * Phản ánh đúng quy chế BR-09 (Hướng dẫn chính: 1.0, Đồng hướng dẫn: 0.5).
 */
export const mockStudentSupervisorsOverview: StudentSupervisorsOverview = {
  ncsId: "ncs-01",
  hoTenNcs: "Nguyễn Văn A",
  mshv: "NCS2024001",
  danhSachGvhd: [
    {
      id: "pc-gvhd-01",
      giangVienId: "gv-01",
      hoTen: "Trần Quốc Tuấn",
      hocHamHocVi: "PGS.TS.",
      vaiTro: "HUONG_DAN_CHINH",
      trongSo: 1.0,
      email: "tqtuan@agu.edu.vn",
      soDienThoai: "0296 6256 565 (Ext: 1204)",
      donViCongTac: "Khoa Công nghệ thông tin - Trường Đại học An Giang",
      linhVucNghienCuu: "Trí tuệ nhân tạo, Xử lý ngôn ngữ tự nhiên, Học sâu",
      trangThai: "DANG_HUONG_DAN",
      soQuyetDinh: "124/QĐ-ĐHAG",
      ngayKyQuyetDinh: "2024-01-15T08:00:00Z",
      ngayBatDau: "2024-01-15T08:00:00Z",
      fileNameQuyetDinh: "QD_124_PhanCongGVHD_NCS2024001.pdf",
      fileUrlQuyetDinh: "mock://quyet-dinh/QD_124_PhanCongGVHD_NCS2024001.pdf",
    },
    {
      id: "pc-gvhd-02",
      giangVienId: "gv-02",
      hoTen: "Vũ Đức Đam",
      hocHamHocVi: "TS.",
      vaiTro: "DONG_HUONG_DAN",
      trongSo: 0.5,
      email: "vddam@hcmut.edu.vn",
      soDienThoai: "028 3864 7256",
      donViCongTac: "Khoa Khoa học & Kỹ thuật Máy tính - ĐH Bách Khoa TP.HCM",
      linhVucNghienCuu: "Đồ thị tri thức, Tin sinh học & Dữ liệu y tế lớn",
      trangThai: "DANG_HUONG_DAN",
      soQuyetDinh: "248/QĐ-ĐHAG",
      ngayKyQuyetDinh: "2025-03-10T08:00:00Z",
      ngayBatDau: "2025-03-10T08:00:00Z",
      fileNameQuyetDinh: "QD_248_BoSungDongHuongDan_NCS2024001.pdf",
      fileUrlQuyetDinh:
        "mock://quyet-dinh/QD_248_BoSungDongHuongDan_NCS2024001.pdf",
    },
  ],
};
