"use client";

import { useEffect, useMemo, useState } from "react";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/doviz-hesapla")?.accentClassName ??
  "bg-pink-500";

const CURRENCIES = [
  { code: "TRY", label: "Türk Lirası" },
  { code: "USD", label: "Amerikan Doları" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "İngiliz Sterlini" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// exchangerate-api.com'un ücretsiz, kayıt gerektirmeyen "open access"
// ucu: günde bir güncellenen USD bazlı kurları döndürür, CORS'a açıktır.
const RATES_URL = "https://open.er-api.com/v6/latest/USD";

type RatesState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; rates: Record<string, number>; lastUpdate: string };

function formatCurrency(value: number, code: CurrencyCode): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DovizHesaplaPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("TRY");
  const [state, setState] = useState<RatesState>({ status: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(RATES_URL)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.result !== "success" || !data.rates) throw new Error("bad response");
        setState({
          status: "ready",
          rates: data.rates,
          lastUpdate: data.time_last_update_utc,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const result = useMemo(() => {
    if (state.status !== "ready") return null;
    const value = Number(amount.replace(",", "."));
    if (!amount || !Number.isFinite(value) || value < 0) return null;

    const fromRate = state.rates[from];
    const toRate = state.rates[to];
    if (!fromRate || !toRate) return null;

    const amountInUsd = value / fromRate;
    return amountInUsd * toRate;
  }, [state, amount, from, to]);

  const unitRate = useMemo(() => {
    if (state.status !== "ready") return null;
    const fromRate = state.rates[from];
    const toRate = state.rates[to];
    if (!fromRate || !toRate) return null;
    return (1 / fromRate) * toRate;
  }, [state, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Döviz Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Güncel kurlarla TL, dolar ve euro arasında anında çevir.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <label htmlFor="doviz-amount" className="block text-sm font-medium text-black dark:text-zinc-50">
            Tutar
          </label>
          <input
            id="doviz-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Örn. 100"
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
          />

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div>
              <label htmlFor="from" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Kaynak
              </label>
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value as CurrencyCode)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swap}
              aria-label="Para birimlerini yer değiştir"
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[.08] text-zinc-500 transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M7 10 3 6l4-4" />
                <path d="M3 6h13a4 4 0 0 1 4 4" />
                <path d="M17 14l4 4-4 4" />
                <path d="M21 18H8a4 4 0 0 1-4-4" />
              </svg>
            </button>

            <div>
              <label htmlFor="to" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Hedef
              </label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value as CurrencyCode)}
                className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.status === "loading" && (
            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Güncel kurlar yükleniyor...
            </p>
          )}

          {state.status === "error" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                Kur bilgisi alınamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.
              </p>
              <button
                type="button"
                onClick={() => {
                  setState({ status: "loading" });
                  setRefreshKey((k) => k + 1);
                }}
                className="mt-3 rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {state.status === "ready" && result !== null && (
            <div className="mt-6 rounded-xl border border-black/[.08] bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-3xl font-bold text-black dark:text-zinc-50">
                {formatCurrency(result, to)}
              </p>
              {unitRate !== null && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  1 {from} = {unitRate.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} {to}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {state.status === "ready"
            ? `Kurlar exchangerate-api.com kaynağından alınır, son güncelleme: ${new Date(state.lastUpdate).toLocaleString("tr-TR")}.`
            : "Kurlar exchangerate-api.com kaynağından tarayıcınızda alınır, günde bir kez güncellenir."}
        </p>
      </div>
    </div>
  );
}
