"use client";

import Link from "next/link";
import { useState } from "react";
import { tools } from "../lib/tools";

export default function ToolSearch() {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLowerCase();
  const results = trimmedQuery
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(trimmedQuery) ||
          tool.description.toLowerCase().includes(trimmedQuery),
      )
    : [];

  return (
    <div className="relative mx-auto mt-6 w-full max-w-md">
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Araç ara..."
          className="w-full rounded-full border border-purple-500/25 bg-white py-3 pl-11 pr-4 text-sm text-black shadow-sm outline-none transition-colors! duration-200! placeholder:text-zinc-400 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 dark:border-purple-400/20 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      {trimmedQuery && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/[.08] bg-white p-2 text-left shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Sonuç bulunamadı
            </p>
          ) : (
            results.map((tool) =>
              tool.available ? (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={() => setQuery("")}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors! duration-150! hover:bg-purple-500/10"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-black dark:text-zinc-50">
                      {tool.name}
                    </span>
                    <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {tool.description}
                    </span>
                  </span>
                </Link>
              ) : (
                <div
                  key={tool.name}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-2.5 opacity-60"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      {tool.name}
                    </span>
                    <span className="block truncate text-xs text-zinc-400 dark:text-zinc-500">
                      {tool.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    yakında
                  </span>
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
