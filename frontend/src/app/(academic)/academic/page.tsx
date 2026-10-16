"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  FileCheck2,
  FileEdit,
  Gauge,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Calendar,
  ChevronRight,
  FileText,
  Layers,
} from "lucide-react";
import {
  DocumentPreviewModal,
  ApprovalDialog,
  TopicChangeModal,
  HoverLogo,
  MOCK_EVIDENCES,
  MOCK_TOPIC_CHANGES,
  MOCK_CALENDAR_EVENTS,
  type EvidenceItem,
  type TopicChangeItem,
} from "@/src/components/academic";

function AcademicDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    const routeMap: Record<string, string> = {
      students: "/academic/students",
      supervisors: "/academic/supervisors",
      evidence: "/academic/evidence",
      "topic-changes": "/academic/topic-changes",
      procedures: "/academic/procedures",
      calendar: "/academic/calendar",
      forms: "/academic/forms",
      regulations: "/academic/regulations",
      faq: "/academic/faq",
    };
    if (tabParam && routeMap[tabParam]) {
      router.replace(routeMap[tabParam]);
    }
  }, [tabParam, router]);

  // Interactive Modals State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<EvidenceItem | null>(null);

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<EvidenceItem | null>(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedTopicChange, setSelectedTopicChange] = useState<TopicChangeItem | null>(null);

  // Dynamic Lists for approvals
  const [evidencesList, setEvidencesList] = useState(MOCK_EVIDENCES);
  const [topicChangesList, setTopicChangesList] = useState(MOCK_TOPIC_CHANGES);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handle Evidence Approval submission
  const handleApprovalSubmit = (result: { decision: string; notes: string; score?: number }) => {
    if (!approvalData) return;
    const actionLabel =
      result.decision === "approve"
        ? "Đã phê duyệt Đạt"
        : result.decision === "revise"
        ? "Đã yêu cầu bổ sung"
        : "Đã từ chối";

    // Remove from pending list
    setEvidencesList((prev) => prev.filter((item) => item.id !== approvalData.id));
    triggerToast(
      `${actionLabel} minh chứng cho NCS ${approvalData.studentName}. Hệ thống đã gửi email thông báo và cập nhật tiến độ đào tạo.`
    );
  };

  // Handle Topic Change decision
  const handleTopicDecision = (id: string, decision: "approve" | "revise" | "reject", reason?: string) => {
    const item = topicChangesList.find((t) => t.id === id);
    if (!item) return;

    setTopicChangesList((prev) => prev.filter((t) => t.id !== id));
    if (decision === "approve") {
      triggerToast(
        `Đã chấp thuận đề nghị đổi tên đề tài của NCS ${item.studentName}. Quyết định điều chỉnh đã được khởi tạo dự thảo.`
      );
    } else {
      triggerToast(
        `Đã phản hồi yêu cầu giải trình tới NCS ${item.studentName}: "${reason || "Cần làm rõ căn cứ khoa học"}"`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700"
          >
            ×
          </button>
        </div>
      )}

      {/* DASHBOARD HERO SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-[#164E9B]/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#164E9B] border border-blue-200">
                <HoverLogo sizeClass="size-4" />
                Cổng Sau Đại Học AGU
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                Học kỳ I / 2026 - 2027 • Tuần 08
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                [Dữ liệu mô phỏng]
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F2744] tracking-tight">
              Tra cứu thủ tục học vụ nhanh chóng
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Theo dõi tiến độ 9 mốc tiến sĩ, thẩm định minh chứng học vụ trực tuyến, quản lý định mức hướng dẫn và xét duyệt hồ sơ đề tài theo quy chế Đào tạo Sau Đại học AGU &amp; ĐHQG-HCM.
            </p>

            {/* Quick Keyword Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Tìm nhanh:</span>
              {[
                { label: "Quy trình nộp đề cương (Mốc 5)", href: "/academic/procedures" },
                { label: "Duyệt đổi đề tài", href: "/academic/topic-changes" },
                { label: "Quản lý NCS toàn trường", href: "/academic/students" },
                { label: "Hạn ngạch GVHD (BR-09)", href: "/academic/supervisors" },
                { label: "Thẩm định bài báo WoS/Scopus", href: "/academic/evidence" },
                { label: "Báo cáo 6 tháng", href: "/academic/calendar" },
              ].map((shortcut, idx) => (
                <Link
                  key={idx}
                  href={shortcut.href}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors"
                >
                  {shortcut.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Academic Staff Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#164E9B] text-white font-black text-sm shadow-xs">
                TA
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">TS. Bùi Lê Tuấn Anh</h3>
                <p className="text-xs text-slate-500">Khoa Công nghệ Thông tin</p>
                <span className="inline-block rounded-sm bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-[#164E9B] mt-0.5">
                  Cán bộ Quản lý &amp; Giáo vụ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B]/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                NCS ĐANG QUẢN LÝ
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B]">
                <Users className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">18</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                88.9% đúng hạn
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              4 NCS hướng dẫn trực tiếp và 14 NCS thuộc chuyên ngành phụ trách học vụ.
            </p>
          </div>
          <Link
            href="/academic/students"
            className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>Xem danh sách NCS</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Card 2: Pending Evidence */}
        <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-xs hover:border-amber-400 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                CHỜ DUYỆT MINH CHỨNG
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
                <FileCheck2 className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-900">{evidencesList.length}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                3 hồ sơ khẩn
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              Báo cáo chuyên đề và chứng chỉ ngoại ngữ đang chờ xác nhận chuyên môn.
            </p>
          </div>
          <Link
            href="/academic/evidence"
            className="mt-4 flex items-center justify-between border-t border-amber-200/60 pt-3 text-xs font-bold text-amber-800 hover:underline"
          >
            <span>Duyệt hồ sơ ngay</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Card 3: Topic Change Requests */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-xs hover:border-blue-400 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                ĐỔI ĐỀ TÀI CHỜ DUYỆT
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
                <FileEdit className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{topicChangesList.length}</span>
              <span className="text-xs font-semibold text-[#164E9B] bg-blue-100 px-2 py-0.5 rounded-full">
                Đã có ý kiến GVHD
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              Đề xuất điều chỉnh tên đề tài luận án bổ sung phương pháp học sâu và nano sinh học.
            </p>
          </div>
          <Link
            href="/academic/topic-changes"
            className="mt-4 flex items-center justify-between border-t border-blue-200/60 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>So sánh &amp; Thẩm định</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Card 4: Supervisors Quota */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B]/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                HẠN NGẠCH HƯỚNG DẪN
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Gauge className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">2.5</span>
              <span className="text-sm font-semibold text-slate-500">/ 3.0 NCS</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Tuân thủ quy chế BR-09 ĐHQG-HCM: Độc lập 1.0, Đồng HD 0.5 (Tối đa 3.0).
            </p>
          </div>
          <Link
            href="/academic/supervisors"
            className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>Chi tiết hạn ngạch</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* APPROVAL WORKFLOW GUIDE BANNER */}
      <div className="rounded-2xl border border-blue-200 bg-[#E8F1FC] p-4.5 text-xs text-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white">
              <Layers className="size-4" />
            </div>
            <div>
              <span className="font-bold text-[#0F2744] block text-sm">
                Quy trình Thẩm định &amp; Phê duyệt Học vụ
              </span>
              <span className="text-[11px] text-slate-500">
                Thực hiện phân quyền nghiêm ngặt giữa NCS, GVHD và Ban Quản lý Sau Đại học.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-lg bg-white px-2.5 py-1 text-slate-700 shadow-2xs border border-blue-200/60">
              1. NCS nộp minh chứng
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-white px-2.5 py-1 text-slate-700 shadow-2xs border border-blue-200/60">
              2. GVHD xác nhận
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-[#164E9B] px-2.5 py-1 text-white shadow-2xs font-bold ring-2 ring-[#164E9B]/30">
              3. Giáo vụ/ĐVCM phê duyệt
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-white shadow-2xs">
              4. Cập nhật mốc &amp; Thông báo
            </span>
          </div>
        </div>
      </div>

      {/* TỔNG QUAN & HÀNG CHỜ DUYỆT (MAIN DASHBOARD VIEW) */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Urgent Approval Queues */}
          <div className="lg:col-span-2 space-y-6">
            {/* Evidence Approval Queue Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Hàng chờ duyệt minh chứng học viên ({evidencesList.length})
                  </h2>
                </div>
                <Link
                  href="/academic/evidence"
                  className="text-xs font-bold text-[#164E9B] hover:underline"
                >
                  Xem tất cả hàng chờ →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Nghiên cứu sinh</th>
                      <th className="py-2.5 px-3">Mốc đào tạo</th>
                      <th className="py-2.5 px-3">Tài liệu nộp</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evidencesList.slice(0, 4).map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{item.studentName}</span>
                          <span className="text-[11px] text-slate-500">{item.studentCode} • {item.department}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-[#164E9B]">{item.milestone}</span>
                          <span className="block text-[10px] text-slate-400">{item.submittedAt}</span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setPreviewData(item);
                              setPreviewModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-slate-700 hover:text-[#164E9B] group"
                          >
                            <FileText className="size-3.5 text-rose-500" />
                            <span className="font-medium truncate max-w-[150px] underline underline-offset-2">
                              {item.documentTitle}
                            </span>
                          </button>
                          <span className="text-[10px] text-slate-400">PDF • {item.fileSize}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setApprovalData(item);
                              setApprovalModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#164E9B] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#113E7D] transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Xem &amp; Duyệt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Thesis Topic Changes Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileEdit className="size-4 text-[#164E9B]" />
                  <span>Đề nghị điều chỉnh đề tài cần thẩm định ({topicChangesList.length})</span>
                </h2>
                <Link
                  href="/academic/topic-changes"
                  className="text-xs font-bold text-[#164E9B] hover:underline"
                >
                  Xem chi tiết →
                </Link>
              </div>

              <div className="space-y-3">
                {topicChangesList.map((tc) => (
                  <div
                    key={tc.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 transition-all hover:border-blue-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">
                          {tc.studentName} ({tc.studentCode})
                        </span>
                        <span className="text-slate-500 text-[11px] ml-2">
                          {tc.department} • Nộp: {tc.requestDate}
                        </span>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#164E9B] self-start sm:self-auto">
                        Chờ Giáo vụ xem xét
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                          Tên đề tài hiện hành:
                        </span>
                        <p className="italic text-slate-700">“{tc.currentTopic}”</p>
                      </div>

                      <div className="rounded-lg bg-blue-50/70 p-2.5 border border-blue-200">
                        <span className="text-[10px] font-bold uppercase text-[#164E9B] block mb-1">
                          Tên đề tài đề xuất mới:
                        </span>
                        <p className="font-semibold text-slate-900 italic">“{tc.proposedTopic}”</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-500 italic">
                        Ý kiến GVHD ({tc.supervisorName}): Đã đồng ý đề xuất
                      </p>
                      <button
                        onClick={() => {
                          setSelectedTopicChange(tc);
                          setTopicModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-[#164E9B] hover:bg-blue-50 transition-colors shadow-2xs"
                      >
                        <Eye className="size-3.5" />
                        <span>Đối chiếu &amp; Thẩm định</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Recent Activities & Upcoming Schedule */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Calendar className="size-4 text-[#164E9B]" />
                  <span>Lịch học vụ &amp; Sự kiện</span>
                </h3>
                <Link
                  href="/academic/calendar"
                  className="text-xs font-bold text-[#164E9B] hover:underline"
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="space-y-2.5 text-xs">
                {MOCK_CALENDAR_EVENTS.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>{ev.title}</span>
                      <span className="rounded bg-blue-100 text-[#164E9B] px-1.5 py-0.2 text-[10px]">
                        {ev.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{ev.scope}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Clock className="size-4 text-[#164E9B]" />
                <span>Nhật ký thẩm định gần đây</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      Giáo vụ duyệt minh chứng Mốc 2 cho NCS Võ Hoàng Nam
                    </p>
                    <p className="text-[10px] text-slate-400">14/10/2026 15:45 • Bởi ThS. Nguyễn Thị Kim Loan</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] text-[10px] font-bold mt-0.5">
                    i
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      NCS Trần Thị Mai gửi đề xuất đổi tên đề tài
                    </p>
                    <p className="text-[10px] text-slate-400">13/10/2026 10:20 • Đã có xác nhận GVHD</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                    !
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      Cảnh báo thời gian đào tạo: NCS Đặng Thị Thảo còn 2 tháng
                    </p>
                    <p className="text-[10px] text-slate-400">12/10/2026 08:00 • Hệ thống tự động cảnh báo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: DOCUMENT PREVIEW MODAL */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        documentTitle={previewData?.documentTitle}
        studentName={previewData?.studentName}
        studentCode={previewData?.studentCode}
        milestoneName={previewData?.milestone}
        submissionDate={previewData?.submittedAt}
        fileSize={previewData?.fileSize}
      />

      {/* MODAL 2: APPROVAL WORKFLOW DIALOG */}
      <ApprovalDialog
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        recordTitle={approvalData?.documentTitle}
        studentName={approvalData?.studentName}
        studentCode={approvalData?.studentCode}
        milestoneName={approvalData?.milestone}
        currentStep={approvalData?.step as "gvhd_confirm" | "academic_review" | undefined}
      />

      {/* MODAL 3: TOPIC CHANGE COMPARISON MODAL */}
      <TopicChangeModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        data={selectedTopicChange}
        onDecision={handleTopicDecision}
      />
    </div>
  );
}

export default function AcademicDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải bảng điều khiển Giáo vụ SĐH...
        </div>
      }
    >
      <AcademicDashboardContent />
    </React.Suspense>
  );
}
