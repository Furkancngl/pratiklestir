import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import InfoPlaceholderPage from "@/app/components/info-placeholder-page";

export const metadata: Metadata = {
  title: { absolute: "İletişim | Pratikleştir" },
  description: "Pratikleştir ekibiyle iletişime geçin.",
  alternates: { canonical: `${SITE_URL}/iletisim` },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <InfoPlaceholderPage
      heading="İletişim"
      description="İletişim sayfamız hazırlanıyor. Çok yakında buradan bize kolayca ulaşabileceksiniz."
    />
  );
}
