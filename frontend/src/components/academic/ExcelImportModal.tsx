"use client";

import React, { useState, useRef, useId } from "react";
import {
  X,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Check,
  Trash2,
  Info,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ApiClientError } from "@/src/lib/api";
import type { StudentDossier, SupervisorQuotaRecord } from "@/src/types/academic";
import {
  useDownloadNcsTemplate,
  usePreviewNcsImport,
  useConfirmNcsImport,
  useDownloadGvhdTemplate,
  usePreviewGvhdImport,
  useConfirmGvhdImport,
} from "@/src/hooks/use-academic";
import { mapBackendNcsToStudentDossier, type BackendNcsRaw } from "@/src/services/ncs";
import type { ImportGvhdPreviewResponse } from "@/src/services/gvhd";

export type EntityImportType = "student" | "supervisor";

export interface ValidationErrorItem {
  row: number;
  field: string;
  value: string;
  message: string;
  hint: string;
}

export type ImportedEntityItem = StudentDossier | SupervisorQuotaRecord;

export type ExcelImportModalProps =
  | {
    isOpen: boolean;
    onClose: () => void;
    entityType: "student";
    onSuccess?: (importedItems: StudentDossier[]) => void;
  }
  | {
    isOpen: boolean;
    onClose: () => void;
    entityType: "supervisor";
    onSuccess?: (importedCount: number) => void;
  };

export function ExcelImportModal({
  isOpen,
  onClose,
  entityType,
  onSuccess,
}: ExcelImportModalProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

  // Validation State: idle -> validating -> valid | error
  const [validationStatus, setValidationStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorsList, setErrorsList] = useState<ValidationErrorItem[]>([]);
  const [parsedData, setParsedData] = useState<ImportedEntityItem[]>([]);
  const [gvhdPreview, setGvhdPreview] = useState<ImportGvhdPreviewResponse | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // TanStack Query Mutations cho Import NCS (Hooks phải đặt ở đầu component)
  const downloadTemplateMutation = useDownloadNcsTemplate();
  const previewImportMutation = usePreviewNcsImport();
  const confirmImportMutation = useConfirmNcsImport();
  const downloadGvhdTemplateMutation = useDownloadGvhdTemplate();
  const previewGvhdImportMutation = usePreviewGvhdImport();
  const confirmGvhdImportMutation = useConfirmGvhdImport();

  if (!isOpen) return null;

  const isStudent = entityType === "student";
  const entityTitle = isStudent ? "Nghiên cứu sinh" : "Giảng viên Hướng dẫn";
  const templateFileName = isStudent
    ? "Mau_Nhap_Lieu_NCS_SauDaiHoc.csv"
    : "Mau_Nhap_Lieu_GVHD_SauDaiHoc.csv";

  // Reset all state when closing or switching
  const handleReset = () => {
    setSelectedFile(null);
    setFileName("");
    setFileSize("");
    setValidationStatus("idle");
    setErrorsList([]);
    setParsedData([]);
    setGvhdPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // 1. GENERATE & DOWNLOAD EXCEL / CSV TEMPLATE
  const handleDownloadTemplate = async () => {
    if (isStudent) {
      try {
        await downloadTemplateMutation.mutateAsync();
        return;
      } catch (err) {
        console.warn("Không thể tải template từ backend API, sử dụng file mẫu dự phòng:", err);
      }
    } else {
      try {
        await downloadGvhdTemplateMutation.mutateAsync();
      } catch (error) {
        setErrorsList([{
          row: 1,
          field: "Tệp mẫu GVHD",
          value: "",
          message: error instanceof Error ? error.message : "Không thể tải file mẫu GVHD.",
          hint: "Kiểm tra quyền truy cập hoặc thử lại sau.",
        }]);
        setValidationStatus("error");
      }
      return;
    }
    const csvContent =
      "\uFEFF" +
      "STT,Mã NCS,Họ và tên,Email,Số điện thoại,Khoa / Chuyên ngành,GVHD Chính,Đồng GVHD,Tên đề tài luận án,Khóa học\n" +
      '1,NCS240101,Hoàng Minh Đức,duc.ncs24@agu.edu.vn,0912345678,Khoa học Máy tính,TS. Bùi Lê Tuấn Anh,PGS.TS. Trần Văn Minh,"Nghiên cứu thị giác máy tính trong phân loại nông sản tự động",Khóa 2024\n' +
      '2,NCS240102,Lê Thị Thanh Thảo,thao.ncs24@agu.edu.vn,0987654321,Công nghệ Sinh học,PGS.TS. Nguyễn Văn Hùng,TS. Bùi Lê Tuấn Anh,"Tuyển chọn vi sinh vật cố định đạm phục vụ canh tác lúa hữu cơ",Khóa 2024\n' +
      '3,NCS240103,Nguyễn Gia Bảo,bao.ncs24@agu.edu.vn,0903112233,Quản trị Kinh doanh,GS.TS. Trần Minh Tâm,TS. Phạm Thu Trang,"Chuỗi cung ứng xanh nông sản xuất khẩu vùng ĐBSCL",Khóa 2024\n';
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", templateFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle actual File Input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      handleReset();
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setValidationStatus("idle");
    setErrorsList([]);
    setParsedData([]);
    setGvhdPreview(null);
  };

  // 3. PREVIEW & ERROR CHECK LOGIC
  const handlePreviewCheck = async () => {
    if (!selectedFile) return;

    // A. Xử lý qua Backend API cho Sinh viên (NCS)
    if (isStudent) {
      setValidationStatus("validating");
      try {
        const res = await previewImportMutation.mutateAsync(selectedFile);
        if (res.errorCount > 0) {
          const detectedErrors: ValidationErrorItem[] = [];
          res.rows
            .filter((r) => !r.ok)
            .forEach((r) => {
              r.errors.forEach((err) => {
                let field = "Dữ liệu dòng";
                const lowerErr = err.toLowerCase();
                if (lowerErr.includes("mshv")) field = "Mã NCS (MSHV)";
                else if (lowerErr.includes("họ tên")) field = "Họ và tên";
                else if (lowerErr.includes("nhập học")) field = "Ngày nhập học";
                else if (lowerErr.includes("ngày sinh")) field = "Ngày sinh";
                else if (lowerErr.includes("email")) field = "Email";
                else if (lowerErr.includes("điện thoại") || lowerErr.includes("số điện thoại")) field = "Số điện thoại";
                else if (lowerErr.includes("cccd")) field = "CCCD";
                else if (lowerErr.includes("ngành")) field = "Chuyên ngành";
                else if (lowerErr.includes("khóa")) field = "Khóa tuyển sinh";
                else if (lowerErr.includes("lớp")) field = "Lớp";
                else if (lowerErr.includes("đầu vào")) field = "Trình độ đầu vào";
                else if (lowerErr.includes("phương thức")) field = "Phương thức đào tạo";

                detectedErrors.push({
                  row: r.row,
                  field,
                  value: r.mshv || "[Để trống]",
                  message: err,
                  hint: "Vui lòng kiểm tra và hiệu chỉnh ô dữ liệu này trong file Excel theo mẫu chuẩn.",
                });
              });
            });

          setErrorsList(detectedErrors);
          setParsedData([]);
          setValidationStatus("error");
        } else {
          // Tất cả các dòng đều hợp lệ
          const previewStudents: StudentDossier[] = res.rows.map((r, idx) => ({
            id: `std-prev-${r.mshv || idx}`,
            name: r.hoTen || `NCS ${r.mshv}`,
            code: r.mshv,
            cohort: r.khoaHoc ? `Khóa ${r.khoaHoc}` : "Khóa mới",
            department: r.nganh || "Chưa phân ngành",
            thesisTopic: r.willCreateAccount ? "Sẽ tạo tài khoản mới tự động" : "Đã có tài khoản hệ thống",
            supervisorMain: "Theo hồ sơ import",
            remainingMonths: 36,
            currentMilestoneIndex: 1,
            publicationPoints: 0.0,
            status: "active",
            email: "",
            phone: "",
          }));

          setParsedData(previewStudents);
          setErrorsList([]);
          setValidationStatus("valid");
        }
      } catch (err: unknown) {
        console.error("Lỗi khi kiểm tra file Excel qua backend API:", err);
        const errObj = err as { response?: { data?: { message?: string | string[] } }; message?: string };
        const serverMsg =
          errObj?.response?.data?.message ||
          errObj?.message ||
          "Không thể kiểm tra file Excel. Vui lòng kiểm tra định dạng file .xlsx và kết nối mạng.";

        setErrorsList([
          {
            row: 1,
            field: "Tệp tin Excel",
            value: selectedFile.name,
            message: Array.isArray(serverMsg) ? serverMsg.join(", ") : String(serverMsg),
            hint: "Hệ thống chỉ chấp nhận file Excel định dạng .xlsx có cấu trúc tiêu đề đúng mẫu của trường.",
          },
        ]);
        setParsedData([]);
        setValidationStatus("error");
      }
      return;
    }

    // B. Preview GVHD bằng API thật; không mô phỏng kết quả ở trình duyệt.
    setValidationStatus("validating");
    setParsedData([]);
    try {
      const response = await previewGvhdImportMutation.mutateAsync(selectedFile);
      setGvhdPreview(response);

      if (response.errorCount > 0) {
        const detectedErrors: ValidationErrorItem[] = response.rows
          .filter((row) => !row.ok)
          .flatMap((row) =>
            row.errors.map((message) => {
              let field = "Dữ liệu GVHD";
              const lowerErr = message.toLowerCase();
              if (lowerErr.includes("mã gv") || lowerErr.includes("mã giảng viên")) field = "Mã GV";
              else if (lowerErr.includes("họ tên") || lowerErr.includes("tên")) field = "Họ và tên";
              else if (lowerErr.includes("email")) field = "Email";
              else if (lowerErr.includes("học hàm") || lowerErr.includes("học vị")) field = "Học hàm / Học vị";
              else if (lowerErr.includes("đơn vị")) field = "Đơn vị";
              else if (lowerErr.includes("chuyên ngành")) field = "Chuyên ngành";
              else if (lowerErr.includes("nước") || lowerErr.includes("quốc gia")) field = "Nước tốt nghiệp";
              else if (lowerErr.includes("ngày sinh")) field = "Ngày sinh";
              else if (lowerErr.includes("giới tính")) field = "Giới tính";

              return {
                row: row.row,
                field,
                value: row.maGv || "[Thiếu mã GV]",
                message,
                hint: "Sửa dòng được báo lỗi trong Excel rồi tải file lên kiểm tra lại.",
              };
            })
          );
        setErrorsList(detectedErrors);
        setValidationStatus("error");
      } else {
        setErrorsList([]);
        setValidationStatus("valid");
      }
    } catch (err) {
      const errObj = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const serverMsg =
        errObj?.response?.data?.message ||
        errObj?.message ||
        "Không thể kiểm tra file Excel. Vui lòng kiểm tra định dạng file .xlsx và kết nối mạng.";
      setErrorsList([
        {
          row: 1,
          field: "Tệp tin Excel",
          value: selectedFile.name,
          message: Array.isArray(serverMsg) ? serverMsg.join(", ") : String(serverMsg),
          hint: "Hệ thống chỉ chấp nhận file Excel định dạng .xlsx có cấu trúc tiêu đề đúng mẫu của trường.",
        },
      ]);
      setGvhdPreview(null);
      setValidationStatus("error");
    }
  };

  // 4. CONFIRM & IMPORT ACTION
  const handleConfirmImport = async () => {
    if (validationStatus !== "valid") return;

    if (isStudent) {
      if (!selectedFile || parsedData.length === 0) return;
      try {
        const res = await confirmImportMutation.mutateAsync(selectedFile);
        const importedStudents: StudentDossier[] =
          Array.isArray(res.profiles) && res.profiles.length > 0
            ? res.profiles.map((p) => mapBackendNcsToStudentDossier(p as unknown as BackendNcsRaw))
            : (parsedData as StudentDossier[]);

        if (onSuccess) {
          (onSuccess as (items: StudentDossier[]) => void)(importedStudents);
        }
        handleClose();
      } catch (err: unknown) {
        console.error("Lỗi khi xác nhận import NCS:", err);
        const errObj = err as { response?: { data?: { message?: string | string[] } }; message?: string };
        const serverMsg =
          errObj?.response?.data?.message ||
          errObj?.message ||
          "Có lỗi xảy ra trong quá trình nạp dữ liệu vào cơ sở dữ liệu.";
        alert(`Không thể nhập khẩu: ${Array.isArray(serverMsg) ? serverMsg.join(", ") : String(serverMsg)}`);
      }
      return;
    }

    if (!selectedFile || !gvhdPreview || gvhdPreview.validCount === 0) return;
    try {
      const importedSupervisors = await confirmGvhdImportMutation.mutateAsync(selectedFile);
      (onSuccess as ((importedCount: number) => void) | undefined)?.(importedSupervisors.length);
      handleClose();
    } catch (error) {
      const messages = error instanceof ApiClientError
        ? error.messages
        : [error instanceof Error ? error.message : "Không thể nhập danh sách GVHD."];
      setErrorsList(messages.map((message) => ({
        row: 1,
        field: "Xác nhận import GVHD",
        value: selectedFile.name,
        message,
        hint: "Không có dữ liệu nào được nhập. Kiểm tra lại file rồi thử lại.",
      })));
      setValidationStatus("error");
    }
  };

  // Determine button states based on strict requirements:
  // 1. Chưa input file: preview xám (disabled), không có nút xác nhận
  // 2. Đã để file vào mà bị lỗi: chỉ có nút preview, không có nút xác nhận
  // 3. Đã để file vào và ok hết: hiện nút xác nhận ra
  const hasFile = selectedFile !== null;
  const isPendingAction =
    validationStatus === "validating" ||
    previewImportMutation.isPending ||
    confirmImportMutation.isPending ||
    previewGvhdImportMutation.isPending ||
    confirmGvhdImportMutation.isPending;
  const isPreviewDisabled = !hasFile || isPendingAction;
  const previewRecordCount = isStudent ? parsedData.length : gvhdPreview?.validCount ?? 0;
  const showConfirmButton = hasFile && validationStatus === "valid" && errorsList.length === 0 && previewRecordCount > 0;
  const isTemplatePending = isStudent ? downloadTemplateMutation.isPending : downloadGvhdTemplateMutation.isPending;
  const isConfirmPending = isStudent ? confirmImportMutation.isPending : confirmGvhdImportMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-5 py-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Thêm {entityTitle} bằng file Excel
                </h2>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Nhập danh sách {isStudent ? "nghiên cứu sinh" : "giảng viên hướng dẫn"} hàng loạt từ bảng tính Excel / CSV
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
          {/* STEP 1: DOWNLOAD EXCEL TEMPLATE */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs mt-0.5">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>1. Tải biểu mẫu Excel chuẩn (Template)</span>
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Sử dụng file mẫu có sẵn tiêu đề cột để tránh lỗi định dạng và sai lệch thông tin khi hệ thống quét dữ liệu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={isTemplatePending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isTemplatePending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Đang tải template...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    <span>Tải template Excel về</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STEP 2: SHADCN BASE INPUT & FILE UPLOAD SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={fileInputId}
                className="text-xs font-bold text-slate-900 flex items-center gap-1.5"
              >
                <span>2. Chọn tệp Excel để nhập dữ liệu</span>
                <span className="text-rose-500 font-bold">*</span>
                <span className="text-[11px] font-normal text-slate-400">
                  (.xlsx, .xls, .csv)
                </span>
              </Label>

              {hasFile && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                >
                  <Trash2 className="size-3" />
                  <span>Xóa / Chọn tệp khác</span>
                </button>
              )}
            </div>

            {/* Direct Shadcn-style Base Input */}
            <div className="relative">
              <Input
                id={fileInputId}
                ref={fileInputRef}
                type="file"
                accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInputChange}
                className="h-10 text-xs text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#164E9B] file:text-white hover:file:bg-[#123E7C] file:cursor-pointer cursor-pointer border-slate-300 bg-slate-50/50 focus-visible:ring-[#164E9B]"
              />
            </div>

            {/* Drag & Drop Visual Box / File Selected Status */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setFileName(file.name);
                  setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
                  setValidationStatus("idle");
                  setErrorsList([]);
                  setParsedData([]);
                  setGvhdPreview(null);
                }
              }}
              className={`rounded-xl border-2 border-dashed p-4 text-center transition-all ${isDragOver
                  ? "border-[#164E9B] bg-blue-50/60"
                  : hasFile
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50"
                }`}
            >
              {hasFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                      <FileCheck className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 max-w-[280px] sm:max-w-md truncate">
                          {fileName}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                          Đã chọn tệp
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dung lượng: <span className="font-semibold text-slate-700">{fileSize}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-500 italic block">
                      {validationStatus === "idle"
                        ? "Chưa kiểm tra (Bấm Preview bên dưới)"
                        : validationStatus === "validating"
                          ? "Đang quét dữ liệu..."
                          : validationStatus === "valid"
                            ? "✓ Đã thẩm định: Hợp lệ"
                            : "⚠ Đã thẩm định: Có lỗi"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 py-1">
                  <UploadCloud className="size-8 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700">
                    Kéo thả tệp Excel vào đây hoặc sử dụng ô chọn tệp phía trên
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hỗ trợ tệp .xlsx, .xls hoặc .csv (dung lượng tối đa 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: RESERVED ERROR CHECK & PREVIEW DISPLAY AREA */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>3. Khu vực thẩm định &amp; Báo cáo lỗi</span>
                {validationStatus === "valid" && (
                  <span className="text-emerald-600 font-bold normal-case text-xs">
                    (Hoàn toàn hợp lệ)
                  </span>
                )}
                {validationStatus === "error" && (
                  <span className="text-rose-600 font-bold normal-case text-xs">
                    (Phát hiện {errorsList.length} lỗi)
                  </span>
                )}
              </h3>
            </div>

            {/* Container for error checking / preview table */}
            <div className="min-h-[160px] rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all flex flex-col justify-center">
              {/* STATE A: NO FILE SELECTED YET */}
              {!hasFile && (
                <div className="text-center py-6 space-y-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-200/80 text-slate-500 mx-auto">
                    <Info className="size-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Chưa có tệp dữ liệu nào được tải lên
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
                    Vui lòng chọn hoặc kéo thả tệp Excel ở bước 2. Khi chưa có tệp, nút Preview bên dưới sẽ bị khóa và không có nút Xác nhận.
                  </p>
                </div>
              )}

              {/* STATE B: FILE SELECTED BUT PREVIEW NOT TRIGGERED YET */}
              {hasFile && validationStatus === "idle" && (
                <div className="text-center py-6 space-y-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] mx-auto animate-pulse">
                    <HelpCircle className="size-5" />
                  </div>
                  <p className="text-xs font-bold text-[#0F2744]">
                    Tệp &ldquo;{fileName}&rdquo; đã sẵn sàng kiểm tra
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
                    Nhấn nút <strong className="text-[#164E9B]">&ldquo;Kiểm tra &amp; Xem trước (Preview)&rdquo;</strong> ở góc dưới để hệ thống quét dữ liệu, đối soát trùng lặp và thẩm định các điều kiện quy chế.
                  </p>
                </div>
              )}

              {/* STATE C: VALIDATING IN PROGRESS */}
              {validationStatus === "validating" && (
                <div className="text-center py-8 space-y-3">
                  <RefreshCw className="size-8 mx-auto text-[#164E9B] animate-spin" />
                  <p className="text-xs font-bold text-slate-800">
                    Đang quét và kiểm tra tính hợp lệ dữ liệu...
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Đối chiếu với danh mục sinh viên, cán bộ hướng dẫn và quy chuẩn đào tạo AGU.
                  </p>
                </div>
              )}

              {/* STATE D: ERROR DETECTED (BỊ LỖI - SHOW ERROR LIST) */}
              {hasFile && validationStatus === "error" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Alert banner */}
                  <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-900">
                    <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-rose-900">
                        Phát hiện {errorsList.length} lỗi trong tệp dữ liệu!
                      </p>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        Theo quy định, không thể nhập dữ liệu khi còn lỗi. Vui lòng xem chi tiết bên dưới, chỉnh sửa file Excel và bấm lại nút Preview để kiểm tra lại.
                      </p>
                    </div>
                  </div>

                  {/* Errors Table */}
                  <div className="overflow-x-auto rounded-lg border border-rose-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-100/60 text-[11px] font-bold uppercase tracking-wider text-rose-950">
                        <tr>
                          <th className="px-3 py-2 w-16 text-center">Dòng</th>
                          <th className="px-3 py-2 w-32">Trường thông tin</th>
                          <th className="px-3 py-2 w-36">Giá trị hiện tại</th>
                          <th className="px-3 py-2">Chi tiết lỗi &amp; Hướng xử lý</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100">
                        {errorsList.map((err, idx) => (
                          <tr key={idx} className="hover:bg-rose-50/50">
                            <td className="px-3 py-2 text-center font-bold text-rose-800">
                              #{err.row}
                            </td>
                            <td className="px-3 py-2 font-semibold text-slate-900">
                              {err.field}
                            </td>
                            <td className="px-3 py-2 font-mono text-[11px] text-rose-700 bg-rose-50/80 rounded">
                              {err.value}
                            </td>
                            <td className="px-3 py-2 space-y-0.5">
                              <p className="text-rose-900 font-semibold text-[11px]">
                                {err.message}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                💡 <em>{err.hint}</em>
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STATE E: VALID / NO ERRORS (OK HẾT - SHOW PREVIEW TABLE) */}
              {hasFile && validationStatus === "valid" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {/* Success banner */}
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-bold text-emerald-900">
                        Dữ liệu hoàn toàn hợp lệ! Sẵn sàng nhập {previewRecordCount} bản ghi vào hệ thống.
                      </p>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        {isStudent
                          ? "Tất cả các dòng dữ liệu đều hợp lệ. Nút xác nhận đã được kích hoạt."
                          : `Tạo mới: ${gvhdPreview?.createCount ?? 0} · Cập nhật: ${gvhdPreview?.updateCount ?? 0} · Tài khoản mới: ${gvhdPreview?.newAccountCount ?? 0}. Nút xác nhận đã được kích hoạt.`}
                      </p>
                    </div>
                  </div>

                  {/* Summary Preview Table */}
                  <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-emerald-100/60 text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        <tr>
                          <th className="w-12 px-3 py-2 text-center">STT</th>
                          {isStudent ? (
                            <>
                              <th className="w-28 px-3 py-2">Mã số</th>
                              <th className="w-44 px-3 py-2">Họ và tên</th>
                              <th className="w-44 px-3 py-2">Khoa / Đơn vị</th>
                              <th className="px-3 py-2">GVHD Chính &amp; Đề tài</th>
                            </>
                          ) : (
                            <>
                              <th className="w-36 px-3 py-2">Mã GV</th>
                              <th className="px-3 py-2">Hành động</th>
                              <th className="px-3 py-2">Tài khoản</th>
                              <th className="px-3 py-2">Trạng thái</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100">
                        {isStudent ? (parsedData as StudentDossier[]).map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-emerald-50/40">
                            <td className="px-3 py-2 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-3 py-2 font-mono font-bold text-[#164E9B]">{item.code}</td>
                            <td className="px-3 py-2 font-semibold text-slate-900">{item.name}</td>
                            <td className="px-3 py-2 text-slate-600">{item.department}</td>
                            <td className="px-3 py-2 text-[11px] text-slate-700">
                              <span className="font-bold text-slate-800">{item.supervisorMain}</span> - <span className="italic text-slate-600">{item.thesisTopic}</span>
                            </td>
                          </tr>
                        )) : (gvhdPreview?.rows ?? []).map((row, idx) => (
                          <tr key={`${row.row}-${row.maGv}`} className="hover:bg-emerald-50/40">
                            <td className="px-3 py-2 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-3 py-2 font-mono font-bold text-[#164E9B]">{row.maGv}</td>
                            <td className="px-3 py-2">{row.hanhDong === "TAO_MOI" ? "Tạo mới" : "Cập nhật hồ sơ"}</td>
                            <td className="px-3 py-2">{row.willCreateAccount ? "Sẽ tạo tài khoản" : "Đã có tài khoản"}</td>
                            <td className="px-3 py-2 font-semibold text-emerald-700">Hợp lệ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER - ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-3.5 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {!hasFile ? (
              <span>Vui lòng chọn tệp Excel trước khi kiểm tra</span>
            ) : validationStatus === "idle" ? (
              <span>Tệp đã chọn. Nhấn <strong>Xem trước</strong> để kiểm tra lỗi.</span>
            ) : validationStatus === "error" ? (
              <span className="text-rose-600 font-semibold">Tệp có lỗi: Vui lòng sửa lại file Excel để tiếp tục</span>
            ) : (
              <span className="text-emerald-700 font-bold">Đã kiểm tra: Sẵn sàng nhập dữ liệu</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            {/* PREVIEW BUTTON */}
            {/* Logic: 
                - If no file: Xám (disabled, bg-slate-200, cursor-not-allowed)
                - If file present (even with error): clickable
            */}
            <button
              type="button"
              onClick={handlePreviewCheck}
              disabled={isPreviewDisabled}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${isPreviewDisabled
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-white border border-[#164E9B] text-[#164E9B] hover:bg-blue-50 active:bg-blue-100 cursor-pointer"
                }`}
              title={
                !hasFile
                  ? "Vui lòng chọn tệp Excel trước khi kiểm tra"
                  : "Kiểm tra dữ liệu và tìm lỗi trong tệp"
              }
            >
              {validationStatus === "validating" || previewImportMutation.isPending || previewGvhdImportMutation.isPending ? (
                <>
                  <RefreshCw className="size-4 animate-spin text-[#164E9B]" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <FileCheck className="size-4" />
                  <span>Kiểm tra &amp; Xem trước (Preview)</span>
                </>
              )}
            </button>

            {/* CONFIRM BUTTON */}
            {/* Logic: ONLY shown when file is present AND validationStatus === "valid" (no errors) */}
            {showConfirmButton && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isConfirmPending}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all animate-in zoom-in-95 duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isConfirmPending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Đang nạp vào CSDL...</span>
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    <span>Xác nhận nhập khẩu</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelImportModal;
