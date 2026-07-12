import Link from "next/link";

const FEATURES = [
  { icon: "⚡", text: "Tüm temel araçlar sınırsız ve ücretsiz" },
  { icon: "🔒", text: "Dosyaların sunucuya yüklenmez" },
  { icon: "🇹🇷", text: "Tamamen Türkçe arayüz" },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-black/[.08] bg-white p-12 dark:border-white/[.06] dark:bg-[#0d0d12] md:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-30 -left-20 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] blur-[70px] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.35)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-25 -right-25 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] blur-[70px] dark:bg-[radial-gradient(circle,rgba(236,72,153,0.22)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-[auth-blob-float_7s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.13)_0%,transparent_70%)] blur-[60px] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)]"
      />

      <Link
        href="/"
        className="relative flex w-fit items-center gap-2.5 text-xl font-extrabold tracking-tight text-black opacity-0 transition-opacity! duration-200! [animation:auth-fade-up_.6s_ease_forwards] hover:opacity-70 dark:text-white"
      >
        <span className="h-2.5 w-2.5 rounded-[3px] bg-linear-to-br from-violet-400 to-pink-400" />
        Pratikleştir
      </Link>

      <div className="relative flex items-center gap-3.5 rounded-2xl border border-black/[.08] bg-black/[.02] px-4.5 py-4 opacity-0 [animation:auth-fade-up_.6s_ease_forwards_.15s] dark:border-white/[.08] dark:bg-white/[.03]">
        <div className="flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#8b5cf6] text-[11px] font-bold text-white dark:border-[#0d0d12]">
            A
          </span>
          <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#6366f1] text-[11px] font-bold text-white dark:border-[#0d0d12]">
            B
          </span>
          <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ec4899] text-[11px] font-bold text-white dark:border-[#0d0d12]">
            C
          </span>
        </div>
        <p className="text-[12.5px] leading-[1.4] text-zinc-600 dark:text-zinc-400">
          <b className="text-black dark:text-white">1.000+</b> kullanıcı zaten
          Pratikleştir kullanıyor
        </p>
      </div>

      <div className="relative max-w-[420px] opacity-0 [animation:auth-fade-up_.7s_ease_forwards_.6s]">
        {/* Bu panel /giris ve /kayit'ta aynı metni gösteriyor ve
            `md:` altında gizli - bu yüzden burada h1 kullanılmıyor.
            Sayfaya özgü ve mobilde de görünen gerçek başlık (h1) yan
            paneldeki form bölümünde (bkz. page-client.tsx). */}
        <p className="mb-4 text-[34px] font-extrabold leading-[1.2] tracking-tight text-black dark:text-white">
          Günlük işlerini{" "}
          <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            saniyeler içinde
          </span>{" "}
          hallet.
        </p>
        <p className="mb-7.5 text-[15px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
          QR kod, PDF, görsel araçları ve daha fazlası — tek hesapla, tüm
          cihazlarında senkron.
        </p>

        <div className="flex flex-col gap-3.5">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.text}
              className="flex items-center gap-3 text-sm text-zinc-700 opacity-0 [animation:auth-fade-up_.5s_ease_forwards] dark:text-zinc-200"
              style={{ animationDelay: `${0.75 + index * 0.1}s` }}
            >
              <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-[9px] bg-purple-500/15 dark:bg-purple-500/20">
                {feature.icon}
              </span>
              {feature.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
