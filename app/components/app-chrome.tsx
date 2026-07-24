"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "./footer";

const NO_CHROME_PATHS = new Set(["/giris", "/kayit", "/bakim"]);

function shouldHideChrome(pathname: string) {
  return (
    NO_CHROME_PATHS.has(pathname) ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ayarlar")
  );
}

export default function AppChrome({
  nav,
  children,
}: {
  nav: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  // usePathname, layout yeniden mount olmadan her client-side geçişte
  // güncellenir - bu yüzden nav gösterme kararını burada, header'a
  // bakan bir server bileşeni yerine burada veriyoruz. Aksi halde
  // (örn. TopNav'daki bir linkle /giris'e geçişte) layout önceki
  // render'dan kalma nav'ı göstermeye devam ediyordu.
  //
  // Bakım modu (proxy.ts'in /bakim'e rewrite ettiği durum) burada ayrıca
  // ele alınmıyor: tarayıcı URL'i (dolayısıyla bu pathname) değişmediği
  // için o durumda chrome burada gizlenmez - onun yerine app/bakim/page.tsx
  // kendini `fixed inset-0` ile tam ekran render edip altındaki chrome'u
  // görsel olarak örter (bkz. o dosyadaki yorum). Bu, root layout'un
  // maintenance sinyali için headers() okumasına (ve böylece Cache
  // Components altında tüm anonim sayfaları dinamikleştirmesine) gerek
  // bırakmıyor.
  if (shouldHideChrome(pathname)) {
    return <main className="flex flex-1 flex-col">{children}</main>;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* nav (TopNav veya Sidebar) app/layout.tsx'te <Suspense> ile sarılı
          bir server bileşeninden (AuthNav) geliyor - oturum var mı bilgisi
          request time'da, bu static shell'in dışında çözülüyor. Bu yüzden
          burada `session: boolean` gibi senkron bir prop yok; Sidebar
          render olduğunda bıraktığı `data-app-sidebar` işaretini CSS
          `:has()` ile okuyup satır yönünü ve içerik sütununun sol
          boşluğunu (fixed sidebar'ın altında kalmaması için) ona göre
          ayarlıyoruz. Bu, children'ı (asıl sayfa içeriği) Suspense
          sınırının dışında, statik kabuğun parçası olarak tutmamızı
          sağlıyor - nav'ın çözülmesini beklemesi gerekmiyor. */}
      <div className="group/chrome flex flex-1 flex-col md:has-[[data-app-sidebar]]:flex-row">
        {nav}
        {/* Sidebar her zaman position:fixed (bkz. sidebar.tsx) - sayfa
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
        <div className="flex flex-1 flex-col md:group-has-[[data-app-sidebar]]/chrome:pl-[250px]">
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
