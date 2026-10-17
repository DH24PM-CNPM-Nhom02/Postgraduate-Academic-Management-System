'use client';

import { useState, useId } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
  Loader2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { MockAccount, updateMockPassword } from '@/src/lib/mock-accounts';

interface FirstLoginPasswordModalProps {
  isOpen: boolean;
  account: MockAccount | null;
  initialTempPassword?: string;
  onClose: () => void;
  onPasswordChanged: (newPassword: string, updatedAccount: MockAccount) => void;
}

export function FirstLoginPasswordModal({
  isOpen,
  account,
  initialTempPassword = '',
  onClose,
  onPasswordChanged,
}: FirstLoginPasswordModalProps) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [currentPassword, setCurrentPassword] = useState(initialTempPassword);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !account) return null;

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isDifferentFromOld = newPassword !== currentPassword && newPassword.length > 0;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    hasMinLength &&
    hasUpperAndLower &&
    hasNumberOrSpecial &&
    isDifferentFromOld &&
    passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentPassword !== account.tempPassword) {
      setErrorMessage('Mật khẩu cấp riêng hiện tại không chính xác.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    if (!isDifferentFromOld) {
      setErrorMessage('Mật khẩu mới không được trùng với mật khẩu cấp riêng cũ.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setIsSubmitting(true);

    // Giả lập độ trễ xử lý mật khẩu an toàn
    setTimeout(() => {
      const result = updateMockPassword(account.username, newPassword);
      setIsSubmitting(false);

      if (result.success && result.account) {
        setIsSuccess(true);
        onPasswordChanged(newPassword, result.account);
      } else {
        setErrorMessage(result.message);
      }
    }, 600);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#D0D5DD] bg-white p-5 sm:p-7 shadow-2xl transition-all duration-300">
        {/* Close Button */}
        {!isSuccess && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Đã đổi mật khẩu thành công
              </span>
              <h2 className="mt-2 text-xl font-bold text-[#172B4D]">
                Tài khoản đã được kích hoạt!
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475467] leading-relaxed">
                Mật khẩu mới của bạn đã được cập nhật thành công cho tài khoản{' '}
                <strong className="text-[#172B4D]">{account.username}</strong> ({account.fullName}).
                Từ bây giờ, bạn có thể đăng nhập bằng mật khẩu mới này.
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-[#EAF2FF]/50 p-3.5 text-left text-xs text-[#155EEF] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" /> Mẹo bảo mật:
              </p>
              <p className="text-[#475467]">
                Hãy ghi nhớ mật khẩu mới và tuyệt đối không chia sẻ cho người khác.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#155EEF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1248BC] transition-all cursor-pointer"
              >
                <span>Đăng nhập ngay với mật khẩu mới</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            {/* Modal Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#155EEF] ring-4 ring-[#F4F7FC]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                      Lần đầu đăng nhập
                    </span>
                  </div>
                  <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-[#172B4D] leading-tight">
                    Thiết lập mật khẩu mới
                  </h2>
                </div>
              </div>

              {/* Account details card */}
              <div className="mt-3.5 flex items-center justify-between rounded-xl border border-[#D0D5DD]/80 bg-[#F8FAFC] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#172B4D]">{account.fullName}</div>
                    <div className="text-[#667085] flex items-center gap-2">
                      <span>MSHV: <strong>{account.username}</strong></span>
                      <span>•</span>
                      <span>{account.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-xs text-amber-800 leading-relaxed">
                Tài khoản của bạn vừa đăng nhập bằng <strong>Mật khẩu cấp riêng</strong>. Để bảo mật thông tin học vụ và nghiên cứu, hệ thống yêu cầu bạn đổi sang mật khẩu cá nhân.
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3.5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Change Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Mật khẩu cấp riêng hiện tại */}
              <div className="space-y-1">
                <label
                  htmlFor={currentPasswordId}
                  className="block text-xs font-semibold text-[#172B4D]"
                >
                  Mật khẩu cấp riêng (hiện tại) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#667085]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id={currentPasswordId}
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white py-2 pl-9 pr-10 text-xs sm:text-sm text-[#172B4D] focus:border-[#155EEF] focus:outline-none focus:ring-4 focus:ring-[#EAF2FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1">
                <label
                  htmlFor={newPasswordId}
                  className="block text-xs font-semibold text-[#172B4D]"
                >
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#667085]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id={newPasswordId}
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự..."
                    required
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white py-2 pl-9 pr-10 text-xs sm:text-sm text-[#172B4D] focus:border-[#155EEF] focus:outline-none focus:ring-4 focus:ring-[#EAF2FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1">
                <label
                  htmlFor={confirmPasswordId}
                  className="block text-xs font-semibold text-[#172B4D]"
                >
                  Xác nhận lại mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#667085]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    required
                    className="w-full rounded-lg border border-[#D0D5DD] bg-white py-2 pl-9 pr-10 text-xs sm:text-sm text-[#172B4D] focus:border-[#155EEF] focus:outline-none focus:ring-4 focus:ring-[#EAF2FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Security requirements checklist */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-2.5 text-[11px] space-y-1">
                <span className="font-semibold text-gray-700 block">Quy tắc đặt mật khẩu:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-gray-600">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`h-3 w-3 ${hasMinLength ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <span>Ít nhất 8 ký tự</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperAndLower ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`h-3 w-3 ${hasUpperAndLower ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <span>Chữ hoa & chữ thường</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumberOrSpecial ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`h-3 w-3 ${hasNumberOrSpecial ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <span>Chứa số hoặc ký tự đặc biệt</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-600 font-medium' : ''}`}>
                    <CheckCircle2 className={`h-3 w-3 ${passwordsMatch ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <span>Khớp mật khẩu xác nhận</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#475467] hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#155EEF] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1248BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Xác nhận đổi mật khẩu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
