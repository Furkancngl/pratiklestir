import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import InfoPlaceholderPage from "@/app/components/info-placeholder-page";

export const metadata: Metadata = {
  title: { absolute: "Gizlilik Politikası | Pratikleştir" },
  description: "Pratikleştir gizlilik politikası.",
  alternates: { canonical: `${SITE_URL}/gizlilik-politikasi` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <InfoPlaceholderPage
      heading="Gizlilik Politikası"
      description="Gizlilik politikamız hazırlanıyor. Araçlarımızın büyük çoğunluğu dosyalarınızı sunucuya hiç göndermeden tarayıcınızda çalışır; tam metni çok yakında burada yayınlanacak."
    />
  );
}
