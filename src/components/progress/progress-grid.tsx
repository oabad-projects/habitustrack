import { HabitType, type Habit, type HabitEntry } from "@prisma/client";
import { format } from "date-fns";

import { getWeekSummary } from "@/lib/habits";
import { formatNumericValue } from "@/lib/utils";

type ProgressGridProps = {
  habits: Array<Habit & { entries: HabitEntry[] }>;
};

export function ProgressGrid({ habits }: ProgressGridProps) {
  if (habits.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">Aún no hay progreso que mostrar</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Empieza creando hábitos y registrando tu día para ver el resumen semanal.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {habits.map((habit) => {
        const summary = getWeekSummary(habit);

        return (
          <article
            key={habit.id}
            className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-ink)]">{habit.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {summary.completedDays}/{summary.scheduledCount} días completados · {summary.completionRate}% cumplimiento
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {habit.type === HabitType.CHECK ? "Check" : "Numérico"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2">
              {summary.days.map((day) => (
                <div
                  key={day.date.toISOString()}
                  className={`rounded-2xl border px-2 py-3 text-center ${
                    day.completed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-black/5 bg-[var(--color-cream)] text-[var(--color-muted)]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]">{format(day.date, "EEE")}</p>
                  <p className="mt-2 text-sm font-semibold">
                    {habit.type === HabitType.CHECK ? (day.completed ? "OK" : "—") : day.value ? formatNumericValue(day.value) : "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              <span className="rounded-full bg-[var(--color-blush)] px-3 py-2">
                Racha actual: {summary.streak} día{summary.streak === 1 ? "" : "s"}
              </span>
              {habit.targetValue ? (
                <span className="rounded-full bg-[var(--color-sand)] px-3 py-2">
                  Objetivo: {formatNumericValue(habit.targetValue.toString())} {habit.unit ?? ""}
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
