import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin";

// Plan seçmeden onboarding'i atlayabilmesin diye bu sayfalara her zaman
// erişilebiliyor; geri kalan her rota plan seçilene kadar /planlar'a düşer.
const PLAN_GATE_EXEMPT_PATHS = ["/planlar", "/giris", "/kayit"];

export default auth((request) => {
  const { pathname, searchParams } = request.nextUrl;
  const isAdmin = isAdminEmail(request.auth?.user?.email);
  const user = request.auth?.user;

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    user &&
    !user.planSelected &&
    !PLAN_GATE_EXEMPT_PATHS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/planlar", request.url));
  }

  if (pathname === "/" && isAdmin && !searchParams.has("admin_stay")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
