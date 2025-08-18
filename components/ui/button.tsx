"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-foreground text-background hover:opacity-90",
        variant === "secondary" &&
          "bg-[var(--color-muted,oklch(0.95_0_0))] text-foreground hover:bg-[oklch(0.92_0_0)]",
        variant === "destructive" &&
          "bg-[oklch(0.58_0.25_25)] text-background hover:bg-[oklch(0.55_0.28_25)]",
        variant === "outline" &&
          "border border-[color-mix(in_oklab,currentColor_12%,transparent)] bg-background hover:bg-[color-mix(in_oklab,currentColor_5%,transparent)]",
        variant === "ghost" &&
          "hover:bg-[color-mix(in_oklab,currentColor_6%,transparent)]",
        variant === "link" && "underline underline-offset-4 hover:opacity-90",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-12 px-6 text-base",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  );
}

export default Button;

