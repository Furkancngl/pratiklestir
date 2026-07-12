// Prod domain kesinleşince NEXT_PUBLIC_SITE_URL ortam değişkenini ayarlayın;
// bu placeholder canonical URL, sitemap ve structured data'da kullanılıyor.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pratiklestir.com"
).replace(/\/$/, "");

export const SITE_NAME = "Pratikleştir";
