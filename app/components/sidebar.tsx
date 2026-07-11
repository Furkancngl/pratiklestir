"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { tools } from "../lib/tools";
import UserMenu from "./user-menu";
import {
  ChevronRightIcon,
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  PenIcon,
  QrCodeIcon,
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
  icon: IconType;
  items: SidebarLeaf[];
};

type SidebarEntry = SidebarLink | SidebarCategory;

function leaf(href: string, label: string): SidebarLeaf {
  const tool = tools.find((t) => t.href === href);
  return { label, href, available: tool?.available ?? false, beta: tool?.beta };
}

const navEntries: SidebarEntry[] = [
  { type: "link", name: "Ana Sayfa", href: "/", icon: HomeIcon, available: true },
  {
    type: "link",
    name: "QR Kod Oluşturucu",
    href: "/qr-kod",
    icon: QrCodeIcon,
    available: true,
  },
  {
    type: "category",
    name: "PDF",
    icon: DocumentIcon,
    items: [
      leaf("/pdf-birlestir", "Birleştir"),
      leaf("/pdf-sikistir", "Sıkıştır"),
      leaf("/pdf-donustur", "Dönüştür"),
    ],
  },
  {
    type: "category",
    name: "Görsel",
    icon: ImageIcon,
    items: [
      leaf("/gorsel-sikistir", "Sıkıştır"),
      leaf("/arka-plan-sil", "Arka Plan Sil"),
      leaf("/gorsel-donustur", "Dönüştür"),
      leaf("/gorsel-genislet", "Genişlet"),
      leaf("/kalite-arttir", "Kalite Arttır"),
      leaf("/gorsel-netlestir", "Netleştir"),
    ],
  },
  {
    type: "category",
    name: "Video",
    icon: VideoIcon,
    items: [leaf("/video-sikistir", "Sıkıştır")],
  },
  {
    type: "link",
    name: "Makale Hazırla",
    href: "/makale-hazirla",
    icon: PenIcon,
    available: false,
  },
];

function activeCategoryName(pathname: string): string | null {
  const match = navEntries.find(
    (entry): entry is SidebarCategory =>
      entry.type === "category" && entry.items.some((item) => item.href === pathname),
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
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-zinc-800"
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

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <span className="flex items-center gap-3">
          <Icon className="h-4.5 w-4.5 shrink-0" />
          {category.name}
        </span>
        <ChevronRightIcon
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 dark:text-zinc-600 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="ml-[27px] flex flex-col gap-0.5 border-l border-black/[.08] py-1 pl-3 dark:border-zinc-800">
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
}: {
  isAdmin?: boolean;
  userName?: string | null;
  userEmail?: string | null;
  userPlan?: string | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const initial = activeCategoryName(pathname);
    return initial ? new Set([initial]) : new Set();
  });

  useEffect(() => {
    const current = activeCategoryName(pathname);
    if (!current) return;
    setOpenCategories((prev) => {
      if (prev.has(current)) return prev;
      const next = new Set(prev);
      next.add(current);
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] shrink-0 flex-col border-r border-black/[.08] bg-white transition-[transform]! duration-200! dark:border-zinc-800 dark:bg-zinc-950 md:sticky md:top-0 md:h-screen md:[transform:translateX(0)] ${
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
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
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

        <UserMenu name={userName} email={userEmail} plan={userPlan} />
      </aside>
    </>
  );
}
