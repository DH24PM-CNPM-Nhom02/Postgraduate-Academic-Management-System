import React from "react";
import type { Metadata } from "next";
import {
  GraduationCap,
  User,
  Clock,
  Layers,
  Building2,
} from "lucide-react";

import {
  StudentProgressData,
  MilestoneProgressItem,
} from "@/src/types/progress";
import { MilestoneTimeline } from "@/src/components/student/progress/milestone-timeline";
import { MilestoneCard } from "@/src/components/student/progress/milestone-card";

export const metadata: Metadata = {
  title: "Theo dõi tiến trình 9 mốc | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi và quản lý hồ sơ tiến trình 9 mốc đào tạo tiến sĩ của Nghiên cứu sinh.",
};

/**
 * Mock Data chuẩn sát thực tế cấu trúc response GET /progress/me
 */
const mockProgressData: StudentProgressData = {
  ncs: {
    id: "ncs-01",
    mshv: "NCS2024001",
    hoTen: "Nguyễn Văn A",
    lop: "K32-CNTT",
    nganh: "Công nghệ thông tin",
    chuyenNganh: "Khoa học máy tính & Trí tuệ nhân tạo",
    khoaVi: "Khoa Công nghệ thông tin",
    gvhd: "PGS.TS. Trần Quốc Tuấn",
    gvhdDongHuongDan: "TS. Vũ Đức Đam",
    ngayNhapHoc: "2024-01-15T08:00:00Z",
    thoiHanToiDa: "2030-01-15T08:00:00Z",
    soThangConLai: 58,
  },
  tongSoMoc: 9,
  soMocHoanThanh: 2,
  mocHienTai: 3,
  milestones: [
    {
      id: "moc-01",
      thuTu: 1,
      tenMoc: "Mốc 1: Nhận quyết định công nhận NCS & Đề tài",
      thoiGianDuKien: "Tháng 0-3",
      yeuCauDiem: false,
      trangThai: "PASSED",
      coTheNop: false,
      ngayHoanThanh: "2024-01-15T08:00:00Z",
      ghiChuHeThong: "Đã hoàn thành khi nhập học",
      moTa: "Hoàn tất thủ tục hồ sơ nhập học, nhận Quyết định công nhận nghiên cứu sinh và phê duyệt tên đề tài luận án chính thức.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-02",
      thuTu: 2,
      tenMoc: "Mốc 2: Hoàn thành tiểu luận tổng quan",
      thoiGianDuKien: "Tháng 3-9",
      yeuCauDiem: true,
      diemTrungBinh: "8.2",
      trangThai: "PASSED",
      coTheNop: false,
      ngayHoanThanh: "2024-05-20T10:30:00Z",
      moTa: "Báo cáo và bảo vệ bài tiểu luận tổng quan tình hình nghiên cứu liên quan trước Hội đồng chuyên môn.",
      minhChungHienTai: {
        id: "ev-0201",
        lanNop: 1,
        fileId: "file-tl-0201",
        fileName: "Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
        fileSize: 3450000,
        trangThai: "PASSED",
        ngayNop: "2024-05-10T14:20:00Z",
        ngayDuyet: "2024-05-20T10:30:00Z",
        nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
        diemTrungBinh: "8.2",
        ghiChuNcs:
          "Kính gửi Giáo vụ bản tiểu luận tổng quan đã có đầy đủ nhận xét và chữ ký của GVHD.",
      },
      lichSuMinhChung: [
        {
          id: "ev-0201",
          lanNop: 1,
          fileId: "file-tl-0201",
          fileName: "Bao_cao_tieu_luan_tong_quan_NguyenVanA.pdf",
          fileSize: 3450000,
          trangThai: "PASSED",
          ngayNop: "2024-05-10T14:20:00Z",
          ngayDuyet: "2024-05-20T10:30:00Z",
          nguoiDuyet: "ThS. Trần Thị Mai (Giáo vụ SĐH)",
          diemTrungBinh: "8.2",
          ghiChuNcs:
            "Kính gửi Giáo vụ bản tiểu luận tổng quan đã có đầy đủ nhận xét và chữ ký của GVHD.",
        },
      ],
    },
    {
      id: "moc-03",
      thuTu: 3,
      tenMoc: "Mốc 3: Báo cáo chuyên đề tiến sĩ 01",
      thoiGianDuKien: "Tháng 9-15",
      yeuCauDiem: true,
      trangThai: "REJECTED",
      coTheNop: true,
      lyDoTuChoi: "Bản báo cáo thiếu chữ ký xác nhận của Người hướng dẫn",
      moTa: "Nghiên cứu sinh thực hiện và nộp báo cáo chuyên đề tiến sĩ số 1 theo kế hoạch học tập đã được duyệt.",
      minhChungHienTai: {
        id: "ev-0301",
        lanNop: 1,
        fileId: "file-cd1-0301",
        fileName: "Chuyen_de_tien_si_1_draft.pdf",
        fileSize: 5210000,
        trangThai: "REJECTED",
        ngayNop: "2024-10-12T09:15:00Z",
        ngayDuyet: "2024-10-18T16:00:00Z",
        nguoiDuyet: "TS. Lê Hoàng (Giáo vụ Khoa)",
        lyDoTuChoi: "Bản báo cáo thiếu chữ ký xác nhận của Người hướng dẫn",
        ghiChuNcs: "NCS nộp báo cáo chuyên đề 1 để xin thẩm định.",
      },
      lichSuMinhChung: [
        {
          id: "ev-0301",
          lanNop: 1,
          fileId: "file-cd1-0301",
          fileName: "Chuyen_de_tien_si_1_draft.pdf",
          fileSize: 5210000,
          trangThai: "REJECTED",
          ngayNop: "2024-10-12T09:15:00Z",
          ngayDuyet: "2024-10-18T16:00:00Z",
          nguoiDuyet: "TS. Lê Hoàng (Giáo vụ Khoa)",
          lyDoTuChoi: "Bản báo cáo thiếu chữ ký xác nhận của Người hướng dẫn",
          ghiChuNcs: "NCS nộp báo cáo chuyên đề 1 để xin thẩm định.",
        },
      ],
    },
    {
      id: "moc-04",
      thuTu: 4,
      tenMoc: "Mốc 4: Báo cáo chuyên đề tiến sĩ 02",
      thoiGianDuKien: "Tháng 15-21",
      yeuCauDiem: true,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Hoàn thành và bảo vệ chuyên đề tiến sĩ số 2 có bảng điểm đánh giá của các thành viên tiểu ban chấm điểm.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-05",
      thuTu: 5,
      tenMoc: "Mốc 5: Bảo vệ đề cương chi tiết luận án",
      thoiGianDuKien: "Tháng 18-24",
      yeuCauDiem: true,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Bảo vệ đề cương chi tiết luận án trước Hội đồng chấm đề cương cấp Đơn vị chuyên môn.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-06",
      thuTu: 6,
      tenMoc: "Mốc 6: Báo cáo chuyên đề tiến sĩ 03",
      thoiGianDuKien: "Tháng 24-30",
      yeuCauDiem: true,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Báo cáo chuyên đề tiến sĩ số 3 làm rõ các luận điểm và phương pháp nghiên cứu cốt lõi của đề tài.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-07",
      thuTu: 7,
      tenMoc: "Mốc 7: Báo cáo tiến độ 6 tháng tại Bộ môn",
      thoiGianDuKien: "Định kỳ tháng 6/12",
      yeuCauDiem: false,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Báo cáo định kỳ kết quả nghiên cứu và tiến độ thực hiện đề tài tại Bộ môn chuyên môn.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-08",
      thuTu: 8,
      tenMoc: "Mốc 8: Thẩm định bài báo khoa học (WoS/Scopus ≥ 2.0đ)",
      thoiGianDuKien: "Tháng 30-36",
      yeuCauDiem: false,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Thẩm định điểm công trình khoa học đã công bố. Yêu cầu nộp duy nhất 01 tệp PDF gộp toàn bộ các bài báo.",
      lichSuMinhChung: [],
    },
    {
      id: "moc-09",
      thuTu: 9,
      tenMoc: "Mốc 9: Đăng ký bảo vệ luận án Cấp ĐVCM & Cấp Trường",
      thoiGianDuKien: "Tháng 36-48",
      yeuCauDiem: false,
      trangThai: "LOCKED",
      coTheNop: false,
      moTa: "Nộp hồ sơ bảo vệ luận án cấp Bộ môn, thẩm định phản biện kín và đăng ký bảo vệ cấp Trường.",
      lichSuMinhChung: [],
    },
  ],
};

export default function StudentNestedProgressPage() {
  const data = mockProgressData;
  const { ncs, milestones, soMocHoanThanh, tongSoMoc } = data;
  const progressPercent = Math.round((soMocHoanThanh / tongSoMoc) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header thông tin Nghiên cứu sinh */}
      <section
        aria-label="Thông tin hồ sơ Nghiên cứu sinh"
        className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Thông tin chính */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-emerald-900/10 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {ncs.hoTen}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold tracking-wider">
                  {ncs.mshv}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-semibold">
                  NCS Khóa 32
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                <span>
                  Lớp: <strong className="text-slate-900">{ncs.lop}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Ngành: <strong className="text-slate-900">{ncs.nganh}</strong>
                </span>
                {ncs.chuyenNganh && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>
                      Chuyên ngành:{" "}
                      <strong className="text-slate-900">
                        {ncs.chuyenNganh}
                      </strong>
                    </span>
                  </>
                )}
              </p>

              <div className="pt-2 flex items-center gap-x-5 gap-y-2 flex-wrap text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    GVHD chính:{" "}
                    <strong className="text-slate-700">{ncs.gvhd}</strong>
                  </span>
                </div>
                {ncs.gvhdDongHuongDan && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Đồng HD:{" "}
                      <strong className="text-slate-700">
                        {ncs.gvhdDongHuongDan}
                      </strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ncs.khoaVi}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Thời hạn đào tạo tối đa: Còn {ncs.soThangConLai} tháng (72
                    tháng)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Thanh tóm tắt tiến độ tổng quan */}
          <div className="lg:w-72 rounded-xl bg-slate-50 border border-slate-200/80 p-4 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Tiến độ đào tạo
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Thanh tiến độ trang nhã */}
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>
                Hoàn thành{" "}
                <strong className="text-emerald-700 font-bold">
                  {soMocHoanThanh}/{tongSoMoc} mốc
                </strong>
              </span>
              <span className="text-rose-600 font-medium">
                Mốc 3 đang chờ nộp lại
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Timeline tổng quan 9 mốc (Stepper ngang) */}
      <section aria-label="Lộ trình 9 mốc">
        <MilestoneTimeline
          milestones={milestones}
          activeMilestoneOrder={data.mocHienTai}
        />
      </section>

      {/* 4. Danh sách chi tiết 9 thẻ mốc (MilestoneCard) */}
      <section aria-label="Chi tiết từng mốc đào tạo" className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Chi tiết từng mốc tiến trình</span>
            <span className="text-xs font-normal text-slate-500">
              (Theo Quy chế Đào tạo Tiến sĩ hiện hành - BR-08)
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            9/9 mốc đào tạo
          </span>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {milestones.map((m: MilestoneProgressItem) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
