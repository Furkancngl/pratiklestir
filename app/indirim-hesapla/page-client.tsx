"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";
import { formatTL } from "../lib/number-format";

const accentClassName =
  tools.find((tool) => tool.href === "/indirim-hesapla")?.accentClassName ??
  "bg-indigo-600";

const inputClassName =
  "mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600";

export default function IndirimHesaplaPage() {
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState("");

  const result = useMemo(() => {
    const priceVal = Number(price.replace(",", "."));
    const percentVal = Number(percent.replace(",", "."));

    if (!price || !percent || !Number.isFinite(priceVal) || !Number.isFinite(percentVal)) {
      return null;
    }
    if (priceVal < 0 || percentVal < 0) return null;

    const savings = priceVal * (percentVal / 100);
    const finalPrice = priceVal - savings;

    return { savings, finalPrice };
  }, [price, percent]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            İndirim Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Fiyat ve indirim yüzdesini gir, indirimli fiyatı ve kazancını anında gör.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="text-sm font-medium text-black dark:text-zinc-50">
                Orijinal Fiyat (TL)
              </label>
              <input
                id="price"
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Örn. 500"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="percent" className="text-sm font-medium text-black dark:text-zinc-50">
                İndirim Oranı (%)
              </label>
              <input
                id="percent"
                type="text"
                inputMode="decimal"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="Örn. 25"
                className={inputClassName}
              />
            </div>
          </div>

          {result && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg font-bold text-black dark:text-zinc-50">
                  {formatTL(result.finalPrice)}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  İndirimli Fiyat
                </p>
              </div>
              <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatTL(result.savings)}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Kazancınız
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
