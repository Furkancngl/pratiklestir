import { redirect } from "next/navigation";
import { count, gte } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { isAdminEmail } from "@/app/lib/admin";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export default async function AdminPage() {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [[{ total }], planRows, [{ recentCount }]] = await Promise.all([
    db.select({ total: count() }).from(users),
    db
      .select({ plan: users.plan, planCount: count() })
      .from(users)
      .groupBy(users.plan),
    db
      .select({ recentCount: count() })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo)),
  ]);

  const planCounts: Record<string, number> = { free: 0, pro: 0, ultra: 0 };
  for (const row of planRows) {
    planCounts[row.plan] = row.planCount;
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-10 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Genel Bakış
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Toplam Kullanıcı" value={total} />
          <StatCard label="Son 7 Günde Kayıt" value={recentCount} />
          {Object.entries(planCounts).map(([plan, planCount]) => (
            <StatCard
              key={plan}
              label={PLAN_LABELS[plan] ?? plan}
              value={planCount}
              sub={total > 0 ? `%${((planCount / total) * 100).toFixed(1)}` : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-t-2 border-black/[.08] border-t-indigo-500 bg-white p-4 dark:border-zinc-800 dark:border-t-indigo-500 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-black dark:text-zinc-50">
        {value}
        {sub && (
          <span className="ml-1.5 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {sub}
          </span>
        )}
      </p>
    </div>
  );
}
