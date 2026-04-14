import { format } from "date-fns";

import { TodayList } from "@/components/habits/today-list";
import { requireUser } from "@/lib/auth";
import { getDateLocale, getDictionary, resolveLocale } from "@/lib/i18n";
import { getToday, toIsoDate } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habits";
import { prisma } from "@/lib/prisma";

type TodayPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TodayPage({ params }: TodayPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);
  const today = getToday();
  const todayIso = toIsoDate(today);

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, isActive: true },
    include: { entries: { where: { date: today } } },
    orderBy: { createdAt: "asc" },
  });

  const scheduledHabits = habits.filter((habit) => isHabitScheduledForDate(habit, today));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.todayPage.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{dictionary.todayPage.title}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {format(today, "EEEE, MMMM d", { locale: getDateLocale(locale) })} · {dictionary.todayPage.descriptionPrefix}
        </p>
      </section>

      <TodayList
        habits={scheduledHabits}
        date={todayIso}
        dateLabel={dictionary.todayPage.onDate}
        locale={locale}
        labels={{
          emptyTitle: dictionary.todayPage.emptyTitle,
          emptyDescription: dictionary.todayPage.emptyDescription,
          typeCheck: dictionary.common.typeCheck,
          typeNumber: dictionary.common.typeNumber,
          target: dictionary.common.target,
          noTarget: dictionary.common.noTarget,
          markPending: dictionary.todayPage.markPending,
          markDone: dictionary.todayPage.markDone,
          save: dictionary.common.save,
          done: dictionary.todayPage.done,
          pending: dictionary.todayPage.pending,
          noEntry: dictionary.todayPage.noEntry,
        }}
      />
    </div>
  );
}
