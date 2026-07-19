"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  if (plan === "free") {
    const [user] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user?.plan === "pro") {
      // Ödediği dönem bitmeden anında Free'ye düşürmüyoruz - gerçek iptal
      // akışı (onay ekranı + cancelAtPeriodEnd) Plan & Faturalama'da.
      redirect("/ayarlar/plan-faturalama");
    }
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

export async function cancelProPlan(): Promise<SelectPlanResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: "Oturum bulunamadı. Lütfen tekrar giriş yap." };
  }

  const [user] = await db
    .select({ id: users.id, plan: users.plan })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || user.plan !== "pro") {
    return { error: "İptal edilecek aktif bir Pro üyelik bulunamadı." };
  }

  // Plan hâlâ "pro" kalır, sadece dönem sonunda düşeceği işaretlenir -
  // gerçek düşürme Gumroad'dan "subscription_ended" ping'i gelince
  // webhook tarafında yapılır (bkz. app/api/webhooks/gumroad/route.ts).
  await db.update(users).set({ cancelAtPeriodEnd: true }).where(eq(users.id, user.id));

  revalidatePath("/ayarlar/plan-faturalama");
}

export async function undoCancelProPlan(): Promise<SelectPlanResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: "Oturum bulunamadı. Lütfen tekrar giriş yap." };
  }

  await db.update(users).set({ cancelAtPeriodEnd: false }).where(eq(users.email, email));

  revalidatePath("/ayarlar/plan-faturalama");
}
