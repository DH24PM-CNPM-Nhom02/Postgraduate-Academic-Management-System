"use client";

import { toast } from "sonner";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Download,
  Loader2,
} from "lucide-react";
import type {
  ThesisViewFilterStatus,
  AcademicThesisNcsItem,
} from "@/src/types/api/thesis";
import { useAcademicTheses } from "@/src/hooks/use-theses";
import { useAcademicSupervisors } from "@/src/hooks/use-academic";
import { ThesesKpiCards } from "./ThesesKpiCards";
import { ThesesFilterBar } from "./ThesesFilterBar";
import { ThesesTable } from "./ThesesTable";
import { ThesisAssignmentModal } from "./ThesisAssignmentModal";
import { ThesisDeactivateModal } from "./ThesisDeactivateModal";
import { ThesisDetailDrawer } from "./ThesisDetailDrawer";
import { formatDate } from "@/src/lib/utils";

export interface ThesesManagementViewProps {
  /**
   * Khi được nhúng trong dashboard hoặc trang tab, có thể ẩn breadcrumb quay lại
   */
  embedded?: boolean;
}

function ThesesManagementViewContent({
  embedded = false,
}: ThesesManagementViewProps) {
  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams?.get("search") || "");
  const [cohort, setCohort] = useState("ALL");
  const [status, setStatus] = useState<ThesisViewFilterStatus>("ALL");
  const [supervisorId, setSupervisorId] = useState("ALL");

  // Fetch dữ liệu danh sách đề tài luận án
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAcademicTheses({
    page,
    limit,
    search: search || undefined,
    khoaHocId: cohort !== "ALL" ? cohort : undefined,
    trangThai: status !== "ALL" ? status : undefined,
    gvhdId: supervisorId !== "ALL" ? supervisorId : undefined,
  });

  const thesisItems = useMemo(
    () => responseData?.data ?? [],
    [responseData?.data]
  );
  const totalItems = responseData?.total ?? 0;

  // Lấy danh sách GVHD thực tế từ API để làm tùy chọn bộ lọc
  const { data: supervisorsData } = useAcademicSupervisors();

  const cohortOptions = useMemo(() => {
    const cohorts = Array.from(
      new Set(thesisItems.map((item) => item.khoaHoc).filter(Boolean))
    ).sort();
    return [
      { value: "ALL", label: "Tất cả khóa học" },
      ...cohorts.map((c) => ({ value: c, label: c })),
    ];
  }, [thesisItems]);

  const supervisorOptions = useMemo(() => {
    if (!supervisorsData || !Array.isArray(supervisorsData)) {
      return [{ value: "ALL", label: "Tất cả GVHD" }];
    }
    return [
      { value: "ALL", label: "Tất cả GVHD" },
      ...supervisorsData.map((sv) => ({
        value: sv.id,
        label: `${sv.degree ? sv.degree + " " : ""}${sv.name}`,
      })),
    ];
  }, [supervisorsData]);

  // Modal / Drawer States
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<AcademicThesisNcsItem | null>(null);

  // HANDLERS BỘ LỌC (Tuân thủ Guardrail 2: gọi setPage(1) trực tiếp trong handler)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCohortChange = (val: string) => {
    setCohort(val);
    setPage(1);
  };

  const handleStatusChange = (val: ThesisViewFilterStatus) => {
    setStatus(val);
    setPage(1);
  };

  const handleSupervisorChange = (val: string) => {
    setSupervisorId(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCohort("ALL");
    setStatus("ALL");
    setSupervisorId("ALL");
    setPage(1);
  };

  const isFiltered =
    Boolean(search) || cohort !== "ALL" || status !== "ALL" || supervisorId !== "ALL";

  // HANDLERS THAO TÁC ROW / MODAL
  const handleOpenAssignModal = (item?: AcademicThesisNcsItem) => {
    setSelectedItem(item || null);
    setAssignModalOpen(true);
  };

  const handleOpenDeactivateModal = (item: AcademicThesisNcsItem) => {
    setSelectedItem(item);
    setDeactivateModalOpen(true);
  };

  const handleOpenDetailDrawer = (item: AcademicThesisNcsItem) => {
    setSelectedItem(item);
    setDetailDrawerOpen(true);
  };

  // XUẤT FILE CSV / EXCEL ĐỊNH DẠNG UTF-8 CÓ BOM
  const handleExportCsv = () => {
    if (thesisItems.length === 0) {
      toast.error("Không có dữ liệu đề tài để trích xuất.");
      return;
    }

    const headers = [
      "MSHV",
      "Họ và tên NCS",
      "Khóa học",
      "Trạng thái đề tài",
      "Tên đề tài hiện tại",
      "Số Quyết định",
      "Ngày ký Quyết định",
      "Giảng viên hướng dẫn chính",
      "Đồng hướng dẫn",
      "Trạng thái đào tạo",
    ];

    const rows = thesisItems.map((item) => {
      const gvhdChinh = item.phanCongs?.find(
        (p) => p.vaiTro === "HUONG_DAN_CHINH"
      )?.gvhd.hoTen || "";
      const dongGvhd = item.phanCongs?.find(
        (p) => p.vaiTro === "DONG_HUONG_DAN"
      )?.gvhd.hoTen || "";

      return [
        `"${item.mshv}"`,
        `"${item.hoTen}"`,
        `"${item.khoaHoc}"`,
        `"${item.trangThaiDeTai}"`,
        `"${(item.deTaiHienTai?.tenDeTai || "Chưa giao").replace(/"/g, '""')}"`,
        `"${item.deTaiHienTai?.quyetDinh?.soQuyetDinh || ""}"`,
        `"${formatDate(item.deTaiHienTai?.quyetDinh?.ngayQuyetDinh)}"`,
        `"${gvhdChinh}"`,
        `"${dongGvhd}"`,
        `"${item.trangThaiHocTap || "DANG_HOC"}"`,
      ].join(",");
    });

    // Thêm BOM UTF-8 (\uFEFF) để Excel hiển thị đúng dấu tiếng Việt
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `DanhSach_DeTaiLuanAn_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Đã trích xuất danh sách đề tài luận án thành công.");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link
                href="/academic"
                className="hover:text-[#164E9B] flex items-center gap-1"
              >
                <ArrowLeft className="size-3" />
                <span>Tổng quan học vụ</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Quản lý Đề tài Luận án
              </span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý Đề tài Luận án Toàn trường
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi hồ sơ đề tài, lịch sử điều chỉnh tên đề tài và phân công
            giảng viên hướng dẫn của nghiên cứu sinh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
              <span>Đang tải đề tài...</span>
            </div>
          )}

          {/* NÚT GIAO ĐỀ TÀI MỚI */}
          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Giao đề tài mới</span>
          </button>

          {/* NÚT XUẤT CSV / EXCEL */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="size-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 4 THẺ THỐNG KÊ TỔNG QUAN (KPI CARDS) */}
      <ThesesKpiCards
        items={thesisItems}
        totalNcs={totalItems}
        isLoading={isLoading}
      />

      {/* THANH BỘ LỌC & TÌM KIẾM */}
      <ThesesFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        cohort={cohort}
        onCohortChange={handleCohortChange}
        status={status}
        onStatusChange={handleStatusChange}
        supervisorId={supervisorId}
        onSupervisorChange={handleSupervisorChange}
        onResetFilters={handleResetFilters}
        cohortOptions={cohortOptions}
        supervisorOptions={supervisorOptions}
        isFiltered={isFiltered}
        totalResults={totalItems}
        isLoading={isFetching}
        onRefresh={() => refetch()}
      />

      {/* BẢNG DỮ LIỆU ĐỀ TÀI & PHÂN TRANG */}
      <ThesesTable
        data={thesisItems}
        total={totalItems}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        onViewDetail={handleOpenDetailDrawer}
        onAssignThesis={handleOpenAssignModal}
        onDeactivateThesis={handleOpenDeactivateModal}
        onViewDecision={handleOpenDetailDrawer}
        onResetFilters={handleResetFilters}
      />

      {/* MODAL GIAO ĐỀ TÀI (reset qua key prop) */}
      <ThesisAssignmentModal
        key={`assign-${assignModalOpen}-${selectedItem?.id ?? "none"}`}
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedItem(null);
        }}
        student={selectedItem}
        students={thesisItems}
        onSuccess={toast.success}
      />

      {/* MODAL HỦY ĐỀ TÀI (reset qua key prop) */}
      <ThesisDeactivateModal
        key={`deactivate-${deactivateModalOpen}-${selectedItem?.id ?? "none"}`}
        isOpen={deactivateModalOpen}
        onClose={() => {
          setDeactivateModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={toast.success}
      />

      {/* DRAWER CHI TIẾT & LỊCH SỬ ĐỀ TÀI */}
      <ThesisDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedItem(null);
        }}
        ncsId={selectedItem?.id || null}
        ncsSummary={selectedItem}
        onAssignThesis={(it) => {
          setDetailDrawerOpen(false);
          handleOpenAssignModal(it);
        }}
        onDeactivateThesis={(it) => {
          setDetailDrawerOpen(false);
          handleOpenDeactivateModal(it);
        }}
      />
    </div>
  );
}

export function ThesesManagementView(props: ThesesManagementViewProps) {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách Đề tài Luận án...
        </div>
      }
    >
      <ThesesManagementViewContent {...props} />
    </React.Suspense>
  );
}

export default ThesesManagementView;
