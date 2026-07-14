import Link from "next/link";
import type { FileSizeError } from "@/app/hooks/use-file-size-limit";

export default function FileSizeErrorNotice({ error }: { error: FileSizeError | null }) {
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
