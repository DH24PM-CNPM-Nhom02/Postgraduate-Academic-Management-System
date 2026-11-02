"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Download,
  CheckCircle2,
  Search,
  Shield,
} from "lucide-react";

export interface RegulationsViewProps {
  roleContext?: "academic" | "supervisor" | "student" | "public";
  backHref?: string;
  backLabel?: string;
}

export const REGULATIONS_LIST = [
  {
    id: "reg-01",
    code: "BR-09 ĐHQG-HCM",
    title: "Quy chế Định mức Hướng dẫn Nghiên cứu sinh",
    authority: "Đại học Quốc gia TP. Hồ Chí Minh",
    badge: "Hiệu lực hiện hành",
    badgeColor: "bg-emerald-100 text-emerald-800",
    summary:
      "Quy định chi tiết về tải trọng và hạn ngạch hướng dẫn: Giảng viên hướng dẫn chính / độc lập tính 1.0 NCS; Đồng hướng dẫn tính 0.5 NCS. Mỗi giảng viên hướng dẫn không quá 3.0 NCS tại cùng một thời điểm. Đối với Giáo sư, Phó Giáo sư chủ trì đề tài cấp Bộ trở lên, hạn ngạch tối đa không quá 4.0 NCS.",
    keyPoints: [
      "Hướng dẫn chính / Độc lập: 1.0 NCS",
      "Đồng hướng dẫn: 0.5 NCS",
      "Trần tối đa tiêu chuẩn: 3.0 NCS",
      "Trần đặc cách GS/PGS có đề tài cấp Bộ: 4.0 NCS",
    ],
    file: "BR-09_DinhMuc_GVHD_DHQG.pdf",
    size: "420 KB",
  },
  {
    id: "reg-02",
    code: "BR-08 ĐHQG-HCM",
    title: "Quy định Chuẩn đầu ra Công bố Khoa học Quốc tế",
    authority: "Trường Đại học An Giang - ĐHQG-HCM",
    badge: "Bắt buộc bảo vệ",
    badgeColor: "bg-blue-100 text-[#164E9B]",
    summary:
      "Yêu cầu tối thiểu để NCS được phép đăng ký bảo vệ luận án tiến sĩ cấp cơ sở: Phải đạt tổng điểm quy đổi công bố khoa học ≥ 2.0 điểm từ các bài báo thuộc danh mục WoS/Scopus. NCS phải là tác giả chính (First Author) hoặc tác giả liên hệ (Corresponding Author) có ghi tên đơn vị Trường Đại học An Giang.",
    keyPoints: [
      "Điểm công bố khoa học tích lũy: ≥ 2.0 điểm",
      "Danh mục công nhận: WoS (SCI, SCIE, SSCI, AHCI) & Scopus",
      "Vai trò tác giả: Tác giả thứ nhất hoặc tác giả liên hệ",
      "Đơn vị công tác: Bắt buộc ghi An Giang University - VNU-HCM",
    ],
    file: "BR-08_ChuanDauRa_CongBo_AGU.pdf",
    size: "350 KB",
  },
  {
    id: "reg-03",
    code: "TT 38/2021/TT-BGDĐT",
    title: "Quy chế Tuyển sinh và Đào tạo Trình độ Tiến sĩ",
    authority: "Bộ Giáo dục và Đào tạo",
    badge: "Văn bản gốc",
    badgeColor: "bg-indigo-100 text-indigo-800",
    summary:
      "Thông tư quy định khung pháp lý toàn quốc về thời gian đào tạo chuẩn (3 - 4 năm), thời gian gia hạn tối đa không quá 72 tháng (6 năm), quy trình đánh giá 9 mốc đào tạo và tổ chức Hội đồng đánh giá luận án tiến sĩ các cấp.",
    keyPoints: [
      "Thời gian đào tạo tiêu chuẩn: 36 - 48 tháng",
      "Thời gian tối đa (kể cả gia hạn): Không quá 72 tháng",
      "Quy trình đánh giá: 9 mốc tiến độ chuẩn hóa",
      "Thành phần Hội đồng luận án: Tối thiểu 5 - 7 thành viên",
    ],
    file: "ThongTu_38_2021_BoGDDT_TienSi.pdf",
    size: "680 KB",
  },
  {
    id: "reg-04",
    code: "QĐ 145/QĐ-ĐHAG-SĐH",
    title: "Quy định Đánh giá và Chấm điểm Chuyên đề Tiến sĩ",
    authority: "Trường Đại học An Giang",
    badge: "Nội bộ AGU",
    badgeColor: "bg-amber-100 text-amber-800",
    summary:
      "Quy chế về tổ chức chấm điểm Phiếu nhận xét và đánh giá chuyên đề tiến sĩ (Mốc 2, 4, 5). Tiêu chí chấm theo thang điểm 10 kết hợp xếp loại Đạt/Không đạt. Các mốc có yêu cầu điểm phải được nhập đầy đủ biên bản họp hội đồng vào hệ thống.",
    keyPoints: [
      "Áp dụng cho Mốc 2, Mốc 4, Mốc 5",
      "Thang điểm đánh giá: Thang 10 (lấy chính xác đến 0.1)",
      "Điều kiện Đạt: Điểm trung bình Hội đồng ≥ 7.0/10",
      "Bắt buộc số hóa Phiếu nhận xét và Biên bản hội đồng",
    ],
    file: "QD_145_DanhGiaChuyenDe_AGU.pdf",
    size: "290 KB",
  },
];

export function RegulationsView({
  roleContext = "academic",
  backHref,
  backLabel,
}: RegulationsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultBackHref =
    backHref ||
    (roleContext === "academic"
      ? "/academic"
      : roleContext === "supervisor"
      ? "/supervisor/dashboard"
      : roleContext === "student"
      ? "/student/progress"
      : "/");

  const defaultBackLabel =
    backLabel ||
    (roleContext === "academic"
      ? "Tổng quan học vụ"
      : roleContext === "supervisor"
      ? "Bàn làm việc GVHD"
      : roleContext === "student"
      ? "Tiến độ đào tạo NCS"
      : "Trang chủ");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtered = REGULATIONS_LIST.filter((reg) => {
    return (
      reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href={defaultBackHref} className="hover:text-[#164E9B] flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="size-3.5" />
            <span>{defaultBackLabel}</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Quy chế &amp; Quy định</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Văn bản Quy chế &amp; Hướng dẫn Học vụ SĐH
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Cơ sở pháp lý quản lý quá trình đào tạo tiến sĩ tại Trường Đại học An Giang - ĐHQG-HCM.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <Shield className="size-3.5 text-emerald-600" />
              <span>Văn bản pháp quy có hiệu lực</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm quy chế, quy định, mã văn bản (BR-09, TT38...)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#164E9B] focus:bg-white focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B] transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B] font-bold">
                  <BookOpen className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#164E9B]">{item.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => triggerToast(`Đang tải văn bản toàn văn: ${item.file}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-[#164E9B] px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <Download className="size-3.5" />
                  <span>Tải văn bản ({item.size})</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.summary}
            </p>

            <div className="rounded-xl border border-blue-100 bg-[#F0F5FA] p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B] block">
                Điểm cốt lõi cần lưu ý:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {item.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-[#164E9B] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegulationsView;
