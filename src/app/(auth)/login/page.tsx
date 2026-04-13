import { loginAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-[var(--color-ink)]">Inicia sesión</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Accede a tus hábitos, registra tu día y revisa tu progreso semanal.
        </p>
      </div>

      <AuthForm action={loginAction} mode="login" />
    </div>
  );
}
