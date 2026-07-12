"use client";

import { useEffect, useState } from "react";

const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function RecentActivityCard() {
  const [location, setLocation] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://ipwho.is/", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.city && data.country) {
          setLocation(`${data.city}, ${data.country}`);
        }
      })
      .catch(() => {
        // Konum alınamazsa sessizce gizli kalır.
      });

    return () => controller.abort();
  }, []);

  const clock = now
    ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : null;
  const dateStr = now ? `${now.getDate()} ${AYLAR[now.getMonth()]}` : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[.08] bg-white p-4 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-500/20"
      />

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-200">
          {location && (
            <>
              <span
                aria-hidden="true"
                className="h-[6px] w-[6px] shrink-0 animate-pulse rounded-full bg-green-400 shadow-[0_0_8px_theme(colors.green.400)]"
              />
              <span className="truncate">{location}</span>
            </>
          )}
        </div>
        {clock && dateStr && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              {dateStr}
            </span>
            <span className="text-xs text-zinc-300 dark:text-zinc-700">·</span>
            <span className="rounded-md border border-purple-400/25 bg-linear-to-r from-purple-500/15 to-indigo-500/10 px-2.5 py-1 text-[13px] font-extrabold tabular-nums text-black dark:text-white">
              {clock}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
