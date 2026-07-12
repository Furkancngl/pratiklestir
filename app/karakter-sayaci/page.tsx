import type { Metadata } from "next";
import KarakterSayaciPage from "./page-client";

// Bu araç henüz app/lib/tools.ts kayıt listesinde değil (nav/anasayfa/
// sitemap/kategori sisteminin dışında, "yetim" bir sayfa). Resmi olarak
// yayına alınana kadar arama sonuçlarında görünmesini istemiyoruz; tools.ts'e
// eklenip available:true yapıldığında bu noindex kaldırılmalı.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return <KarakterSayaciPage />;
}
