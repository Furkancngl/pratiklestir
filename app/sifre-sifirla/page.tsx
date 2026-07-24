import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/app/lib/site";
import SifreSifirlaPage from "./page-client";

export const metadata: Metadata = {
  title: { absolute: "Şifre Sıfırla | Pratikleştir" },
  description: "Pratikleştir hesabın için yeni bir şifre belirle.",
  alternates: {
    canonical: `${SITE_URL}/sifre-sifirla`,
  },
  robots: { index: false, follow: false },
};

// searchParams (dinamik API) Cache Components altında <Suspense> ile sarılı
// bir alt bileşende okunmak zorunda - token'a bağlı bir tek kullanımlık
// sayfa olduğundan zaten statik kabuk hedeflenmiyor, davranış aynı kalıyor.
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <SifreSifirlaContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SifreSifirlaContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <SifreSifirlaPage token={token ?? ""} />;
}
