"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, ArrowLeft, BriefcaseBusiness, GraduationCap, KeyRound, Loader2, UserRound } from "lucide-react";
import Link from "next/link";
import { useAccountProfile, useUpdateAccountProfile } from "@/src/hooks/api/use-account-profile";
import { useMyNcsProfile } from "@/src/hooks/api/use-ncs";
import { useMySupervisorProfileDetails, useUpdateMySupervisorProfile } from "@/src/hooks/use-academic";
import { formatDegreeLabel, type BackendGvhdRaw } from "@/src/services/gvhd";
import { GeneralInfoForm } from "@/src/components/student/profile/general-info-form";
import { SecurityForm } from "@/src/components/student/profile/security-form";
import { EditableProfileFields } from "./editable-profile-fields";
import { formatProfileDate, formatProfileGender, ProfileDetails } from "./profile-details";

const ROLE_LABELS: Record<string, string> = {
  NCS: "Nghiên cứu sinh",
  GVHD: "Giảng viên hướng dẫn",
  GIAO_VU: "Cán bộ quản lý giáo vụ",
  ADMIN: "Quản trị hệ thống",
};

function SupervisorProfile({ profile }: { profile: BackendGvhdRaw }) {
  const updateProfile = useUpdateMySupervisorProfile();
  const status = typeof profile.trangThai === "boolean"
    ? profile.trangThai ? "Đang hoạt động" : "Ngừng hoạt động"
    : null;

  return (
    <>
      <ProfileDetails items={[
        { label: "Họ và tên", value: profile.hoTen },
        { label: "Mã giảng viên", value: profile.maGv },
        { label: "Ngày sinh", value: formatProfileDate(profile.ngaySinh) },
        { label: "Giới tính", value: formatProfileGender(profile.gioiTinh) },
        { label: "Học hàm, học vị", value: profile.hocHamHocVi && formatDegreeLabel(profile.hocHamHocVi) },
        { label: "Chuyên ngành đào tạo tiến sĩ", value: profile.chuyenNganh },
        { label: "Quốc gia tốt nghiệp", value: profile.quocGiaTotNghiep },
        { label: "Đơn vị công tác", value: profile.donVi?.ten },
        { label: "Đơn vị cấp trên", value: profile.donVi?.parent?.ten },
        { label: "Trạng thái hồ sơ", value: status },
        { label: "Định mức hướng dẫn đã sử dụng", value: profile.soNcsDangHuongDan },
        { label: "Định mức hướng dẫn tối đa", value: profile.maxNcsChoPhep },
      ]} />
      <div className="mt-5 border-t border-border pt-5">
        <EditableProfileFields
          key={profile.id}
          variant="contact"
          values={profile}
          onSave={updateProfile.mutateAsync}
        />
      </div>
    </>
  );
}

export function UserProfileContainer() {
  const { data: session, status } = useSession();
  const profileQuery = useAccountProfile(session?.user?.id, session?.access_token);
  const updateAccount = useUpdateAccountProfile();
  const role = session?.user?.role ?? "";
  const ncsQuery = useMyNcsProfile({ enabled: role === "NCS" && Boolean(session?.access_token) });
  const supervisorQuery = useMySupervisorProfileDetails(role === "GVHD" && Boolean(session?.access_token));

  useEffect(() => {
    if (!profileQuery.isSuccess) return;
    const targetId = window.location.hash.slice(1);
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [profileQuery.isSuccess]);

  if ((status === "loading" && !session) || profileQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl py-6">
        <Link href="/" className="mb-8 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-muted">
          <ArrowLeft className="size-4" />Quay về hệ thống
        </Link>
        <p className="flex justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Đang tải hồ sơ từ hệ thống...</p>
      </div>
    );
  }

  if (!session?.access_token || !profileQuery.data) {
    return (
      <div className="mx-auto w-full max-w-7xl py-6">
        <Link href="/" className="mb-8 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-muted">
          <ArrowLeft className="size-4" />Quay về hệ thống
        </Link>
        <div role="alert" className="mx-auto flex max-w-xl items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold">Không tải được hồ sơ tài khoản</p>
            <p className="mt-1">{profileQuery.error instanceof Error ? profileQuery.error.message : "Vui lòng thử lại."}</p>
            <button type="button" onClick={() => void profileQuery.refetch()} className="mt-3 rounded-md border border-current/30 px-3 py-1.5 font-medium">Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  const user = profileQuery.data;
  const initials = user.fullName.trim().split(/\s+/).map((part) => part[0]).slice(-2).join("").toUpperCase();
  const isRoleProfileAvailable = role === "NCS" || role === "GVHD";
  const canEditAccount = role === "ADMIN" || role === "GIAO_VU";
  const accountItems = [
    { label: "Tên đăng nhập", value: user.username },
    { label: "Vai trò", value: (user.roles ?? [role]).map((item) => ROLE_LABELS[item] ?? item).join(", ") },
  ];
  if (!canEditAccount) accountItems.push({ label: "Email tài khoản", value: user.email ?? "" });

  return (
    <div className="mx-auto w-full max-w-7xl py-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Hồ sơ cá nhân</h1>
          <p className="mt-1 text-sm text-muted-foreground">Thông tin tài khoản và cài đặt bảo mật.</p>
        </div>
        <Link href="/" className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:self-auto">
          <ArrowLeft className="size-4" />
          Quay về hệ thống
        </Link>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20">
          <nav aria-label="Điều hướng hồ sơ" className="rounded-xl border border-border bg-card p-2 shadow-xs">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Danh mục hồ sơ</p>
            <a href="#account" className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <UserRound className="size-4 text-[#164E9B]" />Thông tin tài khoản
            </a>
            {isRoleProfileAvailable && (
              <a href="#role-profile" className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                {role === "NCS" ? <GraduationCap className="size-4 text-[#164E9B]" /> : <BriefcaseBusiness className="size-4 text-[#164E9B]" />}
                Thông tin {role === "NCS" ? "nghiên cứu sinh" : "giảng viên"}
              </a>
            )}
            <a href="#security" className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <KeyRound className="size-4 text-[#164E9B]" />Đổi mật khẩu &amp; bảo mật
            </a>
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <section id="account" className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#164E9B] text-lg font-semibold text-white">{initials || <UserRound className="size-6" />}</div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-foreground">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">{ROLE_LABELS[role] ?? role}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <ProfileDetails items={accountItems} />
            </div>
            {canEditAccount && (
              <div className="mt-5 border-t border-border pt-5">
                <EditableProfileFields
                  key={user.id}
                  variant="account"
                  values={user}
                  onSave={updateAccount.mutateAsync}
                />
              </div>
            )}
          </section>

          {role === "NCS" && (
            <section id="role-profile" className="scroll-mt-20 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Thông tin nghiên cứu sinh</h2>
              {ncsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải thông tin nghiên cứu sinh...</p>
              ) : ncsQuery.data ? (
                <GeneralInfoForm initialData={ncsQuery.data} />
              ) : (
                <p role="alert" className="text-sm text-destructive">{ncsQuery.error?.message ?? "Không tải được thông tin nghiên cứu sinh."}</p>
              )}
            </section>
          )}

          {role === "GVHD" && (
            <section id="role-profile" className="scroll-mt-20 space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Thông tin giảng viên hướng dẫn</h2>
              {supervisorQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải thông tin giảng viên...</p>
              ) : supervisorQuery.data ? (
                <SupervisorProfile profile={supervisorQuery.data} />
              ) : (
                <p role="alert" className="text-sm text-destructive">{supervisorQuery.error?.message ?? "Không tải được thông tin giảng viên."}</p>
              )}
            </section>
          )}

          <section id="security" className="scroll-mt-20">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Đổi mật khẩu &amp; bảo mật</h2>
            <SecurityForm />
          </section>
        </div>
      </div>
    </div>
  );
}
