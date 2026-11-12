"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, UserPlus, X } from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { mockAdminUsers, mockUserStatsSummary } from "@/src/mocks/admin";
import type {
  AdminUserStatus,
  CreateUserFormValues,
  SystemRole,
  UserStatsSummary,
} from "@/src/types/ui/admin";
import { type AdminUserViewItem, generateStrongPassword } from "./user-meta";
import { UserStatsOverview } from "./user-stats";
import { UserFilters } from "./user-filters";
import { UserTable } from "./user-table";
import { type BulkImportUserDraft, CreateUserModal } from "./create-user-modal";
import { UserStatusConfirmDialog } from "./user-status-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UserDetailDialog } from "./user-detail-dialog";

export function UsersWorkspace() {
  const { user: authUser } = useAuth();

  // Danh sách người dùng khởi tạo từ mock data
  const [users, setUsers] = useState<AdminUserViewItem[]>(() =>
    mockAdminUsers.map((item) => ({
      ...item,
      mustChangePassword: item.lastLoginAt === null,
    }))
  );

  // Bộ lọc & phân trang
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<SystemRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "ALL">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals & Dialogs state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<AdminUserViewItem | null>(null);
  const [statusTargetUser, setStatusTargetUser] =
    useState<AdminUserViewItem | null>(null);
  const [resetTargetUser, setResetTargetUser] =
    useState<AdminUserViewItem | null>(null);

  // Phản hồi thao tác trực tiếp trên UI
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Xác định ID tài khoản đang đăng nhập để áp dụng Self-lock Prevention
  const currentUserId = useMemo(() => {
    const matched = authUser?.username
      ? users.find(
          (item) =>
            item.username.toLowerCase() === authUser.username.toLowerCase()
        )
      : undefined;
    return matched?.id ?? mockAdminUsers[0]?.id ?? "usr-admin-01";
  }, [authUser?.username, users]);

  // Tính lại thống kê động khi state users thay đổi (khớp cấu trúc mockUserStatsSummary)
  const statsSummary = useMemo<UserStatsSummary>(() => {
    if (users.length === mockAdminUsers.length && feedbackMessage === null) {
      return mockUserStatsSummary;
    }
    return {
      totalUsers: users.length,
      activeUsers: users.filter((item) => item.status === "ACTIVE").length,
      lockedUsers: users.filter((item) => item.status === "LOCKED").length,
      byRole: {
        ADMIN: users.filter((item) => item.role === "ADMIN").length,
        GIAO_VU: users.filter((item) => item.role === "GIAO_VU").length,
        GVHD: users.filter((item) => item.role === "GVHD").length,
        NCS: users.filter((item) => item.role === "NCS").length,
      },
    };
  }, [users, feedbackMessage]);

  // Danh sách đã lọc theo từ khóa, vai trò và trạng thái
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((item) => {
      if (roleFilter !== "ALL" && item.role !== roleFilter) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!query) return true;

      return (
        item.username.toLowerCase().includes(query) ||
        item.fullName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        (item.studentCode?.toLowerCase().includes(query) ?? false) ||
        (item.department?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Cắt trang dữ liệu
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safePage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  const handleCreateSingle = (
    values: CreateUserFormValues & { mustChangePassword: boolean }
  ) => {
    const newUser: AdminUserViewItem = {
      id: `usr-${Date.now()}`,
      username: values.username,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      role: values.role,
      status: "ACTIVE",
      department: values.department,
      academicTitle: values.academicTitle,
      studentCode: values.studentCode,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      mustChangePassword: values.mustChangePassword,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCreateModalOpen(false);
    setCurrentPage(1);
    setFeedbackMessage(
      `Đã tạo thành công tài khoản @${newUser.username} (${newUser.fullName}).`
    );
  };

  const handleImportBatch = (
    drafts: BulkImportUserDraft[],
    fileName: string
  ) => {
    const existingSet = new Set(
      users.map((item) => item.username.toLowerCase())
    );
    const createdAt = new Date().toISOString();

    const newUsers: AdminUserViewItem[] = drafts
      .filter((draft) => !existingSet.has(draft.username.toLowerCase()))
      .map((draft, idx) => ({
        id: `usr-batch-${Date.now()}-${idx}`,
        username: draft.username,
        fullName: draft.fullName,
        email: draft.email,
        role: "NCS",
        status: "ACTIVE",
        department: draft.department,
        studentCode: draft.studentCode,
        createdAt,
        lastLoginAt: null,
        mustChangePassword: true,
      }));

    if (newUsers.length > 0) {
      setUsers((prev) => [...newUsers, ...prev]);
    }
    setCreateModalOpen(false);
    setCurrentPage(1);
    setFeedbackMessage(
      `Đã nhập ${newUsers.length} tài khoản tân NCS từ tệp "${fileName}" (bắt buộc đổi mật khẩu lần đầu).`
    );
  };

  const handleConfirmStatusChange = (
    target: AdminUserViewItem,
    reason?: string
  ) => {
    if (target.id === currentUserId && target.status === "ACTIVE") {
      return;
    }

    const nextStatus: AdminUserStatus =
      target.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

    setUsers((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? {
              ...item,
              status: nextStatus,
              lockedReason:
                nextStatus === "LOCKED"
                  ? reason || "Khóa bởi Quản trị viên hệ thống"
                  : null,
            }
          : item
      )
    );

    setStatusTargetUser(null);
    setFeedbackMessage(
      nextStatus === "LOCKED"
        ? `Đã khóa tài khoản @${target.username}.`
        : `Đã mở khóa tài khoản @${target.username}.`
    );
  };

  const handleConfirmResetPassword = (target: AdminUserViewItem): string => {
    const tempPassword = generateStrongPassword(12);
    setUsers((prev) =>
      prev.map((item) =>
        item.id === target.id ? { ...item, mustChangePassword: true } : item
      )
    );
    setFeedbackMessage(
      `Đã đặt lại mật khẩu tạm thời cho @${target.username} và bật cờ đổi mật khẩu lần đầu.`
    );
    return tempPassword;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản lý người dùng &amp; Phân quyền
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cấp phát tài khoản, phân vai trò RBAC, đặt lại mật khẩu và kiểm soát
            trạng thái truy cập hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          <span>Tạo tài khoản mới</span>
        </button>
      </div>

      {/* Feedback Notification */}
      {feedbackMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            aria-label="Đóng thông báo"
            className="rounded p-1 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 4 Stats Cards */}
      <UserStatsOverview
        stats={statsSummary}
        activeRoleFilter={roleFilter}
        activeStatusFilter={statusFilter}
        onQuickFilter={(filter) => {
          if (filter.role !== undefined) setRoleFilter(filter.role);
          if (filter.status !== undefined) setStatusFilter(filter.status);
          setCurrentPage(1);
        }}
      />

      {/* Filter Bar */}
      <UserFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        onRoleChange={(value) => {
          setRoleFilter(value);
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        totalCount={users.length}
        filteredCount={filteredUsers.length}
      />

      {/* Users Table */}
      <UserTable
        users={paginatedUsers}
        currentUserId={currentUserId}
        onToggleStatus={(target) => setStatusTargetUser(target)}
        onResetPassword={(target) => setResetTargetUser(target)}
        onViewDetail={(target) => setDetailUser(target)}
        onResetFilters={handleResetFilters}
        currentPage={safePage}
        pageSize={pageSize}
        totalItems={filteredUsers.length}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* Modals & Dialogs */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSingle={handleCreateSingle}
        onImportBatch={handleImportBatch}
        existingUsernames={users.map((item) => item.username)}
      />

      <UserStatusConfirmDialog
        user={statusTargetUser}
        isOpen={Boolean(statusTargetUser)}
        onClose={() => setStatusTargetUser(null)}
        onConfirm={handleConfirmStatusChange}
      />

      <ResetPasswordDialog
        user={resetTargetUser}
        isOpen={Boolean(resetTargetUser)}
        onClose={() => setResetTargetUser(null)}
        onConfirmReset={handleConfirmResetPassword}
      />

      <UserDetailDialog
        user={detailUser}
        isOpen={Boolean(detailUser)}
        onClose={() => setDetailUser(null)}
      />
    </div>
  );
}

export default UsersWorkspace;
