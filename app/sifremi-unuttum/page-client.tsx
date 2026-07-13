"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/password-reset";
import AuthBrandPanel from "../components/auth-brand-panel";

export default function SifremiUnuttumPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#0a0a0f] md:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] opacity-0 [animation:auth-fade-up_.6s_ease_forwards_.2s]">
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight text-black dark:text-white">
            Şifremi Unuttum
          </h1>
          <p className="mb-7 text-sm text-zinc-600 dark:text-zinc-400">
            Hesabına kayıtlı e-postayı gir, sana şifre sıfırlama bağlantısı
            gönderelim.
          </p>

          {state?.success ? (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
              Bu e-posta bize kayıtlıysa, şifre sıfırlama bağlantısını
              içeren bir e-posta gönderdik. Gelen kutunu (ve spam klasörünü)
              kontrol et.
            </div>
          ) : (
            <form action={formAction} className="flex flex-col">
              <div className="mb-5.5">
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

              {state?.error && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full touch-manipulation rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 p-3.25 text-[14.5px] font-bold text-white shadow-[0_10px_26px_rgba(99,102,241,0.4)] transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/giris"
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Girişe geri dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
