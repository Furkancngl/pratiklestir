"use client";

export default function HowItWorksButton() {
  return (
    <button
      type="button"
      onClick={() =>
        document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
      }
      className="group relative mt-6 inline-flex touch-manipulation items-center gap-2 rounded-full border border-purple-500/35 bg-purple-500/10 px-6 py-3 text-sm font-bold text-purple-700 transition-all! duration-200! hover:-translate-y-0.5 hover:border-purple-500/60 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/25 dark:text-violet-300"
    >
      Nasıl Çalışır?
      <span
        aria-hidden="true"
        className="inline-block transition-transform! duration-200! group-hover:translate-y-0.75"
      >
        ↓
      </span>
    </button>
  );
}
