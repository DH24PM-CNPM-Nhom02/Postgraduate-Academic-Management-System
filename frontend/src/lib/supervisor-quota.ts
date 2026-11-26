export const SUPERVISOR_QUOTA_BY_DEGREE = {
  TIEN_SI: 3,
  TIEN_SI_KHOA_HOC: 5,
  PHO_GIAO_SU: 5,
  GIAO_SU: 7,
} as const;

export function getSupervisorQuotaLimit(degree?: string): number | undefined {
  const label = degree?.trim().toLowerCase().normalize("NFD")
    .replace(/\p{M}/gu, "").replace(/_/g, " ").replace(/\s+/g, " ") ?? "";
  if (/^(pgs|pho giao su)\b/.test(label)) return SUPERVISOR_QUOTA_BY_DEGREE.PHO_GIAO_SU;
  if (/^(gs|giao su)\b/.test(label)) return SUPERVISOR_QUOTA_BY_DEGREE.GIAO_SU;
  if (/^(tskh|ts kh|tien si khoa hoc)\b/.test(label)) return SUPERVISOR_QUOTA_BY_DEGREE.TIEN_SI_KHOA_HOC;
  if (/^(ts|tien si)\b/.test(label)) return SUPERVISOR_QUOTA_BY_DEGREE.TIEN_SI;
}
