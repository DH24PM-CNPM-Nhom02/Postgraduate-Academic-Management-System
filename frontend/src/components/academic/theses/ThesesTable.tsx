"use client";

import React from "react";
import {
  BookOpen,
  FileText,
  Clock,
  Plus,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { formatDate } from "@/src/lib/utils";
import { TablePagination } from "@/src/components/ui/table-pagination";
import { ThesisStatusBadge } from "./ThesisStatusBadge";
import { ThesisRowAction } from "./ThesisRowAction";

export interface ThesesTableProps {
  data: AcademicThesisNcsItem[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onViewDetail: (item: AcademicThesisNcsItem) => void;
  onAssignThesis: (item: AcademicThesisNcsItem) => void;
  onDeactivateThesis: (item: AcademicThesisNcsItem) => void;
  onViewDecision?: (item: AcademicThesisNcsItem) => void;
  onResetFilters?: () => void;
  className?: string;
}

const STUDY_STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  DANG_HOC: {
    label: "Đang học",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  GIA_HAN: {
    label: "Gia hạn",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  THOI_HOC: {
    label: "Thôi học",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  TOT_NGHIEP: {
    label: "Tốt nghiệp",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export function ThesesTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  isLoading = false,
  isError = false,
  errorMessage = "Có lỗi xảy ra khi tải danh sách đề tài luận án.",
  onRetry,
  onViewDetail,
  onAssignThesis,
  onDeactivateThesis,
  onViewDecision,
  onResetFilters,
  className = "",
}: ThesesTableProps) {
  // Trạng thái LỖI (Error State)
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center space-y-3">
        <div className="flex size-12 mx-auto items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-rose-900">
            Không thể tải danh sách đề tài
          </h3>
          <p className="text-xs text-rose-700">{errorMessage}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap min-w-[100px]">
                MSHV
              </th>
              <th scope="col" className="py-3 px-3.5 min-w-[160px]">
                Họ và tên NCS
              </th>
              <th scope="col" className="py-3 px-3 whitespace-nowrap min-w-[130px]">
                Khóa học
              </th>
              <th scope="col" className="py-3 px-3.5 min-w-[300px] lg:min-w-[360px]">
                Tên đề tài Luận án &amp; Quyết định
              </th>
              <th scope="col" className="py-3 px-3 min-w-[200px]">
                Cán bộ Hướng dẫn (GVHD)
              </th>
              <th scope="col" className="py-3 px-3 whitespace-nowrap min-w-[130px]">
                Trạng thái
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap min-w-[70px]">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              // Trạng thái LOADING (Skeleton Rows)
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-3.5 px-3.5">
                    <div className="h-5 w-20 bg-slate-200 rounded-md" />
                  </td>
                  <td className="py-3.5 px-3.5 space-y-1.5">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </td>
                  <td className="py-3.5 px-3.5 space-y-1.5">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-40 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-3 space-y-1">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="size-8 bg-slate-200 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              // Trạng thái EMPTY (Không có kết quả)
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="flex size-12 mx-auto items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <BookOpen className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-700 text-sm">
                        Không tìm thấy đề tài luận án nào
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Không có nghiên cứu sinh nào khớp với bộ lọc tìm kiếm hiện
                        tại.
                      </p>
                    </div>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Đặt lại bộ lọc</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // HIỂN THỊ DỮ LIỆU THỰC TẾ
              data.map((item) => {
                // Đếm số lần thay đổi đề tài cũ (DA_THAY_THE + DA_HUY)
                const changeCount =
                  item.deTais?.filter(
                    (t) =>
                      t.id !== item.deTaiHienTai?.id &&
                      (t.trangThai === "DA_THAY_THE" || t.trangThai === "DA_HUY")
                  ).length ?? 0;

                // Có thể giao đề tài nhanh: chưa có đề tài, không có đơn chờ duyệt, đang học/gia hạn
                const isEnrolledOrExtended =
                  !item.trangThaiHocTap ||
                  item.trangThaiHocTap === "DANG_HOC" ||
                  item.trangThaiHocTap === "GIA_HAN";

                const canAssignQuick =
                  item.trangThaiDeTai === "CHUA_GIAO" &&
                  !item.hasPendingChangeRequest &&
                  isEnrolledOrExtended;

                const studyStatus = item.trangThaiHocTap
                  ? STUDY_STATUS_LABELS[item.trangThaiHocTap]
                  : null;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* CỘT 1: MSHV */}
                    <td className="py-3.5 px-3.5 align-top">
                      <button
                        type="button"
                        onClick={() => onViewDetail(item)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#164E9B] px-2 py-0.5 font-mono text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                        title="Bấm để xem hồ sơ và lịch sử đề tài"
                      >
                        <span>{item.mshv}</span>
                      </button>
                    </td>

                    {/* CỘT 2: HỌ VÀ TÊN NCS */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onViewDetail(item)}
                            className="font-bold text-slate-900 text-xs hover:text-[#164E9B] transition-colors text-left cursor-pointer"
                          >
                            {item.hoTen}
                          </button>
                          {item.hasPendingChangeRequest && (
                            <span
                              className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-semibold"
                              title="NCS đang có đơn xin thay đổi đề tài chờ Hội đồng / Giáo vụ duyệt"
                            >
                              <Clock className="size-2.5" />
                              <span>Chờ duyệt</span>
                            </span>
                          )}
                        </div>
                        {studyStatus && (
                          <div className="mt-1">
                            <span
                              className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-medium border ${studyStatus.badge}`}
                            >
                              {studyStatus.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* CỘT 3: KHÓA HỌC */}
                    <td className="py-3.5 px-3 align-top">
                      <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                        {item.khoaHoc}
                      </span>
                    </td>

                    {/* CỘT 4: TÊN ĐỀ TÀI & QUYẾT ĐỊNH */}
                    <td className="py-3.5 px-3.5 align-top">
                      {item.deTaiHienTai ? (
                        <div className="space-y-1.5">
                          <p
                            className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2"
                            title={item.deTaiHienTai.tenDeTai}
                          >
                            {item.deTaiHienTai.tenDeTai}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            {item.deTaiHienTai.quyetDinh?.soQuyetDinh && (
                              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                                <FileText className="size-3 text-slate-400" />
                                <span>
                                  QĐ: {item.deTaiHienTai.quyetDinh.soQuyetDinh}
                                </span>
                                {item.deTaiHienTai.quyetDinh.ngayQuyetDinh && (
                                  <span>
                                    (
                                    {formatDate(
                                      item.deTaiHienTai.quyetDinh.ngayQuyetDinh
                                    )}
                                    )
                                  </span>
                                )}
                              </span>
                            )}
                            {changeCount > 0 && (
                              <button
                                type="button"
                                onClick={() => onViewDetail(item)}
                                className="inline-flex items-center rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer"
                                title="Bấm xem lịch sử thay đổi đề tài"
                              >
                                Đã đổi {changeCount} lần
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap py-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="size-3" />
                            <span>Chưa giao đề tài</span>
                          </span>
                          {canAssignQuick && (
                            <button
                              type="button"
                              onClick={() => onAssignThesis(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 transition-colors cursor-pointer"
                              title="Giao đề tài cho nghiên cứu sinh này"
                            >
                              <Plus className="size-3" />
                              <span>Giao đề tài</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* CỘT 5: CÁN BỘ HƯỚNG DẪN (GVHD) */}
                    <td className="py-3.5 px-3 align-top">
                      {item.phanCongs && item.phanCongs.length > 0 ? (
                        <div className="space-y-1">
                          {item.phanCongs.map((pc, idx) => (
                            <div
                              key={pc.id || idx}
                              className="flex items-center gap-1 text-slate-800 text-xs"
                            >
                              <span className="font-semibold">
                                {pc.gvhd.hoTen}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500">
                                {pc.vaiTro === "HUONG_DAN_CHINH"
                                  ? "(Chính)"
                                  : "(Đồng HD)"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
                          <AlertCircle className="size-3" />
                          <span>Chưa phân công GVHD</span>
                        </span>
                      )}
                    </td>

                    {/* CỘT 6: TRẠNG THÁI */}
                    <td className="py-3.5 px-3 align-top">
                      <ThesisStatusBadge status={item.trangThaiDeTai} />
                    </td>

                    {/* CỘT 7: THAO TÁC */}
                    <td className="py-3.5 px-3 text-right align-top">
                      <ThesisRowAction
                        item={item}
                        onViewDetail={onViewDetail}
                        onAssignThesis={onAssignThesis}
                        onDeactivateThesis={onDeactivateThesis}
                        onViewDecision={onViewDecision}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CHÂN BẢNG: PHÂN TRANG */}
      <div className="p-4 bg-white border-t border-slate-100">
        <TablePagination
          currentPage={page}
          totalItems={total}
          pageSize={limit}
          onPageChange={onPageChange}
          itemLabel="đề tài luận án"
        />
      </div>
    </div>
  );
}

export default ThesesTable;
