import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import InfoPlaceholderPage from "@/app/components/info-placeholder-page";

export const metadata: Metadata = {
  title: { absolute: "Sık Sorulan Sorular | Pratikleştir" },
  description: "Pratikleştir hakkında sık sorulan sorular.",
  alternates: { canonical: `${SITE_URL}/sss` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <InfoPlaceholderPage
      heading="Sık Sorulan Sorular"
      description="Genel SSS sayfamız hazırlanıyor. Araçlara özel sorular için her aracın kendi sayfasındaki 'Sık Sorulan Sorular' bölümüne göz atabilirsiniz."
    />
  );
}
