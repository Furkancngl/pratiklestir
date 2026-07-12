import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";
import { isSameOriginRequest } from "@/app/lib/csrf";
import { apiMutationRateLimit, checkRateLimit, getClientIp } from "@/app/lib/rate-limit";

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const { allowed } = await checkRateLimit(
    apiMutationRateLimit,
    `api:${getClientIp(request.headers)}`
  );
  if (!allowed) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { name } = body as { name?: string | null };
  const trimmed = typeof name === "string" ? name.trim() : null;
  if (!trimmed) {
    return NextResponse.json({ error: "Ad Soyad boş olamaz." }, { status: 400 });
  }

  await db.update(users).set({ name: trimmed }).where(eq(users.email, email));

  return NextResponse.json({ ok: true, name: trimmed });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const { allowed } = await checkRateLimit(
    apiMutationRateLimit,
    `api:${getClientIp(request.headers)}`
  );
  if (!allowed) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  await db.delete(users).where(eq(users.email, email));

  return NextResponse.json({ ok: true });
}
