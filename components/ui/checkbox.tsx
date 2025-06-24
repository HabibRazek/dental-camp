"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "blue" | "success" | "warning" | "danger"
}

function Checkbox({
  className,
  size = "sm",
  variant = "blue",
  ...props
}: CheckboxProps) {
  const sizeClasses = {
    sm: "h-3 w-3", // 12x12px - compact
    md: "h-4 w-4", // 16x16px - standard
    lg: "h-5 w-5"  // 20x20px - larger
  }

  const iconSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3"
  }

  const variantClasses = {
    default: {
      unchecked: "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
      checked: "bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700"
    },
    blue: {
      unchecked: "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50",
      checked: "bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700"
    },
    success: {
      unchecked: "border-gray-300 bg-white hover:border-green-400 hover:bg-green-50",
      checked: "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
    },
    warning: {
      unchecked: "border-gray-300 bg-white hover:border-yellow-400 hover:bg-yellow-50",
      checked: "bg-yellow-600 border-yellow-600 hover:bg-yellow-700 hover:border-yellow-700"
    },
    danger: {
      unchecked: "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50",
      checked: "bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          // Base styles
          "peer relative inline-flex items-center justify-center shrink-0 rounded-sm",
          "border transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Size
          sizeClasses[size],
          // Variant styles
          variantClasses[variant].unchecked,
          "data-[state=checked]:text-white",
          `data-[state=checked]:${variantClasses[variant].checked}`,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className={cn(
            "flex items-center justify-center text-current",
            "transition-all duration-200 ease-in-out",
            "data-[state=checked]:scale-100 data-[state=unchecked]:scale-0"
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CheckIcon className={cn(iconSizes[size], "stroke-[3]")} />
          </motion.div>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </motion.div>
  )
}

export { Checkbox, type CheckboxProps }
