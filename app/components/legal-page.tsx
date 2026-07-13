import type { ReactNode } from "react";
import Breadcrumbs from "./breadcrumbs";
import { buildBreadcrumbSchema } from "../lib/breadcrumb-schema";

export default function LegalPage({
  heading,
  lastUpdated,
  children,
}: {
  heading: string;
  lastUpdated: string;
  children: ReactNode;
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
      <div className="w-full max-w-3xl">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Son güncelleme: {lastUpdated}
          </p>

          <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/[.06] px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/[.06] dark:text-amber-300">
            Bu metin, bir avukat tarafından incelenmemiş bir taslaktır ve
            başlangıç seviyesinde bir çerçeve sunmak amacıyla hazırlanmıştır.
            Hizmet geliştikçe düzenli olarak gözden geçirilecek ve
            güncellenecektir.
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-9">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[14.5px] leading-7 text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}
