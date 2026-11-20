"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Pencil, X } from "lucide-react";
import {
  useNcsCohorts,
  useNcsTrainingMajors,
  useUpdateAcademicStudentProfile,
} from "@/src/hooks/use-academic";
import type { StudentDossier } from "@/src/types/academic";
import type { UpdateNcsPayload } from "@/src/services/ncs";
import { ApiClientError } from "@/src/lib/api";
import { studentUpdateSchema } from "@/src/lib/schemas/student-update";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export interface StudentUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDossier | null;
  onSuccess?: (message: string) => void;
}

interface StudentUpdateForm {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: "" | "NAM" | "NU";
  email: string;
  soDienThoai: string;
  nganh: string;
  khoaHoc: string;
  lop: string;
}

const EMPTY_FORM: StudentUpdateForm = {
  hoTen: "", ngaySinh: "", gioiTinh: "", email: "", soDienThoai: "", nganh: "", khoaHoc: "", lop: "",
};

function dateInputValue(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function getFormFromStudent(student: StudentDossier): StudentUpdateForm {
  const raw = student.rawDetails ?? {};
  const nganh = raw.nganh as { maNganh?: string; tenNganh?: string } | undefined;
  const khoaHoc = raw.khoaHocNcs as { maKhoaHoc?: string } | undefined;
  const phone = typeof raw.soDienThoai === "string"
    ? raw.soDienThoai
    : typeof raw.sdt === "string"
      ? raw.sdt
      : typeof raw.phone === "string"
        ? raw.phone
        : student.phone;

  const phoneDigits = (phone ?? "").replace(/\D/g, "").slice(0, 10);

  return {
    hoTen: student.name ?? "",
    ngaySinh: dateInputValue(student.ngaySinh),
    gioiTinh: student.gioiTinh === "NAM" || student.gioiTinh === "NU" ? student.gioiTinh : "",
    email: typeof raw.email === "string" ? raw.email : "",
    soDienThoai: phone === "Chưa cập nhật" ? "" : phoneDigits,
    nganh: nganh?.maNganh || nganh?.tenNganh || student.department || "",
    khoaHoc: khoaHoc?.maKhoaHoc || student.cohort || "",
    lop: student.lop ?? "",
  };
}

const inputClassName = "mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#164E9B] focus:ring-2 focus:ring-[#164E9B]/15 disabled:bg-slate-100";
const labelClassName = "block text-xs font-semibold text-slate-700";

export function StudentUpdateModal({ isOpen, onClose, student, onSuccess }: StudentUpdateModalProps) {
  const updateMutation = useUpdateAcademicStudentProfile();
  const majorsQuery = useNcsTrainingMajors(isOpen);
  const cohortsQuery = useNcsCohorts(isOpen);
  const [form, setForm] = useState<StudentUpdateForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (student) setForm(getFormFromStudent(student));
    setFormErrors([]);
    setFormSuccess(null);
  }, [student, isOpen]);

  const initialForm = useMemo(() => student ? getFormFromStudent(student) : EMPTY_FORM, [student]);
  if (!isOpen || !student) return null;

  const setField = <K extends keyof StudentUpdateForm>(field: K, value: StudentUpdateForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors([]);
    setFormSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setFormSuccess(null);

    // Chỉ kiểm tra định dạng của các trường người dùng thay đổi; dữ liệu cũ
    // không hợp lệ ở trường khác không được chặn một cập nhật độc lập.
    const formToValidate = { ...form };
    (Object.keys(formToValidate) as (keyof StudentUpdateForm)[]).forEach((field) => {
      if (field !== "hoTen" && form[field] === initialForm[field]) {
        formToValidate[field] = "";
      }
    });
    const validation = studentUpdateSchema.safeParse(formToValidate);
    if (!validation.success) {
      setFormErrors(validation.error.issues.map((issue) => issue.message));
      return;
    }
    const validForm = validation.data;

    const values: UpdateNcsPayload = {};
    const changedValue = (field: Exclude<keyof StudentUpdateForm, "gioiTinh">) => {
      const value = validForm[field];
      return value && value !== initialForm[field] ? value : undefined;
    };
    const hoTen = changedValue("hoTen");
    const ngaySinh = changedValue("ngaySinh");
    const email = changedValue("email");
    const soDienThoai = changedValue("soDienThoai");
    const nganh = changedValue("nganh");
    const khoaHoc = changedValue("khoaHoc");
    const lop = changedValue("lop");
    if (hoTen) values.hoTen = hoTen;
    if (ngaySinh) values.ngaySinh = ngaySinh;
    if (email) values.email = email;
    if (soDienThoai) values.soDienThoai = soDienThoai;
    if (nganh) values.nganh = nganh;
    if (khoaHoc) values.khoaHoc = khoaHoc;
    if (lop) values.lop = lop;
    if (validForm.gioiTinh && validForm.gioiTinh !== initialForm.gioiTinh) values.gioiTinh = validForm.gioiTinh;

    if (!Object.keys(values).length) {
      setFormErrors(["Bạn chưa thay đổi thông tin nào."]);
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: student.id, data: values });
      const message = `Đã cập nhật thông tin NCS ${student.name} (${student.code}).`;
      setFormSuccess(message);
      onSuccess?.(message);
      window.setTimeout(onClose, 700);
    } catch (error) {
      if (error instanceof ApiClientError) setFormErrors(error.messages);
      else setFormErrors([error instanceof Error ? error.message : "Không thể cập nhật thông tin NCS. Vui lòng thử lại."]);
    }
  };

  const inputDisabled = updateMutation.isPending;
  const majorItems = (majorsQuery.data ?? []).map((major) => ({
    value: major.maNganh,
    label: `${major.maNganh} — ${major.tenNganh}`,
  }));
  const cohortItems = (cohortsQuery.data ?? []).map((cohort) => ({
    value: cohort.maKhoaHoc,
    label: cohort.namTuyenSinh
      ? `${cohort.maKhoaHoc} — Năm tuyển sinh ${cohort.namTuyenSinh}`
      : cohort.maKhoaHoc,
  }));
  const hasMajorError = formErrors.some((message) => /ngành/i.test(message));
  const hasCohortError = formErrors.some((message) => /khóa/i.test(message));
  const hasPhoneError = formErrors.some((message) => /điện thoại/i.test(message));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#164E9B] px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Pencil className="size-5" /></div>
            <div>
              <h2 className="text-base font-bold">Cập nhật thông tin NCS</h2>
              <p className="mt-0.5 text-xs text-white/80">{student.name} · {student.code}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={inputDisabled} aria-label="Đóng" className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-50">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto p-5 sm:p-6">
            <p className="mb-4 text-xs text-slate-500">Chỉ các trường đã thay đổi sẽ được gửi. Ngành và khóa học phải có trong danh mục của hệ thống.</p>
            {formErrors.length > 0 && <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><ul className="list-disc space-y-1 pl-4">{formErrors.map((message, index) => <li key={`${index}-${message}`}>{message}</li>)}</ul></div>}
            {formSuccess && <div role="status" className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /><span>{formSuccess}</span></div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={`${labelClassName} sm:col-span-2`}>Họ và tên
                <input className={inputClassName} value={form.hoTen} maxLength={100} required disabled={inputDisabled} onChange={(e) => setField("hoTen", e.target.value)} />
              </label>
              <label className={labelClassName}>Ngày sinh
                <input type="date" className={inputClassName} value={form.ngaySinh} disabled={inputDisabled} onChange={(e) => setField("ngaySinh", e.target.value)} />
              </label>
              <label className={labelClassName}>Giới tính
                <select className={inputClassName} value={form.gioiTinh} disabled={inputDisabled} onChange={(e) => setField("gioiTinh", e.target.value as StudentUpdateForm["gioiTinh"])}>
                  <option value="">Chưa cập nhật</option><option value="NAM">Nam</option><option value="NU">Nữ</option>
                </select>
              </label>
              <label className={labelClassName}>Email
                <input type="email" className={inputClassName} value={form.email} maxLength={100} disabled={inputDisabled} onChange={(e) => setField("email", e.target.value)} />
              </label>
              <label className={labelClassName}>Số điện thoại
                <input type="tel" inputMode="numeric" className={inputClassName} value={form.soDienThoai} maxLength={10} aria-invalid={hasPhoneError || undefined} disabled={inputDisabled} onChange={(e) => setField("soDienThoai", e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </label>
              <label className={labelClassName}>Ngành (mã hoặc tên trong danh mục)
                <Select items={majorItems} value={form.nganh || null} onValueChange={(value) => setField("nganh", value ?? "")}>
                  <SelectTrigger className={`${inputClassName} justify-between`} disabled={inputDisabled || majorsQuery.isPending} aria-invalid={hasMajorError || undefined}>
                    <SelectValue placeholder={majorsQuery.isPending ? "Đang tải danh sách ngành..." : "Chọn ngành đào tạo"}>
                      {(value) => majorItems.find((item) => item.value === value)?.label ?? form.nganh}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-64 rounded-xl border border-slate-200 bg-white shadow-xl text-xs">
                    {majorItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {majorsQuery.isError && <span className="mt-1 block text-xs font-normal text-rose-700">{majorsQuery.error.message}</span>}
              </label>
              <label className={labelClassName}>Khóa học (mã khóa trong danh mục)
                <Select items={cohortItems} value={form.khoaHoc || null} onValueChange={(value) => setField("khoaHoc", value ?? "")}>
                  <SelectTrigger className={`${inputClassName} justify-between`} disabled={inputDisabled || cohortsQuery.isPending} aria-invalid={hasCohortError || undefined}>
                    <SelectValue placeholder={cohortsQuery.isPending ? "Đang tải danh sách khóa..." : "Chọn khóa học"}>
                      {(value) => cohortItems.find((item) => item.value === value)?.label ?? form.khoaHoc}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-64 rounded-xl border border-slate-200 bg-white shadow-xl text-xs">
                    {cohortItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {cohortsQuery.isError && <span className="mt-1 block text-xs font-normal text-rose-700">{cohortsQuery.error.message}</span>}
              </label>
              <label className={labelClassName}>Lớp
                <input className={inputClassName} value={form.lop} maxLength={30} disabled={inputDisabled} onChange={(e) => setField("lop", e.target.value)} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <button type="button" onClick={onClose} disabled={inputDisabled} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">Hủy</button>
            <button type="submit" disabled={inputDisabled} className="inline-flex items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123E7C] disabled:cursor-not-allowed disabled:opacity-60">
              {inputDisabled && <Loader2 className="size-4 animate-spin" />}
              {inputDisabled ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentUpdateModal;
