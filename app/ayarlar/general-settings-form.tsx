"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PlanBadge from "@/app/components/plan-badge";

const PLAN_INFO: Record<string, { label: string; desc: string }> = {
  free: { label: "Ücretsiz Plan", desc: "Temel araçlara sınırlı erişim." },
  pro: { label: "Pro Plan", desc: "Tüm araçlara sınırsız erişim." },
  ultra: { label: "Ultra Plan", desc: "Öncelikli destek ve gelişmiş özellikler." },
};

const inputClass =
  "w-full max-w-[360px] rounded-[10px] border border-black/[.12] bg-black/[.02] px-3.5 py-2.5 text-sm text-black outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.12] dark:bg-white/[.04] dark:text-white";

export default function GeneralSettingsForm({
  name,
  email,
  plan,
  memberSinceLabel,
}: {
  name: string | null;
  email: string;
  plan: string;
  memberSinceLabel: string;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [nameValue, setNameValue] = useState(name ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const initial = (name || email).charAt(0).toUpperCase();
  const planInfo = PLAN_INFO[plan] ?? { label: plan, desc: "" };
  const isDirty = nameValue.trim() !== (name ?? "") && nameValue.trim().length > 0;

  async function handleSave() {
    setPending(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameValue.trim() }),
    });

    setPending(false);

    if (!res.ok) {
      setError("Kaydedilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setSaved(true);
    await update({ name: nameValue.trim() });
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Genel
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        Profil bilgilerini ve tercihlerini yönet.
      </p>

      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-2xl font-semibold text-white">
          {initial}
        </span>
        <div>
          <p className="text-sm font-semibold text-black dark:text-zinc-50">
            {name || email}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{email}</p>
        </div>
      </div>

      <div className="mb-6.5">
        <label
          htmlFor="fullName"
          className="mb-2 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Ad Soyad
        </label>
        <input
          id="fullName"
          type="text"
          value={nameValue}
          onChange={(e) => {
            setNameValue(e.target.value);
            setSaved(false);
          }}
          placeholder="Adın Soyadın"
          className={inputClass}
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saved && !error && (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Kaydedildi.</p>
        )}
        {isDirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="mt-3 touch-manipulation rounded-[10px] bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-[13.5px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        )}
      </div>

      <div className="mb-6.5">
        <label
          htmlFor="email"
          className="mb-2 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className={inputClass}
        />
      </div>

      <div className="mb-8">
        <label
          htmlFor="language"
          className="mb-2 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400"
        >
          Dil
        </label>
        <select id="language" defaultValue="tr" className={inputClass}>
          <option value="tr">Türkçe</option>
          <option value="en" disabled>
            English (yakında)
          </option>
        </select>
      </div>

      <div className="mb-6.5">
        <p className="mb-2 text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">
          Mevcut Plan
        </p>
        <div className="flex max-w-[460px] items-center justify-between gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/[.06] p-5">
          <div>
            <div className="mb-1.5">
              <PlanBadge plan={plan} />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{planInfo.desc}</p>
          </div>
          <button
            type="button"
            disabled
            title="Plan & Faturalama yakında"
            className="shrink-0 touch-manipulation rounded-[9px] bg-linear-to-r from-violet-500 to-indigo-500 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Yükselt
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1 text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">
          Üyelik Tarihi
        </p>
        <p className="text-sm text-black dark:text-zinc-50">{memberSinceLabel}</p>
      </div>
    </div>
  );
}
