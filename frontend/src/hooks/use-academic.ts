"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
        const response = await NcsService.getAllStudents();
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
 * Custom hook lấy thông tin chi tiết một NCS từ Backend
 */
export function useStudentDetail(id: string | null) {
  return useQuery({
    queryKey: ["academic", "student", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        return await NcsService.getStudentById(id);
      } catch (err) {
        console.warn(`Không thể lấy chi tiết NCS ${id} từ backend:`, err);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Custom hook cập nhật trạng thái học vụ của NCS
 */
export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      trangThai,
      lyDo,
    }: {
      id: string;
      trangThai: string;
      lyDo?: string;
    }) => {
      return await NcsService.updateStudentStatus(id, trangThai, lyDo);
    },
    onSuccess: () => {
      // Tự động làm mới lại danh sách sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
    },
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
