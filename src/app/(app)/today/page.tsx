import { format } from "date-fns";

import { TodayList } from "@/components/habits/today-list";
import { requireUser } from "@/lib/auth";
import { getToday, toIsoDate } from "@/lib/dates";
import { isHabitScheduledForDate } from "@/lib/habits";
import { prisma } from "@/lib/prisma";

export default async function TodayPage() {
  const user = await requireUser();
  const today = getToday();
  const todayIso = toIsoDate(today);

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    include: {
      entries: {
        where: {
          date: today,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const scheduledHabits = habits.filter((habit) => isHabitScheduledForDate(habit, today));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Pantalla principal</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Hoy toca avanzar</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {format(today, "EEEE, d 'de' MMMM")} · Registra el estado de cada hábito con el menor número de clics posible.
        </p>
      </section>

      <TodayList habits={scheduledHabits} date={todayIso} dateLabel="Hoy" />
    </div>
  );
}
