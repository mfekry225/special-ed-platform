import { StatCard } from "@/components/dashboard/StatCard";
import { ChildCard } from "@/components/dashboard/ChildCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, Target, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";

// بيانات تجريبية — في التطبيق الفعلي تُجلب من Supabase عبر
// createClient().from("children").select("*").eq("teacher_id", ...)
const children = [
  {
    id: "1",
    name: "يوسف أحمد",
    age: "5 سنوات",
    diagnosis: "طيف_التوحد",
    lastSession: "أمس",
    overallProgress: 62,
  },
  {
    id: "2",
    name: "لينا خالد",
    age: "4 سنوات و٦ أشهر",
    diagnosis: "تأخر_لغوي",
    lastSession: "قبل يومين",
    overallProgress: 78,
  },
  {
    id: "3",
    name: "عمر سالم",
    age: "6 سنوات",
    diagnosis: "صعوبات_تواصل",
    lastSession: "اليوم",
    overallProgress: 45,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-ink-50">
            صباح الخير، أ. سارة 👋
          </h1>
          <p className="text-sm text-ink-400">لديك 3 جلسات مجدولة اليوم</p>
        </div>
        <Link href="/children">
          <Button size="md" className="hidden md:inline-flex">
            <Plus size={18} /> إضافة طفل
          </Button>
        </Link>
      </div>

      {/* بطاقات إحصائية سريعة */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Users} label="إجمالي الأطفال" value={12} tone="rifq" />
        <StatCard icon={CalendarCheck} label="جلسات هذا الأسبوع" value={18} tone="amber" />
        <StatCard icon={Target} label="أهداف مكتسبة" value={"27 / 40"} tone="sage" />
        <StatCard icon={TrendingUp} label="متوسط التقدم" value="68٪" tone="rifq" />
      </div>

      {/* رسم بياني لمتوسط التقدم الأسبوعي */}
      <Card>
        <CardHeader>
          <CardTitle>متوسط تقدّم الأهداف خلال آخر 6 أسابيع</CardTitle>
        </CardHeader>
        <WeeklyProgressChart />
      </Card>

      {/* قائمة الأطفال */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">أطفالي</h2>
          <Link href="/children" className="text-sm font-bold text-rifq-500">
            عرض الكل
          </Link>
        </div>
        <div className="space-y-3">
          {children.map((child) => (
            <ChildCard key={child.id} {...child} />
          ))}
        </div>
      </div>

      {/* زر عائم لإضافة طفل على الهاتف */}
      <Link
        href="/children"
        className="fixed bottom-24 left-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-rifq-500 text-white shadow-soft md:hidden"
      >
        <Plus size={26} />
      </Link>
    </div>
  );
}
