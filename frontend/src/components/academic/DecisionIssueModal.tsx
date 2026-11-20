"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  FileText,
  Loader2,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { ApiClientError } from "@/src/lib/api";
import { useCreateDecision } from "@/src/hooks/use-academic";
import { useUploadDocument } from "@/src/hooks/api/use-documents";
import { decisionCreateFormSchema } from "@/src/lib/schemas/decision-create";
import type { DecisionType } from "@/src/services/decision";
import type { StudentDossier } from "@/src/types/academic";

export interface DecisionIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: StudentDossier | null;
  students?: StudentDossier[];
  onSuccess?: (message: string) => void;
}

const DECISION_TYPE_OPTIONS: {
  id: DecisionType;
  label: string;
  description: string;
  danger?: boolean;
  unavailable?: boolean;
}[] = [
  { id: "GIAO_DE_TAI", label: "Giao đề tài", description: "Ban hành quyết định giao đề tài luận án." },
  { id: "PHAN_CONG_GVHD", label: "Phân công GVHD", description: "Ghi nhận quyết định phân công giảng viên hướng dẫn." },
  { id: "THANH_LAP_TIEU_BAN", label: "Thành lập tiểu ban", description: "Thành lập tiểu ban chuyên môn." },
  { id: "CAN_CU_DUYET_MOC", label: "Căn cứ duyệt mốc", description: "Quyết định làm căn cứ công nhận kết quả mốc tiến độ." },
  { id: "CONG_NHAN_TOT_NGHIEP", label: "Công nhận tốt nghiệp", description: "Quyết định công nhận hoàn thành chương trình." },
  { id: "GIA_HAN", label: "Gia hạn", description: "Phải tạo qua quy trình xét duyệt đề nghị gia hạn của NCS.", danger: true, unavailable: true },
  { id: "BAO_LUU", label: "Bảo lưu", description: "Tạm dừng học tập theo quyết định." },
  { id: "NGUNG_HOC", label: "Ngừng học", description: "Chấm dứt học tập theo nguyện vọng." , danger: true },
  { id: "BUOC_THOI_HOC", label: "Buộc thôi học", description: "Chấm dứt học tập theo quy định.", danger: true },
  { id: "HOC_TIEP", label: "Học tiếp", description: "Cho phép NCS tiếp tục học tập sau bảo lưu." },
  { id: "KHAC", label: "Khác", description: "Quyết định học vụ khác." },
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function DecisionIssueModal({
  isOpen,
  onClose,
  selectedStudent,
  students = [],
  onSuccess,
}: DecisionIssueModalProps) {
  const createDecisionMutation = useCreateDecision();
  const uploadDocumentMutation = useUploadDocument();
  const availableStudents = useMemo(
    () => students.filter((student) => UUID_REGEX.test(student.id)),
    [students]
  );
  const [selectedNcsIds, setSelectedNcsIds] = useState<string[]>(() =>
    selectedStudent && UUID_REGEX.test(selectedStudent.id) ? [selectedStudent.id] : []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loai, setLoai] = useState<DecisionType>("CAN_CU_DUYET_MOC");
  const [soQuyetDinh, setSoQuyetDinh] = useState("");
  const [ngayQuyetDinh, setNgayQuyetDinh] = useState(new Date().toISOString().slice(0, 10));
  const [hanMoi, setHanMoi] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!query) return availableStudents;
    return availableStudents.filter((student) =>
      `${student.name} ${student.code} ${student.department}`.toLocaleLowerCase().includes(query)
    );
  }, [availableStudents, searchTerm]);

  const isClient = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  if (!isOpen || !isClient) return null;

  const isSubmitting = uploadDocumentMutation.isPending || createDecisionMutation.isPending;
  const toggleStudent = (studentId: string) => {
    setSelectedNcsIds((current) => current.includes(studentId)
      ? current.filter((id) => id !== studentId)
      : [...current, studentId]);
    setFormErrors([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors([]);

    const validation = decisionCreateFormSchema.safeParse({
      loai,
      soQuyetDinh,
      ngayQuyetDinh,
      ncsIds: selectedNcsIds,
      file: selectedFile,
      hanMoi,
      ghiChu,
    });
    if (!validation.success) {
      setFormErrors(validation.error.issues.map((issue) => issue.message));
      return;
    }

    const form = validation.data;
    try {
      setUploadProgress(0);
      const uploadedFile = await uploadDocumentMutation.mutateAsync({
        file: form.file,
        documentType: "QUYET_DINH",
        onUploadProgress: setUploadProgress,
      });

      const result = await createDecisionMutation.mutateAsync({
        loai: form.loai,
        soQuyetDinh: form.soQuyetDinh,
        ngayQuyetDinh: form.ngayQuyetDinh,
        ncsIds: form.ncsIds,
        fileId: uploadedFile.id,
        ...(form.ghiChu ? { ghiChu: form.ghiChu } : {}),
        ...(form.loai === "GIA_HAN" ? { hanMoi: form.hanMoi } : {}),
      });

      const warningText = result.canhBao.length ? ` ${result.canhBao.join("; ")}` : "";
      onSuccess?.(`Đã tạo quyết định ${form.soQuyetDinh} cho ${result.quyetDinhs.length} NCS.${warningText}`);
      onClose();
    } catch (error) {
      if (error instanceof ApiClientError) setFormErrors(error.messages);
      else setFormErrors([error instanceof Error ? error.message : "Không thể lưu quyết định. Vui lòng thử lại."]);
    }
  };

  return createPortal((
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex h-[92vh] max-h-[52rem] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Award className="size-5" /></div>
            <div>
              <h2 className="text-base font-bold">Ban hành Quyết định Học vụ</h2>
              <p className="text-xs text-white/80">Đính kèm văn bản đã ký và áp dụng cho một hoặc nhiều NCS</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Đóng" className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-xs">
            {formErrors.length > 0 && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                <ul className="list-disc space-y-1 pl-4">{formErrors.map((message, index) => <li key={`${index}-${message}`}>{message}</li>)}</ul>
              </div>
            )}

            <section>
              <label className="mb-1 block font-bold text-slate-700">Nghiên cứu sinh áp dụng <span className="text-rose-500">*</span></label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm theo họ tên hoặc mã NCS"
                  disabled={isSubmitting}
                  className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] disabled:opacity-60"
                />
              </div>
              <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                {filteredStudents.length ? filteredStudents.map((student) => (
                  <label key={student.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={selectedNcsIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      disabled={isSubmitting}
                      className="size-4 accent-[#164E9B]"
                    />
                    <span>{student.name} ({student.code}) — {student.department}</span>
                  </label>
                )) : <p className="p-2 text-slate-500">Không có NCS hợp lệ từ máy chủ phù hợp.</p>}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Đã chọn {selectedNcsIds.filter((id) => availableStudents.some((student) => student.id === id)).length} NCS</p>
            </section>

            <section>
              <label className="mb-1.5 block font-bold text-slate-700">Loại quyết định <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DECISION_TYPE_OPTIONS.map((type) => (
                  <label
                    key={type.id}
                    className={`relative flex flex-col rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-[#164E9B]/30 ${type.unavailable ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400" : `cursor-pointer ${loai === type.id ? type.danger ? "border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-500/20" : "border-[#164E9B] bg-blue-50/70 text-[#164E9B] ring-2 ring-[#164E9B]/20" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}`}
                  >
                    <input
                      type="radio"
                      name="loaiQuyetDinh"
                      value={type.id}
                      checked={loai === type.id}
                      disabled={isSubmitting || type.unavailable}
                      onChange={() => setLoai(type.id)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    />
                    <span className="font-bold">{type.label}</span>
                    <span className="mt-0.5 text-[10px] leading-snug text-slate-500">{type.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block font-bold text-slate-700">Số quyết định <span className="text-rose-500">*</span>
                <input type="text" value={soQuyetDinh} onChange={(event) => setSoQuyetDinh(event.target.value)} maxLength={50} disabled={isSubmitting} placeholder="Ví dụ: 1240/QĐ-ĐHAG" className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold outline-none focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] disabled:opacity-60" />
              </label>
              <label className="block font-bold text-slate-700">Ngày ký quyết định <span className="text-rose-500">*</span>
                <input type="date" value={ngayQuyetDinh} onChange={(event) => setNgayQuyetDinh(event.target.value)} disabled={isSubmitting} className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] disabled:opacity-60" />
              </label>
            </div>

            {loai === "GIA_HAN" && (
              <label className="block rounded-xl border border-amber-300 bg-amber-50 p-3 font-bold text-amber-900">Hạn mới
                <input type="date" value={hanMoi} onChange={(event) => setHanMoi(event.target.value)} disabled={isSubmitting} className="mt-1 h-9 w-full rounded-lg border border-amber-300 bg-white px-3 text-xs" />
                <span className="mt-1 block text-[11px] font-normal">Backend yêu cầu quyết định gia hạn phải được tạo qua quy trình duyệt đề nghị gia hạn; loại này hiện không thể tạo trực tiếp ở modal.</span>
              </label>
            )}

            <section>
              <label className="mb-1 block font-bold text-slate-700">File scan quyết định (PDF) <span className="text-rose-500">*</span></label>
              <label className={`relative flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#164E9B]/30 ${selectedFile ? "border-emerald-300 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}>
                {isSubmitting ? <Loader2 className="size-5 shrink-0 animate-spin text-[#164E9B]" /> : selectedFile ? <FileText className="size-5 shrink-0 text-emerald-700" /> : <UploadCloud className="size-5 shrink-0 text-slate-500" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-800">{selectedFile?.name ?? "Chọn file PDF đã ký"}</span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-500">Tối đa 15MB{uploadDocumentMutation.isPending ? ` · Đang tải ${uploadProgress}%` : ""}</span>
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  aria-label="Chọn file PDF đã ký"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  disabled={isSubmitting}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
              </label>
            </section>

            <label className="block font-bold text-slate-700">Ghi chú
              <textarea rows={2} value={ghiChu} onChange={(event) => setGhiChu(event.target.value)} maxLength={1000} disabled={isSubmitting} placeholder="Ghi chú hoặc căn cứ văn bản cấp trên" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-normal outline-none focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] disabled:opacity-60" />
            </label>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <span className="text-[11px] text-slate-500">Quyết định sẽ được lưu cùng file đính kèm.</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-50">Hủy bỏ</button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                <span>{uploadDocumentMutation.isPending ? "Đang tải file..." : createDecisionMutation.isPending ? "Đang lưu quyết định..." : "Lưu quyết định"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ), document.body);
}

export default DecisionIssueModal;
