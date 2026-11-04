"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export interface FaqContactViewProps {
  roleContext?: "academic" | "supervisor" | "student" | "public";
  backHref?: string;
  backLabel?: string;
}

export const FAQ_ITEMS = [
  {
    category: "Phân quyền & Duyệt minh chứng",
    question: "Giáo vụ có quyền phê duyệt thay cho GVHD không?",
    answer:
      "Theo quy trình thẩm định 2 cấp, minh chứng mốc cần có xác nhận chuyên môn của GVHD trước. Trong trường hợp đặc biệt (GVHD vắng mặt dài hạn hoặc có văn bản ủy quyền công tác), Giáo vụ có thể kích hoạt chế độ phê duyệt đặc cách theo quyết định của Ban Đào tạo Sau Đại học.",
  },
  {
    category: "Định mức hướng dẫn BR-09",
    question: "Hệ thống có tự động khóa khi phân công GVHD vượt quá định mức BR-09 không?",
    answer:
      "Có. Hệ thống tính toán định mức theo thời gian thực (Độc lập tính 1.0, Đồng hướng dẫn tính 0.5) và sẽ hiển thị cảnh báo đỏ, khóa nút lưu nếu giảng viên đã đạt ngưỡng tối đa 3.0 NCS (hoặc 4.0 với GS/PGS chủ trì đề tài cấp Bộ).",
  },
  {
    category: "Tiến độ & 9 mốc đào tạo",
    question: "Nghiên cứu sinh có thể nộp minh chứng Mốc tiếp theo khi Mốc trước chưa được duyệt không?",
    answer:
      "Không. Luồng 9 mốc đào tạo tiến sĩ yêu cầu hoàn thành tuần tự theo logic nghiệp vụ đào tạo. Một số mốc đặc thù như Mốc 2, Mốc 4, Mốc 5 bắt buộc phải có Phiếu nhận xét và điểm đánh giá của Hội đồng chuyên môn mới được xem là hoàn tất.",
  },
  {
    category: "Chuẩn đầu ra bài báo khoa học",
    question: "Điểm bài báo khoa học được tính thế nào đối với đồng tác giả?",
    answer:
      "Theo quy chế BR-08, bài báo thuộc danh mục WoS/Scopus được tính điểm tối đa khi NCS là tác giả chính (First Author) hoặc tác giả liên hệ (Corresponding Author). Nếu có đồng tác giả là NCS khác trong cùng đề tài, điểm được chia tỷ lệ theo biên bản thỏa thuận quyền tác giả được Đơn vị chuyên môn xác nhận.",
  },
  {
    category: "Gia hạn thời gian đào tạo",
    question: "Thời gian đào tạo tối đa của Nghiên cứu sinh là bao lâu?",
    answer:
      "Thời gian đào tạo chuẩn là 3 năm (đối với người có bằng Thạc sĩ) hoặc 4 năm (đối với người có bằng Cử nhân). NCS được phép xin gia hạn tối đa thêm 24 tháng nhưng tổng thời gian học tập không được vượt quá 72 tháng (6 năm) kể từ ngày ký quyết định công nhận NCS.",
  },
];

export function FaqContactView({
  roleContext = "academic",
  backHref,
  backLabel,
}: FaqContactViewProps) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    topic: "hoc_vu",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);

  const defaultBackHref =
    backHref ||
    (roleContext === "academic"
      ? "/academic"
      : roleContext === "supervisor"
      ? "/supervisor/dashboard"
      : roleContext === "student"
      ? "/student/progress"
      : "/");

  const defaultBackLabel =
    backLabel ||
    (roleContext === "academic"
      ? "Tổng quan học vụ"
      : roleContext === "supervisor"
      ? "Bàn làm việc GVHD"
      : roleContext === "student"
      ? "Tiến độ đào tạo NCS"
      : "Trang chủ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ senderName: "", senderEmail: "", topic: "hoc_vu", message: "" });
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {isSent && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>Yêu cầu hỗ trợ đã được gửi thành công đến Phòng Đào tạo SĐH!</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href={defaultBackHref} className="hover:text-[#164E9B] flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="size-3.5" />
            <span>{defaultBackLabel}</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Hỏi đáp &amp; Liên hệ</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Hỏi đáp &amp; Hỗ trợ Kỹ thuật Đào tạo SĐH
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Giải đáp thắc mắc về phân quyền, duyệt minh chứng và xử lý nghiệp vụ học vụ sau đại học.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#164E9B]">
              <Sparkles className="size-3.5 text-[#164E9B]" />
              <span>Hỗ trợ 24/7 trực tuyến</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: FAQs + Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: FAQs */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
              <HelpCircle className="size-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Câu hỏi thường gặp ({FAQ_ITEMS.length} câu hỏi)
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-2 hover:border-[#164E9B] hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E9B] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {faq.category}
                  </span>
                </div>
                <strong className="text-slate-900 font-bold block text-sm leading-snug">
                  {faq.question}
                </strong>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Contact & Quick Form */}
        <div className="space-y-6">
          {/* Office Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="size-4 text-[#164E9B]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Phòng Đào tạo Sau Đại học
              </h2>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Building2 className="size-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Phòng B202, Tòa nhà Hiệu bộ, Trường Đại học An Giang - Số 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, An Giang.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">sdh@agu.edu.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">(0296) 6256565 - Số máy lẻ: 1042</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-slate-400 shrink-0" />
                <span>Thứ 2 - Thứ 6 (07:30 - 11:30 | 13:30 - 17:00)</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="size-4 text-[#164E9B]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Gửi câu hỏi hỗ trợ nhanh
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="Nhập họ và tên..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#164E9B] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email liên hệ</label>
                <input
                  type="email"
                  required
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  placeholder="name@agu.edu.vn"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#164E9B] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chủ đề cần hỏi</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#164E9B] focus:bg-white focus:outline-hidden"
                >
                  <option value="hoc_vu">Thủ tục &amp; Biểu mẫu học vụ</option>
                  <option value="quy_che">Quy chế đào tạo &amp; Định mức GVHD</option>
                  <option value="minh_chung">Duyệt minh chứng &amp; Điểm chuyên đề</option>
                  <option value="ky_thuat">Lỗi hệ thống hoặc đăng nhập</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung thắc mắc</label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mô tả chi tiết câu hỏi hoặc vướng mắc cần hỗ trợ..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-[#164E9B] focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#164E9B] py-2.5 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs"
              >
                <Send className="size-3.5" />
                <span>Gửi câu hỏi cho Giáo vụ</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqContactView;
