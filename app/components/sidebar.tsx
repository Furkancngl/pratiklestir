"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { tools } from "../lib/tools";
import { categories } from "../lib/categories";
import UserMenu from "./user-menu";
import {
  CalculatorIcon,
  ChevronRightIcon,
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  SunIcon,
  VideoIcon,
} from "./icons";

type IconType = ComponentType<{ className?: string }>;

type SidebarLeaf = {
  label: string;
  href: string;
  available: boolean;
  beta?: boolean;
};

type SidebarLink = {
  type: "link";
  name: string;
  href: string;
  icon: IconType;
  available: boolean;
};

type SidebarCategory = {
  type: "category";
  name: string;
  slug: string;
  icon: IconType;
  items: SidebarLeaf[];
};

type SidebarEntry = SidebarLink | SidebarCategory;

// Kategori ikonları - tek tek araçların ikonlarının aksine (bkz. tools.ts),
// kategoriler tools.ts'de birinci sınıf bir varlık olmadığı için bu küçük
// eşleme burada tutuluyor. Yeni bir kategori (yeni bir `group` değeri)
// eklendiğinde otomatik olarak sidebar'da belirir; ikon eşleşmezse
// DocumentIcon'a düşer.
const categoryIcons: Record<string, IconType> = {
  Günlük: SunIcon,
  PDF: DocumentIcon,
  Görsel: ImageIcon,
  Video: VideoIcon,
  Hesapla: CalculatorIcon,
};

// navEntries tamamen tools.ts + categories.ts'den türetilir - burada hiçbir
// araç hard-code edilmez. Yeni bir araç `tools.ts`ye eklendiğinde (bir
// `group` ile ya da gruplanmamış tekil bir link olarak) sidebar otomatik
// güncellenir.
const groupedTools = new Set(
  categories.flatMap((category) => category.tools.map((tool) => tool.href))
);
const ungroupedTools = tools.filter((tool) => !groupedTools.has(tool.href));

const navEntries: SidebarEntry[] = [
  { type: "link", name: "Ana Sayfa", href: "/", icon: HomeIcon, available: true },
  ...categories.map(
    (category): SidebarCategory => ({
      type: "category",
      name: category.name,
      slug: category.slug,
      icon: categoryIcons[category.name] ?? DocumentIcon,
      items: category.tools.map((tool) => ({
        label: tool.shortLabel ?? tool.name,
        href: tool.href,
        available: tool.available,
        beta: tool.beta,
      })),
    })
  ),
  ...ungroupedTools.map(
    (tool): SidebarLink => ({
      type: "link",
      name: tool.name,
      href: tool.href,
      icon: tool.icon,
      available: tool.available,
    })
  ),
];

function activeCategoryName(pathname: string): string | null {
  const match = navEntries.find(
    (entry): entry is SidebarCategory =>
      entry.type === "category" &&
      (pathname === `/${entry.slug}` ||
        entry.items.some((item) => item.href === pathname)),
  );
  return match?.name ?? null;
}

function SidebarLeafLink({
  item,
  isActive,
  onNavigate,
}: {
  item: SidebarLeaf;
  isActive: boolean;
  onNavigate: () => void;
}) {
  if (!item.available) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between gap-2 rounded-md py-2 pl-3 pr-2 text-[13px] text-zinc-400 dark:text-zinc-600"
      >
        {item.label}
        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-600/80 dark:bg-purple-400/10 dark:text-violet-300/70">
          yakında
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center justify-between gap-2 rounded-md py-2 pl-3 pr-2 text-[13px] font-medium transition-colors ${
        isActive
          ? "bg-purple-500/10 font-semibold text-purple-700 dark:bg-purple-400/10 dark:text-violet-200"
          : "text-zinc-600 hover:bg-purple-500/[0.05] hover:text-purple-700 dark:text-zinc-400 dark:hover:bg-purple-400/[0.06] dark:hover:text-violet-200"
      }`}
    >
      {item.label}
      {item.beta && (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          Beta
        </span>
      )}
    </Link>
  );
}

function SidebarCategoryBlock({
  category,
  pathname,
  isOpen,
  onToggle,
  onNavigate,
}: {
  category: SidebarCategory;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const Icon = category.icon;
  const href = `/${category.slug}`;
  const isActive = pathname === href;

  return (
    <div>
      {/* Başlık ve ok/chevron ayrı tıklama alanlarıdır: başlığa tıklamak
          kategori sayfasına götürür, chevron'a tıklamak yalnızca listeyi
          açıp kapatır - ikisi birbirini tetiklemez. */}
      <div
        className={`flex items-center gap-1 rounded-md pr-2 transition-colors ${
          isActive
            ? "bg-purple-500/10 dark:bg-purple-400/10"
            : "hover:bg-purple-500/[0.06] dark:hover:bg-purple-400/[0.08]"
        }`}
      >
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex flex-1 items-center gap-3 rounded-md px-3 py-3 text-sm font-medium ${
            isActive
              ? "text-purple-700 dark:text-violet-200"
              : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          <Icon className="h-4.5 w-4.5 shrink-0 text-purple-500/70 dark:text-violet-300" />
          {category.name}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`${category.name} kategorisini ${isOpen ? "kapat" : "aç"}`}
          className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md transition-colors hover:bg-purple-500/10 dark:hover:bg-purple-400/10"
        >
          <ChevronRightIcon
            className={`h-4 w-4 shrink-0 text-purple-400/70 transition-transform duration-200 dark:text-[#8b73d6] ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="ml-[27px] flex flex-col gap-0.5 border-l border-purple-300/30 py-1 pl-3 dark:border-[rgba(167,139,250,0.25)]">
              {category.items.map((item) => (
                <SidebarLeafLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({
  isAdmin = false,
  userName,
  userEmail,
  userPlan,
  userCredits,
  userCreditLimit,
}: {
  isAdmin?: boolean;
  userName?: string | null;
  userEmail?: string | null;
  userPlan?: string | null;
  userCredits?: number | null;
  userCreditLimit?: number | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const initial = activeCategoryName(pathname);
    return initial ? new Set([initial]) : new Set();
  });
  const [syncedPathname, setSyncedPathname] = useState(pathname);

  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    const current = activeCategoryName(pathname);
    if (current && !openCategories.has(current)) {
      setOpenCategories((prev) => new Set(prev).add(current));
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const openSidebar = () => setIsOpen(true);
    window.addEventListener("open-sidebar", openSidebar);
    return () => window.removeEventListener("open-sidebar", openSidebar);
  }, []);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <>
      <div className="relative z-50 flex items-center justify-between border-b border-black/[.08] bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        <span className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
          Pratikleştir
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={isOpen}
          className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-md border border-black/[.08] text-black dark:border-zinc-800 dark:text-zinc-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] shrink-0 flex-col border-r border-purple-300/30 bg-white bg-[radial-gradient(circle_at_15%_0%,rgba(168,85,247,0.05),transparent_55%),radial-gradient(circle_at_100%_40%,rgba(99,102,241,0.04),transparent_55%)] transition-[transform]! duration-200! dark:border-[rgba(167,139,250,0.08)] dark:bg-[#0d0a16] dark:bg-[radial-gradient(circle_at_15%_0%,rgba(139,92,246,0.08),transparent_55%),radial-gradient(circle_at_100%_40%,rgba(99,102,241,0.05),transparent_55%)] md:sticky md:top-0 md:h-screen md:[transform:translateX(0)] ${
          isOpen ? "[transform:translateX(0)]" : "[transform:translateX(-100%)]"
        }`}
      >
        <div className="px-6 py-6">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="inline-block py-2.5 text-xl font-semibold tracking-tight text-black transition-opacity! hover:opacity-70 dark:text-zinc-50"
          >
            Pratikleştir
          </Link>
        </div>

        {/* Bu bölge bağımsız kayar; alttaki kullanıcı menüsü içerik ne
            kadar uzun olursa olsun her zaman görünür kalır. */}
        <div className="sidebar-scroll flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 px-3 pb-4 md:py-2">
            {navEntries.map((entry) => {
              if (entry.type === "link") {
                const Icon = entry.icon;
                if (!entry.available) {
                  return (
                    <span
                      key={entry.name}
                      aria-disabled="true"
                      className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-3 text-sm text-zinc-400 dark:text-zinc-600"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {entry.name}
                      </span>
                      <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600/80 dark:bg-purple-400/10 dark:text-violet-300/70">
                        yakında
                      </span>
                    </span>
                  );
                }
                const isActive = pathname === entry.href;
                return (
                  <Link
                    key={entry.name}
                    href={entry.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20"
                        : "text-zinc-700 hover:bg-purple-500/[0.06] dark:text-zinc-300 dark:hover:bg-purple-400/[0.08]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {entry.name}
                  </Link>
                );
              }

              return (
                <SidebarCategoryBlock
                  key={entry.name}
                  category={entry}
                  pathname={pathname}
                  isOpen={openCategories.has(entry.name)}
                  onToggle={() => toggleCategory(entry.name)}
                  onNavigate={closeMobileMenu}
                />
              );
            })}
          </nav>

          {isAdmin && (
            <div className="border-t border-black/[.08] px-3 pt-2 dark:border-zinc-800">
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                🔧 Panele Git
              </Link>
            </div>
          )}
        </div>

        {userCreditLimit != null && userCredits != null && (
          <Link
            href="/planlar"
            onClick={closeMobileMenu}
            className="mx-3 mb-3 block shrink-0 rounded-xl border border-purple-500/10 bg-purple-500/[0.02] px-3 py-2.5 transition-colors hover:bg-purple-500/[0.05] dark:border-purple-400/10 dark:bg-purple-400/[0.03] dark:hover:bg-purple-400/[0.06]"
          >
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Kredi</span>
              <span className="text-black dark:text-zinc-50">
                {userCredits}/{userCreditLimit} kredi kaldı
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-500"
                style={{
                  width: `${Math.min(100, Math.round((userCredits / Math.max(userCreditLimit, 1)) * 100))}%`,
                }}
              />
            </div>
          </Link>
        )}

        <UserMenu name={userName} email={userEmail} plan={userPlan} />
      </aside>
    </>
  );
}
