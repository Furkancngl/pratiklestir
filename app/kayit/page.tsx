"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";

export default function KayitPage() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-sm rounded-lg border border-black/[.08] bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Kayıt Ol
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ücretsiz hesabını oluştur.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-md border border-black/[.08] bg-white px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-md border border-black/[.08] bg-white px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-white/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Şifre (tekrar)
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-md border border-black/[.08] bg-white px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-white/20"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {pending ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="font-medium text-black hover:underline dark:text-zinc-50"
          >
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
