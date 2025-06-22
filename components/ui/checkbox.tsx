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
        // Tiny checkbox container with normal checkmark
        "peer relative inline-flex items-center justify-center",
        "h-1.5 w-1.5 shrink-0 rounded-[1px]", // Tiny container: 6x6px
        "border border-gray-400 bg-white",
        "transition-all duration-75 ease-out",
        "hover:border-blue-500 hover:bg-blue-50 hover:scale-110",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
        "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600",
        "data-[state=checked]:border-blue-500 data-[state=checked]:text-white data-[state=checked]:scale-105",
        "data-[state=checked]:hover:from-blue-600 data-[state=checked]:hover:to-blue-700 data-[state=checked]:hover:scale-110",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current",
          "transition-all duration-75 ease-out",
          "data-[state=checked]:scale-100 data-[state=unchecked]:scale-0",
          "data-[state=checked]:rotate-0 data-[state=unchecked]:rotate-45"
        )}
      >
        <CheckIcon className="h-1.5 w-1.5 stroke-[4]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
