import Link from "next/link";
import type { CreditError } from "@/app/hooks/use-credit-gate";

export default function CreditErrorNotice({ error }: { error: CreditError | null }) {
  if (!error) return null;

  if (error.kind === "guest-invite") {
    return (
      <div className="mt-4 rounded-2xl border border-purple-500/25 bg-purple-500/[.05] p-5 text-center dark:border-purple-400/20 dark:bg-purple-400/[.06]">
        <p className="text-sm font-semibold text-black dark:text-zinc-50">{error.message}</p>
        <Link
          href="/kayit"
          className="mt-3 inline-flex touch-manipulation items-center gap-1.5 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white transition-transform! duration-200! hover:-translate-y-0.5"
        >
          Ücretsiz Hesap Oluştur
        </Link>
      </div>
    );
  }

  return (
    <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
      {error.message}
      {error.showUpgrade && (
        <>
          {" "}
          <Link href="/planlar" className="font-semibold underline underline-offset-2">
            Planlara göz at
          </Link>
        </>
      )}
    </p>
  );
}
