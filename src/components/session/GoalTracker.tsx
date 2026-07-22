"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "./ProgressRing";
import { MessageSquarePlus } from "lucide-react";

export type Rating = "لم_يستجب" | "بمساعدة_كاملة" | "بمساعدة_جزئية" | "مستقل";

const ratingConfig: { value: Rating; label: string; weight: number; activeClass: string }[] = [
  { value: "لم_يستجب", label: "لم يستجب", weight: 0, activeClass: "bg-coral-500 border-coral-500 text-white" },
  { value: "بمساعدة_كاملة", label: "مساعدة كاملة", weight: 33, activeClass: "bg-amber-500 border-amber-500 text-white" },
  { value: "بمساعدة_جزئية", label: "مساعدة جزئية", weight: 66, activeClass: "bg-rifq-400 border-rifq-400 text-white" },
  { value: "مستقل", label: "مستقل", weight: 100, activeClass: "bg-sage-500 border-sage-500 text-white" },
];

interface GoalTrackerProps {
  goalId: string;
  domain: string;
  title: string;
  kpi: string;
  baselineProgress: number; // نسبة التقدم المتراكمة قبل هذه الجلسة
  onChange?: (goalId: string, rating: Rating, note: string) => void;
}

export function GoalTracker({ goalId, domain, title, kpi, baselineProgress, onChange }: GoalTrackerProps) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const sessionWeight = rating ? ratingConfig.find((r) => r.value === rating)!.weight : baselineProgress;
  // نمزج أداء الجلسة الحالية مع خط الأساس بوزن بسيط لعرض تقدير حي للتقدم
  const displayedProgress = rating ? Math.round(baselineProgress * 0.7 + sessionWeight * 0.3) : baselineProgress;

  function handleRate(value: Rating) {
    setRating(value);
    onChange?.(goalId, value, note);
  }

  return (
    <div className="rounded-xl2 border border-ink-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="mb-1 inline-block rounded-full bg-rifq-50 px-2 py-0.5 text-[11px] font-bold text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200">
            {domain}
          </span>
          <h4 className="font-display font-bold leading-snug text-ink-900 dark:text-ink-50">{title}</h4>
          <p className="mt-1 text-xs text-ink-400">مؤشر القياس: {kpi}</p>
        </div>
        <ProgressRing percent={displayedProgress} size={64} strokeWidth={7} tone={rating ? "sage" : "rifq"} />
      </div>

      {/* أزرار تقييم الأداء — كبيرة، بلون واضح، مناسبة للمس السريع أثناء الجلسة */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ratingConfig.map((r) => (
          <button
            key={r.value}
            onClick={() => handleRate(r.value)}
            className={cn(
              "touch-target rounded-xl2 border-2 px-2 py-2.5 text-xs font-bold transition-all active:scale-95",
              rating === r.value
                ? r.activeClass
                : "border-ink-100 bg-ink-50 text-ink-700 dark:border-dark-border dark:bg-dark-bg dark:text-ink-50"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowNote((s) => !s)}
        className="mt-3 flex touch-target items-center gap-1.5 text-xs font-bold text-rifq-500"
      >
        <MessageSquarePlus size={16} />
        {showNote ? "إخفاء الملاحظة" : "إضافة ملاحظة سلوكية"}
      </button>

      {showNote && (
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (rating) onChange?.(goalId, rating, e.target.value);
          }}
          placeholder="مثال: تشتّت الانتباه بعد 5 دقائق، تحسّن التواصل البصري..."
          className="mt-2 w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400 dark:border-dark-border dark:bg-dark-bg"
          rows={2}
        />
      )}
    </div>
  );
}
