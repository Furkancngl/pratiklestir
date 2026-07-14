import Link from "next/link";

export default function FinalCta() {
  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-500/[.08] via-indigo-500/[.06] to-transparent px-8 py-10 text-center dark:border-purple-400/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-40 w-full max-w-xs rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/25"
      />

      <p className="relative text-xl font-extrabold tracking-tight text-black dark:text-white">
        Hemen ücretsiz hesap oluştur
      </p>
      <p className="relative mx-auto mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        +50 araca daha erişim kazan, kredi kartı gerekmez.
      </p>
      <Link
        href="/kayit"
        className="relative mt-5 inline-flex touch-manipulation items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-transform! duration-200! hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40"
      >
        Ücretsiz Hesap Oluştur
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
