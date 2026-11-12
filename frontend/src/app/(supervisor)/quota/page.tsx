import { redirect } from "next/navigation";

export default function LegacySupervisorQuotaRedirectPage() {
  redirect("/supervisor/quota");
}
