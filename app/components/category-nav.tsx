import Link from "next/link";
import { categories } from "../lib/categories";

function CategoryIconGlyph({ name, className }: { name: string; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "Günlük":
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      );
    case "PDF":
      return (
        <svg {...shared}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case "Görsel":
      return (
        <svg {...shared}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case "Hesapla":
      return (
        <svg {...shared}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
    default:
      return null;
  }
}

function ClockGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

const chipClassName =
  "flex items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors! duration-150! hover:border-purple-400/50 hover:bg-purple-500/[.06] hover:text-purple-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-purple-300";

export default function CategoryNav() {
  const activeCategories = categories.filter((category) => category.hasAvailableTools);

  return (
    <nav
      aria-label="Kategoriler"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {activeCategories.map((category) => (
        <Link key={category.slug} href={`/${category.slug}`} className={chipClassName}>
          <CategoryIconGlyph name={category.name} className="h-4 w-4 text-purple-400" />
          {category.name}
        </Link>
      ))}
      <a href="#yakinda" className={chipClassName}>
        <ClockGlyph className="h-4 w-4 text-zinc-400" />
        Yakında
      </a>
    </nav>
  );
}
