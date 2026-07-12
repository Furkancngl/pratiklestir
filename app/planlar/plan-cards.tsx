"use client";

import { useState, useTransition } from "react";
import { selectPlan } from "@/app/actions/plan";

type RowIcon = "bolt" | "clock" | "grid" | "batch" | "support";

type Row = {
  icon: RowIcon;
  label: string;
  value: string | "check" | "dash";
};

const freeRows: Row[] = [
  { icon: "bolt", label: "Günlük Kredi", value: "30" },
  { icon: "clock", label: "İşlem Önceliği", value: "Normal" },
  { icon: "grid", label: "Aynı Anda Dosya", value: "1" },
  { icon: "batch", label: "Toplu İşlem", value: "dash" },
  { icon: "support", label: "Öncelikli Destek", value: "dash" },
];

const proRows: Row[] = [
  { icon: "bolt", label: "Günlük Kredi", value: "200" },
  { icon: "clock", label: "İşlem Önceliği", value: "Hızlı" },
  { icon: "grid", label: "Aynı Anda Dosya", value: "10" },
  { icon: "batch", label: "Toplu İşlem", value: "check" },
  { icon: "support", label: "Öncelikli Destek", value: "check" },
];

function RowIconGlyph({ icon, className }: { icon: RowIcon; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (icon) {
    case "bolt":
      return (
        <svg {...shared}>
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case "grid":
      return (
        <svg {...shared}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "batch":
      return (
        <svg {...shared}>
          <rect x="3" y="7" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "support":
      return (
        <svg {...shared}>
          <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
        </svg>
      );
  }
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RowValue({ value, proAccent }: { value: Row["value"]; proAccent: boolean }) {
  if (value === "check") {
    return <CheckGlyph className="h-4 w-4 text-green-500 dark:text-green-400" />;
  }
  if (value === "dash") {
    return <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600">—</span>;
  }
  return (
    <span
      className={`text-sm font-bold ${
        proAccent ? "text-purple-600 dark:text-purple-300" : "text-black dark:text-white"
      }`}
    >
      {value}
    </span>
  );
}

function PlanRows({ rows, proAccent }: { rows: Row[]; proAccent: boolean }) {
  return (
    <div className="mb-6 flex flex-col">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex items-center justify-between py-3.25 ${
            index < rows.length - 1 ? "border-b border-black/[.06] dark:border-white/[.06]" : ""
          }`}
        >
          <div className="flex items-center gap-2.25 text-[13.5px] text-zinc-700 dark:text-zinc-300">
            <RowIconGlyph
              icon={row.icon}
              className={`h-3.75 w-3.75 shrink-0 ${
                proAccent ? "text-purple-400" : "text-zinc-400 dark:text-zinc-500"
              }`}
            />
            {row.label}
          </div>
          <RowValue value={row.value} proAccent={proAccent} />
        </div>
      ))}
    </div>
  );
}

export default function PlanCards() {
  const [pendingPlan, setPendingPlan] = useState<"free" | "pro" | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSelect = (plan: "free" | "pro") => {
    setError("");
    setPendingPlan(plan);
    startTransition(async () => {
      // Başarılıysa selectPlan içindeki redirect() zaten yönlendiriyor;
      // buraya sadece hata durumunda dönüyoruz.
      const result = await selectPlan(plan);
      if (result?.error) {
        setError(result.error);
        setPendingPlan(null);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Free */}
        <div className="relative flex-1 rounded-[22px] border border-black/[.08] bg-white p-7 dark:border-white/[.08] dark:bg-white/[.03]">
          <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            Free
          </p>
          <p className="mb-0.5 text-[30px] font-extrabold tracking-tight text-black dark:text-white">
            ₺0{" "}
            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-500">
              /ay
            </span>
          </p>
          <p className="mb-6 text-[12.5px] text-zinc-500 dark:text-zinc-500">
            Başlamak için gereken her şey
          </p>

          <PlanRows rows={freeRows} proAccent={false} />

          <button
            type="button"
            onClick={() => handleSelect("free")}
            disabled={isPending}
            className="w-full touch-manipulation rounded-xl bg-black/[.06] p-3 text-[13.5px] font-bold text-black transition-opacity! duration-200! hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/[.08] dark:text-white"
          >
            {isPending && pendingPlan === "free" ? "Kaydediliyor..." : "Seç"}
          </button>
        </div>

        {/* Pro */}
        <div className="relative flex-1 overflow-hidden rounded-[22px] border border-purple-400/35 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.14),transparent_60%)] bg-white p-7 dark:bg-white/[.03]">
          <span className="absolute top-4.5 right-4.5 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-2.75 py-1 text-[10.5px] font-bold text-white">
            EN POPÜLER
          </span>

          <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-violet-500 dark:text-violet-300">
            Pro
          </p>
          <p className="mb-0.5 text-[30px] font-extrabold tracking-tight text-black dark:text-white">
            ₺170{" "}
            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-500">
              /ay
            </span>
          </p>
          <p className="mb-6 text-[12.5px] text-zinc-500 dark:text-zinc-500">
            Daha fazla üreten kullanıcılar için
          </p>

          <PlanRows rows={proRows} proAccent={true} />

          <button
            type="button"
            onClick={() => handleSelect("pro")}
            disabled={isPending}
            className="w-full touch-manipulation rounded-xl bg-linear-to-r from-purple-500 to-indigo-500 p-3 text-[13.5px] font-bold text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)] transition-transform! duration-200! hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending && pendingPlan === "pro" ? "Kaydediliyor..." : "Seç"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-5 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
