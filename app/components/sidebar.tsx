"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { tools } from "../lib/tools";
import { useDebugToast } from "./debug-toast";
import {
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  PenIcon,
  QrCodeIcon,
  SparkleIcon,
} from "./icons";

const icons: Record<string, ComponentType<{ className?: string }>> = {
  "/": HomeIcon,
  "/qr-kod": QrCodeIcon,
  "/pdf-birlestir": DocumentIcon,
  "/arka-plan-sil": ImageIcon,
  "/kalite-arttir": SparkleIcon,
  "/makale-hazirla": PenIcon,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { show: showDebugToast, toast: debugToast } = useDebugToast();

  return (
    <>
      {debugToast}
      <div className="flex items-center justify-between border-b border-black/[.08] bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
        <span className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
          Pratikleştir
        </span>
        <button
          onClick={() => {
            showDebugToast("Sidebar tıklandı");
            setIsOpen(!isOpen);
          }}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] shrink-0 flex-col border-r border-black/[.08] bg-white transition-[transform]! duration-200! dark:border-zinc-800 dark:bg-zinc-950 md:static md:[transform:translateX(0)] ${
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

        <nav className="flex flex-1 flex-col gap-2 px-3 pb-4 md:py-2">
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

          {tools.map((tool) => {
            const isActive = pathname === tool.href;
            const Icon = icons[tool.href];

            if (!tool.available) {
              return (
                <span
                  key={tool.name}
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
                key={tool.name}
                href={tool.href}
                onClick={() => setIsOpen(false)}
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
          })}
        </nav>

        <div className="border-t border-black/[.08] px-6 py-4 dark:border-zinc-800">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500">
            Beta &middot; v0.1
          </span>
        </div>
      </aside>
    </>
  );
}
