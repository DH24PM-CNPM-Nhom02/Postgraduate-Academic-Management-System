"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { KeyRound, LoaderCircle, RefreshCw } from "lucide-react";
import { UserDialogError, userPrimaryButton } from "@/src/components/admin/users/user-dialog";
import { formatAdminDateTime } from "@/src/components/admin/users/user-meta";
import { UserRoleBadges } from "@/src/components/admin/users/user-table";
import { Button } from "@/src/components/ui/button";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { usePasswordRequests } from "@/src/hooks/api/use-password-requests";
import type { PasswordRequest, PasswordRequestStatus } from "@/src/types/api/password-request";
import { ApprovePasswordRequestDialog, RejectPasswordRequestDialog } from "./password-request-dialogs";

type StatusFilter = PasswordRequestStatus | "ALL";

const STATUS_META: Record<PasswordRequestStatus, { label: string; className: string }> = {
  CHO_XU_LY: { label: "Đang chờ", className: "border-amber-200 bg-amber-50 text-amber-800" },
  DA_XU_LY: { label: "Đã xử lý", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  TU_CHOI: { label: "Từ chối", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "CHO_XU_LY", label: STATUS_META.CHO_XU_LY.label },
  { value: "DA_XU_LY", label: STATUS_META.DA_XU_LY.label },
  { value: "TU_CHOI", label: STATUS_META.TU_CHOI.label },
  { value: "ALL", label: "Tất cả" },
];

const EMPTY_REQUESTS: PasswordRequest[] = [];

type RequestAction = {
  type: "approve" | "reject";
  request: PasswordRequest;
};

export function PasswordRequestsWorkspace() {
  const [status, setStatus] = useState<StatusFilter>("CHO_XU_LY");
  const [action, setAction] = useState<RequestAction | null>(null);
  const requestsQuery = usePasswordRequests(status === "ALL" ? undefined : status);

  const columns = useMemo<ColumnDef<PasswordRequest>[]>(() => [
    {
      accessorKey: "user.username",
      header: "Tên đăng nhập",
      cell: ({ row }) => <span className="font-mono font-semibold">{row.original.user.username}</span>,
    },
    { accessorKey: "user.fullName", header: "Họ và tên" },
    {
      id: "roles",
      header: "Vai trò",
      cell: ({ row }) => <UserRoleBadges roles={row.original.user.roles} />,
    },
    {
      accessorKey: "ghiChuLienHe",
      header: "Thông tin liên hệ",
      cell: ({ row }) => <span className="block max-w-56 wrap-anywhere">{row.original.ghiChuLienHe || "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian gửi",
      cell: ({ row }) => <span className="whitespace-nowrap tabular-nums">{formatAdminDateTime(row.original.createdAt)}</span>,
    },
    {
      accessorKey: "trangThai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const meta = STATUS_META[row.original.trangThai];
        return (
          <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.className}`}>
            {meta.label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Xử lý",
      cell: ({ row: { original: request } }) => (
        request.trangThai === "CHO_XU_LY" ? (
          <div className="flex gap-2">
            <Button size="sm" className={userPrimaryButton} onClick={() => setAction({ type: "approve", request })}>
              Duyệt
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAction({ type: "reject", request })}>
              Từ chối
            </Button>
          </div>
        ) : (
          <div className="max-w-52 space-y-1">
            <p className="whitespace-nowrap tabular-nums">{formatAdminDateTime(request.ngayXuLy)}</p>
            {request.trangThai === "TU_CHOI" && request.lyDoTuChoi && (
              <p className="wrap-anywhere text-xs text-slate-600">Lý do: {request.lyDoTuChoi}</p>
            )}
          </div>
        )
      ),
    },
  ], []);

  const table = useManagementDataTable({
    data: requestsQuery.data ?? EMPTY_REQUESTS,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">
        Yêu cầu cấp lại mật khẩu
      </h1>

      <section className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <label htmlFor="password-request-status" className="mb-1.5 block text-xs font-semibold text-slate-600">
              Trạng thái
            </label>
            <Select items={statusOptions} value={status} onValueChange={(value) => setStatus(value ?? "ALL")}>
              <SelectTrigger id="password-request-status" className="h-9 w-40 rounded-xl bg-slate-50/50 text-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {statusOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="outline" disabled={requestsQuery.isFetching} onClick={() => void requestsQuery.refetch()}>
            <RefreshCw aria-hidden="true" className={requestsQuery.isFetching ? "animate-spin" : undefined} />
            {requestsQuery.isError ? "Thử lại" : "Làm mới"}
          </Button>
        </div>

        {requestsQuery.isError ? (
          <UserDialogError message={`Không thể tải danh sách yêu cầu. ${requestsQuery.error.message}`} />
        ) : requestsQuery.isPending ? (
          <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm text-slate-500">
            <LoaderCircle className="size-4 animate-spin text-[#164E9B]" aria-hidden="true" />
            Đang tải danh sách yêu cầu…
          </div>
        ) : (
          <ManagementDataTable
            table={table}
            minWidth="min-w-[880px]"
            itemLabel="yêu cầu"
            emptyState={(
              <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                <KeyRound className="size-7 text-slate-400" aria-hidden="true" />
                Không có yêu cầu cấp lại mật khẩu.
              </div>
            )}
          />
        )}
      </section>

      {action?.type === "approve" && (
        <ApprovePasswordRequestDialog request={action.request} onClose={() => setAction(null)} />
      )}
      {action?.type === "reject" && (
        <RejectPasswordRequestDialog request={action.request} onClose={() => setAction(null)} />
      )}
    </div>
  );
}
