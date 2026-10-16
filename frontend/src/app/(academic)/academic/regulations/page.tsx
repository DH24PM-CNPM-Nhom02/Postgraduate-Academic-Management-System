"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";

export default function AcademicRegulationsPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
            <ArrowLeft className="size-3" />
            <span>Tổng quan học vụ</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Quy chế &amp; Quy định</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Văn bản Quy chế &amp; Hướng dẫn Học vụ SĐH
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Cơ sở pháp lý quản lý quá trình đào tạo tiến sĩ tại Trường Đại học An Giang - ĐHQG-HCM.
        </p>
      </div>

      {/* Regulations List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="size-4 text-[#164E9B]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Các văn bản quy định hiện hành
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#164E9B] text-sm">
                1. Quy chế Định mức Hướng dẫn NCS (Quy tắc BR-09 ĐHQG-HCM)
              </h3>
              <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">
                Hiệu lực hiện hành
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Quy định về tải trọng giảng viên hướng dẫn: Hướng dẫn chính / độc lập tính 1.0 NCS; Đồng hướng dẫn tính 0.5 NCS. Một giảng viên không nhận hướng dẫn quá 3.0 NCS tại cùng một thời điểm. Đối với Giáo sư, Phó Giáo sư có chủ trì đề tài cấp Bộ trở lên, trần hạn ngạch tối đa không quá 4.0 NCS.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#164E9B] text-sm">
                2. Chuẩn đầu ra Công bố Khoa học (WoS/Scopus ≥ 2.0 điểm)
              </h3>
              <span className="rounded bg-blue-100 text-[#164E9B] font-bold px-2 py-0.5 text-[10px]">
                Quy định mốc 8
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Nghiên cứu sinh trước khi đăng ký bảo vệ cấp Trường phải tích lũy tối thiểu 2.0 điểm bài báo khoa học. Bài báo thuộc danh mục Scopus Q1 tính 1.5 - 2.0 điểm; Q2 tính 1.0 - 1.25 điểm; Q3 tính 0.75 điểm. Nghiên cứu sinh phải là tác giả chính (First Author hoặc Corresponding Author) đứng tên cơ sở đào tạo là Trường Đại học An Giang - ĐHQG-HCM.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#164E9B] text-sm">
                3. Thời hạn Đào tạo &amp; Gia hạn (Tối đa 72 tháng)
              </h3>
              <span className="rounded bg-amber-100 text-amber-800 font-bold px-2 py-0.5 text-[10px]">
                Kiểm soát thời hạn
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Thời gian đào tạo chuẩn là 36 - 48 tháng. NCS được phép gia hạn tối đa 24 tháng theo từng đợt 6 hoặc 12 tháng, nhưng tổng thời gian học tập không được vượt quá 72 tháng kể từ ngày ký quyết định công nhận nghiên cứu sinh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
