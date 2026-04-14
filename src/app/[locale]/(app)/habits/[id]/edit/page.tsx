import { notFound } from "next/navigation";

import { saveHabitAction } from "@/actions/habits";
import { HabitForm } from "@/components/habits/habit-form";
import { requireUser } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

type EditHabitPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const { locale: localeParam, id } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);
  const user = await requireUser(locale);

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
  });

  if (!habit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.habitForm.editEyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{habit.name}</h2>
      </div>

      <HabitForm
        action={saveHabitAction}
        locale={locale}
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
        labels={{
          name: dictionary.habitForm.name,
          namePlaceholder: dictionary.habitForm.namePlaceholder,
          type: dictionary.habitForm.type,
          frequency: dictionary.habitForm.frequency,
          everyDay: dictionary.habitForm.everyDay,
          specificDays: dictionary.habitForm.specificDays,
          unit: dictionary.habitForm.unit,
          unitPlaceholder: dictionary.habitForm.unitPlaceholder,
          targetOptional: dictionary.habitForm.targetOptional,
          weekdaysLabel: dictionary.habitForm.weekdaysLabel,
          keepActive: dictionary.habitForm.keepActive,
          createHabit: dictionary.habitForm.createHabit,
          saveChanges: dictionary.habitForm.saveChanges,
          typeCheck: dictionary.common.typeCheck,
          typeNumber: dictionary.common.typeNumber,
        }}
      />
    </div>
  );
}
