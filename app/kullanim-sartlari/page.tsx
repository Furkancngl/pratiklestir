import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import InfoPlaceholderPage from "@/app/components/info-placeholder-page";

export const metadata: Metadata = {
  title: { absolute: "Kullanım Şartları | Pratikleştir" },
  description: "Pratikleştir kullanım şartları.",
  alternates: { canonical: `${SITE_URL}/kullanim-sartlari` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <InfoPlaceholderPage
      heading="Kullanım Şartları"
      description="Kullanım şartlarımız hazırlanıyor. Tam metni çok yakında burada yayınlanacak."
    />
  );
}
