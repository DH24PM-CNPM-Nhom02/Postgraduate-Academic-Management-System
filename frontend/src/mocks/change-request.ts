import type {
  CandidateSupervisorOption,
  ChangeRequestItem,
  StudentChangeRequestsOverview,
} from "@/src/types/ui/change-request";
import {
  mockStudentSupervisorsOverview,
  mockStudentThesisOverview,
} from "./thesis";

/**
 * Danh sách Giảng viên hướng dẫn tiềm năng (ngoài danh sách GVHD hiện tại của NCS)
 * phục vụ chọn GVHD mới đề xuất trong form DOI_GVHD.
 */
export const mockCandidateSupervisors: CandidateSupervisorOption[] = [
  {
    giangVienId: "gv-03",
    hoTen: "Lê Hoàng Sơn",
    hocHamHocVi: "PGS.TS.",
    donViCongTac: "Viện Công nghệ Thông tin - ĐHQGHN",
    linhVucNghienCuu: "Tính toán mềm, Đồ thị tri thức & Dữ liệu mờ",
    slotConLai: 2,
  },
  {
    giangVienId: "gv-04",
    hoTen: "Nguyễn Minh Trí",
    hocHamHocVi: "TS.",
    donViCongTac: "Khoa Công nghệ thông tin - Trường Đại học An Giang",
    linhVucNghienCuu: "Xử lý ngôn ngữ tự nhiên & Truy hồi thông tin",
    slotConLai: 1.5,
  },
  {
    giangVienId: "gv-05",
    hoTen: "Phạm Văn Hùng",
    hocHamHocVi: "PGS.TS.",
    donViCongTac: "Khoa Khoa học máy tính - ĐH Cần Thơ",
    linhVucNghienCuu: "Học máy, Thị giác máy tính & Y tế thông minh",
    slotConLai: 1,
  },
  {
    giangVienId: "gv-06",
    hoTen: "Đặng Thị Mai Anh",
    hocHamHocVi: "TS.",
    donViCongTac: "Khoa Kỹ thuật Phần mềm - ĐH CNTT (ĐHQG-HCM)",
    linhVucNghienCuu: "Hệ thống thông tin y tế & Chuẩn hóa dữ liệu HL7/FHIR",
    slotConLai: 2.5,
  },
];

export const mockChangeRequestList: ChangeRequestItem[] = [
  {
    id: "cr-2026-004",
    maDon: "DN-2026-004",
    loaiDon: "GIA_HAN",
    trangThai: "CHO_GVHD_XAC_NHAN",
    ngayGui: "2026-10-25T08:30:00Z",
    ngayCapNhat: "2026-10-28T09:15:00Z",
    soThangGiaHan: 6,
    hanHienTaiTaiThoiDiemNop: "2028-07-15T08:00:00Z",
    hanMoiDuKien: "2029-01-15T08:00:00Z",
    lyDo:
      "Cần bổ sung thêm 06 tháng để thu thập dữ liệu bệnh án ngoại trú giai đoạn 2 tại Bệnh viện Đa khoa Trung tâm An Giang và hoàn thiện bản thảo bài báo ISI/Q1 theo góp ý phản biện vòng 1.",
    batKhaKhang: false,
    xacNhanGvhds: [
      {
        id: "op-01",
        giangVienId: "gv-01",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: true,
        nhanXet:
          "Đồng ý đề nghị gia hạn 06 tháng. NCS đã hoàn thành 75% thực nghiệm mô hình và cần thêm thời gian để hoàn tất kiểm chứng lâm sàng.",
        thoiGianPhanHoi: "2026-10-28T09:15:00Z",
      },
      {
        id: "op-02",
        giangVienId: "gv-02",
        tenGvhd: "Vũ Đức Đam",
        hocHamHocVi: "TS.",
        vaiTro: "DONG_HUONG_DAN",
        dongY: null,
        nhanXet: null,
        thoiGianPhanHoi: null,
      },
    ],
    tepDinhKem: {
      fileName: "BaoCaoTienDo_GiaHan_NCS2024001.pdf",
      fileUrl: "mock://tai-lieu/BaoCaoTienDo_GiaHan_NCS2024001.pdf",
      fileSize: 2450120,
    },
    quyetDinh: null,
  },
  {
    id: "cr-2026-001",
    maDon: "DN-2026-001",
    loaiDon: "GIA_HAN",
    trangThai: "DA_DUYET",
    ngayGui: "2026-03-02T09:00:00Z",
    ngayCapNhat: "2026-03-20T14:30:00Z",
    nguoiXuLy: "PGS.TS. Nguyễn Văn Hòa (Phó Hiệu trưởng)",
    ngayXuLy: "2026-03-20T14:30:00Z",
    soThangGiaHan: 6,
    hanHienTaiTaiThoiDiemNop: "2028-01-15T08:00:00Z",
    hanMoiDuKien: "2028-07-15T08:00:00Z",
    lyDo:
      "Gia hạn đợt 1 (06 tháng) để mở rộng tập dữ liệu thực nghiệm tiếng Việt đa chuyên khoa và chuẩn bị bảo vệ chuyên đề tiến sĩ cấp bộ môn.",
    batKhaKhang: false,
    xacNhanGvhds: [
      {
        id: "op-03",
        giangVienId: "gv-01",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: true,
        nhanXet: "Nhất trí kế hoạch triển khai nghiên cứu trong 06 tháng gia hạn.",
        thoiGianPhanHoi: "2026-03-05T10:20:00Z",
      },
      {
        id: "op-04",
        giangVienId: "gv-02",
        tenGvhd: "Vũ Đức Đam",
        hocHamHocVi: "TS.",
        vaiTro: "DONG_HUONG_DAN",
        dongY: true,
        nhanXet: "Đồng ý gia hạn để đồng bộ phần đồ thị tri thức y khoa.",
        thoiGianPhanHoi: "2026-03-06T16:40:00Z",
      },
    ],
    tepDinhKem: {
      fileName: "BaoCaoTienDo_Dot1_NCS2024001.pdf",
      fileUrl: "mock://tai-lieu/BaoCaoTienDo_Dot1_NCS2024001.pdf",
      fileSize: 1843200,
    },
    quyetDinh: {
      soQuyetDinh: "115/QĐ-ĐHAG",
      ngayKy: "2026-03-20T08:00:00Z",
      coQuanBanHanh: "Hiệu trưởng Trường Đại học An Giang - ĐHQG-HCM",
      fileName: "QD_115_GiaHanHocTap_NCS2024001.pdf",
      fileUrl: "mock://quyet-dinh/QD_115_GiaHanHocTap_NCS2024001.pdf",
    },
  },
  {
    id: "cr-2025-002",
    maDon: "DN-2025-002",
    loaiDon: "DOI_DE_TAI",
    trangThai: "DA_DUYET",
    ngayGui: "2025-02-18T10:15:00Z",
    ngayCapNhat: "2025-03-10T08:00:00Z",
    nguoiXuLy: "Phòng Đào tạo Sau Đại học",
    ngayXuLy: "2025-03-10T08:00:00Z",
    tenDeTaiCu: "Ứng dụng học sâu trong phân loại văn bản y tế tiếng Việt",
    tenDeTaiMoi:
      "Nghiên cứu mô hình học sâu kết hợp đồ thị tri thức trong phân tích và chuẩn hóa hồ sơ y tế tiếng Việt",
    lyDo:
      "Cập nhật tên đề tài theo kết luận góp ý của Hội đồng đánh giá tiểu luận tổng quan nhằm phản ánh chính xác phương pháp kết hợp đồ thị tri thức.",
    batKhaKhang: false,
    tepDinhKem: {
      fileName: "ToTrinh_DieuChinhTenDeTai_NCS2024001.pdf",
      fileUrl: "mock://tai-lieu/ToTrinh_DieuChinhTenDeTai_NCS2024001.pdf",
      fileSize: 1120400,
    },
    quyetDinh: {
      soQuyetDinh: "248/QĐ-ĐHAG",
      ngayKy: "2025-03-10T08:00:00Z",
      coQuanBanHanh: "Hiệu trưởng Trường Đại học An Giang - ĐHQG-HCM",
      fileName: "QD_248_DieuChinhDeTai_NCS2024001.pdf",
      fileUrl: "mock://quyet-dinh/QD_248_DieuChinhDeTai_NCS2024001.pdf",
    },
  },
  {
    id: "cr-2024-001",
    maDon: "DN-2024-001",
    loaiDon: "DOI_GVHD",
    trangThai: "TU_CHOI",
    ngayGui: "2024-11-05T13:45:00Z",
    ngayCapNhat: "2024-11-18T11:00:00Z",
    nguoiXuLy: "TS. Trần Minh Quang (Trưởng phòng ĐT-SĐH)",
    ngayXuLy: "2024-11-18T11:00:00Z",
    phanCongCuId: "pc-gvhd-02",
    tenGvhdCu: "TS. Vũ Đức Đam",
    vaiTroGvhdCu: "DONG_HUONG_DAN",
    gvhdMoiId: "gv-05",
    tenGvhdMoi: "PGS.TS. Phạm Văn Hùng",
    donViGvhdMoi: "Khoa Khoa học máy tính - ĐH Cần Thơ",
    lyDo:
      "Đề nghị điều chỉnh người đồng hướng dẫn để tăng cường phối hợp hướng dẫn về mảng dữ liệu bệnh án hình ảnh và văn bản.",
    batKhaKhang: false,
    lyDoTuChoi:
      "Giảng viên được đề xuất hiện đã đạt ngưỡng hạn ngạch hướng dẫn tối đa theo Quy chế BR-09 trong năm học 2024–2025. Đề nghị NCS giữ nguyên phân công hiện tại hoặc chọn giảng viên khác còn định mức.",
    tepDinhKem: {
      fileName: "DonDeNghi_ThayDoiGVHD_2024.pdf",
      fileUrl: "mock://tai-lieu/DonDeNghi_ThayDoiGVHD_2024.pdf",
      fileSize: 845120,
    },
    quyetDinh: null,
  },
  {
    id: "cr-2024-000",
    maDon: "DN-2024-000",
    loaiDon: "DOI_DE_TAI",
    trangThai: "DA_HUY",
    ngayGui: "2024-08-12T08:10:00Z",
    ngayCapNhat: "2024-08-14T15:20:00Z",
    tenDeTaiCu: "Ứng dụng học sâu trong phân loại văn bản y tế tiếng Việt",
    tenDeTaiMoi: "Xử lý ngôn ngữ tự nhiên cho dữ liệu hành chính và y tế công",
    lyDo: "NCS chủ động rút đơn để rà soát lại hướng nghiên cứu cùng tập thể GVHD trước khi bảo vệ tiểu luận tổng quan.",
    batKhaKhang: false,
    tepDinhKem: null,
    quyetDinh: null,
  },
];

/**
 * Dữ liệu tổng quan thuần UI cho màn hình "Đơn đề nghị điều chỉnh & Gia hạn học tập"
 * (`/student/extensions`).
 */
export const mockStudentChangeRequestsOverview: StudentChangeRequestsOverview = {
  ncsId: mockStudentThesisOverview.ncsId,
  hoTenNcs: mockStudentThesisOverview.hoTenNcs,
  mshv: mockStudentThesisOverview.mshv,
  tenDeTaiHienTai:
    mockStudentThesisOverview.deTaiHienTai?.tenDeTaiTiengViet ??
    "Chưa có đề tài đang hiệu lực",
  danhSachGvhdHienTai: mockStudentSupervisorsOverview.danhSachGvhd,
  danhSachGvhdDeXuat: mockCandidateSupervisors,
  thongTinThoiGian: {
    hanChinhQuy: "2028-01-15T08:00:00Z",
    hanGiaHan: "2028-07-15T08:00:00Z",
    hanHienTai: "2028-07-15T08:00:00Z",
    hanBuocThoiHoc: mockStudentThesisOverview.hanDaoTao72Thang,
    tongThangDaGiaHan: 6,
    toiDaThangTichLuy: 24,
    soThangToiDaConDuocXin: 18,
    daDatMoc2: true,
    conTruocHanToiThieu2Thang: true,
    daDatMoc8: false,
    conDuoi12ThangKhoaHoc: false,
  },
  danhSachDon: mockChangeRequestList,
};
