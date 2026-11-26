import Link from "next/link";
import { HoverLogo } from "@/src/components/academic/HoverLogo";
import { PostgraduateContactDetails } from "@/src/components/shared/PostgraduateContactDetails";

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-xs text-slate-600">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: University Identity (col-span-5) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-3">
              <HoverLogo sizeClass="size-11" />
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-[#0F2744]">
                  Trường Đại học An Giang
                </p>
                <p className="text-xs font-bold text-[#164E9B]">
                  ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 max-w-md">
              Cổng Thông tin &amp; Quản trị Đào tạo Sau Đại học là nền tảng quản trị học vụ chuyên sâu phục vụ quản lý tiến độ nghiên cứu, xét duyệt minh chứng chuyên môn và giám sát định mức hướng dẫn khoa học.
            </p>
          </div>

          {/* Column 2: Quick Links (col-span-3) */}
          <div className="space-y-3 lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#training-process" className="transition-colors hover:text-[#164E9B]">
                  Quy trình đào tạo
                </Link>
              </li>
              <li>
                <Link href="/forms" className="transition-colors hover:text-[#164E9B]">
                  Biểu mẫu học vụ
                </Link>
              </li>
              <li>
                <Link href="/regulations" className="transition-colors hover:text-[#164E9B]">
                  Quy định &amp; Quy chế
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition-colors hover:text-[#164E9B]">
                  Hỏi đáp &amp; Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[#164E9B]">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/login" className="font-semibold text-[#164E9B] hover:underline">
                  Đăng nhập tài khoản hệ thống →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Office (col-span-4) */}
          <div className="space-y-3 lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Phòng Đào tạo Sau Đại học
            </h3>
            <PostgraduateContactDetails />
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {currentYear} Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.agu.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#164E9B] transition-colors"
            >
              Cổng thông tin AGU
            </a>
            <span>•</span>
            <a
              href="https://vnuhcm.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#164E9B] transition-colors"
            >
              Đại học Quốc gia TP.HCM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
