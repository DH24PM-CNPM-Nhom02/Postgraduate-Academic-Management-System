import { redirect } from "next/navigation";

export default function SupervisorProgressReportsPage() {
  redirect("/supervisor?tab=evidence");
}
