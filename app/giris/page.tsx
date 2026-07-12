import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import GirisPage from "./page-client";

export const metadata: Metadata = {
  title: { absolute: "Giriş Yap | Pratikleştir" },
  description:
    "Pratikleştir hesabınıza giriş yapın; araçlarınızı ve işlem geçmişinizi kaldığınız yerden kullanmaya devam edin.",
  alternates: {
    canonical: `${SITE_URL}/giris`,
  },
};

export default function Page() {
  return <GirisPage />;
}
