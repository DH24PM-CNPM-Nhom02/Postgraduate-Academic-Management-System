"use client";

import {
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const MILESTONE_PHASES = [
  {
    phase: "Giai đoạn 1",
    title: "Chuẩn bị & Bảo vệ Đề cương chi tiết",
    timeline: "Tháng 01 – 18",
    color: "blue",
    borderClass: "border-blue-200",
    bgClass: "bg-blue-50/40",
    textClass: "text-[#164E9B]",
    milestones: [
      {
        step: "Mốc 01",
        name: "Công nhận trúng tuyển & Giao đề tài",
        desc: "Quyết định công nhận nghiên cứu sinh và phân công cán bộ hướng dẫn chính/đồng hướng dẫn theo BR-09.",
      },
      {
        step: "Mốc 02",
        name: "Hoàn thành các học phần bổ sung & SĐH",
        desc: "Tích lũy khối lượng học phần tiến sĩ (tối thiểu 8 - 16 tín chỉ tùy đối tượng đầu vào thạc sĩ hay cử nhân).",
      },
      {
        step: "Mốc 03",
        name: "Báo cáo Tiểu luận tổng quan",
        desc: "Tổng quan các công trình nghiên cứu trong và ngoài nước liên quan trực tiếp đến đề tài luận án.",
      },
      {
        step: "Mốc 04",
        name: "Hoàn thành 02 Chuyên đề Tiến sĩ",
        desc: "Nghiên cứu chuyên sâu phương pháp luận và các nội dung cốt lõi của đề tài, bảo vệ trước Bộ môn.",
      },
      {
        step: "Mốc 05",
        name: "Bảo vệ Đề cương chi tiết luận án",
        desc: "Hội đồng đánh giá đề cương cấp Đơn vị chuyên môn thông qua trước tháng thứ 24 của khóa đào tạo.",
      },
    ],
  },
  {
    phase: "Giai đoạn 2",
    title: "Thực nghiệm & Công bố Khoa học",
    timeline: "Tháng 18 – 36",
    color: "amber",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50/40",
    textClass: "text-amber-800",
    milestones: [
      {
        step: "Mốc 06",
        name: "Báo cáo tiến độ định kỳ 6 tháng",
        desc: "NCS nộp báo cáo kết quả thực nghiệm và kế hoạch tiếp theo vào ngày 15/06 và 15/12 hàng năm.",
      },
      {
        step: "Mốc 07",
        name: "Hoàn thiện bản thảo toàn văn luận án",
        desc: "Viết toàn văn luận án, thông qua tập thể cán bộ hướng dẫn và nộp Bộ môn thẩm tra tính liêm chính học thuật.",
      },
      {
        step: "Mốc 08",
        name: "Thẩm định điểm bài báo WoS/Scopus",
        desc: "Chuẩn đầu ra bắt buộc: Đạt tổng điểm quy đổi ≥ 2.0 từ các bài báo quốc tế WoS/Scopus ghi tên AGU - VNU-HCM.",
      },
    ],
  },
  {
    phase: "Giai đoạn 3",
    title: "Đánh giá Luận án & Nhận Học vị",
    timeline: "Tháng 36 – 48",
    color: "emerald",
    borderClass: "border-emerald-200",
    bgClass: "bg-emerald-50/40",
    textClass: "text-emerald-800",
    milestones: [
      {
        step: "Mốc 09",
        name: "Bảo vệ Luận án 2 cấp & Tốt nghiệp",
        desc: "Đánh giá cấp Đơn vị chuyên môn (cấp Cơ sở) -> Đánh giá cấp Trường -> Nộp lưu chiểu Thư viện -> Nhận bằng Tiến sĩ.",
      },
    ],
  },
];

export function HomeTrainingProcess() {
  return (
    <section id="training-process" className="scroll-mt-20 space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] uppercase tracking-wider mb-1">
            <GraduationCap className="size-4" />
            <span>Tiến trình Đào tạo Sau Đại học</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Khung Quy trình 9 Mốc Đào tạo Tiến sĩ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lộ trình học tập và nghiên cứu chuẩn hóa theo Quy chế Đào tạo Tiến sĩ của ĐHQG-HCM và Trường Đại học An Giang
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
          <ShieldCheck className="size-4 text-[#164E9B]" />
          <span>Thời gian chuẩn: 3 - 4 năm</span>
        </div>
      </div>

      {/* 3 Phases Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {MILESTONE_PHASES.map((phaseGroup, pIdx) => (
          <div
            key={pIdx}
            className={`rounded-2xl border ${phaseGroup.borderClass} ${phaseGroup.bgClass} p-5 shadow-2xs flex flex-col justify-between`}
          >
            <div className="space-y-4">
              {/* Phase Header */}
              <div className="border-b border-slate-200/60 pb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${phaseGroup.textClass}`}>
                    {phaseGroup.phase}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-2xs">
                    {phaseGroup.timeline}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-slate-900">
                  {phaseGroup.title}
                </h3>
              </div>

              {/* Milestones in this phase */}
              <div className="space-y-3">
                {phaseGroup.milestones.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-xl border border-white/80 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#164E9B]">
                        {m.step}
                      </span>
                      <CheckCircle2 className="size-3.5 text-slate-300" />
                    </div>
                    <h4 className="mt-0.5 text-xs font-bold text-slate-900 leading-snug">
                      {m.name}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase footnote */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Đạt điều kiện tiên quyết</span>
              <span className="font-semibold text-slate-700">Quy chuẩn AGU</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
