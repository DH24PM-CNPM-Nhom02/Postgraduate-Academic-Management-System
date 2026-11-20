'use client';

import { useEffect, useId, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { authService } from '@/src/services/auth';

interface FirstLoginPasswordModalProps {
  isOpen: boolean;
  username: string;
  fullName: string;
  email?: string;
  initialCurrentPassword?: string;
  onPasswordChanged: () => void;
}

export function FirstLoginPasswordModal({
  isOpen,
  username,
  fullName,
  email,
  initialCurrentPassword = '',
  onPasswordChanged,
}: FirstLoginPasswordModalProps) {
  const { data: session } = useSession();
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();
  const [currentPassword, setCurrentPassword] = useState(initialCurrentPassword);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword(initialCurrentPassword);
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
  }, [initialCurrentPassword, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!session?.access_token) {
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword({ oldPassword: currentPassword, newPassword }, session.access_token);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="first-login-title">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {success ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
            <h2 id="first-login-title" className="text-xl font-semibold">Đổi mật khẩu thành công</h2>
            <p className="text-sm text-muted-foreground">Mật khẩu của tài khoản {username} đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.</p>
            <button type="button" onClick={onPasswordChanged} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Đăng nhập lại</button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start gap-3">
              <KeyRound className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <h2 id="first-login-title" className="text-lg font-semibold">Thiết lập mật khẩu mới</h2>
                <p className="mt-1 text-sm text-muted-foreground">Lần đăng nhập đầu tiên của {fullName || username}{email ? ` (${email})` : ''}. Hãy đổi mật khẩu để tiếp tục.</p>
              </div>
            </div>
            {error && <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" />{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {([
                { id: currentId, label: 'Mật khẩu hiện tại', value: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), auto: 'current-password' },
                { id: newId, label: 'Mật khẩu mới', value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew), auto: 'new-password' },
                { id: confirmId, label: 'Xác nhận mật khẩu mới', value: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), auto: 'new-password' },
              ] as const).map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label htmlFor={field.id} className="text-sm font-medium">{field.label}</label>
                  <div className="relative">
                    <input id={field.id} type={field.show ? 'text' : 'password'} autoComplete={field.auto} value={field.value} onChange={(event) => field.set(event.target.value)} required minLength={field.id === newId ? 8 : undefined} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                    <button type="button" onClick={field.toggle} aria-label={field.show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="absolute inset-y-0 right-0 px-3 text-muted-foreground">{field.show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Mật khẩu mới cần ít nhất 8 ký tự.</p>
              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {isSubmitting ? <><Loader2 className="size-4 animate-spin" />Đang cập nhật...</> : <><ShieldCheck className="size-4" />Đổi mật khẩu</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
