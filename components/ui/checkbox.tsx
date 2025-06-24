"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Small checkbox cadre/frame - compact container size
        "peer relative inline-flex items-center justify-center",
        "h-3 w-3 shrink-0 rounded-sm", // Smaller cadre: 12x12px
        "border border-gray-300 bg-white",
        "transition-all duration-150 ease-in-out",
        "hover:border-blue-400 hover:bg-blue-50",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
        "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white",
        "data-[state=checked]:hover:bg-blue-700 data-[state=checked]:hover:border-blue-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current",
          "transition-all duration-150 ease-in-out",
          "data-[state=checked]:scale-100 data-[state=unchecked]:scale-0"
        )}
      >
        <CheckIcon className="h-2 w-2 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
