import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        "data-horizontal:bg-gradient-to-r data-horizontal:from-transparent data-horizontal:via-primary/20 data-horizontal:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
