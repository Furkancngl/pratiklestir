"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { getFreshCredits, TOOL_CREDIT_COSTS, type ToolKey } from "@/app/lib/credits";

export type ConsumeCreditResult =
  | { ok: true; remaining: number; limit: number }
  | {
      ok: false;
      code: "unauthenticated" | "insufficient_credits";
      message: string;
      remaining: number;
      limit: number;
    };

export async function consumeCredit(tool: ToolKey): Promise<ConsumeCreditResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "Oturum bulunamadı. Lütfen tekrar giriş yap.",
      remaining: 0,
      limit: 0,
    };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return {
      ok: false,
      code: "unauthenticated",
      message: "Oturum bulunamadı. Lütfen tekrar giriş yap.",
      remaining: 0,
      limit: 0,
    };
  }

  const { credits, limit } = await getFreshCredits(user);
  const cost = TOOL_CREDIT_COSTS[tool];

  if (credits < cost) {
    return {
      ok: false,
      code: "insufficient_credits",
      message: "Günlük kredin bitti, Pro'ya geçerek daha fazla kredi kazanabilirsin.",
      remaining: credits,
      limit,
    };
  }

  // credits >= cost koşulu WHERE'de tekrar kontrol edilir: getFreshCredits'ten
  // buraya kadar geçen sürede eşzamanlı bir istek krediyi tüketmiş olabilir
  // (TOCTOU). Bu atomik UPDATE, negatif/eksi harcamayı DB seviyesinde engeller.
  const [updated] = await db
    .update(users)
    .set({ credits: sql`${users.credits} - ${cost}` })
    .where(and(eq(users.id, user.id), gte(users.credits, cost)))
    .returning({ credits: users.credits });

  if (!updated) {
    return {
      ok: false,
      code: "insufficient_credits",
      message: "Günlük kredin bitti, Pro'ya geçerek daha fazla kredi kazanabilirsin.",
      remaining: 0,
      limit,
    };
  }

  return { ok: true, remaining: updated.credits, limit };
}
