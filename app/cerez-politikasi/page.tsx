import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import InfoPlaceholderPage from "@/app/components/info-placeholder-page";

export const metadata: Metadata = {
  title: { absolute: "Çerez Politikası | Pratikleştir" },
  description: "Pratikleştir çerez politikası.",
  alternates: { canonical: `${SITE_URL}/cerez-politikasi` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <InfoPlaceholderPage
      heading="Çerez Politikası"
      description="Çerez politikamız hazırlanıyor. Tam metni çok yakında burada yayınlanacak."
    />
  );
}
