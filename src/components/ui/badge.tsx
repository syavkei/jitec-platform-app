import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white shadow-sm hover:bg-indigo-600/80",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        destructive:
          "border-transparent bg-rose-500 text-white shadow-sm hover:bg-rose-500/80",
        success:
          "border-transparent bg-emerald-500 text-white shadow-sm hover:bg-emerald-500/80",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-500/80",
        outline: "text-zinc-700 border border-zinc-200 dark:text-zinc-300 dark:border-zinc-700",
        level1:
          "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm shadow-cyan-500/25",
        level2:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25",
        level3:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-500/25",
        level4:
          "bg-gradient-to-r from-rose-600 via-amber-600 to-orange-500 text-white shadow-sm shadow-rose-500/25",
        ai:
          "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30 animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
