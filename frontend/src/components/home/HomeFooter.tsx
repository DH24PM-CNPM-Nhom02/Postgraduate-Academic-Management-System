import Link from "next/link";
import { HoverLogo } from "@/src/components/academic/HoverLogo";

export function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <HoverLogo sizeClass="size-8" />
          <div>
            <p className="font-bold text-slate-800">
              Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh
            </p>
            <p className="text-[11px] text-slate-400">
              Phòng Đào tạo Sau Đại học • Hệ thống Quản trị Học vụ Tiến sĩ AGU
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <Link href="/forms" className="hover:text-[#164E9B]">Biểu mẫu</Link>
          <span>•</span>
          <Link href="/regulations" className="hover:text-[#164E9B]">Quy định &amp; Quy chế</Link>
          <span>•</span>
          <Link href="/#faq" className="hover:text-[#164E9B]">Hỏi đáp</Link>
        </div>
      </div>
    </footer>
  );
}
