import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ClipboardList } from "lucide-react";

// بيانات تجريبية — في التطبيق الفعلي: supabase.from("children").select("id, full_name").eq("teacher_id", ...)
const children = [
  { id: "1", name: "يوسف أحمد", diagnosis: "طيف التوحد" },
  { id: "2", name: "لينا خالد", diagnosis: "تأخر لغوي" },
  { id: "3", name: "عمر سالم", diagnosis: "صعوبات تواصل" },
];

export default function SessionIndexPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">
          بدء جلسة جديدة
        </h1>
        <p className="text-sm text-ink-400">اختر الطفل الذي تريد تسجيل جلسته اليوم</p>
      </div>

      <div className="space-y-3">
        {children.map((child) => (
          <Link key={child.id} href={`/session/${child.id}`}>
            <Card className="flex items-center gap-4 transition-shadow hover:shadow-soft active:scale-[0.99]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rifq-100 font-display text-lg font-bold text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200">
                {child.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-display font-bold text-ink-900 dark:text-ink-50">
                  {child.name}
                </h4>
                <p className="text-xs text-ink-400">{child.diagnosis}</p>
              </div>
              <ClipboardList className="shrink-0 text-rifq-500" size={18} />
              <ChevronLeft className="shrink-0 text-ink-400" size={18} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
