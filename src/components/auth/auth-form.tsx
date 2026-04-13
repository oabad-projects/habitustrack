"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ActionState } from "@/actions/types";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";

type AuthFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  mode: "login" | "register";
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export function AuthForm({ action, mode }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {mode === "register" ? (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre"
            className="field"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
          Email
        </label>
        <input id="email" name="email" type="email" placeholder="tu@email.com" className="field" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">
          Contraseña
        </label>
        <input id="password" name="password" type="password" placeholder="••••••••" className="field" required />
      </div>

      <FormMessage message={state.message} success={state.success} />

      <SubmitButton className="w-full">
        {mode === "login" ? "Entrar" : "Crear cuenta"}
      </SubmitButton>

      <p className="text-sm text-[var(--color-muted)]">
        {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-semibold text-[var(--color-ink)]">
          {mode === "login" ? "Regístrate" : "Inicia sesión"}
        </Link>
      </p>
    </form>
  );
}
