// Prod domain: www.pratiklestir.com. Vercel'de production domain www
// olarak ayarlı ve apex (pratiklestir.com) buraya redirect ediyor - canonical
// URL, tarayıcının gerçekte indiği adresle (redirect'in hedefiyle) eşleşmeli,
// bu yüzden www'li versiyon kullanılıyor. Farklı bir ortamda (staging vb.)
// override etmek için NEXT_PUBLIC_SITE_URL ayarlanabilir; canonical URL,
// sitemap ve structured data'da bu değer kullanılıyor.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pratiklestir.com"
).replace(/\/$/, "");

export const SITE_NAME = "Pratikleştir";
