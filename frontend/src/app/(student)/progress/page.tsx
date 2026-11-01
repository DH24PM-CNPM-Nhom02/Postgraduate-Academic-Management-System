import { redirect } from "next/navigation";

/**
 * Redirect tự động từ route cũ /progress sang route chuẩn /student/progress
 */
export default function LegacyProgressRedirect() {
  redirect("/student/progress");
}
