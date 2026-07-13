import type { Metadata } from "next";
import { tools, type Tool, type ToolFaqItem } from "./tools";
import { SITE_NAME, SITE_URL } from "./site";
import { buildOgImageUrl } from "./og-image";

// Bir aracın seo alanı boş bırakılmışsa (yeni eklenen, henüz özel içerik
// yazılmamış araç), buradaki türetilmiş varsayılanlarla dolduruluyor - böyle
// bir araç da SEO Title/Description/FAQ/Schema'ya otomatik kavuşuyor. Daha
// yüksek kalite için tools.ts'deki `seo` alanını doldurmanız önerilir, ama
// hiçbirini doldurmasanız da site "kırılmaz".
export type ResolvedToolSeo = {
  metaTitle: string;
  metaDescription: string;
  about: string[];
  howTo: string[];
  advantages: string[];
  faq: ToolFaqItem[];
  applicationCategory: string;
};

function autoFaq(tool: Tool): ToolFaqItem[] {
  return [
    {
      question: `${tool.name} ücretsiz mi?`,
      answer: `Evet, ${tool.name} ücretsiz olarak kullanılabilir.`,
    },
    {
      question: `${tool.name} nasıl kullanılır?`,
      answer: tool.description,
    },
    {
      question: "Kayıt olmam gerekiyor mu?",
      answer:
        "Hayır, çoğu aracımızı kayıt olmadan kullanabilirsiniz. Daha yüksek kullanım limitleri için ücretsiz hesap oluşturabilirsiniz.",
    },
  ];
}

export function getToolSeoContent(tool: Tool): ResolvedToolSeo {
  const seo = tool.seo ?? {};

  return {
    metaTitle: seo.metaTitle ?? `${tool.name} | Ücretsiz Online Araç | ${SITE_NAME}`,
    metaDescription: seo.metaDescription ?? tool.description,
    about: seo.about ?? [tool.description],
    howTo: seo.howTo ?? [
      "Aracı açın ve istenen bilgiyi veya dosyayı girin.",
      "İşlemi başlatmak için ilgili butona tıklayın.",
      "Sonucu görüntüleyin veya indirin.",
    ],
    advantages: seo.advantages ?? [
      "Ücretsiz ve hızlı kullanım.",
      "Kayıt olmadan deneyebilirsiniz.",
      "Kullanımı kolay, sade arayüz.",
    ],
    faq: seo.faq ?? autoFaq(tool),
    applicationCategory: seo.applicationCategory ?? "UtilitiesApplication",
  };
}

// Her araç page.tsx'i tek satırla bu fonksiyonu çağırır (bkz.
// app/lib/tool-page.tsx); title, description, canonical, Open Graph ve
// Twitter kartı otomatik olarak tutarlı üretilir.
export function getToolMetadata(href: string): Metadata {
  const tool = tools.find((t) => t.href === href);
  if (!tool) {
    throw new Error(`tools.ts içinde ${href} için kayıt bulunamadı.`);
  }

  const seo = getToolSeoContent(tool);
  const url = `${SITE_URL}${href}`;
  // Her araç kendi adı/açıklamasıyla /api/og'dan dinamik bir OG görseli
  // alır (bkz. app/api/og/route.tsx) - tüm araçlar artık aynı statik
  // görseli paylaşmıyor, yeni bir araç eklendiğinde otomatik kendi görseli
  // oluşur.
  const ogImage = buildOgImageUrl({ title: tool.name, description: seo.metaDescription });

  return {
    // absolute: kök layout'taki title.template ("%s | Pratikleştir") bu
    // başlığı sarmalamasın diye - metaTitle zaten marka son ekini içeriyor.
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: {
      canonical: url,
    },
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

// SoftwareApplication schema.org yapılandırılmış verisi - ToolSeoSections
// tarafından her araç sayfasına otomatik gömülür.
export function getToolJsonLd(tool: Tool) {
  const seo = getToolSeoContent(tool);
  const url = `${SITE_URL}${tool.href}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: seo.metaDescription,
    url,
    applicationCategory: seo.applicationCategory,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
  };
}

// HowTo schema.org yapılandırılmış verisi - seo.howTo adımlarından (bkz.
// getToolSeoContent) otomatik türetilir. Google'da adım adım zengin sonuç
// gösterme ihtimalini artırır. Kategori sayfalarındaki
// getCategoryFaqJsonLd ile aynı mantık - ToolSeoSections tarafından her
// araç sayfasına otomatik gömülür, araç page.tsx'lerinde elle kod yazılmaz.
export function getToolHowToJsonLd(tool: Tool) {
  const seo = getToolSeoContent(tool);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${tool.name} Nasıl Kullanılır?`,
    step: seo.howTo.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };
}

// FAQPage schema.org yapılandırılmış verisi - seo.faq'tan (bkz.
// getToolSeoContent) otomatik türetilir. app/lib/category-metadata.ts
// içindeki getCategoryFaqJsonLd ile birebir aynı desen.
export function getToolFaqJsonLd(tool: Tool) {
  const seo = getToolSeoContent(tool);

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
