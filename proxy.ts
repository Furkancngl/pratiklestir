import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin";

export default auth((request) => {
  const { pathname, searchParams } = request.nextUrl;
  const isAdmin = isAdminEmail(request.auth?.user?.email);

  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-app-section", "admin");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname === "/" && isAdmin && !searchParams.has("admin_stay")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};
