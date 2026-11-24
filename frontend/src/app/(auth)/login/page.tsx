import { AuthPageShell } from "@/src/components/auth/auth-page-shell";
import { LoginForm } from "@/src/components/auth/login/login-form";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  );
}
