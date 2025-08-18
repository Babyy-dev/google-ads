import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-foreground text-background",
        variant === "secondary" && "bg-[oklch(0.95_0_0)] text-foreground",
        variant === "success" && "bg-[oklch(0.9_0.12_145)] text-[oklch(0.36_0.12_145)]",
        variant === "warning" && "bg-[oklch(0.95_0.11_75)] text-[oklch(0.5_0.11_75)]",
        variant === "destructive" && "bg-[oklch(0.72_0.19_25)] text-[oklch(0.38_0.19_25)]",
        variant === "outline" &&
          "border border-[color-mix(in_oklab,currentColor_18%,transparent)] text-foreground",
        className
      )}
      {...props}
    />
  );
}

