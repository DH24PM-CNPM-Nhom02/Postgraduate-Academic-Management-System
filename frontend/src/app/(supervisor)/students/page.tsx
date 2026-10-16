import { redirect } from "next/navigation";

export default function SupervisorStudentsPage() {
  redirect("/supervisor?tab=students");
}
