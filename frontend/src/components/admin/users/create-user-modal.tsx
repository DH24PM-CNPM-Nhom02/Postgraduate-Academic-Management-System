"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSpreadsheet,
  RefreshCw,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { CreateUserFormValues, SystemRole } from "@/src/types/ui/admin";
import { generateStrongPassword, SYSTEM_ROLE_META } from "./user-meta";

export interface BulkImportUserDraft {
  username: string;
  fullName: string;
  email: string;
  studentCode: string;
  department: string;
  role: "NCS";
  mustChangePassword: true;
}

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSingle: (
    values: CreateUserFormValues & { mustChangePassword: boolean }
  ) => void | Promise<void>;
  onImportBatch?: (
    users: BulkImportUserDraft[],
    fileName: string
  ) => void | Promise<void>;
  existingUsernames?: string[];
  isSubmitting?: boolean;
}

type ModalTab = "single" | "batch";

const SAMPLE_BATCH_NCS: BulkImportUserDraft[] = [
  {
    username: "ncs2026011",
    fullName: "Trần Minh Nhật",
    email: "tmnhat.ncs2026011@agu.edu.vn",
    studentCode: "NCS2026011",
    department: "Khoa Công nghệ Thông tin",
    role: "NCS",
    mustChangePassword: true,
  },
  {
    username: "ncs2026012",
    fullName: "Nguyễn Ngọc Bảo Trân",
    email: "nnbtran.ncs2026012@agu.edu.vn",
    studentCode: "NCS2026012",
    department: "Khoa Nông nghiệp - Tài nguyên Thiên nhiên",
    role: "NCS",
    mustChangePassword: true,
  },
  {
    username: "ncs2026013",
    fullName: "Lê Hoàng Phúc",
    email: "lhphuc.ncs2026013@agu.edu.vn",
    studentCode: "NCS2026013",
    department: "Khoa Kinh tế - Quản trị Kinh doanh",
    role: "NCS",
    mustChangePassword: true,
  },
  {
    username: "ncs2026014",
    fullName: "Phạm Quỳnh Anh",
    email: "pqanh.ncs2026014@agu.edu.vn",
    studentCode: "NCS2026014",
    department: "Khoa Sư phạm",
    role: "NCS",
    mustChangePassword: true,
  },
];

function parseCsvRows(rawText: string): BulkImportUserDraft[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const rows: BulkImportUserDraft[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 3) continue;
    const [studentCode, fullName, email, department] = cols;
    if (!fullName || !email) continue;
    const cleanCode = (studentCode || `NCS2026${100 + i}`).toUpperCase();
    rows.push({
      username: cleanCode.toLowerCase(),
      fullName,
      email,
      studentCode: cleanCode,
      department: department || "Khoa Công nghệ Thông tin",
      role: "NCS",
      mustChangePassword: true,
    });
  }
  return rows;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onCreateSingle,
  onImportBatch,
  existingUsernames = [],
  isSubmitting = false,
}: CreateUserModalProps) {
  const titleId = useId();
  const singleTabId = useId();
  const batchTabId = useId();
  const singlePanelId = useId();
  const batchPanelId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ModalTab>("single");
  const [showPassword, setShowPassword] = useState(false);

  // Single user form state
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<SystemRole>("NCS");
  const [department, setDepartment] = useState("");
  const [academicTitle, setAcademicTitle] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState(() =>
    generateStrongPassword(12)
  );
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Batch import state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [batchPreview, setBatchPreview] = useState<BulkImportUserDraft[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setEmail("");
    setPhone("");
    setRole("NCS");
    setDepartment("");
    setAcademicTitle("");
    setStudentCode("");
    setTemporaryPassword(generateStrongPassword(12));
    setSendWelcomeEmail(true);
    setMustChangePassword(true);
    setFormError(null);
    setSelectedFileName(null);
    setBatchPreview([]);
    setBatchError(null);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSingleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      setFormError("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return;
    }
    if (!/^[a-z0-9._-]+$/.test(cleanUsername)) {
      setFormError(
        "Tên đăng nhập chỉ được chứa chữ thường, số, dấu chấm, gạch dưới hoặc gạch nối."
      );
      return;
    }
    if (
      existingUsernames.some((item) => item.toLowerCase() === cleanUsername)
    ) {
      setFormError(`Tên đăng nhập "@${cleanUsername}" đã tồn tại trong hệ thống.`);
      return;
    }
    if (!cleanFullName) {
      setFormError("Vui lòng nhập họ và tên người dùng.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError("Địa chỉ email không hợp lệ.");
      return;
    }
    if (temporaryPassword.length < 8) {
      setFormError("Mật khẩu khởi tạo phải có tối thiểu 8 ký tự.");
      return;
    }

    setFormError(null);
    await onCreateSingle({
      username: cleanUsername,
      fullName: cleanFullName,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      role,
      department: department.trim() || undefined,
      academicTitle:
        role === "GVHD" ? academicTitle.trim() || undefined : undefined,
      studentCode:
        role === "NCS" ? studentCode.trim() || undefined : undefined,
      temporaryPassword,
      sendWelcomeEmail,
      mustChangePassword,
    });
    resetForm();
  };

  const handleFilePicked = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "xlsx", "xls"].includes(ext)) {
      setBatchError("Định dạng không hỗ trợ. Vui lòng chọn tệp .CSV, .XLS hoặc .XLSX.");
      return;
    }

    setBatchError(null);
    setSelectedFileName(file.name);

    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        const parsed = parseCsvRows(text);
        if (parsed.length > 0) {
          setBatchPreview(parsed);
        } else {
          // Fallback mô phỏng nếu file CSV trống hoặc khác cấu trúc cột
          setBatchPreview(SAMPLE_BATCH_NCS);
        }
      };
      reader.onerror = () => {
        setBatchPreview(SAMPLE_BATCH_NCS);
      };
      reader.readAsText(file);
    } else {
      // Mô phỏng đọc bảng Excel danh sách tân NCS trúng tuyển
      setBatchPreview(SAMPLE_BATCH_NCS);
    }
  };

  const handleLoadSampleBatch = () => {
    setBatchError(null);
    setSelectedFileName("DanhSach_TrungTuyen_NCS_K34_Dot2.xlsx");
    setBatchPreview(SAMPLE_BATCH_NCS);
  };

  const handleBatchSubmit = async () => {
    if (!onImportBatch || batchPreview.length === 0) return;
    await onImportBatch(
      batchPreview,
      selectedFileName || "DanhSach_TrungTuyen_NCS.xlsx"
    );
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2
              id={titleId}
              className="text-base font-bold text-foreground"
            >
              Cấp tài khoản người dùng mới
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tạo tài khoản đơn lẻ theo vai trò RBAC hoặc nhập hàng loạt tân NCS
              trúng tuyển.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại tạo tài khoản"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-40"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Phương thức tạo tài khoản"
          className="flex gap-1 border-b border-border bg-muted/30 px-6 pt-3"
        >
          <button
            id={singleTabId}
            type="button"
            role="tab"
            aria-selected={activeTab === "single"}
            aria-controls={singlePanelId}
            onClick={() => setActiveTab("single")}
            className={`inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              activeTab === "single"
                ? "border-rose-600 text-rose-700 dark:text-rose-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="size-3.5" aria-hidden="true" />
            <span>Thêm tài khoản đơn lẻ</span>
          </button>

          <button
            id={batchTabId}
            type="button"
            role="tab"
            aria-selected={activeTab === "batch"}
            aria-controls={batchPanelId}
            onClick={() => setActiveTab("batch")}
            className={`inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
              activeTab === "batch"
                ? "border-rose-600 text-rose-700 dark:text-rose-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5" aria-hidden="true" />
            <span>Nhập hàng loạt theo đợt NCS</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "single" ? (
            <form
              id="create-single-user-form"
              role="tabpanel"
              aria-labelledby={singleTabId}
              onSubmit={handleSingleSubmit}
              className="space-y-4"
            >
              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="create-username"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Tên đăng nhập (Username) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="create-username"
                    type="text"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="vd: ncs2026015 hoặc gvhd.ntlan"
                    className="h-9.5 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:font-sans placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="create-role"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Vai trò hệ thống <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="create-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value as SystemRole)}
                    className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  >
                    {(Object.keys(SYSTEM_ROLE_META) as SystemRole[]).map((key) => (
                      <option key={key} value={key}>
                        {SYSTEM_ROLE_META[key].label} ({key})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="create-fullname"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Họ và tên <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="create-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nguyễn Thị Lan"
                    className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="create-email"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Email công vụ / học viên <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="create-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ten@agu.edu.vn"
                    className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="create-department"
                    className="mb-1.5 block text-xs font-medium text-foreground"
                  >
                    Đơn vị / Khoa chuyên môn
                  </label>
                  <input
                    id="create-department"
                    type="text"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    placeholder="Khoa Công nghệ Thông tin"
                    className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  />
                </div>

                {role === "NCS" ? (
                  <div>
                    <label
                      htmlFor="create-student-code"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Mã số học viên (MSHV)
                    </label>
                    <input
                      id="create-student-code"
                      type="text"
                      value={studentCode}
                      onChange={(event) => setStudentCode(event.target.value)}
                      placeholder="NCS2026015"
                      className="h-9.5 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground placeholder:font-sans placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                    />
                  </div>
                ) : role === "GVHD" ? (
                  <div>
                    <label
                      htmlFor="create-academic-title"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Học hàm / Học vị
                    </label>
                    <input
                      id="create-academic-title"
                      type="text"
                      value={academicTitle}
                      onChange={(event) => setAcademicTitle(event.target.value)}
                      placeholder="PGS.TS. hoặc TS."
                      className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="create-phone"
                      className="mb-1.5 block text-xs font-medium text-foreground"
                    >
                      Số điện thoại liên hệ
                    </label>
                    <input
                      id="create-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="0918xxxxxx"
                      className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                    />
                  </div>
                )}
              </div>

              {/* Mật khẩu khởi tạo */}
              <div className="rounded-xl border border-border bg-muted/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="create-temp-password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Mật khẩu khởi tạo tạm thời <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setTemporaryPassword(generateStrongPassword(12))
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    <RefreshCw className="size-3" aria-hidden="true" />
                    <span>Tạo mật khẩu ngẫu nhiên</span>
                  </button>
                </div>

                <div className="relative mt-2">
                  <input
                    id="create-temp-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={temporaryPassword}
                    onChange={(event) =>
                      setTemporaryPassword(event.target.value)
                    }
                    className="h-9.5 w-full rounded-lg border border-border bg-background pr-10 pl-3 font-mono text-sm text-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={mustChangePassword}
                      onChange={(event) =>
                        setMustChangePassword(event.target.checked)
                      }
                      className="size-4 rounded border-border accent-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    />
                    <span>Bắt buộc đổi mật khẩu ở lần đăng nhập đầu</span>
                  </label>

                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={sendWelcomeEmail}
                      onChange={(event) =>
                        setSendWelcomeEmail(event.target.checked)
                      }
                      className="size-4 rounded border-border accent-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500/40"
                    />
                    <span>Gửi thông tin tài khoản qua email</span>
                  </label>
                </div>
              </div>
            </form>
          ) : (
            <div
              id={batchPanelId}
              role="tabpanel"
              aria-labelledby={batchTabId}
              className="space-y-4"
            >
              {batchError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{batchError}</span>
                </div>
              )}

              {/* Dropzone */}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) handleFilePicked(file);
                }}
                className={`rounded-xl border border-dashed p-6 text-center transition-colors duration-150 ${
                  isDragging
                    ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20"
                    : "border-border bg-muted/20 hover:bg-muted/35"
                }`}
              >
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                  <Upload className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Kéo thả tệp CSV / Excel danh sách tân NCS trúng tuyển
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hệ thống tự động gán vai trò{" "}
                  <strong className="text-foreground">NCS</strong> và bật cờ{" "}
                  <strong className="text-foreground">
                    yêu cầu đổi mật khẩu lần đầu
                  </strong>{" "}
                  cho toàn bộ danh sách.
                </p>

                <input
                  ref={fileInputRef}
                  id="batch-ncs-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFilePicked(file);
                  }}
                />

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    <FileSpreadsheet className="size-3.5" aria-hidden="true" />
                    <span>Chọn tệp từ máy tính</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleBatch}
                    className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-700 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300"
                  >
                    <span>Nạp danh sách mẫu Khóa 34 (4 NCS)</span>
                  </button>
                </div>
              </div>

              {/* Preview Table */}
              {batchPreview.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <CheckCircle2
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>
                        Xem trước {batchPreview.length} tài khoản từ{" "}
                        <span className="font-mono">{selectedFileName}</span>
                      </span>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Role: NCS • Đổi MK lần đầu
                    </span>
                  </div>

                  <div className="max-h-56 overflow-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20 text-[11px] font-semibold text-muted-foreground">
                          <th className="px-3 py-2">MSHV / Username</th>
                          <th className="px-3 py-2">Họ và tên</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Khoa chuyên môn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {batchPreview.map((row) => (
                          <tr key={row.username}>
                            <td className="px-3 py-2 font-mono text-[11px] text-foreground">
                              {row.studentCode}
                            </td>
                            <td className="px-3 py-2 font-medium text-foreground">
                              {row.fullName}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {row.email}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {row.department}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border bg-muted/20 px-6 py-3.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-45"
          >
            Hủy
          </button>

          {activeTab === "single" ? (
            <button
              type="submit"
              form="create-single-user-form"
              disabled={isSubmitting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition-colors duration-150 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus className="size-3.5" aria-hidden="true" />
              <span>{isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBatchSubmit}
              disabled={
                isSubmitting || batchPreview.length === 0 || !onImportBatch
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition-colors duration-150 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="size-3.5" aria-hidden="true" />
              <span>
                {isSubmitting
                  ? "Đang nhập..."
                  : `Nhập ${batchPreview.length} tài khoản NCS`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;
