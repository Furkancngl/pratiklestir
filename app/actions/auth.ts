"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/db/schema";

export type SignupState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const name = String(formData.get("fullName") ?? "").trim() || null;

  if (!EMAIL_REGEX.test(email)) {
    return { error: "Lütfen geçerli bir e-posta adresi girin." };
  }
  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }
  if (password !== passwordConfirm) {
    return { error: "Şifreler eşleşmiyor." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { error: "Bu e-posta adresi zaten kayıtlı." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({ email, passwordHash, name });

  try {
    // redirect:false kullanıyoruz ki NextAuth burada kendi redirect'ini
    // fırlatmasın - RootLayout session'ı sadece ilk yüklemede okuduğu için
    // (Partial Rendering, layout'ları navigasyonda otomatik yenilemiyor)
    // Sidebar/TopNav güncellenmeden kullanıcı eski sayfada kalırdı. Bunun
    // yerine kontrolü client'a (kayit/page.tsx) bırakıp orada
    // router.push + router.refresh ile garantiliyoruz.
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Hesap oluşturuldu ama giriş yapılamadı. Lütfen giriş yapın." };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return { success: true };
}
