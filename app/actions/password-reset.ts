"use server";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "@/app/lib/db";
import { passwordResetTokens, users } from "@/app/lib/db/schema";
import { sendPasswordResetEmail } from "@/app/lib/email";
import { checkRateLimit, getClientIp, passwordResetRateLimit } from "@/app/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

// SITE_URL (app/lib/site.ts) prod domain'i henüz deploy edilmemişse
// gerçekte erişilemeyen bir placeholder olabilir (SEO/canonical tag'ler
// için var). E-posta linki her zaman gerçekten çalışan adrese gitmeli, bu
// yüzden isteğin geldiği host/protokolden üretiyoruz.
function getRequestOrigin(headersList: Headers): string {
  const host = headersList.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${protocol}://${host}`;
}

export type PasswordResetRequestState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function requestPasswordReset(
  _prevState: PasswordResetRequestState,
  formData: FormData
): Promise<PasswordResetRequestState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const headersList = await headers();
  const ip = getClientIp(headersList);
  const { allowed } = await checkRateLimit(passwordResetRateLimit, `pwreset:${ip}`);
  if (!allowed) {
    return { error: "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Lütfen geçerli bir e-posta adresi girin." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // Hesap yoksa veya Google-only ise (passwordHash yok, sıfırlanacak bir
  // şifre yok) sessizce hiçbir şey yapmıyoruz - ama kullanıcıya her zaman
  // aynı "gönderildi" mesajını dönüyoruz, aksi halde e-posta enumeration'a
  // açık olurdu.
  if (user && user.passwordHash) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const resetUrl = `${getRequestOrigin(headersList)}/sifre-sifirla?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return { success: true };
}

export type PasswordResetState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function resetPassword(
  _prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const ip = getClientIp(await headers());
  const { allowed } = await checkRateLimit(passwordResetRateLimit, `pwreset-confirm:${ip}`);
  if (!allowed) {
    return { error: "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin." };
  }

  if (!token) {
    return { error: "Geçersiz veya eksik bağlantı." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }
  if (password !== passwordConfirm) {
    return { error: "Şifreler eşleşmiyor." };
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, tokenHash))
    .limit(1);

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() < Date.now()) {
    return {
      error: "Bağlantının süresi dolmuş veya daha önce kullanılmış. Lütfen yeni bir bağlantı iste.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.update(users).set({ passwordHash }).where(eq(users.id, resetToken.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, resetToken.id));

  return { success: true };
}
