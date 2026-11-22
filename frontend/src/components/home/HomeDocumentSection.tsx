"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Info,
  X,
} from "lucide-react";

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

const FALLBACK_FORMS: StaticFormItem[] = [
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

const FALLBACK_REGULATIONS: StaticRegulationItem[] = [
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

export function HomeDocumentSection() {
  const [selectedDoc, setSelectedDoc] = useState<StaticFormItem | StaticRegulationItem | null>(null);

  const handleDownload = (name: string) => {
    alert(`Đang tải tệp: ${name}\nTài liệu được phát hành chính thức từ Cổng SĐH Trường Đại học An Giang.`);
  };

  return (
    <section id="documents" className="scroll-mt-20 space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] uppercase tracking-wider mb-1">
            <ClipboardList className="size-4" />
            <span>Văn bản &amp; Biểu mẫu Chính thức</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Biểu mẫu Học vụ &amp; Quy định Quy chế
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tài liệu hướng dẫn, biểu mẫu đơn từ và hệ thống văn bản pháp quy đào tạo sau đại học hiện hành
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-[#164E9B]">
          <Link href="/forms" className="hover:underline flex items-center gap-1">
            <span>Tất cả biểu mẫu</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/regulations" className="hover:underline flex items-center gap-1">
            <span>Tất cả quy chế</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Grid: Left (Forms) & Right (Regulations) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Essential Forms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
                <FileText className="size-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Biểu mẫu học vụ thiết yếu
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {FALLBACK_FORMS.length} biểu mẫu chuẩn
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs divide-y divide-slate-100">
            {FALLBACK_FORMS.map((form) => (
              <div
                key={form.code}
                className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-slate-50/80 rounded-xl"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      form.format === "XLSX"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-[#164E9B] border border-blue-200"
                    }`}
                  >
                    {form.format}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#164E9B]">
                        {form.code}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                        {form.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {form.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Dung lượng: {form.size} • Định dạng {form.format}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(form)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="Xem chi tiết hướng dẫn"
                    aria-label={`Xem chi tiết ${form.name}`}
                  >
                    <Info className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(form.name)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors"
                    title="Tải biểu mẫu"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">Tải về</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Essential Regulations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <BookOpen className="size-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Văn bản Quy định &amp; Quy chế
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {FALLBACK_REGULATIONS.length} văn bản pháp quy
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs divide-y divide-slate-100">
            {FALLBACK_REGULATIONS.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-slate-50/80 rounded-xl"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    PDF
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        {reg.code}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {reg.date}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {reg.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Cơ quan ban hành: {reg.authority}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(reg)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="Xem tóm tắt nội dung"
                    aria-label={`Xem tóm tắt ${reg.title}`}
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(reg.title)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Tải văn bản toàn văn"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Detail / Summary Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#164E9B]">
                  {"code" in selectedDoc ? selectedDoc.code : ""}
                </span>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {"title" in selectedDoc ? selectedDoc.title : selectedDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                aria-label="Đóng chi tiết"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Mục đích &amp; Phạm vi áp dụng
                </h4>
                <p className="leading-relaxed text-slate-600">
                  {selectedDoc.summary}
                </p>
              </div>

              {"keyPoints" in selectedDoc && selectedDoc.keyPoints && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Các điểm trọng tâm
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedDoc.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="flex size-1.5 rounded-full bg-[#164E9B] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
                <p>
                  Định dạng: <strong>{selectedDoc.format}</strong> • Dung lượng: <strong>{selectedDoc.size}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const docTitle = "title" in selectedDoc ? selectedDoc.title : selectedDoc.name;
                  handleDownload(docTitle);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D]"
              >
                <Download className="size-3.5" />
                <span>Tải tệp tin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomeDocumentSection;
