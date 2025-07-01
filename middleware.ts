import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifyTokenEdge(token);
    console.log("Decoded token:", decoded);
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!admin/login|_next/static|_next/image|favicon.ico).*)"],
};
