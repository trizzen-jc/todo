"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "대시보드" },
  { href: "/todos", label: "할 일" },
  { href: "/weekly", label: "주간 계획" },
  { href: "/goals", label: "1년 목표" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-line bg-surface p-4 sm:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
