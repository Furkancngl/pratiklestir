import type { Metadata } from "next";
import { Suspense } from "react";
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

// GirisPage useSearchParams() kullanıyor (callbackUrl okumak için) - App
// Router'da bu, <Suspense> ile sarılmayı gerektiriyor (Cache Components
// altında build-time hata, öncesinde de client-render'a bail-out).
export default function Page() {
  return (
    <Suspense fallback={null}>
      <GirisPage />
    </Suspense>
  );
}
