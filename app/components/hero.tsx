import ToolSearch from "./tool-search";

export default function Hero() {
  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-56 w-full max-w-sm animate-[pulse-glow_4s_ease-in-out_infinite] rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/25"
      />

      <p className="relative mx-auto inline-flex items-center gap-2 rounded-full border border-purple-300/50 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 [animation:sub-glow_3s_ease-in-out_infinite] dark:border-purple-400/30 dark:bg-zinc-900 dark:text-zinc-200">
        <span className="text-amber-500">✨</span>
        Aradığınız tüm özellikler, tek çatı altında
      </p>

      <h1 className="relative mt-5 text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Dosyaların Sunucuya Asla Yüklenmez
      </h1>
      <p className="relative mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Tüm işlemler cihazında gerçekleşir, hiçbir dosya bize ulaşmaz. Hızlı,
        güvenli ve tamamen ücretsiz araçlarla hemen başla.
      </p>

      <div className="relative">
        <ToolSearch />
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#kategoriler"
          className="inline-flex touch-manipulation items-center gap-2 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-transform! duration-200! hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40"
        >
          Araçları Keşfet
          <span aria-hidden="true">→</span>
        </a>
        <a
          href="#populer"
          className="inline-flex touch-manipulation items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors! duration-200! hover:border-purple-400/50 hover:text-purple-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-purple-300"
        >
          En Popüler Araçlar
        </a>
      </div>
    </div>
  );
}
