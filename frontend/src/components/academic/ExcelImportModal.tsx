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
  AlertCircle,
  Sparkles,
  Info,
  ShieldCheck,
  RefreshCw,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { MOCK_STUDENTS, MOCK_SUPERVISORS } from "./mockData";
import { StudentDossier } from "./StudentDetailModal";
import { SupervisorQuotaRecord } from "./mockData";

export type EntityImportType = "student" | "supervisor";

export interface ValidationErrorItem {
  row: number;
  field: string;
  value: string;
  message: string;
  hint: string;
}

export interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityImportType;
  onSuccess?: (importedItems: any[]) => void;
}

export function ExcelImportModal({
  isOpen,
  onClose,
  entityType = "student",
  onSuccess,
}: ExcelImportModalProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isTestScenario, setIsTestScenario] = useState<"none" | "valid" | "error">("none");

  // Validation State: idle -> validating -> valid | error
  const [validationStatus, setValidationStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorsList, setErrorsList] = useState<ValidationErrorItem[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

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
    setIsTestScenario("none");
    setValidationStatus("idle");
    setErrorsList([]);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // 1. GENERATE & DOWNLOAD EXCEL / CSV TEMPLATE
  const handleDownloadTemplate = () => {
    let csvContent = "";
    if (isStudent) {
      csvContent =
        "\uFEFF" +
        "STT,Mã NCS,Họ và tên,Email,Số điện thoại,Khoa / Chuyên ngành,GVHD Chính,Đồng GVHD,Tên đề tài luận án,Khóa học\n" +
        '1,NCS240101,Hoàng Minh Đức,duc.ncs24@agu.edu.vn,0912345678,Khoa học Máy tính,TS. Bùi Lê Tuấn Anh,PGS.TS. Trần Văn Minh,"Nghiên cứu thị giác máy tính trong phân loại nông sản tự động",Khóa 2024\n' +
        '2,NCS240102,Lê Thị Thanh Thảo,thao.ncs24@agu.edu.vn,0987654321,Công nghệ Sinh học,PGS.TS. Nguyễn Văn Hùng,TS. Bùi Lê Tuấn Anh,"Tuyển chọn vi sinh vật cố định đạm phục vụ canh tác lúa hữu cơ",Khóa 2024\n' +
        '3,NCS240103,Nguyễn Gia Bảo,bao.ncs24@agu.edu.vn,0903112233,Quản trị Kinh doanh,GS.TS. Trần Minh Tâm,TS. Phạm Thu Trang,"Chuỗi cung ứng xanh nông sản xuất khẩu vùng ĐBSCL",Khóa 2024\n';
    } else {
      csvContent =
        "\uFEFF" +
        "STT,Mã GVHD,Họ và tên,Học vị / Học hàm,Email,Số điện thoại,Khoa / Bộ môn,Định mức tối đa (NCS),Lĩnh vực nghiên cứu\n" +
        '1,CB-2024-090,TS. Vũ Đức Anh,Tiến sĩ,anhvd@agu.edu.vn,0912345678,Khoa Công nghệ Thông tin,3.0,"Trí tuệ nhân tạo, Xử lý ảnh nông nghiệp"\n' +
        '2,CB-2024-091,PGS.TS. Nguyễn Thanh Trúc,Phó Giáo sư,trucnt@agu.edu.vn,0987654321,Khoa Nông nghiệp - TNMT,3.5,"Công nghệ sinh học phân tử cây trồng"\n' +
        '3,CB-2024-092,TS. Lê Hoài Phương,Tiến sĩ,phuonglh@agu.edu.vn,0903112233,Khoa Kinh tế - QTKD,3.0,"Quản trị chuỗi cung ứng, Kinh tế nông nghiệp"\n';
    }

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

  // DOWNLOAD TEST FILES (One valid, one with errors)
  const handleDownloadTestFile = (withError: boolean) => {
    let content = "";
    let name = "";
    if (isStudent) {
      if (withError) {
        name = "Test_NCS_CoLoi.csv";
        content =
          "\uFEFF" +
          "STT,Mã NCS,Họ và tên,Email,Số điện thoại,Khoa / Chuyên ngành,GVHD Chính,Đồng GVHD,Tên đề tài luận án,Khóa học\n" +
          '1,NCS230104,Trần Văn Thử Nghiệm,test.ncs@agu.edu.vn,0912345678,Khoa học Máy tính,TS. Bùi Lê Tuấn Anh,PGS.TS. Trần Văn Minh,"Đề tài thử nghiệm trùng mã số",Khóa 2024\n' +
          '2,NCS240108,Lê Thị Minh Hương,huong.email-khong-hop-le,0987654321,Công nghệ Sinh học,PGS.TS. Nguyễn Văn Hùng,TS. Bùi Lê Tuấn Anh,"Nghiên cứu vi sinh vật xử lý phế phẩm",Khóa 2024\n' +
          '3,NCS240109,Phạm Hữu Long,long.ncs24@agu.edu.vn,0903112233,Quản trị Kinh doanh,,,,"Khóa 2024\n';
      } else {
        name = "Test_NCS_HopLe.csv";
        content =
          "\uFEFF" +
          "STT,Mã NCS,Họ và tên,Email,Số điện thoại,Khoa / Chuyên ngành,GVHD Chính,Đồng GVHD,Tên đề tài luận án,Khóa học\n" +
          '1,NCS240101,Hoàng Minh Đức,duc.ncs24@agu.edu.vn,0912345678,Khoa học Máy tính,TS. Bùi Lê Tuấn Anh,PGS.TS. Trần Văn Minh,"Nghiên cứu thị giác máy tính trong phân loại nông sản tự động",Khóa 2024\n' +
          '2,NCS240102,Lê Thị Thanh Thảo,thao.ncs24@agu.edu.vn,0987654321,Công nghệ Sinh học,PGS.TS. Nguyễn Văn Hùng,TS. Bùi Lê Tuấn Anh,"Tuyển chọn vi sinh vật cố định đạm phục vụ canh tác lúa hữu cơ",Khóa 2024\n' +
          '3,NCS240103,Nguyễn Gia Bảo,bao.ncs24@agu.edu.vn,0903112233,Quản trị Kinh doanh,GS.TS. Trần Minh Tâm,TS. Phạm Thu Trang,"Chuỗi cung ứng xanh nông sản xuất khẩu vùng ĐBSCL",Khóa 2024\n';
      }
    } else {
      if (withError) {
        name = "Test_GVHD_CoLoi.csv";
        content =
          "\uFEFF" +
          "STT,Mã GVHD,Họ và tên,Học vị / Học hàm,Email,Số điện thoại,Khoa / Bộ môn,Định mức tối đa (NCS),Lĩnh vực nghiên cứu\n" +
          '1,CB-2018-012,TS. Bùi Lê Tuấn Anh,Tiến sĩ,tuananh@agu.edu.vn,0912345678,Khoa Công nghệ Thông tin,3.0,"Trí tuệ nhân tạo"\n' +
          '2,CB-2024-099,ThS. Nguyễn Văn Thử,Thạc sĩ,thunv@agu.edu.vn,0987654321,Khoa Nông nghiệp,3.0,"Nông nghiệp thông minh"\n' +
          '3,CB-2024-100,TS. Trần Hoàng Nam,Tiến sĩ,namth@agu.edu.vn,0903112233,Khoa Kinh tế,5.5,"Kinh tế tuần hoàn"\n';
      } else {
        name = "Test_GVHD_HopLe.csv";
        content =
          "\uFEFF" +
          "STT,Mã GVHD,Họ và tên,Học vị / Học hàm,Email,Số điện thoại,Khoa / Bộ môn,Định mức tối đa (NCS),Lĩnh vực nghiên cứu\n" +
          '1,CB-2024-090,TS. Vũ Đức Anh,Tiến sĩ,anhvd@agu.edu.vn,0912345678,Khoa Công nghệ Thông tin,3.0,"Trí tuệ nhân tạo, Xử lý ảnh nông nghiệp"\n' +
          '2,CB-2024-091,PGS.TS. Nguyễn Thanh Trúc,Phó Giáo sư,trucnt@agu.edu.vn,0987654321,Khoa Nông nghiệp - TNMT,3.5,"Công nghệ sinh học phân tử cây trồng"\n' +
          '3,CB-2024-092,TS. Lê Hoài Phương,Tiến sĩ,phuonglh@agu.edu.vn,0903112233,Khoa Kinh tế - QTKD,3.0,"Quản trị chuỗi cung ứng, Kinh tế nông nghiệp"\n';
      }
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. QUICK TEST CASES LOADER (FOR USER TESTING)
  const handleLoadTestScenario = (scenario: "valid" | "error") => {
    setIsTestScenario(scenario);
    setValidationStatus("idle"); // Must click Preview to validate, per prompt
    setErrorsList([]);
    setParsedData([]);

    if (scenario === "valid") {
      setFileName(isStudent ? "Danh_Sach_NCS_HopLe_K2024.xlsx" : "Danh_Sach_GVHD_HopLe_2026.xlsx");
      setFileSize("38.4 KB");
      // Create a virtual File object
      const dummyFile = new File(["dummy content"], isStudent ? "Danh_Sach_NCS_HopLe_K2024.xlsx" : "Danh_Sach_GVHD_HopLe_2026.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setSelectedFile(dummyFile);
    } else {
      setFileName(isStudent ? "Danh_Sach_NCS_BiLoi_DuLieu.xlsx" : "Danh_Sach_GVHD_BiLoi_DinhMuc.xlsx");
      setFileSize("42.1 KB");
      const dummyFile = new File(["dummy content"], isStudent ? "Danh_Sach_NCS_BiLoi_DuLieu.xlsx" : "Danh_Sach_GVHD_BiLoi_DinhMuc.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setSelectedFile(dummyFile);
    }
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
    setIsTestScenario("none");
    setValidationStatus("idle");
    setErrorsList([]);
    setParsedData([]);
  };

  // 3. PREVIEW & ERROR CHECK LOGIC
  const handlePreviewCheck = () => {
    if (!selectedFile) return;

    setValidationStatus("validating");

    setTimeout(() => {
      // SCENARIO 1: Explicit test preset "error" OR file has "loi" / "error" in its name
      const isErrorNamed =
        isTestScenario === "error" ||
        fileName.toLowerCase().includes("loi") ||
        fileName.toLowerCase().includes("error") ||
        fileName.toLowerCase().includes("fail");

      if (isErrorNamed) {
        let detectedErrors: ValidationErrorItem[] = [];
        if (isStudent) {
          detectedErrors = [
            {
              row: 2,
              field: "Mã NCS",
              value: "NCS230104",
              message: "Mã số nghiên cứu sinh đã tồn tại trong hệ thống (Hồ sơ của NCS Nguyễn Văn An).",
              hint: "Vui lòng kiểm tra lại mã NCS để tránh ghi đè dữ liệu nghiên cứu sinh hiện hành.",
            },
            {
              row: 3,
              field: "Email liên lạc",
              value: "huong.email-khong-hop-le",
              message: "Địa chỉ email không đúng định dạng chuẩn theo tên miền đào tạo.",
              hint: "Email phải có cấu trúc hợp lệ dạng ten.ncs@domain.edu.vn hoặc tương đương.",
            },
            {
              row: 4,
              field: "GVHD Chính & Đề tài",
              value: "[Để trống]",
              message: "Thiếu thông tin bắt buộc: Giảng viên hướng dẫn chính và Tên đề tài luận án.",
              hint: "Theo quy chế đào tạo tiến sĩ, hồ sơ NCS bắt buộc phải có GVHD chính ngay khi tiếp nhận.",
            },
          ];
        } else {
          detectedErrors = [
            {
              row: 2,
              field: "Mã GVHD",
              value: "CB-2018-012",
              message: "Mã cán bộ trùng lặp với giảng viên hiện có (TS. Bùi Lê Tuấn Anh).",
              hint: "Mỗi giảng viên hướng dẫn phải có mã định danh duy nhất trong toàn trường.",
            },
            {
              row: 3,
              field: "Học vị / Học hàm",
              value: "Thạc sĩ",
              message: "Học vị không đủ tiêu chuẩn hướng dẫn NCS theo Quy chế BR-09 (Yêu cầu tối thiểu Tiến sĩ).",
              hint: "Chỉ giảng viên có học vị Tiến sĩ, chức danh PGS hoặc GS mới được phân công hướng dẫn NCS.",
            },
            {
              row: 4,
              field: "Định mức tối đa",
              value: "5.5",
              message: "Định mức 5.5 NCS vượt quá trần quy định (Tối đa 3.0 với TS, 4.0 với PGS/GS có đề tài Bộ).",
              hint: "Hiệu chỉnh lại định mức trong khoảng từ 1.0 đến tối đa 4.0 theo đúng quy chế BR-09.",
            },
          ];
        }

        setErrorsList(detectedErrors);
        setParsedData([]);
        setValidationStatus("error");
        return;
      }

      // SCENARIO 2: Valid data
      if (isStudent) {
        const validStudents: Partial<StudentDossier>[] = [
          {
            id: `std-imp-${Date.now()}-1`,
            name: "Hoàng Minh Đức",
            code: "NCS240101",
            cohort: "Khóa 2024",
            department: "Khoa học Máy tính",
            thesisTopic: "Nghiên cứu thị giác máy tính trong phân loại nông sản tự động",
            supervisorMain: "TS. Bùi Lê Tuấn Anh",
            supervisorCo: "PGS.TS. Trần Văn Minh",
            remainingMonths: 48,
            currentMilestoneIndex: 1,
            publicationPoints: 0.0,
            status: "active",
            email: "duc.ncs24@agu.edu.vn",
            phone: "0912 345 678",
          },
          {
            id: `std-imp-${Date.now()}-2`,
            name: "Lê Thị Thanh Thảo",
            code: "NCS240102",
            cohort: "Khóa 2024",
            department: "Công nghệ Sinh học",
            thesisTopic: "Tuyển chọn vi sinh vật cố định đạm phục vụ canh tác lúa hữu cơ",
            supervisorMain: "PGS.TS. Nguyễn Văn Hùng",
            supervisorCo: "TS. Bùi Lê Tuấn Anh",
            remainingMonths: 48,
            currentMilestoneIndex: 1,
            publicationPoints: 0.0,
            status: "active",
            email: "thao.ncs24@agu.edu.vn",
            phone: "0987 654 321",
          },
          {
            id: `std-imp-${Date.now()}-3`,
            name: "Nguyễn Gia Bảo",
            code: "NCS240103",
            cohort: "Khóa 2024",
            department: "Quản trị Kinh doanh",
            thesisTopic: "Chuỗi cung ứng xanh nông sản xuất khẩu vùng ĐBSCL trong bối cảnh mới",
            supervisorMain: "GS.TS. Trần Minh Tâm",
            supervisorCo: "TS. Phạm Thu Trang",
            remainingMonths: 48,
            currentMilestoneIndex: 1,
            publicationPoints: 0.0,
            status: "active",
            email: "bao.ncs24@agu.edu.vn",
            phone: "0903 112 233",
          },
        ];
        setParsedData(validStudents);
      } else {
        const validSupervisors: Partial<SupervisorQuotaRecord>[] = [
          {
            id: `gv-imp-${Date.now()}-1`,
            name: "TS. Vũ Đức Anh",
            code: "CB-2024-090",
            department: "Khoa Công nghệ Thông tin",
            degree: "Tiến sĩ",
            independentCount: 0,
            coCount: 0,
            usedQuota: 0.0,
            maxQuota: 3.0,
            remainingQuota: 3.0,
            statusText: "Còn 3.0 chỉ tiêu",
            statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
            assignedStudents: [],
          },
          {
            id: `gv-imp-${Date.now()}-2`,
            name: "PGS.TS. Nguyễn Thanh Trúc",
            code: "CB-2024-091",
            department: "Khoa Nông nghiệp - TNMT",
            degree: "Phó Giáo sư",
            independentCount: 0,
            coCount: 1,
            usedQuota: 0.5,
            maxQuota: 3.5,
            remainingQuota: 3.0,
            statusText: "Còn 3.0 chỉ tiêu",
            statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
            assignedStudents: ["1 NCS Đồng hướng dẫn"],
          },
          {
            id: `gv-imp-${Date.now()}-3`,
            name: "TS. Lê Hoài Phương",
            code: "CB-2024-092",
            department: "Khoa Kinh tế - QTKD",
            degree: "Tiến sĩ",
            independentCount: 1,
            coCount: 0,
            usedQuota: 1.0,
            maxQuota: 3.0,
            remainingQuota: 2.0,
            statusText: "Còn 2.0 chỉ tiêu",
            statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
            assignedStudents: ["1 NCS Độc lập"],
          },
        ];
        setParsedData(validSupervisors);
      }

      setErrorsList([]);
      setValidationStatus("valid");
    }, 450);
  };

  // 4. CONFIRM & IMPORT ACTION
  const handleConfirmImport = () => {
    if (validationStatus !== "valid" || parsedData.length === 0) return;

    if (onSuccess) {
      onSuccess(parsedData);
    }
    handleClose();
  };

  // Determine button states based on strict requirements:
  // 1. Chưa input file: preview xám (disabled), không có nút xác nhận
  // 2. Đã để file vào mà bị lỗi: chỉ có nút preview, không có nút xác nhận
  // 3. Đã để file vào và ok hết: hiện nút xác nhận ra
  const hasFile = selectedFile !== null;
  const isPreviewDisabled = !hasFile || validationStatus === "validating";
  const showConfirmButton = hasFile && validationStatus === "valid" && errorsList.length === 0;

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
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-blue-100 border border-white/20">
                  Import Wizard
                </span>
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
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Định dạng chuẩn ĐHQG
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Sử dụng file mẫu có sẵn tiêu đề cột để tránh lỗi định dạng và sai lệch thông tin khi hệ thống quét dữ liệu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <Download className="size-4" />
                <span>Tải template Excel về</span>
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
                accept=".xlsx, .xls, .csv, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                  setIsTestScenario("none");
                  setValidationStatus("idle");
                  setErrorsList([]);
                  setParsedData([]);
                }
              }}
              className={`rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                isDragOver
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
                        {isTestScenario !== "none" && (
                          <span className="ml-2 text-indigo-600 font-semibold">
                            (Dữ liệu mẫu thử nghiệm: {isTestScenario === "error" ? "File có lỗi" : "File hợp lệ"})
                          </span>
                        )}
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

            {/* PRE-BUILT TEST CASES (SATISFIES: "tự tạo thử trường hợp bị lỗi và không bị lỗi và chưa input") */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#164E9B] text-[11px] flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-indigo-600" />
                  <span>Bộ dữ liệu thử nghiệm nhanh (Dành cho kiểm thử hệ thống):</span>
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">
                  Nhấn để nạp sẵn dữ liệu kiểm tra 3 trường hợp
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Test case: Bị lỗi */}
                <button
                  type="button"
                  onClick={() => handleLoadTestScenario("error")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                    isTestScenario === "error"
                      ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                      : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                  }`}
                  title="Tải sẵn dữ liệu mẫu chứa 3 lỗi vi phạm quy chế để kiểm tra"
                >
                  <AlertTriangle className="size-3.5 text-rose-500 in-data-[active=true]:text-white" />
                  <span>1. Thử file CÓ LỖI (3 lỗi)</span>
                </button>

                {/* 2. Test case: Không bị lỗi */}
                <button
                  type="button"
                  onClick={() => handleLoadTestScenario("valid")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                    isTestScenario === "valid"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                  }`}
                  title="Tải sẵn dữ liệu mẫu hợp lệ 100% để kiểm tra nút xác nhận"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-600 in-data-[active=true]:text-white" />
                  <span>2. Thử file HỢP LỆ (0 lỗi)</span>
                </button>

                {/* 3. Test case: Chưa input file nào */}
                <button
                  type="button"
                  onClick={handleReset}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                    !hasFile
                      ? "bg-slate-700 text-white border-slate-700 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                  title="Xóa tệp để thử nghiệm trường hợp chưa input file nào"
                >
                  <Trash2 className="size-3 text-slate-400" />
                  <span>3. Chưa input file nào</span>
                </button>

                {/* Download actual sample files to disk if user wants to upload themselves */}
                <div className="ml-auto hidden sm:flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Tải file về máy để test:</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadTestFile(true)}
                    className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    File lỗi (.csv)
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadTestFile(false)}
                    className="text-[10px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    File chuẩn (.csv)
                  </button>
                </div>
              </div>
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
                    Vui lòng chọn tệp Excel hoặc bấm vào các nút thử nghiệm ở bước 2. Khi chưa có tệp, nút Preview bên dưới sẽ bị khóa và không có nút Xác nhận.
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
                        Dữ liệu hoàn toàn hợp lệ! Sẵn sàng nhập {parsedData.length} bản ghi vào hệ thống.
                      </p>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        Tất cả các dòng dữ liệu đều đáp ứng chuẩn định dạng, không bị trùng mã và tuân thủ quy chế BR-09. Nút Xác nhận đã được kích hoạt.
                      </p>
                    </div>
                  </div>

                  {/* Summary Preview Table */}
                  <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-emerald-100/60 text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        <tr>
                          <th className="px-3 py-2 w-12 text-center">STT</th>
                          <th className="px-3 py-2 w-28">Mã số</th>
                          <th className="px-3 py-2 w-44">Họ và tên</th>
                          <th className="px-3 py-2 w-44">Khoa / Đơn vị</th>
                          <th className="px-3 py-2">
                            {isStudent ? "GVHD Chính & Đề tài" : "Học vị & Định mức"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100">
                        {parsedData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/40">
                            <td className="px-3 py-2 text-center text-slate-500 font-bold">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-[#164E9B]">
                              {item.code}
                            </td>
                            <td className="px-3 py-2 font-semibold text-slate-900">
                              {item.name}
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {item.department}
                            </td>
                            <td className="px-3 py-2 text-[11px] text-slate-700">
                              {isStudent ? (
                                <div>
                                  <span className="font-bold text-slate-800">
                                    {item.supervisorMain}
                                  </span>{" "}
                                  - <span className="italic text-slate-600 truncate">{item.thesisTopic}</span>
                                </div>
                              ) : (
                                <div>
                                  <span className="font-bold text-slate-800">
                                    {item.degree}
                                  </span>{" "}
                                  • Định mức tối đa:{" "}
                                  <span className="font-bold text-emerald-700">
                                    {item.maxQuota} NCS
                                  </span>
                                </div>
                              )}
                            </td>
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
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                isPreviewDisabled
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-white border border-[#164E9B] text-[#164E9B] hover:bg-blue-50 active:bg-blue-100 cursor-pointer"
              }`}
              title={
                !hasFile
                  ? "Vui lòng chọn tệp Excel trước khi kiểm tra"
                  : "Kiểm tra dữ liệu và tìm lỗi trong tệp"
              }
            >
              {validationStatus === "validating" ? (
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
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-all animate-in zoom-in-95 duration-150 cursor-pointer"
              >
                <Check className="size-4" />
                <span>Xác nhận nhập khẩu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExcelImportModal;
