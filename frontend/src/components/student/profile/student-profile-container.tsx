"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useMyNcsProfile } from "@/src/hooks/api/use-ncs";
import { ProfileLayout } from "./profile-layout";
import type { StudentProfileData } from "./general-info-form";

function formatDate(value: string | null | undefined): string {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chưa cập nhật"
    : new Intl.DateTimeFormat("vi-VN").format(date);
}

const STATUS_LABELS: Record<string, string> = {
  DANG_HOC: "Đang học",
  DA_TOT_NGHIEP: "Đã tốt nghiệp",
  BAO_LUU: "Bảo lưu",
  NGUNG_HOC: "Ngừng học",
  BUOC_THOI_HOC: "Buộc thôi học",
};

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

  const data = profileQuery.data;
  const initialData: StudentProfileData = {
    mshv: data.mshv,
    email: data.email ?? "",
    lop: data.lop ?? "Chưa cập nhật",
    chuyenNganh: data.nganh?.tenNganh ?? "Chưa cập nhật",
    khoaHoc: data.khoaHocNcs?.maKhoaHoc ?? data.khoaHoc ?? "Chưa cập nhật",
    ngayNhapHoc: formatDate(data.ngayNhapHoc),
    trangThai: STATUS_LABELS[data.trangThai] ?? data.trangThai,
    readOnly: data.trangThai === "DA_TOT_NGHIEP",
    hoTen: data.hoTen,
    soDienThoai: data.soDienThoai ?? "",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileLayout initialData={initialData} />
    </main>
  );
}

export default StudentProfileContainer;
