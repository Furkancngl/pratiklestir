import Breadcrumbs from "./breadcrumbs";
import { buildBreadcrumbSchema } from "../lib/breadcrumb-schema";

// /iletisim, /sss ve yasal sayfalar gibi henüz gerçek içeriği yazılmamış
// ama gerçek, crawl edilebilir bir sayfaya ihtiyaç duyan rotalar için ortak
// iskelet. Sahte/uydurma metin (örn. hazır bir "Gizlilik Politikası" metni)
// koymak yerine dürüstçe "hazırlanıyor" diyor; içerik netleştiğinde bu
// component yerine gerçek sayfa içeriği yazılabilir.
export default function InfoPlaceholderPage({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  const breadcrumbItems = [{ name: "Ana Sayfa", href: "/" }, { name: heading }];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema(breadcrumbItems)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <div className="w-full max-w-2xl">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {heading}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
          <span className="mt-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600/80 dark:bg-purple-400/10 dark:text-violet-300/70">
            Yakında
          </span>
        </div>
      </div>
    </div>
  );
}
