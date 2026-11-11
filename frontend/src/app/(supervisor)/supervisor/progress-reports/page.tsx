import type { Metadata } from "next";
import { SupervisorProgressReportsWorkspace } from "@/src/components/supervisor";
import {
  mockSupervisedStudents,
  mockSupervisorProgressReports,
} from "@/src/mocks/supervisor";

export const metadata: Metadata = {
  title: "Báo cáo tiến độ NCS | Cổng GVHD",
  description:
    "Theo dõi danh sách minh chứng các mốc đào tạo của Nghiên cứu sinh đang hướng dẫn và mở tài liệu PDF.",
};

export default function SupervisorProgressReportsPage() {
  return (
    <SupervisorProgressReportsWorkspace
      reports={mockSupervisorProgressReports}
      students={mockSupervisedStudents}
    />
  );
}
