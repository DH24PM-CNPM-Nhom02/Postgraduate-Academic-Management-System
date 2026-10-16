import { redirect } from "next/navigation";

export default function SupervisorQuotaPage() {
  redirect("/supervisor?tab=supervisors");
}
