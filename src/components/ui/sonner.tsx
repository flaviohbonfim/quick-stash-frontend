"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-success" />
        ),
        info: (
          <InfoIcon className="size-4 text-primary" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-warning" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-destructive" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-lg)",
          "--success-bg": "oklch(0.60 0.18 155 / 0.1)",
          "--success-border": "oklch(0.60 0.18 155 / 0.2)",
          "--success-text": "oklch(0.60 0.18 155)",
          "--info-bg": "oklch(0.55 0.22 295 / 0.08)",
          "--info-border": "oklch(0.55 0.22 295 / 0.2)",
          "--info-text": "oklch(0.55 0.22 295)",
          "--warning-bg": "oklch(0.78 0.16 70 / 0.1)",
          "--warning-border": "oklch(0.78 0.16 70 / 0.2)",
          "--warning-text": "oklch(0.78 0.16 70)",
          "--error-bg": "oklch(0.55 0.22 25 / 0.1)",
          "--error-border": "oklch(0.55 0.22 25 / 0.2)",
          "--error-text": "oklch(0.55 0.22 25)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group/toast rounded-xl border shadow-card group-data-[type=success]:border-success/20 group-data-[type=success]:bg-success/5 group-data-[type=success]:text-success group-data-[type=info]:border-primary/20 group-data-[type=info]:bg-primary/5 group-data-[type=info]:text-primary group-data-[type=warning]:border-warning/20 group-data-[type=warning]:bg-warning/5 group-data-[type=warning]:text-warning group-data-[type=error]:border-destructive/20 group-data-[type=error]:bg-destructive/5 group-data-[type=error]:text-destructive",
          title: "group-[.toast]:font-medium",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
