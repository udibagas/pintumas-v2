import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      // Redirect to admin login if invalid token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check if user has admin/moderator role
    if (decoded.role !== "ADMIN" && decoded.role !== "MODERATOR") {
      // Redirect to home page if not admin/moderator
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow admin access
    return NextResponse.next();
  }

  // Skip login page if already authenticated admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get("auth-token")?.value;

    if (token) {
      const decoded = verifyToken(token);
      if (
        decoded &&
        (decoded.role === "ADMIN" || decoded.role === "MODERATOR")
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
};
