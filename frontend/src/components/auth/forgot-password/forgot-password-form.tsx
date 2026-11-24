"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { AuthCard } from "@/src/components/auth/auth-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { parseApiError } from "@/src/lib/api";
import { TOO_MANY_REQUESTS_MESSAGE } from "@/src/lib/api/error";
import { authService, type ForgotPasswordResponse } from "@/src/services/auth";

const CONTACT_MAX_LENGTH = 100;
const fieldClass = "h-10 rounded-lg border-[#D0D5DD] bg-white text-[#172B4D] focus-visible:border-[#155EEF] focus-visible:ring-[#EAF2FF]";

export function ForgotPasswordForm() {
  const [result, setResult] = useState<ForgotPasswordResponse | null>(null);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const ghiChuLienHe = String(formData.get("ghiChuLienHe") ?? "").trim();
    setError("");
    if (!username) {
      setUsernameError("Vui lòng nhập tên đăng nhập.");
      return;
    }
    if (ghiChuLienHe.length > CONTACT_MAX_LENGTH) {
      setError("Thông tin liên hệ tối đa 100 ký tự.");
      return;
    }

    setIsSubmitting(true);
    try {
      setResult(await authService.forgotPassword({ username, ghiChuLienHe: ghiChuLienHe || undefined }));
    } catch (cause) {
      const apiError = parseApiError(cause);
      setError(apiError.status === 429 ? TOO_MANY_REQUESTS_MESSAGE : apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <div className="space-y-4">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#172B4D] sm:text-[30px] lg:text-[32px]">
          Quên mật khẩu
        </h1>

        {result ? (
          <div role="status" className="space-y-3">
            <p className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {result.message}
            </p>
            <p className="text-sm text-[#475467]">
              Hãy liên hệ Giáo vụ (nếu bạn là Giáo vụ thì liên hệ Admin) để được xác minh và cấp lại mật khẩu.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#475467]">Nhập tên đăng nhập để gửi yêu cầu cấp lại mật khẩu.</p>
            {error && (
              <p role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1">
                <label htmlFor="forgot-username" className="text-sm font-semibold text-[#172B4D]">
                  Tên đăng nhập <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <Input
                  id="forgot-username"
                  name="username"
                  autoComplete="username"
                  placeholder="Nhập tên đăng nhập"
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={usernameError ? "forgot-username-error" : undefined}
                  onChange={() => setUsernameError("")}
                  className={fieldClass}
                />
                {usernameError && <p id="forgot-username-error" role="alert" className="text-xs text-red-600">{usernameError}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="forgot-contact" className="text-sm font-semibold text-[#172B4D]">
                  Thông tin liên hệ (không bắt buộc)
                </label>
                <Input
                  id="forgot-contact"
                  name="ghiChuLienHe"
                  placeholder="Số điện thoại hoặc Zalo"
                  maxLength={CONTACT_MAX_LENGTH}
                  disabled={isSubmitting}
                  className={fieldClass}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-lg bg-[#155EEF] font-semibold text-white hover:bg-[#1248BC]">
                {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                {isSubmitting ? "Đang gửi yêu cầu…" : "Gửi yêu cầu"}
              </Button>
            </form>
          </>
        )}

        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#155EEF] hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Quay lại đăng nhập
        </Link>
      </div>
    </AuthCard>
  );
}
