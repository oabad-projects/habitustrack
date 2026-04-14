"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ActionState } from "@/actions/types";
import { FormMessage } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { getDictionary, type Locale } from "@/lib/i18n";

type AuthFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  mode: "login" | "register";
  locale?: Locale;
  labels?: {
    name: string;
    email: string;
    password: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    noAccount: string;
    haveAccount: string;
    signUp: string;
    signIn: string;
    login: string;
    register: string;
  };
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export function AuthForm({ action, mode, locale = "es", labels }: AuthFormProps) {
  const dictionary = getDictionary(locale);
  const resolvedLabels = labels ?? {
    name: dictionary.auth.name,
    email: dictionary.auth.email,
    password: dictionary.auth.password,
    namePlaceholder: dictionary.auth.namePlaceholder,
    emailPlaceholder: dictionary.auth.emailPlaceholder,
    passwordPlaceholder: dictionary.auth.passwordPlaceholder,
    noAccount: dictionary.auth.noAccount,
    haveAccount: dictionary.auth.haveAccount,
    signUp: dictionary.auth.signUp,
    signIn: dictionary.auth.signIn,
    login: dictionary.common.login,
    register: dictionary.common.register,
  };
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      {mode === "register" ? (
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
            {resolvedLabels.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={resolvedLabels.namePlaceholder}
            className="field"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
          {resolvedLabels.email}
        </label>
        <input id="email" name="email" type="email" placeholder={resolvedLabels.emailPlaceholder} className="field" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">
          {resolvedLabels.password}
        </label>
        <input id="password" name="password" type="password" placeholder={resolvedLabels.passwordPlaceholder} className="field" required />
      </div>

      <FormMessage message={state.message} success={state.success} />

      <SubmitButton className="w-full">
        {mode === "login" ? resolvedLabels.login : resolvedLabels.register}
      </SubmitButton>

      <p className="text-sm text-[var(--color-muted)]">
        {mode === "login" ? resolvedLabels.noAccount : resolvedLabels.haveAccount}{" "}
        <Link href={`/${locale}${mode === "login" ? "/register" : "/login"}`} className="font-semibold text-[var(--color-ink)]">
          {mode === "login" ? resolvedLabels.signUp : resolvedLabels.signIn}
        </Link>
      </p>
    </form>
  );
}
