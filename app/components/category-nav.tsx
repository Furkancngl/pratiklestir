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
    case "Video":
      return (
        <svg {...shared}>
          <rect x="2.5" y="6" width="13" height="12" rx="2" />
          <path d="M21.5 8.5 15.5 12l6 3.5Z" />
        </svg>
      );
    case "Yapay Zeka":
      return (
        <svg {...shared}>
          <circle cx="10" cy="10" r="6" />
          <path d="m14.5 14.5 5.5 5.5" />
          <path
            d="M18.5 3.5 19.4 5.6 21.5 6.5 19.4 7.4 18.5 9.5 17.6 7.4 15.5 6.5 17.6 5.6Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "Geliştirici Araçları":
      return (
        <svg {...shared}>
          <polyline points="8 6 2 12 8 18" />
          <polyline points="16 6 22 12 16 18" />
        </svg>
      );
    default:
      return null;
  }
}

type CategoryCardData = {
  slug?: string;
  name: string;
  countLabel: string;
  comingSoon: boolean;
};

const cardClassName =
  "group flex items-center gap-3.5 rounded-2xl border border-black/[.08] bg-white p-4 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40";

function CategoryCard({ category }: { category: CategoryCardData }) {
  const iconWrap = category.comingSoon
    ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800/60 dark:text-zinc-600"
    : "bg-purple-500/12 text-purple-500 dark:bg-purple-400/15 dark:text-purple-300";

  const content = (
    <>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}>
        <CategoryIconGlyph name={category.name} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm font-semibold ${
            category.comingSoon ? "text-zinc-400 dark:text-zinc-600" : "text-black dark:text-zinc-50"
          }`}
        >
          {category.name}
        </span>
        <span
          className={`block text-xs ${
            category.comingSoon ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {category.countLabel}
        </span>
      </span>
      {!category.comingSoon && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-zinc-300 transition-transform! duration-200! group-hover:translate-x-0.5 group-hover:text-purple-400 dark:text-zinc-600"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      )}
    </>
  );

  if (category.comingSoon && !category.slug) {
    return (
      <div aria-disabled="true" className={`${cardClassName} cursor-not-allowed`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/${category.slug}`}
      className={`${cardClassName} transition-colors! duration-150! hover:border-purple-400/40 hover:shadow-md`}
    >
      {content}
    </Link>
  );
}

export default function CategoryNav() {
  const cards: CategoryCardData[] = categories.map((category) => {
    const availableCount = category.tools.filter((tool) => tool.available).length;
    return {
      slug: category.slug,
      name: category.name,
      countLabel: category.hasAvailableTools ? `${availableCount} araç` : "Yakında",
      comingSoon: !category.hasAvailableTools,
    };
  });

  // tools.ts'de henüz hiçbir kaydı olmayan, tamamen gelecek planı olan
  // kategoriler - gerçek/sahte bir araç uydurmadan yalnızca vitrin amaçlı
  // gösterilir, tıklanamaz (bkz. app/lib/tools.ts, app/lib/categories.ts:
  // kategoriler tools.ts'deki `group` alanından otomatik türetildiği için
  // bunlar orada bir kayıt olmadıkça categories dizisinde hiç yer almaz).
  const plannedCards: CategoryCardData[] = [
    { name: "Yapay Zeka", countLabel: "Yakında", comingSoon: true },
    { name: "Geliştirici Araçları", countLabel: "Yakında", comingSoon: true },
  ];

  return (
    <nav id="kategoriler" aria-label="Kategoriler" className="mt-16 w-full max-w-4xl scroll-mt-20">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
        Kategoriler
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...cards, ...plannedCards].map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </nav>
  );
}
