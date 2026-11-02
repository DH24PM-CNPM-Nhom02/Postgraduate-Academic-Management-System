"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  User,
  Shield,
  Sparkles,
  Info,
} from "lucide-react";
import { GeneralInfoForm, StudentProfileData } from "./general-info-form";
import { SecurityForm } from "./security-form";

interface ProfileLayoutProps {
  initialData?: Partial<StudentProfileData>;
}

type TabType = "general" | "security";

function ProfileLayoutContent({ initialData }: ProfileLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Derived state directly from searchParams (Single source of truth)
  const activeTab: TabType = searchParams.get("tab") === "security" ? "security" : "general";

  const handleTabChange = (newTab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "security") {
      params.set("tab", "security");
    } else {
      params.delete("tab");
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Page Header (To, rõ ràng kèm dòng mô tả phụ chuẩn yêu cầu) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hồ sơ nghiên cứu sinh
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
              <Sparkles className="size-3 text-blue-600" />
              NCS AGU
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
          <span>Tài khoản đang hoạt động bình thường</span>
        </div>
      </div>

      {/* Main Grid: 2 columns (Left Navigation / Right Form Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Navigation Tabs & Guidelines Card (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Tabs Navigation Card */}
          <div className="rounded-2xl border border-border bg-card p-2 shadow-xs">
            <nav className="flex flex-col space-y-1" aria-label="Tabs điều hướng hồ sơ">
              {/* Tab 1: Thông tin cá nhân */}
              <button
                type="button"
                onClick={() => handleTabChange("general")}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 text-left ${
                  activeTab === "general"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    activeTab === "general"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <User className="size-4.5" />
                </div>
                <div className="flex-1">
                  <div className="leading-tight">Thông tin cá nhân</div>
                  <div
                    className={`text-[11px] font-normal mt-0.5 ${
                      activeTab === "general" ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    Hồ sơ NCS & thông tin liên hệ
                  </div>
                </div>
              </button>

              {/* Tab 2: Bảo mật & Đổi mật khẩu */}
              <button
                type="button"
                onClick={() => handleTabChange("security")}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 text-left ${
                  activeTab === "security"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    activeTab === "security"
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Shield className="size-4.5" />
                </div>
                <div className="flex-1">
                  <div className="leading-tight">Bảo mật tài khoản</div>
                  <div
                    className={`text-[11px] font-normal mt-0.5 ${
                      activeTab === "security" ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    Đổi mật khẩu & xác thực
                  </div>
                </div>
              </button>
            </nav>
          </div>

          {/* Guidelines / Important Note Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4.5 text-xs text-blue-900 shadow-2xs dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-4 text-blue-600 shrink-0 dark:text-blue-400" />
              <span>Quy chế hồ sơ NCS</span>
            </div>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Theo quy chế Sau Đại học, các trường thông tin học vị (MSHV, Lớp, Chuyên ngành đào tạo) được khóa cố định theo quyết định công nhận nghiên cứu sinh.
            </p>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Mọi yêu cầu điều chỉnh thông tin học tịch xin vui lòng liên hệ trực tiếp{" "}
              <strong className="text-foreground">Phòng Quản lý Đào tạo Sau Đại học (sdh@agu.edu.vn)</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Form Content (lg:col-span-8) */}
        <div className="lg:col-span-8">
          {activeTab === "general" ? (
            <GeneralInfoForm initialData={initialData} />
          ) : (
            <SecurityForm />
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileLayout(props: ProfileLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-64 rounded-lg bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-48 rounded-2xl bg-muted" />
            <div className="lg:col-span-8 h-96 rounded-2xl bg-muted" />
          </div>
        </div>
      }
    >
      <ProfileLayoutContent {...props} />
    </Suspense>
  );
}
