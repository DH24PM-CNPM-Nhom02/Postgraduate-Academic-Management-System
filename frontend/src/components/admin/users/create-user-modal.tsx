"use client";

import { useEffect, useId, useState } from "react";
import {
  AlertCircle,
  Plus,
  Trash2,
  UserPlus,
  X,
  Shield,
  Info,
} from "lucide-react";
import type {
  CreateUserAccountPayload,
  CreateUserFormValues,
  SystemRole,
} from "@/src/types/ui/admin";
import { SYSTEM_ROLE_META } from "./user-meta";

/**
 * Kiểu dữ liệu tương thích ngược cho các import cũ (nếu có)
 */
export interface BulkImportUserDraft {
  username: string;
  fullName: string;
  email: string;
  studentCode: string;
  department: string;
  role: "NCS";
  mustChangePassword: true;
}

export interface CreateUserAccountDraft {
  id: string;
  username: string;
  fullName: string;
  role: SystemRole;
  email: string;
}

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUsers?: (users: CreateUserAccountPayload[]) => void | Promise<void>;
  onCreateSingle?: (
    values: CreateUserFormValues & { mustChangePassword: boolean }
  ) => void | Promise<void>;
  onImportBatch?: (
    users: BulkImportUserDraft[],
    fileName: string
  ) => void | Promise<void>;
  existingUsernames?: string[];
  isSubmitting?: boolean;
}

const createDefaultDraft = (index = 1): CreateUserAccountDraft => ({
  id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${index}`,
  username: "",
  fullName: "",
  role: "NCS",
  email: "",
});

export function CreateUserModal({
  isOpen,
  onClose,
  onCreateUsers,
  onCreateSingle,
  existingUsernames = [],
  isSubmitting = false,
}: CreateUserModalProps) {
  const titleId = useId();

  // Danh sách tài khoản đang soạn thảo (Mặc định 1 tài khoản ban đầu)
  const [accounts, setAccounts] = useState<CreateUserAccountDraft[]>(() => [
    createDefaultDraft(1),
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const resetForm = () => {
    setAccounts([createDefaultDraft(1)]);
    setFormError(null);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleAddAccountRow = () => {
    setAccounts((prev) => [
      ...prev,
      createDefaultDraft(prev.length + 1),
    ]);
  };

  const handleRemoveAccountRow = (id: string) => {
    if (accounts.length <= 1) return;
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const handleUpdateField = (
    id: string,
    field: keyof CreateUserAccountDraft,
    value: string
  ) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== id) return acc;
        return {
          ...acc,
          [field]: field === "username" ? value.trim().toLowerCase() : value,
        };
      })
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. Kiểm tra validation từng tài khoản
    const seenUsernames = new Set<string>();
    const seenEmails = new Set<string>();
    const sanitizedPayload: CreateUserAccountPayload[] = [];

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      const rowNum = i + 1;
      const cleanUsername = acc.username.trim().toLowerCase();
      const cleanFullName = acc.fullName.trim();
      const cleanEmail = acc.email.trim();

      // Username validation
      if (!cleanUsername) {
        setFormError(`Tài khoản #${rowNum}: Vui lòng nhập Tên đăng nhập (Username).`);
        return;
      }
      if (cleanUsername.length < 3) {
        setFormError(
          `Tài khoản #${rowNum}: Tên đăng nhập "${cleanUsername}" phải có tối thiểu 3 ký tự.`
        );
        return;
      }
      if (!/^[a-z0-9._-]+$/.test(cleanUsername)) {
        setFormError(
          `Tài khoản #${rowNum}: Tên đăng nhập chỉ được chứa chữ thường, số, dấu chấm, gạch dưới hoặc gạch nối.`
        );
        return;
      }
      if (seenUsernames.has(cleanUsername)) {
        setFormError(
          `Tên đăng nhập "@${cleanUsername}" bị nhập trùng ở nhiều dòng trong danh sách tạo.`
        );
        return;
      }
      seenUsernames.add(cleanUsername);

      if (
        existingUsernames.some(
          (u) => u.toLowerCase() === cleanUsername.toLowerCase()
        )
      ) {
        setFormError(
          `Tài khoản #${rowNum}: Tên đăng nhập "@${cleanUsername}" đã tồn tại trên hệ thống.`
        );
        return;
      }

      // FullName validation
      if (!cleanFullName) {
        setFormError(`Tài khoản #${rowNum}: Vui lòng nhập Họ và tên người dùng.`);
        return;
      }
      if (cleanFullName.length < 2) {
        setFormError(`Tài khoản #${rowNum}: Họ và tên quá ngắn.`);
        return;
      }

      // Email validation
      if (!cleanEmail) {
        setFormError(`Tài khoản #${rowNum}: Vui lòng nhập địa chỉ Email.`);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setFormError(
          `Tài khoản #${rowNum}: Địa chỉ email "${cleanEmail}" không hợp lệ.`
        );
        return;
      }
      if (seenEmails.has(cleanEmail.toLowerCase())) {
        setFormError(
          `Địa chỉ email "${cleanEmail}" bị nhập trùng ở nhiều dòng trong danh sách tạo.`
        );
        return;
      }
      seenEmails.add(cleanEmail.toLowerCase());

      sanitizedPayload.push({
        username: cleanUsername,
        fullName: cleanFullName,
        role: acc.role,
        email: cleanEmail,
      });
    }

    setFormError(null);

    // 2. Gọi hàm callback tạo tài khoản
    if (onCreateUsers) {
      await onCreateUsers(sanitizedPayload);
    } else if (onCreateSingle) {
      for (const item of sanitizedPayload) {
        await onCreateSingle({
          ...item,
          mustChangePassword: true,
        });
      }
    }

    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id={titleId} className="text-base font-bold text-foreground">
              Cấp tài khoản người dùng mới
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cấp phát tài khoản người dùng mới theo vai trò hệ thống (có thể thêm cùng lúc nhiều tài khoản).
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại tạo tài khoản"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Body */}
        <form
          id="create-users-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {/* Error Alert */}
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Notice */}
          <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-2 text-xs text-blue-800">
            <Info className="size-4 text-blue-600 shrink-0" />
            <span>
              Mỗi tài khoản gồm 4 trường thông tin chuẩn hóa: <strong>Tên đăng nhập</strong>, <strong>Họ tên</strong>, <strong>Vai trò</strong> và <strong>Email</strong>.
            </span>
          </div>

          {/* Account Rows List */}
          <div className="space-y-4">
            {accounts.map((acc, index) => {
              const rowNumber = index + 1;
              return (
                <div
                  key={acc.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all duration-150 hover:border-slate-300 focus-within:border-blue-300 focus-within:bg-white"
                >
                  {/* Row Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF2FF] px-2 py-0.5 text-xs font-bold text-[#164E9B]">
                        <Shield className="size-3 text-[#164E9B]" />
                        <span>Tài khoản #{rowNumber}</span>
                      </span>
                      {acc.username && (
                        <span className="font-mono text-xs text-slate-500">
                          @{acc.username}
                        </span>
                      )}
                    </div>

                    {accounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccountRow(acc.id)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Xóa dòng tài khoản này"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="text-[11px]">Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* 4 Form Fields */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Username */}
                    <div>
                      <label
                        htmlFor={`acc-username-${acc.id}`}
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Tên đăng nhập <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`acc-username-${acc.id}`}
                        type="text"
                        required
                        value={acc.username}
                        onChange={(e) =>
                          handleUpdateField(acc.id, "username", e.target.value)
                        }
                        placeholder="vd: admin1"
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 font-mono text-xs text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* 2. Full Name */}
                    <div>
                      <label
                        htmlFor={`acc-fullname-${acc.id}`}
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`acc-fullname-${acc.id}`}
                        type="text"
                        required
                        value={acc.fullName}
                        onChange={(e) =>
                          handleUpdateField(acc.id, "fullName", e.target.value)
                        }
                        placeholder="vd: Nguyễn Văn A"
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* 3. Role */}
                    <div>
                      <label
                        htmlFor={`acc-role-${acc.id}`}
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Vai trò hệ thống <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id={`acc-role-${acc.id}`}
                        value={acc.role}
                        onChange={(e) =>
                          handleUpdateField(
                            acc.id,
                            "role",
                            e.target.value as SystemRole
                          )
                        }
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {(Object.keys(SYSTEM_ROLE_META) as SystemRole[]).map(
                          (rKey) => (
                            <option key={rKey} value={rKey}>
                              {SYSTEM_ROLE_META[rKey].label} ({rKey})
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* 4. Email */}
                    <div>
                      <label
                        htmlFor={`acc-email-${acc.id}`}
                        className="mb-1 block text-xs font-semibold text-slate-700"
                      >
                        Email công vụ / học viên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id={`acc-email-${acc.id}`}
                        type="email"
                        required
                        value={acc.email}
                        onChange={(e) =>
                          handleUpdateField(acc.id, "email", e.target.value)
                        }
                        placeholder="vd: admin1@agu.edu.vn"
                        disabled={isSubmitting}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Row Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddAccountRow}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 px-3.5 py-2 text-xs font-semibold text-[#164E9B] hover:bg-blue-100/70 hover:border-blue-500 transition-colors"
            >
              <Plus className="size-3.5" />
              <span>+ Thêm tài khoản khác</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-slate-50/80 px-6 py-3.5">
          <div className="text-xs text-slate-500">
            Tổng cộng:{" "}
            <span className="font-bold text-slate-800">
              {accounts.length} tài khoản
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-45"
            >
              Hủy
            </button>

            <button
              type="submit"
              form="create-users-form"
              disabled={isSubmitting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
            >
              <UserPlus className="size-3.5" aria-hidden="true" />
              <span>
                {isSubmitting
                  ? "Đang tạo..."
                  : accounts.length > 1
                  ? `Tạo ${accounts.length} tài khoản`
                  : "Tạo tài khoản"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;
