const PLAN_STYLES: Record<string, { label: string; className: string }> = {
  free: {
    label: "Free",
    className:
      "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
  pro: {
    label: "Pro",
    className:
      "bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/25",
  },
  ultra: {
    label: "Ultra",
    className:
      "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25",
  },
};

export default function PlanBadge({ plan }: { plan?: string | null }) {
  const key = (plan ?? "free").toLowerCase();
  const style = PLAN_STYLES[key] ?? {
    label: plan || "Free",
    className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
}
