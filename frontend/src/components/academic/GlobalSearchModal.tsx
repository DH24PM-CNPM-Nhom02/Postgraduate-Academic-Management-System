"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAcademicStudents, useAcademicSupervisors } from "@/src/hooks/use-academic";
import {
  Search,
  X,
  User,
  FileText,
  BookOpen,
  BookOpenCheck,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export interface SearchResultItem {
  type: "student" | "supervisor" | "procedure" | "regulation" | "thesis";
  title: string;
  subtitle: string;
  actionText?: string;
  payload?: {
    tab?: string;
    studentCode?: string;
    targetPath?: string;
    searchQuery?: string;
  };
}

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: SearchResultItem) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelect,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Kết nối dữ liệu thực tế từ API
  const { data: studentsData } = useAcademicStudents();
  const { data: supervisorsData } = useAcademicSupervisors();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Lắng nghe phím tắt đóng mở Ctrl+K / ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    if (studentsData && Array.isArray(studentsData)) {
      studentsData.forEach((s) => {
        items.push({
          type: "student",
          title: `${s.name} (${s.code})`,
          subtitle: `Chuyên ngành: ${s.department || "Chưa cập nhật"} • Mốc đào tạo: Mốc ${s.currentMilestoneIndex || 1}`,
          actionText: "Xem hồ sơ NCS",
          payload: { targetPath: "/students", searchQuery: s.code },
        });

        if (s.thesisTopic) {
          items.push({
            type: "thesis",
            title: s.thesisTopic,
            subtitle: `Đề tài Luận án TS • NCS: ${s.name} (${s.code})`,
            actionText: "Xem đề tài",
            payload: { targetPath: "/theses", searchQuery: s.code },
          });
        }
      });
    }

    if (supervisorsData && Array.isArray(supervisorsData)) {
      supervisorsData.forEach((sv) => {
        items.push({
          type: "supervisor",
          title: `${sv.degree ? sv.degree + " " : ""}${sv.name}`,
          subtitle: `${sv.department || "Khoa"} • Hạn ngạch: ${sv.usedQuota}/${sv.maxQuota} NCS`,
          actionText: "Xem hạn ngạch",
          payload: { targetPath: "/supervisors", searchQuery: sv.name },
        });
      });
    }

    return items;
  }, [studentsData, supervisorsData]);

  if (!isOpen) return null;

  const basePrefix = pathname?.startsWith("/admin") ? "/admin" : "/academic";

  const filteredItems = searchItems.filter((item) => {
    const matchType = filterType === "all" || item.type === filterType;
    const q = query.trim().toLowerCase();
    if (!q) return matchType;
    const matchQuery =
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.payload?.searchQuery && item.payload.searchQuery.toLowerCase().includes(q));
    return matchType && matchQuery;
  });

  const activeIndex = Math.min(selectedIndex, Math.max(0, filteredItems.length - 1));

  const handleSelectItem = (item: SearchResultItem) => {
    onClose();
    if (onSelect) {
      onSelect(item);
    }

    let targetPath = item.payload?.targetPath;
    if (!targetPath && item.payload?.tab) {
      targetPath = `/${item.payload.tab}`;
    }
    if (!targetPath) {
      targetPath = "/students";
    }

    const searchQuery = item.payload?.searchQuery || item.payload?.studentCode;
    const queryString = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
    const destination = `${basePrefix}${targetPath}${queryString}`;

    router.push(destination);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        const itemToSelect = filteredItems[activeIndex] || filteredItems[0];
        handleSelectItem(itemToSelect);
      } else if (query.trim()) {
        // Tìm kiếm tự do khi không khớp mục mẫu
        onClose();
        const q = encodeURIComponent(query.trim());
        if (filterType === "supervisor") {
          router.push(`${basePrefix}/supervisors?search=${q}`);
        } else if (filterType === "thesis") {
          router.push(`${basePrefix}/theses?search=${q}`);
        } else if (filterType === "procedure") {
          router.push(`${basePrefix}/procedures?search=${q}`);
        } else if (filterType === "regulation") {
          router.push(`${basePrefix}/regulations?search=${q}`);
        } else {
          router.push(`${basePrefix}/students?search=${q}`);
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs p-4 pt-16 animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
          <Search className="size-5 text-[#164E9B]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Tìm nhanh NCS, GVHD, mã đề tài, biểu mẫu, quy chế..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            ESC để đóng
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs overflow-x-auto">
          <span className="text-slate-500 font-semibold shrink-0">Lọc theo:</span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "student", label: "Nghiên cứu sinh" },
            { id: "supervisor", label: "Giảng viên HD" },
            { id: "thesis", label: "Đề tài Luận án" },
            { id: "procedure", label: "Biểu mẫu học vụ" },
            { id: "regulation", label: "Văn bản quy chế" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setFilterType(cat.id);
                setSelectedIndex(0);
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
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
              <div className="mt-2 text-[11px] text-[#164E9B] font-semibold">
                Nhấn [Enter] để tìm kiếm tự do trên phân hệ tương ứng.
              </div>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isHighlighted = idx === activeIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors cursor-pointer group ${
                    isHighlighted ? "bg-blue-50/90 text-[#164E9B]" : "hover:bg-blue-50/70"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5 ${
                        isHighlighted
                          ? "bg-[#164E9B] text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-[#164E9B]/10 group-hover:text-[#164E9B]"
                      }`}
                    >
                      {item.type === "student" && <GraduationCap className="size-4" />}
                      {item.type === "supervisor" && <User className="size-4" />}
                      {item.type === "thesis" && <BookOpenCheck className="size-4" />}
                      {item.type === "procedure" && <FileText className="size-4" />}
                      {item.type === "regulation" && <BookOpen className="size-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#164E9B] transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[11px] font-semibold text-[#164E9B] transition-opacity shrink-0 ml-2 ${
                      isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span>{item.actionText || "Mở"}</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </button>
              );
            })
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
