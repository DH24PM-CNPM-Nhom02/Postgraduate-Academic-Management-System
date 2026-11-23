"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Pencil, X } from "lucide-react";
import { ApiClientError } from "@/src/lib/api";
import { useAcademicSupervisorDetail, useUpdateAcademicSupervisor } from "@/src/hooks/use-academic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { supervisorUpdateSchema } from "@/src/lib/schemas/supervisor-update";
import type { BackendGvhdRaw, UpdateGvhdPayload } from "@/src/services/gvhd";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

export interface SupervisorUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: SupervisorQuotaRecord | null;
  onSuccess?: (message: string) => void;
}

interface SupervisorUpdateFormValues {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: "" | "NAM" | "NU";
  email: string;
  soDienThoai: string;
  hocHamHocVi: "" | "GIAO_SU" | "PHO_GIAO_SU" | "TIEN_SI_KHOA_HOC" | "TIEN_SI";
  chuyenNganh: string;
  donVi: string;
  quocGiaTotNghiep: string;
}

function getDateInput(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function getInitialForm(supervisor: BackendGvhdRaw): SupervisorUpdateFormValues {
  return {
    hoTen: supervisor.hoTen ?? "",
    ngaySinh: getDateInput(supervisor.ngaySinh),
    gioiTinh: supervisor.gioiTinh === "NAM" || supervisor.gioiTinh === "NU" ? supervisor.gioiTinh : "",
    email: supervisor.email ?? "",
    soDienThoai: supervisor.soDienThoai ?? "",
    hocHamHocVi: supervisor.hocHamHocVi === "GIAO_SU" || supervisor.hocHamHocVi === "PHO_GIAO_SU" || supervisor.hocHamHocVi === "TIEN_SI_KHOA_HOC" || supervisor.hocHamHocVi === "TIEN_SI"
      ? supervisor.hocHamHocVi
      : "",
    chuyenNganh: supervisor.chuyenNganh ?? "",
    donVi: supervisor.donVi?.id ?? "",
    quocGiaTotNghiep: supervisor.quocGiaTotNghiep ?? "",
  };
}

function SupervisorUpdateForm({
  supervisor,
  onClose,
  onSuccess,
}: {
  supervisor: BackendGvhdRaw;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}) {
  const updateMutation = useUpdateAcademicSupervisor();
  const [form, setForm] = useState<SupervisorUpdateFormValues>(() => getInitialForm(supervisor));
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const initialForm = getInitialForm(supervisor);
  const isPending = updateMutation.isPending;

  const setField = <K extends keyof SupervisorUpdateFormValues>(key: K, value: SupervisorUpdateFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormErrors([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors([]);

    if (initialForm.soDienThoai && !form.soDienThoai.trim()) {
      setFormErrors(["Số điện thoại không được để trống khi cập nhật."]);
      return;
    }

    const valuesToValidate = { ...form };
    (Object.keys(valuesToValidate) as (keyof SupervisorUpdateFormValues)[]).forEach((key) => {
      if (key !== "hoTen" && form[key] === initialForm[key]) valuesToValidate[key] = "";
    });
    const validation = supervisorUpdateSchema.safeParse(valuesToValidate);
    if (!validation.success) {
      setFormErrors(validation.error.issues.map((issue) => issue.message));
      return;
    }

    const value = validation.data;
    const data: UpdateGvhdPayload = {};
    if (value.hoTen && value.hoTen !== initialForm.hoTen) data.hoTen = value.hoTen;
    if (value.ngaySinh && value.ngaySinh !== initialForm.ngaySinh) data.ngaySinh = value.ngaySinh;
    if (value.gioiTinh && value.gioiTinh !== initialForm.gioiTinh) data.gioiTinh = value.gioiTinh;
    if (value.email && value.email !== initialForm.email) data.email = value.email;
    if (value.soDienThoai && value.soDienThoai !== initialForm.soDienThoai) data.soDienThoai = value.soDienThoai;
    if (value.hocHamHocVi && value.hocHamHocVi !== initialForm.hocHamHocVi) data.hocHamHocVi = value.hocHamHocVi;
    if (value.chuyenNganh && value.chuyenNganh !== initialForm.chuyenNganh) data.chuyenNganh = value.chuyenNganh;
    if (value.donVi && value.donVi !== initialForm.donVi) data.donVi = value.donVi;
    if (value.quocGiaTotNghiep && value.quocGiaTotNghiep !== initialForm.quocGiaTotNghiep) data.quocGiaTotNghiep = value.quocGiaTotNghiep;

    if (!Object.keys(data).length) {
      setFormErrors(["Bạn chưa thay đổi thông tin nào."]);
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: supervisor.id, data });
      onSuccess?.(`Đã cập nhật thông tin GVHD ${value.hoTen}.`);
      onClose();
    } catch (error) {
      if (error instanceof ApiClientError) setFormErrors(error.messages);
      else setFormErrors([error instanceof Error ? error.message : "Không thể cập nhật hồ sơ GVHD."]);
    }
  };

  const inputClass = "mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] disabled:opacity-60";
  const labelClass = "block font-bold text-slate-700";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-xs">
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-slate-700">
          <span className="font-semibold">Mã GVHD:</span> {supervisor.maGv || "Chưa có mã"}
          <span className="mx-2 text-slate-400">·</span>
          <span className="font-semibold">Đơn vị hiện tại:</span> {supervisor.donVi?.ten || "Chưa cập nhật"}
        </div>

        {formErrors.length > 0 && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <ul className="list-disc space-y-1 pl-4">{formErrors.map((message, index) => <li key={`${index}-${message}`}>{message}</li>)}</ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>Họ và tên <span className="text-rose-500">*</span>
            <input value={form.hoTen} maxLength={100} disabled={isPending} onChange={(event) => setField("hoTen", event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>Ngày sinh
            <input type="date" value={form.ngaySinh} disabled={isPending} onChange={(event) => setField("ngaySinh", event.target.value)} className={inputClass} />
          </label>
          <div>
            <label htmlFor="supervisor-update-gender" className={labelClass}>Giới tính</label>
            <Select
              items={[{ value: "NAM", label: "Nam" }, { value: "NU", label: "Nữ" }]}
              value={form.gioiTinh || null}
              onValueChange={(value) => setField("gioiTinh", (value ?? "") as SupervisorUpdateFormValues["gioiTinh"])}
            >
              <SelectTrigger id="supervisor-update-gender" className={`${inputClass} justify-between`} disabled={isPending}>
                <SelectValue placeholder="Chọn giới tính">{(value) => value === "NAM" ? "Nam" : value === "NU" ? "Nữ" : "Chưa cập nhật"}</SelectValue>
              </SelectTrigger>
              <SelectContent positionerClassName="isolate z-[70]" alignItemWithTrigger={false} className="rounded-lg border border-slate-200 bg-white text-xs shadow-xl">
                <SelectItem value="NAM">Nam</SelectItem>
                <SelectItem value="NU">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className={labelClass}>Email
            <input type="email" value={form.email} maxLength={100} disabled={isPending} onChange={(event) => setField("email", event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>Số điện thoại
            <input type="tel" inputMode="numeric" value={form.soDienThoai} maxLength={10} disabled={isPending} onChange={(event) => setField("soDienThoai", event.target.value.replace(/\D/g, "").slice(0, 10))} className={inputClass} />
          </label>
          <div>
            <label htmlFor="supervisor-update-degree" className={labelClass}>Học hàm / Học vị</label>
            <Select
              items={[
                { value: "GIAO_SU", label: "Giáo sư" },
                { value: "PHO_GIAO_SU", label: "Phó Giáo sư" },
                { value: "TIEN_SI_KHOA_HOC", label: "Tiến sĩ khoa học" },
                { value: "TIEN_SI", label: "Tiến sĩ" },
              ]}
              value={form.hocHamHocVi || null}
              onValueChange={(value) => setField("hocHamHocVi", (value ?? "") as SupervisorUpdateFormValues["hocHamHocVi"])}
            >
              <SelectTrigger id="supervisor-update-degree" className={`${inputClass} justify-between`} disabled={isPending}>
                <SelectValue placeholder="Chọn học hàm/học vị">{(value) => ({ GIAO_SU: "Giáo sư", PHO_GIAO_SU: "Phó Giáo sư", TIEN_SI_KHOA_HOC: "Tiến sĩ khoa học", TIEN_SI: "Tiến sĩ" }[String(value)] ?? "Chưa cập nhật")}</SelectValue>
              </SelectTrigger>
              <SelectContent positionerClassName="isolate z-[70]" alignItemWithTrigger={false} className="rounded-lg border border-slate-200 bg-white text-xs shadow-xl">
                <SelectItem value="GIAO_SU">Giáo sư</SelectItem>
                <SelectItem value="PHO_GIAO_SU">Phó Giáo sư</SelectItem>
                <SelectItem value="TIEN_SI_KHOA_HOC">Tiến sĩ khoa học</SelectItem>
                <SelectItem value="TIEN_SI">Tiến sĩ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className={labelClass}>Chuyên ngành
            <input value={form.chuyenNganh} maxLength={255} disabled={isPending} onChange={(event) => setField("chuyenNganh", event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>Mã đơn vị (ID trong danh mục)
            <input value={form.donVi} maxLength={36} disabled={isPending} onChange={(event) => setField("donVi", event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>Quốc gia tốt nghiệp
            <input value={form.quocGiaTotNghiep} maxLength={50} disabled={isPending} onChange={(event) => setField("quocGiaTotNghiep", event.target.value)} className={inputClass} />
          </label>
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Hủy</button>
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#123E7C] disabled:opacity-50">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}

export function SupervisorUpdateModal({ isOpen, onClose, supervisor, onSuccess }: SupervisorUpdateModalProps) {
  const detailQuery = useAcademicSupervisorDetail(supervisor?.id ?? null, isOpen);

  if (!isOpen || !supervisor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Pencil className="size-5" /></span>
            <div>
              <h2 className="text-base font-bold">Cập nhật thông tin GVHD</h2>
              <p className="text-xs text-white/80">{supervisor.name} · {supervisor.code}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"><X className="size-5" /></button>
        </div>

        {detailQuery.isPending ? (
          <div className="flex flex-1 items-center justify-center gap-2 p-10 text-sm text-slate-500"><Loader2 className="size-5 animate-spin" />Đang tải hồ sơ GVHD...</div>
        ) : detailQuery.data ? (
          <SupervisorUpdateForm key={detailQuery.data.id} supervisor={detailQuery.data} onClose={onClose} onSuccess={onSuccess} />
        ) : (
          <div className="p-6 text-sm text-rose-700">{detailQuery.error instanceof Error ? detailQuery.error.message : "Không thể tải hồ sơ GVHD."}</div>
        )}
      </div>
    </div>
  );
}

export default SupervisorUpdateModal;
