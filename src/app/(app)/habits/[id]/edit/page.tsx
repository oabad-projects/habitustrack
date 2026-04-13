import { notFound } from "next/navigation";

import { saveHabitAction } from "@/actions/habits";
import { HabitForm } from "@/components/habits/habit-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EditHabitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const habit = await prisma.habit.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!habit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Editar hábito</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{habit.name}</h2>
      </div>

      <HabitForm
        action={saveHabitAction}
        initialValues={{
          id: habit.id,
          name: habit.name,
          type: habit.type,
          unit: habit.unit,
          targetValue: habit.targetValue?.toString() ?? null,
          frequencyType: habit.frequencyType,
          weekDays: habit.weekDays,
          isActive: habit.isActive,
        }}
      />
    </div>
  );
}
