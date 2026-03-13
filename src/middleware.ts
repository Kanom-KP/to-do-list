import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path === "/login" || path === "/register";
  const isDashboard = path.startsWith("/dashboard") || path === "/";

  if (isAuthPage) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // invalid token, allow access to auth pages
      }
    }
    return NextResponse.next();
  }

  if (isDashboard || path.startsWith("/api/tasks")) {
    if (!token) {
      if (path.startsWith("/api")) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const response =
        path.startsWith("/api")
          ? NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 })
          : NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/login", "/register", "/api/tasks", "/api/tasks/:path*"],
};
