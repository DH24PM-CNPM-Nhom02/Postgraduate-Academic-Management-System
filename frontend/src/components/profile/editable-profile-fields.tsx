"use client";

import { useId, useState, type FormEvent } from "react";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { PROFILE_PHONE_PATTERN, PROFILE_PHONE_MESSAGE } from "@/src/lib/schemas/profile";
import { ProfileDetails } from "./profile-details";

type FieldName = "email" | "fullName" | "soDienThoai";
type ProfileValues = Partial<Record<FieldName, string | null>>;
type ProfileChanges = Partial<Record<FieldName, string>>;

const CONTACT_FIELDS = [
  { name: "email", label: "Email liên hệ", type: "email", autoComplete: "email", maxLength: 100 },
  { name: "soDienThoai", label: "Số điện thoại", type: "tel", autoComplete: "tel-national", maxLength: 10 },
] as const;

const ACCOUNT_FIELDS = [
  { name: "fullName", label: "Họ và tên", type: "text", autoComplete: "name", maxLength: 191 },
  { name: "email", label: "Email tài khoản", type: "email", autoComplete: "email", maxLength: 191 },
] as const;

const emailSchema = z.email();

function validateField(name: FieldName, value: string) {
  if (name === "email" && !emailSchema.safeParse(value).success) return "Vui lòng nhập email hợp lệ.";
  if (name === "soDienThoai" && !PROFILE_PHONE_PATTERN.test(value)) return PROFILE_PHONE_MESSAGE;
  if (name === "fullName" && !value) return "Vui lòng nhập họ và tên.";
}

export function EditableProfileFields({
  variant,
  values,
  onSave,
}: {
  variant: "contact" | "account";
  values: ProfileValues;
  onSave?: (changes: ProfileChanges) => Promise<unknown>;
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileChanges>({});
  const [errors, setErrors] = useState<ProfileChanges>({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const fields = variant === "account" ? ACCOUNT_FIELDS : CONTACT_FIELDS;
  const title = variant === "account" ? "Thông tin cá nhân" : "Thông tin liên hệ";

  function startEditing() {
    setDraft({});
    setErrors({});
    setSaveError("");
    setEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSave || saving) return;

    const changes: ProfileChanges = {};
    const fieldErrors: ProfileChanges = {};
    setSaveError("");
    for (const { name, label, maxLength } of fields) {
      const value = draft[name]?.trim();
      if (value === undefined || value === (values[name]?.trim() ?? "")) continue;
      const error = value.length > maxLength
        ? `${label} tối đa ${maxLength} ký tự.`
        : validateField(name, value);
      if (error) fieldErrors[name] = error;
      else changes[name] = value;
    }
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    if (!Object.keys(changes).length) {
      setSaveError("Thông tin chưa có thay đổi.");
      return;
    }

    setSaving(true);
    try {
      await onSave(changes);
      setEditing(false);
      toast.success("Đã cập nhật hồ sơ cá nhân.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Không thể cập nhật hồ sơ cá nhân.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onSave && !editing && (
          <Button type="button" variant="outline" onClick={startEditing}>
            <Pencil className="size-4" />Chỉnh sửa
          </Button>
        )}
      </div>
      {editing && onSave ? (
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ name, label, type, autoComplete, maxLength }) => {
              const fieldId = `${id}-${name}`;
              return (
                <div className="space-y-1.5" key={name}>
                  <label htmlFor={fieldId} className="text-sm font-medium">{label}</label>
                  <Input
                    id={fieldId}
                    type={type}
                    inputMode={type === "tel" ? "numeric" : undefined}
                    autoComplete={autoComplete}
                    value={draft[name] ?? values[name] ?? ""}
                    maxLength={maxLength}
                    disabled={saving}
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `${fieldId}-error` : undefined}
                    className="h-9"
                    onChange={(event) => {
                      const value = type === "tel" ? event.target.value.replace(/\D/g, "").slice(0, 10) : event.target.value;
                      setDraft((current) => ({ ...current, [name]: value }));
                      setErrors((current) => ({ ...current, [name]: undefined }));
                      setSaveError("");
                    }}
                  />
                  {errors[name] && <p id={`${fieldId}-error`} role="alert" className="text-sm text-destructive">{errors[name]}</p>}
                </div>
              );
            })}
          </div>
          {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      ) : (
        <ProfileDetails items={fields.map(({ name, label }) => ({ label, value: values[name] }))} />
      )}
    </div>
  );
}
