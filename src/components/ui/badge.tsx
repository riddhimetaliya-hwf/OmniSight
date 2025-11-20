
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-success/10 text-success border border-success/20 hover:bg-success/20 shadow-sm",
        warning: "border-transparent bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 shadow-sm",
        info: "border-transparent bg-info/10 text-info border border-info/20 hover:bg-info/20 shadow-sm",
        critical: "border-transparent bg-critical/10 text-critical border border-critical/20 hover:bg-critical/20 shadow-sm",
        glass: "border-white/20 bg-white/10 text-foreground backdrop-blur-sm hover:bg-white/20 shadow-glass",
        gradient: "border-transparent bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg shadow-sm",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
