import type { Metadata } from "next";
import { SupervisorRequestsWorkspace } from "@/src/components/supervisor";
import { mockCandidateSupervisors } from "@/src/mocks/change-request";
import {
  mockSupervisedStudents,
  mockSupervisorProfile,
  mockSupervisorProxyRequests,
} from "@/src/mocks/supervisor";

export const metadata: Metadata = {
  title: "Đề xuất thay NCS | Cổng GVHD",
  description:
    "Khởi tạo và theo dõi đơn đề xuất đổi tên đề tài luận án hoặc thay đổi Giảng viên hướng dẫn thay cho Nghiên cứu sinh.",
};

export default function SupervisorRequestsPage() {
  return (
    <SupervisorRequestsWorkspace
      requests={mockSupervisorProxyRequests}
      students={mockSupervisedStudents}
      candidateSupervisors={mockCandidateSupervisors}
      supervisorProfile={mockSupervisorProfile}
    />
  );
}
