"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: "select" | "input" | "date"
  options?: FilterOption[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
  hideLabel?: boolean
}

interface ActionButton {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "destructive"
  className?: string
  mobileLabel?: string
}

interface ResponsiveFiltersProps {
  filters: FilterConfig[]
  actions?: ActionButton[]
  className?: string
  title?: string
  description?: string
}

export function ResponsiveFilters({
  filters,
  actions = [],
  className,
  title,
  description
}: ResponsiveFiltersProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-end gap-4 w-full lg:w-auto">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-2 w-full sm:w-auto min-w-0">
              {!filter.hideLabel && (
                <Label className="text-sm font-medium whitespace-nowrap">
                  {filter.label}:
                </Label>
              )}
              
              {filter.type === "select" && (
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger className={cn("w-full sm:w-40", filter.className)}>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filter.type === "input" && (
                <Input
                  type="text"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  placeholder={filter.placeholder}
                  className={cn("w-full sm:w-56", filter.className)}
                />
              )}

              {filter.type === "date" && (
                <Input
                  type="date"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={cn("w-full sm:w-40", filter.className)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "outline"}
                size="sm"
                className={cn("w-full sm:w-auto", action.className)}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.mobileLabel || action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Utility component for responsive form layouts
export function ResponsiveForm({
  children,
  onSubmit,
  className
}: {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-6", className)}
    >
      {children}
    </form>
  )
}

// Utility component for responsive form fields
export function ResponsiveFormField({
  label,
  children,
  required = false,
  error,
  description,
  className
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  error?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// Utility component for responsive form grid
export function ResponsiveFormGrid({
  children,
  cols = 1,
  smCols = 2,
  className
}: {
  children: React.ReactNode
  cols?: number
  smCols?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        `grid grid-cols-${cols} sm:grid-cols-${smCols} gap-4`,
        className
      )}
    >
      {children}
    </div>
  )
}
