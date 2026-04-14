import Link from "next/link";

import { HabitCard } from "@/components/habits/habit-card";
import { requireUser } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type HabitsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HabitsPage({ params }: HabitsPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: { entries: { orderBy: { date: "desc" }, take: 7 } },
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.habitsPage.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{dictionary.habitsPage.title}</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{dictionary.habitsPage.description}</p>
        </div>
        <Link
          href={`/${locale}/habits/new`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {dictionary.habitsPage.newHabit}
        </Link>
      </section>

      <section className="grid gap-4">
        {habits.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">{dictionary.habitsPage.emptyTitle}</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{dictionary.habitsPage.emptyDescription}</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              locale={locale}
              labels={{
                everyDay: dictionary.habitsPage.everyDay,
                weekdays: dictionary.habitsPage.weekdays,
                typeCheck: dictionary.common.typeCheck,
                typeNumber: dictionary.common.typeNumber,
                active: dictionary.common.active,
                paused: dictionary.common.paused,
                target: dictionary.common.target,
                savedEntries: dictionary.habitsPage.savedEntries,
                edit: dictionary.common.edit,
                deactivate: dictionary.habitsPage.deactivate,
                reactivate: dictionary.habitsPage.reactivate,
                delete: dictionary.common.delete,
              }}
            />
          ))
        )}
      </section>
    </div>
  );
}
