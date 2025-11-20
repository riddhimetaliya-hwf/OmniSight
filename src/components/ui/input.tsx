
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "outline";
  inputSize?: "sm" | "default" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", inputSize = "default", ...props }, ref) => {
    const variantClasses = {
      default: "border-input bg-background hover:border-ring/50 focus:border-ring",
      glass: "border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 focus:bg-white/10 focus:border-white/40",
      outline: "border-border bg-transparent hover:border-primary/50 focus:border-primary"
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-3",
      lg: "h-12 px-4 text-lg"
    };

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-omni-sm border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md focus:shadow-lg",
          variantClasses[variant],
          sizeClasses[inputSize],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
