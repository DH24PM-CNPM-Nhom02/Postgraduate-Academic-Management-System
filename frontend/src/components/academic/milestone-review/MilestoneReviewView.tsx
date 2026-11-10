"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileCheck2,
  FileText,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Award,
  AlertCircle,
  XCircle,
  Download,
  Calendar,
  X,
} from "lucide-react";
import { MOCK_PENDING_MILESTONES, MOCK_DECISIONS } from "../mockData";
import type {
  PendingMilestoneItem,
  EvaluationItem,
  DecisionItem,
  MilestoneSubmissionHistory,
} from "@/src/types/academic";

/* =========================================================================
   SUB-COMPONENT: MODAL NHẬP PHIẾU CHẤM ĐIỂM CHUYÊN GIA (MỐC 2, 4, 5)
   ========================================================================= */
interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evaluation: Partial<EvaluationItem>) => void;
}

function AddEvaluationModal({ isOpen, onClose, onSubmit }: AddEvaluationModalProps) {
  const [tenNguoiCham, setTenNguoiCham] = useState("");
  const [donViNguoiCham, setDonViNguoiCham] = useState("");
  const [diem, setDiem] = useState<number | "">("");
  const [nhanXet, setNhanXet] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!tenNguoiCham.trim()) {
      setErrorMsg("Vui lòng nhập họ tên người chấm / chuyên gia đánh giá.");
      return;
    }
    if (diem === "" || isNaN(Number(diem)) || Number(diem) < 0 || Number(diem) > 10) {
      setErrorMsg("Điểm số phải từ 0 đến 10 (tối đa 1 chữ số thập phân).");
      return;
    }

    onSubmit({
      tenNguoiCham: tenNguoiCham.trim(),
      donViNguoiCham: donViNguoiCham.trim() || undefined,
      diem: Math.round(Number(diem) * 10) / 10,
      nhanXet: nhanXet.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    setTenNguoiCham("");
    setDonViNguoiCham("");
    setDiem("");
    setNhanXet("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50/75">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <Award className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F2744]">Nhập Phiếu Nhận Xét &amp; Chấm Điểm</h3>
              <p className="text-[11px] text-slate-500">Dành cho Mốc 2, 4, 5 (Tối thiểu 3 phiếu)</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-700 font-semibold">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ tên người chấm *</label>
            <input
              type="text"
              value={tenNguoiCham}
              onChange={(e) => setTenNguoiCham(e.target.value)}
              placeholder="VD: PGS.TS Nguyễn Văn A"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Đơn vị công tác</label>
            <input
              type="text"
              value={donViNguoiCham}
              onChange={(e) => setDonViNguoiCham(e.target.value)}
              placeholder="VD: Đại học Bách Khoa - ĐHQG-HCM"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Điểm số (Thang 10) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={diem}
              onChange={(e) => setDiem(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="VD: 8.5"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nhận xét tóm tắt</label>
            <textarea
              value={nhanXet}
              onChange={(e) => setNhanXet(e.target.value)}
              rows={3}
              placeholder="Nội dung đánh giá, góp ý chuyên môn..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#164E9B] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#164E9B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer"
            >
              Lưu Phiếu Chấm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL TỪ CHỐI MỐC (BẮT BUỘC LÝ DO)
   ========================================================================= */
interface RejectMilestoneDialogProps {
  item: PendingMilestoneItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tienTrinhId: string, lyDo: string) => void;
}

function RejectMilestoneDialog({
  item,
  isOpen,
  onClose,
  onConfirm,
}: RejectMilestoneDialogProps) {
  const [lyDo, setLyDo] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    if (!lyDo.trim()) {
      setErrorMsg("Vui lòng nhập lý do từ chối mốc (1 - 1000 ký tự).");
      return;
    }
    if (lyDo.trim().length > 1000) {
      setErrorMsg("Lý do không được vượt quá 1000 ký tự.");
      return;
    }
    onConfirm(item.id, lyDo.trim());
    setLyDo("");
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/75 px-5 py-3.5">
          <div className="flex items-center gap-2 text-rose-800">
            <XCircle className="size-5 text-rose-600" />
            <h3 className="text-sm font-bold">Từ Chối Mốc Tiến Độ</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs text-slate-600">
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-rose-900">
            <p className="font-semibold">
              Từ chối hồ sơ mốc của NCS <strong className="text-rose-950 font-bold">{item.ncs.hoTen}</strong> ({item.moc.tenMoc}).
            </p>
            <p className="text-[11px] text-rose-700 mt-1">
              * Hồ sơ sẽ chuyển sang trạng thái <strong>Cần nộp lại (REJECTED)</strong>. NCS sẽ đọc được lý do này trên bảng điều khiển.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lý do từ chối <span className="text-rose-500">* (Bắt buộc, 1 - 1000 ký tự)</span>
            </label>
            <textarea
              value={lyDo}
              onChange={(e) => {
                setLyDo(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              rows={4}
              placeholder="Nêu rõ lý do từ chối để NCS khắc phục..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-hidden"
              maxLength={1000}
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-0.5">
              <span>{errorMsg && <span className="text-rose-600 font-bold">{errorMsg}</span>}</span>
              <span>{lyDo.length}/1000 ký tự</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex justify-end gap-2.5">
          <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            Đóng
          </button>
          <button onClick={handleConfirm} className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer">
            Xác Nhận Từ Chối Mốc
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL XEM NHANH QUYẾT ĐỊNH CĂN CỨ
   ========================================================================= */
interface DecisionPreviewModalProps {
  decision: DecisionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

function DecisionPreviewModal({ decision, isOpen, onClose }: DecisionPreviewModalProps) {
  if (!isOpen || !decision) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2744]">{decision.soQuyetDinh}</h3>
              <p className="text-xs text-slate-500">Căn cứ pháp lý duyệt mốc</p>
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
            <span className="text-slate-400 block mb-1 font-medium">Trích yếu / Ghi chú</span>
            <p className="rounded-xl border border-slate-200 p-3 bg-white text-slate-700 leading-relaxed">
              {decision.ghiChu || "Căn cứ quyết định duyệt mốc tiến trình."}
            </p>
          </div>

          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="font-semibold text-slate-700">{decision.fileName || "QuyetDinh.pdf"}</span>
            <button
              onClick={() => alert(`Xem file PDF: ${decision.fileName || "QuyetDinh.pdf"}`)}
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
   VIEW CHÍNH: HÀNG CHỜ & THẨM ĐỊNH 9 MỐC (MilestoneReviewView)
   ========================================================================= */
export function MilestoneReviewView({ embedded = false }: { embedded?: boolean }) {
  const [items, setItems] = useState<PendingMilestoneItem[]>(MOCK_PENDING_MILESTONES);
  const [selectedItem, setSelectedItem] = useState<PendingMilestoneItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States khi duyệt / từ chối / chấm điểm
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState("");
  const [addEvalModalOpen, setAddEvalModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [previewQd, setPreviewQd] = useState<DecisionItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Lọc danh sách hàng chờ
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const matchSearch =
        it.ncs.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
        it.ncs.mshv.toLowerCase().includes(searchText.toLowerCase()) ||
        it.moc.tenMoc.toLowerCase().includes(searchText.toLowerCase());

      const matchMilestone =
        milestoneFilter === "all" || it.moc.thuTu.toString() === milestoneFilter;

      return matchSearch && matchMilestone;
    });
  }, [items, searchText, milestoneFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: items.length,
      requiresScore: items.filter((it) => it.moc.yeuCauDiem).length,
      readyToApprove: items.filter(
        (it) => !it.moc.yeuCauDiem || (it.evaluationSummary?.duPhieu && it.evaluationSummary?.diemTrungBinh >= 7.0)
      ).length,
    };
  }, [items]);

  // Chỉ số điểm của mốc đang xem
  const currentEvals = selectedItem?.evaluations || [];
  const evalCount = currentEvals.length;
  const hasEnoughEvals = evalCount >= 3;
  const totalScore = currentEvals.reduce((sum, e) => sum + e.diem, 0);
  const avgScore = evalCount > 0 ? Math.round((totalScore / evalCount) * 10) / 10 : 0;
  const isScorePassed = avgScore >= 7.0;

  // Lọc quyết định làm căn cứ hợp lệ cho NCS này
  const validDecisions: DecisionItem[] = useMemo(() => {
    if (!selectedItem) return [];
    return MOCK_DECISIONS.filter(
      (d) =>
        d.loai === "CAN_CU_DUYET_MOC" &&
        d.trangThai === "HIEU_LUC" &&
        (d.ncsId === selectedItem.ncs.id || d.ncsId === null)
    );
  }, [selectedItem]);

  const canApprove =
    selectedQuyetDinhId !== "" &&
    (!selectedItem?.moc.yeuCauDiem || (hasEnoughEvals && isScorePassed));

  // Handler duyệt mốc
  const handleApprove = () => {
    if (!selectedItem || !canApprove) return;
    const qd = validDecisions.find((d) => d.id === selectedQuyetDinhId);

    setItems((prev) => prev.filter((it) => it.id !== selectedItem.id));
    showToast(
      `Đã duyệt thành công mốc "${selectedItem.moc.tenMoc}" cho NCS ${selectedItem.ncs.hoTen} theo QĐ ${qd?.soQuyetDinh || ""}.`
    );
    setSelectedItem(null);
    setSelectedQuyetDinhId("");
  };

  // Handler từ chối mốc
  const handleRejectConfirm = (tienTrinhId: string, lyDo: string) => {
    const item = items.find((it) => it.id === tienTrinhId);
    setItems((prev) => prev.filter((it) => it.id !== tienTrinhId));
    showToast(`Đã từ chối mốc của NCS ${item?.ncs.hoTen}. Lý do: "${lyDo}"`);
    setSelectedItem(null);
  };

  // Thêm phiếu chấm
  const handleAddEvaluation = (evalData: Partial<EvaluationItem>) => {
    if (!selectedItem) return;
    const newEval: EvaluationItem = {
      id: `ev-${Date.now()}`,
      tenNguoiCham: evalData.tenNguoiCham || "",
      donViNguoiCham: evalData.donViNguoiCham,
      diem: evalData.diem || 0,
      nhanXet: evalData.nhanXet,
      createdAt: new Date().toISOString(),
    };

    const updatedEvals = [...(selectedItem.evaluations || []), newEval];
    const newCount = updatedEvals.length;
    const newTotal = updatedEvals.reduce((s, e) => s + e.diem, 0);
    const newAvg = Math.round((newTotal / newCount) * 10) / 10;

    const updatedItem: PendingMilestoneItem = {
      ...selectedItem,
      evaluations: updatedEvals,
      evaluationSummary: {
        soPhieu: newCount,
        soPhieuToiThieu: 3,
        diemTrungBinh: newAvg,
        duPhieu: newCount >= 3,
      },
    };

    setSelectedItem(updatedItem);
    setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updatedItem : it)));
    showToast(`Đã lưu phiếu chấm của ${newEval.tenNguoiCham} (${newEval.diem} điểm).`);
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
            <h1 className="text-xl font-bold text-[#0F2744]">Hàng Chờ Duyệt Tiến Độ 9 Mốc</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình thẩm định hồ sơ mốc, đối chiếu minh chứng, nhập điểm chuyên gia và duyệt căn cứ quyết định
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/academic/decisions"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText className="size-4 text-[#164E9B]" />
            <span>Kho Quyết Định</span>
          </Link>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-slate-500 text-xs block font-medium">Hồ Sơ Chờ Duyệt (PENDING)</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs">
          <span className="text-amber-700 text-xs block font-bold">Mốc Yêu Cầu Chấm Điểm (Mốc 2,4,5)</span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">{stats.requiresScore}</span>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
          <span className="text-emerald-700 text-xs block font-bold">Đủ Điều Kiện Duyệt Ngay</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{stats.readyToApprove}</span>
        </div>
      </div>

      {/* BỘ LỌC VÀ BẢNG HÀNG CHỜ DUYỆT */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo tên NCS, MSHV hoặc tên mốc..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
            />
          </div>

          <select
            value={milestoneFilter}
            onChange={(e) => setMilestoneFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả các mốc (1 - 9)</option>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                Mốc {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Bảng hàng chờ */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Mốc</th>
                <th className="px-4 py-3">NCS / Mã Học Viên</th>
                <th className="px-4 py-3">Minh Chứng</th>
                <th className="px-4 py-3">Phiếu Chấm (Mốc 2,4,5)</th>
                <th className="px-4 py-3">Ngày Nộp</th>
                <th className="px-4 py-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Không có hồ sơ nào trong hàng chờ duyệt.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const reqScore = item.moc.yeuCauDiem;
                  const sum = item.evaluationSummary;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/50"
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                        setSelectedQuyetDinhId("");
                      }}
                    >
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100/70 px-2 py-1 text-[#164E9B]">
                          <FileCheck2 className="size-3.5" />
                          <span>Mốc {item.moc.thuTu}: {item.moc.tenMoc}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{item.ncs.hoTen}</div>
                        <div className="text-[10px] text-slate-400">MSHV: {item.ncs.mshv}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="truncate max-w-[150px] inline-block font-medium">
                          {item.minhChungMoiNhat.fileId || "MinhChung.pdf"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {reqScore ? (
                          sum ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                sum.duPhieu && sum.diemTrungBinh >= 7.0
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {sum.soPhieu}/3 phiếu • TB: {sum.diemTrungBinh.toFixed(1)}đ
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold text-[10px]">Chưa có phiếu chấm</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">Không yêu cầu</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {item.minhChungMoiNhat.ngayNop}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setSelectedQuyetDinhId("");
                          }}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#164E9B] text-white"
                              : "border border-slate-200 bg-white text-slate-700 hover:text-[#164E9B]"
                          }`}
                        >
                          {isSelected ? "Đang Thẩm Định" : "Thẩm Định"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KHÔNG GIAN THẨM ĐỊNH CHI TIẾT (KHI CHỌN 1 HỒ SƠ) */}
      {selectedItem && (
        <div className="rounded-2xl border-2 border-[#164E9B]/30 bg-white p-6 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-[#164E9B] uppercase mb-1">
                Không Gian Thẩm Định &amp; Phê Duyệt Mốc
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Mốc {selectedItem.moc.thuTu}: {selectedItem.moc.tenMoc}
              </h2>
              <p className="text-xs text-slate-500">
                Học viên: <strong className="text-slate-800">{selectedItem.ncs.hoTen}</strong> (MSHV: {selectedItem.ncs.mshv}) • Lớp: {selectedItem.ncs.lop}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Đóng Thẩm Định
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Minh chứng & Phiếu chấm */}
            <div className="lg:col-span-8 space-y-6">
              {/* Khối 1: Lịch sử nộp & Minh chứng */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="size-4 text-[#164E9B]" /> Minh Chứng Đính Kèm
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedItem.minhChungMoiNhat.fileId || "MinhChung.pdf"}</span>
                    <span className="text-[11px] text-slate-400">
                      Nộp ngày: {selectedItem.minhChungMoiNhat.ngayNop} • Trạng thái: PENDING
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Tải xuống minh chứng: ${selectedItem.minhChungMoiNhat.fileId || "MinhChung.pdf"}`)}
                    className="flex items-center gap-1 text-[#164E9B] font-bold text-xs hover:underline cursor-pointer"
                  >
                    <Download className="size-3.5" /> Xem PDF
                  </button>
                </div>
              </div>

              {/* Khối 2: Phiếu chấm chuyên gia (Mốc 2, 4, 5) */}
              {selectedItem.moc.yeuCauDiem ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="size-4 text-[#164E9B]" /> Phiếu Nhận Xét &amp; Chấm Điểm
                      </h3>
                      <p className="text-[11px] text-slate-500">Yêu cầu tối thiểu 3 phiếu và điểm trung bình ≥ 7.0</p>
                    </div>
                    <button
                      onClick={() => setAddEvalModalOpen(true)}
                      className="rounded-xl bg-[#164E9B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer"
                    >
                      + Nhập Phiếu Chấm
                    </button>
                  </div>

                  {/* Tóm tắt điểm */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                      <span className="text-slate-500 block text-[11px]">Số phiếu</span>
                      <strong className="text-lg text-slate-800">{evalCount} / 3</strong>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                      <span className="text-slate-500 block text-[11px]">Điểm trung bình</span>
                      <strong className={`text-lg ${isScorePassed ? "text-emerald-700" : "text-amber-700"}`}>
                        {evalCount > 0 ? avgScore.toFixed(1) : "—"} / 10
                      </strong>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-center text-center">
                      {hasEnoughEvals ? (
                        isScorePassed ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Đạt (≥ 7.0)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <XCircle className="size-3.5" /> Dưới 7.0
                          </span>
                        )
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <AlertCircle className="size-3.5" /> Thiếu {3 - evalCount} phiếu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Danh sách phiếu */}
                  <div className="space-y-2">
                    {currentEvals.map((ev, i) => (
                      <div key={ev.id || i} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-800">
                            {ev.tenNguoiCham} {ev.donViNguoiCham && <span className="font-normal text-slate-500">({ev.donViNguoiCham})</span>}
                          </div>
                          {ev.nhanXet && <p className="text-slate-600 mt-1 italic">&ldquo;{ev.nhanXet}&rdquo;</p>}
                        </div>
                        <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-black text-emerald-800 shrink-0">
                          {ev.diem}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Mốc này không yêu cầu nhập điểm chuyên gia. Giáo vụ có thể tiến hành xem xét duyệt trực tiếp.
                </div>
              )}
            </div>

            {/* Cột phải: Quyết định duyệt / từ chối & Lịch sử mốc */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldCheck className="size-4 text-[#164E9B]" /> Căn Cứ Quyết Định
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Chọn Quyết Định Làm Căn Cứ *</label>
                    {selectedQuyetDinhId && (
                      <button
                        onClick={() => {
                          const qd = validDecisions.find((d) => d.id === selectedQuyetDinhId);
                          if (qd) setPreviewQd(qd);
                        }}
                        className="text-[#164E9B] font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        Xem chi tiết QĐ
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedQuyetDinhId}
                    onChange={(e) => setSelectedQuyetDinhId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 focus:border-[#164E9B] focus:outline-hidden bg-white"
                  >
                    <option value="">-- Chọn quyết định hiệu lực --</option>
                    {validDecisions.map((qd) => (
                      <option key={qd.id} value={qd.id}>
                        {qd.soQuyetDinh} ({qd.ngayQuyetDinh})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedItem.moc.yeuCauDiem && (!hasEnoughEvals || !isScorePassed) && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-800 text-[11px]">
                    ⚠️ Chưa đủ điều kiện duyệt: cần tối thiểu 3 phiếu và điểm trung bình ≥ 7.0.
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleApprove}
                    disabled={!canApprove}
                    className={`w-full rounded-xl py-2.5 font-bold text-white flex items-center justify-center gap-1.5 ${
                      canApprove ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer" : "bg-slate-300 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    Phê Duyệt Mốc Đạt (PASSED)
                  </button>

                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 font-bold text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="size-4" />
                    Từ Chối Yêu Cầu Nộp Lại
                  </button>
                </div>
              </div>

              {/* Lịch sử nộp các lần trước */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Lịch Sử Nộp Hồ Sơ</span>
                {selectedItem.lichSuNop && selectedItem.lichSuNop.length > 0 ? (
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                    {selectedItem.lichSuNop.map((h: MilestoneSubmissionHistory, i: number) => (
                      <div key={i} className="text-[11px]">
                        <span className="font-bold text-slate-800">Lần {h.lanNop}</span> • {h.ngayNop}
                        {h.lyDoTuChoi && (
                          <p className="text-rose-600 mt-0.5 italic">Lý do từ chối: {h.lyDoTuChoi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">Đây là lần nộp đầu tiên.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NHẬP ĐIỂM CHUYÊN GIA */}
      <AddEvaluationModal
        isOpen={addEvalModalOpen}
        onClose={() => setAddEvalModalOpen(false)}
        onSubmit={handleAddEvaluation}
      />

      {/* MODAL 2: TỪ CHỐI MỐC */}
      <RejectMilestoneDialog
        item={selectedItem}
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />

      {/* MODAL 3: XEM NHANH QUYẾT ĐỊNH CĂN CỨ */}
      <DecisionPreviewModal
        decision={previewQd}
        isOpen={!!previewQd}
        onClose={() => setPreviewQd(null)}
      />
    </div>
  );
}
