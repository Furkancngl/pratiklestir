import Link from "next/link";

type MoreToolsCtaProps = {
  count: number;
};

export default function MoreToolsCta({ count }: MoreToolsCtaProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Link
        href="/kayit"
        className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/5 px-4 py-2 text-sm font-semibold tracking-tight transition-[transform,opacity]! duration-200! hover:scale-105 hover:opacity-80 dark:border-purple-400/20"
      >
        <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Ve daha fazlası (+{count}) →
        </span>
      </Link>
    </div>
  );
}
