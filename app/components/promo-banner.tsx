"use client";

import ToolSearch from "./tool-search";

const cycleWordClassName =
  "col-start-1 row-start-1 h-[1.4em] leading-[1.4em] whitespace-nowrap bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text font-extrabold text-transparent opacity-0";

export default function PromoBanner() {
  return (
    <div className="relative mx-auto mt-10 max-w-2xl px-6 py-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-36 w-full max-w-sm animate-[pulse-glow_4s_ease-in-out_infinite] rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/25"
      />

      <p className="relative flex flex-wrap items-center justify-center gap-2 text-2xl font-bold tracking-tight text-black sm:text-3xl dark:text-zinc-50">
        <span>Yeni nesil</span>
        <span className="relative inline-grid h-[1.4em] overflow-hidden px-1 align-bottom">
          <span
            className={`${cycleWordClassName} [animation:cycle-words_8s_cubic-bezier(.65,0,.35,1)_0s_infinite]`}
          >
            yapay zeka destekli
          </span>
          <span
            className={`${cycleWordClassName} [animation:cycle-words_8s_cubic-bezier(.65,0,.35,1)_2s_infinite]`}
          >
            tamamen ücretsiz
          </span>
          <span
            className={`${cycleWordClassName} [animation:cycle-words_8s_cubic-bezier(.65,0,.35,1)_4s_infinite]`}
          >
            kullanımı kolay
          </span>
          <span
            className={`${cycleWordClassName} [animation:cycle-words_8s_cubic-bezier(.65,0,.35,1)_6s_infinite]`}
          >
            saniyeler süren
          </span>
        </span>
        <span>araç kutusu</span>
      </p>

      <p className="relative mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-purple-300/50 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 [animation:sub-glow_3s_ease-in-out_infinite] dark:border-purple-400/30 dark:bg-zinc-900 dark:text-zinc-200">
        <span className="text-amber-500">✨</span>
        Aradığınız tüm özellikler, tek çatı altında
      </p>

      <p className="relative mx-auto mt-6 max-w-lg text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-200">
        QR kod, PDF ve görsel araçları tek çatı altında — hızlı, güvenli ve
        tamamen ücretsiz. Dosyaların tarayıcından hiç çıkmaz.
      </p>

      <ToolSearch />

      <button
        type="button"
        onClick={() =>
          document
            .getElementById("araclar")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="relative mx-auto mt-6 flex items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform! duration-200! hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40"
      >
        Araçları Dene
        <span aria-hidden="true">↓</span>
      </button>
    </div>
  );
}
