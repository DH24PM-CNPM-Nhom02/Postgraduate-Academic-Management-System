"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  FileEdit,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { TopicChangeModal } from "@/src/components/academic/TopicChangeModal";
import { TablePagination } from "@/src/components/ui/table-pagination";
import {
  useChangeRequestDetails,
  useChangeRequests,
} from "@/src/hooks/api/use-change-request";

interface TopicChangesManagementViewProps {
  embedded?: boolean;
}

/** Đơn đổi đề tài đang chờ Giáo vụ duyệt (backend tối đa limit 100) */
const LIST_PARAMS = {
  loai: "DOI_DE_TAI",
  trangThai: "CHO_DUYET",
  page: 1,
  limit: 100,
} as const;

function formatDateVi(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export function TopicChangesManagementView({ embedded = false }: TopicChangesManagementViewProps) {
  // GET /change-request?loai=DOI_DE_TAI&trangThai=CHO_DUYET
  const requestsQuery = useChangeRequests(LIST_PARAMS);
  const isLoading = requestsQuery.isLoading;

  const topicChangesList = useMemo(
    () => requestsQuery.data?.data ?? [],
    [requestsQuery.data]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginatedTopicChanges = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return topicChangesList.slice(start, start + pageSize);
  }, [topicChangesList, currentPage, pageSize]);

  // Chi tiết từng đơn trên trang hiện tại để lấy tên đề tài hiện hành (deTaiHienTai)
  const detailQueries = useChangeRequestDetails(paginatedTopicChanges.map((r) => r.id));
  const detailById = useMemo(() => {
    const map = new Map<string, NonNullable<(typeof detailQueries)[number]["data"]>>();
    detailQueries.forEach((q) => {
      if (q.data) map.set(q.data.id, q.data);
    });
    return map;
  }, [detailQueries]);
  // Lỗi tải chi tiết theo id (useQueries giữ đúng thứ tự của mảng id truyền vào)
  const detailErrorById = useMemo(() => {
    const map = new Map<string, { message: string; retry: () => void }>();
    detailQueries.forEach((q, index) => {
      const id = paginatedTopicChanges[index]?.id;
      if (id && q.isError && !q.data) {
        map.set(id, { message: q.error.message, retry: () => void q.refetch() });
      }
    });
    return map;
  }, [detailQueries, paginatedTopicChanges]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRequest = topicChangesList.find((r) => r.id === selectedId) ?? null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer tự đóng toast: hủy timer cũ khi có toast mới, và hủy khi unmount (không setState sau unmount)
  const toastTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const triggerToast = (msg: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null;
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        {!embedded && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
              <ArrowLeft className="size-3" />
              <span>Tổng quan học vụ</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Duyệt đề nghị đổi đề tài</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Duyệt Đề nghị Điều chỉnh Tên Đề tài Luận án Tiến sĩ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              So sánh đề tài hiện hành và đề xuất mới, đối chiếu lý do và chọn quyết định giao đề tài làm căn cứ phê duyệt.
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
              <span>Đang tải...</span>
            </div>
          )}
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileEdit className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Yêu cầu chờ thẩm định ({topicChangesList.length} hồ sơ)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {topicChangesList.length === 0 ? "Đã xử lý hết" : "Ưu tiên xử lý trong 5 ngày làm việc"}
          </span>
        </div>

        <div className="space-y-4">
          {requestsQuery.isError ? (
            <div className="py-12 text-center text-xs">
              <p className="font-semibold text-rose-700">{requestsQuery.error.message}</p>
              <button
                type="button"
                onClick={() => requestsQuery.refetch()}
                className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải danh sách đơn...</div>
          ) : paginatedTopicChanges.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700 text-sm">Tất cả đề nghị điều chỉnh đề tài đã được xử lý xong!</p>
              <p className="text-slate-400 mt-1">Khi có NCS nộp hồ sơ mới, thông báo sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            paginatedTopicChanges.map((item) => {
              const detail = detailById.get(item.id);
              const detailError = detailErrorById.get(item.id);
              return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-4.5 hover:border-[#164E9B]/40 transition-all space-y-3 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#0F2744] text-sm">{item.ncs.hoTen}</span>
                    <span className="font-mono text-xs text-slate-500">({item.ncs.mshv})</span>
                    {item.batKhaKhang && (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Bất khả kháng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>Nộp: {formatDateVi(item.createdAt)}</span>
                  </div>
                </div>

                {/* Old vs New Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Tên đề tài hiện hành:
                    </span>
                    {detail ? (
                      <p className="font-semibold text-slate-700 italic">
                        {detail.deTaiHienTai?.tenDeTai
                          ? `“${detail.deTaiHienTai.tenDeTai}”`
                          : "NCS chưa có đề tài hiệu lực"}
                      </p>
                    ) : detailError ? (
                      <p role="alert" className="text-rose-700">
                        Không tải được đề tài hiện tại.{" "}
                        <button
                          type="button"
                          onClick={detailError.retry}
                          className="font-bold hover:underline cursor-pointer"
                        >
                          Thử lại
                        </button>
                      </p>
                    ) : (
                      <p className="italic text-slate-400">Đang tải...</p>
                    )}
                  </div>

                  <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E9B] block mb-1 flex items-center gap-1">
                      <Sparkles className="size-3 text-[#164E9B]" />
                      Tên đề tài đề xuất mới:
                    </span>
                    <p className="font-bold text-[#0F2744] italic">“{item.tenDeTaiMoi}”</p>
                  </div>
                </div>

                {/* Supervisor Opinion & Reason */}
                <div className="rounded-lg bg-slate-50/80 p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <strong className="text-slate-700 shrink-0">Lý do đề nghị:</strong>
                    <span className="text-slate-600">{item.lyDo}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
                  >
                    <Eye className="size-3.5" />
                    <span>Xem xét &amp; Phê duyệt điều chỉnh</span>
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>

        {/* Phân trang danh sách đề nghị */}
        <TablePagination
          currentPage={currentPage}
          totalItems={topicChangesList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="đề nghị đổi đề tài"
          className="pt-2"
        />
      </div>

      {/* TOPIC CHANGE COMPARISON MODAL */}
      <TopicChangeModal
        key={selectedId ?? "none"}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedId(null)}
        request={selectedRequest}
        detail={selectedRequest ? detailById.get(selectedRequest.id) : undefined}
        detailError={selectedRequest ? detailErrorById.get(selectedRequest.id)?.message ?? null : null}
        onRetryDetail={selectedRequest ? detailErrorById.get(selectedRequest.id)?.retry : undefined}
        onDone={triggerToast}
      />
    </div>
  );
}
