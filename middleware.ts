import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/today", "/habits", "/progress"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("habitustrack_session")?.value;
  const pathname = request.nextUrl.pathname;

  if (protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (authPaths.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/today", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/today/:path*", "/habits/:path*", "/progress/:path*", "/login", "/register"],
};
