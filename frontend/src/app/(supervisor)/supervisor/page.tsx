"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  FileCheck2,
  FileEdit,
  Gauge,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Eye,
  Download,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  ChevronRight,
  RefreshCw,
  FileText,
  ShieldCheck,
  Send,
  HelpCircle,
  Award,
  BookOpen,
  XCircle,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  LayoutDashboard,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import {
  QuotaBar,
  SupervisorSelector,
  DocumentPreviewModal,
  ApprovalDialog,
  TopicChangeModal,
  StudentDetailModal,
  HoverLogo,
} from "@/src/components/supervisor";
import { TopicChangeItem } from "@/src/components/supervisor/TopicChangeModal";
import { StudentDossier } from "@/src/components/supervisor/StudentDetailModal";

// Mock Students Dataset (Realistic Vietnamese Graduate Data)
const MOCK_STUDENTS: StudentDossier[] = [
  {
    id: "std-01",
    name: "Nguyễn Văn An",
    code: "NCS230104",
    cohort: "Khóa 2023",
    department: "Khoa học Máy tính",
    thesisTopic: "Nghiên cứu ứng dụng IoT và Trí tuệ nhân tạo trong quan trắc, dự báo chất lượng môi trường nước nông nghiệp thâm canh",
    supervisorMain: "TS. Bùi Lê Tuấn Anh",
    supervisorCo: "PGS.TS. Trần Văn Minh",
    remainingMonths: 48,
    currentMilestoneIndex: 3,
    publicationPoints: 1.25,
    status: "active",
    email: "an.ncs23@agu.edu.vn",
    phone: "0912 345 678",
  },
  {
    id: "std-02",
    name: "Trần Thị Mai",
    code: "NCS230108",
    cohort: "Khóa 2023",
    department: "Công nghệ Sinh học",
    thesisTopic: "Nghiên cứu tuyển chọn và ứng dụng vi khuẩn nội sinh cố định đạm nhằm nâng cao năng suất lúa hữu cơ tại tỉnh An Giang",
    supervisorMain: "PGS.TS. Nguyễn Văn Hùng",
    supervisorCo: "TS. Bùi Lê Tuấn Anh",
    remainingMonths: 46,
    currentMilestoneIndex: 4,
    publicationPoints: 2.25,
    status: "active",
    email: "mai.ncs23@agu.edu.vn",
    phone: "0988 765 432",
  },
  {
    id: "std-03",
    name: "Lê Quốc Bảo",
    code: "NCS220055",
    cohort: "Khóa 2022",
    department: "Quản trị Kinh doanh",
    thesisTopic: "Các nhân tố tác động đến chuỗi cung ứng nông sản xuất khẩu vùng Đồng bằng sông Cửu Long trong bối cảnh chuyển đổi số",
    supervisorMain: "GS.TS. Trần Minh Tâm",
    supervisorCo: "TS. Phạm Thu Trang",
    remainingMonths: 11,
    currentMilestoneIndex: 7,
    publicationPoints: 2.0,
    status: "warning",
    email: "bao.ncs22@agu.edu.vn",
    phone: "0903 112 233",
  },
  {
    id: "std-04",
    name: "Võ Hoàng Nam",
    code: "NCS240012",
    cohort: "Khóa 2024",
    department: "Khoa học Máy tính",
    thesisTopic: "Xây dựng mô hình xử lý ngôn ngữ tự nhiên ứng dụng trong số hóa và trích xuất dữ liệu địa bạ cổ Nam Bộ",
    supervisorMain: "TS. Bùi Lê Tuấn Anh",
    remainingMonths: 64,
    currentMilestoneIndex: 2,
    publicationPoints: 0.5,
    status: "active",
    email: "nam.ncs24@agu.edu.vn",
    phone: "0934 556 778",
  },
  {
    id: "std-05",
    name: "Đặng Thị Thảo",
    code: "NCS210034",
    cohort: "Khóa 2021",
    department: "Khoa học Cây trồng",
    thesisTopic: "Nghiên cứu đặc tính di truyền và chọn lọc giống lúa chịu mặn thích ứng với biến đổi khí hậu tại vùng ven biển",
    supervisorMain: "PGS.TS. Nguyễn Văn Hùng",
    remainingMonths: 2,
    currentMilestoneIndex: 8,
    publicationPoints: 2.75,
    status: "overdue",
    email: "thao.ncs21@agu.edu.vn",
    phone: "0977 443 322",
  },
  {
    id: "std-06",
    name: "Phạm Hữu Đạt",
    code: "NCS230115",
    cohort: "Khóa 2023",
    department: "Khoa học Máy tính",
    thesisTopic: "Tối ưu hóa định tuyến mạng cảm biến WSN trong giám sát sạt lở bờ sông tỉnh An Giang",
    supervisorMain: "TS. Bùi Lê Tuấn Anh",
    supervisorCo: "TS. Đỗ Hoàng Long",
    remainingMonths: 47,
    currentMilestoneIndex: 3,
    publicationPoints: 1.0,
    status: "active",
    email: "dat.ncs23@agu.edu.vn",
    phone: "0944 889 900",
  },
  {
    id: "std-07",
    name: "Bùi Thanh Trúc",
    code: "NCS240019",
    cohort: "Khóa 2024",
    department: "Công nghệ Sinh học",
    thesisTopic: "Đánh giá hoạt tính sinh học của các hợp chất chiết xuất từ cây dược liệu bản địa vùng Bảy Núi An Giang",
    supervisorMain: "TS. Phạm Thị Thu Trang",
    remainingMonths: 68,
    currentMilestoneIndex: 1,
    publicationPoints: 0.0,
    status: "active",
    email: "truc.ncs24@agu.edu.vn",
    phone: "0918 223 344",
  },
  {
    id: "std-08",
    name: "Huỳnh Quốc Thắng",
    code: "NCS220061",
    cohort: "Khóa 2022",
    department: "Quản trị Kinh doanh",
    thesisTopic: "Mô hình phát triển du lịch sinh thái nông nghiệp bền vững tại các cù lao sông Tiền và sông Hậu",
    supervisorMain: "GS.TS. Trần Minh Tâm",
    remainingMonths: 22,
    currentMilestoneIndex: 6,
    publicationPoints: 1.5,
    status: "active",
    email: "thang.ncs22@agu.edu.vn",
    phone: "0908 667 788",
  },
];

// Mock Evidence Approvals Dataset
const MOCK_EVIDENCES = [
  {
    id: "ev-01",
    studentName: "Nguyễn Văn An",
    studentCode: "NCS230104",
    department: "Khoa học Máy tính",
    milestone: "Mốc 3: Báo cáo chuyên đề 1",
    documentTitle: "Báo cáo chuyên đề 1 - Tổng quan lý thuyết nghiên cứu IoT",
    fileSize: "3.8 MB",
    submittedAt: "14/10/2026 14:32",
    step: "gvhd_confirm", // GVHD confirm
    status: "Chờ GVHD xác nhận",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "ev-02",
    studentName: "Trần Thị Mai",
    studentCode: "NCS230108",
    department: "Công nghệ Sinh học",
    milestone: "Mốc 4: Báo cáo chuyên đề 2",
    documentTitle: "Báo cáo kết quả phân lập chủng vi khuẩn nội sinh vụ Đông Xuân",
    fileSize: "5.2 MB",
    submittedAt: "15/10/2026 09:15",
    step: "academic_review", // ĐVCM review
    status: "Chờ Giáo vụ duyệt",
    badgeColor: "bg-blue-100 text-[#164E9B] border-blue-200",
  },
  {
    id: "ev-03",
    studentName: "Võ Hoàng Nam",
    studentCode: "NCS240012",
    department: "Khoa học Máy tính",
    milestone: "Mốc 2: Chứng chỉ tiếng Anh quốc tế",
    documentTitle: "Chứng chỉ IELTS Academic 7.0 (BC ID: VN120045)",
    fileSize: "1.4 MB",
    submittedAt: "12/10/2026 16:40",
    step: "gvhd_confirm",
    status: "Chờ GVHD xác nhận",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "ev-04",
    studentName: "Phạm Hữu Đạt",
    studentCode: "NCS230115",
    department: "Khoa học Máy tính",
    milestone: "Mốc 3: Báo cáo chuyên đề 1",
    documentTitle: "Báo cáo chuyên đề tối ưu năng lượng mạng WSN bờ sông",
    fileSize: "4.1 MB",
    submittedAt: "13/10/2026 11:20",
    step: "gvhd_confirm",
    status: "Chờ GVHD xác nhận",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "ev-05",
    studentName: "Đặng Thị Thảo",
    studentCode: "NCS210034",
    department: "Khoa học Cây trồng",
    milestone: "Mốc 8: Minh chứng bài báo Scopus Q1",
    documentTitle: "Bài báo xuất bản trên Tạp chí Field Crops Research (Q1, IF=5.8)",
    fileSize: "2.9 MB",
    submittedAt: "11/10/2026 10:05",
    step: "academic_review",
    status: "Chờ Giáo vụ duyệt",
    badgeColor: "bg-blue-100 text-[#164E9B] border-blue-200",
  },
];

// Mock Topic Change Requests Dataset
const MOCK_TOPIC_CHANGES: TopicChangeItem[] = [
  {
    id: "tc-01",
    studentName: "Trần Thị Mai",
    studentCode: "NCS230108",
    cohort: "Khóa 2023",
    department: "Công nghệ Sinh học",
    currentTopic: "Nghiên cứu tuyển chọn và ứng dụng vi khuẩn nội sinh cố định đạm tại tỉnh An Giang",
    proposedTopic: "Nghiên cứu tuyển chọn, định danh phân tử và ứng dụng vi khuẩn nội sinh kết hợp nano-chitosan nhằm nâng cao khả năng chịu hạn của lúa tại An Giang",
    reason: "Bổ sung phương pháp định danh phân tử 16S rRNA và thử nghiệm kết hợp chế phẩm nano sinh học để tăng hiệu quả thực nghiệm trên các tiểu vùng hạn mặn.",
    supervisorName: "PGS.TS. Nguyễn Văn Hùng",
    supervisorOpinion: "Đồng ý đề xuất. Hướng nghiên cứu mới mở rộng tính ứng dụng thực tiễn của luận án và phù hợp với cơ sở vật chất của Phòng thí nghiệm trung tâm.",
    requestDate: "13/10/2026",
    status: "pending_review",
  },
  {
    id: "tc-02",
    studentName: "Nguyễn Văn An",
    studentCode: "NCS230104",
    cohort: "Khóa 2023",
    department: "Khoa học Máy tính",
    currentTopic: "Nghiên cứu ứng dụng IoT trong quan trắc chất lượng nước nông nghiệp tại An Giang",
    proposedTopic: "Nghiên cứu ứng dụng IoT kết hợp mạng nơ-ron tích chập (CNN) và học tăng cường trong dự báo chất lượng nước nuôi tôm thâm canh tại ĐBSCL",
    reason: "Cập nhật mô hình học sâu (Deep Learning) vào hệ thống dự báo nhằm nâng cao độ chính xác cảnh báo sốc môi trường cho các đầm tôm theo dữ liệu khảo sát thực tế.",
    supervisorName: "TS. Bùi Lê Tuấn Anh",
    supervisorOpinion: "Hoàn toàn ủng hộ. Hướng nghiên cứu mới giải quyết bài toán phức tạp hơn và có giá trị công bố quốc tế cao hơn.",
    requestDate: "15/10/2026",
    status: "pending_review",
  },
];

// Mock Academic Procedures Dataset
const MOCK_PROCEDURES = [
  {
    id: "proc-01",
    code: "TT-SĐH-01",
    title: "Quy trình nộp và bảo vệ đề cương chi tiết luận án tiến sĩ (Mốc 5)",
    category: "Tiến độ đào tạo",
    timeline: "Tháng 18 - 24",
    description: "NCS hoàn thành báo cáo chuyên đề 1, 2 và thông qua Bộ môn chuyên môn trước khi thành lập Hội đồng cấp ĐVCM.",
    forms: ["Mẫu 05-ĐCCT.docx", "Mẫu 05B-PhieuNX.pdf"],
  },
  {
    id: "proc-02",
    code: "TT-SĐH-02",
    title: "Thủ tục đề nghị điều chỉnh tên đề tài luận án & thay đổi GVHD",
    category: "Hồ sơ đề tài",
    timeline: "Trước mốc bảo vệ cấp ĐVCM ít nhất 6 tháng",
    description: "Áp dụng khi NCS có nhu cầu điều chỉnh định hướng nghiên cứu hoặc thay đổi nhân sự hướng dẫn theo quy chế BR-09.",
    forms: ["Mẫu 02-DonDoiDeTai.docx", "Mẫu 02B-XacNhanGVHD.pdf"],
  },
  {
    id: "proc-03",
    code: "TT-SĐH-03",
    title: "Thẩm định điểm bài báo khoa học quốc tế (WoS/Scopus ≥ 2.0 điểm)",
    category: "Chuẩn đầu ra",
    timeline: "Trước khi đăng ký bảo vệ cấp Trường",
    description: "Bộ phận SĐH kiểm tra ISSN, chỉ số IF, danh mục WoS/Scopus (Q1, Q2, Q3) và tính điểm quy đổi theo quy chế hiện hành.",
    forms: ["Mẫu 08-KeKhaiBaiBao.xlsx", "QuyCheTinhDiem-2026.pdf"],
  },
  {
    id: "proc-04",
    code: "TT-SĐH-04",
    title: "Báo cáo tiến độ học tập 6 tháng định kỳ (Tháng 6 & Tháng 12)",
    category: "Đánh giá định kỳ",
    timeline: "Đợt 1: 15/06 • Đợt 2: 15/12",
    description: "NCS nộp báo cáo kết quả và kế hoạch nghiên cứu 6 tháng tiếp theo. GVHD nhận xét chuyên môn và ký số điện tử.",
    forms: ["Mẫu 06-BCTD-6Thang.docx"],
  },
  {
    id: "proc-05",
    code: "TT-SĐH-05",
    title: "Hồ sơ đăng ký bảo vệ luận án cấp Đơn vị Chuyên môn & Cấp Trường",
    category: "Tốt nghiệp",
    timeline: "Tháng 36 - 48",
    description: "Kiểm tra điều kiện: Hoàn tất 9 mốc đào tạo, đủ 2.0 điểm bài báo, chứng chỉ ngoại ngữ và nộp lưu chiểu thư viện.",
    forms: ["Mẫu 09-DonDangKyBV.docx", "Mẫu 09B-TrichYeuLuanAn.pdf"],
  },
  {
    id: "proc-06",
    code: "TT-SĐH-06",
    title: "Đơn xin gia hạn thời gian đào tạo trình độ tiến sĩ (Tối đa 24 tháng)",
    category: "Gia hạn & Tạm hoãn",
    timeline: "Trước khi hết hạn 72 tháng ít nhất 45 ngày",
    description: "NCS nộp đơn giải trình lý do khách quan, kế hoạch chi tiết hoàn thành luận án và có ý kiến đồng ý của GVHD chính.",
    forms: ["Mẫu 07-DonGiaHan.docx"],
  },
];

function SupervisorDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // Search & Filter States
  const [globalSearchText, setGlobalSearchText] = useState("");
  const [studentSearchText, setStudentSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");

  // Interactive Modals State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<any>(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedTopicChange, setSelectedTopicChange] = useState<TopicChangeItem | null>(null);

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDossier | null>(null);

  // Dynamic Lists for approvals
  const [evidencesList, setEvidencesList] = useState(MOCK_EVIDENCES);
  const [topicChangesList, setTopicChangesList] = useState(MOCK_TOPIC_CHANGES);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Switch tab when URL param changes
  React.useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(studentSearchText.toLowerCase()) ||
        s.code.toLowerCase().includes(studentSearchText.toLowerCase()) ||
        s.thesisTopic.toLowerCase().includes(studentSearchText.toLowerCase());

      const matchDept = departmentFilter === "all" || s.department === departmentFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [studentSearchText, departmentFilter, statusFilter]);

  // Filtered Evidences List
  const filteredEvidences = useMemo(() => {
    if (evidenceFilter === "all") return evidencesList;
    if (evidenceFilter === "gvhd") return evidencesList.filter((e) => e.step === "gvhd_confirm");
    if (evidenceFilter === "academic") return evidencesList.filter((e) => e.step === "academic_review");
    return evidencesList;
  }, [evidenceFilter, evidencesList]);

  // Handle Evidence Approval submission
  const handleApprovalSubmit = (result: { decision: string; notes: string; score?: number }) => {
    if (!approvalData) return;
    const actionLabel =
      result.decision === "approve"
        ? "Đã xác nhận Đạt"
        : result.decision === "revise"
        ? "Đã yêu cầu bổ sung"
        : "Đã từ chối";

    // Remove from pending list
    setEvidencesList((prev) => prev.filter((item) => item.id !== approvalData.id));
    triggerToast(
      `${actionLabel} minh chứng cho NCS ${approvalData.studentName}. Hệ thống đã gửi email và ghi nhận lịch sử kiểm toán.`
    );
  };

  // Handle Topic Change decision
  const handleTopicDecision = (id: string, decision: "approve" | "revise" | "reject", reason?: string) => {
    const item = topicChangesList.find((t) => t.id === id);
    if (!item) return;

    setTopicChangesList((prev) => prev.filter((t) => t.id !== id));
    if (decision === "approve") {
      triggerToast(
        `Đã chấp thuận đề nghị đổi tên đề tài của NCS ${item.studentName}. Quyết định điều chỉnh đã được khởi tạo dự thảo.`
      );
    } else {
      triggerToast(
        `Đã phản hồi yêu cầu giải trình tới NCS ${item.studentName}: "${reason || "Cần làm rõ căn cứ khoa học"}"`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700"
          >
            ×
          </button>
        </div>
      )}

      {/* DASHBOARD HERO SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-[#164E9B]/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#164E9B]/10 px-3 py-1 text-xs font-bold text-[#164E9B]">
                <HoverLogo sizeClass="size-4" />
                Cổng Sau Đại Học AGU
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                Học kỳ I / 2026-2027 • Tuần 08
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                [Dữ liệu mô phỏng]
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F2744] tracking-tight">
              Tra cứu thủ tục học vụ nhanh chóng
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Theo dõi tiến độ 9 mốc tiến sĩ, thẩm định minh chứng học vụ trực tuyến, quản lý định mức hướng dẫn và xét duyệt hồ sơ đề tài theo quy chế Đào tạo Sau Đại học AGU & ĐHQG-HCM.
            </p>

            {/* Quick Keyword Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Tìm nhanh:</span>
              {[
                { label: "Quy trình nộp đề cương (Mốc 5)", tab: "procedures" },
                { label: "Duyệt đổi đề tài", tab: "topic-changes" },
                { label: "Hạn ngạch GVHD (BR-09)", tab: "supervisors" },
                { label: "Thẩm định bài báo WoS/Scopus", tab: "procedures" },
                { label: "Báo cáo 6 tháng", tab: "evidence" },
              ].map((shortcut, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(shortcut.tab)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supervisor Quick Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#164E9B] text-white font-black text-sm shadow-xs">
                TA
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">TS. Bùi Lê Tuấn Anh</h3>
                <p className="text-xs text-slate-500">Khoa Công nghệ Thông tin</p>
                <span className="inline-block rounded-sm bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-[#164E9B] mt-0.5">
                  Cán bộ Quản lý & GVHD
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Định mức sử dụng:</span>
                <span className="font-bold text-[#164E9B]">2.5 / 3.0 NCS</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#164E9B] rounded-full" style={{ width: "83.3%" }} />
              </div>
              <p className="text-[10px] text-slate-500">
                1 NCS Độc lập (1.0) + 3 Đồng HD (1.5) • Còn 0.5 chỉ tiêu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY STAT CARDS (Consistent heights, aligned actions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B]/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                NCS Đang Quản Lý
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B]">
                <Users className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">18</span>
              <span className="text-xs font-semibold text-emerald-600">
                88.9% đúng hạn
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              4 NCS hướng dẫn trực tiếp và 14 NCS thuộc chuyên ngành phụ trách học vụ.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("students")}
            className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>Xem danh sách NCS</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Card 2: Pending Evidence */}
        <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-xs hover:border-amber-400 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Chờ Duyệt Minh Chứng
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
                <FileCheck2 className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-900">{evidencesList.length}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                3 hồ sơ khẩn
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              Báo cáo chuyên đề và chứng chỉ ngoại ngữ đang chờ xác nhận chuyên môn.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("evidence")}
            className="mt-4 flex items-center justify-between border-t border-amber-200/60 pt-3 text-xs font-bold text-amber-800 hover:underline"
          >
            <span>Duyệt hồ sơ ngay</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Card 3: Topic Change Requests */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-xs hover:border-blue-400 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                Đổi Đề Tài Chờ Duyệt
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
                <FileEdit className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{topicChangesList.length}</span>
              <span className="text-xs font-semibold text-[#164E9B] bg-blue-100 px-2 py-0.5 rounded-full">
                Đã có ý kiến GVHD
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              Đề xuất điều chỉnh tên đề tài luận án bổ sung phương pháp học sâu và nano sinh học.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("topic-changes")}
            className="mt-4 flex items-center justify-between border-t border-blue-200/60 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>So sánh & Thẩm định</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Card 4: Quota Status */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B]/40 transition-all">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hạn Ngạch Hướng Dẫn
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Gauge className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">2.5</span>
              <span className="text-sm font-semibold text-slate-500">/ 3.0 NCS</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Tuân thủ quy chế BR-09 ĐHQG-HCM: Độc lập 1.0, Đồng HD 0.5 (Tối đa 3.0).
            </p>
          </div>
          <button
            onClick={() => setActiveTab("supervisors")}
            className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B] hover:underline"
          >
            <span>Chi tiết hạn ngạch</span>
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* APPROVAL WORKFLOW GUIDE BANNER */}
      <div className="rounded-2xl border border-blue-200 bg-[#E8F1FC] p-4.5 text-xs text-slate-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white">
              <Layers className="size-4" />
            </div>
            <div>
              <span className="font-bold text-[#0F2744] block text-sm">
                Quy trình Thẩm định & Phê duyệt Học vụ
              </span>
              <span className="text-[11px] text-slate-500">
                Thực hiện phân quyền nghiêm ngặt giữa NCS, GVHD và Ban Quản lý Sau Đại học.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-lg bg-white px-2.5 py-1 text-slate-700 shadow-2xs border border-blue-200/60">
              1. NCS nộp minh chứng
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-[#164E9B] px-2.5 py-1 text-white shadow-2xs font-bold">
              2. GVHD xác nhận
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-white px-2.5 py-1 text-slate-700 shadow-2xs border border-blue-200/60">
              3. Giáo vụ/ĐVCM phê duyệt
            </span>
            <ArrowRight className="size-3 text-blue-400" />
            <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-white shadow-2xs">
              4. Cập nhật mốc & Thông báo
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "dashboard", label: "Tổng quan & Hàng chờ", icon: LayoutDashboard },
            { id: "students", label: "Quản lý NCS", icon: Users, count: filteredStudents.length },
            { id: "supervisors", label: "Quản lý GVHD & Hạn ngạch", icon: UserCheck },
            { id: "evidence", label: "Duyệt minh chứng", icon: FileCheck2, count: evidencesList.length },
            { id: "topic-changes", label: "Duyệt đổi đề tài", icon: FileEdit, count: topicChangesList.length },
            { id: "procedures", label: "Thủ tục học vụ & Biểu mẫu", icon: ClipboardList },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold transition-all ${
                  isActive
                    ? "border-[#164E9B] text-[#164E9B]"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-[#164E9B]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                      isActive
                        ? "bg-[#164E9B] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DASHBOARD & PENDING QUEUE */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Urgent Approval Queues */}
            <div className="lg:col-span-2 space-y-6">
              {/* Evidence Approval Queue Section */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Hàng chờ duyệt minh chứng ưu tiên ({evidencesList.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("evidence")}
                    className="text-xs font-bold text-[#164E9B] hover:underline"
                  >
                    Xem tất cả hàng chờ →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Nghiên cứu sinh</th>
                        <th className="py-2.5 px-3">Mốc đào tạo</th>
                        <th className="py-2.5 px-3">Tài liệu nộp</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {evidencesList.slice(0, 4).map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{item.studentName}</span>
                            <span className="text-[11px] text-slate-500">{item.studentCode} • {item.department}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-[#164E9B]">{item.milestone}</span>
                            <span className="block text-[10px] text-slate-400">{item.submittedAt}</span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => {
                                setPreviewData(item);
                                setPreviewModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-slate-700 hover:text-[#164E9B] group"
                            >
                              <FileText className="size-3.5 text-rose-500" />
                              <span className="font-medium truncate max-w-[150px] underline underline-offset-2">
                                {item.documentTitle}
                              </span>
                            </button>
                            <span className="text-[10px] text-slate-400">PDF • {item.fileSize}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setApprovalData(item);
                                setApprovalModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#164E9B] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#113E7D] transition-colors shadow-2xs"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Xem & Duyệt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Thesis Topic Changes Section */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <FileEdit className="size-4 text-[#164E9B]" />
                    <span>Đề nghị điều chỉnh đề tài cần thẩm định ({topicChangesList.length})</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("topic-changes")}
                    className="text-xs font-bold text-[#164E9B] hover:underline"
                  >
                    Xem chi tiết →
                  </button>
                </div>

                <div className="space-y-3">
                  {topicChangesList.map((tc) => (
                    <div
                      key={tc.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 transition-all hover:border-blue-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div>
                          <span className="font-bold text-slate-900 text-xs">
                            {tc.studentName} ({tc.studentCode})
                          </span>
                          <span className="text-slate-500 text-[11px] ml-2">
                            {tc.department} • Nộp: {tc.requestDate}
                          </span>
                        </div>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#164E9B] self-start sm:self-auto">
                          Chờ ĐVCM xem xét
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                            Tên đề tài hiện hành:
                          </span>
                          <p className="italic text-slate-700">“{tc.currentTopic}”</p>
                        </div>

                        <div className="rounded-lg bg-blue-50/70 p-2.5 border border-blue-200">
                          <span className="text-[10px] font-bold uppercase text-[#164E9B] block mb-1">
                            Tên đề tài đề xuất mới:
                          </span>
                          <p className="font-semibold text-slate-900 italic">“{tc.proposedTopic}”</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[11px] text-slate-500 italic">
                          Ý kiến GVHD ({tc.supervisorName}): Đã đồng ý đề xuất
                        </p>
                        <button
                          onClick={() => {
                            setSelectedTopicChange(tc);
                            setTopicModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold text-[#164E9B] hover:bg-blue-50 transition-colors shadow-2xs"
                        >
                          <Eye className="size-3.5" />
                          <span>Đối chiếu & Thẩm định</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Recent Activities & Upcoming Schedule */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Calendar className="size-4 text-[#164E9B]" />
                  <span>Lịch học vụ & Sự kiện sắp tới</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-1">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span>Báo cáo tiến độ 6 tháng đợt 2</span>
                      <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[10px]">15/12/2026</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Hạn chót toàn bộ NCS nộp báo cáo và GVHD xác nhận điện tử.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Họp Tiểu ban chuyên đề Tiến sĩ 01</span>
                      <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px]">28/10/2026</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Đánh giá 4 hồ sơ chuyên đề NCS Khóa 2023 Khoa CNTT.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-900 font-bold">
                      <span>Hội đồng thẩm định bài báo WoS/Scopus</span>
                      <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[10px]">05/11/2026</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Xét đạt chuẩn đầu ra công bố khoa học mốc 8 cho NCS Đặng Thị Thảo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Audit Activities */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Clock className="size-4 text-[#164E9B]" />
                  <span>Nhật ký học vụ gần đây</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                      ✓
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        Đã duyệt minh chứng Mốc 2 cho NCS Võ Hoàng Nam
                      </p>
                      <p className="text-[10px] text-slate-400">14/10/2026 15:45 • Bởi TS. Bùi Lê Tuấn Anh</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] text-[10px] font-bold mt-0.5">
                      i
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        NCS Trần Thị Mai gửi đề xuất đổi tên đề tài
                      </p>
                      <p className="text-[10px] text-slate-400">13/10/2026 10:20 • Đã có xác nhận GVHD</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                      !
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        Cảnh báo thời gian đào tạo: NCS Đặng Thị Thảo còn 2 tháng
                      </p>
                      <p className="text-[10px] text-slate-400">12/10/2026 08:00 • Hệ thống tự động cảnh báo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ NCS (NCS MANAGEMENT) */}
      {activeTab === "students" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Danh sách Quản lý Nghiên cứu sinh ({filteredStudents.length} NCS)
              </h2>
              <p className="text-xs text-slate-500">
                Theo dõi tiến độ 9 mốc đào tạo, đề tài luận án và cảnh báo thời hạn đào tạo 72 tháng.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStudentSearchText("");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw className="size-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={studentSearchText}
                onChange={(e) => setStudentSearchText(e.target.value)}
                placeholder="Tìm theo họ tên, MSSV, tên đề tài..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B]"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B]"
            >
              <option value="all">Tất cả chuyên ngành</option>
              <option value="Khoa học Máy tính">Khoa học Máy tính</option>
              <option value="Công nghệ Sinh học">Công nghệ Sinh học</option>
              <option value="Khoa học Cây trồng">Khoa học Cây trồng</option>
              <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B]"
            >
              <option value="all">Tất cả trạng thái tiến độ</option>
              <option value="active">Đúng tiến độ (&gt;12 tháng)</option>
              <option value="warning">Cảnh báo (&lt;12 tháng)</option>
              <option value="overdue">Cảnh báo quá hạn (&lt;3 tháng)</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Họ tên & MSSV</th>
                  <th className="py-3 px-3">Chuyên ngành & Khóa</th>
                  <th className="py-3 px-3 max-w-xs">Đề tài luận án</th>
                  <th className="py-3 px-3">Mốc hiện tại</th>
                  <th className="py-3 px-3">Thời gian còn lại</th>
                  <th className="py-3 px-3">Bài báo (WoS/Scopus)</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không tìm thấy nghiên cứu sinh nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <span className="font-bold text-slate-900 block">{std.name}</span>
                        <span className="text-[11px] font-mono text-slate-500">{std.code}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">{std.department}</span>
                        <span className="text-[11px] text-slate-500">{std.cohort}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="line-clamp-2 text-slate-700 italic">“{std.thesisTopic}”</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          GVHD: <strong>{std.supervisorMain}</strong>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex rounded-full bg-blue-100 text-[#164E9B] px-2.5 py-0.5 text-[11px] font-bold">
                          Mốc {std.currentMilestoneIndex} / 9
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {std.remainingMonths > 12 ? (
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            {std.remainingMonths} tháng
                          </span>
                        ) : std.remainingMonths > 3 ? (
                          <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                            {std.remainingMonths} tháng (Cảnh báo)
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold animate-pulse">
                            {std.remainingMonths} tháng (Khẩn)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#0F2744]">
                            {std.publicationPoints.toFixed(1)} / 2.0đ
                          </span>
                          {std.publicationPoints >= 2.0 ? (
                            <span className="text-emerald-600 font-bold text-[10px]">✓ Đạt</span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Thiếu</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(std);
                            setStudentModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-[#164E9B] hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          <Eye className="size-3.5" />
                          <span>Hồ sơ chi tiết</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Hiển thị 1 - {filteredStudents.length} của {MOCK_STUDENTS.length} nghiên cứu sinh</span>
            <div className="flex items-center gap-1">
              <button disabled className="rounded border px-2 py-1 text-slate-400">Trang trước</button>
              <button className="rounded border bg-[#164E9B] text-white px-2.5 py-1 font-bold">1</button>
              <button disabled className="rounded border px-2 py-1 text-slate-400">Trang sau</button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ GVHD & HẠN NGẠCH (SUPERVISORS & QUOTA) */}
      {activeTab === "supervisors" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Supervisor List & Quota Tracker */}
            <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Định mức Hướng dẫn NCS theo Quy chế BR-09 (ĐHQG-HCM)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy định tính điểm: Hướng dẫn độc lập = 1.0 NCS • Đồng hướng dẫn = 0.5 NCS. Trần tối đa 3.0 NCS (GS/PGS tối đa 4.0 NCS).
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Giảng viên Hướng dẫn</th>
                      <th className="py-3 px-3">Khoa / Bộ môn</th>
                      <th className="py-3 px-3">HD Độc lập (1.0)</th>
                      <th className="py-3 px-3">Đồng HD (0.5)</th>
                      <th className="py-3 px-3">Hạn ngạch hiện tại</th>
                      <th className="py-3 px-3 text-right">Khả năng nhận thêm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-blue-50/40 bg-blue-50/20 font-medium">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#164E9B] block">TS. Bùi Lê Tuấn Anh</span>
                        <span className="text-[10px] text-slate-500">Mã CB: CB-2018-042 (Cá nhân)</span>
                      </td>
                      <td className="py-3 px-3">Khoa CNTT</td>
                      <td className="py-3 px-3 font-semibold">1 NCS (1.0)</td>
                      <td className="py-3 px-3 font-semibold">3 NCS (1.5)</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#0F2744]">2.5 / 3.0 NCS</span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                          <div className="h-full bg-[#164E9B] rounded-full" style={{ width: "83.3%" }} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          Còn 0.5 chỉ tiêu
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">PGS.TS. Nguyễn Văn Hùng</span>
                        <span className="text-[10px] text-slate-500">Mã CB: CB-2012-018</span>
                      </td>
                      <td className="py-3 px-3">Khoa Nông nghiệp - TNTN</td>
                      <td className="py-3 px-3 font-semibold">2 NCS (2.0)</td>
                      <td className="py-3 px-3 font-semibold">2 NCS (1.0)</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#0F2744]">3.0 / 4.0 NCS</span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          Còn 1.0 chỉ tiêu
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">GS.TS. Trần Minh Tâm</span>
                        <span className="text-[10px] text-slate-500">Mã CB: CB-2005-003</span>
                      </td>
                      <td className="py-3 px-3">Khoa Kinh tế - QTKD</td>
                      <td className="py-3 px-3 font-semibold">2 NCS (2.0)</td>
                      <td className="py-3 px-3 font-semibold">4 NCS (2.0)</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-rose-600">4.0 / 4.0 NCS</span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                          Đã đủ định mức
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-blue-50/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">TS. Phạm Thị Thu Trang</span>
                        <span className="text-[10px] text-slate-500">Mã CB: CB-2019-067</span>
                      </td>
                      <td className="py-3 px-3">Khoa Công nghệ Thông tin</td>
                      <td className="py-3 px-3 font-semibold">2 NCS (2.0)</td>
                      <td className="py-3 px-3 font-semibold">2 NCS (1.0)</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-rose-600">3.0 / 3.0 NCS</span>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                          Đã đủ định mức
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Quota assignment interactive widget */}
            <div className="space-y-4">
              <QuotaBar
                used={2.5}
                max={3.0}
                independentCount={1}
                coCount={3}
                showDetails={true}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <SupervisorSelector
                  label="Thử nghiệm phân công NCS mới"
                  selectedId="gv-01"
                  assignmentType="co_supervisor"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DUYỆT MINH CHỨNG (EVIDENCE APPROVAL QUEUE) */}
      {activeTab === "evidence" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hàng chờ Duyệt Minh chứng Học vụ ({filteredEvidences.length} hồ sơ)
              </h2>
              <p className="text-xs text-slate-500">
                Thẩm định báo cáo chuyên đề, bài báo khoa học, chứng chỉ tiếng Anh theo luồng duyệt 2 cấp.
              </p>
            </div>

            {/* Evidence filter pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setEvidenceFilter("all")}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  evidenceFilter === "all" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
                }`}
              >
                Tất cả ({evidencesList.length})
              </button>
              <button
                onClick={() => setEvidenceFilter("gvhd")}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  evidenceFilter === "gvhd" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
                }`}
              >
                Chờ GVHD ({evidencesList.filter((e) => e.step === "gvhd_confirm").length})
              </button>
              <button
                onClick={() => setEvidenceFilter("academic")}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  evidenceFilter === "academic" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
                }`}
              >
                Chờ Giáo vụ ({evidencesList.filter((e) => e.step === "academic_review").length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Mã hồ sơ</th>
                  <th className="py-3 px-3">NCS nộp</th>
                  <th className="py-3 px-3">Mốc đào tạo</th>
                  <th className="py-3 px-3">Minh chứng & Tập tin</th>
                  <th className="py-3 px-3">Thời gian nộp</th>
                  <th className="py-3 px-3">Trạng thái cấp duyệt</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvidences.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Hiện tại không có minh chứng nào đang chờ duyệt.
                    </td>
                  </tr>
                ) : (
                  filteredEvidences.map((ev) => (
                    <tr key={ev.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">{ev.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{ev.studentName}</span>
                        <span className="text-[11px] text-slate-500">{ev.studentCode} • {ev.department}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#164E9B]">{ev.milestone}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            setPreviewData(ev);
                            setPreviewModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-[#164E9B]"
                        >
                          <FileText className="size-3.5 text-rose-500" />
                          <span className="font-medium underline truncate max-w-xs">{ev.documentTitle}</span>
                        </button>
                        <span className="text-[10px] text-slate-400">PDF • {ev.fileSize}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{ev.submittedAt}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ev.badgeColor}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setPreviewData(ev);
                              setPreviewModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-100"
                            title="Xem trước PDF an toàn"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setApprovalData(ev);
                              setApprovalModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#164E9B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-2xs"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Thẩm định</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DUYỆT ĐỀ NGHỊ ĐỔI ĐỀ TÀI (THESIS TOPIC CHANGE APPROVAL) */}
      {activeTab === "topic-changes" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Duyệt Đề nghị Điều chỉnh Tên Đề tài Luận án Tiến sĩ ({topicChangesList.length} yêu cầu)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              So sánh trực quan đề tài cũ và đề xuất mới, đối chiếu lý do khoa học và ý kiến GVHD trước khi ĐVCM phê duyệt.
            </p>
          </div>

          <div className="space-y-4">
            {topicChangesList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Tất cả đề nghị điều chỉnh đề tài đã được xử lý xong.
              </div>
            ) : (
              topicChangesList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 transition-all hover:border-[#164E9B]/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B] font-bold text-xs">
                        {item.id}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.studentName} ({item.studentCode})
                        </h3>
                        <p className="text-xs text-slate-500">
                          {item.department} • {item.cohort} • Nộp ngày: {item.requestDate}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 self-start sm:self-auto">
                      Chờ Thẩm định & Phê duyệt
                    </span>
                  </div>

                  {/* Side by side diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Tên đề tài hiện tại (Gốc)
                      </span>
                      <p className="text-sm italic text-slate-700 leading-relaxed">
                        “{item.currentTopic}”
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-1.5 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B] block">
                        Tên đề tài đề xuất mới
                      </span>
                      <p className="text-sm font-bold italic text-slate-900 leading-relaxed">
                        “{item.proposedTopic}”
                      </p>
                    </div>
                  </div>

                  {/* Reason & GVHD feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-lg bg-white p-3 border border-slate-200">
                      <strong className="text-slate-800 block mb-1">Căn cứ & Lý do điều chỉnh:</strong>
                      <p className="text-slate-600 italic">{item.reason}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50/70 p-3 border border-emerald-200 text-emerald-950">
                      <strong className="text-emerald-900 block mb-1">
                        Ý kiến GVHD chính ({item.supervisorName}):
                      </strong>
                      <p className="italic">“{item.supervisorOpinion}”</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setSelectedTopicChange(item);
                        setTopicModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="size-4" />
                      <span>Xem chi tiết đối chiếu</span>
                    </button>
                    <button
                      onClick={() => handleTopicDecision(item.id, "approve")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Chấp thuận & Cập nhật QĐ</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: THỦ TỤC HỌC VỤ & BIỂU MẪU (ACADEMIC PROCEDURES & FORMS) */}
      {activeTab === "procedures" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Hệ thống Thủ tục Học vụ & Biểu mẫu Đào tạo Sau Đại học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hướng dẫn trình tự xử lý 23 nghiệp vụ đào tạo tiến sĩ và tải các mẫu đơn quy chuẩn ban hành bởi AGU & ĐHQG-HCM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_PROCEDURES.map((proc) => (
              <div
                key={proc.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 hover:border-[#164E9B] hover:bg-white transition-all shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#164E9B]">{proc.code}</span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                      {proc.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {proc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{proc.description}</p>
                  <p className="text-[10px] text-slate-400">Thời gian quy định: {proc.timeline}</p>
                </div>

                <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Biểu mẫu đính kèm:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proc.forms.map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerToast(`Đang tải tập tin biểu mẫu học vụ: ${f}`)}
                        className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-semibold text-[#164E9B] border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <Download className="size-3" />
                        <span>{f}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: DOCUMENT PREVIEW MODAL */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        documentTitle={previewData?.documentTitle}
        studentName={previewData?.studentName}
        studentCode={previewData?.studentCode}
        milestoneName={previewData?.milestone}
        submissionDate={previewData?.submittedAt}
        fileSize={previewData?.fileSize}
      />

      {/* MODAL 2: APPROVAL WORKFLOW DIALOG */}
      <ApprovalDialog
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        recordTitle={approvalData?.documentTitle}
        studentName={approvalData?.studentName}
        studentCode={approvalData?.studentCode}
        milestoneName={approvalData?.milestone}
        currentStep={approvalData?.step}
      />

      {/* MODAL 3: TOPIC CHANGE COMPARISON MODAL */}
      <TopicChangeModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        data={selectedTopicChange}
        onDecision={handleTopicDecision}
      />

      {/* MODAL 4: STUDENT DETAIL DOSSIER MODAL */}
      <StudentDetailModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}

export default function SupervisorDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải bảng điều khiển học vụ...
        </div>
      }
    >
      <SupervisorDashboardContent />
    </React.Suspense>
  );
}

