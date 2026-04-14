import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/lib/i18n";

type PrivateLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PrivateLayout({ children, params }: PrivateLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);

  return (
    <AppShell
      title={dictionary.appShell.title}
      description={dictionary.appShell.description}
      userName={user.name || user.email}
      locale={locale}
      labels={{
        today: dictionary.common.today,
        habits: dictionary.common.habits,
        progress: dictionary.common.progress,
        logout: dictionary.common.logout,
        yourSpace: dictionary.common.yourSpace,
        appName: dictionary.common.appName,
        language: dictionary.common.language,
        english: dictionary.common.english,
        spanish: dictionary.common.spanish,
      }}
    >
      {children}
    </AppShell>
  );
}
