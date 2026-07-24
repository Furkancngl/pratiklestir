import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist_Mono, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppChrome from "./components/app-chrome";
import AuthNav from "./components/auth-nav";
import AuthSessionProvider from "./components/session-provider";
import ThemeToggle from "./components/theme-toggle";
import TopNav from "./components/top-nav";
import { ThemeProvider } from "./context/theme-context";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // auth() (dolayısıyla cookies()) burada ARTIK çağrılmıyor - onu ve ona
  // bağlı nav/credits hesaplamasını AuthNav'a taşıdık. AuthNav
  // <Suspense> ile sarılı: cookies() okuyan tek yer orası olduğundan,
  // anonim/pazarlama sayfaları (bu {children}) statik/ISR kabuk olarak
  // kalabiliyor - Cache Components sadece AuthNav'ı request time'da
  // stream ediyor, geri kalan her şey anında gidiyor.
  //
  // AuthSessionProvider'a artık server'da fetch edilmiş bir `session`
  // seed'lenmiyor (session prop'u hiç verilmiyor - undefined kalıyor):
  // next-auth/react kendi client-side /api/auth/session fetch'ini yapıyor.
  // (`session={null}` YERİNE undefined bırakmak bilinçli - next-auth'un
  // SessionProvider'ı session!==undefined olduğunda render sırasında
  // senkron Date.now() çağırıyor, bu da Cache Components altında statik
  // prerender'ı kırıyordu; bkz. session-provider.tsx yorumu.) Bu güvenli,
  // çünkü useSession()
  // kullanan tek yerler (use-credit-gate, use-file-size-limit,
  // general-settings-form) session'ı ilk boyamada senkron göstermiyor,
  // yalnızca kullanıcı etkileşiminde (buton tıklama, dosya seçme)
  // okuyor - yani client fetch'in birkaç yüz ms sürmesi görünür bir
  // flash'a yol açmıyor. Asıl görünür oturum göstergesi (sidebar/TopNav)
  // zaten server-side AuthNav'dan geliyor, useSession()'a bağlı değil.
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
        <AuthSessionProvider>
          <ThemeProvider>
            <AppChrome
              nav={
                <Suspense fallback={<TopNav />}>
                  <AuthNav />
                </Suspense>
              }
            >
              {children}
            </AppChrome>
            <ThemeToggle />
          </ThemeProvider>
        </AuthSessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
