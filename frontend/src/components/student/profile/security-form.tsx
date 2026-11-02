"use client";

import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle eye visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors & touched states
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: "Yếu", color: "bg-rose-500", textColor: "text-rose-600" };
    if (score <= 3) return { score: 2, text: "Trung bình", color: "bg-amber-500", textColor: "text-amber-600" };
    return { score: 3, text: "Mạnh & An toàn", color: "bg-emerald-500", textColor: "text-emerald-600" };
  };

  const strength = getPasswordStrength(newPassword);

  const validate = () => {
    let valid = true;

    // Current password
    if (!currentPassword) {
      setCurrentPasswordError("Vui lòng nhập mật khẩu hiện tại.");
      valid = false;
    } else {
      setCurrentPasswordError(null);
    }

    // New password
    if (!newPassword) {
      setNewPasswordError("Vui lòng nhập mật khẩu mới.");
      valid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Độ dài mật khẩu mới phải từ 8 ký tự trở lên.");
      valid = false;
    } else if (newPassword === currentPassword) {
      setNewPasswordError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      valid = false;
    } else {
      setNewPasswordError(null);
    }

    // Confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Vui lòng xác nhận lại mật khẩu mới.");
      valid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Mật khẩu mới không khớp. Vui lòng kiểm tra lại.");
      valid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setSuccessMessage("Đã cập nhật mật khẩu mới thành công! Vui lòng ghi nhớ mật khẩu này.");

    // Reset inputs
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    // Auto dismiss success toast after 4s
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 dark:border-emerald-900/60 dark:bg-emerald-950/80 dark:text-emerald-200"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Security Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        {/* Card Header */}
        <div className="flex items-start gap-4 border-b border-border pb-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
            <KeyRound className="size-5.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Đổi mật khẩu tài khoản
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Để bảo vệ an toàn thông tin cá nhân và tài liệu nghiên cứu học thuật, khuyến nghị đặt mật khẩu có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số.
            </p>
          </div>
        </div>

        {/* Security Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* 1. Mật khẩu hiện tại */}
          <div className="space-y-1.5">
            <label
              htmlFor="currentPassword"
              className="block text-xs font-semibold text-foreground"
            >
              Mật khẩu hiện tại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="size-4" />
              </div>
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (currentPasswordError) setCurrentPasswordError(null);
                }}
                placeholder="Nhập mật khẩu đang sử dụng"
                className={`w-full rounded-xl border bg-background py-2.5 pl-9 pr-10 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground hover:border-blue-400 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 ${
                  currentPasswordError
                    ? "border-rose-400 focus-visible:border-rose-600 focus-visible:ring-rose-600/20"
                    : "border-input"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {currentPasswordError && (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-150 dark:text-rose-400"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{currentPasswordError}</span>
              </p>
            )}
          </div>

          {/* 2. Mật khẩu mới */}
          <div className="space-y-1.5">
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold text-foreground"
            >
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="size-4" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (newPasswordError) setNewPasswordError(null);
                  if (confirmPassword && e.target.value !== confirmPassword) {
                    setConfirmPasswordError("Mật khẩu mới không khớp. Vui lòng kiểm tra lại.");
                  } else if (confirmPassword && e.target.value === confirmPassword) {
                    setConfirmPasswordError(null);
                  }
                }}
                placeholder="Tối thiểu 8 ký tự (chữ hoa, chữ thường, số)"
                className={`w-full rounded-xl border bg-background py-2.5 pl-9 pr-10 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground hover:border-blue-400 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 ${
                  newPasswordError
                    ? "border-rose-400 focus-visible:border-rose-600 focus-visible:ring-rose-600/20"
                    : "border-input"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {/* Password strength meter */}
            {newPassword.length > 0 && (
              <div className="pt-1 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Độ mạnh mật khẩu:</span>
                  <span className={`font-semibold ${strength.textColor}`}>
                    {strength.text}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div
                    className={`rounded-full transition-colors duration-200 ${
                      strength.score >= 1 ? strength.color : "bg-muted"
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors duration-200 ${
                      strength.score >= 2 ? strength.color : "bg-muted"
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors duration-200 ${
                      strength.score >= 3 ? strength.color : "bg-muted"
                    }`}
                  />
                </div>
              </div>
            )}

            {newPasswordError && (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-150 dark:text-rose-400"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{newPasswordError}</span>
              </p>
            )}
          </div>

          {/* 3. Xác nhận mật khẩu mới */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-foreground"
            >
              Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <ShieldCheck className="size-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (newPassword && e.target.value !== newPassword) {
                    setConfirmPasswordError("Mật khẩu mới không khớp. Vui lòng kiểm tra lại.");
                  } else {
                    setConfirmPasswordError(null);
                  }
                }}
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full rounded-xl border bg-background py-2.5 pl-9 pr-10 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground hover:border-blue-400 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 ${
                  confirmPasswordError
                    ? "border-rose-400 focus-visible:border-rose-600 focus-visible:ring-rose-600/20"
                    : "border-input"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-150 dark:text-rose-400"
              >
                <ShieldAlert className="size-3.5 shrink-0" />
                <span>{confirmPasswordError}</span>
              </p>
            )}
          </div>

          {/* Action Button: Update Password */}
          <div className="mt-8 flex items-center justify-end border-t border-border pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang cập nhật mật khẩu...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Cập nhật mật khẩu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
