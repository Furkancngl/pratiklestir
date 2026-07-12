import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { auth } from "@/auth";
import AppChrome from "./components/app-chrome";
import AuthSessionProvider from "./components/session-provider";
import Sidebar from "./components/sidebar";
import ThemeToggle from "./components/theme-toggle";
import TopNav from "./components/top-nav";
import { ThemeProvider } from "./context/theme-context";
import { isAdminEmail } from "./lib/admin";
import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { getFreshCredits } from "./lib/credits";
import { SITE_NAME, SITE_URL } from "./lib/site";
import { getSiteJsonLd } from "./lib/site-schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pratikleştir - Hızlı ve Ücretsiz Online Araçlar",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "QR kod oluşturma, arka plan silme ve daha fazlası için hızlı, ücretsiz ve tamamen tarayıcıda çalışan online araçlar. Kayıt gerektirmez, dosyalarınız cihazınızdan çıkmaz.",
  // Dikkat: buraya sabit bir `alternates.canonical` KONULMAZ. Next.js'te bir
  // segment kendi canonical'ını tanımlamazsa üst segmentinkini miras alır;
  // burada sabit bir URL tanımlarsak (örn. SITE_URL) kendi canonical'ını
  // ayarlamayan HER sayfa (giriş, kayıt, admin, vb.) yanlışlıkla anasayfayı
  // canonical gösterir. Her genel sayfa kendi canonical'ını kendi
  // metadata'sında tanımlar (bkz. app/page.tsx, app/lib/tool-metadata.ts).
  robots: {
    index: true,
    follow: true,
  },
};

// Sayfa boyanmadan önce senkron çalışır: kayıtlı tema varsa onu, yoksa
// sistem temasını uygular. React state'i de aynı mantıkla başlar
// (bkz. context/theme-context.tsx), böylece hydration'da flaş olmaz.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var isDark=t==="light"||t==="dark"?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",isDark)}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);

  let credits: { credits: number; limit: number } | null = null;
  if (session?.user?.email) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);
    if (dbUser) {
      credits = await getFreshCredits(dbUser);
    }
  }

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthSessionProvider session={session}>
          <ThemeProvider>
            <AppChrome
              session={!!session}
              nav={
                session ? (
                  <Sidebar
                    isAdmin={isAdmin}
                    userName={session.user?.name}
                    userEmail={session.user?.email}
                    userPlan={session.user?.plan}
                    userCredits={credits?.credits}
                    userCreditLimit={credits?.limit}
                  />
                ) : (
                  <TopNav />
                )
              }
            >
              {children}
            </AppChrome>
            <ThemeToggle />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
