import * as React from "react"

import { cn, colors } from "@/lib/utils"

export interface ParagraphProps
  extends React.InputHTMLAttributes<HTMLParagraphElement> {}

const TypographyP = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, ...props }) => {
    return (
      <p
        className={cn(
          "text-sm font-medium leading-none",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyP.displayName = "TypographyP"

export { TypographyP }
  