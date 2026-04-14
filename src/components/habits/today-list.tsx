import { HabitType } from "@prisma/client";

import { saveTodayEntryAction } from "@/actions/habits";
import type { HabitWithEntries } from "@/lib/habits";
import { getTodayValue } from "@/lib/habits";
import { getDictionary, type Locale } from "@/lib/i18n";
import { formatNumericValue } from "@/lib/utils";

type TodayListProps = {
  habits: HabitWithEntries[];
  date: string;
  dateLabel: string;
  locale?: Locale;
  labels?: {
    emptyTitle: string;
    emptyDescription: string;
    typeCheck: string;
    typeNumber: string;
    target: string;
    noTarget: string;
    markPending: string;
    markDone: string;
    save: string;
    done: string;
    pending: string;
    noEntry: string;
  };
};

export function TodayList({ habits, date, dateLabel, locale = "es", labels }: TodayListProps) {
  const dictionary = getDictionary(locale);
  const resolvedLabels = labels ?? {
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
  };
  if (habits.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">{resolvedLabels.emptyTitle}</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {resolvedLabels.emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {habits.map((habit) => {
        const todayValue = getTodayValue(habit, new Date(date));

        return (
          <article
            key={habit.id}
            className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">{habit.name}</h3>
                  <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {habit.type === HabitType.CHECK ? resolvedLabels.typeCheck : resolvedLabels.typeNumber}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">
                  {habit.targetValue ? `${resolvedLabels.target} ${formatNumericValue(habit.targetValue.toString(), locale)}` : resolvedLabels.noTarget}{" "}
                  {habit.unit ?? ""}
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  {dateLabel} ·{" "}
                  {habit.type === HabitType.CHECK
                    ? todayValue === 1
                      ? resolvedLabels.done
                      : resolvedLabels.pending
                    : todayValue === null || todayValue === 0
                      ? resolvedLabels.noEntry
                      : `${formatNumericValue(todayValue, locale)}${habit.unit ? ` ${habit.unit}` : ""}`}
                </p>
              </div>

              <form action={saveTodayEntryAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input type="hidden" name="habitId" value={habit.id} />
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="locale" value={locale} />

                {habit.type === HabitType.CHECK ? (
                  <>
                    <input type="hidden" name="value" value={todayValue === 1 ? "0" : "1"} />
                    <button className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                      {todayValue === 1 ? resolvedLabels.markPending : resolvedLabels.markDone}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      name="value"
                      min="0"
                      step="0.01"
                      defaultValue={typeof todayValue === "number" ? todayValue : ""}
                      className="field min-w-40"
                      placeholder={habit.targetValue?.toString() ?? "0"}
                    />
                    <button className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                      {resolvedLabels.save}
                    </button>
                  </>
                )}
              </form>
            </div>
          </article>
        );
      })}
    </section>
  );
}
