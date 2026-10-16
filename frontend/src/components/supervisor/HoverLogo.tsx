"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo1 from "@/image/logo 1.png";
import logo2 from "@/image/logo 2.png";

export interface HoverLogoProps {
  sizeClass?: string;
  className?: string;
  forceHovered?: boolean;
}

/**
 * HoverLogo component:
 * - Displays logo 1 (Cổng thông tin Sau Đại học) by default
 * - Smoothly transitions to logo 2 (Đại học An Giang) on mouse hover, matching the login page
 */
export function HoverLogo({
  sizeClass = "size-9",
  className = "",
  forceHovered,
}: HoverLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = forceHovered !== undefined ? forceHovered : isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`logo-swap-box relative cursor-pointer select-none transition-transform duration-300 hover:scale-105 shrink-0 ${sizeClass} ${className}`}
      title="Trường Đại học An Giang - ĐHQG TP.HCM (Trỏ chuột để chuyển đổi logo)"
    >
      <style>{`
        .logo-swap-box:hover .img-logo-1,
        .header-brand-link:hover .img-logo-1,
        .group:hover .img-logo-1 {
          opacity: 0 !important;
          transform: scale(0.85) rotate(6deg) !important;
        }
        .logo-swap-box:hover .img-logo-2,
        .header-brand-link:hover .img-logo-2,
        .group:hover .img-logo-2 {
          opacity: 1 !important;
          transform: scale(1) rotate(0deg) !important;
        }
      `}</style>

      {/* Logo 1: Default state */}
      <Image
        src={logo1}
        alt="Logo Cổng Thông Tin Sau Đại Học"
        fill
        sizes="64px"
        priority
        className="img-logo-1 object-contain pointer-events-none"
        style={{
          opacity: active ? 0 : 1,
          transform: active ? "scale(0.85) rotate(6deg)" : "scale(1) rotate(0deg)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Logo 2: Hover state */}
      <Image
        src={logo2}
        alt="Logo Trường Đại Học An Giang"
        fill
        sizes="64px"
        priority
        className="img-logo-2 object-contain pointer-events-none"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1) rotate(0deg)" : "scale(0.85) rotate(-6deg)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

export default HoverLogo;
