import Link from "next/link";

import { saveHabitAction } from "@/actions/habits";
import { HabitForm } from "@/components/habits/habit-form";

export default function NewHabitPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Nuevo hábito</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Define una rutina clara</h2>
        </div>
        <Link href="/habits" className="text-sm font-medium text-[var(--color-ink)]">
          Volver
        </Link>
      </div>

      <HabitForm action={saveHabitAction} />
    </div>
  );
}
