import Link from "next/link";

import { logoutAction } from "@/actions/auth";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  userName?: string | null;
};

const links = [
  { href: "/today", label: "Hoy" },
  { href: "/habits", label: "Hábitos" },
  { href: "/progress", label: "Progreso" },
] as const;

export function AppShell({ children, title, description, userName }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-black/5 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href="/today" className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Habits App
              </Link>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{title}</h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-black/20 hover:bg-[var(--color-sand)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-muted)]">{userName ?? "Tu espacio"}</span>
                <form action={logoutAction}>
                  <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-blush)]">
                    Salir
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
