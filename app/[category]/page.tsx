import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getCategorySeo } from "@/app/lib/categories";
import {
  getCategoryMetadata,
  getCategoryBreadcrumbItems,
  getCategoryJsonLd,
  getCategoryFaqJsonLd,
} from "@/app/lib/category-metadata";
import AnimatedCard from "@/app/components/animated-card";
import Breadcrumbs from "@/app/components/breadcrumbs";

type Props = {
  params: Promise<{ category: string }>;
};

// tools.ts'deki her kategori için otomatik statik sayfa üretir; yeni bir
// grup eklendiğinde bu liste otomatik güncellenir, elle bir slug eklemeye
// gerek yoktur. Henüz hiçbir aracı yayında olmayan kategoriler de gerçek
// bir sayfaya sahip olur (404 vermez), yalnızca noindex edilir (bkz.
// app/lib/category-metadata.ts).
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return getCategoryMetadata(category);
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const seo = getCategorySeo(category.name);
  const heading = `${category.name} Araçları`;
  const breadcrumbItems = getCategoryBreadcrumbItems(category);

  const collectionJsonLd = getCategoryJsonLd(category);
  const faqJsonLd = getCategoryFaqJsonLd(category);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="w-full max-w-3xl">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {heading}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {seo.intro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {category.tools.map((tool) => (
            <AnimatedCard
              key={tool.href}
              title={tool.name}
              description={tool.description}
              accentClassName={tool.accentClassName}
              href={tool.available ? tool.href : undefined}
              badge={tool.available ? undefined : "yakında"}
              beta={tool.beta}
              icon={tool.icon}
            />
          ))}
        </div>

        <div className="mt-14 w-full">
          <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            Sık Sorulan Sorular
          </h2>
          <div className="mt-3 flex flex-col divide-y divide-black/[.06] rounded-xl border border-black/[.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-950">
            {seo.faq.map((item) => (
              <details key={item.question} className="group px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-black marker:content-none dark:text-zinc-50">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
