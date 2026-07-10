import Link from "next/link";

export default function TopNav() {
  return (
    <header className="flex items-center justify-between border-b border-black/[.08] bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-black transition-opacity hover:opacity-70 dark:text-zinc-50"
      >
        Pratikleştir
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/giris"
          className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Giriş Yap
        </Link>
        <Link
          href="/kayit"
          className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
