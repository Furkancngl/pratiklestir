"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { tools, type Tool } from "../lib/tools";
import UserMenu from "./user-menu";
import {
  CompressIcon,
  DocumentIcon,
  ExpandIcon,
  FocusIcon,
  HomeIcon,
  ImageIcon,
  PenIcon,
  QrCodeIcon,
  SparkleIcon,
  VideoIcon,
} from "./icons";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  "/": HomeIcon,
  "/qr-kod": QrCodeIcon,
  "/pdf-birlestir": DocumentIcon,
  "/arka-plan-sil": ImageIcon,
  "/makale-hazirla": PenIcon,
  "/gorsel-sikistir": CompressIcon,
  "/pdf-sikistir": DocumentIcon,
  "/video-sikistir": VideoIcon,
  "/gorsel-genislet": ExpandIcon,
  "/kalite-arttir": SparkleIcon,
  "/gorsel-netlestir": FocusIcon,
};

function ToolNavItem({
  tool,
  isActive,
  onNavigate,
}: {
  tool: Tool;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const Icon = icons[tool.href];

  if (!tool.available) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-3 text-sm text-zinc-400 dark:text-zinc-600"
      >
        <span className="flex items-center gap-3">
          <Icon className="h-4.5 w-4.5 shrink-0" />
          {tool.name}
        </span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          yakında
        </span>
      </span>
    );
  }

  return (
    <Link
      href={tool.href}
      onClick={onNavigate}
      className={`flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
        isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4.5 w-4.5 shrink-0" />
        {tool.name}
      </span>
      {tool.beta && (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          Beta
        </span>
      )}
    </Link>
  );
}

const ungroupedTools = tools.filter((tool) => !tool.group);
const groupedTools = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
  if (tool.group) {
    acc[tool.group] = [...(acc[tool.group] ?? []), tool];
  }
  return acc;
}, {});

export default function Sidebar({
  isAdmin = false,
  userEmail,
  userPlan,
}: {
  isAdmin?: boolean;
  userEmail?: string | null;
  userPlan?: string | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
          onClick={() => setIsOpen(false)}
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
            onClick={() => setIsOpen(false)}
            className="inline-block py-2.5 text-xl font-semibold tracking-tight text-black transition-opacity! hover:opacity-70 dark:text-zinc-50"
          >
            Pratikleştir
          </Link>
        </div>

        {/* Bu bölge bağımsız kayar; alttaki kullanıcı menüsü içerik ne
            kadar uzun olursa olsun her zaman görünür kalır. */}
        <div className="sidebar-scroll flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-2 px-3 pb-4 md:py-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <HomeIcon className="h-4.5 w-4.5 shrink-0" />
              Ana Sayfa
            </Link>

            {ungroupedTools.map((tool) => (
              <ToolNavItem
                key={tool.name}
                tool={tool}
                isActive={pathname === tool.href}
                onNavigate={() => setIsOpen(false)}
              />
            ))}

            {Object.entries(groupedTools).map(([groupName, groupTools]) => (
              <div
                key={groupName}
                className="mt-2 border-t border-black/[.08] pt-2 dark:border-zinc-800"
              >
                <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  {groupName}
                </p>
                <div className="flex flex-col gap-2">
                  {groupTools.map((tool) => (
                    <ToolNavItem
                      key={tool.name}
                      tool={tool}
                      isActive={pathname === tool.href}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {isAdmin && (
            <div className="border-t border-black/[.08] px-3 pt-2 dark:border-zinc-800">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
              >
                🔧 Panele Git
              </Link>
            </div>
          )}
        </div>

        <UserMenu email={userEmail} plan={userPlan} />
      </aside>
    </>
  );
}
