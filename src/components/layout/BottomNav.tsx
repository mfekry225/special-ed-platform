"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, Users, ClipboardList, BookOpen, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutGrid },
  { href: "/children", label: "الأطفال", icon: Users },
  { href: "/session", label: "الجلسة", icon: ClipboardList },
  { href: "/lessons", label: "الدروس", icon: BookOpen },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
];

/**
 * شريط تنقل سفلي ثابت (مثل تطبيقات iOS الأصلية) بدلاً من قائمة جانبية
 * منسدلة، لأنه الأنسب للاستخدام بإبهام واحد أثناء تنقّل المعلم بين
 * الأطفال في نفس الغرفة.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 backdrop-blur",
        "dark:border-dark-border dark:bg-dark-surface/95",
        "pb-[env(safe-area-inset-bottom)] md:hidden"
      )}
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex touch-target flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold",
                  active ? "text-rifq-500" : "text-ink-400"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
