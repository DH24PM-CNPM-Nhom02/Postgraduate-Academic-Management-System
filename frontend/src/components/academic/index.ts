// components/academic — Academic Affairs Staff (Giáo vụ) components

export { AcademicHeader } from "./header";
export { AcademicSidebar } from "./sidebar";
export { AcademicFooter } from "./footer";

export { QuotaBar } from "./QuotaBar";
export { SupervisorSelector } from "./SupervisorSelector";
export { DocumentPreviewModal } from "./DocumentPreviewModal";
export { ApprovalDialog } from "./ApprovalDialog";
export { EvaluationInputModal } from "./EvaluationInputModal";
export { SupervisorAssignmentModal } from "./SupervisorAssignmentModal";
export { DecisionIssueModal } from "./DecisionIssueModal";
export { TopicChangeModal, type TopicChangeItem } from "./TopicChangeModal";
export { StudentDetailModal, type StudentDossier } from "./students/StudentDetailModal";
export { StudentUpdateModal, type StudentUpdateModalProps } from "./students/StudentUpdateModal";
export {
  ExcelImportModal,
  type EntityImportType,
  type ExcelImportModalProps,
  type ImportedEntityItem,
} from "./ExcelImportModal";
export { GlobalSearchModal } from "./GlobalSearchModal";
export { HoverLogo } from "./HoverLogo";
export { MOCK_CALENDAR_EVENTS } from "./mockData";
export type { SupervisorQuotaRecord, EvidenceItem, CalendarEventItem, DecisionItem, PendingMilestoneItem } from "@/src/types/academic";

// Clean Architecture View Components
export { StudentsManagementView } from "./students/StudentsManagementView";
export { StudentCellAction, type StudentCellActionProps } from "./students/StudentCellAction";
export { SupervisorsManagementView } from "./supervisors/SupervisorsManagementView";
export { SupervisorCellAction, type SupervisorCellActionProps } from "./supervisors/SupervisorCellAction";
export { SupervisorDetailModal, type SupervisorDetailModalProps } from "./supervisors/SupervisorDetailModal";
export { SupervisorUpdateModal, type SupervisorUpdateModalProps } from "./supervisors/SupervisorUpdateModal";
export { EvidenceManagementView } from "./evidence/EvidenceManagementView";
export { TopicChangesManagementView } from "./topic-changes/TopicChangesManagementView";
export { AcademicDashboardView } from "./dashboard/AcademicDashboardView";
export { DecisionsManagementView } from "./decisions/DecisionsManagementView";
export { MilestoneReviewView } from "./milestone-review/MilestoneReviewView";
export * from "./theses";
