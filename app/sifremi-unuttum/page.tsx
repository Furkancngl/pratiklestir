import type { Metadata } from "next";
import { SITE_URL } from "@/app/lib/site";
import SifremiUnuttumPage from "./page-client";

export const metadata: Metadata = {
  title: { absolute: "Şifremi Unuttum | Pratikleştir" },
  description: "Pratikleştir hesabın için şifre sıfırlama bağlantısı iste.",
  alternates: {
    canonical: `${SITE_URL}/sifremi-unuttum`,
  },
};

export default function Page() {
  return <SifremiUnuttumPage />;
}
