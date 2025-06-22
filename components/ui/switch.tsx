"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Professional slider design - smaller and more compact
        "peer relative inline-flex items-center",
        "h-4 w-7 shrink-0 rounded-full border border-transparent",
        "transition-all duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked state - subtle gray
        "data-[state=unchecked]:bg-gray-300",
        "data-[state=unchecked]:shadow-inner",
        // Checked state - clean blue
        "data-[state=checked]:bg-blue-500",
        "data-[state=checked]:shadow-sm",
        // Hover effects - subtle
        "hover:shadow-md",
        "data-[state=checked]:hover:bg-blue-600",
        "data-[state=unchecked]:hover:bg-gray-400",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm ring-0",
          "transition-all duration-200 ease-in-out",
          // Smaller thumb size
          "h-3 w-3",
          "data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:translate-x-3.5",
          // Clean shadow
          "shadow-md",
          "data-[state=checked]:shadow-sm",
          "data-[state=unchecked]:shadow-sm"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
