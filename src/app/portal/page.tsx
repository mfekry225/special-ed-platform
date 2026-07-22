import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/session/ProgressRing";
import { BookOpen, HeartHandshake } from "lucide-react";

const homeworkLessons = [
  { id: "1", title: "بطاقات الحيوانات الناطقة", instructions: "شارك طفلك 3 بطاقات يومياً واطلب منه تسمية كل حيوان." },
  { id: "2", title: "جدول الروتين اليومي المصوّر", instructions: "علّقوا الجدول في مكان واضح واستخدموه صباحاً ومساءً." },
];

export default function ParentPortalPage() {
  return (
    <div className="min-h-screen bg-ink-50 pb-10 dark:bg-dark-bg">
      <header className="flex items-center gap-2 border-b border-ink-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-rifq-500 text-white">
          <HeartHandshake size={18} />
        </div>
        <div>
          <p className="font-display font-bold text-ink-900 dark:text-ink-50">مرحباً، أ. أحمد</p>
          <p className="text-xs text-ink-400">متابعة تقدّم يوسف</p>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-4 p-4">
        {/* ملخص الجلسة الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص جلسة أمس</CardTitle>
            <Badge tone="success">تمت المشاركة</Badge>
          </CardHeader>
          <p className="mb-3 text-sm text-ink-700 dark:text-ink-50">
            تفاعل يوسف بشكل جيد مع بطاقات الحيوانات، ونطق 6 من 10 كلمات مستهدفة بشكل مستقل. يحتاج إلى مزيد
            من التدريب على المبادرة بالطلب دون تلقين.
          </p>
          <div className="flex gap-4">
            <ProgressRing percent={62} size={70} strokeWidth={7} label="التقدم العام" />
            <ProgressRing percent={80} size={70} strokeWidth={7} label="الحضور" tone="sage" />
          </div>
        </Card>

        {/* الدروس المطلوب مراجعتها في المنزل */}
        <div>
          <h2 className="mb-2 font-display font-bold text-ink-900 dark:text-ink-50">
            دروس هذا الأسبوع في المنزل
          </h2>
          <div className="space-y-3">
            {homeworkLessons.map((lesson) => (
              <Card key={lesson.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl2 bg-rifq-50 text-rifq-500 dark:bg-rifq-900">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-ink-900 dark:text-ink-50">{lesson.title}</h4>
                  <p className="mt-1 text-xs text-ink-400">{lesson.instructions}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
