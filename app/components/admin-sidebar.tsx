"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950 md:w-[250px] md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-6 py-6">
        <Link
          href="/admin"
          className="text-xl font-semibold tracking-tight text-black transition-opacity hover:opacity-70 dark:text-zinc-50"
        >
          Pratikleştir
        </Link>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          ADMIN
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "text-zinc-700 hover:bg-black/[.04] dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {/* İleride eklenecek admin bölümleri buraya */}
      </nav>

      <div className="border-t border-black/[.08] px-3 py-4 dark:border-zinc-800">
        <Link
          href="/?admin_stay=1"
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-black/[.04] hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          ← Siteye Git
        </Link>
      </div>
    </aside>
  );
}
