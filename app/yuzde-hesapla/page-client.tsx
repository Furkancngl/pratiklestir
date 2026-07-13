"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";
import { formatNumber } from "../lib/number-format";

const accentClassName =
  tools.find((tool) => tool.href === "/yuzde-hesapla")?.accentClassName ??
  "bg-violet-500";

type Mode = "of" | "ratio" | "change";

const MODES: { key: Mode; label: string }[] = [
  { key: "of", label: "X'in %Y'si" },
  { key: "ratio", label: "X, Y'nin yüzde kaçı" },
  { key: "change", label: "Yüzde artış/azalış" },
];

const inputClassName =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600";

function parse(value: string): number | null {
  const num = Number(value.replace(",", "."));
  return value !== "" && Number.isFinite(num) ? num : null;
}

export default function YuzdeHesaplaPage() {
  const [mode, setMode] = useState<Mode>("of");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const result = useMemo(() => {
    const xVal = parse(x);
    const yVal = parse(y);
    if (xVal === null || yVal === null) return null;

    if (mode === "of") {
      return {
        label: `${formatNumber(xVal)} sayısının %${formatNumber(yVal)}'si`,
        value: (xVal * yVal) / 100,
        suffix: "",
        diff: undefined as number | undefined,
      };
    }

    if (mode === "ratio") {
      if (yVal === 0) return null;
      return {
        label: `${formatNumber(xVal)}, ${formatNumber(yVal)} sayısının`,
        value: (xVal / yVal) * 100,
        suffix: "%",
        diff: undefined as number | undefined,
      };
    }

    const diff = xVal * (yVal / 100);
    return {
      label: `${formatNumber(xVal)}, %${formatNumber(Math.abs(yVal))} ${yVal >= 0 ? "artınca" : "azalınca"}`,
      value: xVal + diff,
      suffix: "",
      diff: diff as number | undefined,
    };
  }, [mode, x, y]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Yüzde Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            En yaygın yüzde hesaplamalarını seç, sayıları gir, sonucu anında gör.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid grid-cols-1 gap-1 rounded-full bg-zinc-100 p-1 sm:grid-cols-3 dark:bg-zinc-900">
            {MODES.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMode(option.key)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  mode === option.key
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="x" className="block text-sm font-medium text-black dark:text-zinc-50">
                {mode === "change" ? "Başlangıç sayısı" : "X"}
              </label>
              <input
                id="x"
                type="text"
                inputMode="decimal"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="Örn. 200"
                className={`mt-2 ${inputClassName}`}
              />
            </div>
            <div>
              <label htmlFor="y" className="block text-sm font-medium text-black dark:text-zinc-50">
                {mode === "of" && "Y (%)"}
                {mode === "ratio" && "Y"}
                {mode === "change" && "Değişim (%, azalış için -)"}
              </label>
              <input
                id="y"
                type="text"
                inputMode="decimal"
                value={y}
                onChange={(e) => setY(e.target.value)}
                placeholder="Örn. 15"
                className={`mt-2 ${inputClassName}`}
              />
            </div>
          </div>

          {result && (
            <div className="mt-6 rounded-xl border border-black/[.08] bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {result.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-black dark:text-zinc-50">
                {formatNumber(result.value)}
                {result.suffix}
              </p>
              {result.diff !== undefined && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Fark: {result.diff >= 0 ? "+" : ""}
                  {formatNumber(result.diff)}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, girdiğiniz sayılar hiçbir yere gönderilmez.
        </p>
      </div>
    </div>
  );
}
