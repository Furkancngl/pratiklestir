"use client";

import { useTheme } from "../context/theme-context";
import { useDebugToast } from "./debug-toast";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { show: showDebugToast, toast: debugToast } = useDebugToast();

  return (
    <>
      {debugToast}
      <button
        onClick={() => {
          showDebugToast("Tema butonu tıklandı");
          toggleTheme();
        }}
        aria-label={
          theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"
        }
        className="touch-manipulation fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-black/[.08] bg-white text-xl shadow-lg transition-colors hover:bg-black/[.04] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </>
  );
}
