import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getNumberLocale, type Locale } from "@/lib/i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumericValue(value: number | string, locale: Locale = "es") {
  return new Intl.NumberFormat(getNumberLocale(locale), {
    maximumFractionDigits: 2,
  }).format(Number(value));
}
