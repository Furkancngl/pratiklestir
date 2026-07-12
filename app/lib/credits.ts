import "server-only";
import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";

type UserRow = InferSelectModel<typeof users>;

export const DAILY_CREDIT_LIMITS: Record<string, number> = {
  free: 30,
  pro: 200,
};

export function getDailyCreditLimit(plan: string): number {
  return DAILY_CREDIT_LIMITS[plan] ?? DAILY_CREDIT_LIMITS.free;
}

export const TOOL_CREDIT_COSTS = {
  "/qr-kod": 1,
  "/qr-kod-oku": 1,
  "/sifre-olusturucu": 1,
  "/pdf-birlestir": 1,
  "/pdf-sikistir": 1,
  "/gorsel-sikistir": 1,
  "/arka-plan-sil": 2,
} as const;

export type ToolKey = keyof typeof TOOL_CREDIT_COSTS;

// Reset gün sınırı UTC'ye göre belirlenir; sunucu saat dilimine bağlı
// kaymaları önlemek için sabit bir referans kullanıyoruz.
function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export async function getFreshCredits(
  user: UserRow
): Promise<{ credits: number; limit: number }> {
  const limit = getDailyCreditLimit(user.plan);
  const now = new Date();

  if (user.creditsResetAt && isSameUtcDay(user.creditsResetAt, now)) {
    return { credits: user.credits, limit };
  }

  await db
    .update(users)
    .set({ credits: limit, creditsResetAt: now })
    .where(eq(users.id, user.id));

  return { credits: limit, limit };
}
