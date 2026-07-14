"use client";

import { useTheme, type ThemePreference } from "@/app/context/theme-context";

const OPTIONS: { value: ThemePreference; label: string; emoji: string; desc: string }[] = [
  { value: "light", label: "Açık", emoji: "☀️", desc: "Her zaman açık tema" },
  { value: "dark", label: "Koyu", emoji: "🌙", desc: "Her zaman koyu tema" },
  {
    value: "system",
    label: "Sistem",
    emoji: "🖥️",
    desc: "Cihazının temasını otomatik takip eder",
  },
];

export default function ThemeSettings() {
  const { preference, setPreference } = useTheme();

  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        Görünüm
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        Tema tercihini seç. Seçimin bu tarayıcıda kalıcı olarak hatırlanır.
      </p>

      <div className="grid max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const isActive = preference === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              aria-pressed={isActive}
              className={`touch-manipulation rounded-2xl border p-5 text-left transition-colors ${
                isActive
                  ? "border-violet-500/40 bg-violet-500/[.06] dark:border-violet-400/40"
                  : "border-black/[.08] hover:bg-black/[.02] dark:border-white/[.08] dark:hover:bg-white/[.03]"
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <p className="mt-3 text-[13.5px] font-semibold text-black dark:text-zinc-50">
                {option.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {option.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
