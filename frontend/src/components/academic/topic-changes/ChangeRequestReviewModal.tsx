"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "@base-ui/react/dialog";
import { FilePenLine, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import { useChangeRequestDetail } from "@/src/hooks/use-change-requests";
import { parseApiError } from "@/src/lib/api";
import { formatDate, formatDateTime } from "@/src/lib/utils";
import { DocumentService } from "@/src/services/document";
import type { ChangeRequestDetail } from "@/src/types/api/change-request";
import { ChangeRequestApprovalForm, ChangeRequestRejectionForm } from "./ChangeRequestApprovalForm";
import { REQUEST_STATUSES, REQUEST_TYPES, STUDY_STATUSES, supervisorName } from "./change-request-labels";

type PreviewFile = { id: string; title: string };
type Mode = "detail" | "approve" | "reject";

export function ChangeRequestReviewModal({
  id,
  onClose,
  area,
}: {
  id: string;
  onClose: () => void;
  area: "academic" | "admin";
}) {
  const [mode, setMode] = useState<Mode>("detail");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewFile | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const query = useChangeRequestDetail(id);
  const request = query.data;
  const type = REQUEST_TYPES.find((option) => option.value === request?.loai);
  const canReview = request?.trangThai === "CHO_DUYET";
  const currentMode = canReview ? mode : "detail";

  if (preview) {
    return <ChangeRequestPdfPreview key={preview.id} file={preview} onClose={closePreview} />;
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="flex shrink-0 items-center justify-between gap-3 bg-[#164E9B] px-5 py-4 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <FilePenLine aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <Dialog.Title className="text-base font-bold">
                  {currentMode === "approve" ? "Duyệt đề nghị" : currentMode === "reject" ? "Từ chối đề nghị" : "Chi tiết đề nghị điều chỉnh"}
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-white/85">
                  {request ? `${type?.label} · ${request.ncs.hoTen} · ${request.ncs.mshv}` : "Thông tin và hồ sơ kèm theo"}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close type="button" aria-label="Đóng" disabled={busy} className="shrink-0 rounded-lg p-1.5 text-white/85 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="min-h-0 overflow-y-auto p-5 sm:px-6">
            {query.isPending && <p role="status" className="flex items-center gap-2 text-sm text-slate-600"><Loader2 className="size-4 animate-spin" /> Đang tải chi tiết…</p>}
            {query.isError && (
              <div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {parseApiError(query.error).message}
                <Button type="button" variant="outline" onClick={() => void query.refetch()}>Thử lại</Button>
              </div>
            )}

            {request && currentMode === "approve" && (
              <ChangeRequestApprovalForm
                request={request}
                area={area}
                onBack={() => setMode("detail")}
                onSuccess={onClose}
                onBusyChange={setBusy}
              />
            )}
            {request && currentMode === "reject" && (
              <ChangeRequestRejectionForm request={request} onBack={() => setMode("detail")} onSuccess={onClose} onBusyChange={setBusy} />
            )}
            {request && currentMode === "detail" && (
              <div className="space-y-5">
                <RequestDetail request={request} onPreview={setPreview} />
              </div>
            )}
          </div>
          {request && currentMode === "detail" && (
            <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3.5 sm:px-6">
              <Dialog.Close render={<Button type="button" variant="outline" disabled={busy} />}>Đóng</Dialog.Close>
              {canReview && (
                <>
                  <Button type="button" variant="destructive" disabled={query.isError || busy} onClick={() => setMode("reject")}>Từ chối đề nghị</Button>
                  <Button type="button" className="bg-[#164E9B] text-white hover:bg-[#123E7C]" disabled={query.isError || busy} onClick={() => setMode("approve")}>Duyệt đề nghị</Button>
                </>
              )}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-sm font-medium wrap-anywhere text-slate-800">{children ?? "—"}</dd>
    </div>
  );
}

function ComparisonCard({ label, proposed = false, children }: { label: string; proposed?: boolean; children: ReactNode }) {
  return (
    <div className={`min-w-0 space-y-2 rounded-xl border p-4 ${proposed ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
      <h4 className={`text-xs font-semibold ${proposed ? "text-[#164E9B]" : "text-slate-600"}`}>{label}</h4>
      {children}
    </div>
  );
}

const ASSIGNMENT_ROLE = {
  HUONG_DAN_CHINH: "Hướng dẫn chính",
  DONG_HUONG_DAN: "Đồng hướng dẫn",
};

const DECISION_LABELS: Partial<Record<string, string>> = {
  GIAO_DE_TAI: "Giao đề tài",
  PHAN_CONG_GVHD: "Phân công GVHD",
  GIA_HAN: "Gia hạn học tập",
};

function RequestDetail({ request, onPreview }: { request: ChangeRequestDetail; onPreview: (file: PreviewFile) => void }) {
  const badge = REQUEST_STATUSES[request.trangThai];
  const latestDeadline = request.hanHienTai ?? request.ncs.hanGiaHan ?? request.ncs.hanChinhQuy;
  const accepted = request.xacNhanGvhds.filter((item) => item.dongY === true).length;
  const fileTitle = request.loai === "GIA_HAN" ? "Báo cáo tiến độ / minh chứng" : "Đơn đề nghị đính kèm";
  const decision = request.quyetDinh;
  const author = request.nguoiDeNghi;
  const student = request.ncs;
  const priorAssignment = request.phanCongCu;
  const proposedSupervisor = request.gvhdMoi;
  const currentThesis = request.deTaiHienTai;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badge.color}`}>{badge.label}</span>
        {request.batKhaKhang && <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">Bất khả kháng</span>}
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Thông tin đề nghị</h3>
        <dl className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
          <DetailField label="Ngày gửi">{formatDateTime(request.createdAt)}</DetailField>
          <DetailField label="Cập nhật lần cuối">{request.updatedAt ? formatDateTime(request.updatedAt) : "—"}</DetailField>
        </dl>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Người gửi đề nghị</h3>
        {author ? (
          <dl className="grid gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:grid-cols-2">
            <DetailField label="Họ và tên">{author.loai === "GVHD" ? supervisorName(author) : author.hoTen}</DetailField>
            <DetailField label="Vai trò">{author.loai === "NCS" ? "Nghiên cứu sinh" : "Giảng viên hướng dẫn"}</DetailField>
            {author.loai === "NCS" ? (
              <>
                <DetailField label="MSHV">{author.mshv}</DetailField>
                {author.khoaHoc && <DetailField label="Khóa học">{author.khoaHoc}</DetailField>}
              </>
            ) : (
              <>
                {author.maGv && <DetailField label="Mã giảng viên">{author.maGv}</DetailField>}
                {author.donVi && <DetailField label="Đơn vị công tác">{author.donVi.ten}</DetailField>}
                {author.chuyenNganh && <DetailField label="Chuyên ngành">{author.chuyenNganh}</DetailField>}
              </>
            )}
            {author.email && <DetailField label="Email">{author.email}</DetailField>}
          </dl>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Không tìm thấy hồ sơ của người gửi đề nghị.</p>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Nghiên cứu sinh của đề nghị</h3>
        <dl className="grid gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <DetailField label="Họ và tên">{student.hoTen}</DetailField>
          <DetailField label="MSHV">{student.mshv}</DetailField>
          <DetailField label="Email">{student.email}</DetailField>
          <DetailField label="Tình trạng học tập">{STUDY_STATUSES[student.trangThai] ?? student.trangThai}</DetailField>
          <DetailField label="Hạn học tập hiện tại">{latestDeadline ? formatDate(latestDeadline) : "—"}</DetailField>
          <DetailField label="Hạn chính quy">{student.hanChinhQuy ? formatDate(student.hanChinhQuy) : "—"}</DetailField>
          <DetailField label="Hạn đã được gia hạn">{student.hanGiaHan ? formatDate(student.hanGiaHan) : "—"}</DetailField>
          <DetailField label="Hạn đào tạo tối đa">{student.hanBuocThoiHoc ? formatDate(student.hanBuocThoiHoc) : "—"}</DetailField>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Nội dung đề nghị</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {request.loai === "DOI_DE_TAI" && (
            <>
              <ComparisonCard label="Đề tài hiện tại">
                <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-anywhere text-slate-800">{currentThesis?.tenDeTai ?? "—"}</p>
                {currentThesis && (
                  <dl className="space-y-2 border-t border-slate-200 pt-2">
                    <DetailField label="Trạng thái">Đang hiệu lực</DetailField>
                    {currentThesis.createdAt && <DetailField label="Ngày ghi nhận">{formatDateTime(currentThesis.createdAt)}</DetailField>}
                    {currentThesis.updatedAt && <DetailField label="Cập nhật lần cuối">{formatDateTime(currentThesis.updatedAt)}</DetailField>}
                    {currentThesis.ngayKetThuc && <DetailField label="Ngày kết thúc">{formatDate(currentThesis.ngayKetThuc)}</DetailField>}
                  </dl>
                )}
              </ComparisonCard>
              <ComparisonCard label="Đề tài đề xuất mới" proposed>
                <p className="whitespace-pre-wrap text-sm font-semibold leading-relaxed wrap-anywhere text-[#0F2744]">{request.tenDeTaiMoi ?? "—"}</p>
              </ComparisonCard>
            </>
          )}
          {request.loai === "DOI_GVHD" && (
            <>
              <ComparisonCard label="Giảng viên hướng dẫn cần thay">
                <p className="text-sm font-semibold wrap-anywhere">{supervisorName(priorAssignment?.gvhd)}</p>
                <dl className="space-y-2 border-t border-slate-200 pt-2">
                  <DetailField label="Email">{priorAssignment?.gvhd.email}</DetailField>
                  {priorAssignment && (
                    <>
                      <DetailField label="Vai trò">{ASSIGNMENT_ROLE[priorAssignment.vaiTro]}</DetailField>
                      <DetailField label="Trọng số">{priorAssignment.trongSo}</DetailField>
                      <DetailField label="Trạng thái phân công">{priorAssignment.trangThai === "DANG_HIEU_LUC" ? "Đang hiệu lực" : "Đã vô hiệu hóa"}</DetailField>
                      <DetailField label="Ngày bắt đầu">{priorAssignment.ngayBatDau ? formatDate(priorAssignment.ngayBatDau) : "—"}</DetailField>
                      <DetailField label="Ngày kết thúc">{priorAssignment.ngayKetThuc ? formatDate(priorAssignment.ngayKetThuc) : "—"}</DetailField>
                      {priorAssignment.createdAt && <DetailField label="Ngày ghi nhận">{formatDateTime(priorAssignment.createdAt)}</DetailField>}
                      {priorAssignment.updatedAt && <DetailField label="Cập nhật lần cuối">{formatDateTime(priorAssignment.updatedAt)}</DetailField>}
                    </>
                  )}
                </dl>
              </ComparisonCard>
              <ComparisonCard label="Giảng viên hướng dẫn đề xuất mới" proposed>
                <p className="text-sm font-semibold wrap-anywhere text-[#0F2744]">{supervisorName(proposedSupervisor)}</p>
                <dl className="space-y-2 border-t border-blue-200 pt-2">
                  <DetailField label="Email">{proposedSupervisor?.email}</DetailField>
                </dl>
              </ComparisonCard>
            </>
          )}
          {request.loai === "GIA_HAN" && (
            <>
              <ComparisonCard label="Hạn học tập hiện tại">
                <p className="text-sm font-semibold">{latestDeadline ? formatDate(latestDeadline) : "—"}</p>
                <dl>
                  <DetailField label="Đã gia hạn trước đây">{request.tongThangDaGiaHanTruoc == null ? "—" : `${request.tongThangDaGiaHanTruoc} tháng`}</DetailField>
                </dl>
              </ComparisonCard>
              <ComparisonCard label="Hạn học tập đề xuất mới" proposed>
                <p className="text-sm font-semibold text-[#0F2744]">{request.hanMoiDeNghi ? formatDate(request.hanMoiDeNghi) : "—"}</p>
                <dl>
                  <DetailField label="Số tháng xin gia hạn">{request.soThangGiaHan == null ? "—" : `${request.soThangGiaHan} tháng`}</DetailField>
                </dl>
              </ComparisonCard>
            </>
          )}
        </div>
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-xs font-semibold text-slate-700">Lý do đề nghị</h4>
          <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-anywhere text-slate-800">{request.lyDo}</p>
        </div>
        {request.fileId && (
          <Button type="button" variant="outline" onClick={() => onPreview({ id: request.fileId!, title: fileTitle })}>
            <FileText /> {fileTitle}
          </Button>
        )}
      </section>

      {request.xacNhanGvhds.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Ý kiến GVHD <span className="font-normal text-slate-500">({accepted}/{request.xacNhanGvhds.length} đồng ý)</span></h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {request.xacNhanGvhds.map((review) => (
              <li key={review.id} className="min-w-0 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="text-sm font-semibold wrap-anywhere text-slate-900">{supervisorName(review.gvhd)}</p>
                  <span className={review.dongY === null ? "text-slate-500" : review.dongY ? "text-emerald-700" : "text-rose-700"}>
                    {review.dongY === null ? "Chưa xác nhận" : review.dongY ? "Đồng ý" : "Không đồng ý"}
                  </span>
                </div>
                <dl className="space-y-2 border-t border-slate-200 pt-2">
                  <DetailField label="Email">{review.gvhd.email}</DetailField>
                  {review.ngayXacNhan && <DetailField label="Thời điểm xác nhận">{formatDateTime(review.ngayXacNhan)}</DetailField>}
                  {review.createdAt && <DetailField label="Ngày tạo yêu cầu xác nhận">{formatDateTime(review.createdAt)}</DetailField>}
                  {review.updatedAt && <DetailField label="Cập nhật lần cuối">{formatDateTime(review.updatedAt)}</DetailField>}
                  {review.nhanXet && <DetailField label="Nhận xét">{review.nhanXet}</DetailField>}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(request.lyDoTuChoi || decision || request.ngayDuyet) && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Kết quả xử lý</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            {request.ngayDuyet && <DetailField label="Thời điểm xử lý">{formatDateTime(request.ngayDuyet)}</DetailField>}
            {decision && (
              <>
                <DetailField label="Số quyết định">{decision.soQuyetDinh}</DetailField>
                <DetailField label="Ngày ký">{formatDate(decision.ngayQuyetDinh)}</DetailField>
                {decision.loai && <DetailField label="Loại quyết định">{DECISION_LABELS[decision.loai] ?? decision.loai}</DetailField>}
                {decision.trangThai && <DetailField label="Hiệu lực quyết định">{decision.trangThai === "HIEU_LUC" ? "Đang hiệu lực" : "Đã vô hiệu hóa"}</DetailField>}
                {decision.createdAt && <DetailField label="Thời điểm tạo quyết định">{formatDateTime(decision.createdAt)}</DetailField>}
                {decision.ghiChu && <DetailField label="Ghi chú quyết định">{decision.ghiChu}</DetailField>}
              </>
            )}
          </dl>
          {request.lyDoTuChoi && (
            <div className="space-y-1.5 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <h4 className="text-xs font-semibold text-rose-800">Lý do từ chối</h4>
              <p className="whitespace-pre-wrap text-sm wrap-anywhere text-rose-900">{request.lyDoTuChoi}</p>
            </div>
          )}
          {decision?.fileId && (
            <Button type="button" variant="outline" onClick={() => onPreview({ id: decision.fileId!, title: `Quyết định ${decision.soQuyetDinh}` })}>
              <FileText /> Xem quyết định PDF
            </Button>
          )}
        </section>
      )}
    </>
  );
}

function ChangeRequestPdfPreview({ file, onClose }: { file: PreviewFile; onClose: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ url?: string; error?: string }>({});

  useEffect(() => {
    let active = true;
    let url: string | undefined;
    void DocumentService.createPreviewUrl(file.id).then(({ objectUrl }) => {
      if (!active) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      url = objectUrl;
      setResult({ url });
    }).catch((error: unknown) => {
      if (active) setResult({ error: parseApiError(error).message });
    });

    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [attempt, file.id]);

  return createPortal(
    <PdfViewer
      isOpen
      onClose={onClose}
      title={file.title}
      fileName={`${file.title}.pdf`}
      fileUrl={result.url}
      error={result.error}
      isLoading={!result.url && !result.error}
      onRetry={() => { setResult({}); setAttempt((value) => value + 1); }}
    />,
    document.body,
  );
}
