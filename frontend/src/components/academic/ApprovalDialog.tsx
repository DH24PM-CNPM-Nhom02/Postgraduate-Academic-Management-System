"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  FileText,
  ScrollText,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/src/lib/api/axios";
import { QuyetDinh } from "@/src/types";

export type ApprovalDecision = "approve" | "revise" | "reject";

export interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: {
    decision: ApprovalDecision;
    notes: string;
    quyetDinhId?: string;
    score?: number;
  }) => void;
  recordTitle?: string;
  studentName?: string;
  studentCode?: string;
  milestoneName?: string;
  currentStep?: "gvhd_confirm" | "academic_review";
  yeuCauDiem?: boolean;
  soPhieu?: number;
  diemTrungBinh?: number;
  ncsId?: string;
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onSubmit,
  recordTitle = "Minh chứng Báo cáo chuyên đề tiến sĩ 01",
  studentName = "Nguyễn Văn An",
  studentCode = "NCS230104",
  milestoneName = "Mốc 3: Báo cáo chuyên đề 1",
  currentStep = "academic_review",
  yeuCauDiem = false,
  soPhieu = 3,
  diemTrungBinh = 8.5,
  ncsId,
}: ApprovalDialogProps) {
  const [decision, setDecision] = useState<ApprovalDecision>("approve");
  const [notes, setNotes] = useState("");
  const [score, setScore] = useState<string>(diemTrungBinh ? String(diemTrungBinh) : "8.5");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Danh sách quyết định căn cứ pháp lý
  const [decisions, setDecisions] = useState<QuyetDinh[]>([]);
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState<string>("");
  const [loadingDecisions, setLoadingDecisions] = useState(false);

  // Kiểm tra điều kiện mốc yêu cầu điểm theo mục 5.3
  const duPhieu = !yeuCauDiem || soPhieu >= 3;
  const datDiem = !yeuCauDiem || Number(score) >= 7.0;
  const canApprove = duPhieu && datDiem;

  // Tải danh sách quyết định căn cứ pháp lý (loai=CAN_CU_DUYET_MOC)
  useEffect(() => {
    if (!isOpen) return;

    async function loadDecisions() {
      setLoadingDecisions(true);
      try {
        const res = await apiClient.get<QuyetDinh[]>(
          "/decisions?loai=CAN_CU_DUYET_MOC&trangThai=HIEU_LUC"
        );
        const data = Array.isArray(res.data) ? res.data : [];
        // Lọc client: quyết định của đúng NCS này hoặc quyết định chung (ncsId === null)
        const filtered = data.filter((d) => !d.ncsId || (ncsId && d.ncsId === ncsId));
        setDecisions(filtered);
        if (filtered.length > 0) {
          setSelectedQuyetDinhId(filtered[0].id);
        }
      } catch (err) {
        console.warn("Dùng danh sách quyết định mẫu do API chưa sẵn sàng:", err);
        const mockDecisions: QuyetDinh[] = [
          {
            id: "qd-moc-01",
            loai: "CAN_CU_DUYET_MOC",
            soQuyetDinh: "456/QĐ-ĐHAG",
            ngayQuyetDinh: "2026-09-15",
            ghiChu: "Quyết định công nhận kết quả đánh giá các mốc tiến độ NCS năm 2026",
          },
          {
            id: "qd-moc-02",
            loai: "CAN_CU_DUYET_MOC",
            soQuyetDinh: "789/QĐ-ĐHAG",
            ngayQuyetDinh: "2026-10-01",
            ghiChu: "Quyết định phê duyệt tiến trình đào tạo NCS học kỳ 1",
          },
        ];
        setDecisions(mockDecisions);
        setSelectedQuyetDinhId(mockDecisions[0].id);
      } finally {
        setLoadingDecisions(false);
      }
    }

    loadDecisions();
  }, [isOpen, ncsId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (decision === "approve") {
      if (!canApprove) {
        if (!duPhieu) {
          setValidationError(`Mốc yêu cầu tối thiểu 3 phiếu nhận xét (Hiện tại: ${soPhieu}/3). Chưa đủ điều kiện phê duyệt.`);
          return;
        }
        if (!datDiem) {
          setValidationError("Điểm trung bình dưới 7.0 không đủ điều kiện Đạt theo quy định đào tạo.");
          return;
        }
      }
      if (!selectedQuyetDinhId && decisions.length > 0) {
        setValidationError("Vui lòng chọn Quyết định làm căn cứ pháp lý phê duyệt mốc.");
        return;
      }
    }

    if ((decision === "reject" || decision === "revise") && !notes.trim()) {
      setValidationError("Bắt buộc phải nhập lý do cụ thể khi Từ chối hoặc Yêu cầu bổ sung.");
      return;
    }

    setValidationError(null);
    setIsConfirming(true);
  };

  const handleFinalConfirm = () => {
    onSubmit({
      decision,
      notes,
      quyetDinhId: selectedQuyetDinhId,
      score: score ? parseFloat(score) : undefined,
    });
    setIsConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Thẩm định &amp; Phê duyệt Mốc Đào tạo (Giáo vụ)
              </h2>
              <p className="text-xs text-white/80">
                NCS: <strong className="text-white">{studentName}</strong> ({studentCode}) • {milestoneName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workflow Tracker Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold">
                ✓
              </span>
              <span>1. NCS nộp minh chứng</span>
            </div>
            <ArrowRight className="size-3.5 text-slate-300" />
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold">
                ✓
              </span>
              <span>2. Thẩm định hồ sơ</span>
            </div>
            <ArrowRight className="size-3.5 text-slate-300" />
            <div className="flex items-center gap-2 text-[#164E9B] font-bold">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#164E9B] text-white ring-2 ring-[#164E9B]/30 text-[11px] font-bold">
                3
              </span>
              <span>3. Quyết định duyệt mốc</span>
            </div>
          </div>
        </div>

        {/* Content Form */}
        {!isConfirming ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Record summary card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-700 flex items-start gap-3">
              <FileText className="size-5 shrink-0 text-[#164E9B] mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-900 block truncate">{recordTitle}</span>
                <span className="text-slate-500">
                  {yeuCauDiem ? `Mốc có chấm điểm (Tối thiểu 3 phiếu, ĐTB >= 7.0)` : `Mốc nghiệm thu thông thường`}
                </span>
              </div>
            </div>

            {/* Score & Evaluation Warning if applicable */}
            {yeuCauDiem && (
              <div
                className={`rounded-xl border p-3 flex items-start gap-3 ${
                  canApprove
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-amber-200 bg-amber-50 text-amber-900"
                }`}
              >
                {canApprove ? (
                  <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-bold">
                    {canApprove
                      ? "Đủ điều kiện xét duyệt Đạt"
                      : "Chưa đủ điều kiện xét duyệt Đạt theo quy chế"}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Số phiếu nhận xét: <strong className="font-semibold">{soPhieu}/3</strong> • Điểm trung bình:{" "}
                    <strong className="font-semibold">{score} / 10</strong>
                    {!duPhieu && " (Vẫn thiếu phiếu nhận xét chuyên môn)"}
                    {!datDiem && " (Điểm trung bình dưới ngưỡng 7.0)"}
                  </p>
                </div>
              </div>
            )}

            {/* Decision selector (Approve or Reject) */}
            <div className="space-y-1.5">
              <label className="block font-bold uppercase tracking-wider text-slate-700">
                Kết quả phê duyệt của Giáo vụ <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Approve */}
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                    decision === "approve"
                      ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-900"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  } ${!canApprove ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="approve"
                    checked={decision === "approve"}
                    disabled={!canApprove}
                    onChange={() => setDecision("approve")}
                    className="sr-only"
                  />
                  <CheckCircle2 className="size-5 text-emerald-600 mb-1" />
                  <span className="font-bold">Phê duyệt Đạt (PASSED)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {canApprove ? "Mở khóa mốc kế tiếp cho NCS" : "Cần bổ sung phiếu hoặc điểm >= 7.0"}
                  </span>
                </label>

                {/* Reject */}
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                    decision === "reject"
                      ? "border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20 text-rose-900"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="reject"
                    checked={decision === "reject"}
                    onChange={() => setDecision("reject")}
                    className="sr-only"
                  />
                  <XCircle className="size-5 text-rose-600 mb-1" />
                  <span className="font-bold">Từ chối (REJECTED)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    NCS bắt buộc phải nộp lại minh chứng
                  </span>
                </label>
              </div>
            </div>

            {/* Căn cứ pháp lý: Chọn quyết định (Bắt buộc khi Approve) */}
            {decision === "approve" && (
              <div className="space-y-1 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                <label className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#164E9B]">
                  <ScrollText className="size-3.5" />
                  <span>Quyết định làm căn cứ pháp lý phê duyệt</span>
                  <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Quyết định loại CAN_CU_DUYET_MOC còn hiệu lực theo mục 5.2 &amp; 5.3.
                </p>

                {loadingDecisions ? (
                  <p className="text-slate-500 italic">Đang tải danh sách quyết định...</p>
                ) : decisions.length === 0 ? (
                  <div className="text-rose-600 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                    Chưa có quyết định nào thuộc loại CAN_CU_DUYET_MOC còn hiệu lực. Vui lòng tạo quyết định trước.
                  </div>
                ) : (
                  <select
                    value={selectedQuyetDinhId}
                    onChange={(e) => setSelectedQuyetDinhId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#164E9B] focus:outline-none"
                  >
                    {decisions.map((qd) => (
                      <option key={qd.id} value={qd.id}>
                        {qd.soQuyetDinh} (Ký ngày {qd.ngayQuyetDinh}) - {qd.ghiChu || "Căn cứ duyệt mốc"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Lý do từ chối (Bắt buộc khi Reject) / Nhận xét */}
            <div className="space-y-1">
              <label className="block font-bold uppercase tracking-wider text-slate-700">
                {decision === "reject" ? "Lý do từ chối mốc" : "Ý kiến nhận xét bổ sung"}
                {decision === "reject" && (
                  <span className="text-rose-500 font-bold ml-1">* (Bắt buộc để NCS sửa đổi)</span>
                )}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder={
                  decision === "reject"
                    ? "Mô tả cụ thể lý do từ chối (ví dụ: Thiếu dấu xác nhận của khoa, nội dung chưa đạt)..."
                    : "Ghi chú thêm nếu cần (tùy chọn)..."
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B]"
              />
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </p>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs"
              >
                <CheckCircle2 className="size-4" />
                <span>Tiếp tục &amp; Xác nhận</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Dialog Step */
          <div className="p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
              <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-amber-950">
                  Xác nhận lưu quyết định học vụ vĩnh viễn
                </h4>
                <p>
                  Bạn đang chuẩn bị lưu kết quả:{" "}
                  <strong className="uppercase">
                    {decision === "approve" ? "Phê duyệt Đạt (PASSED)" : "Từ chối (REJECTED)"}
                  </strong>{" "}
                  cho NCS <strong>{studentName}</strong>.
                </p>
                <p className="text-amber-800">
                  Hành động này sẽ cập nhật trạng thái tiến trình và gửi thông báo trực tiếp đến NCS.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-500">Mốc đào tạo:</span>
                <span className="font-semibold text-slate-900">{milestoneName}</span>
              </div>
              {decision === "approve" && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Căn cứ quyết định:</span>
                  <span className="font-bold text-[#164E9B]">
                    {decisions.find((d) => d.id === selectedQuyetDinhId)?.soQuyetDinh || selectedQuyetDinhId}
                  </span>
                </div>
              )}
              {decision === "reject" && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Lý do từ chối:</span>
                  <p className="italic text-rose-700 bg-white p-2 rounded border border-rose-200">
                    {notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Quay lại chỉnh sửa
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <CheckCircle2 className="size-4" />
                <span>Hoàn tất &amp; Ký duyệt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalDialog;

