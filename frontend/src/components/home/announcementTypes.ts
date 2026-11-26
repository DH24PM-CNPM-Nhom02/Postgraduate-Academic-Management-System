export interface AnnouncementItem {
  id: string;
  title: string;
  category: "Học vụ" | "Quan trọng" | "Bảo vệ luận án" | "Quy chế" | "Đề cương";
  date: string;
  summary: string;
  author: string;
  department: string;
  content: string[];
  attachments?: Array<{ name: string; size: string; format: "PDF" | "DOCX" | "XLSX" }>;
}

export interface AnnouncementDetailModalProps {
  announcement: AnnouncementItem | null;
  isOpen: boolean;
  onClose: () => void;
}
