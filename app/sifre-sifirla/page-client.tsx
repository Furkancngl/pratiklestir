"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/password-reset";
import AuthBrandPanel from "../components/auth-brand-panel";

export default function SifreSifirlaPage({ token }: { token: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(resetPassword, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push("/giris");
    }
  }, [state, router]);

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#0a0a0f] md:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] opacity-0 [animation:auth-fade-up_.6s_ease_forwards_.2s]">
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight text-black dark:text-white">
            Yeni Şifre Belirle
          </h1>
          <p className="mb-7 text-sm text-zinc-600 dark:text-zinc-400">
            Hesabın için yeni bir şifre gir.
          </p>

          {!token ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Geçersiz bağlantı. Lütfen{" "}
              <Link
                href="/sifremi-unuttum"
                className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
              >
                yeni bir sıfırlama bağlantısı iste
              </Link>
              .
            </p>
          ) : (
            <form action={formAction} className="flex flex-col">
              <input type="hidden" name="token" value={token} />

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Yeni Şifre
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

              <div className="mb-5.5">
                <label
                  htmlFor="passwordConfirm"
                  className="mb-1.5 block text-[12.5px] font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Yeni Şifre (tekrar)
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

              {state?.error && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full touch-manipulation rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 p-3.25 text-[14.5px] font-bold text-white shadow-[0_10px_26px_rgba(99,102,241,0.4)] transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
