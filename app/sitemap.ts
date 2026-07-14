import type { MetadataRoute } from "next";
import { tools } from "./lib/tools";
import { categories } from "./lib/categories";
import { toolScenarios } from "./lib/tool-scenarios";
import { SITE_URL } from "./lib/site";

// tools.ts'de available: true olarak işaretlenen her araç ve en az bir
// available aracı olan her kategori otomatik olarak buraya dahil olur -
// yeni bir araç veya kategori eklerken bu dosyayı güncellemeye gerek yok.
// Aynı şekilde tool-scenarios.ts'ye eklenen her yeni senaryo da (aracı
// available olduğu sürece) otomatik olarak sitemap'e girer.
export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.available)
    .map((tool) => ({
      url: `${SITE_URL}${tool.href}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => category.hasAvailableTools)
    .map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const scenarioEntries: MetadataRoute.Sitemap = toolScenarios
    .filter((scenario) => tools.find((t) => t.href === scenario.toolHref)?.available)
    .map((scenario) => ({
      url: `${SITE_URL}${scenario.toolHref}/${scenario.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...toolEntries,
    ...scenarioEntries,
  ];
}
