"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  User,
  Users,
  FileText,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export interface SearchResultItem {
  type: "student" | "supervisor" | "procedure" | "regulation";
  title: string;
  subtitle: string;
  actionText?: string;
  payload?: any;
}

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SearchResultItem) => void;
}

const MOCK_SEARCH_ITEMS: SearchResultItem[] = [
  {
    type: "student",
    title: "Nguyễn Văn An (NCS230104)",
    subtitle: "Chuyên ngành: Khoa học Máy tính • Khóa 2023 • Đang thực hiện Mốc 3",
    actionText: "Xem hồ sơ NCS",
    payload: { tab: "students", studentCode: "NCS230104" },
  },
  {
    type: "student",
    title: "Trần Thị Mai (NCS230108)",
    subtitle: "Chuyên ngành: Công nghệ Sinh học • Khóa 2023 • Đề nghị đổi tên đề tài",
    actionText: "Duyệt đổi đề tài",
    payload: { tab: "topic-changes" },
  },
  {
    type: "student",
    title: "Lê Quốc Bảo (NCS220055)",
    subtitle: "Chuyên ngành: Quản trị Kinh doanh • Khóa 2022 • Cảnh báo thời gian <12 tháng",
    actionText: "Xem hồ sơ NCS",
    payload: { tab: "students", studentCode: "NCS220055" },
  },
  {
    type: "supervisor",
    title: "TS. Bùi Lê Tuấn Anh",
    subtitle: "Khoa CNTT • Hạn ngạch: 2.5/3.0 NCS (1 độc lập, 3 đồng HD)",
    actionText: "Xem hạn ngạch",
    payload: { tab: "supervisors" },
  },
  {
    type: "supervisor",
    title: "PGS.TS. Nguyễn Văn Hùng",
    subtitle: "Khoa Nông nghiệp - TNTN • Hạn ngạch: 3.0/4.0 NCS",
    actionText: "Xem hạn ngạch",
    payload: { tab: "supervisors" },
  },
  {
    type: "procedure",
    title: "Quy trình nộp đề cương chi tiết luận án (Mốc 5)",
    subtitle: "Thủ tục học vụ • Thời gian: Tháng 18-24 • Đơn vị: Bộ môn & Khoa",
    actionText: "Xem hướng dẫn",
    payload: { tab: "procedures" },
  },
  {
    type: "procedure",
    title: "Thủ tục đề nghị điều chỉnh tên đề tài luận án",
    subtitle: "Thủ tục học vụ • Yêu cầu: Đơn đề nghị, xác nhận GVHD, họp Hội đồng",
    actionText: "Xem hướng dẫn",
    payload: { tab: "procedures" },
  },
  {
    type: "procedure",
    title: "Thẩm định bài báo khoa học quốc tế (WoS/Scopus)",
    subtitle: "Mốc 8 • Chuẩn đầu ra tối thiểu 2.0 điểm theo quy định AGU",
    actionText: "Xem hướng dẫn",
    payload: { tab: "procedures" },
  },
  {
    type: "regulation",
    title: "Quy chế Đào tạo Trình độ Tiến sĩ hiện hành - AGU & ĐHQG-HCM",
    subtitle: "Văn bản quy chế số 45/QĐ-ĐHQG • Khung đào tạo 72 tháng",
    actionText: "Đọc quy chế",
    payload: { tab: "regulations" },
  },
  {
    type: "regulation",
    title: "Quy định hạn ngạch và tiêu chuẩn Giảng viên Hướng dẫn (BR-09)",
    subtitle: "Văn bản số 12/QĐ-ĐHAG • Hướng dẫn độc lập 1.0, Đồng HD 0.5",
    actionText: "Đọc quy định",
    payload: { tab: "regulations" },
  },
];

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelect,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // toggle handled by parent
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredItems = MOCK_SEARCH_ITEMS.filter((item) => {
    const matchType = filterType === "all" || item.type === filterType;
    const matchQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs p-4 pt-16 animate-in fade-in duration-100">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
          <Search className="size-5 text-[#164E9B]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm nhanh NCS, GVHD, mã đề tài, thủ tục học vụ, quy chế..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            ESC để đóng
          </span>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs">
          <span className="text-slate-500 font-semibold">Lọc theo:</span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "student", label: "Nghiên cứu sinh" },
            { id: "supervisor", label: "Giảng viên HD" },
            { id: "procedure", label: "Thủ tục học vụ" },
            { id: "regulation", label: "Văn bản quy chế" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filterType === cat.id
                  ? "bg-[#164E9B] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Không tìm thấy kết quả nào phù hợp với từ khóa &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-blue-50/70 group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#164E9B]/10 group-hover:text-[#164E9B] transition-colors mt-0.5">
                    {item.type === "student" && <GraduationCap className="size-4" />}
                    {item.type === "supervisor" && <User className="size-4" />}
                    {item.type === "procedure" && <FileText className="size-4" />}
                    {item.type === "regulation" && <BookOpen className="size-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#164E9B] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#164E9B] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{item.actionText || "Mở"}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Quick hint footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Hệ thống Quản lý Đào tạo Sau Đại học AGU</span>
          <span>Dùng phím ↑ ↓ để di chuyển • Phím ↵ để chọn</span>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;
