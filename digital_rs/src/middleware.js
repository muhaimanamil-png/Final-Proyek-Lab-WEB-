import { NextResponse } from "next/server";

export function middleware(request) {
  const role = request.cookies.get("rs_role")?.value;
  const userId = request.cookies.get("rs_user_id")?.value;
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/dokter") ||
    request.nextUrl.pathname.startsWith("/pasien") ||
    request.nextUrl.pathname.startsWith("/profile");
  if (isDashboard && (!role || !userId)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*","/admin/:path*","/dokter/:path*","/pasien/:path*","/profile"] };