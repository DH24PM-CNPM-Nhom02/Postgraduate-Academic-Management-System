"use client";

import React from "react";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import type { CancelRequestDialogProps } from "@/src/types/ui/change-request";
import { CHANGE_REQUEST_TYPE_META, formatDateVi } from "./helpers";

/**
 * CancelRequestDialog
 *
 * Hộp thoại xác nhận trước khi hủy một đơn đề nghị đang ở trạng thái chờ xử lý.
 * Tái sử dụng trực tiếp component dùng chung `ConfirmDialog`.
 */
export function CancelRequestDialog({
  request,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  error = null,
  variant = "destructive",
}: CancelRequestDialogProps) {
  if (!request) {
    return (
      <ConfirmDialog
        isOpen={false}
        onClose={onClose}
        onConfirm={() => {}}
        title=""
        description=""
      />
    );
  }

  const typeMeta = CHANGE_REQUEST_TYPE_META[request.loaiDon];

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => onConfirm(request)}
      variant={variant}
      title={`Xác nhận hủy đơn ${request.maDon}`}
      description={`Bạn chuẩn bị hủy đơn "${typeMeta.label}" gửi ngày ${formatDateVi(
        request.ngayGui
      )}. Sau khi hủy, hồ sơ này sẽ chuyển sang trạng thái Đã hủy và bạn có thể lập đơn đề nghị mới.`}
      confirmLabel="Xác nhận hủy đơn"
      cancelLabel="Giữ nguyên đơn"
      requireAcknowledgement={true}
      acknowledgementLabel="Tôi xác nhận muốn hủy đơn đề nghị đang chờ xử lý này và hiểu thao tác không thể hoàn tác."
      isLoading={isLoading}
      error={error}
    />
  );
}

export default CancelRequestDialog;
