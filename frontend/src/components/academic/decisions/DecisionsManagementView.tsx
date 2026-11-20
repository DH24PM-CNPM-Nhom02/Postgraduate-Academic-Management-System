"use client";

import { toast } from "sonner";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Plus,
  Ban,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { DecisionIssueModal } from "../DecisionIssueModal";
import { DecisionCellAction } from "./DecisionCellAction";
import { useDecisions, useDeactivateDecision } from "@/src/hooks/api/use-decisions";
import { NcsService } from "@/src/services/ncs";
import { DECISION_TYPES } from "@/src/services/decision";
import { DecisionAttachment } from "./DecisionAttachment";
import type { DecisionItem } from "@/src/types/academic";

interface DecisionDetailModalProps {
  decision: DecisionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function DecisionDetailModal({ decision, isOpen, onClose }: DecisionDetailModalProps) {
  if (!isOpen || !decision) return null;
  const isEffective = decision.trangThai === "HIEU_LUC";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F2744]">{decision.soQuyetDinh}</h3>
                {isEffective ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
        <CheckCircle2 className="size-3" /> Hiệu lực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
        <XCircle className="size-3" /> Vô hiệu hóa
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Chi tiết quyết định pháp lý</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-6 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Ngày ban hành</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="size-3.5 text-[#164E9B]" />
                <span>{decision.ngayQuyetDinh}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Loại quyết định</span>
              <span className="font-bold text-[#164E9B]">{DECISION_LABELS[decision.loai]}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1 font-medium">NCS Áp dụng</span>
            {decision.ncs ? (
              <div className="rounded-xl border border-slate-200 p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{decision.ncs.hoTen}</span>
                  <span className="text-slate-400 text-[11px]">MSHV: {decision.ncs.mshv}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 text-slate-600 flex items-center gap-2 font-semibold">
                <Users className="size-4 text-slate-400" />
                <span>Quyết định chung (Áp dụng toàn khóa hoặc tiểu ban chuyên môn)</span>
              </div>
            )}
          </div>

          {decision.hanMoi && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 flex items-center gap-2 font-bold text-purple-900">
              <Clock className="size-4 text-purple-600" />
              <span>Hạn học tập mới sau gia hạn: {decision.hanMoi}</span>
            </div>
          )}

          <div>
            <span className="text-slate-400 block mb-1 font-medium">Trích yếu / Ghi chú</span>
            <p className="rounded-xl border border-slate-200 p-3 bg-white text-slate-700 leading-relaxed">
              {decision.ghiChu || "Không có ghi chú thêm."}
            </p>
          </div>

          {!isEffective && decision.lyDoVoHieuHoa && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
              <strong>Lý do vô hiệu hóa:</strong> {decision.lyDoVoHieuHoa}
            </div>
          )}

          {decision.fileId ? (
            <DecisionAttachment
              key={decision.fileId}
              fileId={decision.fileId}
              fileName={decision.fileName}
              decisionNumber={decision.soQuyetDinh}
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500">
              Chưa đính kèm tệp PDF
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL VÔ HIỆU HÓA QUYẾT ĐỊNH
   ========================================================================= */
interface DeactivateDecisionModalProps {
  isOpen: boolean;
  decision: DecisionItem | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  pending: boolean;
  apiError?: string;
}

function DeactivateDecisionModal({ isOpen, decision, onClose, onConfirm, pending, apiError }: DeactivateDecisionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !decision) return null;

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Vui lòng nhập lý do vô hiệu hóa quyết định.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Lý do không được vượt quá 500 ký tự.");
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 space-y-4 text-xs animate-in zoom-in-95">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2 text-rose-800 border-b border-rose-100 pb-3">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
            <Ban className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Vô Hiệu Hóa Quyết Định</h3>
            <p className="text-[11px] text-slate-500">
              Số QĐ: <span className="font-semibold text-slate-800">{decision.soQuyetDinh}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-800 flex items-start gap-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Quyết định sau khi vô hiệu hóa sẽ không còn giá trị pháp lý và không thể dùng làm căn cứ duyệt mốc được nữa.
          </p>
        </div>

        {apiError && <p role="alert" className="text-rose-700">{apiError}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lý do vô hiệu hóa <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập lý do chi tiết (ví dụ: Quyết định ban hành nhầm số hiệu...)"
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-rose-500 focus:outline-hidden text-xs"
              autoFocus
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              {error ? <span className="text-rose-600 font-semibold">{error}</span> : <span>Bắt buộc 1 - 500 ký tự</span>}
              <span>{reason.length}/500</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || pending}
              className="rounded-xl bg-rose-600 px-4 py-1.5 font-bold text-white hover:bg-rose-700 cursor-pointer disabled:opacity-50"
            >
              Xác Nhận Hủy QĐ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW CHÍNH: QUẢN LÝ QUYẾT ĐỊNH (DecisionsManagementView)
   ========================================================================= */
const DECISION_LABELS: Record<(typeof DECISION_TYPES)[number], string> = {
  GIAO_DE_TAI: "Giao đề tài",
  PHAN_CONG_GVHD: "Phân công GVHD",
  THANH_LAP_TIEU_BAN: "Thành lập tiểu ban",
  CAN_CU_DUYET_MOC: "Căn cứ duyệt mốc",
  CONG_NHAN_TOT_NGHIEP: "Công nhận tốt nghiệp",
  GIA_HAN: "Gia hạn",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
  HOC_TIEP: "Học tiếp",
  KHAC: "Khác",
};

const DECISION_TYPE_ITEMS = [
  { value: "all", label: "Tất cả loại quyết định" },
  ...DECISION_TYPES.map((value) => ({ value, label: DECISION_LABELS[value] })),
];
const DECISION_STATUS_ITEMS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "HIEU_LUC", label: "Hiệu lực" },
  { value: "VO_HIEU_HOA", label: "Vô hiệu hóa" },
];

const EMPTY_DECISIONS: DecisionItem[] = [];

export function DecisionsManagementView({ embedded = false }: { embedded?: boolean }) {
  const decisionsQuery = useDecisions();
  const decisions = decisionsQuery.data ?? EMPTY_DECISIONS;
  const deactivateMutation = useDeactivateDecision();
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");


  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const studentsQuery = useQuery({
    queryKey: ["academic", "decision-students"],
    queryFn: () => NcsService.getAllStudents(),
    enabled: createModalOpen,
  });
  const [detailDecision, setDetailDecision] = useState<DecisionItem | null>(null);
  const [deactivateDecision, setDeactivateDecision] = useState<DecisionItem | null>(null);


  // Lọc danh sách quyết định
  const filteredDecisions = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return decisions.filter((dec) => {
      const matchSearch =
        dec.soQuyetDinh.toLowerCase().includes(keyword) ||
        (dec.ncs?.hoTen && dec.ncs.hoTen.toLowerCase().includes(keyword)) ||
        (dec.ncs?.mshv && dec.ncs.mshv.toLowerCase().includes(keyword)) ||
        (dec.ghiChu && dec.ghiChu.toLowerCase().includes(keyword));

      const matchType = typeFilter === "all" || dec.loai === typeFilter;
      const matchStatus = statusFilter === "all" || dec.trangThai === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [decisions, searchText, typeFilter, statusFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: decisions.length,
      canCuMoc: decisions.filter((d) => d.loai === "CAN_CU_DUYET_MOC" && d.trangThai === "HIEU_LUC").length,
      giaHan: decisions.filter((d) => d.loai === "GIA_HAN" && d.trangThai === "HIEU_LUC").length,
      voHieuHoa: decisions.filter((d) => d.trangThai === "VO_HIEU_HOA").length,
    };
  }, [decisions]);

  const handleDeactivateConfirm = async (reason: string) => {
    if (!deactivateDecision || deactivateMutation.isPending) return;
    try {
      const result = await deactivateMutation.mutateAsync({ id: deactivateDecision.id, lyDo: reason });
      toast.success(["Đã vô hiệu hóa quyết định.", ...result.canhBao].join(" "));
      setDeactivateDecision(null);
    } catch {
      // The mutation error is displayed in the confirmation dialog.
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "CAN_CU_DUYET_MOC":
        return "bg-blue-50 text-[#164E9B] border-blue-200";
      case "GIA_HAN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "BAO_LUU":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "NGUNG_HOC":
      case "BUOC_THOI_HOC":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "GIAO_DE_TAI":
      case "PHAN_CONG_GVHD":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const { reset: resetDeactivate } = deactivateMutation;
  const columns = useMemo<ColumnDef<DecisionItem>[]>(() => [
    {
      id: "soQuyetDinh",
      header: "Số quyết định",
      cell: ({ row }) => {
        const dec = row.original;

        return <div className="font-bold text-slate-900">
          <div className="flex items-center gap-1.5">
            <FileText className="size-3.5 text-[#164E9B]" />
            <span>{dec.soQuyetDinh}</span>
          </div>
        </div>;
      },
    },
    {
      id: "ngayQuyetDinh",
      header: "Ngày ký",
      cell: ({ row }) => {
        const dec = row.original;

        return <div className="text-slate-600 whitespace-nowrap">
          {dec.ngayQuyetDinh}
        </div>;
      },
    },
    {
      id: "loai",
      header: "Loại",
      cell: ({ row }) => {
        const dec = row.original;

        return <div>
          <span
            className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${getBadgeColor(
              dec.loai
            )}`}
          >
            {DECISION_LABELS[dec.loai]}
          </span>
        </div>;
      },
    },
    {
      id: "ncs",
      header: "Áp dụng cho",
      cell: ({ row }) => {
        const dec = row.original;

        return <div>
          {dec.ncs ? (
            <div>
              <div className="font-bold text-slate-800">{dec.ncs.hoTen}</div>
              <div className="text-[10px] text-slate-400">MSHV: {dec.ncs.mshv}</div>
            </div>
          ) : (
            <span className="text-slate-400 italic">Áp dụng chung</span>
          )}
        </div>;
      },
    },
    {
      id: "ghiChu",
      header: "Hạn mới / Ghi chú",
      cell: ({ row }) => {
        const dec = row.original;

        return <div className="max-w-xs truncate text-slate-600">
          {dec.hanMoi ? (
            <span className="font-bold text-purple-700">Hạn mới: {dec.hanMoi}</span>
          ) : (
            dec.ghiChu || "—"
          )}
        </div>;
      },
    },
    {
      id: "trangThai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const dec = row.original;
        const isEffective = dec.trangThai === "HIEU_LUC";
        return <div>
          {isEffective ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="size-3" /> Hiệu lực
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              <XCircle className="size-3" /> Vô hiệu hóa
            </span>
          )}
        </div>;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const dec = row.original;

        return (
          <div className="text-right">
            <DecisionCellAction
              decision={dec}
              onViewDetail={setDetailDecision}
              onDeactivate={(decision) => {
                resetDeactivate();
                setDeactivateDecision(decision);
              }}
            />
          </div>
        );
      },
    },
  ], [resetDeactivate]);
  const table = useManagementDataTable({
    data: filteredDecisions,
    columns,
    globalFilter: "",
    onGlobalFilterChange: () => {},
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {!embedded && (
            <nav aria-label="Đường dẫn" className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
                <ArrowLeft className="size-3" />
                <span>Tổng quan học vụ</span>
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-semibold text-slate-700">Quản lý quyết định</span>
            </nav>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý quyết định pháp lý
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lưu trữ, ban hành căn cứ pháp lý duyệt mốc, quyết định gia hạn, bảo lưu, thôi học.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex shrink-0 self-start sm:self-auto items-center gap-2 rounded-xl bg-[#164E9B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Tạo quyết định mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng số quyết định", count: stats.total, icon: FileText, color: "bg-blue-50 text-[#164E9B]" },
          { label: "Căn cứ duyệt mốc", count: stats.canCuMoc, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" },
          { label: "Quyết định gia hạn", count: stats.giaHan, icon: Clock, color: "bg-amber-50 text-amber-700" },
          { label: "Vô hiệu hóa", count: stats.voHieuHoa, icon: Ban, color: "bg-rose-50 text-rose-700" },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F2744]">{decisionsQuery.data ? count : "—"}</div>
          </div>
        ))}
      </div>

      <section aria-labelledby="decision-list-title" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-[#164E9B]" />
            <h2 id="decision-list-title" className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Bộ lọc &amp; tra cứu quyết định
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => decisionsQuery.refetch()}
              disabled={decisionsQuery.isFetching}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100/70 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${decisionsQuery.isFetching ? "animate-spin" : ""}`} />
              {decisionsQuery.isFetching ? "Đang đồng bộ..." : "Đồng bộ từ máy chủ"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setTypeFilter("all");
                setStatusFilter("all");
                table.setPageIndex(0);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="search"
              aria-label="Tìm quyết định"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Tìm theo số QĐ, tên NCS, MSHV hoặc trích yếu..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-[#164E9B] focus:bg-white focus:ring-1 focus:ring-[#164E9B]"
            />
          </div>

          {[
            { items: DECISION_TYPE_ITEMS, value: typeFilter, setValue: setTypeFilter, label: "Loại quyết định" },
            { items: DECISION_STATUS_ITEMS, value: statusFilter, setValue: setStatusFilter, label: "Trạng thái" },
          ].map(({ items, value, setValue, label }) => (
            <Select
              key={label}
              items={items}
              value={value}
              onValueChange={(value) => {
                setValue(value ?? "all");
                table.setPageIndex(0);
              }}
            >
              <SelectTrigger aria-label={label} className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="max-h-60 rounded-xl bg-white shadow-xl">
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {decisionsQuery.isError && (
          <div role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
            Không thể tải danh sách quyết định. {decisionsQuery.error.message}
          </div>
        )}
        <ManagementDataTable
          table={table}
          headerStyles={{ actions: "px-3 py-3 text-right" }}
          itemLabel="quyết định"
          emptyState={
            decisionsQuery.isPending ? (
              <div role="status" className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Đang tải quyết định...
              </div>
            ) : decisionsQuery.isError && !decisionsQuery.data ? (
              "Bấm đồng bộ từ máy chủ để thử lại."
            ) : (
              <>
                <FileText className="mx-auto mb-2 size-8 text-slate-300" />
                <p className="font-semibold text-slate-600">Không tìm thấy quyết định nào phù hợp.</p>
              </>
            )
          }
        />
      </section>

      {createModalOpen && (
        <DecisionIssueModal
          isOpen
          onClose={() => setCreateModalOpen(false)}
          students={studentsQuery.data ?? []}
          onSuccess={toast.success}
        />
      )}
      {createModalOpen && (studentsQuery.isPending || studentsQuery.isError) && (
        <div role="status" className="fixed bottom-6 right-6 z-[60] rounded-xl bg-white p-4 text-sm shadow-lg">
          {studentsQuery.isPending ? "Đang tải danh sách NCS..." : "Không thể tải danh sách NCS."}
          {studentsQuery.isError && (
            <button onClick={() => studentsQuery.refetch()} className="ml-3 underline">Thử lại</button>
          )}
        </div>
      )}

      {/* Modal xem chi tiết */}
      <DecisionDetailModal
        decision={detailDecision}
        isOpen={!!detailDecision}
        onClose={() => setDetailDecision(null)}
      />

      {/* Modal vô hiệu hóa */}
      <DeactivateDecisionModal
        key={deactivateDecision?.id}
        isOpen={!!deactivateDecision}
        decision={deactivateDecision}
        onClose={() => { if (!deactivateMutation.isPending) { setDeactivateDecision(null); deactivateMutation.reset(); } }}
        pending={deactivateMutation.isPending}
        apiError={deactivateMutation.error?.message}
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  );
}
