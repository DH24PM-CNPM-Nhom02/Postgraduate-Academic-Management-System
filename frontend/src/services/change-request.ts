import { apiClient } from "@/src/lib/api";
import type {
  ApproveChangeRequestPayload,
  ChangeRequestDetail,
  ChangeRequestListQuery,
  ChangeRequestListResponse,
} from "@/src/types/api/change-request";

const path = "/change-request";

export const ChangeRequestService = {
  async list(params: ChangeRequestListQuery, signal?: AbortSignal) {
    const { data } = await apiClient.get<ChangeRequestListResponse>(path, { params, signal });
    return data;
  },

  async listForSearch(filters: Omit<ChangeRequestListQuery, "page" | "limit">, signal?: AbortSignal) {
    const limit = 100;
    const first = await ChangeRequestService.list({ ...filters, page: 1, limit }, signal);
    const items = [...first.data];

    for (let page = 2; page <= Math.ceil(first.total / limit); page++) {
      const next = await ChangeRequestService.list({ ...filters, page, limit }, signal);
      items.push(...next.data);
    }

    return [...new Map(items.map((item) => [item.id, item])).values()];
  },

  async detail(id: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<ChangeRequestDetail>(`${path}/${id}`, { signal });
    return data;
  },

  async approve(id: string, payload: ApproveChangeRequestPayload) {
    await apiClient.patch(`${path}/${id}/approve`, payload);
  },

  async reject(id: string, lyDoTuChoi: string) {
    await apiClient.patch(`${path}/${id}/reject`, { lyDoTuChoi });
  },
};
