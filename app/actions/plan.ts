"use server";

import { eq } from "drizzle-orm";
import { auth, unstable_update } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { getDailyCreditLimit } from "@/app/lib/credits";

export type SelectPlanResult = { error?: string } | undefined;

export async function selectPlan(plan: "free" | "pro"): Promise<SelectPlanResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: "Oturum bulunamadı. Lütfen tekrar giriş yap." };
  }

  await db
    .update(users)
    .set({
      plan,
      planSelectedAt: new Date(),
      credits: getDailyCreditLimit(plan),
      creditsResetAt: new Date(),
    })
    .where(eq(users.email, email));

  await unstable_update({ user: { plan, planSelected: true } });
}
