import { apiClient } from "@/src/lib/api";
import type { NcsCohortCatalogItem, NcsMajorCatalogItem } from "./ncs";

export type CatalogKind = "majors" | "cohorts";
export type CatalogItem = NcsCohortCatalogItem | NcsMajorCatalogItem;

const endpoints = {
  majors: "/ncs/catalogs/nganh-dao-tao",
  cohorts: "/ncs/catalogs/khoa-hoc",
};

export const TrainingCatalogService = {
  async saveMajor(data: Omit<NcsMajorCatalogItem, "id">, id?: number) {
    const url = endpoints.majors;
    if (id === undefined) await apiClient.post(url, data);
    else await apiClient.patch(`${url}/${id}`, data);
  },
  async saveCohort(data: Omit<NcsCohortCatalogItem, "id">, id?: string) {
    const url = endpoints.cohorts;
    if (id === undefined) await apiClient.post(url, data);
    else await apiClient.patch(`${url}/${encodeURIComponent(id)}`, data);
  },
  async remove(kind: CatalogKind, id: number | string) {
    await apiClient.delete(`${endpoints[kind]}/${encodeURIComponent(id)}`);
  },
};
