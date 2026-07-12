import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// /admin ve /ayarlar bilinçli olarak burada disallow edilmiyor: bu sayfalar
// zaten sunucu tarafında oturum kontrolüyle yönlendiriliyor ve kendi
// metadata'larında `robots: { index: false }` taşıyor (bkz. app/admin/layout.tsx,
// app/ayarlar/layout.tsx). Google'ın kendi tavsiyesi de sayfaları arama
// sonuçlarından gizlemek için robots.txt yerine noindex kullanmaktır - burada
// disallow eklemek Google'ın noindex etiketini hiç görememesine (crawl
// edemediği için) ve Search Console'da "indexed though blocked by
// robots.txt" uyarısına yol açar. /api/ ise HTML/meta taşımayan saf uç
// noktalar olduğu için crawl bütçesini korumak adına burada kalıyor.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
