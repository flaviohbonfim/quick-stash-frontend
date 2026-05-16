import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 shadow-sm transition-all duration-200 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-1.25rem] [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "bg-card border-border text-foreground shadow-card",
        destructive:
          "bg-destructive/5 border-destructive/20 text-destructive shadow-card hover:shadow-destructive/5",
        success:
          "bg-success/5 border-success/20 text-success shadow-card hover:shadow-success/5",
        warning:
          "bg-warning/5 border-warning/20 text-warning shadow-card hover:shadow-warning/5",
        info:
          "bg-primary/5 border-primary/20 text-primary shadow-card hover:shadow-primary/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconVariants = cva(
  "size-5 shrink-0",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-success",
        warning: "text-warning",
        info: "text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn(
        "mb-1 font-medium leading-none tracking-tight text-base",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm opacity-90 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertIcon({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"svg"> &
  VariantProps<typeof iconVariants>) {
  return (
    <span
      data-slot="alert-icon"
      className={cn(iconVariants({ variant }), className)}
      {...props}
    >
      <Info className="size-5" />
    </span>
  )
}

export { Alert, AlertTitle, AlertDescription, AlertIcon, alertVariants }
