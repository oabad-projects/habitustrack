import Link from "next/link";

import { logoutAction } from "@/actions/auth";
import { AppNav } from "@/components/layout/app-nav";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { getDictionary, type Locale } from "@/lib/i18n";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  userName?: string | null;
  locale?: Locale;
  labels?: {
    today: string;
    habits: string;
    progress: string;
    calendar: string;
    logout: string;
    yourSpace: string;
    appName: string;
    language: string;
    english: string;
    spanish: string;
  };
};

export function AppShell({ children, title, description, userName, locale = "es", labels }: AppShellProps) {
  const dictionary = getDictionary(locale);
  const resolvedLabels = labels ?? {
    today: dictionary.common.today,
    habits: dictionary.common.habits,
    progress: dictionary.common.progress,
    calendar: dictionary.common.calendar,
    logout: dictionary.common.logout,
    yourSpace: dictionary.common.yourSpace,
    appName: dictionary.common.appName,
    language: dictionary.common.language,
    english: dictionary.common.english,
    spanish: dictionary.common.spanish,
  };
  const links = [
    { href: `/${locale}/today`, label: resolvedLabels.today },
    { href: `/${locale}/habits`, label: resolvedLabels.habits },
    { href: `/${locale}/progress`, label: resolvedLabels.progress },
    { href: `/${locale}/calendar`, label: resolvedLabels.calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-black/5 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href={`/${locale}/today`} className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {resolvedLabels.appName}
              </Link>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{title}</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <AppNav links={links} />

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[var(--color-sand)] px-3 py-2 text-sm text-[var(--color-ink)]">
                  <span className="font-medium">{resolvedLabels.language}</span>
                  <LocaleSwitcher
                    locale={locale}
                    labels={{
                      english: resolvedLabels.english,
                      spanish: resolvedLabels.spanish,
                    }}
                  />
                </div>
                <span className="text-sm text-[var(--color-muted)]">{userName ?? resolvedLabels.yourSpace}</span>
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-blush)]">
                    {resolvedLabels.logout}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6 pb-28 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
