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
      <Link href={`/es${suffix}`} className={locale === "es" ? "font-semibold text-[var(--color-ink)]" : ""}>
        {labels.spanish}
      </Link>
      <span>/</span>
      <Link href={`/en${suffix}`} className={locale === "en" ? "font-semibold text-[var(--color-ink)]" : ""}>
        {labels.english}
      </Link>
    </>
  );
}
