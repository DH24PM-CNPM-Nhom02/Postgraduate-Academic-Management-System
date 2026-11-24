import { AuthPageShell } from "@/src/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/src/components/auth/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
