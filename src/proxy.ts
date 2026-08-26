import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Next.js 16 Edge Proxy Guard (Gateway Layer).
 * Intercepts incoming HTTP requests for route guarding, authentication, and fast redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isUserAreaRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/settings");

  // 1. Redirect unauthenticated users away from private user areas & staff dashboard
  if (!sessionToken && (isUserAreaRoute || isDashboardRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect already authenticated users away from guest auth routes (/login, /register)
  if (sessionToken && isAuthRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

/**
 * Next.js 16 Proxy configuration matcher.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/watchlist/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};

// Fallback export for Next.js / OpenNext middleware compatibility
export const middleware = proxy;
