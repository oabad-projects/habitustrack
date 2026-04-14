import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getPreferredLocale, localizePath, stripLocaleFromPath } from "@/lib/i18n";

const protectedPaths = ["/today", "/habits", "/progress"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("habitustrack_session")?.value;
  const pathname = request.nextUrl.pathname;
  const { locale, pathname: unlocalizedPath } = stripLocaleFromPath(pathname);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const preferredLocale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(localizePath(preferredLocale, "/"), request.url));
  }

  if (!locale) {
    const preferredLocale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(localizePath(preferredLocale, pathname), request.url));
  }

  const response = NextResponse.next();
  response.cookies.set("habitustrack_locale", locale, { path: "/", sameSite: "lax" });

  if (protectedPaths.some((path) => unlocalizedPath === path || unlocalizedPath.startsWith(`${path}/`))) {
    if (!session) {
      return NextResponse.redirect(new URL(localizePath(locale, "/login"), request.url));
    }
  }

  if (authPaths.includes(unlocalizedPath) && session) {
    return NextResponse.redirect(new URL(localizePath(locale, "/today"), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
