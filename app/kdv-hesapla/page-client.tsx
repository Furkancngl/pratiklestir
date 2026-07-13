"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";
import { formatTL } from "../lib/number-format";

const accentClassName =
  tools.find((tool) => tool.href === "/kdv-hesapla")?.accentClassName ??
  "bg-emerald-500";

const RATE_PRESETS = [1, 10, 20];

type Mode = "haric" | "dahil";

export default function KdvHesaplaPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number>(20);
  const [customRate, setCustomRate] = useState("");
  const [mode, setMode] = useState<Mode>("haric");

  const isCustomRate = !RATE_PRESETS.includes(rate);
  const effectiveRate = isCustomRate ? Number(customRate) || 0 : rate;

  const result = useMemo(() => {
    const value = Number(amount.replace(",", "."));
    if (!amount || !Number.isFinite(value) || value < 0) return null;

    const rateFraction = effectiveRate / 100;
    const base = mode === "haric" ? value : value / (1 + rateFraction);
    const vat = mode === "haric" ? value * rateFraction : value - base;
    const total = base + vat;

    return { base, vat, total };
  }, [amount, effectiveRate, mode]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            KDV Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tutarı ve KDV oranını gir, dahil/hariç tutarı anında gör.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
            {(
              [
                { key: "haric", label: "KDV Hariç Tutar" },
                { key: "dahil", label: "KDV Dahil Tutar" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMode(option.key)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  mode === option.key
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label
            htmlFor="amount"
            className="mt-6 block text-sm font-medium text-black dark:text-zinc-50"
          >
            Tutar (TL)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Örn. 1000"
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
          />

          <p className="mt-6 text-sm font-medium text-black dark:text-zinc-50">
            KDV Oranı
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {RATE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRate(preset)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  !isCustomRate && rate === preset
                    ? "border-transparent bg-foreground text-background"
                    : "border-black/[.08] text-zinc-700 hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                %{preset}
              </button>
            ))}
            <input
              type="text"
              inputMode="decimal"
              value={customRate}
              onChange={(e) => {
                setCustomRate(e.target.value);
                setRate(-1);
              }}
              placeholder="Özel"
              className={`rounded-lg border px-3 py-2.5 text-center text-sm outline-none ${
                isCustomRate
                  ? "border-black/30 text-black dark:border-zinc-500 dark:text-zinc-50"
                  : "border-black/[.08] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
              } bg-white dark:bg-zinc-950`}
            />
          </div>

          {result && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg font-bold text-black dark:text-zinc-50">
                  {formatTL(result.base)}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  KDV Hariç
                </p>
              </div>
              <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg font-bold text-black dark:text-zinc-50">
                  {formatTL(result.vat)}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  KDV Tutarı
                </p>
              </div>
              <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg font-bold text-black dark:text-zinc-50">
                  {formatTL(result.total)}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  KDV Dahil
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, girdiğiniz tutar hiçbir yere gönderilmez.
        </p>
      </div>
    </div>
  );
}
