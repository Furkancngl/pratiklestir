"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthBrandPanel from "../components/auth-brand-panel";
import { GoogleIcon } from "../components/icons";

export default function GirisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isBusy = pending || googlePending;

  const handleGoogleSignIn = () => {
    setGooglePending(true);
    signIn("google", { callbackUrl: searchParams.get("callbackUrl") ?? "/" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      remember: formData.get("remember") ? "true" : "false",
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError(
        result.code === "rate_limited"
          ? "Çok fazla deneme yaptınız. Lütfen bir dakika sonra tekrar deneyin."
          : "E-posta veya şifre hatalı."
      );
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#0a0a0f] md:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] opacity-0 [animation:auth-fade-up_.6s_ease_forwards_.2s]">
          <h1 className="mb-2 text-[26px] font-extrabold tracking-tight text-black dark:text-white">
            Tekrar Hoş Geldin
          </h1>
          <p className="mb-7 text-sm text-zinc-600 dark:text-zinc-400">
            Hesabın yok mu?{" "}
            <Link
              href="/kayit"
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              Ücretsiz kayıt ol
            </Link>
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="mb-5 flex w-full touch-manipulation items-center justify-center gap-2.5 rounded-xl border border-black/[.12] bg-black/[.03] p-3 text-sm font-semibold text-black transition-all! duration-200! hover:-translate-y-0.5 hover:border-black/[.22] hover:bg-black/[.06] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:border-white/[.12] dark:bg-white/[.04] dark:text-white dark:hover:border-white/[.22] dark:hover:bg-white/[.08]"
          >
            {googlePending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                Yönlendiriliyor...
              </>
            ) : (
              <>
                <GoogleIcon className="h-4.5 w-4.5" />
                Google ile devam et
              </>
            )}
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.08]" />
            veya e-posta ile
            <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.08]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
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

            <div className="mb-1">
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
                  autoComplete="current-password"
                  placeholder="••••••••"
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

            <div className="mt-1 mb-5.5 flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <input type="checkbox" name="remember" className="accent-violet-500" />
                Beni hatırla
              </label>
              <Link
                href="/sifremi-unuttum"
                className="font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                Şifremi unuttum
              </Link>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isBusy}
              className="flex w-full touch-manipulation items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 p-3.25 text-[14.5px] font-bold text-white shadow-[0_10px_26px_rgba(99,102,241,0.4)] transition-all! duration-200! hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(99,102,241,0.55)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
