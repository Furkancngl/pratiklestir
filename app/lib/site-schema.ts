import { SITE_NAME, SITE_URL } from "./site";

// Sitedeki her sayfada (kök layout üzerinden) yayınlanan, site geneline ait
// WebSite + Organization schema.org verisi. Google'ın marka aramalarında
// (örn. "Pratikleştir") sitelinks arama kutusu ve kurumsal bilgi paneli
// gösterme ihtimalini artırır. Araç/kategori sayfalarındaki
// SoftwareApplication / CollectionPage / FAQPage / BreadcrumbList
// şemalarının yerini almaz, onlara ek olarak yayınlanır.
export function getSiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "tr-TR",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ];
}
