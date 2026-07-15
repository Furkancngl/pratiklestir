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
        {/* Sidebar artık her zaman position:fixed (bkz. sidebar.tsx) - sayfa
            akışında yer kaplamaz, bu yüzden içerik sütununu onun genişliği
            kadar (250px) elle içeri kaydırmamız gerekiyor. Böylece sidebar,
            sayfa ne kadar uzun olursa olsun (ör. programatik SEO senaryo
            sayfaları) her zaman tam viewport yüksekliğinde sabit kalır -
            eskiden kullanılan sticky, sadece kendi konteynerinin
            (nav+main satırı) yüksekliği kadar "yapışıyordu" ve çok uzun
            sayfalarda Footer'a yaklaşırken erkenden ayrılıp boşluk
            bırakıyordu.
            Footer da bu sütunun içinde, main ile birlikte kayıyor - böylece
            sidebar sayfanın geri kalanının üzerinde her zaman sabit durur. */}
        <div className={`flex flex-1 flex-col ${session ? "md:pl-[250px]" : ""}`}>
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
