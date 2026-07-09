"use client";

import Link from "next/link";

type AnimatedCardProps = {
  title: string;
  description: string;
  accentClassName: string;
  href?: string;
  badge?: string;
  beta?: boolean;
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
};

export default function AnimatedCard({
  title,
  description,
  accentClassName,
  href,
  badge,
  beta,
}: AnimatedCardProps) {
  const disabled = !href;

  const strokeClassName =
    strokeClassNames[accentClassName] ?? "stroke-black/50 dark:stroke-white/80";

  const titleColor = disabled
    ? "text-zinc-400 dark:text-zinc-600"
    : "text-black dark:text-zinc-50";
  const descriptionColor = disabled
    ? "text-zinc-400 dark:text-zinc-600"
    : "text-zinc-600 dark:text-zinc-400";

  const content = (
    <>
      {/* Mevcut renkli üst çizgi */}
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

      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between">
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
    "group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-black/[.08] bg-white p-6 transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-950";

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
      className={`${baseClassName} hover:-translate-y-1 hover:shadow-md`}
    >
      {content}
    </Link>
  );
}
