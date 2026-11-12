"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { DocumentService } from "@/src/services/document";
import type {
  DocumentMetadataResponse,
  DocumentPreviewResult,
  UploadDocumentRequest,
} from "@/src/types/api/document";

/**
 * Bộ queryKey chuẩn cho phân hệ Tài liệu PDF
 */
export const documentKeys = {
  all: ["documents"] as const,
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
  return useMutation<
    DocumentMetadataResponse,
    ApiClientError,
    UploadDocumentRequest
  >({
    mutationFn: (payload) => DocumentService.uploadPdf(payload),
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
