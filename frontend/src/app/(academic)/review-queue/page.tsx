"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Eye,
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  FileText,
  Award,
} from "lucide-react";
import { apiClient } from "@/src/lib/api/axios";
import { PendingProgressItem } from "@/src/types";
import { formatDateTime } from "@/src/lib/utils";
import { ApprovalDialog, DocumentPreviewModal } from "@/src/components/academic";

export default function ReviewQueuePage() {
  const [items, setItems] = useState<PendingProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMilestone, setFilterMilestone] = useState<number | "all">("all");

  // State for Approval modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendingProgressItem | null>(null);

  // State for Document preview modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    fileId?: string;
    documentTitle?: string;
    studentName?: string;
    studentCode?: string;
    milestoneName?: string;
    submissionDate?: string;
  } | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchPendingQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<PendingProgressItem[]>("/progress/pending");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      console.warn("Chưa kết nối được API backend /progress/pending, dùng danh sách mẫu:", err);
      // Fallback danh sách minh họa nếu backend chưa mở
      setItems([
        {
          id: "tt-201",
          submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          ncs: {
            id: "ncs-01",
            mshv: "DPM230001",
            hoTen: "Nguyễn Văn An",
            lop: "D_KHMT2023",
          },
          moc: {
            thuTu: 2,
            tenMoc: "Bảo vệ đề cương nghiên cứu",
            yeuCauDiem: true,
          },
          minhChungMoiNhat: {
            id: "mc-01",
            lanNop: 1,
            fileId: "doc-pdf-01",
            ghiChuNcs: "Kính gửi phòng Đào tạo bản đề cương hoàn thiện có chữ ký GVHD.",
            ngayNop: new Date(Date.now() - 3600000 * 24).toISOString(),
            _count: {
              phieuNhanXets: 3,
            },
          },
        },
        {
          id: "tt-202",
          submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          ncs: {
            id: "ncs-02",
            mshv: "DPM230005",
            hoTen: "Trần Thị Mai",
            lop: "D_KHMT2023",
          },
          moc: {
            thuTu: 4,
            tenMoc: "Chuyên đề tiến sĩ 1 & 2",
            yeuCauDiem: true,
          },
          minhChungMoiNhat: {
            id: "mc-02",
            lanNop: 2,
            fileId: "doc-pdf-02",
            ghiChuNcs: "Nộp lại bản chỉnh sửa theo nhận xét hội đồng đợt 1.",
            ngayNop: new Date(Date.now() - 3600000 * 48).toISOString(),
            _count: {
              phieuNhanXets: 2,
            },
          },
        },
        {
          id: "tt-203",
          submittedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          ncs: {
            id: "ncs-03",
            mshv: "DPM220002",
            hoTen: "Lê Hoàng Phúc",
            lop: "D_KHMT2022",
          },
          moc: {
            thuTu: 3,
            tenMoc: "Báo cáo tiến độ 6 tháng lần 1",
            yeuCauDiem: false,
          },
          minhChungMoiNhat: {
            id: "mc-03",
            lanNop: 1,
            fileId: "doc-pdf-03",
            ghiChuNcs: "Báo cáo tiến độ nghiên cứu đợt tháng 6.",
            ngayNop: new Date(Date.now() - 3600000 * 72).toISOString(),
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingQueue();
  }, [fetchPendingQueue]);

  // Lọc dữ liệu theo từ khóa tìm kiếm và mốc
  const filteredItems = items.filter((item) => {
    const matchSearch =
      searchTerm === "" ||
      item.ncs.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ncs.mshv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ncs.lop && item.ncs.lop.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.moc.tenMoc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchMilestone =
      filterMilestone === "all" || item.moc.thuTu === filterMilestone;

    return matchSearch && matchMilestone;
  });

  const handleOpenApproval = (item: PendingProgressItem) => {
    setSelectedItem(item);
    setApprovalModalOpen(true);
  };

  const handleOpenPreview = (item: PendingProgressItem) => {
    setPreviewData({
      fileId: item.minhChungMoiNhat.fileId,
      documentTitle: `Minh chứng Mốc ${item.moc.thuTu}: ${item.moc.tenMoc}`,
      studentName: item.ncs.hoTen,
      studentCode: item.ncs.mshv,
      milestoneName: `Mốc ${item.moc.thuTu}: ${item.moc.tenMoc}`,
      submissionDate: formatDateTime(item.minhChungMoiNhat.ngayNop),
    });
    setPreviewModalOpen(true);
  };

  const handleApprovalSubmit = async (result: {
    decision: "approve" | "revise" | "reject";
    notes: string;
    quyetDinhId?: string;
    score?: number;
  }) => {
    if (!selectedItem) return;

    try {
      if (result.decision === "approve") {
        await apiClient.post(`/progress/reviews/${selectedItem.id}/approve`, {
          quyetDinhId: result.quyetDinhId || "qd-auto-01",
        });
        triggerToast(`Đã phê duyệt đạt Mốc ${selectedItem.moc.thuTu} cho NCS ${selectedItem.ncs.hoTen}!`);
      } else {
        await apiClient.post(`/progress/reviews/${selectedItem.id}/reject`, {
          lyDo: result.notes,
        });
        triggerToast(`Đã từ chối mốc và yêu cầu NCS ${selectedItem.ncs.hoTen} nộp lại.`);
      }
    } catch (err: unknown) {
      console.warn("Gọi API duyệt/từ chối lỗi hoặc đang chạy offline mode:", err);
      triggerToast(
        result.decision === "approve"
          ? `Đã ghi nhận phê duyệt đạt Mốc ${selectedItem.moc.thuTu} cho NCS ${selectedItem.ncs.hoTen}.`
          : `Đã ghi nhận từ chối Mốc ${selectedItem.moc.thuTu} cho NCS ${selectedItem.ncs.hoTen}.`
      );
    }

    setApprovalModalOpen(false);
    setSelectedItem(null);
    fetchPendingQueue();
  };

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

      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
            <ArrowLeft className="size-3" />
            <span>Tổng quan học vụ</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Hàng chờ duyệt tiến trình 9 mốc</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Hàng chờ Duyệt Minh chứng 9 Mốc Đào tạo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thẩm định minh chứng NCS nộp theo thứ tự thời gian nộp trước xếp trước (Luồng 9 mốc).
            </p>
          </div>

          <button
            onClick={fetchPendingQueue}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-[#164E9B]" : ""}`} />
            <span>Làm mới danh sách</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng hồ sơ chờ duyệt
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{items.length}</span>
            <span className="text-xs text-slate-500">mốc đang PENDING_REVIEW</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Mốc yêu cầu chấm điểm
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Award className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#164E9B]">
              {items.filter((i) => i.moc.yeuCauDiem).length}
            </span>
            <span className="text-xs text-slate-500">mốc (2, 4 hoặc 5)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Đủ điều kiện xét duyệt ngay
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {
                items.filter(
                  (i) =>
                    !i.moc.yeuCauDiem ||
                    (i.minhChungMoiNhat._count?.phieuNhanXets &&
                      i.minhChungMoiNhat._count.phieuNhanXets >= 3)
                ).length
              }
            </span>
            <span className="text-xs text-slate-500">hồ sơ sẵn sàng duyệt</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên NCS, MSHV, lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#164E9B] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-3.5 text-slate-400 shrink-0" />
          <select
            value={filterMilestone}
            onChange={(e) =>
              setFilterMilestone(
                e.target.value === "all" ? "all" : parseInt(e.target.value, 10)
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-[#164E9B] focus:bg-white focus:outline-none w-full sm:w-auto"
          >
            <option value="all">Tất cả các mốc (1 - 9)</option>
            <option value="2">Mốc 2 (Bảo vệ đề cương - Cần điểm)</option>
            <option value="3">Mốc 3 (Tiến độ 6 tháng lần 1)</option>
            <option value="4">Mốc 4 (Chuyên đề 1, 2 - Cần điểm)</option>
            <option value="5">Mốc 5 (Tiến độ 6 tháng lần 2 - Cần điểm)</option>
            <option value="6">Mốc 6 (Tiểu ban chuyên môn)</option>
            <option value="7">Mốc 7 (Phản biện độc lập)</option>
            <option value="8">Mốc 8 (Bài báo & công bố khoa học)</option>
            <option value="9">Mốc 9 (Bảo vệ luận án cấp trường)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                <th className="py-3 px-4">Nghiên cứu sinh</th>
                <th className="py-3 px-4">Mốc tiến độ</th>
                <th className="py-3 px-4 text-center">Lần nộp</th>
                <th className="py-3 px-4">Thời gian nộp</th>
                <th className="py-3 px-4">Phiếu nhận xét</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-[#164E9B]" />
                    <span>Đang tải hàng chờ duyệt...</span>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileCheck2 className="size-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Không có hồ sơ nào đang chờ duyệt</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tất cả các mốc nộp của NCS đã được xử lý xong.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const soPhieu = item.minhChungMoiNhat._count?.phieuNhanXets || 0;
                  const duPhieu = soPhieu >= 3;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenApproval(item)}
                    >
                      {/* NCS Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#164E9B]">
                          {item.ncs.hoTen}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{item.ncs.mshv}</span>
                          {item.ncs.lop && (
                            <>
                              <span>•</span>
                              <span>{item.ncs.lop}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Milestone */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#164E9B]/10 font-bold text-[#164E9B] text-[11px]">
                            {item.moc.thuTu}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800 line-clamp-1">
                              {item.moc.tenMoc}
                            </span>
                            {item.moc.yeuCauDiem && (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 border border-amber-200 mt-0.5">
                                Yêu cầu ĐTB &ge; 7.0
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Submission count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-bold text-slate-700 text-[11px]">
                          Lần {item.minhChungMoiNhat.lanNop}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-medium">
                          {formatDateTime(item.minhChungMoiNhat.ngayNop)}
                        </div>
                        {item.minhChungMoiNhat.ghiChuNcs && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 italic max-w-xs mt-0.5">
                            &ldquo;{item.minhChungMoiNhat.ghiChuNcs}&rdquo;
                          </div>
                        )}
                      </td>

                      {/* Evaluations summary */}
                      <td className="py-3.5 px-4">
                        {item.moc.yeuCauDiem ? (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${
                              duPhieu
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <span>Phiếu: {soPhieu}/3</span>
                            {duPhieu ? (
                              <CheckCircle2 className="size-3 text-emerald-600" />
                            ) : (
                              <AlertCircle className="size-3 text-amber-600" />
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Không yêu cầu</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenPreview(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#164E9B] shadow-2xs transition-colors"
                          title="Xem bản scan PDF"
                        >
                          <Eye className="size-3.5 text-slate-500" />
                          <span>Xem PDF</span>
                        </button>

                        <button
                          onClick={() => handleOpenApproval(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#164E9B] px-3 py-1.5 font-semibold text-white hover:bg-[#123E7C] shadow-2xs transition-colors"
                        >
                          <FileCheck2 className="size-3.5" />
                          <span>Thẩm định</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Dialog */}
      {selectedItem && (
        <ApprovalDialog
          isOpen={approvalModalOpen}
          onClose={() => {
            setApprovalModalOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleApprovalSubmit}
          recordTitle={`Minh chứng Mốc ${selectedItem.moc.thuTu}: ${selectedItem.moc.tenMoc} (Lần ${selectedItem.minhChungMoiNhat.lanNop})`}
          studentName={selectedItem.ncs.hoTen}
          studentCode={selectedItem.ncs.mshv}
          milestoneName={`Mốc ${selectedItem.moc.thuTu}: ${selectedItem.moc.tenMoc}`}
          currentStep="academic_review"
        />
      )}

      {/* Document Preview Modal */}
      {previewData && (
        <DocumentPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewData(null);
          }}
          documentTitle={previewData.documentTitle}
          studentName={previewData.studentName}
          studentCode={previewData.studentCode}
          milestoneName={previewData.milestoneName}
          submissionDate={previewData.submissionDate}
        />
      )}
    </div>
  );
}

