"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Professional, smaller radio button design
        "relative inline-flex items-center justify-center",
        "h-3.5 w-3.5 shrink-0 rounded-full", // Smaller size: 14x14px
        "border border-gray-300 bg-white",
        "transition-all duration-200 ease-in-out",
        "hover:border-blue-400 hover:bg-blue-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
        "data-[state=checked]:hover:border-blue-700 data-[state=checked]:hover:bg-blue-700",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
        "shadow-sm hover:shadow-md data-[state=checked]:shadow-md",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "flex items-center justify-center",
          "transition-all duration-150 ease-in-out",
          "data-[state=checked]:scale-100 data-[state=unchecked]:scale-0"
        )}
      >
        <CircleIcon className="h-1.5 w-1.5 fill-white text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
