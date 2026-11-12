import type { Metadata } from "next";
import { SupervisorStudentsWorkspace } from "@/src/components/supervisor";
import {
  mockSupervisedStudents,
  mockSupervisorQuota,
} from "@/src/mocks/supervisor";

export const metadata: Metadata = {
  title: "Danh sách NCS hướng dẫn | Cổng GVHD",
  description:
    "Theo dõi chi tiết Nghiên cứu sinh đang hướng dẫn, vai trò phân công và tiến độ 9 mốc đào tạo.",
};

export default function SupervisorStudentsPage() {
  return (
    <SupervisorStudentsWorkspace
      students={mockSupervisedStudents}
      quota={mockSupervisorQuota}
    />
  );
}
