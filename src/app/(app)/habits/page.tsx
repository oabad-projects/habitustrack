import Link from "next/link";

import { HabitCard } from "@/components/habits/habit-card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HabitsPage() {
  const user = await requireUser();
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: {
      entries: {
        orderBy: {
          date: "desc",
        },
        take: 7,
      },
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Gestión</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">Tus hábitos</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Crea, pausa, reactiva o edita tus hábitos desde un único lugar.
          </p>
        </div>
        <Link
          href="/habits/new"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Nuevo hábito
        </Link>
      </section>

      <section className="grid gap-4">
        {habits.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">Aún no hay hábitos creados</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Empieza con uno sencillo para tener lista la pantalla “Hoy”.
            </p>
          </div>
        ) : (
          habits.map((habit) => <HabitCard key={habit.id} habit={habit} />)
        )}
      </section>
    </div>
  );
}
