import { eq } from "drizzle-orm";
import dynamic from "next/dynamic";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { getFreshCredits } from "@/app/lib/credits";
import { isAdminEmail } from "@/app/lib/admin";
import TopNav from "./top-nav";

// Sidebar (framer-motion + tools/categories verisi içerir) yalnızca oturum
// açmış kullanıcılara render edilir; dynamic import ile bu kod çıkarımsız
// (marketing/anonim) sayfaların JS paketinden ayrı tutulur.
const Sidebar = dynamic(() => import("./sidebar"));

// Bu bileşen app/layout.tsx'te <Suspense> ile sarılı - cookies() okuyan
// auth() çağrısı burada, sayfanın geri kalanının (statik kabuk) dışında
// kalıyor. Böylece anonim/pazarlama sayfaları statik/ISR kalabiliyor,
// oturum kontrolü yalnızca bu küçük parça için (request time'da, aynı
// stream içinde - client flash yok) çalışıyor.
export default async function AuthNav() {
  const session = await auth();
  if (!session?.user) {
    return <TopNav />;
  }

  const isAdmin = isAdminEmail(session.user.email);

  // Bakım modunda (veya herhangi bir geçici DB kesintisinde) credits
  // sorgusu başarısız olabilir - bu sidebar'ın hiç render olmamasına
  // (ve admin'in bakım sırasında siteyi test edememesine) yol açmasın.
  let credits: { credits: number; limit: number } | null = null;
  if (session.user.email) {
    try {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);
      if (dbUser) {
        credits = await getFreshCredits(dbUser);
      }
    } catch {
      credits = null;
    }
  }

  return (
    <Sidebar
      isAdmin={isAdmin}
      userName={session.user.name}
      userEmail={session.user.email}
      userPlan={session.user.plan}
      userCredits={credits?.credits}
      userCreditLimit={credits?.limit}
    />
  );
}
