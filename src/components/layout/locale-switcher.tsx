"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const { pathname: unlocalizedPath } = stripLocaleFromPath(pathname);
  const suffix = unlocalizedPath === "/" ? "" : unlocalizedPath;
  const search = searchParams.toString();
  const href = (nextLocale: Locale) => `/${nextLocale}${suffix}${search ? `?${search}` : ""}`;

  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-[var(--color-cream)] p-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
      <Link
        href={href("es")}
        title={labels.spanish}
        aria-label={labels.spanish}
        className={`rounded-full px-3 py-1.5 transition ${locale === "es" ? "bg-white text-[var(--color-ink)] shadow-sm" : "hover:text-[var(--color-ink)]"}`}
      >
        ES
      </Link>
      <Link
        href={href("en")}
        title={labels.english}
        aria-label={labels.english}
        className={`rounded-full px-3 py-1.5 transition ${locale === "en" ? "bg-white text-[var(--color-ink)] shadow-sm" : "hover:text-[var(--color-ink)]"}`}
      >
        EN
      </Link>
    </div>
  );
}
