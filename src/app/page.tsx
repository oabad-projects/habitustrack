import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-cream)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.82),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(231,214,181,0.65),_transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <span className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Habits App
          </span>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)]">
              Login
            </Link>
            <Link href="/register" className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white">
              Empezar
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              MVP de hábitos para uso diario
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-7xl">
              Sigue tus hábitos sin convertirlo en otro gestor de tareas.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">
              Registra hoy, ajusta tus rutinas y mantén una visión semanal clara. Diseño simple, foco en rapidez y base preparada para SaaS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white">
                Crear cuenta
              </Link>
              <Link href="/login" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[var(--color-ink)]">
                Ya tengo acceso
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Hoy</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-[var(--color-cream)] p-4">
                  <p className="font-semibold text-[var(--color-ink)]">Leer</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">30 min · pendiente</p>
                </div>
                <div className="rounded-2xl bg-[var(--color-blush)] p-4">
                  <p className="font-semibold text-[var(--color-ink)]">Flexiones</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">50 reps · 32 registradas</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-[var(--color-ink)] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Progreso</p>
              <h2 className="mt-3 text-2xl font-semibold">Semana al 78%</h2>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Visualiza cumplimiento, días completados y rachas para seguir mejorando sin ruido.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
