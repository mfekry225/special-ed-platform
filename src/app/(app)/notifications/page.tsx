import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

const notifications = [
  { id: "1", text: "تم إرسال ملخص جلسة يوسف أحمد إلى ولي أمره عبر واتساب", time: "قبل 10 دقائق" },
  { id: "2", text: "لينا خالد حققت هدفاً جديداً في الخطة التربوية 🎉", time: "أمس" },
  { id: "3", text: "تذكير: موعد مراجعة الخطة التربوية لعمر سالم غداً", time: "أمس" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">الإشعارات</h1>
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-ink-50">{n.text}</p>
              <p className="text-xs text-ink-400">{n.time}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
