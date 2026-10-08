import { type NextRequest, NextResponse } from "next/server";
import {
  AUTH_ROUTES,
  FALLBACK_HOME,
  PUBLIC_ROUTES,
  ROLE_BASED_ROUTES,
  ROLE_HOME,
} from "@/config/route";
import { ROLE_COOKIE } from "@/lib/auth-cookie";
import { getSafeRedirect } from "@/lib/safe-redirect";
import { decodeToken, isTokenExpired } from "@/utils/jwt-decode";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let decoded = accessToken ? decodeToken(accessToken) : null;

  const response = NextResponse.next();

  if ((!decoded || isTokenExpired(decoded)) && refreshToken) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const setCookie = refreshRes.headers.get("set-cookie");
        const newToken = extractCookieValue(setCookie, ACCESS_COOKIE);

        if (newToken) {
          accessToken = newToken;
          decoded = decodeToken(newToken);

          response.cookies.set(ACCESS_COOKIE, newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
          });
        }
      }
    } catch {
      accessToken = undefined;
      decoded = null;
    }
  }

  if (decoded && isTokenExpired(decoded)) {
    accessToken = undefined;
    decoded = null;
  }

  const userRole =
    decoded?.role ?? request.cookies.get(ROLE_COOKIE)?.value ?? null;
  const isAuthenticated = Boolean(
    userRole && Object.keys(ROLE_HOME).includes(userRole),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  if (isAuthRoute && isAuthenticated && userRole) {
    const home = ROLE_HOME[userRole] ?? FALLBACK_HOME;

    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const target = getSafeRedirect(redirectParam, request.url) ?? home;

    return NextResponse.redirect(new URL(target, request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (r) => pathname === r || (r !== "/" && pathname.startsWith(`${r}/`)),
  );

  if (isPublicRoute) return response;

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const matchedPrefix = Object.keys(ROLE_BASED_ROUTES).find(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  if (matchedPrefix) {
    const allowed = ROLE_BASED_ROUTES[matchedPrefix];
    if (!userRole || !allowed?.includes(userRole)) {
      const home = userRole
        ? (ROLE_HOME[userRole] ?? FALLBACK_HOME)
        : FALLBACK_HOME;
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return response;
}

function extractCookieValue(
  setCookieHeader: string | null,
  name: string,
): string | null {
  if (!setCookieHeader) return null;

  const match = setCookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ?? null;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)",
  ],
};
