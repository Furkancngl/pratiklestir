"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signup } from "@/app/actions/auth";
import AuthBrandPanel from "../components/auth-brand-panel";
import { GoogleIcon } from "../components/icons";

export default function KayitPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push("/planlar");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#0a0a0f] md:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] opacity-0 [animation:auth-fade-up_.6s_ease_forwards_.2s]">
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight text-black dark:text-white">
            Ücretsiz Hesap Oluştur
          </h1>
          <p className="mb-7 text-sm text-zinc-600 dark:text-zinc-400">
            Zaten hesabın var mı?{" "}
            <Link
              href="/giris"
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Giriş yap
            </Link>
          </p>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mb-5 flex w-full touch-manipulation items-center justify-center gap-2.5 rounded-xl border border-black/[.12] bg-black/[.03] p-3 text-sm font-semibold text-black transition-all! duration-200! hover:-translate-y-0.5 hover:border-black/[.22] hover:bg-black/[.06] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:hover:border-white/[.22] dark:hover:bg-white/[.08]"
          >
            <GoogleIcon className="h-4.5 w-4.5" />
            Google ile kayıt ol
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.08]" />
            veya e-posta ile
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.08]" />
          </div>

          <form action={formAction} className="flex flex-col">
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                Ad Soyad
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Adın Soyadın"
                className="w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@email.com"
                className="w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="En az 8 karakter"
                  className="w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 pr-16 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 touch-manipulation text-[11px] font-semibold tracking-wide text-zinc-400 select-none hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  {showPassword ? "GİZLE" : "GÖSTER"}
                </button>
              </div>
            </div>

            {/* Referans tasarımda yok, ama mevcut kayıt mantığı (signup
                action) şifre tekrarını zorunlu kılıyor - kaldırılırsa kayıt
                hep "şifreler eşleşmiyor" hatasıyla başarısız olur. */}
            <div className="mb-4">
              <label
                htmlFor="passwordConfirm"
                className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
              >
                Şifre (tekrar)
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Şifreni tekrar gir"
                className="w-full rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.75 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="mb-5.5 flex items-start gap-2 text-[13px]">
              <input
                type="checkbox"
                required
                className="mt-0.75 accent-violet-500"
              />
              <span className="leading-[1.5] text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                >
                  Kullanım Şartları
                </button>
                &apos;nı ve{" "}
                <button
                  type="button"
                  className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                >
                  Gizlilik Politikası
                </button>
                &apos;nı okudum, kabul ediyorum.
              </span>
            </div>

            {state?.error && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full touch-manipulation rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 p-3.25 text-[14.5px] font-bold text-white shadow-[0_10px_26px_rgba(99,102,241,0.4)] transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Hesap oluşturuluyor..." : "Ücretsiz Hesap Oluştur"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
