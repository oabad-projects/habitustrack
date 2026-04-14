import Link from "next/link";

import { saveHabitAction } from "@/actions/habits";
import { HabitForm } from "@/components/habits/habit-form";
import { getDictionary, resolveLocale } from "@/lib/i18n";

type NewHabitPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewHabitPage({ params }: NewHabitPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{dictionary.habitForm.newEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{dictionary.habitForm.newTitle}</h2>
        </div>
        <Link href={`/${locale}/habits`} className="text-sm font-medium text-[var(--color-ink)]">
          {dictionary.common.back}
        </Link>
      </div>

      <HabitForm
        action={saveHabitAction}
        locale={locale}
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
          weekdays: dictionary.habitsPage.weekdays,
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
