"use client";

import { useState } from "react";

type Period = "week" | "month";

type RecentItem = {
  tool: string;
  date: string;
  status: "Tamamlandı" | "İşleniyor";
};

const STATS: Record<Period, { total: number; topTool: string }> = {
  week: { total: 12, topTool: "QR Kod Oluşturucu" },
  month: { total: 47, topTool: "Görsel Sıkıştırıcı" },
};

const RECENT_ITEMS: Record<Period, RecentItem[]> = {
  week: [
    { tool: "QR Kod Oluşturucu", date: "10 Tem 2026", status: "Tamamlandı" },
    { tool: "PDF Birleştirici", date: "9 Tem 2026", status: "Tamamlandı" },
    { tool: "Arka Plan Silici", date: "7 Tem 2026", status: "Tamamlandı" },
  ],
  month: [
    { tool: "Görsel Sıkıştırıcı", date: "10 Tem 2026", status: "Tamamlandı" },
    { tool: "QR Kod Oluşturucu", date: "5 Tem 2026", status: "Tamamlandı" },
    { tool: "PDF Sıkıştırıcı", date: "28 Haz 2026", status: "Tamamlandı" },
    { tool: "PDF Birleştirici", date: "22 Haz 2026", status: "Tamamlandı" },
  ],
};

export default function DashboardCard() {
  const [period, setPeriod] = useState<Period>("week");
  const stats = STATS[period];
  const recentItems = RECENT_ITEMS[period];

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-black/[.08] bg-white p-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Özet
        </h2>
        <div className="flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {(
            [
              { key: "week", label: "Son Hafta" },
              { key: "month", label: "Son Ay" },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setPeriod(option.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                period === option.key
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-xl border border-black/[.08] bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Toplam İşlem
          </p>
          <p className="mt-1 text-2xl font-bold text-black dark:text-zinc-50">
            {stats.total}
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-black/[.08] bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            En Çok Kullanılan Araç
          </p>
          <p className="mt-1 truncate text-2xl font-bold text-black dark:text-zinc-50">
            {stats.topTool}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Son İşlemler
        </p>
        <div className="flex flex-col divide-y divide-black/[.06] rounded-xl border border-black/[.08] dark:divide-white/10 dark:border-white/10">
          {recentItems.map((item, index) => (
            <div
              key={`${item.tool}-${index}`}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                  {item.tool}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.date}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
