import Link from "next/link";
import type { CreditError } from "@/app/hooks/use-credit-gate";

export default function CreditErrorNotice({ error }: { error: CreditError | null }) {
  if (!error) return null;

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
