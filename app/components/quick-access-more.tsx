"use client";

export default function QuickAccessMore() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-sidebar"))}
      className="mt-5 inline-flex touch-manipulation items-center text-sm font-semibold tracking-tight transition-[transform,opacity]! duration-200! hover:scale-105 hover:opacity-80"
    >
      <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
        Ve daha fazlası →
      </span>
    </button>
  );
}
