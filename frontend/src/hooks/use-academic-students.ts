"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NcsService } from "@/src/services/ncs";
import type { UpdateNcsPayload } from "@/src/services/ncs";
import type { StudentDossier, ListAcademicStudentsQuery } from "@/src/types/academic";
import { useExcelExport } from "./use-excel-export";

/**
 * React Query Key Factory cho Academic Students
 */
export const academicStudentKeys = {
  all: ["academic", "students"] as const,
  lists: () => [...academicStudentKeys.all, "list"] as const,
  list: (params?: ListAcademicStudentsQuery) => [...academicStudentKeys.lists(), params] as const,
  details: () => [...academicStudentKeys.all, "detail"] as const,
  detail: (id: string | null) => [...academicStudentKeys.details(), id] as const,
  catalogs: () => [...academicStudentKeys.all, "catalogs"] as const,
  majors: () => [...academicStudentKeys.catalogs(), "majors"] as const,
  cohorts: () => [...academicStudentKeys.catalogs(), "cohorts"] as const,
};

export function useNcsTrainingMajors(enabled = true) {
  return useQuery({
    queryKey: academicStudentKeys.majors(),
    queryFn: NcsService.getTrainingMajors,
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}

export function useExportNcs() {
  return useExcelExport(NcsService.exportExcel, "danh-sach-ncs.xlsx", "NCS");
}

export function useNcsCohorts(enabled = true) {
  return useQuery({
    queryKey: academicStudentKeys.cohorts(),
    queryFn: NcsService.getNcsCohorts,
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}

/**
 * Custom hook lấy danh sách Nghiên cứu sinh dành cho Giáo vụ (/academic/students)
 * Sử dụng TanStack Query, fetch data từ backend API GET /ncs.
 * Giữ nguyên danh sách rỗng và trạng thái lỗi do API trả về.
 */
export function useAcademicStudents(params?: ListAcademicStudentsQuery) {
  return useQuery<StudentDossier[]>({
    queryKey: academicStudentKeys.list(params),
    queryFn: () => NcsService.getAllStudents(params),
    staleTime: 1000 * 60 * 5, // 5 phút cache
    refetchOnWindowFocus: false,
  });
}

/**
 * Custom hook lấy thông tin hồ sơ chi tiết một NCS từ Backend API GET /ncs/:id
 */
export function useAcademicStudentDetail(id: string | null) {
  return useQuery({
    queryKey: academicStudentKeys.detail(id),
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
 * Custom hook cập nhật thông tin lý lịch của NCS
 */
export function useUpdateAcademicStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNcsPayload;
    }) => {
      return await NcsService.updateStudent(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicStudentKeys.all });
      queryClient.invalidateQueries({ queryKey: academicStudentKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook tải file mẫu Excel import NCS từ backend (GET /ncs/import/template)
 */
export function useDownloadNcsTemplate() {
  return useMutation({
    mutationFn: async () => {
      const blob = await NcsService.downloadImportTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mau-import-ncs.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    },
  });
}

/**
 * Hook upload file Excel để kiểm tra trước (preview) dữ liệu NCS (POST /ncs/import/preview)
 */
export function usePreviewNcsImport() {
  return useMutation({
    mutationFn: async (file: File) => {
      return await NcsService.previewImportExcel(file);
    },
  });
}

/**
 * Hook xác nhận import dữ liệu NCS từ file Excel vào CSDL (POST /ncs/import/confirm)
 */
export function useConfirmNcsImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      return await NcsService.confirmImportExcel(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicStudentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
    },
  });
}
