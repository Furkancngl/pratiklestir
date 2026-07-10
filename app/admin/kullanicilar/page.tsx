import { redirect } from "next/navigation";
import { desc, ilike } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { isAdminEmail } from "@/app/lib/admin";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

const LIST_LIMIT = 500;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = await db
    .select({ email: users.email, plan: users.plan, createdAt: users.createdAt })
    .from(users)
    .where(query ? ilike(users.email, `%${query}%`) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(LIST_LIMIT);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-10 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Kullanıcılar
          </h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {results.length} kullanıcı
            {results.length === LIST_LIMIT ? "+" : ""}
          </span>
        </div>

        <form className="mt-6 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="E-posta ile ara..."
            className="w-full max-w-xs rounded-md border border-black/[.08] bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-indigo-500"
          >
            Ara
          </button>
          {query && (
            <a
              href="/admin/kullanicilar"
              className="flex items-center px-2 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Temizle
            </a>
          )}
        </form>

        <div className="mt-6 overflow-hidden rounded-lg border border-black/[.08] dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/[.08] bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <th className="px-4 py-2.5 font-medium">E-posta</th>
                <th className="px-4 py-2.5 font-medium">Kayıt Tarihi</th>
                <th className="px-4 py-2.5 font-medium">Plan</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr className="bg-white dark:bg-zinc-950">
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    Sonuç bulunamadı.
                  </td>
                </tr>
              ) : (
                results.map((user, i) => (
                  <tr
                    key={user.email}
                    className={
                      i !== results.length - 1
                        ? "border-b border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950"
                        : "bg-white dark:bg-zinc-950"
                    }
                  >
                    <td className="px-4 py-2.5 text-black dark:text-zinc-50">
                      {user.email}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                      {user.createdAt.toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                      {PLAN_LABELS[user.plan] ?? user.plan}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
