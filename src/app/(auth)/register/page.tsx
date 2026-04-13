import { registerAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-[var(--color-ink)]">Crea tu cuenta</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Empieza con una base simple: hábitos diarios, registro rápido y visibilidad de avance.
        </p>
      </div>

      <AuthForm action={registerAction} mode="register" />
    </div>
  );
}
