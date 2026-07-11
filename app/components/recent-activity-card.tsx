"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toolIcons } from "./icons";

type ActivityItem = {
  tool: string;
  href: string;
  time: string;
  iconBg: string;
  iconColor: string;
};

const PLACEHOLDER_ACTIVITY: ActivityItem[] = [
  {
    tool: "QR Kod Oluşturucu",
    href: "/qr-kod",
    time: "Bugün, 14:22",
    iconBg: "bg-purple-500/15 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    tool: "Arka Plan Silici",
    href: "/arka-plan-sil",
    time: "Dün, 19:04",
    iconBg: "bg-pink-500/15 dark:bg-pink-500/20",
    iconColor: "text-pink-600 dark:text-pink-300",
  },
  {
    tool: "PDF Birleştirici",
    href: "/pdf-birlestir",
    time: "2 gün önce, 09:41",
    iconBg: "bg-indigo-500/15 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    tool: "Görsel Sıkıştırıcı",
    href: "/gorsel-sikistir",
    time: "3 gün önce, 16:10",
    iconBg: "bg-green-500/15 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-300",
  },
];

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

      <div className="relative flex items-center justify-between gap-2 border-b border-black/[.06] pb-3.5 dark:border-white/10">
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

      <div className="relative pt-3.5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Son İşlemler
        </p>

        {PLACEHOLDER_ACTIVITY.length === 0 ? (
          <div className="px-2 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Henüz işlem geçmişiniz yok, bir araç kullanmaya başlayın!
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {PLACEHOLDER_ACTIVITY.map((item) => {
              const Icon = toolIcons[item.href];
              return (
                <Link
                  key={item.tool}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-[background-color,transform]! duration-200! hover:translate-x-0.5 hover:bg-purple-500/[.06]"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${item.iconBg}`}
                  >
                    {Icon && <Icon className={`h-4 w-4 ${item.iconColor}`} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-black dark:text-zinc-50">
                      {item.tool}
                    </span>
                    <span className="block text-[10px] text-zinc-500 dark:text-zinc-500">
                      {item.time}
                    </span>
                  </span>
                  <span className="shrink-0 text-zinc-400 transition-[transform,color]! duration-200! group-hover:translate-x-0.5 group-hover:text-purple-500 dark:text-zinc-600">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
