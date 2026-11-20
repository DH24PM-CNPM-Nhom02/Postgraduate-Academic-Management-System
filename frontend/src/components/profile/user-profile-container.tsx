"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, ArrowLeft, BriefcaseBusiness, GraduationCap, KeyRound, Loader2, UserRound } from "lucide-react";
import Link from "next/link";
import { authService, type UserProfileResponse } from "@/src/services/auth";
import { useMyNcsProfile } from "@/src/hooks/api/use-ncs";
import { useMySupervisorProfile } from "@/src/hooks/use-academic";
import { GeneralInfoForm, type StudentProfileData } from "@/src/components/student/profile/general-info-form";
import { SecurityForm } from "@/src/components/student/profile/security-form";

const ROLE_LABELS: Record<string, string> = {
  NCS: "Nghiên cứu sinh",
  GVHD: "Giảng viên hướng dẫn",
  GIAO_VU: "Cán bộ quản lý giáo vụ",
  ADMIN: "Quản trị hệ thống",
};

function unwrapProfile(response: Awaited<ReturnType<typeof authService.getMe>>): UserProfileResponse {
  return "data" in response ? response.data : response;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa cập nhật" : new Intl.DateTimeFormat("vi-VN").format(date);
}

const NCS_STATUS: Record<string, string> = {
  DANG_HOC: "Đang học",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
};

export function UserProfileContainer() {
  const { data: session, status } = useSession();
  const profileQuery = useQuery({
    queryKey: ["auth", "me", session?.user?.id],
    queryFn: async () => {
      if (!session?.access_token) throw new Error("Phiên đăng nhập đã hết hạn.");
      return unwrapProfile(await authService.getMe(session.access_token));
    },
    enabled: Boolean(session?.access_token),
    staleTime: 60_000,
  });
  const role = session?.user?.role ?? "";
  const ncsQuery = useMyNcsProfile({ enabled: role === "NCS" });
  const supervisorQuery = useMySupervisorProfile({ enabled: role === "GVHD" });

  useEffect(() => {
    if (!profileQuery.isSuccess) return;
    const targetId = window.location.hash.slice(1);
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [profileQuery.isSuccess]);

  if (status === "loading" || profileQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl py-6">
        <Link href="/" className="mb-8 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground hover:bg-muted">
          <ArrowLeft className="size-4" />Quay về hệ thống
        </Link>
        <p className="flex justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Đang tải hồ sơ từ hệ thống...</p>
      </div>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
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
  let ncsData: StudentProfileData | undefined;
  if (role === "NCS" && ncsQuery.data) {
    const data = ncsQuery.data;
    ncsData = {
      mshv: data.mshv,
      email: data.email ?? user.email ?? "",
      lop: data.lop ?? "Chưa cập nhật",
      chuyenNganh: data.nganh?.tenNganh ?? "Chưa cập nhật",
      khoaHoc: data.khoaHocNcs?.maKhoaHoc ?? data.khoaHoc ?? "Chưa cập nhật",
      ngayNhapHoc: formatDate(data.ngayNhapHoc),
      trangThai: NCS_STATUS[data.trangThai] ?? data.trangThai,
      hoTen: data.hoTen || user.fullName,
      soDienThoai: data.soDienThoai ?? "",
    };
  }

  const isRoleProfileAvailable = role === "NCS" || role === "GVHD";

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
            <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <div><dt className="text-xs font-medium text-muted-foreground">Tên đăng nhập</dt><dd className="mt-1 text-sm text-foreground">{user.username}</dd></div>
              {user.email && <div><dt className="text-xs font-medium text-muted-foreground">Email</dt><dd className="mt-1 text-sm text-foreground">{user.email}</dd></div>}
              <div><dt className="text-xs font-medium text-muted-foreground">Vai trò</dt><dd className="mt-1 text-sm text-foreground">{(user.roles ?? [role]).map((item) => ROLE_LABELS[item] ?? item).join(", ")}</dd></div>
            </dl>
          </section>

          {role === "NCS" && (
            <section id="role-profile" className="scroll-mt-20 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Thông tin nghiên cứu sinh</h2>
              {ncsQuery.isLoading ? <p className="text-sm text-muted-foreground">Đang tải thông tin nghiên cứu sinh...</p> : ncsData ? <GeneralInfoForm initialData={ncsData} /> : <p role="alert" className="text-sm text-destructive">{ncsQuery.error instanceof Error ? ncsQuery.error.message : "Không tải được thông tin nghiên cứu sinh."}</p>}
            </section>
          )}

          {role === "GVHD" && (
            <section id="role-profile" className="scroll-mt-20 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Thông tin giảng viên hướng dẫn</h2>
              {supervisorQuery.isLoading ? <p className="mt-4 text-sm text-muted-foreground">Đang tải thông tin giảng viên...</p> : supervisorQuery.data ? <dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Mã giảng viên</dt><dd className="mt-1 text-sm">{supervisorQuery.data.maCanBo}</dd></div><div><dt className="text-xs text-muted-foreground">Đơn vị</dt><dd className="mt-1 text-sm">{supervisorQuery.data.donVi}</dd></div><div><dt className="text-xs text-muted-foreground">Chuyên môn</dt><dd className="mt-1 text-sm">{supervisorQuery.data.chuyenMon}</dd></div><div><dt className="text-xs text-muted-foreground">Học hàm, học vị</dt><dd className="mt-1 text-sm">{supervisorQuery.data.hocHamHocVi}</dd></div></dl> : <p role="alert" className="mt-4 text-sm text-destructive">{supervisorQuery.error instanceof Error ? supervisorQuery.error.message : "Không tải được thông tin giảng viên."}</p>}
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
