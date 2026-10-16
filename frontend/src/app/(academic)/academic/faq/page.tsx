"use client";

import React from "react";
import Link from "next/link";
import {
  HelpCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

export default function AcademicFaqPage() {
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
          <span className="font-semibold text-slate-700">Hỏi đáp &amp; Liên hệ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Hỏi đáp &amp; Hỗ trợ Kỹ thuật Cổng Giáo vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Giải đáp thắc mắc về phân quyền, duyệt minh chứng và xử lý nghiệp vụ học vụ sau đại học.
        </p>
      </div>

      {/* Main FAQ list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                Q: Giáo vụ có quyền phê duyệt thay cho GVHD không?
              </strong>
              <p className="text-slate-600 leading-relaxed">
                A: Theo quy trình thẩm định 2 cấp, minh chứng mốc cần có xác nhận chuyên môn của GVHD trước. Trong trường hợp đặc biệt (GVHD vắng mặt dài hạn hoặc có văn bản ủy quyền), Giáo vụ có thể kích hoạt chế độ phê duyệt đặc cách theo quyết định của Ban Đào tạo SĐH.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                Q: Hệ thống có tự động khóa khi phân công GVHD vượt quá định mức BR-09 không?
              </strong>
              <p className="text-slate-600 leading-relaxed">
                A: Có. Hệ thống tính toán định mức theo thời gian thực (Độc lập 1.0, Đồng HD 0.5) và sẽ hiển thị cảnh báo đỏ, khóa nút lưu nếu giảng viên đã đạt ngưỡng tối đa 3.0 (hoặc 4.0 với GS/PGS).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                Q: Làm sao để xuất danh sách NCS và điểm công bố khoa học?
              </strong>
              <p className="text-slate-600 leading-relaxed">
                A: Giáo vụ có thể tra cứu tại Tab Quản lý NCS, sử dụng bộ lọc theo khoa và xuất báo cáo tổng hợp phục vụ kỳ thi đua hoặc báo cáo số liệu Bộ GD&amp;ĐT.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support Sidebar */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="size-4 text-[#164E9B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Kênh liên hệ hỗ trợ
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 block">Phòng Quản lý Sau Đại học</span>
              <p className="text-slate-500 text-[11px]">Trường Đại học An Giang - ĐHQG-HCM</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="size-4 text-[#164E9B]" />
                <span>sdh@agu.edu.vn</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="size-4 text-[#164E9B]" />
                <span>0296 384 6520 (Ext: 112)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
