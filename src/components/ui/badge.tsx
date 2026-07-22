import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "info" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700 dark:bg-dark-border dark:text-ink-50",
  success: "bg-sage-100 text-sage-600",
  warning: "bg-amber-100 text-amber-600",
  info: "bg-rifq-100 text-rifq-600",
  danger: "bg-coral-100 text-coral-600",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
