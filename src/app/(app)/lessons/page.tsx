import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, PlayCircle } from "lucide-react";

const lessons = [
  { id: "1", title: "بطاقات الحيوانات الناطقة", domain: "لغوي", assignedTo: 4 },
  { id: "2", title: "تمرين تبادل الأدوار — لعبة الكرة", domain: "تواصل_اجتماعي", assignedTo: 2 },
  { id: "3", title: "جدول الروتين اليومي المصوّر", domain: "سلوكي", assignedTo: 6 },
];

export default function LessonsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">بنك الدروس والأنشطة</h1>
        <Button>
          <Plus size={18} /> درس جديد
        </Button>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-rifq-50 text-rifq-500 dark:bg-rifq-900">
              <PlayCircle size={22} />
            </div>
            <div className="flex-1">
              <h4 className="font-display font-bold text-ink-900 dark:text-ink-50">{lesson.title}</h4>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone="info">{lesson.domain.replaceAll("_", " ")}</Badge>
                <span className="text-xs text-ink-400">مخصص لـ {lesson.assignedTo} أطفال</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
