import { requireGuest } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/lib/i18n";

type AuthLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  await requireGuest(locale);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-cream)] px-4 py-8 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(222,184,135,0.25),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(221,160,221,0.16),_transparent_28%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {dictionary.common.appName}
          </span>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
            {dictionary.auth.heroTitle}
          </h1>
          <p className="max-w-lg text-lg leading-8 text-[var(--color-muted)]">{dictionary.auth.heroDescription}</p>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}
