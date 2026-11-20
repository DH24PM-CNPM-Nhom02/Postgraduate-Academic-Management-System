"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { DeadlineCountdown } from "@/src/components/shared/DeadlineCountdown";
import { DeadlineWarningBanner } from "@/src/components/shared/DeadlineWarningBanner";
import { mapChangeRequestToUi } from "@/src/adapters/change-request";
import {
  isChangeRequestFileUsedError,
  isChangeRequestPendingExistsError,
  useCancelChangeRequest,
  useChangeRequestDetail,
  useCreateChangeRequest,
} from "@/src/hooks/api/use-change-request";
import type { CreateChangeRequestPayload } from "@/src/types/api/change-request";
import type {
  ChangeRequestFormValues,
  ChangeRequestItem,
  ChangeRequestType,
  ChangeRequestUploadState,
  StudentChangeRequestsOverview,
} from "@/src/types/ui/change-request";
import type { SupervisorRoleType } from "@/src/types/ui/thesis";
import { CancelRequestDialog } from "./CancelRequestDialog";
import { ChangeRequestDetail } from "./ChangeRequestDetail";
import { ChangeRequestForm } from "./ChangeRequestForm";
import { ChangeRequestTable } from "./ChangeRequestTable";
import { isPendingRequestStatus } from "./helpers";

export interface ChangeRequestWorkspaceProps {
  /** Dữ liệu tổng quan đơn đề nghị & điều kiện quy chế của NCS (dựng từ API thật) */
  initialOverview: StudentChangeRequestsOverview;
  /** Loại đơn mở sẵn nếu điều hướng từ màn hình khác */
  initialType?: ChangeRequestType;
  /** Tự động mở form khi mới vào trang (khi không bị khóa đơn chờ) */
  defaultOpenForm?: boolean;
  /** Trạng thái tải lại danh sách đơn (GET /change-request) */
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

function getRemainingMonths(targetIso: string): number {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return 24;
  const now = new Date();
  const diffDays = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round((diffDays / 30) * 10) / 10);
}

/** Chuyển giá trị form UI → body `POST /change-request` theo đúng loại đơn */
function buildCreatePayload(values: ChangeRequestFormValues): CreateChangeRequestPayload {
  const base: CreateChangeRequestPayload = {
    loai: values.loaiDon,
    lyDo: values.lyDo,
  };
  if (values.loaiDon === "DOI_DE_TAI") {
    return { ...base, tenDeTaiMoi: values.tenDeTaiMoi, batKhaKhang: values.batKhaKhang };
  }
  if (values.loaiDon === "DOI_GVHD") {
    return {
      ...base,
      phanCongCuId: values.phanCongCuId,
      gvhdMoiId: values.gvhdMoiId,
      batKhaKhang: values.batKhaKhang,
    };
  }
  return { ...base, soThangGiaHan: values.soThangGiaHan };
}

/**
 * ChangeRequestWorkspace
 *
 * Container kết nối `ChangeRequestTable`, `ChangeRequestForm`, `ChangeRequestDetail`,
 * `CancelRequestDialog` với API `/change-request` (tạo, xem chi tiết, hủy đơn).
 */
export function ChangeRequestWorkspace({
  initialOverview,
  initialType = "DOI_DE_TAI",
  defaultOpenForm = false,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: ChangeRequestWorkspaceProps) {
  const requests = initialOverview.danhSachDon;

  const hasPendingRequest = useMemo(
    () => requests.some((item) => isPendingRequestStatus(item.trangThai)),
    [requests]
  );

  const [isFormOpen, setIsFormOpen] = useState(
    () => defaultOpenForm && !hasPendingRequest
  );
  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ChangeRequestItem | null>(
    null
  );

  const [uploadState, setUploadState] =
    useState<ChangeRequestUploadState | null>(null);
  // Giữ fileId đã upload để bấm gửi lại không phải upload lại (trừ lỗi 409 file trùng)
  const [uploaded, setUploaded] = useState<{ file: File; fileId: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const createMutation = useCreateChangeRequest();
  const cancelMutation = useCancelChangeRequest();
  const detailQuery = useChangeRequestDetail(detailId);

  const roleByGvhdId = useMemo(() => {
    const map: Record<string, SupervisorRoleType> = {};
    for (const s of initialOverview.danhSachGvhdHienTai) map[s.giangVienId] = s.vaiTro;
    return map;
  }, [initialOverview.danhSachGvhdHienTai]);

  // Chi tiết: ưu tiên GET /change-request/:id (có đề tài hiện tại, GVHD cũ, quyết định).
  // Khi đang tải / lỗi vẫn mở drawer bằng dòng tóm tắt nhưng drawer hiển thị rõ trạng thái đó.
  const detailRequest = useMemo(() => {
    if (!detailId) return null;
    if (detailQuery.data && detailQuery.data.id === detailId) {
      return mapChangeRequestToUi(detailQuery.data, roleByGvhdId);
    }
    return requests.find((r) => r.id === detailId) ?? null;
  }, [detailId, detailQuery.data, requests, roleByGvhdId]);

  const remainingMonthsToCurrentDeadline = getRemainingMonths(
    initialOverview.thongTinThoiGian.hanHienTai
  );

  const handleSubmitForm = (values: ChangeRequestFormValues) => {
    setFeedbackMessage(null);
    setSubmitError(null);

    const file = values.tepDinhKemFile;
    const reusableFileId = file && uploaded?.file === file ? uploaded.fileId : null;
    if (file && !reusableFileId) {
      setUploadState({ progress: 0, status: "uploading" });
    }

    createMutation.mutate(
      {
        payload: buildCreatePayload(values),
        file,
        uploadedFileId: reusableFileId,
        onUploaded: (fileId) => {
          if (file) setUploaded({ file, fileId });
          setUploadState({ progress: 100, status: "success" });
        },
        onUploadProgress: (percent) =>
          setUploadState({ progress: percent, status: "uploading" }),
      },
      {
        onSuccess: () => {
          setUploadState(null);
          setUploaded(null);
          setIsFormOpen(false);
          setFeedbackMessage(
            "Đã gửi đơn đề nghị. Bạn có thể theo dõi trạng thái xử lý ngay trong danh sách."
          );
        },
        onError: (err) => {
          // Chỉ bỏ fileId đã upload khi backend xác nhận file đã được dùng cho đơn khác;
          // các lỗi khác (400, 409 đang có đơn chờ...) giữ fileId để gửi lại không phải upload lại.
          if (isChangeRequestFileUsedError(err)) setUploaded(null);
          // 409 "đang có đơn chờ": hook đã làm mới danh sách → `hasPendingRequest` thành true,
          // form tự khóa nút gửi và hiện cảnh báo; message gốc của backend vẫn hiển thị bên dưới.
          if (isChangeRequestPendingExistsError(err)) setUploadState(null);
          setUploadState((prev) =>
            prev && prev.status === "uploading"
              ? { progress: prev.progress, status: "error", errorMessage: err.message }
              : prev
          );
          setSubmitError(err.messages.join("\n"));
        },
      }
    );
  };

  const handleConfirmCancel = (target: ChangeRequestItem) => {
    cancelMutation.mutate(target.id, {
      onSuccess: () => {
        setCancelTarget(null);
        setFeedbackMessage(
          `Đã hủy đơn ${target.maDon}. Hệ thống đã mở khóa chức năng lập đơn đề nghị mới.`
        );
      },
    });
  };

  return (
    <div className={`mx-auto max-w-7xl space-y-6 pb-12 ${className}`}>
      {/* Header trang */}
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
            Đơn đề nghị điều chỉnh &amp; Gia hạn học tập
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Quản lý đề nghị đổi đề tài, thay đổi giảng viên hướng dẫn và gia hạn học tập của NCS{" "}
            <strong className="font-semibold text-foreground">
              {initialOverview.hoTenNcs}
            </strong>{" "}
            (<span className="font-mono">{initialOverview.mshv}</span>).
          </p>
        </div>

        <DeadlineCountdown
          targetDate={initialOverview.thongTinThoiGian.hanBuocThoiHoc}
          label="Hạn tối đa 72 tháng"
          variant="badge"
        />
      </header>

      {/* Banner cảnh báo tự động khi thời hạn hiện tại còn < 12 tháng */}
      <DeadlineWarningBanner
        remainingMonths={remainingMonthsToCurrentDeadline}
        title="Thời hạn đào tạo hiện tại sắp hết hạn"
        message="Thời hạn đào tạo hiện tại của bạn còn dưới 12 tháng. Nếu cần gia hạn, vui lòng chuẩn bị Báo cáo tiến độ và nộp đơn trước hạn tối thiểu 2 tháng."
        actionLabel={hasPendingRequest ? undefined : "Lập đơn gia hạn"}
        onAction={hasPendingRequest ? undefined : () => setIsFormOpen(true)}
      />

      {/* Thông báo kết quả thao tác UI */}
      {feedbackMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/75 px-4 py-3 text-xs font-medium text-emerald-950 sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              className="size-4.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            aria-label="Đóng thông báo"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Biểu mẫu tạo đơn mới */}
      {isFormOpen && (
        <ChangeRequestForm
          currentThesisTitle={initialOverview.tenDeTaiHienTai}
          currentSupervisors={initialOverview.danhSachGvhdHienTai}
          candidateSupervisors={initialOverview.danhSachGvhdDeXuat}
          trainingSummary={initialOverview.thongTinThoiGian}
          initialType={initialType}
          hasPendingRequest={hasPendingRequest}
          uploadState={uploadState}
          isSubmitting={createMutation.isPending}
          error={submitError}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            if (!createMutation.isPending) {
              setIsFormOpen(false);
              setUploadState(null);
              setUploaded(null);
              setSubmitError(null);
            }
          }}
        />
      )}

      {/* Bảng theo dõi danh sách đơn đã gửi */}
      <ChangeRequestTable
        requests={requests}
        hasPendingRequest={hasPendingRequest}
        onCreateNew={() => {
          setFeedbackMessage(null);
          setSubmitError(null);
          setIsFormOpen(true);
        }}
        onSelectDetail={(req) => setDetailId(req.id)}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onCancelRequest={(req) => setCancelTarget(req)}
      />

      {/* Ngăn kéo xem chi tiết đơn */}
      <ChangeRequestDetail
        request={detailRequest}
        isOpen={Boolean(detailRequest)}
        onClose={() => setDetailId(null)}
        onCancelRequest={(req) => setCancelTarget(req)}
        isDetailLoading={detailQuery.isLoading}
        detailError={detailQuery.isError && !detailQuery.data ? detailQuery.error.message : null}
        onRetryDetail={() => void detailQuery.refetch()}
      />

      {/* Hộp thoại xác nhận hủy đơn */}
      <CancelRequestDialog
        request={cancelTarget}
        isOpen={Boolean(cancelTarget)}
        onClose={() => {
          if (!cancelMutation.isPending) {
            setCancelTarget(null);
            cancelMutation.reset();
          }
        }}
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
        error={cancelMutation.error?.message ?? null}
      />
    </div>
  );
}

export default ChangeRequestWorkspace;
