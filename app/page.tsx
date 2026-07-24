import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/auth";
import LoggedInHome from "./components/logged-in-home";
import MarketingHome from "./components/marketing-home";
import { SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

// auth() (cookies() okur) burada, <Suspense> ile sarılı bir alt bileşene
// taşındı - bu sayede anonim ziyaretçiler için sayfa statik/ISR kabuk
// olarak kalabiliyor. Fallback olarak MarketingHome kullanıyoruz: anonim
// ziyaretçi için bu zaten NİHAİ içerik (fallback'ten gerçek içeriğe geçiş
// yok), oturum açmış ziyaretçi içinse request time'da (aynı stream
// içinde, client flash olmadan) LoggedInHome'a çözülüyor.
export default function Home() {
  return (
    <Suspense fallback={<MarketingHome />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const session = await auth();

  if (session?.user) {
    return (
      <LoggedInHome
        name={session.user.name}
        plan={session.user.plan}
        email={session.user.email}
      />
    );
  }

  return <MarketingHome />;
}
