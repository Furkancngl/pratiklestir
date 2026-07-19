import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakımdayız",
  robots: { index: false, follow: false },
};

export default function BakimPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 dark:bg-[#0a0a0f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-30 -left-20 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] blur-[70px] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.35)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-25 -right-25 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] blur-[70px] dark:bg-[radial-gradient(circle,rgba(236,72,153,0.22)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-[auth-blob-float_7s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.13)_0%,transparent_70%)] blur-[60px] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)]"
      />

      <div className="relative flex w-full max-w-[420px] flex-col items-center text-center opacity-0 [animation:auth-fade-up_.6s_ease_forwards]">
        <div className="mb-7 flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-black dark:text-white">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-linear-to-br from-violet-400 to-pink-400" />
          Pratikleştir
        </div>

        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/15 text-3xl [animation:sub-glow_2.5s_ease-in-out_infinite] dark:bg-purple-500/20">
          🛠️
        </span>

        <h1 className="mb-3 text-[28px] font-extrabold leading-[1.2] tracking-tight text-black dark:text-white">
          Bakımdayız
        </h1>
        <p className="text-[15px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
          Pratikleştir şu anda bakımda,{" "}
          <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-pink-400 bg-clip-text font-semibold text-transparent">
            çok yakında
          </span>{" "}
          geri döneceğiz.
        </p>
      </div>
    </div>
  );
}
