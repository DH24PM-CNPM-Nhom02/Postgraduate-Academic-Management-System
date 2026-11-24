import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthPageShell } from "@/src/components/auth/auth-page-shell";
import { PostgraduateContactDetails } from "@/src/components/shared/PostgraduateContactDetails";

export const metadata: Metadata = {
  title: "Liên hệ | Cổng Thông tin Đào tạo Sau Đại học",
  description: "Thông tin liên hệ Phòng Đào tạo Sau Đại học, Trường Đại học An Giang.",
};

export default function ContactPage() {
  return (
    <AuthPageShell contentPage>
      <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#164E9B] hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Quay về đăng nhập
        </Link>
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl">Liên hệ</h1>
          <h2 className="text-base font-semibold text-slate-800">Phòng Đào tạo Sau Đại học</h2>
          <p className="text-sm text-slate-600">Trường Đại học An Giang, Đại học Quốc gia TP. Hồ Chí Minh</p>
        </div>
        <div className="text-sm text-slate-600">
          <PostgraduateContactDetails />
        </div>
      </section>
    </AuthPageShell>
  );
}
