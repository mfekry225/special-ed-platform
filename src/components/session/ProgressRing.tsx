"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percent: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: "rifq" | "amber" | "sage";
  className?: string;
}

const toneColors = {
  rifq: "#2F6F6B",
  amber: "#E8A24D",
  sage: "#7FA381",
};

/**
 * حلقة التقدم — العنصر البصري المميز لمنصة "رِفق".
 * بدلاً من الرسوم البيانية العمودية التقليدية، تُعرض نسبة إنجاز كل هدف
 * كحلقة شارة دائرية هادئة، أقرب لأسلوب "الإنجاز" المحبب للأطفال
 * وأخف على العين من الأعمدة الملونة الكثيفة.
 */
export function ProgressRing({
  percent,
  size = 96,
  strokeWidth = 9,
  label,
  sublabel,
  tone = "rifq",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-ink-100 dark:text-dark-border"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={toneColors[tone]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={
              {
                "--ring-start": circumference,
                "--ring-end": offset,
                strokeDashoffset: offset,
              } as React.CSSProperties
            }
            className="animate-ring-progress"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-data text-lg font-bold text-ink-900 dark:text-ink-50">
            {Math.round(percent)}٪
          </span>
        </div>
      </div>
      {label && (
        <span className="text-center text-xs font-bold text-ink-700 dark:text-ink-50">{label}</span>
      )}
      {sublabel && <span className="text-center text-[11px] text-ink-400">{sublabel}</span>}
    </div>
  );
}
