import type { Metadata } from "next";
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <SifreSifirlaPage token={token ?? ""} />;
}
