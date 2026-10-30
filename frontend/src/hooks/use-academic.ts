"use client";

import { useQuery } from "@tanstack/react-query";
import { NcsService } from "@/src/services/ncs";
import {
  MOCK_STUDENTS,
  MOCK_SUPERVISORS,
  MOCK_EVIDENCES,
  MOCK_TOPIC_CHANGES,
} from "@/src/components/academic/mockData";
import type {
  StudentDossier,
  SupervisorQuotaRecord,
  EvidenceItem,
  TopicChangeItem,
} from "@/src/types/academic";

/**
 * Custom hook lấy danh sách Nghiên cứu sinh (Học vụ)
 * Sử dụng React Query, chỉ fetch khi Component Bảng NCS được mount vào DOM.
 */
export function useAcademicStudents() {
  return useQuery<StudentDossier[]>({
    queryKey: ["academic", "students"],
    queryFn: async () => {
      try {
        const response = await NcsService.getAllStudentsWithPagination();
        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
      } catch (err) {
        console.warn("Backend NCS service unavailable, using initial state:", err);
      }
      return MOCK_STUDENTS;
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy danh sách Giảng viên Hướng dẫn & Hạn ngạch (BR-09)
 * Chỉ fetch khi Component Bảng GVHD được mount.
 */
export function useAcademicSupervisors() {
  return useQuery<SupervisorQuotaRecord[]>({
    queryKey: ["academic", "supervisors"],
    queryFn: async () => {
      // Giả lập hoặc gọi endpoint API thực tế khi backend sẵn sàng
      return MOCK_SUPERVISORS;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy danh sách Minh chứng học vụ chờ duyệt
 * Chỉ fetch khi Component Bảng Minh chứng được mount.
 */
export function useAcademicEvidences() {
  return useQuery<EvidenceItem[]>({
    queryKey: ["academic", "evidences"],
    queryFn: async () => {
      return MOCK_EVIDENCES;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy danh sách Yêu cầu đổi tên đề tài chờ duyệt
 * Chỉ fetch khi Component Bảng Đổi đề tài được mount.
 */
export function useAcademicTopicChanges() {
  return useQuery<TopicChangeItem[]>({
    queryKey: ["academic", "topic-changes"],
    queryFn: async () => {
      return MOCK_TOPIC_CHANGES;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
