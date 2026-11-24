import type { ReactNode } from "react";
import Image from "next/image";
import truongDHAGImg from "@/public/image/TruongDHAG.webp";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md lg:max-w-4xl xl:max-w-[940px] rounded-2xl border border-[#D0D5DD] bg-white shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_16px_28px_-6px_rgba(16,24,40,0.08)] overflow-hidden transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[490px] lg:min-h-[520px]">
        <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8 lg:col-span-7">
          {children}
        </div>

        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#155EEF] to-[#0A2E80] p-7 text-white select-none">
          <Image
            src={truongDHAGImg}
            alt="Trường Đại học An Giang - ĐHQG TP.HCM"
            fill
            priority
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30]/95 via-[#0B1A30]/35 to-black/20 pointer-events-none" />

          <div className="relative z-10 space-y-2.5 top-80">
            <div>
              <h2 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
                Trường Đại Học An Giang
              </h2>
              <p className="mt-1 text-xs font-medium text-blue-100 tracking-wide">
                Đại học Quốc gia TP. Hồ Chí Minh
              </p>
            </div>
            <p className="text-xs text-white/85 leading-relaxed font-normal">
              Cổng thông tin tích hợp quản lý đề tài nghiên cứu, học phần và tiến độ bảo vệ luận văn, luận án cho học viên cao học & nghiên cứu sinh.
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/20 text-[11px] text-white/80 font-medium">
              <span>• Thạc sĩ</span>
              <span>• Tiến sĩ</span>
              <span>• Nghiên cứu chuyên sâu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
