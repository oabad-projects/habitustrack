"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type AppNavProps = {
  links: ReadonlyArray<{
    href: string;
    label: string;
  }>;
};

export function AppNav({ links }: AppNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden flex-wrap gap-2 lg:flex">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-transparent bg-[var(--color-ink)] text-white"
                  : "border-black/10 text-[var(--color-ink)] hover:border-black/20 hover:bg-[var(--color-sand)]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[1.75rem] border border-black/10 bg-white/95 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] transition",
                  isActive
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--color-muted)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
