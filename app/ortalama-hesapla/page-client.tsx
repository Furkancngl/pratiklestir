"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";
import { formatNumber } from "../lib/number-format";
import { XIcon } from "../components/icons";

const accentClassName =
  tools.find((tool) => tool.href === "/ortalama-hesapla")?.accentClassName ??
  "bg-teal-500";

const rowInputClassName =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600";

type Mode = "simple" | "weighted";
type WeightedRow = { id: string; value: string; weight: string };

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `row-${idCounter}`;
}

export default function OrtalamaHesaplaPage() {
  const [mode, setMode] = useState<Mode>("simple");
  const [numbers, setNumbers] = useState<{ id: string; value: string }[]>([
    { id: nextId(), value: "" },
    { id: nextId(), value: "" },
  ]);
  const [weightedRows, setWeightedRows] = useState<WeightedRow[]>([
    { id: nextId(), value: "", weight: "" },
    { id: nextId(), value: "", weight: "" },
  ]);

  const simpleResult = useMemo(() => {
    const values = numbers
      .map((n) => Number(n.value.replace(",", ".")))
      .filter((n, i) => numbers[i].value !== "" && Number.isFinite(n));
    if (values.length === 0) return null;
    const sum = values.reduce((acc, n) => acc + n, 0);
    return { average: sum / values.length, count: values.length };
  }, [numbers]);

  const weightedResult = useMemo(() => {
    let weightedSum = 0;
    let weightSum = 0;
    let count = 0;
    for (const row of weightedRows) {
      const value = Number(row.value.replace(",", "."));
      const weight = Number(row.weight.replace(",", "."));
      if (row.value === "" || row.weight === "" || !Number.isFinite(value) || !Number.isFinite(weight)) {
        continue;
      }
      weightedSum += value * weight;
      weightSum += weight;
      count += 1;
    }
    if (count === 0 || weightSum === 0) return null;
    return { average: weightedSum / weightSum, count };
  }, [weightedRows]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Ortalama Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sayıları ekle, basit veya ağırlıklı ortalamayı anında hesapla.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
            {(
              [
                { key: "simple", label: "Basit Ortalama" },
                { key: "weighted", label: "Ağırlıklı Ortalama" },
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

          {mode === "simple" ? (
            <div className="mt-6 flex flex-col gap-2">
              {numbers.map((row, index) => (
                <div key={row.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={row.value}
                    onChange={(e) =>
                      setNumbers((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r))
                      )
                    }
                    placeholder={`${index + 1}. sayı`}
                    className={rowInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setNumbers((prev) => prev.filter((r) => r.id !== row.id))}
                    disabled={numbers.length <= 1}
                    aria-label="Sayıyı kaldır"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-black/[.04] hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNumbers((prev) => [...prev, { id: nextId(), value: "" }])}
                className="mt-1 self-start text-sm font-medium text-black underline-offset-2 hover:underline dark:text-zinc-50"
              >
                + Sayı ekle
              </button>

              {simpleResult && (
                <div className="mt-4 rounded-xl border border-black/[.08] bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-3xl font-bold text-black dark:text-zinc-50">
                    {formatNumber(simpleResult.average)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {simpleResult.count} sayının ortalaması
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-2">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <span>Değer</span>
                <span>Ağırlık</span>
                <span />
              </div>
              {weightedRows.map((row, index) => (
                <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={row.value}
                    onChange={(e) =>
                      setWeightedRows((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r))
                      )
                    }
                    placeholder={`${index + 1}. değer`}
                    className={rowInputClassName}
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    value={row.weight}
                    onChange={(e) =>
                      setWeightedRows((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, weight: e.target.value } : r))
                      )
                    }
                    placeholder="Ağırlık"
                    className={rowInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setWeightedRows((prev) => prev.filter((r) => r.id !== row.id))}
                    disabled={weightedRows.length <= 1}
                    aria-label="Satırı kaldır"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-black/[.04] hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setWeightedRows((prev) => [...prev, { id: nextId(), value: "", weight: "" }])
                }
                className="mt-1 self-start text-sm font-medium text-black underline-offset-2 hover:underline dark:text-zinc-50"
              >
                + Satır ekle
              </button>

              {weightedResult && (
                <div className="mt-4 rounded-xl border border-black/[.08] bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-3xl font-bold text-black dark:text-zinc-50">
                    {formatNumber(weightedResult.average)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {weightedResult.count} değerin ağırlıklı ortalaması
                  </p>
                </div>
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
