import Link from "next/link";
import { HabitType, type Habit, type HabitEntry } from "@prisma/client";

import { deleteHabitAction, toggleHabitAction } from "@/actions/habits";
import { getDictionary, type Locale } from "@/lib/i18n";
import { formatNumericValue } from "@/lib/utils";

type HabitCardProps = {
  habit: Habit & { entries: HabitEntry[] };
  locale?: Locale;
  labels?: {
    everyDay: string;
    weekdays: string[];
    typeCheck: string;
    typeNumber: string;
    active: string;
    paused: string;
    target: string;
    savedEntries: string;
    edit: string;
    deactivate: string;
    reactivate: string;
    delete: string;
  };
};

export function HabitCard({ habit, locale = "es", labels }: HabitCardProps) {
  const dictionary = getDictionary(locale);
  const resolvedLabels = labels ?? {
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
  };
  const weeklyLabel =
    habit.frequencyType === "DAILY"
      ? resolvedLabels.everyDay
      : habit.weekDays
          .map((day) => resolvedLabels.weekdays[day])
          .join(", ");

  return (
    <article className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">{habit.name}</h3>
            <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {habit.type === HabitType.CHECK ? resolvedLabels.typeCheck : resolvedLabels.typeNumber}
            </span>
            <span className="rounded-full bg-[var(--color-blush)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
              {habit.isActive ? resolvedLabels.active : resolvedLabels.paused}
            </span>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            {weeklyLabel}
            {habit.targetValue ? ` · ${resolvedLabels.target} ${formatNumericValue(habit.targetValue.toString(), locale)}` : ""}
            {habit.unit ? ` ${habit.unit}` : ""}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {habit.entries.length} {resolvedLabels.savedEntries}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/habits/${habit.id}/edit`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]"
          >
            {resolvedLabels.edit}
          </Link>
          <form action={toggleHabitAction}>
            <input type="hidden" name="habitId" value={habit.id} />
            <input type="hidden" name="nextValue" value={habit.isActive ? "false" : "true"} />
            <input type="hidden" name="locale" value={locale} />
            <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]">
              {habit.isActive ? resolvedLabels.deactivate : resolvedLabels.reactivate}
            </button>
          </form>
          <form action={deleteHabitAction}>
            <input type="hidden" name="habitId" value={habit.id} />
            <input type="hidden" name="locale" value={locale} />
            <button className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
              {resolvedLabels.delete}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
