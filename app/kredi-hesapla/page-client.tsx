"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";
import { formatTL } from "../lib/number-format";

const accentClassName =
  tools.find((tool) => tool.href === "/kredi-hesapla")?.accentClassName ??
  "bg-yellow-500";

const inputClassName =
  "mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600";

type Row = {
  month: number;
  installment: number;
  principalPaid: number;
  interestPaid: number;
  remaining: number;
};

export default function KrediHesaplaPage() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(() => {
    const principal = Number(amount.replace(",", "."));
    const n = Number(months);
    const rate = Number(monthlyRate.replace(",", ".")) / 100;

    if (!principal || !n || principal <= 0 || n <= 0 || !Number.isFinite(rate) || rate < 0) {
      return null;
    }

    const installment =
      rate === 0
        ? principal / n
        : (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);

    const rows: Row[] = [];
    let remaining = principal;
    for (let month = 1; month <= n; month++) {
      const interestPaid = remaining * rate;
      const principalPaid = installment - interestPaid;
      remaining = Math.max(0, remaining - principalPaid);
      rows.push({ month, installment, principalPaid, interestPaid, remaining });
    }

    const totalPayment = installment * n;
    const totalInterest = totalPayment - principal;

    return { installment, totalPayment, totalInterest, rows };
  }, [amount, months, monthlyRate]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Kredi Hesapla
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Kredi tutarı, vade ve faiz oranını gir, aylık taksiti anında hesapla.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="amount" className="text-sm font-medium text-black dark:text-zinc-50">
                Kredi Tutarı (TL)
              </label>
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Örn. 100000"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="months" className="text-sm font-medium text-black dark:text-zinc-50">
                Vade (ay)
              </label>
              <input
                id="months"
                type="text"
                inputMode="numeric"
                value={months}
                onChange={(e) => setMonths(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Örn. 24"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="rate" className="text-sm font-medium text-black dark:text-zinc-50">
                Aylık Faiz (%)
              </label>
              <input
                id="rate"
                type="text"
                inputMode="decimal"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                placeholder="Örn. 3.5"
                className={inputClassName}
              />
            </div>
          </div>

          {result && (
            <>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-lg font-bold text-black dark:text-zinc-50">
                    {formatTL(result.installment)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Aylık Taksit
                  </p>
                </div>
                <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-lg font-bold text-black dark:text-zinc-50">
                    {formatTL(result.totalPayment)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Toplam Geri Ödeme
                  </p>
                </div>
                <div className="rounded-xl border border-black/[.08] bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-lg font-bold text-black dark:text-zinc-50">
                    {formatTL(result.totalInterest)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Toplam Faiz
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSchedule((v) => !v)}
                className="mt-4 text-sm font-medium text-black underline-offset-2 hover:underline dark:text-zinc-50"
              >
                {showSchedule ? "Ödeme planını gizle" : "Ödeme planını göster"}
              </button>

              {showSchedule && (
                <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-black/[.08] dark:border-zinc-800">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                      <tr>
                        <th className="px-3 py-2 font-medium">Ay</th>
                        <th className="px-3 py-2 font-medium">Taksit</th>
                        <th className="px-3 py-2 font-medium">Anapara</th>
                        <th className="px-3 py-2 font-medium">Faiz</th>
                        <th className="px-3 py-2 font-medium">Kalan Bakiye</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[.06] dark:divide-white/10">
                      {result.rows.map((row) => (
                        <tr key={row.month} className="text-zinc-700 dark:text-zinc-300">
                          <td className="px-3 py-2">{row.month}</td>
                          <td className="px-3 py-2">{formatTL(row.installment)}</td>
                          <td className="px-3 py-2">{formatTL(row.principalPaid)}</td>
                          <td className="px-3 py-2">{formatTL(row.interestPaid)}</td>
                          <td className="px-3 py-2">{formatTL(row.remaining)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, girdiğiniz bilgiler hiçbir yere gönderilmez. Sonuçlar tahminidir, bankanızın resmi teklifiyle farklılık gösterebilir.
        </p>
      </div>
    </div>
  );
}
