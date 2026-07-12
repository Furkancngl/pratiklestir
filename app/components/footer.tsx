import Link from "next/link";

const COMPANY_LINKS = [
  { label: "İletişim", href: "#" },
  { label: "SSS", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Gizlilik Politikası", href: "#" },
  { label: "Kullanım Şartları", href: "#" },
  { label: "Çerez Politikası", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] px-6 pt-11 pb-7 dark:border-white/10">
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-80">
            <div className="mb-1.5 text-lg font-extrabold tracking-tight text-black dark:text-zinc-50">
              Pratikleştir
            </div>
            <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Günlük işlerini hızlandıran, ücretsiz ve kullanımı kolay küçük
              araçlar. Kayıt gerektirmez, dosyaların sunucuya yüklenmez.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-10">
            <div>
              <h4 className="mb-2.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Şirket
              </h4>
              <div className="flex gap-4">
                {COMPANY_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13.5px] whitespace-nowrap text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2.5 text-[11px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Yasal
              </h4>
              <div className="flex gap-4">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13.5px] whitespace-nowrap text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[.06] pt-5.5 dark:border-white/5">
          <div className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
            © 2026 Pratikleştir. Tüm hakları saklıdır.
          </div>
          <div className="flex flex-wrap gap-4.5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12.5px] text-zinc-500 transition-colors hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
