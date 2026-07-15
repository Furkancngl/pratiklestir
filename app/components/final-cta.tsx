import Link from "next/link";
import { DAILY_CREDIT_LIMITS } from "../lib/credits";

const advantages = [
  `Günde ${DAILY_CREDIT_LIMITS.free} yerine ${DAILY_CREDIT_LIMITS.pro} kredi`,
  "Daha hızlı işlem önceliği",
  "Aynı anda birden fazla dosya",
  "Öncelikli destek",
];

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function FinalCta() {
  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-purple-500/25 bg-linear-to-br from-purple-500/[.08] via-indigo-500/[.06] to-transparent px-8 py-10 text-center dark:border-purple-400/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-40 w-full max-w-xs rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/25"
      />

      <span className="relative inline-flex items-center rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-3 py-1 text-xs font-bold text-white">
        PRO
      </span>
      <p className="relative mt-3 text-xl font-extrabold tracking-tight text-black dark:text-white">
        Daha fazla üretiyorsan, Pro seni bekliyor
      </p>
      <p className="relative mx-auto mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        Aylık ₺170 karşılığında istediğin zaman yükselt veya iptal et, gizli ücret yok.
      </p>

      <ul className="relative mx-auto mt-5 flex max-w-sm flex-col gap-2 text-left">
        {advantages.map((advantage) => (
          <li key={advantage} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <CheckGlyph className="h-4 w-4 shrink-0 text-purple-500 dark:text-purple-300" />
            {advantage}
          </li>
        ))}
      </ul>

      <Link
        href="/kayit"
        className="relative mt-6 inline-flex touch-manipulation items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-transform! duration-200! hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40"
      >
        Ücretsiz Hesap Oluştur
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
