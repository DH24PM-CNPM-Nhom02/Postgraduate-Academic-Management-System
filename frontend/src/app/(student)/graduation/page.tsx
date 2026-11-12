import { redirect } from "next/navigation";

/**
 * Chuyển hướng route `/graduation` về route chuẩn phân hệ NCS `/student/graduation`.
 */
export default function GraduationRedirectPage() {
  redirect("/student/graduation");
}
