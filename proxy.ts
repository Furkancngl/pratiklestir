import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/app/lib/admin";

// Plan seçmeden onboarding'i atlayabilmesin diye bu sayfalara her zaman
// erişilebiliyor; geri kalan her rota plan seçilene kadar /planlar'a düşer.
const PLAN_GATE_EXEMPT_PATHS = ["/planlar", "/giris", "/kayit"];

// MAINTENANCE_MODE sadece Vercel'in ortam değişkenleri panelinden
// ayarlanır; .env.local Vercel build'lerine hiç taşınmaz, bu yüzden ekstra
// bir NODE_ENV/VERCEL_ENV kontrolüne gerek yok - yerelde bu değişken
// tanımlı olmadığı sürece bakım modu kendiliğinden devre dışı kalır.
// /giris hariç tutuluyor: admin, bakım modunu aşacak oturumu ancak giriş
// formuna erişebiliyorsa açabilir. /bakim hariç tutuluyor: rewrite hedefi,
// aksi halde sonsuz döngü oluşur.
const MAINTENANCE_ALLOWED_PATHS = new Set(["/giris", "/bakim"]);

export default auth((request) => {
  const { pathname, searchParams } = request.nextUrl;
  const isAdmin = isAdminEmail(request.auth?.user?.email);
  const user = request.auth?.user;

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !isAdmin &&
    !MAINTENANCE_ALLOWED_PATHS.has(pathname)
  ) {
    // Admin oturumu varsa bakım sayfası hiç gösterilmez - canlıda test
    // edebilmek için (bkz. görev talebi). Diğer herkes /bakim'e düşer.
    //
    // rewrite() tarayıcıdaki URL'i değiştirmez, bu yüzden asıl istenen yol
    // ne olursa olsun (ör. "/", "/gorsel-kirp") root layout'taki
    // usePathname() hâlâ o orijinal yolu görür - "/bakim" değil. Bu yüzden
    // header/sidebar/footer'ı gizlemek için pathname yerine bu özel
    // request header'ı kullanıyoruz (bkz. app/layout.tsx, app-chrome.tsx).
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-maintenance-mode", "1");
    const response = NextResponse.rewrite(new URL("/bakim", request.url), {
      request: { headers: requestHeaders },
    });
    response.headers.set("x-robots-tag", "noindex");
    return response;
  }

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
