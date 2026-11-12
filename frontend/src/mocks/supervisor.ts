import {
  SUPERVISOR_ROLE_WEIGHTS,
  type QuotaScenarioOption,
  type QuotaWarningLevel,
  type SupervisedStudent,
  type SupervisorExtensionRequestItem,
  type SupervisorProfile,
  type SupervisorProgressReportItem,
  type SupervisorProxyRequestItem,
  type SupervisorQuota,
} from "@/src/types/ui/supervisor";
import type { MilestoneProgressItem } from "@/src/types/ui/progress";

/**
 * Helper thuần UI tính định mức hướng dẫn theo Quy chế BR-09:
 * - Hướng dẫn chính (`HUONG_DAN_CHINH`): trọng số 1.0
 * - Đồng hướng dẫn (`DONG_HUONG_DAN`): trọng số 0.5
 */
export function computeSupervisorQuota(
  students: SupervisedStudent[],
  hanMucToiDa = 5.0
): SupervisorQuota {
  const activeStudents = students.filter(
    (s) => s.trangThaiHocTap !== "TOT_NGHIEP" && s.trangThaiHocTap !== "TAM_DUNG"
  );

  const soLuongHuongDanChinh = activeStudents.filter(
    (s) => s.vaiTro === "HUONG_DAN_CHINH"
  ).length;
  const soLuongDongHuongDan = activeStudents.filter(
    (s) => s.vaiTro === "DONG_HUONG_DAN"
  ).length;

  const trongSoChinh = Number(
    (soLuongHuongDanChinh * SUPERVISOR_ROLE_WEIGHTS.HUONG_DAN_CHINH).toFixed(1)
  );
  const trongSoPhu = Number(
    (soLuongDongHuongDan * SUPERVISOR_ROLE_WEIGHTS.DONG_HUONG_DAN).toFixed(1)
  );
  const tongTrongSo = Number((trongSoChinh + trongSoPhu).toFixed(1));
  const safeMax = hanMucToiDa > 0 ? hanMucToiDa : 1.0;
  const trongSoConLai = Number(Math.max(0, hanMucToiDa - tongTrongSo).toFixed(1));
  const tyLeSuDungPhanTram =
    hanMucToiDa > 0 ? Math.round((tongTrongSo / safeMax) * 100) : 0;

  let mucCanhBao: QuotaWarningLevel = "SAFE";
  let ghiChuCanhBao: string | undefined =
    "Định mức đang ở ngưỡng an toàn, đủ điều kiện tiếp nhận thêm NCS.";

  if (tongTrongSo > hanMucToiDa) {
    mucCanhBao = "EXCEEDED";
    ghiChuCanhBao =
      "Tổng trọng số đang vượt hạn mức cho phép theo BR-09. Cần báo cáo Giáo vụ Sau đại học điều chỉnh phân công.";
  } else if (tongTrongSo >= hanMucToiDa) {
    mucCanhBao = "FULL";
    ghiChuCanhBao =
      "Đã đạt trần hạn mức tối đa. Không thể tiếp nhận thêm NCS mới cho đến khi có học viên bảo vệ thành công.";
  } else if (tyLeSuDungPhanTram >= 80) {
    mucCanhBao = "WARNING";
    ghiChuCanhBao = `Sắp chạm trần hạn mức (còn trống ${trongSoConLai.toFixed(
      1
    )} điểm định mức). Chỉ nên nhận thêm tối đa 1 NCS phù hợp trọng số còn lại.`;
  }

  return {
    hanMucToiDa,
    soLuongHuongDanChinh,
    soLuongDongHuongDan,
    trongSoChinh,
    trongSoPhu,
    tongTrongSo,
    trongSoConLai,
    tyLeSuDungPhanTram,
    mucCanhBao,
    ghiChuCanhBao,
  };
}

function buildStandardNineMilestones(
  prefix: string,
  overrides: Partial<Record<number, Partial<MilestoneProgressItem>>>
): MilestoneProgressItem[] {
  const baseCatalog: Array<{
    thuTu: number;
    tenMoc: string;
    thoiGianDuKien: string;
    yeuCauDiem: boolean;
    moTa: string;
  }> = [
    {
      thuTu: 1,
      tenMoc: "Mốc 1: Nhận quyết định công nhận NCS & Đề tài",
      thoiGianDuKien: "Tháng 0-3",
      yeuCauDiem: false,
      moTa: "Hoàn tất thủ tục nhập học và nhận Quyết định công nhận nghiên cứu sinh chính thức.",
    },
    {
      thuTu: 2,
      tenMoc: "Mốc 2: Hoàn thành tiểu luận tổng quan",
      thoiGianDuKien: "Tháng 3-9",
      yeuCauDiem: true,
      moTa: "Báo cáo và bảo vệ tiểu luận tổng quan tình hình nghiên cứu trước Hội đồng chuyên môn.",
    },
    {
      thuTu: 3,
      tenMoc: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01",
      thoiGianDuKien: "Tháng 9-15",
      yeuCauDiem: true,
      moTa: "Trình bày và nộp minh chứng báo cáo chuyên đề tiến sĩ số 01 theo kế hoạch học tập.",
    },
    {
      thuTu: 4,
      tenMoc: "Mốc 4: Báo cáo chuyên đề tiến sĩ 02",
      thoiGianDuKien: "Tháng 15-21",
      yeuCauDiem: true,
      moTa: "Hoàn thành và bảo vệ chuyên đề tiến sĩ số 02 có bảng điểm đánh giá của tiểu ban.",
    },
    {
      thuTu: 5,
      tenMoc: "Mốc 5: Bảo vệ đề cương chi tiết luận án",
      thoiGianDuKien: "Tháng 18-24",
      yeuCauDiem: true,
      moTa: "Bảo vệ đề cương chi tiết luận án trước Hội đồng chuyên môn cấp Đơn vị.",
    },
    {
      thuTu: 6,
      tenMoc: "Mốc 6: Báo cáo tiến độ nghiên cứu định kỳ",
      thoiGianDuKien: "Tháng 24-30",
      yeuCauDiem: false,
      moTa: "Cập nhật kết quả thực nghiệm và tiến độ thực hiện luận án định kỳ 6 tháng.",
    },
    {
      thuTu: 7,
      tenMoc: "Mốc 7: Hội thảo khoa học chuyên ngành",
      thoiGianDuKien: "Tháng 30-34",
      yeuCauDiem: false,
      moTa: "Trình bày kết quả nghiên cứu tại hội thảo chuyên ngành và nộp giấy xác nhận.",
    },
    {
      thuTu: 8,
      tenMoc: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus)",
      thoiGianDuKien: "Tháng 34-40",
      yeuCauDiem: false,
      moTa: "Nộp minh chứng bài báo công bố đạt ngưỡng điểm khoa học theo Quy chế BR-08.",
    },
    {
      thuTu: 9,
      tenMoc: "Mốc 9: Đăng ký bảo vệ luận án cấp Trường",
      thoiGianDuKien: "Tháng 42-48",
      yeuCauDiem: false,
      moTa: "Hoàn tất hồ sơ phản biện độc lập và đề nghị thành lập Hội đồng đánh giá luận án cấp Trường.",
    },
  ];

  return baseCatalog.map((item) => {
    const custom = overrides[item.thuTu] || {};
    return {
      id: `${prefix}-moc-${String(item.thuTu).padStart(2, "0")}`,
      thuTu: item.thuTu,
      tenMoc: item.tenMoc,
      thoiGianDuKien: item.thoiGianDuKien,
      yeuCauDiem: item.yeuCauDiem,
      moTa: item.moTa,
      trangThai: "LOCKED",
      coTheNop: false,
      lichSuMinhChung: [],
      ...custom,
    };
  });
}

export const mockSupervisorProfile: SupervisorProfile = {
  id: "gvhd-001",
  hoTen: "PGS.TS. Trần Quốc Tuấn",
  hocHamHocVi: "Phó Giáo sư, Tiến sĩ",
  maCanBo: "GVHD-CNTT-001",
  donVi: "Khoa Công nghệ thông tin - Trường Đại học An Giang",
  chuyenMon: "Khoa học máy tính & Trí tuệ nhân tạo (AI/NLP)",
  email: "tuan.tq@agu.edu.vn",
  soDienThoai: "(0296) 3843 110",
};

export const mockSupervisedStudents: SupervisedStudent[] = [
  {
    id: "ncs-01",
    mshv: "NCS2024001",
    hoTen: "Nguyễn Văn A",
    lop: "K32-CNTT",
    nganh: "Công nghệ thông tin",
    chuyenNganh: "Khoa học máy tính & Trí tuệ nhân tạo",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    trangThaiHocTap: "CAN_HOAN_THIEN",
    mocHienTai: 3,
    tenMocHienTai: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01",
    soMocHoanThanh: 2,
    tongSoMoc: 9,
    tienDoPhanTram: 22,
    vaiTro: "HUONG_DAN_CHINH",
    trongSo: 1.0,
    gvhdDongHuongDan: "TS. Vũ Đức Đam",
    soQuyetDinhPhanCong: "QĐ-108/ĐHAG-SĐH",
    ngayPhanCong: "2024-01-15T08:00:00Z",
    ngayNhapHoc: "2024-01-15T08:00:00Z",
    soThangConLai: 38,
    coMocCanHoanThien: true,
    thongTinMocTuChoi: {
      mocSo: 3,
      tenMoc: "Báo cáo chuyên đề tiến sĩ 01",
      lyDoTuChoi:
        "Bản báo cáo chuyên đề 1 thiếu chữ ký xác nhận của Người hướng dẫn và chưa bổ sung bảng tổng hợp ý kiến góp ý của tiểu ban chấm điểm.",
      nguoiDuyet: "TS. Lê Hoàng (Giáo vụ Khoa)",
      ngayDuyet: "2024-10-18T16:00:00Z",
    },
    milestones: buildStandardNineMilestones("ncs01", {
      1: {
        trangThai: "PASSED",
        ngayHoanThanh: "2024-01-15T08:00:00Z",
        ghiChuHeThong: "Đã hoàn thành khi nhập học",
      },
      2: {
        trangThai: "PASSED",
        diemTrungBinh: "8.2",
        ngayHoanThanh: "2024-05-20T10:30:00Z",
        minhChungHienTai: {
          id: "ev-01-02",
          lanNop: 1,
          fileId: "file-tl-0201",
          fileName: "Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
          fileSize: 3450000,
          fileUrl: "mock://Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
          trangThai: "PASSED",
          ngayNop: "2024-05-10T14:20:00Z",
          ngayDuyet: "2024-05-20T10:30:00Z",
          nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
        },
        phieuNhanXets: [
          {
            id: "pnx-01-02-1",
            tenNguoiCham: "PGS.TS. Nguyễn Thanh Sơn",
            chucDanh: "Chủ tịch Hội đồng",
            diem: 8.5,
            fileName: "Phieu_nhan_xet_TieuLuan_NguyenThanhSon.pdf",
            fileUrl: "mock://Phieu_nhan_xet_TieuLuan_NguyenThanhSon.pdf",
            ngayDanhGia: "20/05/2024",
            nhanXet:
              "Tổng quan tài liệu cập nhật tốt, phương pháp phân tích rõ ràng.",
          },
          {
            id: "pnx-01-02-2",
            tenNguoiCham: "TS. Lê Thị Hương",
            chucDanh: "Phản biện 1",
            diem: 8.0,
            fileName: "Phieu_nhan_xet_TieuLuan_LeThiHuong.pdf",
            fileUrl: "mock://Phieu_nhan_xet_TieuLuan_LeThiHuong.pdf",
            ngayDanhGia: "20/05/2024",
            nhanXet: "Bố cục logic, cần bổ sung thêm so sánh baseline.",
          },
        ],
      },
      3: {
        trangThai: "REJECTED",
        coTheNop: true,
        lyDoTuChoi:
          "Bản báo cáo chuyên đề 1 thiếu chữ ký xác nhận của Người hướng dẫn và chưa bổ sung bảng tổng hợp ý kiến góp ý của tiểu ban chấm điểm.",
        minhChungHienTai: {
          id: "ev-01-03",
          lanNop: 1,
          fileId: "file-cd1-0301",
          fileName: "Chuyen_de_tien_si_1_NguyenVanA_draft.pdf",
          fileSize: 5210000,
          fileUrl: "mock://Chuyen_de_tien_si_1_NguyenVanA_draft.pdf",
          trangThai: "REJECTED",
          ngayNop: "2024-10-12T09:15:00Z",
          ngayDuyet: "2024-10-18T16:00:00Z",
          nguoiDuyet: "TS. Lê Hoàng (Giáo vụ Khoa)",
          lyDoTuChoi:
            "Thiếu chữ ký xác nhận GVHD và bảng tổng hợp ý kiến tiểu ban.",
        },
      },
    }),
  },
  {
    id: "ncs-02",
    mshv: "NCS2023004",
    hoTen: "Trần Thị Bích Ngọc",
    lop: "K31-CNTT",
    nganh: "Công nghệ thông tin",
    chuyenNganh: "Hệ thống thông tin quản lý",
    khoaDaoTao: "Khóa 31 (2023 - 2027)",
    tenDeTai:
      "Ứng dụng kiến trúc liên thông dữ liệu và đồ thị tri thức trong chuyển đổi số quản trị nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    trangThaiHocTap: "CHO_DUYET",
    mocHienTai: 5,
    tenMocHienTai: "Mốc 5: Bảo vệ đề cương chi tiết luận án",
    soMocHoanThanh: 4,
    tongSoMoc: 9,
    tienDoPhanTram: 44,
    vaiTro: "HUONG_DAN_CHINH",
    trongSo: 1.0,
    soQuyetDinhPhanCong: "QĐ-084/ĐHAG-SĐH",
    ngayPhanCong: "2023-03-10T08:00:00Z",
    ngayNhapHoc: "2023-03-10T08:00:00Z",
    soThangConLai: 26,
    coMocCanHoanThien: false,
    milestones: buildStandardNineMilestones("ncs02", {
      1: {
        trangThai: "PASSED",
        ngayHoanThanh: "2023-03-10T08:00:00Z",
        ghiChuHeThong: "Đã hoàn thành khi nhập học",
      },
      2: {
        trangThai: "PASSED",
        diemTrungBinh: "8.6",
        ngayHoanThanh: "2023-09-12T09:00:00Z",
      },
      3: {
        trangThai: "PASSED",
        diemTrungBinh: "8.4",
        ngayHoanThanh: "2024-02-22T15:00:00Z",
      },
      4: {
        trangThai: "PASSED",
        diemTrungBinh: "8.7",
        ngayHoanThanh: "2024-08-19T14:00:00Z",
        minhChungHienTai: {
          id: "ev-02-04",
          lanNop: 1,
          fileId: "file-cd2-04",
          fileName: "Chuyen_de_2_TranThiBichNgoc.pdf",
          fileSize: 4120000,
          fileUrl: "mock://Chuyen_de_2_TranThiBichNgoc.pdf",
          trangThai: "PASSED",
          ngayNop: "2024-08-05T10:00:00Z",
          ngayDuyet: "2024-08-19T14:00:00Z",
          nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
        },
      },
      5: {
        trangThai: "PENDING_REVIEW",
        minhChungHienTai: {
          id: "ev-02-05",
          lanNop: 1,
          fileId: "file-dc-05",
          fileName: "De_cuong_chi_tiet_TranThiBichNgoc_v1.pdf",
          fileSize: 6840000,
          fileUrl: "mock://De_cuong_chi_tiet_TranThiBichNgoc_v1.pdf",
          trangThai: "PENDING_REVIEW",
          ngayNop: "2026-10-28T11:20:00Z",
          ghiChuNcs: "Đã nộp đề cương sau khi xin ý kiến GVHD chính.",
        },
      },
    }),
  },
  {
    id: "ncs-03",
    mshv: "NCS2022002",
    hoTen: "Lê Hoàng Phúc",
    lop: "K30-CNTT",
    nganh: "Công nghệ thông tin",
    chuyenNganh: "Khoa học máy tính",
    khoaDaoTao: "Khóa 30 (2022 - 2026)",
    tenDeTai:
      "Tối ưu hóa phân cụm dữ liệu đa chiều theo thời gian thực phục vụ cảnh báo xâm nhập mặn thông minh trên nền IoT",
    trangThaiHocTap: "DANG_THUC_HIEN",
    mocHienTai: 8,
    tenMocHienTai: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus)",
    soMocHoanThanh: 7,
    tongSoMoc: 9,
    tienDoPhanTram: 78,
    vaiTro: "HUONG_DAN_CHINH",
    trongSo: 1.0,
    gvhdDongHuongDan: "PGS.TS. Nguyễn Minh Triết",
    soQuyetDinhPhanCong: "QĐ-041/ĐHAG-SĐH",
    ngayPhanCong: "2022-02-18T08:00:00Z",
    ngayNhapHoc: "2022-02-18T08:00:00Z",
    soThangConLai: 14,
    coMocCanHoanThien: false,
    milestones: buildStandardNineMilestones("ncs03", {
      1: { trangThai: "PASSED", ngayHoanThanh: "2022-02-18T08:00:00Z" },
      2: {
        trangThai: "PASSED",
        diemTrungBinh: "8.8",
        ngayHoanThanh: "2022-08-10T08:00:00Z",
      },
      3: {
        trangThai: "PASSED",
        diemTrungBinh: "8.5",
        ngayHoanThanh: "2023-02-14T08:00:00Z",
      },
      4: {
        trangThai: "PASSED",
        diemTrungBinh: "8.9",
        ngayHoanThanh: "2023-08-21T08:00:00Z",
      },
      5: {
        trangThai: "PASSED",
        diemTrungBinh: "9.0",
        ngayHoanThanh: "2024-01-12T08:00:00Z",
      },
      6: { trangThai: "PASSED", ngayHoanThanh: "2024-07-05T08:00:00Z" },
      7: {
        trangThai: "PASSED",
        ngayHoanThanh: "2025-03-19T08:00:00Z",
        minhChungHienTai: {
          id: "ev-03-07",
          lanNop: 1,
          fileId: "file-ht-07",
          fileName: "Giay_xac_nhan_hoi_thao_LeHoangPhuc.pdf",
          fileSize: 2180000,
          fileUrl: "mock://Giay_xac_nhan_hoi_thao_LeHoangPhuc.pdf",
          trangThai: "PASSED",
          ngayNop: "2025-03-04T09:00:00Z",
          ngayDuyet: "2025-03-19T08:00:00Z",
          nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
        },
      },
      8: {
        trangThai: "UNLOCKED",
        coTheNop: true,
      },
    }),
  },
  {
    id: "ncs-04",
    mshv: "NCS2024008",
    hoTen: "Phạm Minh Đức",
    lop: "K32-CNTT",
    nganh: "Công nghệ thông tin",
    chuyenNganh: "Kỹ thuật phần mềm",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Phương pháp kiểm chứng hình thức tự động cho hợp đồng thông minh và hệ thống chuỗi khối phân tán hiệu năng cao",
    trangThaiHocTap: "DANG_THUC_HIEN",
    mocHienTai: 2,
    tenMocHienTai: "Mốc 2: Hoàn thành tiểu luận tổng quan",
    soMocHoanThanh: 1,
    tongSoMoc: 9,
    tienDoPhanTram: 11,
    vaiTro: "DONG_HUONG_DAN",
    trongSo: 0.5,
    soQuyetDinhPhanCong: "QĐ-112/ĐHAG-SĐH",
    ngayPhanCong: "2024-01-15T08:00:00Z",
    ngayNhapHoc: "2024-01-15T08:00:00Z",
    soThangConLai: 40,
    coMocCanHoanThien: false,
    milestones: buildStandardNineMilestones("ncs04", {
      1: {
        trangThai: "PASSED",
        ngayHoanThanh: "2024-01-15T08:00:00Z",
        ghiChuHeThong: "Đã hoàn thành khi nhập học",
      },
      2: {
        trangThai: "UNLOCKED",
        coTheNop: true,
      },
    }),
  },
];

/**
 * Định mức mặc định tính động từ `mockSupervisedStudents` (3 x 1.0 + 1 x 0.5 = 3.5 / 5.0)
 */
export const mockSupervisorQuota: SupervisorQuota = computeSupervisorQuota(
  mockSupervisedStudents,
  5.0
);

/**
 * Các kịch bản ngưỡng định mức BR-09 dùng kiểm thử UI trang `/supervisor/quota`
 */
export const mockSupervisorQuotaScenarios: QuotaScenarioOption[] = [
  {
    id: "current",
    label: "Hồ sơ thực tế (3.5 / 5.0)",
    description: "3 NCS Hướng dẫn chính (×1.0) + 1 NCS Đồng hướng dẫn (×0.5) — Ngưỡng an toàn.",
    quota: mockSupervisorQuota,
  },
  {
    id: "low",
    label: "Ngưỡng hợp lệ thấp (2.5 / 5.0)",
    description: "2 NCS Hướng dẫn chính (×1.0) + 1 NCS Đồng hướng dẫn (×0.5) — Còn trống 2.5.",
    quota: {
      hanMucToiDa: 5.0,
      soLuongHuongDanChinh: 2,
      soLuongDongHuongDan: 1,
      trongSoChinh: 2.0,
      trongSoPhu: 0.5,
      tongTrongSo: 2.5,
      trongSoConLai: 2.5,
      tyLeSuDungPhanTram: 50,
      mucCanhBao: "SAFE",
      ghiChuCanhBao:
        "Định mức còn rộng rãi (50%), giảng viên đủ điều kiện tiếp nhận thêm tối đa 2.5 điểm định mức.",
    },
  },
  {
    id: "warning",
    label: "Gần chạm trần (4.5 / 5.0)",
    description: "4 NCS Hướng dẫn chính (×1.0) + 1 NCS Đồng hướng dẫn (×0.5) — Cảnh báo 90%.",
    quota: {
      hanMucToiDa: 5.0,
      soLuongHuongDanChinh: 4,
      soLuongDongHuongDan: 1,
      trongSoChinh: 4.0,
      trongSoPhu: 0.5,
      tongTrongSo: 4.5,
      trongSoConLai: 0.5,
      tyLeSuDungPhanTram: 90,
      mucCanhBao: "WARNING",
      ghiChuCanhBao:
        "Đã đạt 90% hạn mức tối đa. Chỉ còn nhận thêm được tối đa 1 NCS với vai trò Đồng hướng dẫn (0.5).",
    },
  },
  {
    id: "full",
    label: "Đạt trần tối đa (5.0 / 5.0)",
    description: "4 NCS Hướng dẫn chính (×1.0) + 2 NCS Đồng hướng dẫn (×0.5) — Khóa tiếp nhận mới.",
    quota: {
      hanMucToiDa: 5.0,
      soLuongHuongDanChinh: 4,
      soLuongDongHuongDan: 2,
      trongSoChinh: 4.0,
      trongSoPhu: 1.0,
      tongTrongSo: 5.0,
      trongSoConLai: 0,
      tyLeSuDungPhanTram: 100,
      mucCanhBao: "FULL",
      ghiChuCanhBao:
        "Đã chạm trần 5.0 / 5.0 điểm định mức BR-09. Hệ thống tạm khóa phân công thêm NCS mới.",
    },
  },
];


/**
 * Dữ liệu mẫu Báo cáo tiến độ các mốc NCS đã nộp để GVHD theo dõi (`/supervisor/progress-reports`)
 */
export const mockSupervisorProgressReports: SupervisorProgressReportItem[] = [
  {
    id: "pr-gv-001",
    studentId: "ncs-04",
    mshv: "NCS2024008",
    hoTenNcs: "Phạm Minh Đức",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Phương pháp kiểm chứng hình thức tự động cho hợp đồng thông minh và hệ thống chuỗi khối phân tán hiệu năng cao",
    vaiTro: "DONG_HUONG_DAN",
    mocSo: 2,
    tenMoc: "Mốc 2: Hoàn thành tiểu luận tổng quan",
    lanNop: 1,
    ngayNop: "2026-11-04T09:30:00Z",
    trangThai: "PENDING_REVIEW",
    ghiChuNcs:
      "Kính gửi Quý Thầy/Cô GVHD bản hoàn chỉnh Tiểu luận tổng quan sau khi rà soát 42 bài báo IEEE/ACM giai đoạn 2021-2026.",
    nhanXetGvhd:
      "Bản thảo tổng quan có hệ thống phân loại mô hình kiểm chứng hình thức khá đầy đủ, đang chờ Giáo vụ lên lịch Hội đồng.",
    fileName: "Tieu_luan_tong_quan_PhamMinhDuc_v1.pdf",
    fileSize: 3890000,
    fileUrl: "mock://Tieu_luan_tong_quan_PhamMinhDuc_v1.pdf",
  },
  {
    id: "pr-gv-002",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 4,
    tenMoc: "Mốc 4: Báo cáo chuyên đề tiến sĩ 02",
    lanNop: 1,
    ngayNop: "2026-11-02T14:10:00Z",
    trangThai: "PENDING_REVIEW",
    ghiChuNcs:
      "Em đã hoàn thành thực nghiệm bộ dữ liệu bệnh án tiếng Việt vòng 1 và nộp báo cáo Chuyên đề 02 để GVHD xem trước.",
    nhanXetGvhd:
      "Số liệu F1-score trên tập kiểm thử nội viện đã ổn định; GVHD đã ký xác nhận chuyển Giáo vụ kiểm tra hồ sơ.",
    fileName: "Chuyen_de_tien_si_2_NguyenVanA_v1.pdf",
    fileSize: 4720000,
    fileUrl: "mock://Chuyen_de_tien_si_2_NguyenVanA_v1.pdf",
  },
  {
    id: "pr-gv-003",
    studentId: "ncs-02",
    mshv: "NCS2023004",
    hoTenNcs: "Trần Thị Bích Ngọc",
    khoaDaoTao: "Khóa 31 (2023 - 2027)",
    tenDeTai:
      "Ứng dụng kiến trúc liên thông dữ liệu và đồ thị tri thức trong chuyển đổi số quản trị nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 5,
    tenMoc: "Mốc 5: Bảo vệ đề cương chi tiết luận án",
    lanNop: 1,
    ngayNop: "2026-10-28T11:20:00Z",
    trangThai: "PENDING_REVIEW",
    ghiChuNcs:
      "Đã nộp Đề cương chi tiết luận án bản chỉnh sửa theo góp ý của Tập thể GVHD.",
    nhanXetGvhd:
      "Cấu trúc 4 chương và thiết kế thực nghiệm tại An Giang - Cần Thơ phù hợp mục tiêu luận án.",
    fileName: "De_cuong_chi_tiet_TranThiBichNgoc_v1.pdf",
    fileSize: 6840000,
    fileUrl: "mock://De_cuong_chi_tiet_TranThiBichNgoc_v1.pdf",
  },
  {
    id: "pr-gv-004",
    studentId: "ncs-03",
    mshv: "NCS2022002",
    hoTenNcs: "Lê Hoàng Phúc",
    khoaDaoTao: "Khóa 30 (2022 - 2026)",
    tenDeTai:
      "Tối ưu hóa phân cụm dữ liệu đa chiều theo thời gian thực phục vụ cảnh báo xâm nhập mặn thông minh trên nền IoT",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 8,
    tenMoc: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus)",
    lanNop: 1,
    ngayNop: "2026-10-25T16:45:00Z",
    trangThai: "PENDING_REVIEW",
    ghiChuNcs:
      "Đính kèm thư chấp nhận đăng (Acceptance Letter) và bản thảo camera-ready tạp chí SCIE Q2.",
    nhanXetGvhd:
      "Bài báo đáp ứng đầy đủ điều kiện công bố quốc tế theo Quy chế đào tạo tiến sĩ.",
    fileName: "Bai_bao_SCIE_Q2_LeHoangPhuc.pdf",
    fileSize: 3150000,
    fileUrl: "mock://Bai_bao_SCIE_Q2_LeHoangPhuc.pdf",
  },
  {
    id: "pr-gv-005",
    studentId: "ncs-02",
    mshv: "NCS2023004",
    hoTenNcs: "Trần Thị Bích Ngọc",
    khoaDaoTao: "Khóa 31 (2023 - 2027)",
    tenDeTai:
      "Ứng dụng kiến trúc liên thông dữ liệu và đồ thị tri thức trong chuyển đổi số quản trị nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 4,
    tenMoc: "Mốc 4: Báo cáo chuyên đề tiến sĩ 02",
    lanNop: 1,
    ngayNop: "2024-08-05T10:00:00Z",
    ngayDuyet: "2024-08-19T14:00:00Z",
    nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
    diemTrungBinh: "8.7",
    trangThai: "PASSED",
    nhanXetGvhd:
      "Báo cáo chuyên đề 2 hoàn thành đúng tiến độ, phần mô hình ontology nông nghiệp đạt 8.7/10.",
    fileName: "Chuyen_de_2_TranThiBichNgoc.pdf",
    fileSize: 4120000,
    fileUrl: "mock://Chuyen_de_2_TranThiBichNgoc.pdf",
  },
  {
    id: "pr-gv-006",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 2,
    tenMoc: "Mốc 2: Hoàn thành tiểu luận tổng quan",
    lanNop: 1,
    ngayNop: "2024-05-10T14:20:00Z",
    ngayDuyet: "2024-05-20T10:30:00Z",
    nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
    diemTrungBinh: "8.2",
    trangThai: "PASSED",
    nhanXetGvhd: "Tổng quan tài liệu cập nhật tốt, phương pháp phân tích rõ ràng.",
    fileName: "Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
    fileSize: 3450000,
    fileUrl: "mock://Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
  },
  {
    id: "pr-gv-007",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    vaiTro: "HUONG_DAN_CHINH",
    mocSo: 3,
    tenMoc: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01",
    lanNop: 1,
    ngayNop: "2024-10-12T09:15:00Z",
    ngayDuyet: "2024-10-18T16:00:00Z",
    nguoiDuyet: "TS. Lê Hoàng (Giáo vụ Khoa)",
    trangThai: "REJECTED",
    lyDoTuChoi:
      "Bản báo cáo chuyên đề 1 thiếu chữ ký xác nhận của Người hướng dẫn và chưa bổ sung bảng tổng hợp ý kiến góp ý của tiểu ban chấm điểm.",
    nhanXetGvhd: "GVHD đã nhắc NCS bổ sung chữ ký trang bìa và bảng giải trình tiểu ban để nộp lại.",
    fileName: "Chuyen_de_tien_si_1_NguyenVanA_draft.pdf",
    fileSize: 5210000,
    fileUrl: "mock://Chuyen_de_tien_si_1_NguyenVanA_draft.pdf",
  },
];

/**
 * Dữ liệu mẫu Đơn xin gia hạn của NCS gửi qua GVHD thẩm định (`/supervisor/extensions`)
 */
export const mockSupervisorExtensionRequests: SupervisorExtensionRequestItem[] = [
  {
    id: "ext-gv-001",
    maDon: "DN-2026-004",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    trangThai: "CHO_GVHD_XAC_NHAN",
    ngayGui: "2026-10-25T08:30:00Z",
    soThangGiaHan: 6,
    hanHienTai: "2028-07-15T08:00:00Z",
    hanMoiDuKien: "2029-01-15T08:00:00Z",
    tongThangDaGiaHanTruocDo: 6,
    mocHienTai: 3,
    tenMocHienTai: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01",
    tienDoPhanTram: 22,
    lyDo:
      "Cần bổ sung thêm 06 tháng để thu thập dữ liệu bệnh án ngoại trú giai đoạn 2 tại Bệnh viện Đa khoa Trung tâm An Giang và hoàn thiện bản thảo bài báo ISI/Q1 theo góp ý phản biện vòng 1.",
    tepDinhKem: {
      fileName: "BaoCaoTienDo_GiaHan_NCS2024001.pdf",
      fileUrl: "mock://BaoCaoTienDo_GiaHan_NCS2024001.pdf",
      fileSize: 2450120,
    },
    xacNhanGvhds: [
      {
        id: "op-ext-01",
        giangVienId: "gvhd-001",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: null,
        nhanXet: null,
        thoiGianPhanHoi: null,
      },
      {
        id: "op-ext-02",
        giangVienId: "gv-02",
        tenGvhd: "Vũ Đức Đam",
        hocHamHocVi: "TS.",
        vaiTro: "DONG_HUONG_DAN",
        dongY: true,
        nhanXet:
          "Đồng ý cho NCS gia hạn 06 tháng để hoàn tất thu thập dữ liệu lâm sàng và chỉnh sửa Mốc 3.",
        thoiGianPhanHoi: "2026-10-28T09:15:00Z",
      },
    ],
    yKienCuaToi: null,
    nhanXetGvhd: null,
    thoiGianPhanHoiCuaToi: null,
    quyetDinh: null,
    lyDoTuChoi: null,
  },
  {
    id: "ext-gv-002",
    maDon: "DN-2026-007",
    studentId: "ncs-02",
    mshv: "NCS2023004",
    hoTenNcs: "Trần Thị Bích Ngọc",
    khoaDaoTao: "Khóa 31 (2023 - 2027)",
    tenDeTai:
      "Ứng dụng kiến trúc liên thông dữ liệu và đồ thị tri thức trong chuyển đổi số quản trị nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    trangThai: "CHO_GVHD_XAC_NHAN",
    ngayGui: "2026-11-01T10:15:00Z",
    soThangGiaHan: 12,
    hanHienTai: "2027-03-10T08:00:00Z",
    hanMoiDuKien: "2028-03-10T08:00:00Z",
    tongThangDaGiaHanTruocDo: 0,
    mocHienTai: 5,
    tenMocHienTai: "Mốc 5: Bảo vệ đề cương chi tiết luận án",
    tienDoPhanTram: 44,
    lyDo:
      "Quá trình tích hợp dữ liệu quan trắc đất đai tại 3 tỉnh Đồng bằng sông Cửu Long phát sinh thay đổi chuẩn API địa phương, cần gia hạn 12 tháng để hoàn tất khảo sát thực địa và bảo vệ các chuyên đề tiếp theo.",
    tepDinhKem: {
      fileName: "BaoCaoTienDo_GiaHan_TranThiBichNgoc.pdf",
      fileUrl: "mock://BaoCaoTienDo_GiaHan_TranThiBichNgoc.pdf",
      fileSize: 2890000,
    },
    xacNhanGvhds: [
      {
        id: "op-ext-03",
        giangVienId: "gvhd-001",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: null,
        nhanXet: null,
        thoiGianPhanHoi: null,
      },
    ],
    yKienCuaToi: null,
    nhanXetGvhd: null,
    thoiGianPhanHoiCuaToi: null,
    quyetDinh: null,
    lyDoTuChoi: null,
  },
  {
    id: "ext-gv-003",
    maDon: "DN-2026-002",
    studentId: "ncs-03",
    mshv: "NCS2022002",
    hoTenNcs: "Lê Hoàng Phúc",
    khoaDaoTao: "Khóa 30 (2022 - 2026)",
    tenDeTai:
      "Tối ưu hóa phân cụm dữ liệu đa chiều theo thời gian thực phục vụ cảnh báo xâm nhập mặn thông minh trên nền IoT",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    trangThai: "CHO_DUYET",
    ngayGui: "2026-10-12T08:00:00Z",
    soThangGiaHan: 6,
    hanHienTai: "2026-12-18T08:00:00Z",
    hanMoiDuKien: "2027-06-18T08:00:00Z",
    tongThangDaGiaHanTruocDo: 6,
    mocHienTai: 8,
    tenMocHienTai: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus)",
    tienDoPhanTram: 78,
    lyDo:
      "Đã hoàn thành Mốc 8, xin gia hạn 06 tháng để thực hiện phản biện độc lập và bảo vệ luận án tiến sĩ cấp Trường.",
    tepDinhKem: {
      fileName: "BaoCaoTienDo_GiaHan_LeHoangPhuc.pdf",
      fileUrl: "mock://BaoCaoTienDo_GiaHan_LeHoangPhuc.pdf",
      fileSize: 3120000,
    },
    xacNhanGvhds: [
      {
        id: "op-ext-04",
        giangVienId: "gvhd-001",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: true,
        nhanXet:
          "NCS đã hoàn thành bản thảo toàn văn luận án và đủ bài báo công bố. Đề nghị Phòng ĐT-SĐH chấp thuận gia hạn 06 tháng.",
        thoiGianPhanHoi: "2026-10-15T14:20:00Z",
      },
      {
        id: "op-ext-05",
        giangVienId: "gv-08",
        tenGvhd: "Nguyễn Minh Triết",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "DONG_HUONG_DAN",
        dongY: true,
        nhanXet: "Nhất trí kế hoạch bảo vệ cấp cơ sở và cấp Trường.",
        thoiGianPhanHoi: "2026-10-16T09:10:00Z",
      },
    ],
    yKienCuaToi: {
      id: "op-ext-04",
      giangVienId: "gvhd-001",
      tenGvhd: "Trần Quốc Tuấn",
      hocHamHocVi: "PGS.TS.",
      vaiTro: "HUONG_DAN_CHINH",
      dongY: true,
      nhanXet:
        "NCS đã hoàn thành bản thảo toàn văn luận án và đủ bài báo công bố. Đề nghị Phòng ĐT-SĐH chấp thuận gia hạn 06 tháng.",
      thoiGianPhanHoi: "2026-10-15T14:20:00Z",
    },
    nhanXetGvhd:
      "NCS đã hoàn thành bản thảo toàn văn luận án và đủ bài báo công bố. Đề nghị Phòng ĐT-SĐH chấp thuận gia hạn 06 tháng.",
    thoiGianPhanHoiCuaToi: "2026-10-15T14:20:00Z",
    quyetDinh: null,
    lyDoTuChoi: null,
  },
  {
    id: "ext-gv-004",
    maDon: "DN-2026-001",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    tenDeTai:
      "Nghiên cứu các mô hình học sâu tối ưu hóa xử lý ngôn ngữ tự nhiên tiếng Việt trong phân tích ngữ nghĩa văn bản y khoa",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    trangThai: "DA_DUYET",
    ngayGui: "2026-03-02T09:00:00Z",
    soThangGiaHan: 6,
    hanHienTai: "2028-01-15T08:00:00Z",
    hanMoiDuKien: "2028-07-15T08:00:00Z",
    tongThangDaGiaHanTruocDo: 0,
    mocHienTai: 2,
    tenMocHienTai: "Mốc 2: Hoàn thành tiểu luận tổng quan",
    tienDoPhanTram: 22,
    lyDo:
      "Gia hạn đợt 1 (06 tháng) để mở rộng tập dữ liệu thực nghiệm tiếng Việt đa chuyên khoa.",
    tepDinhKem: {
      fileName: "BaoCaoTienDo_Dot1_NguyenVanA.pdf",
      fileUrl: "mock://BaoCaoTienDo_Dot1_NguyenVanA.pdf",
      fileSize: 1950000,
    },
    xacNhanGvhds: [
      {
        id: "op-ext-06",
        giangVienId: "gvhd-001",
        tenGvhd: "Trần Quốc Tuấn",
        hocHamHocVi: "PGS.TS.",
        vaiTro: "HUONG_DAN_CHINH",
        dongY: true,
        nhanXet: "Nhất trí kế hoạch triển khai nghiên cứu trong 06 tháng gia hạn.",
        thoiGianPhanHoi: "2026-03-05T10:20:00Z",
      },
    ],
    yKienCuaToi: {
      id: "op-ext-06",
      giangVienId: "gvhd-001",
      tenGvhd: "Trần Quốc Tuấn",
      hocHamHocVi: "PGS.TS.",
      vaiTro: "HUONG_DAN_CHINH",
      dongY: true,
      nhanXet: "Nhất trí kế hoạch triển khai nghiên cứu trong 06 tháng gia hạn.",
      thoiGianPhanHoi: "2026-03-05T10:20:00Z",
    },
    nhanXetGvhd: "Nhất trí kế hoạch triển khai nghiên cứu trong 06 tháng gia hạn.",
    thoiGianPhanHoiCuaToi: "2026-03-05T10:20:00Z",
    quyetDinh: {
      soQuyetDinh: "QĐ-115/ĐHAG-SĐH",
      ngayKy: "2026-03-20T08:00:00Z",
      coQuanBanHanh: "Trường Đại học An Giang - ĐHQG TP.HCM",
      fileName: "QD_115_GiaHan_NguyenVanA.pdf",
      fileUrl: "mock://QD_115_GiaHan_NguyenVanA.pdf",
    },
    lyDoTuChoi: null,
  },
];

/**
 * Dữ liệu mẫu Đơn đề xuất thay đổi (Đổi đề tài / Đổi GVHD) do GVHD nộp thay NCS (`/supervisor/requests`)
 */
export const mockSupervisorProxyRequests: SupervisorProxyRequestItem[] = [
  {
    id: "prx-gv-001",
    maDon: "DX-GV-2026-003",
    loaiDon: "DOI_DE_TAI",
    trangThai: "CHO_DUYET",
    studentId: "ncs-02",
    mshv: "NCS2023004",
    hoTenNcs: "Trần Thị Bích Ngọc",
    khoaDaoTao: "Khóa 31 (2023 - 2027)",
    nguoiDeXuat: "PGS.TS. Trần Quốc Tuấn",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    ngayGui: "2026-10-30T15:00:00Z",
    ngayCapNhat: "2026-10-30T15:00:00Z",
    tenDeTaiCu:
      "Ứng dụng kiến trúc liên thông dữ liệu và đồ thị tri thức trong chuyển đổi số quản trị nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    tenDeTaiMoi:
      "Nghiên cứu kiến trúc đồ thị tri thức liên thông đa nguồn phục vụ dự báo chuỗi cung ứng nông nghiệp thông minh vùng Đồng bằng sông Cửu Long",
    lyDo:
      "Hội đồng góp ý chuyên đề 2 đề nghị thu hẹp phạm vi tên đề tài, nhấn mạnh đóng góp về mô hình dự báo chuỗi cung ứng nông sản vùng ĐBSCL.",
    batKhaKhang: false,
    tepDinhKem: {
      fileName: "ToTrinh_GVHD_DieuChinhDeTai_NCS2023004.pdf",
      fileUrl: "mock://ToTrinh_GVHD_DieuChinhDeTai_NCS2023004.pdf",
      fileSize: 1620000,
    },
    quyetDinh: null,
    lyDoTuChoi: null,
  },
  {
    id: "prx-gv-002",
    maDon: "DX-GV-2026-001",
    loaiDon: "DOI_GVHD",
    trangThai: "DA_DUYET",
    studentId: "ncs-04",
    mshv: "NCS2024008",
    hoTenNcs: "Phạm Minh Đức",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    nguoiDeXuat: "PGS.TS. Trần Quốc Tuấn",
    vaiTroCuaToi: "DONG_HUONG_DAN",
    ngayGui: "2026-06-14T09:20:00Z",
    ngayCapNhat: "2026-07-02T10:00:00Z",
    vaiTroGvhdCanThay: "HUONG_DAN_CHINH",
    tenGvhdCu: "PGS.TS. Huỳnh Văn Thành",
    gvhdMoiId: "gv-04",
    tenGvhdMoi: "TS. Nguyễn Minh Trí",
    donViGvhdMoi: "Khoa Công nghệ thông tin - Trường Đại học An Giang",
    lyDo:
      "PGS.TS. Huỳnh Văn Thành nghỉ hưu theo chế độ; Tập thể GVHD đề xuất chuyển giao vai trò hướng dẫn chính cho TS. Nguyễn Minh Trí cùng nhóm nghiên cứu kiểm chứng hình thức.",
    batKhaKhang: true,
    tepDinhKem: {
      fileName: "DeXuat_DieuChinh_GVHD_NCS2024008.pdf",
      fileUrl: "mock://DeXuat_DieuChinh_GVHD_NCS2024008.pdf",
      fileSize: 1940000,
    },
    quyetDinh: {
      soQuyetDinh: "QĐ-204/ĐHAG-SĐH",
      ngayKy: "2026-07-02T08:00:00Z",
      coQuanBanHanh: "Trường Đại học An Giang - ĐHQG TP.HCM",
      fileName: "QD_204_PhanCongLaiGVHD_NCS2024008.pdf",
      fileUrl: "mock://QD_204_PhanCongLaiGVHD_NCS2024008.pdf",
    },
    lyDoTuChoi: null,
  },
  {
    id: "prx-gv-003",
    maDon: "DX-GV-2025-008",
    loaiDon: "DOI_DE_TAI",
    trangThai: "DA_DUYET",
    studentId: "ncs-03",
    mshv: "NCS2022002",
    hoTenNcs: "Lê Hoàng Phúc",
    khoaDaoTao: "Khóa 30 (2022 - 2026)",
    nguoiDeXuat: "PGS.TS. Trần Quốc Tuấn",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    ngayGui: "2025-08-18T11:00:00Z",
    ngayCapNhat: "2025-09-05T14:00:00Z",
    tenDeTaiCu:
      "Thuật toán phân cụm dữ liệu cảm biến cho hệ thống giám sát môi trường nước",
    tenDeTaiMoi:
      "Tối ưu hóa phân cụm dữ liệu đa chiều theo thời gian thực phục vụ cảnh báo xâm nhập mặn thông minh trên nền IoT",
    lyDo:
      "Cập nhật tên đề tài chuẩn hóa theo kết quả bảo vệ Đề cương chi tiết và định hướng công bố SCIE Q2.",
    batKhaKhang: false,
    tepDinhKem: {
      fileName: "BienBan_Khoa_DieuChinhDeTai_NCS2022002.pdf",
      fileUrl: "mock://BienBan_Khoa_DieuChinhDeTai_NCS2022002.pdf",
      fileSize: 2110000,
    },
    quyetDinh: {
      soQuyetDinh: "QĐ-179/ĐHAG-SĐH",
      ngayKy: "2025-09-05T08:00:00Z",
      coQuanBanHanh: "Trường Đại học An Giang - ĐHQG TP.HCM",
      fileName: "QD_179_DoiDeTai_NCS2022002.pdf",
      fileUrl: "mock://QD_179_DoiDeTai_NCS2022002.pdf",
    },
    lyDoTuChoi: null,
  },
  {
    id: "prx-gv-004",
    maDon: "DX-GV-2025-002",
    loaiDon: "DOI_GVHD",
    trangThai: "TU_CHOI",
    studentId: "ncs-01",
    mshv: "NCS2024001",
    hoTenNcs: "Nguyễn Văn A",
    khoaDaoTao: "Khóa 32 (2024 - 2028)",
    nguoiDeXuat: "PGS.TS. Trần Quốc Tuấn",
    vaiTroCuaToi: "HUONG_DAN_CHINH",
    ngayGui: "2025-04-09T08:45:00Z",
    ngayCapNhat: "2025-04-16T16:30:00Z",
    vaiTroGvhdCanThay: "DONG_HUONG_DAN",
    tenGvhdCu: "TS. Vũ Đức Đam",
    gvhdMoiId: "gv-05",
    tenGvhdMoi: "PGS.TS. Phạm Văn Hùng",
    donViGvhdMoi: "Khoa Khoa học máy tính - ĐH Cần Thơ",
    lyDo:
      "Đề xuất điều chỉnh GVHD đồng hướng dẫn sang chuyên gia thị giác máy tính y khoa.",
    batKhaKhang: false,
    tepDinhKem: {
      fileName: "ToTrinh_DoiGVHD_NCS2024001.pdf",
      fileUrl: "mock://ToTrinh_DoiGVHD_NCS2024001.pdf",
      fileSize: 1380000,
    },
    quyetDinh: null,
    lyDoTuChoi:
      "Ứng viên đề xuất tại thời điểm xét duyệt đang chạm trần 5.0 điểm định mức BR-09. Đề nghị giữ nguyên phân công đồng hướng dẫn hiện tại.",
  },
];
