import Link from "next/link";
import type { ComponentType } from "react";

type AnimatedCardProps = {
  title: string;
  description: string;
  accentClassName: string;
  href?: string;
  badge?: string;
  beta?: boolean;
  icon: ComponentType<{ className?: string }>;
};

const strokeClassNames: Record<string, string> = {
  "bg-blue-500": "stroke-blue-500",
  "bg-orange-500": "stroke-orange-500",
  "bg-green-500": "stroke-green-500",
  "bg-purple-500": "stroke-purple-500",
  "bg-red-500": "stroke-red-500",
  "bg-cyan-500": "stroke-cyan-500",
  "bg-yellow-500": "stroke-yellow-500",
  "bg-teal-500": "stroke-teal-500",
  "bg-indigo-600": "stroke-indigo-600",
  "bg-lime-500": "stroke-lime-500",
  "bg-amber-500": "stroke-amber-500",
  "bg-rose-500": "stroke-rose-500",
  "bg-sky-500": "stroke-sky-500",
  "bg-fuchsia-500": "stroke-fuchsia-500",
  "bg-emerald-500": "stroke-emerald-500",
  "bg-violet-500": "stroke-violet-500",
  "bg-pink-500": "stroke-pink-500",
};

const iconStyleClassNames: Record<string, { bg: string; icon: string }> = {
  "bg-blue-500": { bg: "bg-blue-500/15 dark:bg-blue-500/20", icon: "text-blue-600 dark:text-blue-300" },
  "bg-orange-500": { bg: "bg-orange-500/15 dark:bg-orange-500/20", icon: "text-orange-600 dark:text-orange-300" },
  "bg-green-500": { bg: "bg-green-500/15 dark:bg-green-500/20", icon: "text-green-600 dark:text-green-300" },
  "bg-purple-500": { bg: "bg-purple-500/15 dark:bg-purple-500/20", icon: "text-purple-600 dark:text-purple-300" },
  "bg-red-500": { bg: "bg-red-500/15 dark:bg-red-500/20", icon: "text-red-600 dark:text-red-300" },
  "bg-cyan-500": { bg: "bg-cyan-500/15 dark:bg-cyan-500/20", icon: "text-cyan-600 dark:text-cyan-300" },
  "bg-yellow-500": { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", icon: "text-yellow-600 dark:text-yellow-300" },
  "bg-teal-500": { bg: "bg-teal-500/15 dark:bg-teal-500/20", icon: "text-teal-600 dark:text-teal-300" },
  "bg-indigo-600": { bg: "bg-indigo-500/15 dark:bg-indigo-500/20", icon: "text-indigo-600 dark:text-indigo-300" },
  "bg-lime-500": { bg: "bg-lime-500/15 dark:bg-lime-500/20", icon: "text-lime-600 dark:text-lime-300" },
  "bg-amber-500": { bg: "bg-amber-500/15 dark:bg-amber-500/20", icon: "text-amber-600 dark:text-amber-300" },
  "bg-rose-500": { bg: "bg-rose-500/15 dark:bg-rose-500/20", icon: "text-rose-600 dark:text-rose-300" },
  "bg-sky-500": { bg: "bg-sky-500/15 dark:bg-sky-500/20", icon: "text-sky-600 dark:text-sky-300" },
  "bg-fuchsia-500": { bg: "bg-fuchsia-500/15 dark:bg-fuchsia-500/20", icon: "text-fuchsia-600 dark:text-fuchsia-300" },
  "bg-emerald-500": { bg: "bg-emerald-500/15 dark:bg-emerald-500/20", icon: "text-emerald-600 dark:text-emerald-300" },
  "bg-violet-500": { bg: "bg-violet-500/15 dark:bg-violet-500/20", icon: "text-violet-600 dark:text-violet-300" },
  "bg-pink-500": { bg: "bg-pink-500/15 dark:bg-pink-500/20", icon: "text-pink-600 dark:text-pink-300" },
};

export default function AnimatedCard({
  title,
  description,
  accentClassName,
  href,
  badge,
  beta,
  icon: Icon,
}: AnimatedCardProps) {
  const disabled = !href;

  const strokeClassName =
    strokeClassNames[accentClassName] ?? "stroke-black/50 dark:stroke-white/80";
  const iconStyle =
    iconStyleClassNames[accentClassName] ??
    ({ bg: "bg-zinc-500/15 dark:bg-zinc-500/20", icon: "text-zinc-600 dark:text-zinc-300" } as const);

  const titleColor = disabled
    ? "text-zinc-400 dark:text-zinc-600"
    : "text-black dark:text-zinc-50";
  const descriptionColor = disabled
    ? "text-zinc-400 dark:text-zinc-600"
    : "text-zinc-600 dark:text-zinc-400";
  const iconWrapClassName = disabled
    ? "bg-zinc-100 dark:bg-zinc-800/60"
    : iconStyle.bg;
  const iconColorClassName = disabled
    ? "text-zinc-400 dark:text-zinc-600"
    : iconStyle.icon;

  const content = (
    <>
      {/* Renkli üst çizgi */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${accentClassName}`}
      />

      {/* Hover'da saat yönünde çizilen kenarlık */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx="16"
          pathLength={100}
          strokeWidth={1.5}
          className={`fill-none ${strokeClassName} [stroke-dasharray:100] [stroke-dashoffset:100] transition-[stroke-dashoffset]! duration-700! ease-in-out! group-hover:[stroke-dashoffset:0]`}
        />
      </svg>

      <div className="relative flex flex-col items-center gap-3 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${iconWrapClassName}`}
        >
          <Icon className={`h-6 w-6 ${iconColorClassName}`} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className={`font-semibold ${titleColor}`}>
            {title}
            {!disabled && " →"}
          </span>
          {badge && (
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {badge}
            </span>
          )}
          {beta && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Beta
            </span>
          )}
        </div>

        <p className={`text-sm ${descriptionColor}`}>{description}</p>
      </div>
    </>
  );

  const baseClassName =
    "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-black/[.08] bg-white p-6 shadow-lg shadow-black/5 transition-all duration-300 ease-out dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40";

  if (disabled) {
    return (
      <div aria-disabled="true" className={`${baseClassName} cursor-not-allowed`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClassName} hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60`}
    >
      {content}
    </Link>
  );
}
