import { redirect } from "next/navigation";

export default function LegacyUsersRedirectPage() {
  redirect("/admin");
}
