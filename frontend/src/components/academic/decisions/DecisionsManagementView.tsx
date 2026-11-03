"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Ban,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Download,
  AlertTriangle,
  Check,
  ShieldAlert,
  X,
} from "lucide-react";
import { MOCK_DECISIONS, MOCK_STUDENTS } from "../mockData";
import type { StudentDossier } from "../StudentDetailModal";
import type { DecisionItem, DecisionType } from "@/src/types/academic";

/* =========================================================================
   SUB-COMPONENT: MODAL TẠO QUYẾT ĐỊNH MỚI
   ========================================================================= */
interface CreateDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (decision: Partial<DecisionItem>, ncsIds: string[]) => void;
}

function CreateDecisionModal({ isOpen, onClose, onSubmit }: CreateDecisionModalProps) {
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [ngayQuyetDinh, setNgayQuyetDinh] = useState(new Date().toISOString().split("T")[0]);
  const [loai, setLoai] = useState<DecisionType>("CAN_CU_DUYET_MOC");
  const [selectedNcsIds, setSelectedNcsIds] = useState<string[]>([]);
  const [ncsSearch, setNcsSearch] = useState("");
  const [hanMoi, setHanMoi] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const requiresNcs = ["BAO_LUU", "NGUNG_HOC", "BUOC_THOI_HOC", "GIA_HAN"].includes(loai);
  const isDangerousAction = ["BAO_LUU", "NGUNG_HOC", "BUOC_THOI_HOC"].includes(loai);

  const filteredStudents = MOCK_STUDENTS.filter(
    (s: StudentDossier) =>
      s.name.toLowerCase().includes(ncsSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(ncsSearch.toLowerCase())
  );

  const toggleSelectNcs = (id: string) => {
    setSelectedNcsIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setErrorMsg("Hệ thống chỉ chấp nhận tệp định dạng PDF.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg("Dung lượng tệp PDF không được vượt quá 15MB.");
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!soQuyetDinh.trim()) {
      setErrorMsg("Vui lòng nhập số hiệu quyết định.");
      return;
    }
    if (requiresNcs && selectedNcsIds.length === 0) {
      setErrorMsg(`Loại quyết định "${loai}" bắt buộc phải chọn ít nhất 1 NCS áp dụng.`);
      return;
    }
    if (loai === "GIA_HAN" && !hanMoi) {
      setErrorMsg("Quyết định gia hạn bắt buộc phải nhập hạn học tập mới.");
      return;
    }

    onSubmit(
      {
        soQuyetDinh: soQuyetDinh.trim(),
        ngayQuyetDinh,
        loai,
        ghiChu: ghiChu.trim() || undefined,
        hanMoi: loai === "GIA_HAN" ? hanMoi : undefined,
        fileName: selectedFile ? selectedFile.name : "QuyetDinh.pdf",
      },
      selectedNcsIds
    );

    // Reset form
    setSoQuyetDinh("");
    setLoai("CAN_CU_DUYET_MOC");
    setSelectedNcsIds([]);
    setHanMoi("");
    setGhiChu("");
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2744]">Tạo Quyết Định Pháp Lý Mới</h3>
              <p className="text-xs text-slate-500">Ban hành quyết định quản lý hoặc căn cứ duyệt mốc</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 font-semibold">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isDangerousAction && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-800">
              <ShieldAlert className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Lưu ý:</strong> Quyết định <strong>{loai}</strong> sẽ khóa tài khoản hoặc tạm dừng tiến độ đào tạo của NCS theo quy định đào tạo.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số Quyết Định *</label>
              <input
                type="text"
                value={soQuyetDinh}
                onChange={(e) => setSoQuyetDinh(e.target.value)}
                placeholder="VD: 142/QĐ-ĐHAG-SĐH"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày Ký / Ban Hành *</label>
              <input
                type="date"
                value={ngayQuyetDinh}
                onChange={(e) => setNgayQuyetDinh(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Loại Quyết Định *</label>
            <select
              value={loai}
              onChange={(e) => setLoai(e.target.value as DecisionType)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden bg-white"
            >
              <option value="CAN_CU_DUYET_MOC">Căn cứ duyệt mốc tiến trình (Giao đề tài, Hội đồng...)</option>
              <option value="GIA_HAN">Gia hạn thời gian đào tạo (Có cập nhật hạn mới)</option>
              <option value="BAO_LUU">Bảo lưu kết quả học tập</option>
              <option value="NGUNG_HOC">Ngừng học</option>
              <option value="BUOC_THOI_HOC">Buộc thôi học (Khóa tài khoản)</option>
              <option value="CONG_NHAN_NCS">Công nhận nghiên cứu sinh</option>
              <option value="GIAO_DE_TAI">Giao đề tài luận án</option>
              <option value="PHAN_CONG_GVHD">Phân công cán bộ hướng dẫn</option>
            </select>
          </div>

          {loai === "GIA_HAN" && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 space-y-2">
              <label className="block font-bold text-purple-900">Thời Hạn Học Tập Mới Sau Gia Hạn *</label>
              <input
                type="date"
                value={hanMoi}
                onChange={(e) => setHanMoi(e.target.value)}
                className="w-full rounded-xl border border-purple-200 px-3 py-2 text-xs bg-white focus:border-purple-600 focus:outline-hidden"
                required
              />
              <p className="text-[11px] text-purple-700">Thời hạn tối đa đào tạo toàn khóa không quá 72 tháng tính từ ngày nhập học.</p>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">NCS Áp Dụng (Đã chọn: {selectedNcsIds.length})</label>
            </div>
            <input
              type="text"
              value={ncsSearch}
              onChange={(e) => setNcsSearch(e.target.value)}
              placeholder="Gõ tên hoặc MSHV để lọc..."
              className="w-full rounded-xl border border-slate-200 p-1.5 mb-1.5 focus:border-[#164E9B] focus:outline-hidden"
            />
            <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-xl p-1.5 space-y-1 bg-slate-50/50">
              {filteredStudents.slice(0, 8).map((st: StudentDossier) => {
                const checked = selectedNcsIds.includes(st.id);
                return (
                  <div
                    key={st.id}
                    onClick={() => toggleSelectNcs(st.id)}
                    className={`p-1.5 rounded-lg flex justify-between cursor-pointer ${
                      checked ? "bg-blue-100 font-bold text-[#164E9B]" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>{st.name} ({st.code})</span>
                    {checked && <Check className="size-3.5 text-[#164E9B]" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tệp Đính Kèm (PDF tối đa 15MB)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-200 p-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#164E9B] file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Trích Yếu / Ghi Chú</label>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={2}
              placeholder="Về việc phê duyệt đề tài và người hướng dẫn..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#164E9B] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer"
            >
              Lưu &amp; Ban Hành Quyết Định
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL XEM CHI TIẾT QUYẾT ĐỊNH
   ========================================================================= */
interface DecisionDetailModalProps {
  decision: DecisionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function DecisionDetailModal({ decision, isOpen, onClose }: DecisionDetailModalProps) {
  if (!isOpen || !decision) return null;
  const isEffective = decision.trangThai === "HIEU_LUC";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F2744]">{decision.soQuyetDinh}</h3>
                {isEffective ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 className="size-3" /> Hiệu lực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    <XCircle className="size-3" /> Vô hiệu hóa
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Chi tiết quyết định pháp lý</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Ngày ban hành</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="size-3.5 text-[#164E9B]" />
                <span>{decision.ngayQuyetDinh}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Loại quyết định</span>
              <span className="font-bold text-[#164E9B]">{decision.loai}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1 font-medium">NCS Áp dụng</span>
            {decision.ncs ? (
              <div className="rounded-xl border border-slate-200 p-3 bg-white flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{decision.ncs.hoTen}</span>
                  <span className="text-slate-400 text-[11px]">MSHV: {decision.ncs.mshv}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 text-slate-600 flex items-center gap-2 font-semibold">
                <Users className="size-4 text-slate-400" />
                <span>Quyết định chung (Áp dụng toàn khóa hoặc tiểu ban chuyên môn)</span>
              </div>
            )}
          </div>

          {decision.hanMoi && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 flex items-center gap-2 font-bold text-purple-900">
              <Clock className="size-4 text-purple-600" />
              <span>Hạn học tập mới sau gia hạn: {decision.hanMoi}</span>
            </div>
          )}

          <div>
            <span className="text-slate-400 block mb-1 font-medium">Trích yếu / Ghi chú</span>
            <p className="rounded-xl border border-slate-200 p-3 bg-white text-slate-700 leading-relaxed">
              {decision.ghiChu || "Không có ghi chú thêm."}
            </p>
          </div>

          {!isEffective && decision.lyDoVoHieuHoa && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
              <strong>Lý do vô hiệu hóa:</strong> {decision.lyDoVoHieuHoa}
            </div>
          )}

          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="font-semibold text-slate-700">{decision.fileName || "QuyetDinh.pdf"}</span>
            <button
              onClick={() => alert(`Xem file: ${decision.fileName || "QuyetDinh.pdf"}`)}
              className="text-[#164E9B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="size-3.5" /> Xem PDF
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL VÔ HIỆU HÓA QUYẾT ĐỊNH
   ========================================================================= */
interface DeactivateDecisionModalProps {
  isOpen: boolean;
  decision: DecisionItem | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

function DeactivateDecisionModal({ isOpen, decision, onClose, onConfirm }: DeactivateDecisionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !decision) return null;

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Vui lòng nhập lý do vô hiệu hóa quyết định.");
      return;
    }
    if (trimmed.length > 1000) {
      setError("Lý do không được vượt quá 1000 ký tự.");
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 space-y-4 text-xs animate-in zoom-in-95">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2 text-rose-800 border-b border-rose-100 pb-3">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-700">
            <Ban className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Vô Hiệu Hóa Quyết Định</h3>
            <p className="text-[11px] text-slate-500">
              Số QĐ: <span className="font-semibold text-slate-800">{decision.soQuyetDinh}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-800 flex items-start gap-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Quyết định sau khi vô hiệu hóa sẽ không còn giá trị pháp lý và không thể dùng làm căn cứ duyệt mốc được nữa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lý do vô hiệu hóa <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Nhập lý do chi tiết (ví dụ: Quyết định ban hành nhầm số hiệu...)"
              rows={3}
              maxLength={1000}
              className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-rose-500 focus:outline-hidden text-xs"
              autoFocus
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              {error ? <span className="text-rose-600 font-semibold">{error}</span> : <span>Bắt buộc 1 - 1000 ký tự</span>}
              <span>{reason.length}/1000</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-3.5 py-1.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="rounded-xl bg-rose-600 px-4 py-1.5 font-bold text-white hover:bg-rose-700 cursor-pointer disabled:opacity-50"
            >
              Xác Nhận Hủy QĐ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW CHÍNH: QUẢN LÝ QUYẾT ĐỊNH (DecisionsManagementView)
   ========================================================================= */
export function DecisionsManagementView({ embedded = false }: { embedded?: boolean }) {
  const [decisions, setDecisions] = useState<DecisionItem[]>(MOCK_DECISIONS);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailDecision, setDetailDecision] = useState<DecisionItem | null>(null);
  const [deactivateDecision, setDeactivateDecision] = useState<DecisionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Lọc danh sách quyết định
  const filteredDecisions = useMemo(() => {
    return decisions.filter((dec) => {
      const matchSearch =
        dec.soQuyetDinh.toLowerCase().includes(searchText.toLowerCase()) ||
        (dec.ncs?.hoTen && dec.ncs.hoTen.toLowerCase().includes(searchText.toLowerCase())) ||
        (dec.ncs?.mshv && dec.ncs.mshv.toLowerCase().includes(searchText.toLowerCase())) ||
        (dec.ghiChu && dec.ghiChu.toLowerCase().includes(searchText.toLowerCase()));

      const matchType = typeFilter === "all" || dec.loai === typeFilter;
      const matchStatus = statusFilter === "all" || dec.trangThai === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [decisions, searchText, typeFilter, statusFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: decisions.length,
      canCuMoc: decisions.filter((d) => d.loai === "CAN_CU_DUYET_MOC" && d.trangThai === "HIEU_LUC").length,
      giaHan: decisions.filter((d) => d.loai === "GIA_HAN" && d.trangThai === "HIEU_LUC").length,
      voHieuHoa: decisions.filter((d) => d.trangThai === "VO_HIEU_HOA").length,
    };
  }, [decisions]);

  // Tạo quyết định mới
  const handleCreateDecision = (payload: Partial<DecisionItem>, ncsIds: string[]) => {
    const timestamp = new Date().toISOString();
    const newItems: DecisionItem[] = [];

    if (ncsIds.length === 0) {
      newItems.push({
        id: `dec-${Date.now()}`,
        soQuyetDinh: payload.soQuyetDinh || "",
        ngayQuyetDinh: payload.ngayQuyetDinh || "",
        loai: payload.loai || "CAN_CU_DUYET_MOC",
        ncsId: null,
        ncs: null,
        trangThai: "HIEU_LUC",
        fileName: payload.fileName,
        ghiChu: payload.ghiChu,
        hanMoi: payload.hanMoi,
        ngayTao: timestamp,
      });
    } else {
      ncsIds.forEach((id, idx) => {
        newItems.push({
          id: `dec-${Date.now()}-${idx}`,
          soQuyetDinh: payload.soQuyetDinh || "",
          ngayQuyetDinh: payload.ngayQuyetDinh || "",
          loai: payload.loai || "CAN_CU_DUYET_MOC",
          ncsId: id,
          ncs: {
            id,
            mshv: `231100${idx + 1}`,
            hoTen: `NCS Đã Chọn (${id})`,
          },
          trangThai: "HIEU_LUC",
          fileName: payload.fileName,
          ghiChu: payload.ghiChu,
          hanMoi: payload.hanMoi,
          ngayTao: timestamp,
        });
      });
    }

    setDecisions((prev) => [...newItems, ...prev]);
    showToast(`Đã tạo thành công quyết định ${payload.soQuyetDinh} cho ${newItems.length} đối tượng.`);
  };

  // Vô hiệu hóa
  const handleDeactivateConfirm = (reason: string) => {
    if (!deactivateDecision || !reason.trim()) return;
    setDecisions((prev) =>
      prev.map((d) =>
        d.id === deactivateDecision.id
          ? { ...d, trangThai: "VO_HIEU_HOA", lyDoVoHieuHoa: reason.trim() }
          : d
      )
    );
    showToast(`Đã vô hiệu hóa quyết định ${deactivateDecision.soQuyetDinh}.`);
    setDeactivateDecision(null);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "CAN_CU_DUYET_MOC":
        return "bg-blue-50 text-[#164E9B] border-blue-200";
      case "GIA_HAN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "BAO_LUU":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "NGUNG_HOC":
      case "BUOC_THOI_HOC":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "GIAO_DE_TAI":
      case "PHAN_CONG_GVHD":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className={`space-y-6 ${embedded ? "" : "p-6"}`}>
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/academic/dashboard"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-xl font-bold text-[#0F2744]">Quản Lý Quyết Định Pháp Lý</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ, ban hành căn cứ pháp lý duyệt mốc, quyết định gia hạn, bảo lưu, thôi học
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#113E7D] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Tạo Quyết Định Mới</span>
        </button>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-slate-500 text-xs block font-medium">Tổng Quyết Định</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-xs">
          <span className="text-[#164E9B] text-xs block font-bold">Căn Cứ Duyệt Mốc</span>
          <span className="text-2xl font-black text-[#164E9B] mt-1 block">{stats.canCuMoc}</span>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 shadow-xs">
          <span className="text-purple-700 text-xs block font-bold">QĐ Gia Hạn (Hạn Mới)</span>
          <span className="text-2xl font-black text-purple-800 mt-1 block">{stats.giaHan}</span>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-xs">
          <span className="text-rose-700 text-xs block font-bold">Vô Hiệu Hóa</span>
          <span className="text-2xl font-black text-rose-800 mt-1 block">{stats.voHieuHoa}</span>
        </div>
      </div>

      {/* Bộ lọc và Tìm kiếm */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo số QĐ, tên NCS, MSHV hoặc trích yếu..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden bg-white text-slate-700 font-medium"
        >
          <option value="all">Tất cả loại quyết định</option>
          <option value="CAN_CU_DUYET_MOC">Căn cứ duyệt mốc</option>
          <option value="GIA_HAN">Gia hạn thời gian</option>
          <option value="BAO_LUU">Bảo lưu</option>
          <option value="NGUNG_HOC">Ngừng học</option>
          <option value="BUOC_THOI_HOC">Buộc thôi học</option>
          <option value="CONG_NHAN_NCS">Công nhận NCS</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden bg-white text-slate-700 font-medium"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="HIEU_LUC">Hiệu lực</option>
          <option value="VO_HIEU_HOA">Vô hiệu hóa</option>
        </select>
      </div>

      {/* Bảng danh sách Quyết định */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Số Quyết Định</th>
              <th className="px-4 py-3">Ngày Ký</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Áp Dụng Cho</th>
              <th className="px-4 py-3">Hạn Mới / Ghi Chú</th>
              <th className="px-4 py-3">Trạng Thái</th>
              <th className="px-4 py-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDecisions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Không tìm thấy quyết định nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredDecisions.map((dec) => {
                const isEffective = dec.trangThai === "HIEU_LUC";
                return (
                  <tr key={dec.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <FileText className="size-3.5 text-[#164E9B]" />
                        <span>{dec.soQuyetDinh}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {dec.ngayQuyetDinh}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${getBadgeColor(
                          dec.loai
                        )}`}
                      >
                        {dec.loai}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {dec.ncs ? (
                        <div>
                          <div className="font-bold text-slate-800">{dec.ncs.hoTen}</div>
                          <div className="text-[10px] text-slate-400">MSHV: {dec.ncs.mshv}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Áp dụng chung</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-slate-600">
                      {dec.hanMoi ? (
                        <span className="font-bold text-purple-700">Hạn mới: {dec.hanMoi}</span>
                      ) : (
                        dec.ghiChu || "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEffective ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="size-3" /> Hiệu lực
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          <XCircle className="size-3" /> Vô hiệu hóa
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailDecision(dec)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#164E9B] cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        {isEffective && (
                          <button
                            onClick={() => setDeactivateDecision(dec)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal tạo quyết định */}
      <CreateDecisionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateDecision}
      />

      {/* Modal xem chi tiết */}
      <DecisionDetailModal
        decision={detailDecision}
        isOpen={!!detailDecision}
        onClose={() => setDetailDecision(null)}
      />

      {/* Modal vô hiệu hóa */}
      <DeactivateDecisionModal
        key={deactivateDecision?.id}
        isOpen={!!deactivateDecision}
        decision={deactivateDecision}
        onClose={() => setDeactivateDecision(null)}
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  );
}
