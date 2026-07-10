import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist_Mono, Inter } from "next/font/google";
import { auth } from "@/auth";
import Sidebar from "./components/sidebar";
import ThemeToggle from "./components/theme-toggle";
import TopNav from "./components/top-nav";
import { ThemeProvider } from "./context/theme-context";
import { isAdminEmail } from "./lib/admin";
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
  title: "Pratikleştir - Hızlı ve Ücretsiz Online Araçlar",
  description:
    "QR kod oluşturma, arka plan silme ve daha fazlası için hızlı, ücretsiz ve tamamen tarayıcıda çalışan online araçlar. Kayıt gerektirmez, dosyalarınız cihazınızdan çıkmaz.",
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
  const headersList = await headers();
  const isAdminSection = headersList.get("x-app-section") === "admin";
  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`flex min-h-full flex-col ${session ? "md:flex-row" : ""}`}
      >
        <ThemeProvider>
          {!isAdminSection &&
            (session ? <Sidebar isAdmin={isAdmin} /> : <TopNav />)}
          <main className="flex flex-1 flex-col">{children}</main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
