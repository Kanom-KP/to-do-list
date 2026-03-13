import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            default:
              "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)] shadow-sm",
            secondary:
              "bg-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--text-muted)]/20",
            outline:
              "border-2 border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--border)]/50",
            ghost: "text-[var(--text-primary)] hover:bg-[var(--border)]/50",
            destructive:
              "bg-red-500/90 text-white hover:bg-red-600 focus-visible:ring-red-500",
          }[variant],
          {
            sm: "h-9 px-3.5 text-sm",
            md: "h-11 px-5 text-sm",
            lg: "h-12 px-6 text-base",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
