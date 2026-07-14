import type { Metadata } from "next";
import type { Tool } from "./tools";
import type { ToolScenario } from "./tool-scenarios";
import { SITE_NAME, SITE_URL } from "./site";
import { buildOgImageUrl } from "./og-image";

// tool-metadata.ts'deki getToolMetadata ile aynı desen, tek fark: canonical
// ana araç sayfasına değil senaryonun kendi URL'sine işaret eder - bu sayfa
// gerçekten farklı bir arama niyetine hizmet ettiği için ana araç sayfasının
// bir kopyası/varyantı olarak değil, kendi başına indexlenebilir bir sayfa
// olarak ele alınır.
export function getScenarioMetadata(tool: Tool, scenario: ToolScenario): Metadata {
  const url = `${SITE_URL}${tool.href}/${scenario.slug}`;
  const ogImage = buildOgImageUrl({
    title: scenario.h1,
    description: scenario.metaDescription,
  });

  return {
    title: { absolute: scenario.metaTitle },
    description: scenario.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: scenario.metaTitle,
      description: scenario.metaDescription,
      url,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: scenario.metaTitle,
      description: scenario.metaDescription,
      images: [ogImage],
    },
  };
}

// FAQPage schema.org verisi - scenario.faq'tan üretilir, ana aracın
// FAQ'ıyla (getToolFaqJsonLd) aynı sorular DEĞİLDİR; bu yüzden ayrı bir
// fonksiyon olarak tutuluyor.
export function getScenarioFaqJsonLd(scenario: ToolScenario) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: scenario.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
