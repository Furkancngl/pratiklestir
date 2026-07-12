"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HelpIcon, LogoutIcon, SettingsIcon, TrendingUpIcon } from "./icons";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  plan?: string | null;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Ücretsiz Plan",
  pro: "Pro Plan",
};

export default function UserMenu({ name, email, plan }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const primaryLabel = name || email || "Kullanıcı";
  const secondaryLabel = name ? email : plan ? (PLAN_LABELS[plan] ?? plan) : null;
  const initial = primaryLabel.charAt(0).toUpperCase();

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 border-t border-purple-500/10 p-3 dark:border-purple-400/10"
    >
      {open && (
        <div className="absolute inset-x-3 bottom-full z-10 mb-2 overflow-hidden rounded-xl border border-black/[.08] bg-white py-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <Link
            href="/ayarlar"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <SettingsIcon className="h-4 w-4 shrink-0" />
            Ayarlar
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <HelpIcon className="h-4 w-4 shrink-0" />
            Yardım
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <TrendingUpIcon className="h-4 w-4 shrink-0" />
            Planı Yükselt
          </button>

          <div className="my-1.5 border-t border-black/[.08] dark:border-zinc-800" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <LogoutIcon className="h-4 w-4 shrink-0" />
            Çıkış Yap
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex w-full touch-manipulation items-center gap-2.5 rounded-xl border border-purple-500/10 bg-purple-500/[0.02] px-2 py-2 text-left transition-colors hover:bg-purple-500/[0.05] dark:border-purple-400/10 dark:bg-purple-400/[0.03] dark:hover:bg-purple-400/[0.06]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-black dark:text-zinc-50">
            {primaryLabel}
          </span>
          {secondaryLabel && (
            <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
              {secondaryLabel}
            </span>
          )}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-[transform]! duration-200! dark:text-zinc-500 ${
            open ? "[transform:rotate(180deg)]" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
