import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";
import Breadcrumbs from "@/app/components/breadcrumbs";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb-schema";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: { absolute: "İletişim | Pratikleştir" },
  description:
    "Sorularınız, sorun bildirimleriniz veya araç önerileriniz için Pratikleştir ekibiyle iletişime geçin.",
  alternates: { canonical: `${SITE_URL}/iletisim` },
};

const SUPPORT_EMAIL = "destek@pratiklestir.com";

export default function Page() {
  const breadcrumbItems = [{ name: "Ana Sayfa", href: "/" }, { name: "İletişim" }];

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

      <div className="w-full max-w-md">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            İletişim
          </h1>
          <p className="max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Bir sorunla mı karşılaştın, önerin mi var, yoksa {SITE_NAME}{" "}
            hakkında bir sorunu mu var? Aşağıdaki formu doldur veya doğrudan{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-purple-600 underline underline-offset-2 dark:text-purple-400"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            adresine yaz.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/10 dark:bg-[#1c1c1f]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
