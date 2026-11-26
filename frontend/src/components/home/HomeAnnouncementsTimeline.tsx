"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  Megaphone,
} from "lucide-react";
import {
  AnnouncementDetailModal,
} from "./AnnouncementDetailModal";
import type { AnnouncementItem } from "./announcementTypes";

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-01",
    title: "Thông báo nộp Báo cáo Tiến độ Nghiên cứu định kỳ 6 tháng (Đợt 2 / 2026)",
    category: "Học vụ",
    date: "20/11/2026",
    summary:
      "Toàn bộ Nghiên cứu sinh các khóa K31, K32, K33 thực hiện nộp báo cáo tiến độ và nhận xét của GVHD trước ngày 15/12/2026.",
    author: "ThS. Nguyễn Văn Trọng",
    department: "Bộ phận Học vụ SĐH - Phòng Đào tạo Sau Đại học",
    content: [
      "Căn cứ Quy chế Đào tạo trình độ Tiến sĩ của Đại học Quốc gia TP. Hồ Chí Minh và Kế hoạch đào tạo năm học 2026 - 2027 của Trường Đại học An Giang, Phòng Đào tạo Sau Đại học thông báo về việc thực hiện Báo cáo tiến độ nghiên cứu định kỳ 6 tháng Đợt 2 năm 2026 như sau:",
      "1. Đối tượng thực hiện: Tất cả Nghiên cứu sinh đang trong thời gian đào tạo chuẩn và thời gian gia hạn (Khóa 2023, 2024, 2025).",
      "2. Quy trình nộp: Nghiên cứu sinh tải Mẫu 06-BCTD, hoàn thiện phần báo cáo kết quả nghiên cứu và kế hoạch 6 tháng tiếp theo; sau đó nộp trực tuyến qua Cổng Nghiên cứu sinh để Giảng viên hướng dẫn nhận xét và ký duyệt điện tử.",
      "3. Thời hạn chót: Hệ thống sẽ đóng cổng tiếp nhận vào lúc 17h00 ngày 15/12/2026. Các trường hợp nộp trễ sẽ bị trừ điểm đánh giá rèn luyện học vụ và thông báo về Khoa chủ quản.",
    ],
    attachments: [
      { name: "ThongBao_BaoCaoTienDo_Dot2_2026.pdf", size: "380 KB", format: "PDF" },
      { name: "Mau_06_BCTD_TienDo_6Thang.docx", size: "168 KB", format: "DOCX" },
    ],
  },
  {
    id: "ann-02",
    title: "Kế hoạch tổ chức Hội đồng đánh giá Luận án Tiến sĩ cấp Trường đợt 4 năm 2026",
    category: "Bảo vệ luận án",
    date: "18/11/2026",
    summary:
      "Tổ chức đánh giá luận án tiến sĩ cho 03 nghiên cứu sinh thuộc ngành Khoa học Máy tính và Bảo vệ Thực vật.",
    author: "PGS.TS. Trần Quốc Hùng",
    department: "Hội đồng Đào tạo & Khoa học Sau Đại học",
    content: [
      "Hiệu trưởng Trường Đại học An Giang đã ký ban hành Quyết định thành lập Hội đồng Đánh giá Luận án Tiến sĩ cấp Trường đợt 4 năm 2026 cho 03 Nghiên cứu sinh đã hoàn thành đầy đủ 9 mốc tiến độ và chuẩn đầu ra công bố quốc tế WoS/Scopus.",
      "Thời gian tổ chức: Bắt đầu từ 08h00 ngày 25/11/2026 tại Phòng Hội đồng B201, Tòa nhà Hiệu bộ.",
      "Buổi bảo vệ được tổ chức công khai. Kính mời các nhà khoa học, giảng viên, học viên cao học và nghiên cứu sinh quan tâm đến tham dự và trao đổi học thuật.",
    ],
    attachments: [
      { name: "KeHoach_BaoVe_LuanAn_CapTruong_Dot4.pdf", size: "450 KB", format: "PDF" },
      { name: "DanhSach_HoiDong_TieuBan_ChuyenMon.pdf", size: "290 KB", format: "PDF" },
    ],
  },
  {
    id: "ann-03",
    title: "Hướng dẫn kê khai và thẩm định điểm bài báo khoa học quốc tế WoS/Scopus",
    category: "Quan trọng",
    date: "15/11/2026",
    summary:
      "Quy định chuẩn hóa quy đổi điểm công bố khoa học (tối thiểu 2.0 điểm) trước khi đăng ký bảo vệ luận án chính thức.",
    author: "Bộ phận Đảm bảo Chất lượng SĐH",
    department: "Phòng Quản lý Khoa học & Đào tạo Sau Đại học",
    content: [
      "Nhằm đảm bảo tính minh bạch và chuẩn mực chất lượng quốc tế của Đại học Quốc gia TP. Hồ Chí Minh, Phòng Đào tạo Sau Đại học ban hành văn bản hướng dẫn chi tiết về việc kê khai bài báo khoa học:",
      "1. Tiêu chí bắt buộc: Tác giả thứ nhất (First Author) hoặc tác giả liên hệ (Corresponding Author) phải có ghi tên đơn vị 'An Giang University - VNU-HCM'.",
      "2. Điểm quy đổi: Bài báo thuộc danh mục WoS Q1 tính 1.5 điểm, Q2 tính 1.25 điểm, Scopus Q3/Q4 tính 0.75 - 1.0 điểm. Tổng điểm tích lũy của NCS trước khi nộp hồ sơ bảo vệ phải đạt tối thiểu ≥ 2.0 điểm.",
      "3. Nghiên cứu sinh nộp hồ sơ thẩm định qua mục 'Minh chứng học vị' trên Cổng Nghiên cứu sinh kèm bản in PDF toàn văn bài báo và trang tra cứu chỉ số ISSN từ trang chủ Scopus/Clarivate.",
    ],
    attachments: [
      { name: "HuongDan_KeKhai_DiemBaiBao_WoS_Scopus.pdf", size: "520 KB", format: "PDF" },
      { name: "Mau_08_BangKeKhai_DiemBaiBao.xlsx", size: "95 KB", format: "XLSX" },
    ],
  },
  {
    id: "ann-04",
    title: "Rà soát tải trọng và hạn ngạch Giảng viên Hướng dẫn theo quy chế BR-09",
    category: "Quy chế",
    date: "10/11/2026",
    summary:
      "Áp dụng quy định hướng dẫn độc lập 1.0 NCS, đồng hướng dẫn 0.5 NCS; trần tối đa không quá 3.0 NCS tại cùng một thời điểm.",
    author: "Phòng Thanh tra & Đào tạo SĐH",
    department: "Trường Đại học An Giang",
    content: [
      "Phòng Đào tạo Sau Đại học phối hợp các Khoa chuyên môn thực hiện rà soát định mức hướng dẫn khoa học học kỳ I năm học 2026 - 2027 theo Quy chế BR-09 của ĐHQG-HCM.",
      "Mỗi giảng viên hướng dẫn không nhận vượt quá 3.0 NCS cùng một thời điểm (đối với Giáo sư/Phó Giáo sư chủ trì đề tài cấp Bộ không quá 4.0 NCS).",
      "Hệ thống phần mềm đã tích hợp bộ khóa tự động (Quota Lock). Các đơn đề nghị phân công hướng dẫn mới nếu vượt trần định mức sẽ không thể ký duyệt trên hệ thống.",
    ],
    attachments: [
      { name: "QuyDinh_BR09_DinhMuc_GVHD_DHQG.pdf", size: "420 KB", format: "PDF" },
    ],
  },
  {
    id: "ann-05",
    title: "Thông báo nộp hồ sơ xin gia hạn thời gian học tập cho NCS Khóa 2023",
    category: "Học vụ",
    date: "02/11/2026",
    summary:
      "NCS khóa 2023 sắp hết thời gian học tập chuẩn 36 tháng cần nộp đơn gia hạn kèm ý kiến xác nhận của GVHD chính.",
    author: "Bộ phận Học vụ SĐH",
    department: "Phòng Đào tạo Sau Đại học",
    content: [
      "Nghiên cứu sinh Khóa 2023 nếu có lý do khách quan chưa hoàn thành luận án đúng thời hạn 36 tháng cần nộp Đơn xin gia hạn thời gian đào tạo (thời gian gia hạn tối đa mỗi đợt không quá 12 tháng, tổng thời gian đào tạo kể cả gia hạn không quá 72 tháng).",
      "Hồ sơ gồm: Đơn xin gia hạn (Mẫu 07-DGH), Báo cáo giải trình tiến độ và cam kết thời gian hoàn thành có xác nhận của GVHD và Trưởng khoa chuyên môn.",
    ],
    attachments: [
      { name: "Mau_07_DonXinGiaHan_TienSi.docx", size: "125 KB", format: "DOCX" },
    ],
  },
  {
    id: "ann-06",
    title: "Lịch bảo vệ Đề cương chi tiết Luận án Tiến sĩ đợt 3 năm 2026 (Mốc 5)",
    category: "Đề cương",
    date: "25/10/2026",
    summary:
      "Tổ chức đánh giá Đề cương chi tiết cho 05 NCS Khóa 2024 tại các Tiểu ban Chuyên môn Khoa Sư phạm và Kinh tế.",
    author: "ThS. Nguyễn Văn Trọng",
    department: "Phòng Đào tạo Sau Đại học",
    content: [
      "Phòng Đào tạo Sau Đại học thông báo lịch họp Hội đồng đánh giá Đề cương chi tiết Luận án Tiến sĩ (Mốc 5) đợt 3 năm 2026.",
      "Yêu cầu: NCS nộp 05 cuốn đề cương chi tiết đã có chữ ký đồng ý của GVHD về Văn phòng Bộ môn trước ngày 05/11/2026 để gửi các phản biện đọc nhận xét.",
    ],
    attachments: [
      { name: "LichHop_BaoVe_DeCuongChiTiet_Dot3.pdf", size: "310 KB", format: "PDF" },
    ],
  },
];

const ACADEMIC_TIMELINE = [
  {
    id: "time-1",
    day: "15",
    month: "Tháng 12",
    year: "2026",
    title: "Hạn nộp Báo cáo Tiến độ 6 tháng (Đợt 2)",
    target: "Toàn bộ NCS Khóa 2023, 2024, 2025",
    statusBadge: "Còn 23 ngày",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "time-2",
    day: "25",
    month: "Tháng 11",
    year: "2026",
    title: "Hội đồng Bảo vệ Luận án cấp Trường Đợt 4",
    target: "03 NCS ngành KHMT & BVTV",
    statusBadge: "Sắp diễn ra",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "time-3",
    day: "05",
    month: "Tháng 12",
    year: "2026",
    title: "Hạn tiếp nhận hồ sơ thẩm định bài báo WoS/Scopus",
    target: "NCS chuẩn bị bảo vệ năm học 2026 - 2027",
    statusBadge: "Đang tiếp nhận",
    badgeColor: "bg-blue-50 text-[#164E9B] border-blue-200",
  },
  {
    id: "time-4",
    day: "30",
    month: "Tháng 12",
    year: "2026",
    title: "Hoàn tất thẩm định điểm bài báo đợt cuối năm",
    target: "Bộ phận QLKH & Đào tạo SĐH",
    statusBadge: "Kế hoạch",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "time-5",
    day: "15",
    month: "Tháng 01",
    year: "2027",
    title: "Hạn đăng ký đề cương chi tiết (Mốc 5) Đợt 1 / 2027",
    target: "NCS trúng tuyển Khóa 2025",
    statusBadge: "Học kỳ tới",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function HomeAnnouncementsTimeline() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const categoryTagClass: Record<string, string> = {
    "Quan trọng": "bg-rose-50 text-rose-700 border-rose-200",
    "Học vụ": "bg-blue-50 text-[#164E9B] border-blue-200",
    "Bảo vệ luận án": "bg-purple-50 text-purple-700 border-purple-200",
    "Quy chế": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Đề cương": "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <section id="announcements" className="scroll-mt-20 space-y-6 pt-4">
      {/* Grid: 7 Cols Left (Announcements) + 5 Cols Right (Academic Timeline) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Announcements List (lg:col-span-7) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
                <Megaphone className="size-4.5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F2744]">
                  Thông báo Đào tạo Sau Đại học
                </h2>
                <p className="text-xs text-slate-500">
                  Cập nhật các mốc học vụ, kế hoạch đánh giá và thông tri mới nhất
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
              {ANNOUNCEMENTS.length} thông báo mới
            </span>
          </div>

          <div className="space-y-3">
            {ANNOUNCEMENTS.map((ann) => {
              const [day, month, year] = ann.date.split("/");
              return (
                <article
                  key={ann.id}
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="group relative flex cursor-pointer items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-[#164E9B] hover:shadow-xs sm:p-4"
                >
                  {/* Calendar Date Badge */}
                  <div className="flex size-12 sm:size-13 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-center transition-colors group-hover:bg-[#164E9B] group-hover:text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-100">
                      T{month}
                    </span>
                    <span className="text-base sm:text-lg font-black leading-none text-[#164E9B] group-hover:text-white">
                      {day}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                          categoryTagClass[ann.category] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {ann.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Năm {year}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#164E9B] transition-colors">
                      {ann.title}
                    </h3>

                    <p className="line-clamp-1 text-xs text-slate-500">
                      {ann.summary}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight className="size-4 shrink-0 text-slate-300 group-hover:translate-x-0.5 group-hover:text-[#164E9B] transition-all self-center" />
                </article>
              );
            })}
          </div>
        </div>

        {/* Right: Academic Timeline (lg:col-span-5) */}
        <div id="timeline" className="scroll-mt-20 space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <CalendarDays className="size-4.5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F2744]">
                  Lịch học vụ &amp; Mốc thời gian
                </h2>
                <p className="text-xs text-slate-500">
                  Hạn chót học vụ và lịch làm việc của các Hội đồng chuyên môn
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ACADEMIC_TIMELINE.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[19px] top-1.5 flex size-2.5 rounded-full border-2 border-white bg-[#164E9B] shadow-2xs group-hover:scale-125 transition-transform" />

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#164E9B]">
                        {event.day} {event.month}, {event.year}
                      </span>
                      <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${event.badgeColor}`}>
                        {event.statusBadge}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-bold text-slate-900 leading-snug">
                      {event.title}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Áp dụng: {event.target}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Note */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-600 flex items-start gap-2">
              <Clock className="size-4 text-[#164E9B] shrink-0 mt-0.5" />
              <span>
                Các mốc thời gian học vụ được tính theo ngày làm việc chính thức của Trường Đại học An Giang. Nếu trùng ngày nghỉ lễ, hạn chót tự động dời sang ngày làm việc kế tiếp.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Announcement Detail */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        isOpen={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </section>
  );
}
