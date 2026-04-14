import { parse, isValid } from "date-fns";

import { MonthGrid } from "@/components/calendar/month-grid";
import { requireUser } from "@/lib/auth";
import { getMonthRange } from "@/lib/dates";
import { getDictionary, getWeekStartsOn, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type CalendarPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ month?: string }>;
};

function resolveMonth(value?: string) {
  if (!value) {
    return new Date();
  }

  const parsed = parse(value, "yyyy-MM", new Date());
  return isValid(parsed) ? parsed : new Date();
}

export default async function CalendarPage({ params, searchParams }: CalendarPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);
  const monthParam = (await searchParams).month;
  const month = resolveMonth(monthParam);
  const weekStartsOn = getWeekStartsOn(locale);
  const range = getMonthRange(month, { weekStartsOn });

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    include: {
      entries: {
        where: {
          date: {
            gte: range.start,
            lte: range.end,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.calendarPage.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{dictionary.calendarPage.title}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{dictionary.calendarPage.description}</p>
      </section>

      <MonthGrid
        locale={locale}
        month={month}
        habits={habits}
        weekStartsOn={weekStartsOn}
        labels={{
          monthSummary: dictionary.calendarPage.monthSummary,
          empty: dictionary.calendarPage.empty,
          scheduled: dictionary.calendarPage.scheduled,
          completed: dictionary.calendarPage.completed,
          completion: dictionary.calendarPage.completion,
          noHabits: dictionary.calendarPage.noHabits,
          previousMonth: dictionary.calendarPage.previousMonth,
          nextMonth: dictionary.calendarPage.nextMonth,
          countLabel: dictionary.calendarPage.countLabel,
        }}
      />
    </div>
  );
}
