"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
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

  // jwt() callback'i trigger==="update" verisini session.plan /
  // session.planSelected olarak (user altında değil, düz) okuyor - tip
  // tanımı user altını bekliyor ama çalışma zamanı davranışı bu değil.
  await unstable_update({ plan, planSelected: true } as Parameters<typeof unstable_update>[0]);

  redirect("/");
}
