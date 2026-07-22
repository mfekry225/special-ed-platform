"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, Users, ClipboardList, BookOpen, Bell, Settings, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutGrid },
  { href: "/children", label: "ملفات الأطفال", icon: Users },
  { href: "/session", label: "سجل الجلسات", icon: ClipboardList },
  { href: "/lessons", label: "بنك الدروس", icon: BookOpen },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-ink-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-rifq-500 text-white">
          <HeartHandshake size={20} />
        </div>
        <span className="font-display text-xl font-extrabold text-rifq-700 dark:text-rifq-200">رِفق</span>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-bold transition-colors",
                active
                  ? "bg-rifq-50 text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200"
                  : "text-ink-700 hover:bg-ink-50 dark:text-ink-50 dark:hover:bg-dark-bg"
              )}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-bold text-ink-400 hover:bg-ink-50 dark:hover:bg-dark-bg"
      >
        <Settings size={19} />
        الإعدادات
      </Link>
    </aside>
  );
}
