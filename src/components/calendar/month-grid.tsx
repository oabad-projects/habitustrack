import Link from "next/link";
import { format, isSameMonth } from "date-fns";
import { HabitType, type Habit, type HabitEntry } from "@prisma/client";

import { getMonthRange, toIsoDate } from "@/lib/dates";
import { getDateLocale, type Locale } from "@/lib/i18n";

type HabitWithEntries = Habit & { entries: HabitEntry[] };

type MonthGridProps = {
  locale: Locale;
  month: Date;
  habits: HabitWithEntries[];
  weekStartsOn: 0 | 1;
  labels: {
    monthSummary: string;
    empty: string;
    scheduled: string;
    completed: string;
    completion: string;
    noHabits: string;
    previousMonth: string;
    nextMonth: string;
    countLabel: string;
  };
};

export function MonthGrid({ locale, month, habits, weekStartsOn, labels }: MonthGridProps) {
  if (habits.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center text-sm text-[var(--color-muted)]">
        {labels.noHabits}
      </section>
    );
  }

  const range = getMonthRange(month, { weekStartsOn });
  const dateLocale = getDateLocale(locale);
  const prevMonth = format(new Date(month.getFullYear(), month.getMonth() - 1, 1), "yyyy-MM");
  const nextMonth = format(new Date(month.getFullYear(), month.getMonth() + 1, 1), "yyyy-MM");
  const scheduledTotal = range.days.reduce((total, day) => {
    return total + habits.filter((habit) => {
      if (habit.frequencyType === "DAILY") {
        return true;
      }

      return habit.weekDays.includes(day.getDay());
    }).length;
  }, 0);
  const completedTotal = range.days.reduce((total, day) => {
    const iso = toIsoDate(day);

    return total + habits.filter((habit) => {
      if (habit.frequencyType !== "DAILY" && !habit.weekDays.includes(day.getDay())) {
        return false;
      }

      const entry = habit.entries.find((item) => toIsoDate(item.date) === iso);
      const value = entry ? Number(entry.value) : 0;

      return habit.type === HabitType.CHECK
        ? value >= 1
        : habit.targetValue
          ? value >= Number(habit.targetValue)
          : value > 0;
    }).length;
  }, 0);
  const completionRate = scheduledTotal === 0 ? 0 : Math.round((completedTotal / scheduledTotal) * 100);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-black/5 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{labels.monthSummary}</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{scheduledTotal}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{labels.scheduled}</p>
        </div>
        <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-4 shadow-[0_12px_30px_rgba(16,185,129,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700/70">{labels.completed}</p>
          <p className="mt-3 text-2xl font-semibold text-emerald-800">{completedTotal}</p>
          <p className="mt-1 text-sm text-emerald-700/80">{labels.countLabel}</p>
        </div>
        <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 px-4 py-4 shadow-[0_12px_30px_rgba(245,158,11,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700/70">{labels.completion}</p>
          <p className="mt-3 text-2xl font-semibold text-amber-800">{completionRate}%</p>
          <p className="mt-1 text-sm text-amber-700/80">{format(month, "MMMM yyyy", { locale: dateLocale })}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link href={`/${locale}/calendar?month=${prevMonth}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]">
          {labels.previousMonth}
        </Link>
        <p className="text-lg font-semibold text-[var(--color-ink)]">{format(month, "MMMM yyyy", { locale: dateLocale })}</p>
        <Link href={`/${locale}/calendar?month=${nextMonth}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]">
          {labels.nextMonth}
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {range.days.slice(0, 7).map((day) => (
          <div key={day.toISOString()}>{format(day, "EEE", { locale: dateLocale })}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {range.days.map((day) => {
          const iso = toIsoDate(day);
          const scheduled = habits.filter((habit) => {
            if (habit.frequencyType === "DAILY") {
              return true;
            }
            return habit.weekDays.includes(day.getDay());
          });

          const completed = scheduled.filter((habit) => {
            const entry = habit.entries.find((item) => toIsoDate(item.date) === iso);
            const value = entry ? Number(entry.value) : 0;

            return habit.type === HabitType.CHECK
              ? value >= 1
              : habit.targetValue
                ? value >= Number(habit.targetValue)
                : value > 0;
          });

          const isCurrentMonth = isSameMonth(day, month);
          const tone =
            completed.length > 0
              ? "border-emerald-200 bg-emerald-50"
              : scheduled.length > 0
                ? "border-amber-200 bg-amber-50"
                : "border-black/5 bg-white";

          return (
            <div
              key={iso}
              aria-label={`${format(day, "PPP", { locale: dateLocale })}: ${completed.length}/${scheduled.length} ${labels.countLabel}`}
              className={`min-h-28 rounded-2xl border p-3 text-left ${tone} ${isCurrentMonth ? "" : "opacity-45"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-ink)]">{format(day, "d")}</span>
                <span
                  title={`${completed.length}/${scheduled.length} ${labels.countLabel}`}
                  className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]"
                >
                  {completed.length}/{scheduled.length}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-[var(--color-muted)]">
                <p>{scheduled.length} {labels.scheduled}</p>
                <p>{completed.length} {labels.completed}</p>
                {scheduled.length === 0 ? <p>{labels.empty}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
