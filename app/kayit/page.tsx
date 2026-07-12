import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import KayitPage from "./page-client";

export const metadata: Metadata = {
  title: { absolute: "Ücretsiz Kayıt Ol | Pratikleştir" },
  description:
    "Pratikleştir'e ücretsiz kayıt olun; QR kod, PDF ve görsel araçlarına daha yüksek limitlerle erişin, işlem geçmişinizi kaydedin.",
  alternates: {
    canonical: `${SITE_URL}/kayit`,
  },
};

export default function Page() {
  return <KayitPage />;
}
