"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { StaticImageData } from "next/image";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import slide1Img from "../../../public/image/trang chu/20231207181531_6571a9539de80.jpg";
import slide2Img from "../../../public/image/trang chu/3-9735.jpg";
import slide3Img from "../../../public/image/trang chu/20251228131639_6950cb47f070e.jpg";
import slide4Img from "../../../public/image/trang chu/banner-1 (1).jpg";

interface HeroSlide {
  id: string;
  image: StaticImageData;
  title: string;
  caption: string;
  highlight: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: slide1Img,
    title: "Toàn cảnh Trường Đại học An Giang – ĐHQG-HCM",
    caption:
      "Khuôn viên trung tâm, khu giảng đường và thư viện hiện đại phục vụ đào tạo & nghiên cứu Sau Đại học.",
    highlight: "Khuôn viên AGU",
  },
  {
    id: "slide-2",
    image: slide2Img,
    title: "Không gian Học thuật & Khuôn viên Xanh AGU",
    caption:
      "Môi trường học tập năng động, cảnh quan xanh mát đồng hành cùng học viên cao học và nghiên cứu sinh.",
    highlight: "Không gian Xanh",
  },
  {
    id: "slide-3",
    image: slide3Img,
    title: "Lễ Khai giảng Đào tạo Sau Đại học",
    caption:
      "Lãnh đạo Nhà trường, đội ngũ giảng viên hướng dẫn cùng tân học viên và nghiên cứu sinh.",
    highlight: "Khai giảng SĐH",
  },
  {
    id: "slide-4",
    image: slide4Img,
    title: "Tuyển sinh Sau Đại học Trình độ Thạc sĩ & Tiến sĩ 2026",
    caption:
      "Đào tạo 13 chuyên ngành Thạc sĩ và chuyên ngành Tiến sĩ Khoa học Cây trồng chuẩn ĐHQG-HCM.",
    highlight: "Tuyển sinh 2026",
  },
];

export function HomeHero() {
  const { data: session } = useSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const role = session?.user?.role;
  const portalHref =
    role === "NCS"
      ? "/student/progress"
      : role === "GVHD"
      ? "/supervisor"
      : role === "GIAO_VU"
      ? "/academic"
      : role === "ADMIN"
      ? "/admin"
      : "/login";

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleGoTo = (index: number) => {
    setCurrentSlide(index);
  };

  const handleScrollTo = (targetId: string) => {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-1">
      {/* Khung bao ngoài Hero Banner Carousel */}
      <div
        className="relative overflow-hidden rounded-3xl bg-slate-900 min-h-[480px] md:min-h-[540px] shadow-xl border border-slate-800"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-label="Trình chiếu hình ảnh hoạt động đào tạo Sau Đại học"
      >
        {/* Lớp 1 — Hình ảnh Slide (z-0): relative static import bundled bởi Next.js */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-700 ease-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image.src}
                alt={slide.title}
                className={`absolute inset-0 z-0 h-full w-full object-cover object-center block transition-opacity duration-700 ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}

        {/* Lớp 2 — Lớp phủ Gradient (z-10): tối nhẹ bên trái, bên phải mở sáng trong suốt */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent"
          aria-hidden="true"
        />

        {/* Lớp 3 — Nội dung chữ & Nút điều khiển (z-20) */}
        <div className="relative z-20 flex h-full min-h-[480px] md:min-h-[540px] flex-col justify-between p-6 sm:p-10 lg:p-12 text-white">
          {/* Top Bar: Huy hiệu năm học & Bộ đếm slide */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              <span>Học kỳ I • Năm học 2026 – 2027</span>
              <span className="text-white/30">|</span>
              <span className="font-bold text-white">ĐHQG-HCM</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-xs font-bold text-white/90 backdrop-blur-md">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>
          </div>

          {/* Middle Body: Headline & CTAs */}
          <div className="my-auto max-w-2xl py-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                Trường Đại học An Giang – ĐHQG-HCM
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
                Cổng Thông tin Đào tạo Sau Đại học
              </h1>
            </div>

            <p className="max-w-xl text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-normal">
              Nền tảng quản trị học vụ số hóa toàn diện tiến trình đào tạo Tiến sĩ và Thạc sĩ.
              Theo dõi 9 mốc nghiên cứu chuẩn hóa, xét duyệt minh chứng chuyên môn và giám sát
              định mức hướng dẫn khoa học.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={portalHref}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition-all hover:bg-amber-300 active:scale-98"
              >
                <span>{session ? "Vào Cổng Học Vụ" : "Đăng nhập hệ thống"}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => handleScrollTo("#documents")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 cursor-pointer"
              >
                <Search className="size-4 text-white/80" aria-hidden="true" />
                <span>Tra cứu biểu mẫu &amp; quy chế</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar: Caption Pill & Slide Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            {/* Bên trái — Thẻ chú thích ảnh tinh tế (Glassmorphic Caption Pill) */}
            <div className="max-w-xl rounded-2xl bg-slate-950/65 backdrop-blur-md border border-white/15 px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 font-semibold text-white text-sm">
                <Camera className="size-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{HERO_SLIDES[currentSlide].title}</span>
              </div>
              <p className="text-xs text-slate-200/90 mt-0.5 leading-relaxed line-clamp-2">
                {HERO_SLIDES[currentSlide].caption}
              </p>
            </div>

            {/* Bên phải — Bộ điều hướng Slide */}
            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Danh sách slide">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === currentSlide}
                    aria-label={`Chuyển tới ảnh ${idx + 1}: ${slide.title}`}
                    onClick={() => handleGoTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? "w-6 bg-amber-400"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Ảnh trước"
                  className="flex size-8.5 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 cursor-pointer"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Ảnh tiếp theo"
                  className="flex size-8.5 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 cursor-pointer"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
