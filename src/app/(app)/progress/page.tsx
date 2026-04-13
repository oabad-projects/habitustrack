import { ProgressGrid } from "@/components/progress/progress-grid";
import { requireUser } from "@/lib/auth";
import { getWeekRange } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export default async function ProgressPage() {
  const user = await requireUser();
  const week = getWeekRange();

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    include: {
      entries: {
        where: {
          date: {
            gte: week.start,
            lte: week.end,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Progreso semanal</p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Consistencia visible</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Un resumen limpio por hábito con cumplimiento, días completados y racha actual.
        </p>
      </section>

      <ProgressGrid habits={habits} />
    </div>
  );
}
