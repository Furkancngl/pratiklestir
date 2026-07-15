import Reveal from "./reveal";

type ReasonIcon = "bolt" | "shield" | "cursor" | "device" | "gift" | "refresh";

type Reason = {
  icon: ReasonIcon;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    icon: "bolt",
    title: "Hızlı İşlem",
    description: "Tüm araçlar tarayıcında çalışır, bekleme veya yükleme kuyruğu olmadan saniyeler içinde sonuç alırsın.",
  },
  {
    icon: "shield",
    title: "Güvenli Kullanım",
    description: "Dosyaların sunucuya hiç yüklenmez; işlem tamamen kendi cihazında gerçekleşir.",
  },
  {
    icon: "cursor",
    title: "Kolay Arayüz",
    description: "Karmaşık ayar veya öğrenme eğrisi yok; her araç tek ekranda, sade bir akışla çalışır.",
  },
  {
    icon: "device",
    title: "Mobil Uyum",
    description: "Telefon, tablet veya bilgisayar fark etmeksizin her ekranda aynı rahatlıkla kullanılır.",
  },
  {
    icon: "gift",
    title: "Ücretsiz Kullanım",
    description: "Araçların tamamına kayıt olmadan, kredi kartı istemeden ücretsiz erişebilirsin.",
  },
  {
    icon: "refresh",
    title: "Sürekli Güncellenen Araçlar",
    description: "Kütüphane düzenli olarak yeni araç ve iyileştirmelerle büyümeye devam ediyor.",
  },
];

function ReasonIconGlyph({ icon, className }: { icon: ReasonIcon; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (icon) {
    case "bolt":
      return (
        <svg {...shared}>
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 4.5 6v6c0 4.5 3.2 7.4 7.5 9 4.3-1.6 7.5-4.5 7.5-9V6L12 3Z" />
        </svg>
      );
    case "cursor":
      return (
        <svg {...shared}>
          <path d="m5 3 5.5 15 2-6.5L19 9.5Z" />
        </svg>
      );
    case "device":
      return (
        <svg {...shared}>
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "gift":
      return (
        <svg {...shared}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
          <path d="M12 8c-1.5 0-3-1-3-2.5S10.5 3 12 4.5C13.5 3 15 3.5 15 5.5S13.5 8 12 8Z" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...shared}>
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v6h-6" />
        </svg>
      );
  }
}

export default function WhyPratiklestir() {
  return (
    <div className="mt-16 w-full max-w-4xl">
      <Reveal>
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Neden Pratikleştir?
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, index) => (
          <Reveal key={reason.title} delayMs={(index % 6) * 80}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-black/[.08] bg-white p-5 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/12 text-purple-500 dark:bg-purple-400/15 dark:text-purple-300">
                <ReasonIconGlyph icon={reason.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-zinc-50">{reason.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {reason.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
