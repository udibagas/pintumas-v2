import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifyTokenEdge(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (decoded.role !== "ADMIN" && decoded.role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!admin/login|_next/static|_next/image|favicon.ico).*)"],
};
