import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";

import { defaultLocale, resolveLocale } from "@/lib/i18n";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habits App",
  description: "MVP de seguimiento de hábitos con Next.js, Prisma y PostgreSQL.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("habitustrack_locale")?.value ?? defaultLocale);

  return (
    <html
      lang={locale}
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
