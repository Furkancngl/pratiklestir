"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";

export type NotificationPreferences = {
  notifyNewFeatures: boolean;
  notifyMarketing: boolean;
};

export type UpdateNotificationPreferencesResult = { error?: string } | undefined;

// Hesap güvenlik uyarıları burada yok - her zaman açık ve kapatılamaz
// olduğu için kullanıcıdan bir tercih alınmıyor (bkz. schema.ts).
export async function updateNotificationPreferences(
  preferences: NotificationPreferences
): Promise<UpdateNotificationPreferencesResult> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: "Oturum bulunamadı. Lütfen tekrar giriş yap." };
  }

  await db
    .update(users)
    .set({
      notifyNewFeatures: preferences.notifyNewFeatures,
      notifyMarketing: preferences.notifyMarketing,
    })
    .where(eq(users.email, email));
}
