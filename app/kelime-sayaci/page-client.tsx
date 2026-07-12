"use client";

import { useMemo, useState } from "react";
import { tools } from "../lib/tools";

const accentClassName =
  tools.find((tool) => tool.href === "/kelime-sayaci")?.accentClassName ??
  "bg-sky-500";

function countStats(text: string) {
  const trimmed = text.trim();
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const sentenceCount =
    trimmed === ""
      ? 0
      : trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const paragraphCount =
    trimmed === ""
      ? 0
      : text.split(/\n+/).map((p) => p.trim()).filter(Boolean).length;

  return {
    wordCount,
    charCount: text.length,
    sentenceCount,
    paragraphCount,
  };
}

export default function KelimeSayaciPage() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-zinc-900">
      <div className="w-full max-w-2xl">
        <div className={`h-1 w-full rounded-full ${accentClassName}`} />

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Kelime Sayacı
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Metnini yaz veya yapıştır, kelime sayısını anında gör.
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Metnini buraya yaz veya yapıştır..."
          rows={10}
          className="mt-8 w-full resize-y rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-black/[.08] bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-black dark:text-zinc-50">
              {stats.wordCount}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Kelime
            </p>
          </div>
          <div className="rounded-xl border border-black/[.08] bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-black dark:text-zinc-50">
              {stats.charCount}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Karakter
            </p>
          </div>
          <div className="rounded-xl border border-black/[.08] bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-black dark:text-zinc-50">
              {stats.sentenceCount}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Cümle
            </p>
          </div>
          <div className="rounded-xl border border-black/[.08] bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-black dark:text-zinc-50">
              {stats.paragraphCount}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Paragraf
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          İşlem tamamen tarayıcınızda yapılır, metniniz hiçbir yere gönderilmez.
        </p>
      </div>
    </div>
  );
}
