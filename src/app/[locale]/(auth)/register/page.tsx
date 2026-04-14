import { registerAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { getDictionary, resolveLocale } from "@/lib/i18n";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-[var(--color-ink)]">{dictionary.auth.registerTitle}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{dictionary.auth.registerDescription}</p>
      </div>

      <AuthForm
        action={registerAction}
        mode="register"
        locale={locale}
        labels={{
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
        }}
      />
    </div>
  );
}
