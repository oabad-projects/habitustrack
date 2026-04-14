import {
  HabitFrequencyType,
  HabitType,
  Prisma,
  type Habit,
  type HabitEntry,
} from "@prisma/client";

import { getWeekRange, getWeekday, toDateOnly, toIsoDate } from "@/lib/dates";
import type { Locale } from "@/lib/i18n";
import { getWeekStartsOn } from "@/lib/i18n";

export type HabitWithEntries = Habit & {
  entries: HabitEntry[];
};

export function isHabitScheduledForDate(habit: Pick<Habit, "frequencyType" | "weekDays">, date: Date) {
  if (habit.frequencyType === HabitFrequencyType.DAILY) {
    return true;
  }

  return habit.weekDays.includes(getWeekday(date));
}

export function normalizeHabitFormData(formData: FormData) {
  const type = String(formData.get("type") ?? "CHECK");
  const frequencyType = String(formData.get("frequencyType") ?? "DAILY");
  const targetValueRaw = String(formData.get("targetValue") ?? "").trim();

  return {
    id: String(formData.get("id") ?? "") || undefined,
    name: String(formData.get("name") ?? ""),
    type,
    unit: String(formData.get("unit") ?? ""),
    targetValue: targetValueRaw ? Number(targetValueRaw) : undefined,
    frequencyType,
    weekDays: formData.getAll("weekDays").map((value) => Number(value)),
    isActive: formData.get("isActive") === "on",
  };
}

export function getTodayValue(habit: HabitWithEntries, date: Date) {
  const entry = habit.entries.find((item) => toIsoDate(item.date) === toIsoDate(date));

  if (!entry) {
    return habit.type === HabitType.CHECK ? 0 : null;
  }

  return Number(entry.value);
}

export function getCompletionLabel(habit: HabitWithEntries, date: Date) {
  const value = getTodayValue(habit, date);

  if (habit.type === HabitType.CHECK) {
    return value === 1 ? "Hecho" : "Pendiente";
  }

  if (value === null || value === 0) {
    return "Sin registrar";
  }

  return `${value}${habit.unit ? ` ${habit.unit}` : ""}`;
}

export function getWeekSummary(habit: HabitWithEntries, baseDate = new Date(), locale: Locale = "es") {
  const range = getWeekRange(baseDate, { weekStartsOn: getWeekStartsOn(locale) });
  const scheduledDays = range.days.filter((day) => isHabitScheduledForDate(habit, day));
  const entriesByDate = new Map(habit.entries.map((entry) => [toIsoDate(entry.date), Number(entry.value)]));

  const days = scheduledDays.map((day) => {
    const rawValue = entriesByDate.get(toIsoDate(day)) ?? 0;
    const completed =
      habit.type === HabitType.CHECK
        ? rawValue >= 1
        : habit.targetValue
          ? rawValue >= Number(habit.targetValue)
          : rawValue > 0;

    return {
      date: day,
      value: rawValue,
      completed,
    };
  });

  const completedDays = days.filter((day) => day.completed).length;
  const scheduledCount = days.length;
  const completionRate = scheduledCount === 0 ? 0 : Math.round((completedDays / scheduledCount) * 100);

  return {
    days,
    scheduledCount,
    completedDays,
    completionRate,
    streak: calculateCurrentStreak(habit),
  };
}

function calculateCurrentStreak(habit: HabitWithEntries) {
  const today = toDateOnly(new Date());
  let cursor = today;
  let streak = 0;

  while (isHabitScheduledForDate(habit, cursor)) {
    const entry = habit.entries.find((item) => toIsoDate(item.date) === toIsoDate(cursor));
    const value = entry ? Number(entry.value) : 0;
    const completed =
      habit.type === HabitType.CHECK
        ? value >= 1
        : habit.targetValue
          ? value >= Number(habit.targetValue)
          : value > 0;

    if (!completed) {
      break;
    }

    streak += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }

  return streak;
}

export function decimal(value: number) {
  return new Prisma.Decimal(value);
}
