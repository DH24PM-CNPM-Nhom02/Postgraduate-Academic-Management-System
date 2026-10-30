// components/academic — Academic Affairs Staff (Giáo vụ) components

export { AcademicHeader } from "./header";
export { AcademicSidebar } from "./sidebar";
export { AcademicFooter } from "./footer";

export { QuotaBar } from "./QuotaBar";
export { SupervisorSelector } from "./SupervisorSelector";
export { DocumentPreviewModal } from "./DocumentPreviewModal";
export { ApprovalDialog } from "./ApprovalDialog";
export { TopicChangeModal, type TopicChangeItem } from "./TopicChangeModal";
export { StudentDetailModal, type StudentDossier } from "./StudentDetailModal";
export {
  ExcelImportModal,
  type EntityImportType,
  type ExcelImportModalProps,
  type ImportedEntityItem,
} from "./ExcelImportModal";
export { GlobalSearchModal } from "./GlobalSearchModal";
export { HoverLogo } from "./HoverLogo";
export * from "./mockData";

// Clean Architecture View Components
export { StudentsManagementView } from "./students/StudentsManagementView";
export { SupervisorsManagementView } from "./supervisors/SupervisorsManagementView";
export { EvidenceManagementView } from "./evidence/EvidenceManagementView";
export { TopicChangesManagementView } from "./topic-changes/TopicChangesManagementView";
export { AcademicDashboardView } from "./dashboard/AcademicDashboardView";
