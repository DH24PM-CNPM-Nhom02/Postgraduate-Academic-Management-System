"use client";

import { useRef, useState, type FormEvent } from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useCreateUsers } from "@/src/hooks/api/use-users";
import type { CreateUserInput } from "@/src/types/api/user";
import { UserCredentials } from "./user-credentials";
import { UserDialog, UserDialogError, userPrimaryButton } from "./user-dialog";
import { SYSTEM_ROLE_META } from "./user-meta";

const createRoles = ["GIAO_VU", "ADMIN"] as const satisfies readonly CreateUserInput["role"][];
const createRoleOptions = createRoles.map((role) => ({ value: role, label: SYSTEM_ROLE_META[role].label }));

const userSchema = z.object({
  username: z.string().trim().toLowerCase()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự.")
    .regex(/^[a-z0-9._-]+$/, "Chỉ dùng chữ cái, số, dấu chấm, gạch dưới hoặc gạch nối."),
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự."),
  email: z.string().trim().toLowerCase().pipe(
    z.union([z.literal(""), z.email("Email không đúng định dạng.")])
  ),
  role: z.enum(createRoles),
});

type Draft = z.input<typeof userSchema> & { id: number };
type DraftErrors = Partial<Record<"username" | "email" | "fullName", string>>;

const emptyDraft = (id: number): Draft => ({ id, username: "", fullName: "", email: "", role: "GIAO_VU" });

const fields = [
  { name: "username", label: "Tên đăng nhập", placeholder: "Ví dụ: ncs2026001" },
  { name: "fullName", label: "Họ và tên", placeholder: "Nhập họ và tên" },
  { name: "email", label: "Email (tùy chọn)", placeholder: "name@example.com" },
] as const;

function validateDrafts(drafts: Draft[]) {
  const usernames = new Set<string>();
  const emails = new Set<string>();
  const errors: Record<number, DraftErrors> = {};
  const users: CreateUserInput[] = [];

  for (const draft of drafts) {
    const { success, data, error } = userSchema.safeParse(draft);
    if (!success) {
      const { fieldErrors } = z.flattenError(error);
      errors[draft.id] = {
        username: fieldErrors.username?.[0],
        fullName: fieldErrors.fullName?.[0],
        email: fieldErrors.email?.[0],
      };
      continue;
    }

    const { username, fullName, email, role } = data;
    const duplicateUsername = usernames.has(username);
    const duplicateEmail = Boolean(email && emails.has(email));
    if (duplicateUsername || duplicateEmail) {
      errors[draft.id] = {
        username: duplicateUsername ? "Tên đăng nhập bị trùng trong danh sách." : undefined,
        email: duplicateEmail ? "Email bị trùng trong danh sách." : undefined,
      };
    }
    usernames.add(username);
    if (email) emails.add(email);
    users.push({ username, fullName, email: email || undefined, role });
  }

  return { users, errors };
}

interface CreateUserModalProps {
  onClose: () => void;
}

export function CreateUserModal({ onClose }: CreateUserModalProps) {
  const [drafts, setDrafts] = useState(() => [emptyDraft(1)]);
  const [errors, setErrors] = useState<Record<number, DraftErrors>>({});
  const nextId = useRef(2);
  const createUsers = useCreateUsers();
  const { isPending, data: credentials, error } = createUsers;

  function updateDraft(id: number, changes: Partial<Omit<Draft, "id">>) {
    setDrafts((previous) => previous.map((draft) => draft.id === id ? { ...draft, ...changes } : draft));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    createUsers.reset();
    const result = validateDrafts(drafts);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) return;

    createUsers.mutate(result.users, {
      onSuccess: (created) => {
        toast.success(`Đã tạo ${created.length} tài khoản.`);
      },
    });
  }

  return (
    <UserDialog
      title={credentials ? "Mật khẩu khởi tạo" : "Tạo tài khoản"}
      description={credentials ? `Đã tạo ${credentials.length} tài khoản.` : "Cấp tài khoản Quản trị viên hoặc Giáo vụ. Tài khoản NCS/GVHD được cấp khi nhập hồ sơ."}
      onClose={onClose}
      pending={isPending}
      preserveResult={Boolean(credentials)}
      wide
    >
      {credentials ? (
        <UserCredentials credentials={credentials} />
      ) : (
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {error && <UserDialogError message={error.message} />}
          {drafts.map((draft, index) => (
            <fieldset
              key={draft.id}
              disabled={isPending}
              className="space-y-3 rounded-xl border border-slate-200 px-3.5 pb-3.5 sm:px-4"
            >
              <legend className="px-1.5 text-xs font-bold text-slate-700">Tài khoản {index + 1}</legend>
              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                {fields.map(({ name, label, placeholder }) => {
                  const id = `new-user-${draft.id}-${name}`;
                  const fieldError = errors[draft.id]?.[name];

                  return (
                    <div key={name} className="space-y-1.5">
                      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">{label}</label>
                      <Input
                        id={id}
                        type={name === "email" ? "email" : "text"}
                        autoComplete="off"
                        value={draft[name]}
                        placeholder={placeholder}
                        aria-invalid={Boolean(fieldError)}
                        aria-describedby={fieldError ? `${id}-error` : undefined}
                        onChange={(event) => {
                          updateDraft(draft.id, { [name]: event.target.value });
                          if (fieldError) {
                            setErrors((previous) => ({
                              ...previous,
                              [draft.id]: { ...previous[draft.id], [name]: undefined },
                            }));
                          }
                        }}
                      />
                      {fieldError && <p id={`${id}-error`} role="alert" className="text-xs text-rose-700">{fieldError}</p>}
                    </div>
                  );
                })}
                <div className="space-y-1.5">
                  <label htmlFor={`new-user-${draft.id}-role`} className="block text-xs font-semibold text-slate-700">Vai trò</label>
                  <Select
                    items={createRoleOptions}
                    value={draft.role}
                    disabled={isPending}
                    onValueChange={(role) => {
                      if (role) updateDraft(draft.id, { role });
                    }}
                  >
                    <SelectTrigger id={`new-user-${draft.id}-role`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]">
                      {createRoleOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {drafts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrafts((previous) => previous.filter(({ id }) => id !== draft.id))}
                  aria-label={`Xóa tài khoản ${index + 1} khỏi danh sách`}
                  className="text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 aria-hidden="true" /> Xóa dòng
                </Button>
              )}
            </fieldset>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                const draft = emptyDraft(nextId.current++);
                setDrafts((previous) => [...previous, draft]);
              }}
            >
              <Plus aria-hidden="true" /> Thêm một tài khoản
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Hủy</Button>
              <Button type="submit" disabled={isPending} className={userPrimaryButton}>
                <UserPlus aria-hidden="true" /> {isPending ? "Đang tạo…" : "Tạo tài khoản"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </UserDialog>
  );
}
