import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-border bg-secondary/50 text-secondary-foreground",
        positive:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-400",
        negative: "border-red-500/20 bg-red-500/10 text-red-400",
        info: "border-sky-500/20 bg-sky-500/10 text-sky-400",
        brand:
          "border-primary/20 bg-primary/10 text-primary",
        muted: "border-border bg-muted/30 text-muted-foreground",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  pulse?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, tone, size, label, pulse = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ tone, size }), className)}
        {...props}
      >
        {pulse && (
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                tone === "positive" && "bg-emerald-400",
                tone === "warning" && "bg-amber-400",
                tone === "negative" && "bg-red-400",
                tone === "info" && "bg-sky-400",
                tone === "brand" && "bg-primary",
                (!tone || tone === "neutral" || tone === "muted") && "bg-muted-foreground"
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-1.5 w-1.5 rounded-full",
                tone === "positive" && "bg-emerald-500",
                tone === "warning" && "bg-amber-500",
                tone === "negative" && "bg-red-500",
                tone === "info" && "bg-sky-500",
                tone === "brand" && "bg-primary",
                (!tone || tone === "neutral" || tone === "muted") && "bg-muted-foreground"
              )}
            />
          </span>
        )}
        {label}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
