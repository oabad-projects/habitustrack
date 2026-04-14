import { ProgressGrid } from "@/components/progress/progress-grid";
import { requireUser } from "@/lib/auth";
import { getWeekRange } from "@/lib/dates";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type ProgressPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);
  const week = getWeekRange();

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
    include: {
      entries: {
        where: { date: { gte: week.start, lte: week.end } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.progressPage.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{dictionary.progressPage.title}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{dictionary.progressPage.description}</p>
      </section>

      <ProgressGrid
        habits={habits}
        locale={locale}
        labels={{
          emptyTitle: dictionary.progressPage.emptyTitle,
          emptyDescription: dictionary.progressPage.emptyDescription,
          completedDays: dictionary.progressPage.completedDays,
          completion: dictionary.progressPage.completion,
          typeCheck: dictionary.common.typeCheck,
          typeNumber: dictionary.common.typeNumber,
          streak: dictionary.progressPage.streak,
          day: dictionary.progressPage.day,
          days: dictionary.progressPage.days,
          goal: dictionary.progressPage.goal,
        }}
      />
    </div>
  );
}
