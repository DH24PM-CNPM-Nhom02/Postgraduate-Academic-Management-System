"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { DocumentService } from "@/src/services/document";
import type {
  DocumentMetadataResponse,
  DocumentPreviewResult,
  PublicDocumentType,
  UploadDocumentRequest,
} from "@/src/types/api/document";

/**
 * Bộ queryKey chuẩn cho phân hệ Tài liệu PDF
 */
export const documentKeys = {
  all: ["documents"] as const,
  list: ["documents", "list"] as const,
  publicLists: ["documents", "public-list"] as const,
  publicList: (documentType: PublicDocumentType) =>
    [...documentKeys.publicLists, documentType] as const,
  detail: (documentId: string) =>
    [...documentKeys.all, "detail", documentId] as const,
};

/**
 * Lấy thông tin metadata (tên file, kích thước...) của 1 tài liệu theo ID
 */
export function useDocumentMetadata(documentId?: string | null) {
  return useQuery<DocumentMetadataResponse, ApiClientError>({
    queryKey: documentKeys.detail(documentId ?? ""),
    queryFn: () => DocumentService.getMetadata(documentId!),
    enabled: Boolean(documentId),
    // Metadata của 1 file đã upload là cố định, giữ cache lâu để tránh gọi lặp lại
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation upload 1 file PDF lên Backend để nhận về fileId
 */
export function useUploadDocument() {
  const client = useQueryClient();
  return useMutation<
    DocumentMetadataResponse,
    ApiClientError,
    UploadDocumentRequest
  >({
    mutationFn: (payload) => DocumentService.uploadPdf(payload),
    onSuccess: async ({ documentType }) => {
      const refreshList = client.invalidateQueries({ queryKey: documentKeys.list });
      if (documentType === "QUY_DINH" || documentType === "BIEU_MAU") {
        await client.invalidateQueries({ queryKey: documentKeys.publicList(documentType) });
      }
      await refreshList;
    },
  });
}

/**
 * Mutation tải file PDF về dưới dạng Blob (có xác thực Bearer Token)
 */
export function useDownloadDocument() {
  return useMutation<Blob, ApiClientError, string>({
    mutationFn: (documentId) => DocumentService.downloadBlob(documentId),
  });
}

/**
 * Mutation tải PDF và tạo objectUrl tạm thời để mở trong PdfViewer
 */
export function useDocumentPreviewUrl() {
  return useMutation<DocumentPreviewResult, ApiClientError, string>({
    mutationFn: (documentId) => DocumentService.createPreviewUrl(documentId),
  });
}

export function useDocuments() {
  return useQuery({ queryKey: documentKeys.list, queryFn: DocumentService.list });
}

export function usePublicDocuments(documentType: PublicDocumentType) {
  return useQuery({
    queryKey: documentKeys.publicList(documentType),
    queryFn: ({ signal }) => DocumentService.listPublic(documentType, signal),
  });
}

export function useDeleteDocument() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: DocumentService.remove,
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: documentKeys.detail(id) });
      return Promise.all([
        client.invalidateQueries({ queryKey: documentKeys.list }),
        client.invalidateQueries({ queryKey: documentKeys.publicLists }),
      ]);
    },
  });
}
