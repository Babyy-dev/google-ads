import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="size-6 rounded-md bg-[conic-gradient(at_50%_50%,oklch(0.84_0.17_260),oklch(0.84_0.17_20),oklch(0.84_0.17_145),oklch(0.84_0.17_260))] shadow-[0_0_0_3px_#fff]"
      />
      <span className="text-base font-semibold tracking-tight">AdShield</span>
    </div>
  );
}

