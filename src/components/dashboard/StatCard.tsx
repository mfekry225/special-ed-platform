import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "rifq" | "amber" | "sage";
}

const toneClasses = {
  rifq: "bg-rifq-50 text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200",
  amber: "bg-amber-50 text-amber-600",
  sage: "bg-sage-100 text-sage-600",
};

export function StatCard({ icon: Icon, label, value, hint, tone = "rifq" }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl2", toneClasses[tone])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-bold text-ink-400">{label}</p>
        <p className="font-data text-2xl font-extrabold text-ink-900 dark:text-ink-50">{value}</p>
        {hint && <p className="text-[11px] text-ink-400">{hint}</p>}
      </div>
    </Card>
  );
}
