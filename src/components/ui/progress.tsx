import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative overflow-hidden rounded-full bg-primary/10 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary/10",
        success: "bg-success/10",
        destructive: "bg-destructive/10",
        warning: "bg-warning/10",
      },
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out rounded-full",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-[oklch(0.65_0.18_320)]",
        success: "bg-gradient-to-r from-success to-emerald-400",
        destructive: "bg-gradient-to-r from-destructive to-red-400",
        warning: "bg-gradient-to-r from-warning to-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Progress({
  className,
  value,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof progressVariants> & { value?: number }) {
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <div
        className={indicatorVariants({ variant })}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
}

export { Progress, progressVariants }
