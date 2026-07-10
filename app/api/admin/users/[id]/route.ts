import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { isAdminEmail } from "@/app/lib/admin";

const VALID_PLANS = ["free", "pro", "ultra"];

async function requireAdmin() {
  const session = await auth();
  return isAdminEmail(session?.user?.email);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { name, plan } = body as { name?: string | null; plan?: string };
  if (plan !== undefined && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Geçersiz plan." }, { status: 400 });
  }

  const updates: Partial<{ name: string | null; plan: string }> = {};
  if (name !== undefined) updates.name = name;
  if (plan !== undefined) updates.plan = plan;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Güncellenecek alan yok." },
      { status: 400 }
    );
  }

  await db.update(users).set(updates).where(eq(users.id, id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { id } = await params;

  const [target] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (target && isAdminEmail(target.email)) {
    return NextResponse.json(
      { error: "Admin hesabı silinemez." },
      { status: 400 }
    );
  }

  await db.delete(users).where(eq(users.id, id));

  return NextResponse.json({ ok: true });
}
