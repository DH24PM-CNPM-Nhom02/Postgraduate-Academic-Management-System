"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NcsService } from "@/src/services/ncs";
import {
  GvhdService,
  type BackendAssignmentRaw,
  type BackendAssignmentDecisionRaw,
  type CreateAssignmentPayload,
  type BackendGvhdRaw,
} from "@/src/services/gvhd";
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      try {
        const response = await GvhdService.getAllSupervisors();
        if (response && Array.isArray(response) && response.length > 0) {
          return response;
        }
      } catch (err) {
        console.warn("Backend GVHD service unavailable, using initial state:", err);
      }
      return MOCK_SUPERVISORS;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy thông tin chi tiết 1 Giảng viên Hướng dẫn theo ID (GET /gvhd/:id)
 * Chỉ kích hoạt khi có supervisorId hợp lệ. Query key phân biệt theo supervisorId, không chứa accessToken.
 */
export function useAcademicSupervisorDetail(
  supervisorId: string | null | undefined,
  enabled = true
) {
  return useQuery<BackendGvhdRaw>({
    queryKey: ["academic", "supervisor-detail", supervisorId ?? "none"],
    queryFn: async () => {
      if (!supervisorId) {
        throw new Error("Không có ID giảng viên hướng dẫn hợp lệ.");
      }
      return await GvhdService.getSupervisorById(supervisorId);
    },
    enabled: Boolean(supervisorId) && enabled,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy danh sách phân công GVHD hiện hành từ Backend
 */
export function useAcademicAssignments(
  params?: { ncsId?: string; gvhdId?: string; trangThai?: string },
  enabled = true
) {
  return useQuery<BackendAssignmentRaw[]>({
    queryKey: [
      "academic",
      "assignments",
      params?.ncsId ?? "all",
      params?.gvhdId ?? "all",
      params?.trangThai ?? "all",
    ],
    queryFn: async () => {
      try {
        return await GvhdService.getAssignments(params);
      } catch (err) {
        console.warn("Backend assignments service unavailable:", err);
        return [];
      }
    },
    enabled,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy danh sách Quyết định phân công GVHD đang hiệu lực cho một NCS
 */
export function useAssignmentDecisions(ncsId?: string, enabled = true) {
  const hasValidUuid = Boolean(ncsId && UUID_REGEX.test(ncsId));

  return useQuery<BackendAssignmentDecisionRaw[]>({
    queryKey: ["academic", "assignment-decisions", ncsId ?? "none"],
    queryFn: async () => {
      try {
        return await GvhdService.getAssignmentDecisions(ncsId);
      } catch (err) {
        console.warn("Backend assignment decisions unavailable:", err);
        return [];
      }
    },
    enabled: enabled && hasValidUuid,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook phân công GVHD mới cho NCS (POST /gvhd/assignments)
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAssignmentPayload) => {
      return await GvhdService.createAssignment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "supervisor-detail"] });
    },
  });
}

/**
 * Custom hook hủy phân công GVHD hiện hành (PATCH /gvhd/assignments/:id/deactivate)
 */
export function useDeactivateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, lyDo }: { id: string; lyDo: string }) => {
      return await GvhdService.deactivateAssignment(id, lyDo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic", "supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "supervisor-detail"] });
    },
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
