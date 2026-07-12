import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "./icons";

export type BreadcrumbItem = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="w-full overflow-x-auto">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        {items.map((item, index) => {
          const isFirst = index === 0;

          return (
            <li key={item.name} className="flex min-w-0 items-center gap-1.5">
              {!isFirst && (
                <span aria-hidden="true" className="flex shrink-0 text-zinc-400 dark:text-zinc-600">
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex min-w-0 items-center gap-1 truncate font-medium transition-colors hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {isFirst && <HomeIcon className="h-3.5 w-3.5 shrink-0" />}
                  <span className="truncate">{item.name}</span>
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="truncate font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
