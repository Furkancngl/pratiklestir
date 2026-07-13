import type { Metadata } from "next";
import { type Category, getCategorySeo } from "./categories";
import { buildBreadcrumbSchema, type BreadcrumbLink } from "./breadcrumb-schema";
import { SITE_NAME, SITE_URL } from "./site";
import { buildOgImageUrl } from "./og-image";

// Her kategori sayfası (app/[category]/page.tsx) tek satırla bu fonksiyonu
// çağırır; title, description, canonical, Open Graph ve Twitter kartı
// otomatik olarak tutarlı üretilir - araç sayfalarındaki
// app/lib/tool-metadata.ts ile aynı desen.
export function getCategoryMetadata(category: Category): Metadata {
  const seo = getCategorySeo(category.name);
  const url = `${SITE_URL}/${category.slug}`;
  // Araç sayfalarıyla aynı desen (bkz. tool-metadata.ts) - her kategori
  // kendi adı/açıklamasıyla /api/og'dan dinamik bir OG görseli alır.
  const ogImage = buildOgImageUrl({
    title: `${category.name} Araçları`,
    description: seo.metaDescription,
  });

  return {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: {
      canonical: url,
    },
    // Tamamı "yakında" olan bir kategoride gösterecek gerçek içerik yok;
    // sayfa yine de var olur ama arama sonuçlarında görünmez. İlk araç
    // available:true olduğunda hasAvailableTools otomatik true'ya döner.
    robots: category.hasAvailableTools ? undefined : { index: false, follow: true },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
      // Sayfa kendi openGraph nesnesini tanımladığı için kök layout'un
      // opengraph-image.tsx dosya kuralı burada miras alınmıyor (Next.js
      // aynı segment içindeki alanları birleştirmez, üzerine yazar) - bu
      // yüzden görseli burada elle belirtmemiz gerekiyor.
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [ogImage],
    },
  };
}

function breadcrumbItems(category: Category): BreadcrumbLink[] {
  return [
    { name: "Ana Sayfa", href: "/" },
    { name: `${category.name} Araçları` },
  ];
}

export function getCategoryBreadcrumbItems(category: Category): BreadcrumbLink[] {
  return breadcrumbItems(category);
}

// CollectionPage schema.org yapılandırılmış verisi.
export function getCategoryJsonLd(category: Category) {
  const seo = getCategorySeo(category.name);
  const url = `${SITE_URL}/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Araçları`,
    description: seo.metaDescription,
    url,
    breadcrumb: buildBreadcrumbSchema(breadcrumbItems(category)),
  };
}

// FAQPage schema.org yapılandırılmış verisi - Google'da FAQ zengin
// sonucu (rich snippet) çıkma ihtimalini artırır.
export function getCategoryFaqJsonLd(category: Category) {
  const seo = getCategorySeo(category.name);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
