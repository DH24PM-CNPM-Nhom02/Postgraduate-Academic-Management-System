"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
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
  Calendar,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { TablePagination } from "@/src/components/ui/table-pagination";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import {
  useApproveMilestone,
  useCreateEvaluation,
  useEvaluations,
  useMilestoneApprovalDecisions,
  useNcsProgress,
  usePendingMilestones,
  useRejectMilestone,
} from "@/src/hooks/api/use-progress";
import type { ApiClientError } from "@/src/lib/api";
import type {
  CreateEvaluationRequest,
  MilestoneDecisionApi,
  PendingMilestoneApi,
} from "@/src/types/api/progress";

const SO_PHIEU_TOI_THIEU = 3;
const DIEM_TOI_THIEU = 7;

/** Định dạng ISO / YYYY-MM-DD → dd/MM/yyyy (giờ Việt Nam) */
function formatDateVi(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

/** Hiển thị lỗi backend: message có thể là mảng (class-validator) */
function ErrorList({ error }: { error: ApiClientError | null }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-700 font-semibold">
      <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
      {error.messages.length > 1 ? (
        <ul className="list-disc pl-4 space-y-0.5">
          {error.messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : (
        <span>{error.message}</span>
      )}
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL NHẬP PHIẾU CHẤM ĐIỂM CHUYÊN GIA (MỐC 2, 4, 5)
   POST /progress/evidences/:minhChungId/evaluations
   ========================================================================= */
interface AddEvaluationModalProps {
  isOpen: boolean;
  minhChungId: string | null;
  ncsId?: string;
  onClose: () => void;
  onSaved: (message: string) => void;
}

function AddEvaluationModal({ isOpen, minhChungId, ncsId, onClose, onSaved }: AddEvaluationModalProps) {
  const [tenNguoiCham, setTenNguoiCham] = useState("");
  const [donViNguoiCham, setDonViNguoiCham] = useState("");
  const [diem, setDiem] = useState<string>("");
  const [nhanXet, setNhanXet] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Bước xác nhận: phiếu lưu xong không sửa/xóa được
  const [step, setStep] = useState<"form" | "confirm" | "duplicate">("form");

  const createMutation = useCreateEvaluation();

  if (!isOpen || !minhChungId) return null;

  const resetAndClose = () => {
    setTenNguoiCham("");
    setDonViNguoiCham("");
    setDiem("");
    setNhanXet("");
    setErrorMsg(null);
    setStep("form");
    createMutation.reset();
    onClose();
  };

  const buildPayload = (xacNhanTrung: boolean): CreateEvaluationRequest => ({
    tenNguoiCham: tenNguoiCham.trim(),
    donViNguoiCham: donViNguoiCham.trim() || undefined,
    diem: Number(diem),
    nhanXet: nhanXet.trim() || undefined,
    xacNhanTrung,
  });

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    createMutation.reset();

    const ten = tenNguoiCham.trim();
    if (!ten || ten.length > 150) {
      setErrorMsg("Họ tên người chấm bắt buộc, tối đa 150 ký tự.");
      return;
    }
    if (donViNguoiCham.trim().length > 255) {
      setErrorMsg("Đơn vị công tác tối đa 255 ký tự.");
      return;
    }
    const diemSo = Number(diem);
    if (diem === "" || Number.isNaN(diemSo) || diemSo < 0 || diemSo > 10 || !/^\d+(\.\d)?$/.test(diem.trim())) {
      setErrorMsg("Điểm số phải từ 0 đến 10 (tối đa 1 chữ số thập phân).");
      return;
    }
    if (nhanXet.trim().length > 2000) {
      setErrorMsg("Nhận xét tối đa 2000 ký tự.");
      return;
    }
    setStep("confirm");
  };

  const handleSave = (xacNhanTrung: boolean) => {
    createMutation.mutate(
      { minhChungId, ncsId, payload: buildPayload(xacNhanTrung) },
      {
        onSuccess: (res) => {
          onSaved(
            `Đã lưu phiếu của ${res.phieu.tenNguoiCham} (${Number(res.phieu.diem)} điểm) • ${res.tongHop.soPhieu}/${res.tongHop.soPhieuToiThieu} phiếu.`
          );
          resetAndClose();
        },
        onError: (err) => {
          if (err.status === 409 && err.code === "PHIEU_TRUNG_NGUOI_CHAM") {
            setStep("duplicate");
          }
        },
      }
    );
  };

  const isPending = createMutation.isPending;
  const showApiError =
    createMutation.error && !(createMutation.error.code === "PHIEU_TRUNG_NGUOI_CHAM" && step === "duplicate")
      ? createMutation.error
      : null;

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
          <button onClick={resetAndClose} disabled={isPending} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleValidate} className="p-5 space-y-3.5 text-xs">
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
                maxLength={150}
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
                maxLength={255}
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
                onChange={(e) => setDiem(e.target.value)}
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
                maxLength={2000}
                placeholder="Nội dung đánh giá, góp ý chuyên môn..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#164E9B] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#164E9B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer"
              >
                Tiếp tục xác nhận
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 space-y-3.5 text-xs">
            {step === "duplicate" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <p className="font-bold">Đã có phiếu cùng tên và đơn vị người chấm.</p>
                <p className="mt-1">Đây có phải là một người chấm khác trùng tên không? Chọn &ldquo;Vẫn lưu phiếu&rdquo; để xác nhận.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <p className="font-bold">Xác nhận thông tin trước khi lưu</p>
                <p className="mt-1">Phiếu nhận xét sau khi lưu sẽ <strong>không thể sửa hoặc xóa</strong>.</p>
              </div>
            )}

            <dl className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <dt className="text-slate-500">Người chấm</dt>
              <dd className="col-span-2 font-bold text-slate-800">{tenNguoiCham.trim()}</dd>
              <dt className="text-slate-500">Đơn vị</dt>
              <dd className="col-span-2 text-slate-800">{donViNguoiCham.trim() || "—"}</dd>
              <dt className="text-slate-500">Điểm</dt>
              <dd className="col-span-2 font-bold text-slate-800">{Number(diem)} / 10</dd>
              <dt className="text-slate-500">Nhận xét</dt>
              <dd className="col-span-2 text-slate-700 whitespace-pre-line">{nhanXet.trim() || "—"}</dd>
            </dl>

            <ErrorList error={showApiError} />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  createMutation.reset();
                  setStep("form");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-60"
              >
                Quay lại sửa
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleSave(step === "duplicate")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E9B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer disabled:opacity-60"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                {step === "duplicate" ? "Vẫn lưu phiếu" : "Lưu Phiếu Chấm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   SUB-COMPONENT: MODAL TỪ CHỐI MỐC (BẮT BUỘC LÝ DO)
   POST /progress/reviews/:tienTrinhId/reject
   ========================================================================= */
interface RejectMilestoneDialogProps {
  item: PendingMilestoneApi | null;
  isOpen: boolean;
  onClose: () => void;
  onRejected: (message: string) => void;
}

function RejectMilestoneDialog({ item, isOpen, onClose, onRejected }: RejectMilestoneDialogProps) {
  const [lyDo, setLyDo] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const rejectMutation = useRejectMilestone();

  if (!isOpen || !item) return null;

  const handleClose = () => {
    if (rejectMutation.isPending) return;
    setLyDo("");
    setErrorMsg(null);
    rejectMutation.reset();
    onClose();
  };

  const handleConfirm = () => {
    const text = lyDo.trim();
    if (!text) {
      setErrorMsg("Vui lòng nhập lý do từ chối mốc (1 - 1000 ký tự).");
      return;
    }
    if (text.length > 1000) {
      setErrorMsg("Lý do không được vượt quá 1000 ký tự.");
      return;
    }
    rejectMutation.mutate(
      { tienTrinhId: item.id, lyDo: text, ncsId: item.ncs.id },
      {
        onSuccess: () => {
          onRejected(`Đã từ chối mốc ${item.moc.thuTu} của NCS ${item.ncs.hoTen}.`);
          setLyDo("");
          setErrorMsg(null);
          rejectMutation.reset();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/75 px-5 py-3.5">
          <div className="flex items-center gap-2 text-rose-800">
            <XCircle className="size-5 text-rose-600" />
            <h3 className="text-sm font-bold">Từ Chối Mốc Tiến Độ</h3>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600 cursor-pointer">
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

          <ErrorList error={rejectMutation.error} />
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex justify-end gap-2.5">
          <button onClick={handleClose} disabled={rejectMutation.isPending} className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-60">
            Đóng
          </button>
          <button
            onClick={handleConfirm}
            disabled={rejectMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer disabled:opacity-60"
          >
            {rejectMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
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
  decision: MilestoneDecisionApi | null;
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
              <p className="text-xs text-slate-500">
                Căn cứ pháp lý duyệt mốc {decision.ncsId ? "(riêng NCS)" : "(quyết định chung)"}
              </p>
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
                <span>{formatDateVi(decision.ngayQuyetDinh)}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Loại quyết định</span>
              <span className="font-bold text-[#164E9B]">{decision.loai}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1 font-medium">Trích yếu / Ghi chú</span>
            <p className="rounded-xl border border-slate-200 p-3 bg-white text-slate-700 leading-relaxed whitespace-pre-line">
              {decision.ghiChu || "Không có ghi chú."}
            </p>
          </div>

          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="font-semibold text-slate-700">Bản scan quyết định</span>
            {decision.fileId ? (
              <DocumentViewButton fileId={decision.fileId} fileName={`${decision.soQuyetDinh}.pdf`} variant="link" />
            ) : (
              <span className="text-slate-400 italic">Không đính kèm file</span>
            )}
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
  const pendingQuery = usePendingMilestones();
  const items = useMemo(() => pendingQuery.data ?? [], [pendingQuery.data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // States khi duyệt / từ chối / chấm điểm
  const [selectedQuyetDinhId, setSelectedQuyetDinhId] = useState("");
  // Gắn modal nhập phiếu với đúng tienTrinhId (cùng cách với rejectTargetId): đổi mốc hoặc mốc rời
  // hàng chờ thì modal tự đóng; `key` theo id tạo instance mới, không giữ form / lỗi / pending cũ
  const [evalTargetId, setEvalTargetId] = useState<string | null>(null);
  // Gắn dialog từ chối với đúng tienTrinhId: đổi mốc hoặc mốc rời hàng chờ (409) thì dialog tự đóng,
  // và `key` theo id buộc tạo instance mới (không giữ lý do / lỗi mutation của lần trước)
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [previewQd, setPreviewQd] = useState<MilestoneDecisionApi | null>(null);

  // Mốc đang thẩm định luôn lấy từ dữ liệu server mới nhất (tự đóng khi mốc rời hàng chờ)
  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedId) ?? null,
    [items, selectedId]
  );
  const minhChungId = selectedItem?.minhChungMoiNhat?.id ?? null;

  const evaluationsQuery = useEvaluations(minhChungId, Boolean(selectedItem?.moc.yeuCauDiem));
  const ncsProgressQuery = useNcsProgress(selectedItem?.ncs.id);
  const decisionsQuery = useMilestoneApprovalDecisions(Boolean(selectedItem));
  const approveMutation = useApproveMilestone();

  // Timer tự đóng toast: hủy timer cũ khi có toast mới, và hủy khi unmount (không setState sau unmount)
  const toastTimerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null;
      setToastMessage(null);
    }, 4000);
  };

  const selectItem = (id: string | null) => {
    setSelectedId(id);
    setSelectedQuyetDinhId("");
    approveMutation.reset();
  };

  // Lọc danh sách hàng chờ (client-side, BE trả toàn bộ mảng khi không truyền page/limit)
  const filteredItems = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return items.filter((it) => {
      const matchSearch =
        !keyword ||
        it.ncs.hoTen.toLowerCase().includes(keyword) ||
        it.ncs.mshv.toLowerCase().includes(keyword) ||
        it.moc.tenMoc.toLowerCase().includes(keyword);

      const matchMilestone =
        milestoneFilter === "all" || it.moc.thuTu.toString() === milestoneFilter;

      return matchSearch && matchMilestone;
    });
  }, [items, searchText, milestoneFilter]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Thống kê nhanh (chỉ dựa trên dữ liệu hàng chờ: số phiếu đếm từ `_count`)
  const stats = useMemo(() => {
    return {
      total: items.length,
      requiresScore: items.filter((it) => it.moc.yeuCauDiem).length,
      enoughEvaluations: items.filter(
        (it) =>
          !it.moc.yeuCauDiem ||
          (it.minhChungMoiNhat?._count.phieuNhanXets ?? 0) >= SO_PHIEU_TOI_THIEU
      ).length,
    };
  }, [items]);

  // Chỉ số điểm của mốc đang xem (lấy `tongHop` do server tính)
  const tongHop = evaluationsQuery.data?.tongHop;
  const currentEvals = evaluationsQuery.data?.phieus ?? [];
  const evalCount = tongHop?.soPhieu ?? 0;
  const soPhieuToiThieu = tongHop?.soPhieuToiThieu ?? SO_PHIEU_TOI_THIEU;
  const hasEnoughEvals = Boolean(tongHop?.duPhieu);
  const avgScore = tongHop?.diemTrungBinh ?? null;
  const isScorePassed = avgScore !== null && avgScore >= DIEM_TOI_THIEU;

  // Lọc quyết định căn cứ hợp lệ cho NCS này: riêng NCS hoặc quyết định chung
  const validDecisions = useMemo(() => {
    if (!selectedItem) return [];
    return (decisionsQuery.data ?? []).filter(
      (d) => d.ncsId === selectedItem.ncs.id || d.ncsId === null
    );
  }, [decisionsQuery.data, selectedItem]);

  // Lịch sử nộp của chính mốc đang duyệt (từ GET /progress/ncs/:ncsId)
  const currentMilestoneHistory = useMemo(() => {
    if (!selectedItem) return [];
    const tienTrinh = ncsProgressQuery.data?.tienTrinhs.find((t) => t.id === selectedItem.id);
    return [...(tienTrinh?.minhChungs ?? [])].sort((a, b) => b.lanNop - a.lanNop);
  }, [ncsProgressQuery.data, selectedItem]);

  const scoreConditionOk =
    !selectedItem?.moc.yeuCauDiem || (hasEnoughEvals && isScorePassed);

  const canApprove =
    selectedQuyetDinhId !== "" &&
    scoreConditionOk &&
    !approveMutation.isPending &&
    (!selectedItem?.moc.yeuCauDiem || evaluationsQuery.isSuccess);

  // Handler duyệt mốc
  const handleApprove = () => {
    if (!selectedItem || !canApprove) return;
    const qd = validDecisions.find((d) => d.id === selectedQuyetDinhId);

    approveMutation.mutate(
      {
        tienTrinhId: selectedItem.id,
        quyetDinhId: selectedQuyetDinhId,
        ncsId: selectedItem.ncs.id,
      },
      {
        onSuccess: (res) => {
          showToast(
            `Đã duyệt mốc ${selectedItem.moc.thuTu} cho NCS ${selectedItem.ncs.hoTen} theo QĐ ${qd?.soQuyetDinh ?? ""}.` +
              (res.mocKeTiep ? ` Mốc ${res.mocKeTiep} đã được mở.` : " NCS đã hoàn thành mốc cuối.")
          );
          selectItem(null);
        },
      }
    );
  };

  const isInitialLoading = pendingQuery.isLoading;

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
          <button
            type="button"
            onClick={() => pendingQuery.refetch()}
            disabled={pendingQuery.isFetching}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-4 text-[#164E9B] ${pendingQuery.isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
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
          <span className="text-2xl font-black text-slate-900 mt-1 block">{isInitialLoading ? "…" : stats.total}</span>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs">
          <span className="text-amber-700 text-xs block font-bold">Mốc Yêu Cầu Chấm Điểm (Mốc 2,4,5)</span>
          <span className="text-2xl font-black text-amber-800 mt-1 block">{isInitialLoading ? "…" : stats.requiresScore}</span>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
          <span className="text-emerald-700 text-xs block font-bold">Đủ Phiếu Hoặc Không Yêu Cầu Điểm</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{isInitialLoading ? "…" : stats.enoughEvaluations}</span>
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
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên NCS, MSHV hoặc tên mốc..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden"
            />
          </div>

          <select
            value={milestoneFilter}
            onChange={(e) => {
              setMilestoneFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#164E9B] focus:outline-hidden bg-white text-slate-700 font-medium"
          >
            <option value="all">Tất cả các mốc (2 - 9)</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 2} value={(i + 2).toString()}>
                Mốc {i + 2}
              </option>
            ))}
          </select>
        </div>

        {/* Bảng hàng chờ */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Mốc</th>
                <th className="px-4 py-3">NCS / Mã Học Viên</th>
                <th className="px-4 py-3">Lần Nộp</th>
                <th className="px-4 py-3">Phiếu Chấm (Mốc 2,4,5)</th>
                <th className="px-4 py-3">Ngày Nộp</th>
                <th className="px-4 py-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isInitialLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Đang tải hàng chờ duyệt...
                    </span>
                  </td>
                </tr>
              ) : pendingQuery.isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="inline-flex flex-col items-center gap-2 text-rose-700">
                      <span className="font-semibold">{pendingQuery.error.message}</span>
                      <button
                        type="button"
                        onClick={() => pendingQuery.refetch()}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        Thử lại
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    {items.length === 0
                      ? "Không có hồ sơ nào trong hàng chờ duyệt."
                      : "Không có hồ sơ phù hợp với bộ lọc."}
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const reqScore = item.moc.yeuCauDiem;
                  const soPhieu = item.minhChungMoiNhat?._count.phieuNhanXets ?? 0;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/50"
                      }`}
                      onClick={() => selectItem(item.id)}
                    >
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100/70 px-2 py-1 text-[#164E9B]">
                          <FileCheck2 className="size-3.5" />
                          <span>Mốc {item.moc.thuTu}: {item.moc.tenMoc}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{item.ncs.hoTen}</div>
                        <div className="text-[10px] text-slate-400">
                          MSHV: {item.ncs.mshv}{item.ncs.lop ? ` • Lớp: ${item.ncs.lop}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {item.minhChungMoiNhat ? `Lần ${item.minhChungMoiNhat.lanNop}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {reqScore ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              soPhieu >= SO_PHIEU_TOI_THIEU
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            Phiếu: {soPhieu}/{SO_PHIEU_TOI_THIEU}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Không yêu cầu</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDateVi(item.minhChungMoiNhat?.ngayNop ?? item.submittedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectItem(item.id);
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

        {/* Phân trang danh sách hàng chờ */}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="hồ sơ mốc"
          className="pt-2"
        />
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
                Học viên: <strong className="text-slate-800">{selectedItem.ncs.hoTen}</strong> (MSHV: {selectedItem.ncs.mshv}) • Lớp: {selectedItem.ncs.lop ?? "—"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => selectItem(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Đóng Thẩm Định
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột trái: Minh chứng & Phiếu chấm */}
            <div className="lg:col-span-8 space-y-6">
              {/* Khối 1: Minh chứng */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="size-4 text-[#164E9B]" /> Minh Chứng Đính Kèm
                </h3>
                {selectedItem.minhChungMoiNhat ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Minh chứng lần nộp {selectedItem.minhChungMoiNhat.lanNop}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Nộp ngày: {formatDateVi(selectedItem.minhChungMoiNhat.ngayNop)} • Trạng thái: Chờ duyệt
                      </span>
                      {selectedItem.minhChungMoiNhat.ghiChuNcs && (
                        <p className="mt-1 text-slate-600 italic">Ghi chú NCS: {selectedItem.minhChungMoiNhat.ghiChuNcs}</p>
                      )}
                      {selectedItem.moc.thuTu === 8 && (
                        <p className="mt-1 text-[11px] text-slate-500">Mốc 8: 1 file PDF gộp tất cả bài báo.</p>
                      )}
                    </div>
                    <DocumentViewButton
                      fileId={selectedItem.minhChungMoiNhat.fileId}
                      fileName={`Minh_chung_moc_${selectedItem.moc.thuTu}_lan_${selectedItem.minhChungMoiNhat.lanNop}.pdf`}
                    />
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Không tìm thấy lần nộp đang chờ duyệt.</p>
                )}
              </div>

              {/* Khối 2: Phiếu chấm chuyên gia (Mốc 2, 4, 5) */}
              {selectedItem.moc.yeuCauDiem ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="size-4 text-[#164E9B]" /> Phiếu Nhận Xét &amp; Chấm Điểm
                      </h3>
                      <p className="text-[11px] text-slate-500">Yêu cầu tối thiểu {soPhieuToiThieu} phiếu và điểm trung bình ≥ {DIEM_TOI_THIEU}.0</p>
                    </div>
                    <button
                      onClick={() => setEvalTargetId(selectedItem.id)}
                      disabled={!minhChungId}
                      className="rounded-xl bg-[#164E9B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] cursor-pointer disabled:opacity-60"
                    >
                      + Nhập Phiếu Chấm
                    </button>
                  </div>

                  {evaluationsQuery.isLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="size-4 animate-spin" /> Đang tải phiếu nhận xét...
                    </div>
                  ) : evaluationsQuery.isError ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-700">
                      <span className="font-semibold">{evaluationsQuery.error.message}</span>
                      <button onClick={() => evaluationsQuery.refetch()} className="font-bold hover:underline cursor-pointer">
                        Thử lại
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Tóm tắt điểm */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                          <span className="text-slate-500 block text-[11px]">Số phiếu</span>
                          <strong className="text-lg text-slate-800">{evalCount} / {soPhieuToiThieu}</strong>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                          <span className="text-slate-500 block text-[11px]">Điểm trung bình</span>
                          <strong className={`text-lg ${isScorePassed ? "text-emerald-700" : "text-amber-700"}`}>
                            {avgScore !== null ? avgScore.toFixed(2) : "—"} / 10
                          </strong>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-center text-center">
                          {hasEnoughEvals ? (
                            isScorePassed ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="size-3.5" /> Đạt (≥ {DIEM_TOI_THIEU}.0)
                              </span>
                            ) : (
                              <span className="text-rose-700 font-bold flex items-center gap-1">
                                <XCircle className="size-3.5" /> Dưới {DIEM_TOI_THIEU}.0
                              </span>
                            )
                          ) : (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <AlertCircle className="size-3.5" /> Cần thêm {Math.max(0, soPhieuToiThieu - evalCount)} phiếu
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Danh sách phiếu */}
                      <div className="space-y-2">
                        {currentEvals.length === 0 ? (
                          <p className="text-slate-400 italic">Chưa có phiếu nhận xét nào cho lần nộp này.</p>
                        ) : (
                          currentEvals.map((ev) => (
                            <div key={ev.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex justify-between items-start">
                              <div>
                                <div className="font-bold text-slate-800">
                                  {ev.tenNguoiCham} {ev.donViNguoiCham && <span className="font-normal text-slate-500">({ev.donViNguoiCham})</span>}
                                </div>
                                {ev.nhanXet && <p className="text-slate-600 mt-1 italic">&ldquo;{ev.nhanXet}&rdquo;</p>}
                                <p className="text-[10px] text-slate-400 mt-1">Nhập ngày {formatDateVi(ev.createdAt)}</p>
                              </div>
                              <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-black text-emerald-800 shrink-0">
                                {Number(ev.diem)}đ
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
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
                  {decisionsQuery.isError ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-700">
                      <span>{decisionsQuery.error.message}</span>
                      <button onClick={() => decisionsQuery.refetch()} className="font-bold hover:underline cursor-pointer">
                        Thử lại
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedQuyetDinhId}
                      onChange={(e) => setSelectedQuyetDinhId(e.target.value)}
                      disabled={decisionsQuery.isLoading}
                      className="w-full rounded-xl border border-slate-200 p-2 focus:border-[#164E9B] focus:outline-hidden bg-white"
                    >
                      <option value="">
                        {decisionsQuery.isLoading
                          ? "Đang tải quyết định..."
                          : validDecisions.length === 0
                            ? "-- Không có quyết định CAN_CU_DUYET_MOC hiệu lực --"
                            : "-- Chọn quyết định hiệu lực --"}
                      </option>
                      {validDecisions.map((qd) => (
                        <option key={qd.id} value={qd.id}>
                          {qd.soQuyetDinh} ({formatDateVi(qd.ngayQuyetDinh)}){qd.ncsId === null ? " • Chung" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedItem.moc.yeuCauDiem && evaluationsQuery.isSuccess && !scoreConditionOk && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-800 text-[11px]">
                    {!hasEnoughEvals
                      ? `⚠️ Chưa đủ điều kiện duyệt: cần thêm ${Math.max(0, soPhieuToiThieu - evalCount)} phiếu.`
                      : `⚠️ Điểm trung bình dưới ${DIEM_TOI_THIEU}.0: server sẽ từ chối duyệt, chỉ có thể Từ chối mốc.`}
                  </div>
                )}

                <ErrorList error={approveMutation.error} />

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleApprove}
                    disabled={!canApprove}
                    className={`w-full rounded-xl py-2.5 font-bold text-white flex items-center justify-center gap-1.5 ${
                      canApprove ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer" : "bg-slate-300 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {approveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Phê Duyệt Mốc Đạt (PASSED)
                  </button>

                  <button
                    onClick={() => setRejectTargetId(selectedItem.id)}
                    disabled={approveMutation.isPending}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 font-bold text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <XCircle className="size-4" />
                    Từ Chối Yêu Cầu Nộp Lại
                  </button>
                </div>
              </div>

              {/* Lịch sử nộp các lần trước (GET /progress/ncs/:ncsId) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Lịch Sử Nộp Hồ Sơ</span>
                {ncsProgressQuery.isLoading ? (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="size-3.5 animate-spin" /> Đang tải lịch sử...
                  </span>
                ) : ncsProgressQuery.isError ? (
                  <div className="flex items-center justify-between gap-2 text-rose-700">
                    <span>{ncsProgressQuery.error.message}</span>
                    <button onClick={() => ncsProgressQuery.refetch()} className="font-bold hover:underline cursor-pointer">
                      Thử lại
                    </button>
                  </div>
                ) : currentMilestoneHistory.length > 1 ? (
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                    {currentMilestoneHistory.map((h) => (
                      <div key={h.id} className="text-[11px]">
                        <span className="font-bold text-slate-800">Lần {h.lanNop}</span> • {formatDateVi(h.ngayNop)} •{" "}
                        <span className="text-slate-500">{h.trangThai}</span>
                        {h.lyDoTuChoi && (
                          <p className="text-rose-600 mt-0.5 italic">Lý do từ chối: {h.lyDoTuChoi}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">Đây là lần nộp đầu tiên của mốc này.</p>
                )}

                {ncsProgressQuery.data && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1.5">Tiến trình 9 mốc</span>
                    <div className="flex flex-wrap gap-1">
                      {ncsProgressQuery.data.tienTrinhs.map((t) => (
                        <span
                          key={t.id}
                          title={`${t.moc.tenMoc} • ${t.trangThai}`}
                          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${
                            t.trangThai === "PASSED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : t.trangThai === "PENDING_REVIEW"
                                ? "border-blue-200 bg-blue-50 text-[#164E9B]"
                                : t.trangThai === "REJECTED"
                                  ? "border-rose-200 bg-rose-50 text-rose-700"
                                  : "border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          M{t.moc.thuTu}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NHẬP ĐIỂM CHUYÊN GIA */}
      <AddEvaluationModal
        key={evalTargetId ?? "eval-none"}
        isOpen={evalTargetId !== null && evalTargetId === selectedItem?.id}
        minhChungId={minhChungId}
        ncsId={selectedItem?.ncs.id}
        onClose={() => setEvalTargetId(null)}
        onSaved={showToast}
      />

      {/* MODAL 2: TỪ CHỐI MỐC */}
      <RejectMilestoneDialog
        item={selectedItem}
        key={rejectTargetId ?? "reject-none"}
        isOpen={rejectTargetId !== null && rejectTargetId === selectedItem?.id}
        onClose={() => setRejectTargetId(null)}
        onRejected={(msg) => {
          showToast(msg);
          selectItem(null);
        }}
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
