"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "./footer";

const NO_CHROME_PATHS = new Set(["/giris", "/kayit"]);

function shouldHideChrome(pathname: string) {
  return (
    NO_CHROME_PATHS.has(pathname) ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ayarlar")
  );
}

export default function AppChrome({
  session,
  nav,
  children,
}: {
  session: boolean;
  nav: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  // usePathname, layout yeniden mount olmadan her client-side geçişte
  // güncellenir - bu yüzden nav gösterme kararını burada, header'a
  // bakan bir server bileşeni yerine burada veriyoruz. Aksi halde
  // (örn. TopNav'daki bir linkle /giris'e geçişte) layout önceki
  // render'dan kalma nav'ı göstermeye devam ediyordu.
  if (shouldHideChrome(pathname)) {
    return <main className="flex flex-1 flex-col">{children}</main>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className={`flex flex-1 flex-col ${session ? "md:flex-row" : ""}`}>
        {nav}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
