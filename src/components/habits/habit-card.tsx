import Link from "next/link";
import { HabitType, type Habit, type HabitEntry } from "@prisma/client";

import { deleteHabitAction, toggleHabitAction } from "@/actions/habits";
import { formatNumericValue } from "@/lib/utils";

type HabitCardProps = {
  habit: Habit & { entries: HabitEntry[] };
};

export function HabitCard({ habit }: HabitCardProps) {
  const weeklyLabel =
    habit.frequencyType === "DAILY"
      ? "Cada día"
      : habit.weekDays
          .map((day) => ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day])
          .join(", ");

  return (
    <article className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">{habit.name}</h3>
            <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {habit.type === HabitType.CHECK ? "Check" : "Numérico"}
            </span>
            <span className="rounded-full bg-[var(--color-blush)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
              {habit.isActive ? "Activo" : "Pausado"}
            </span>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            {weeklyLabel}
            {habit.targetValue ? ` · Objetivo ${formatNumericValue(habit.targetValue.toString())}` : ""}
            {habit.unit ? ` ${habit.unit}` : ""}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {habit.entries.length} registros guardados
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/habits/${habit.id}/edit`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]"
          >
            Editar
          </Link>
          <form action={toggleHabitAction}>
            <input type="hidden" name="habitId" value={habit.id} />
            <input type="hidden" name="nextValue" value={habit.isActive ? "false" : "true"} />
            <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]">
              {habit.isActive ? "Desactivar" : "Reactivar"}
            </button>
          </form>
          <form action={deleteHabitAction}>
            <input type="hidden" name="habitId" value={habit.id} />
            <button className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
