import "server-only";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { users, toolUsageEvents } from "@/app/lib/db/schema";
import { tools } from "./tools";

export type Period = "week" | "month";

export type RecentUsageItem = {
  tool: string;
  date: string;
  status: "Tamamlandı";
};

export type UsageStats = {
  total: number;
  topTool: string;
  recentItems: RecentUsageItem[];
};

const EMPTY_STATS: UsageStats = { total: 0, topTool: "—", recentItems: [] };

function periodStart(period: Period): Date {
  const days = period === "week" ? 7 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function toolName(href: string): string {
  return tools.find((t) => t.href === href)?.name ?? href;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  if (diffDays <= 0) return `Bugün, ${time}`;
  if (diffDays === 1) return `Dün, ${time}`;
  return `${diffDays} gün önce, ${time}`;
}

// Dashboard'daki "Özet" kartını (bkz. app/components/dashboard-card.tsx)
// besler. Kredi bakiyesi (users.credits) günlük sıfırlandığı için geçmişe
// dair hiçbir şey tutmaz - bu yüzden gerçek "Son Hafta/Son Ay" ve "En Çok
// Kullanılan Araç" hesapları tool_usage_events log tablosundan (bkz.
// app/actions/credits.ts) yapılır.
export async function getUsageStats(email: string, period: Period): Promise<UsageStats> {
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) return EMPTY_STATS;

  const since = periodStart(period);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(toolUsageEvents)
    .where(and(eq(toolUsageEvents.userId, user.id), gte(toolUsageEvents.createdAt, since)));

  const [topRow] = await db
    .select({ tool: toolUsageEvents.tool, uses: sql<number>`count(*)::int` })
    .from(toolUsageEvents)
    .where(and(eq(toolUsageEvents.userId, user.id), gte(toolUsageEvents.createdAt, since)))
    .groupBy(toolUsageEvents.tool)
    .orderBy(desc(sql`count(*)`))
    .limit(1);

  const recentRows = await db
    .select({ tool: toolUsageEvents.tool, createdAt: toolUsageEvents.createdAt })
    .from(toolUsageEvents)
    .where(and(eq(toolUsageEvents.userId, user.id), gte(toolUsageEvents.createdAt, since)))
    .orderBy(desc(toolUsageEvents.createdAt))
    .limit(period === "week" ? 3 : 5);

  return {
    total,
    topTool: topRow ? toolName(topRow.tool) : "—",
    recentItems: recentRows.map((row) => ({
      tool: toolName(row.tool),
      date: formatRelativeDate(row.createdAt),
      status: "Tamamlandı",
    })),
  };
}
