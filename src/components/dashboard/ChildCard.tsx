import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ChildCardProps {
  id: string;
  name: string;
  age: string;
  diagnosis: string;
  lastSession: string;
  nextGoalDue?: string;
  overallProgress: number;
}

const diagnosisTone: Record<string, "info" | "warning" | "neutral"> = {
  طيف_التوحد: "info",
  تأخر_لغوي: "warning",
};

export function ChildCard({ id, name, age, diagnosis, lastSession, overallProgress }: ChildCardProps) {
  return (
    <Link href={`/children/${id}`}>
      <Card className="flex items-center gap-4 transition-shadow hover:shadow-soft active:scale-[0.99]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rifq-100 font-display text-lg font-bold text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200">
          {name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-display font-bold text-ink-900 dark:text-ink-50">{name}</h4>
            <Badge tone={diagnosisTone[diagnosis] ?? "neutral"}>{diagnosis.replaceAll("_", " ")}</Badge>
          </div>
          <p className="text-xs text-ink-400">
            {age} · آخر جلسة: {lastSession} · نسبة التقدّم {overallProgress}٪
          </p>
        </div>

        <ChevronLeft className="shrink-0 text-ink-400" size={20} />
      </Card>
    </Link>
  );
}
