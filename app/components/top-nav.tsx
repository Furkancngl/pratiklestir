import Link from "next/link";

export default function TopNav() {
  return (
    <header className="flex items-center justify-between bg-zinc-50 px-6 py-4 dark:bg-zinc-900">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-black transition-opacity hover:opacity-70 dark:text-zinc-50"
      >
        Pratikleştir
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/giris"
          className="rounded-md px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-500/10 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Giriş Yap
        </Link>
        <Link
          href="/kayit"
          className="touch-manipulation rounded-md bg-linear-to-r from-purple-500 to-indigo-500 px-3 py-2 text-sm font-medium text-white shadow-md shadow-purple-500/25 transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/35"
        >
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
