"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { DeadlineCountdown } from "@/src/components/shared/DeadlineCountdown";
import { DeadlineWarningBanner } from "@/src/components/shared/DeadlineWarningBanner";
import type {
  ChangeRequestFormValues,
  ChangeRequestItem,
  ChangeRequestType,
  ChangeRequestUploadState,
  StudentChangeRequestsOverview,
} from "@/src/types/ui/change-request";
import { CancelRequestDialog } from "./CancelRequestDialog";
import { ChangeRequestDetail } from "./ChangeRequestDetail";
import { ChangeRequestForm } from "./ChangeRequestForm";
import { ChangeRequestTable } from "./ChangeRequestTable";
import { isPendingRequestStatus } from "./helpers";

export interface ChangeRequestWorkspaceProps {
  /** Dữ liệu tổng quan đơn đề nghị & điều kiện quy chế của NCS */
  initialOverview: StudentChangeRequestsOverview;
  /** Loại đơn mở sẵn nếu điều hướng từ màn hình khác */
  initialType?: ChangeRequestType;
  /** Tự động mở form khi mới vào trang (khi không bị khóa đơn chờ) */
  defaultOpenForm?: boolean;
  className?: string;
}

function getRemainingMonths(targetIso: string): number {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return 24;
  const now = new Date();
  const diffDays = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round((diffDays / 30) * 10) / 10);
}

/**
 * ChangeRequestWorkspace
 *
 * Container tương tác thuần UI kết nối trọn bộ `ChangeRequestTable`,
 * `ChangeRequestForm`, `ChangeRequestDetail` và `CancelRequestDialog`
 * với dữ liệu truyền qua props (không gọi API trực tiếp).
 */
export function ChangeRequestWorkspace({
  initialOverview,
  initialType = "DOI_DE_TAI",
  defaultOpenForm = false,
  className = "",
}: ChangeRequestWorkspaceProps) {
  const [requests, setRequests] = useState<ChangeRequestItem[]>(
    () => initialOverview.danhSachDon
  );

  const hasPendingRequest = useMemo(
    () => requests.some((item) => isPendingRequestStatus(item.trangThai)),
    [requests]
  );

  const [isFormOpen, setIsFormOpen] = useState(
    () => defaultOpenForm && !hasPendingRequest
  );
  const [detailRequest, setDetailRequest] = useState<ChangeRequestItem | null>(
    null
  );
  const [cancelTarget, setCancelTarget] = useState<ChangeRequestItem | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadState, setUploadState] =
    useState<ChangeRequestUploadState | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const timersRef = useRef<number[]>([]);
  const blobUrlsRef = useRef<string[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, []);

  const remainingMonthsToCurrentDeadline = getRemainingMonths(
    initialOverview.thongTinThoiGian.hanHienTai
  );

  const handleSubmitForm = (values: ChangeRequestFormValues) => {
    clearTimers();
    setFeedbackMessage(null);
    setIsSubmitting(true);

    const finalizeSubmission = () => {
      const nowIso = new Date().toISOString();
      const seq = String(requests.length + 1).padStart(3, "0");
      const year = new Date().getUTCFullYear();
      const maDon = `DN-${year}-${seq}`;

      const oldSup = initialOverview.danhSachGvhdHienTai.find(
        (s) => s.id === values.phanCongCuId
      );
      const newSup = initialOverview.danhSachGvhdDeXuat.find(
        (c) => c.giangVienId === values.gvhdMoiId
      );

      let attachment: ChangeRequestItem["tepDinhKem"] = null;
      if (values.tepDinhKemFile) {
        const objectUrl = URL.createObjectURL(values.tepDinhKemFile);
        blobUrlsRef.current.push(objectUrl);
        attachment = {
          fileName: values.tepDinhKemFile.name,
          fileUrl: objectUrl,
          fileSize: values.tepDinhKemFile.size,
        };
      }

      const activeSupervisors = initialOverview.danhSachGvhdHienTai.filter(
        (s) => s.trangThai === "DANG_HUONG_DAN"
      );

      const createdItem: ChangeRequestItem = {
        id: `cr-${Date.now()}`,
        maDon,
        loaiDon: values.loaiDon,
        trangThai:
          values.loaiDon === "GIA_HAN" ? "CHO_GVHD_XAC_NHAN" : "CHO_DUYET",
        ngayGui: nowIso,
        ngayCapNhat: nowIso,
        lyDo: values.lyDo,
        batKhaKhang: values.batKhaKhang,
        tepDinhKem: attachment,
        quyetDinh: null,
        ...(values.loaiDon === "DOI_DE_TAI"
          ? {
              tenDeTaiCu: initialOverview.tenDeTaiHienTai,
              tenDeTaiMoi: values.tenDeTaiMoi,
            }
          : {}),
        ...(values.loaiDon === "DOI_GVHD"
          ? {
              phanCongCuId: values.phanCongCuId,
              tenGvhdCu: oldSup
                ? `${oldSup.hocHamHocVi} ${oldSup.hoTen}`
                : undefined,
              vaiTroGvhdCu: oldSup?.vaiTro,
              gvhdMoiId: values.gvhdMoiId,
              tenGvhdMoi: newSup
                ? `${newSup.hocHamHocVi} ${newSup.hoTen}`
                : undefined,
              donViGvhdMoi: newSup?.donViCongTac,
            }
          : {}),
        ...(values.loaiDon === "GIA_HAN"
          ? {
              soThangGiaHan: values.soThangGiaHan,
              hanHienTaiTaiThoiDiemNop:
                initialOverview.thongTinThoiGian.hanHienTai,
              hanMoiDuKien: values.hanMoiDuKien,
              xacNhanGvhds: activeSupervisors.map((sup, index) => ({
                id: `op-new-${Date.now()}-${index}`,
                giangVienId: sup.giangVienId,
                tenGvhd: sup.hoTen,
                hocHamHocVi: sup.hocHamHocVi,
                vaiTro: sup.vaiTro,
                dongY: null,
                nhanXet: null,
                thoiGianPhanHoi: null,
              })),
            }
          : {}),
      };

      setRequests((prev) => [createdItem, ...prev]);
      setIsSubmitting(false);
      setUploadState(null);
      setIsFormOpen(false);
      setDetailRequest(createdItem);
      setFeedbackMessage(
        `Đã gửi đơn đề nghị ${maDon}. Bạn có thể theo dõi trạng thái xử lý ngay trong danh sách.`
      );
    };

    if (values.tepDinhKemFile) {
      const handleCancelUpload = () => {
        clearTimers();
        setIsSubmitting(false);
        setUploadState(null);
      };

      setUploadState({
        progress: 35,
        status: "uploading",
        onCancel: handleCancelUpload,
      });

      const t1 = window.setTimeout(() => {
        setUploadState({
          progress: 85,
          status: "uploading",
          onCancel: handleCancelUpload,
        });
      }, 150);

      const t2 = window.setTimeout(() => {
        setUploadState({
          progress: 100,
          status: "success",
        });
      }, 300);

      const t3 = window.setTimeout(() => {
        finalizeSubmission();
      }, 450);

      timersRef.current.push(t1, t2, t3);
      return;
    }

    const t0 = window.setTimeout(() => {
      finalizeSubmission();
    }, 180);
    timersRef.current.push(t0);
  };

  const handleConfirmCancel = (target: ChangeRequestItem) => {
    setIsCancelling(true);
    const nowIso = new Date().toISOString();

    const timer = window.setTimeout(() => {
      setRequests((prev) =>
        prev.map((item) =>
          item.id === target.id
            ? {
                ...item,
                trangThai: "DA_HUY",
                ngayCapNhat: nowIso,
              }
            : item
        )
      );

      setDetailRequest((prev) =>
        prev && prev.id === target.id
          ? { ...prev, trangThai: "DA_HUY", ngayCapNhat: nowIso }
          : prev
      );

      setIsCancelling(false);
      setCancelTarget(null);
      setFeedbackMessage(
        `Đã hủy đơn ${target.maDon}. Hệ thống đã mở khóa chức năng lập đơn đề nghị mới.`
      );
    }, 150);

    timersRef.current.push(timer);
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
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            if (!isSubmitting) {
              setIsFormOpen(false);
              setUploadState(null);
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
          setIsFormOpen(true);
        }}
        onSelectDetail={(req) => setDetailRequest(req)}
        onCancelRequest={(req) => setCancelTarget(req)}
      />

      {/* Ngăn kéo xem chi tiết đơn */}
      <ChangeRequestDetail
        request={detailRequest}
        isOpen={Boolean(detailRequest)}
        onClose={() => setDetailRequest(null)}
        onCancelRequest={(req) => setCancelTarget(req)}
      />

      {/* Hộp thoại xác nhận hủy đơn */}
      <CancelRequestDialog
        request={cancelTarget}
        isOpen={Boolean(cancelTarget)}
        onClose={() => {
          if (!isCancelling) setCancelTarget(null);
        }}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />
    </div>
  );
}

export default ChangeRequestWorkspace;
