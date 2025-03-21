"\"use client"

import type React from "react"
import type { ClassValue } from "clsx"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-primary text-primary hover:bg-primary/10",
  link: "text-primary underline hover:text-primary/90",
  ghost: "text-primary hover:bg-primary/10",
}

export default function Button({
  children,
  className,
  variant = "default",
  ...props
}: {
  children: React.ReactNode
  className?: ClassValue
  variant?: keyof typeof buttonVariants
  [x: string]: any
}) {
  return (
    <button
      className={cn(
        "relative flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

