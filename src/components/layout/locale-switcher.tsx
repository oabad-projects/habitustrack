"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { stripLocaleFromPath, type Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
  labels: {
    english: string;
    spanish: string;
  };
};

export function LocaleSwitcher({ locale, labels }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const { pathname: unlocalizedPath } = stripLocaleFromPath(pathname);
  const suffix = unlocalizedPath === "/" ? "" : unlocalizedPath;

  return (
    <>
      <Link
        href={`/es${suffix}`}
        className={`rounded-full px-2 py-1 ${locale === "es" ? "bg-[var(--color-sand)] font-semibold text-[var(--color-ink)]" : "hover:text-[var(--color-ink)]"}`}
      >
        {labels.spanish}
      </Link>
      <span>/</span>
      <Link
        href={`/en${suffix}`}
        className={`rounded-full px-2 py-1 ${locale === "en" ? "bg-[var(--color-sand)] font-semibold text-[var(--color-ink)]" : "hover:text-[var(--color-ink)]"}`}
      >
        {labels.english}
      </Link>
    </>
  );
}
