"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  className?: string
  render?: (value: any, row: any) => React.ReactNode
  mobileLabel?: string
  hideOnMobile?: boolean
}

interface ResponsiveTableProps {
  data: any[]
  columns: Column[]
  title?: string
  description?: string
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  className?: string
  cardClassName?: string
  onRowClick?: (row: any) => void
}

export function ResponsiveTable({
  data,
  columns,
  title,
  description,
  emptyMessage = "Aucune donnée disponible",
  emptyIcon,
  className,
  cardClassName,
  onRowClick
}: ResponsiveTableProps) {
  const visibleColumns = columns.filter(col => !col.hideOnMobile)
  const mobileColumns = columns.filter(col => col.mobileLabel || !col.hideOnMobile)

  if (data.length === 0) {
    return (
      <Card className={cn("", cardClassName)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            {emptyIcon && <div className="flex justify-center mb-4">{emptyIcon}</div>}
            <p className="text-lg font-medium mb-2">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", cardClassName)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className={cn("w-full border-collapse", className)}>
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left p-3 font-medium text-gray-900",
                      column.className
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("p-3", column.className)}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {data.map((row, index) => (
            <div
              key={index}
              className={cn(
                "bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(row)}
            >
              <div className="space-y-3">
                {mobileColumns.map((column) => {
                  const value = column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  
                  if (!value && value !== 0) return null

                  return (
                    <div key={column.key} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">
                        {column.mobileLabel || column.label}:
                      </span>
                      <span className="text-sm text-gray-900 font-medium text-right ml-2">
                        {value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Utility component for responsive grid layouts
export function ResponsiveGrid({
  children,
  cols = 1,
  smCols = 2,
  lgCols = 3,
  xlCols = 4,
  gap = 6,
  className
}: {
  children: React.ReactNode
  cols?: number
  smCols?: number
  lgCols?: number
  xlCols?: number
  gap?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        `grid grid-cols-${cols} sm:grid-cols-${smCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols} gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  )
}

// Utility component for responsive flex layouts
export function ResponsiveFlex({
  children,
  direction = "col",
  smDirection = "row",
  align = "start",
  justify = "start",
  gap = 4,
  className
}: {
  children: React.ReactNode
  direction?: "row" | "col"
  smDirection?: "row" | "col"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
  gap?: number
  className?: string
}) {
  const alignClass = {
    start: "items-start",
    center: "items-center", 
    end: "items-end",
    stretch: "items-stretch"
  }[align]

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end", 
    between: "justify-between",
    around: "justify-around"
  }[justify]

  return (
    <div
      className={cn(
        `flex flex-${direction} sm:flex-${smDirection} ${alignClass} ${justifyClass} gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  )
}
