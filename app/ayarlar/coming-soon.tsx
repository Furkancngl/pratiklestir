import type { ComponentType } from "react";

export default function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-black dark:text-white">
        {title}
      </h1>
      <p className="mb-8 text-[13.5px] text-zinc-500 dark:text-zinc-400">{description}</p>

      <div className="flex max-w-[460px] flex-col items-center gap-3 rounded-2xl border border-dashed border-black/[.12] px-6 py-14 text-center dark:border-white/[.12]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <Icon className="h-5.5 w-5.5" />
        </span>
        <p className="text-sm font-semibold text-black dark:text-zinc-50">Yakında</p>
        <p className="max-w-[280px] text-xs text-zinc-500 dark:text-zinc-400">
          Bu bölüm üzerinde çalışıyoruz. Çok yakında kullanıma açılacak.
        </p>
      </div>
    </div>
  );
}
