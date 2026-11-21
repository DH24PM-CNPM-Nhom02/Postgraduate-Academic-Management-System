"use client";

import React, { useState } from "react";
import { useUpdateMyNcsProfile } from "@/src/hooks/api/use-ncs";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react";

export interface StudentProfileData {
  mshv: string;
  email: string;
  lop: string;
  chuyenNganh: string;
  khoaHoc: string;
  ngayNhapHoc: string;
  trangThai: string;
  hoTen: string;
  soDienThoai: string;
  readOnly?: boolean;
}

interface GeneralInfoFormProps {
  initialData: StudentProfileData;
}

export function GeneralInfoForm({ initialData }: GeneralInfoFormProps) {
  const profile = initialData;
  const updateProfile = useUpdateMyNcsProfile();

  // Editable fields state
  const [hoTen, setHoTen] = useState(profile.hoTen);
  const [soDienThoai, setSoDienThoai] = useState(profile.soDienThoai);
  // Status state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "NCS";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.readOnly) return;
    setErrorMessage(null);

    // Validation
    if (!hoTen.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (soDienThoai && !/^[0-9+ \-.]{9,15}$/.test(soDienThoai.trim())) {
      setErrorMessage("Số điện thoại liên hệ không hợp lệ.");
      return;
    }

    const payload = {
      ...(hoTen.trim() !== profile.hoTen ? { hoTen: hoTen.trim() } : {}),
      ...(soDienThoai.trim() !== profile.soDienThoai ? { soDienThoai: soDienThoai.trim() } : {}),
    };
    if (Object.keys(payload).length === 0) {
      setErrorMessage("Thông tin chưa có thay đổi.");
      return;
    }

    try {
      await updateProfile.mutateAsync(payload);
      setHoTen(hoTen.trim());
      setSoDienThoai(soDienThoai.trim());
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể lưu thông tin cá nhân.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 dark:border-emerald-900/60 dark:bg-emerald-950/80 dark:text-emerald-200"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm font-medium">
            Thông tin cá nhân đã được lưu thành công trên hệ thống đào tạo!
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-rose-800 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 dark:border-rose-900/60 dark:bg-rose-950/80 dark:text-rose-200"
        >
          <AlertCircle className="size-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Card 1: Avatar & Identity Overview (Tuyệt đối KHÔNG có upload/đổi ảnh) */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar display only: Initials & Academic Badge */}
          <div className="relative flex shrink-0 flex-col items-center">
            <div
              className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-2xl font-bold tracking-wider text-white shadow-md ring-4 ring-blue-50 dark:ring-blue-950 select-none"
              aria-label="Ảnh đại diện mặc định theo hồ sơ"
            >
              {getInitials(hoTen)}
            </div>
            {/* Note badge strictly explaining readonly avatar */}
            <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Lock className="size-3" />
              Ảnh hồ sơ cố định
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-foreground">{hoTen}</h2>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {profile.mshv}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Nghiên cứu sinh</p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3.5 text-blue-600" />
                {profile.chuyenNganh}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="size-3.5 text-blue-600" />
                {profile.lop}
              </span>
              <span>•</span>
              <span>{profile.khoaHoc}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5 text-blue-600" />
                Nhập học: {profile.ngayNhapHoc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Read-only Academic Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Thông tin học vụ (Chỉ đọc)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Các trường do Phòng Quản lý Đào tạo Sau Đại học xác thực và quản lý.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50 px-2.5 py-1 rounded-md">
              <Lock className="size-3.5 text-amber-600" />
              Được bảo vệ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* MSHV */}
            <div className="space-y-1.5">
              <label
                htmlFor="mshv"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Mã số học viên (MSHV)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="size-4" />
                </div>
                <input
                  id="mshv"
                  type="text"
                  value={profile.mshv}
                  disabled
                  readOnly
                  aria-readonly="true"
                  className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-9 text-sm font-semibold text-foreground/80 cursor-not-allowed select-all"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60">
                  <Lock className="size-3.5" />
                </div>
              </div>
            </div>

            {/* Email trường */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Email liên hệ
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={profile.email || "Chưa cập nhật"}
                  disabled
                  readOnly
                  aria-readonly="true"
                  className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-9 text-sm font-semibold text-foreground/80 cursor-not-allowed select-all"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60">
                  <Lock className="size-3.5" />
                </div>
              </div>
            </div>

            {/* Lớp sinh hoạt */}
            <div className="space-y-1.5">
              <label
                htmlFor="lop"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Lớp sinh hoạt đào tạo
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <input
                  id="lop"
                  type="text"
                  value={profile.lop}
                  disabled
                  readOnly
                  aria-readonly="true"
                  className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-9 text-sm font-semibold text-foreground/80 cursor-not-allowed"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60">
                  <Lock className="size-3.5" />
                </div>
              </div>
            </div>

            {/* Chuyên ngành đào tạo */}
            <div className="space-y-1.5">
              <label
                htmlFor="chuyenNganh"
                className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                Chuyên ngành đào tạo
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <BookOpen className="size-4" />
                </div>
                <input
                  id="chuyenNganh"
                  type="text"
                  value={profile.chuyenNganh}
                  disabled
                  readOnly
                  aria-readonly="true"
                  className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-9 text-sm font-semibold text-foreground/80 cursor-not-allowed"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/60">
                  <Lock className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Editable Personal Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="mb-4 border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Thông tin cá nhân và liên hệ
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile.readOnly ? "Hồ sơ đã tốt nghiệp ở chế độ chỉ đọc." : "Cập nhật họ tên và số điện thoại liên hệ của bạn."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Họ và tên */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                htmlFor="hoTen"
                className="block text-xs font-semibold text-foreground"
              >
                Họ và tên nghiên cứu sinh {!profile.readOnly && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="size-4" />
                </div>
                <input
                  id="hoTen"
                  type="text"
                  readOnly={profile.readOnly}
                  required={!profile.readOnly}
                  value={profile.readOnly ? profile.hoTen : hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground hover:border-blue-400 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label
                htmlFor="soDienThoai"
                className="block text-xs font-semibold text-foreground"
              >
                Số điện thoại liên hệ {!profile.readOnly && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Phone className="size-4" />
                </div>
                <input
                  id="soDienThoai"
                  type="tel"
                  readOnly={profile.readOnly}
                  required={!profile.readOnly}
                  value={profile.readOnly ? profile.soDienThoai : soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground hover:border-blue-400 focus-visible:outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20"
                />
              </div>
            </div>

          </div>

          {/* Action Button: Save Changes */}
          {!profile.readOnly && <div className="mt-8 flex items-center justify-end border-t border-border pt-4">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang lưu thay đổi...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>}
        </div>
      </form>
    </div>
  );
}
