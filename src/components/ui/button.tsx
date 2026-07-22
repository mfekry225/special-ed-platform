import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-rifq-500 text-white hover:bg-rifq-600 active:bg-rifq-700 shadow-soft",
  secondary: "bg-rifq-50 text-rifq-700 hover:bg-rifq-100 dark:bg-dark-surface dark:text-rifq-200",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-50 dark:hover:bg-dark-surface",
  success: "bg-sage-500 text-white hover:bg-sage-600",
  danger: "bg-coral-500 text-white hover:bg-coral-600",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-14 px-6 text-base", // مناسب للمس السريع على الآيباد
  icon: "h-11 w-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "touch-target inline-flex items-center justify-center gap-2 rounded-xl2 font-body font-medium",
          "transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
