import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session_token";

/**
 * Edge-runtime coarse gate: checks only that the session cookie is present.
 * It cannot query MongoDB (edge runtime), so the authoritative check — does
 * the token resolve to a live session, and does the todo belong to this user
 * — happens inside the /api/todos route handlers via getCurrentUser().
 */
export function middleware(request: NextRequest) {
  const hasToken = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasToken) {
    if (request.nextUrl.pathname.startsWith("/api/todos")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("needLogin", "1");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todos/:path*", "/api/todos/:path*"],
};
