"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/app/components/user-menu";
import {
  BellIcon,
  LockIcon,
  PaletteIcon,
  StarIcon,
  UserIcon,
} from "@/app/components/icons";

const NAV_ITEMS = [
  { href: "/ayarlar", label: "Genel", icon: UserIcon },
  { href: "/ayarlar/hesap", label: "Hesap", icon: LockIcon },
  { href: "/ayarlar/plan-faturalama", label: "Plan & Faturalama", icon: StarIcon },
  { href: "/ayarlar/bildirimler", label: "Bildirimler", icon: BellIcon },
  { href: "/ayarlar/gorunum", label: "Görünüm", icon: PaletteIcon },
];

export default function SettingsSidebar({
  userName,
  userEmail,
  userPlan,
}: {
  userName?: string | null;
  userEmail?: string | null;
  userPlan?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-black/[.08] bg-white dark:border-zinc-800 dark:bg-zinc-950 md:sticky md:top-0 md:h-screen md:w-[230px] md:border-b-0 md:border-r">
      <div className="px-5 pt-7 pb-3">
        <h2 className="px-2.5 text-[15px] font-extrabold tracking-tight text-black dark:text-zinc-50">
          Ayarlar
        </h2>
      </div>

      <div className="sidebar-scroll flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-0.5 px-3 pb-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-linear-to-r from-violet-500/15 to-indigo-500/8 font-semibold text-violet-700 dark:text-violet-300"
                    : "text-zinc-500 hover:bg-black/[.04] hover:text-black dark:text-zinc-400 dark:hover:bg-white/[.04] dark:hover:text-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/[.08] px-3 pt-2 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-black/[.04] hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            ← Anasayfaya Dön
          </Link>
        </div>
      </div>

      <UserMenu name={userName} email={userEmail} plan={userPlan} />
    </aside>
  );
}
