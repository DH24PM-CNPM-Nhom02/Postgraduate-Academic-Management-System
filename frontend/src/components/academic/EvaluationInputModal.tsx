"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calculator,
} from "lucide-react";
import { useTriggerNotification } from "@/src/hooks/use-notifications";

export interface EvaluationItem {
  id: string;
  reviewerName: string;
  reviewerOrg?: string;
  score: number;
  comment?: string;
  fileName?: string;
  submittedAt: string;
}

export interface EvaluationInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentCode?: string;
  initialMilestone?: number;
  onSavedSuccess?: (evaluations: EvaluationItem[], avgScore: number) => void;
}

const DEFAULT_EVALUATIONS: Record<number, EvaluationItem[]> = {
  2: [
    {
      id: "eval-2-1",
      reviewerName: "PGS.TS. Huỳnh Văn Minh",
      reviewerOrg: "Trường ĐH Công nghệ Thông tin – ĐHQG-HCM",
      score: 8.5,
      comment: "Học phần phương pháp nghiên cứu nâng cao đạt xuất sắc, nắm vững kỹ thuật mô hình hóa.",
      fileName: "Phieu_Cham_HocPhanTS_MinhHV.pdf",
      submittedAt: "10/10/2026",
    },
    {
      id: "eval-2-2",
      reviewerName: "GS.TS. Lê Hoài Bắc",
      reviewerOrg: "Trường ĐH Khoa học Tự nhiên – ĐHQG-HCM",
      score: 8.0,
      comment: "Nắm vững lý thuyết cơ bản và thuật toán tối ưu, bài kiểm tra chuyên sâu làm tốt.",
      fileName: "Phieu_Cham_HocPhanTS_BacLH.pdf",
      submittedAt: "12/10/2026",
    },
  ],
  4: [
    {
      id: "eval-4-1",
      reviewerName: "TS. Nguyễn Thanh Bình",
      reviewerOrg: "Khoa CNTT – Trường ĐH An Giang",
      score: 7.5,
      comment: "Chuyên đề 2 giải quyết tốt bài toán phân loại đa nhãn, cần làm rõ thêm độ phức tạp thuật toán.",
      fileName: "Phieu_NX_ChuyenDe2_BinhNT.pdf",
      submittedAt: "18/10/2026",
    },
  ],
  5: [
    {
      id: "eval-5-1",
      reviewerName: "PGS.TS. Võ Văn Thắng",
      reviewerOrg: "Hội đồng Đề cương – ĐH An Giang",
      score: 9.0,
      comment: "Đề cương chi tiết mạch lạc, tính ứng dụng thực tiễn cao, phương pháp rõ ràng.",
      fileName: "Bien_Ban_HoiDongDeCuong_ThangVV.pdf",
      submittedAt: "22/10/2026",
    },
    {
      id: "eval-5-2",
      reviewerName: "PGS.TS. Nguyễn Văn Hùng",
      reviewerOrg: "ĐH Bách Khoa – ĐHQG-HCM",
      score: 8.5,
      comment: "Nội dung nghiên cứu khả thi, dự kiến hoàn thành đúng kế hoạch.",
      fileName: "Phieu_NX_DeCuong_HungNV.pdf",
      submittedAt: "23/10/2026",
    },
  ],
};

export function EvaluationInputModal({
  isOpen,
  onClose,
  studentName = "Nguyễn Văn An",
  studentCode = "NCS230104",
  initialMilestone = 2,
  onSavedSuccess,
}: EvaluationInputModalProps) {
  const triggerNotification = useTriggerNotification();

  const [milestone, setMilestone] = useState<number>(initialMilestone);
  const [evalList, setEvalList] = useState<EvaluationItem[]>(
    DEFAULT_EVALUATIONS[initialMilestone] || []
  );

  // Form states
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerOrg, setReviewerOrg] = useState("");
  const [score, setScore] = useState<string>("");
  const [comment, setComment] = useState("");
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Chuyển mốc
  const handleMilestoneChange = (newM: number) => {
    setMilestone(newM);
    setEvalList(DEFAULT_EVALUATIONS[newM] || []);
    setFormError(null);
  };

  // Tính toán điểm trung bình
  const avgScore = useMemo(() => {
    if (evalList.length === 0) return 0;
    const sum = evalList.reduce((acc, cur) => acc + cur.score, 0);
    return Math.round((sum / evalList.length) * 10) / 10;
  }, [evalList]);

  const isPass = avgScore >= 7.0 && evalList.length >= 3;

  if (!isOpen) return null;

  // Thêm phiếu nhận xét mới
  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      setFormError("Vui lòng nhập họ tên người chấm phiếu.");
      return;
    }
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setFormError("Điểm số phải là số hợp lệ từ 0.0 đến 10.0 (Thang điểm 10).");
      return;
    }

    const newEval: EvaluationItem = {
      id: `eval-${Date.now()}`,
      reviewerName: reviewerName.trim(),
      reviewerOrg: reviewerOrg.trim() || "Thành viên Tiểu ban chuyên môn",
      score: numScore,
      comment: comment.trim() || "Đã kiểm tra và đồng ý kết quả đánh giá.",
      fileName: fileName.trim() || `Phieu_Nhan_Xet_Moc${milestone}_${Date.now().toString().slice(-4)}.pdf`,
      submittedAt: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [...evalList, newEval];
    setEvalList(updated);

    // 1. Kích hoạt thông báo cho NCS (targetRole = 'student')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "CO_PHIEU_NHAN_XET_MOI",
      tieuDe: `Có phiếu nhận xét mới cho mốc ${milestone} của bạn`,
      noiDung: `Mốc ${milestone} của bạn đã có phiếu nhận xét mới từ ${newEval.reviewerName} với điểm số ${numScore.toFixed(1)}/10.`.replace(/\s+/g, " "),
      duLieu: {
        thuTu: milestone,
        tenNguoiCham: newEval.reviewerName,
        diem: numScore,
      },
      targetRole: "student",
      targetUrl: "/student/progress",
    });

    // 2. Kích hoạt thông báo cho GVHD (targetRole = 'supervisor')
    triggerNotification({
      nhom: "TIEN_DO",
      loai: "CO_PHIEU_NHAN_XET_MOI",
      tieuDe: `Có phiếu nhận xét mới cho mốc ${milestone} của NCS ${studentName}`,
      noiDung: `Mốc ${milestone} của NCS ${studentName} (${studentCode}) đã có phiếu nhận xét mới từ ${newEval.reviewerName} với điểm số ${numScore.toFixed(1)}/10.`.replace(/\s+/g, " "),
      duLieu: {
        thuTu: milestone,
        mshv: studentCode,
        tenNcs: studentName,
        tenNguoiCham: newEval.reviewerName,
        diem: numScore,
      },
      targetRole: "supervisor",
      targetUrl: "/supervisor/dashboard",
    });

    // Reset form
    setReviewerName("");
    setReviewerOrg("");
    setScore("");
    setComment("");
    setFileName("");
    setFormError(null);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);

    onSavedSuccess?.(updated, Math.round(((avgScore * evalList.length + numScore) / updated.length) * 10) / 10);
  };

  const handleRemove = (id: string) => {
    const updated = evalList.filter((e) => e.id !== id);
    setEvalList(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Nhập &amp; Thẩm định Phiếu Nhận Xét Điểm Số (Mốc 2, 4, 5)
              </h2>
              <p className="text-xs text-white/80">
                NCS: <strong className="text-white">{studentName}</strong> ({studentCode}) • Giáo vụ Sau Đại học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Milestone Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-2.5">
          <span className="text-xs font-bold text-slate-600 mr-2">Chọn mốc đánh giá:</span>
          {[
            { id: 2, label: "Mốc 2: Học phần TS bổ sung (Có điểm)" },
            { id: 4, label: "Mốc 4: Chuyên đề 2 (Có điểm)" },
            { id: 5, label: "Mốc 5: Bảo vệ đề cương (Có điểm)" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleMilestoneChange(m.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                milestone === m.id
                  ? "bg-[#164E9B] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Content Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form nhập phiếu (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4.5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Plus className="size-4 text-[#164E9B]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Thêm phiếu nhận xét mới
              </h3>
            </div>

            {isSuccessToast && (
              <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Đã ghi nhận phiếu &amp; kích hoạt thông báo tới NCS/GVHD!</span>
              </div>
            )}

            {formError && (
              <div className="rounded-lg border border-rose-300 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddEvaluation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ tên người chấm / Chuyên gia <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Ví dụ: PGS.TS. Huỳnh Văn Minh"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đơn vị công tác / Hội đồng:
                </label>
                <input
                  type="text"
                  value={reviewerOrg}
                  onChange={(e) => setReviewerOrg(e.target.value)}
                  placeholder="Ví dụ: ĐH Khoa học Tự nhiên – ĐHQG-HCM"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Điểm số (Thang 10) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Ví dụ: 8.5"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-[#164E9B] focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phiếu scan có chữ ký:
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Tên file đính kèm..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nhận xét tóm tắt / Ý kiến đánh giá:
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Đánh giá năng lực nghiên cứu, khối lượng hoàn thành..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#164E9B] py-2.5 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Ghi nhận Phiếu &amp; Kích hoạt Thông báo</span>
              </button>
            </form>
          </div>

          {/* Right Column: Tổng hợp quy chế & Danh sách phiếu (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Quy chế Compliance Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="size-4 text-[#164E9B]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#0F2744]">
                    Tổng hợp Kết quả Quy chế Đào tạo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      evalList.length >= 3
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {evalList.length} / 3 phiếu tối thiểu
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg bg-white p-3 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Điểm trung bình hiện tại
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#0F2744]">
                      {avgScore > 0 ? avgScore.toFixed(1) : "—"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">/ 10.0</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Yêu cầu điều kiện duyệt: ≥ 7.0
                  </span>
                </div>

                <div
                  className={`rounded-lg p-3 border ${
                    isPass
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                      : "bg-amber-50/80 border-amber-200 text-amber-900"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block">
                    Đủ điều kiện phê duyệt mốc
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {isPass ? (
                      <>
                        <CheckCircle2 className="size-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">
                          ĐẠT YÊU CẦU DUYỆT
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="size-5 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">
                          {evalList.length < 3
                            ? "CẦN BỔ SUNG ĐỦ 3 PHIẾU"
                            : "ĐIỂM TRUNG BÌNH < 7.0"}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {evalList.length < 3
                      ? `Còn thiếu ${3 - evalList.length} phiếu nhận xét`
                      : "Sẵn sàng để Hội đồng phê duyệt Đạt"}
                  </span>
                </div>
              </div>
            </div>

            {/* List of Existing Evaluations */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Danh sách {evalList.length} phiếu nhận xét đã nhập (Mốc {milestone})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Cập nhật tự động
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {evalList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Chưa có phiếu nhận xét nào được nhập cho mốc này.
                  </div>
                ) : (
                  evalList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 text-xs transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            #{idx + 1}. {item.reviewerName}
                          </span>
                          <span className="rounded bg-blue-100 text-[#164E9B] px-1.5 py-0.2 text-[10px] font-bold">
                            {item.score.toFixed(1)} / 10
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{item.reviewerOrg}</p>
                        {item.comment && (
                          <p className="text-[11px] text-slate-700 italic bg-white p-1.5 rounded border border-slate-100">
                            “{item.comment}”
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <FileText className="size-3" />
                          <span>{item.fileName}</span>
                          <span>•</span>
                          <span>{item.submittedAt}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa phiếu này"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <p className="text-xs text-slate-500">
            Dữ liệu phiếu nhận xét lưu trực tiếp vào CSDL và đồng bộ tới trang chi tiết NCS &amp; GVHD.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationInputModal;
