"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useMyNcsProfile } from "@/src/hooks/api/use-ncs";
import { ProfileLayout } from "./profile-layout";

export function StudentProfileContainer() {
  const profileQuery = useMyNcsProfile();

  if (profileQuery.isLoading) {
    return (
      <main className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" />
          Đang tải hồ sơ từ hệ thống...
        </div>
      </main>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div role="alert" className="mx-auto flex max-w-xl items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Không tải được hồ sơ cá nhân</p>
            <p className="mt-1">{profileQuery.error?.message ?? "Không tìm thấy hồ sơ NCS của tài khoản này."}</p>
            <button type="button" onClick={() => void profileQuery.refetch()} className="mt-3 rounded-md border border-current/30 px-3 py-1.5 font-medium hover:bg-destructive/10">
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileLayout initialData={profileQuery.data} />
    </main>
  );
}

export default StudentProfileContainer;
