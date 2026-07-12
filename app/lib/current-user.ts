import "server-only";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";

export async function requireCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/giris");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) {
    redirect("/giris");
  }

  return user;
}
