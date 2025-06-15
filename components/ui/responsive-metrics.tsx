"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Metric {
  title: string
  value: string | number
  icon?: React.ReactNode
  change?: number
  changeLabel?: string
  description?: string
  color?: "blue" | "green" | "red" | "orange" | "purple" | "gray"
  trend?: "up" | "down" | "neutral"
  badge?: string
  className?: string
}

interface ResponsiveMetricsProps {
  metrics: Metric[]
  cols?: number
  smCols?: number
  lgCols?: number
  xlCols?: number
  gap?: number
  className?: string
  animated?: boolean
}

export function ResponsiveMetrics({
  metrics,
  cols = 1,
  smCols = 2,
  lgCols = 3,
  xlCols = 4,
  gap = 6,
  className,
  animated = true
}: ResponsiveMetricsProps) {
  const getColorClasses = (color: string = "blue") => {
    const colors = {
      blue: "text-blue-600 bg-blue-50",
      green: "text-green-600 bg-green-50",
      red: "text-red-600 bg-red-50",
      orange: "text-orange-600 bg-orange-50",
      purple: "text-purple-600 bg-purple-50",
      gray: "text-gray-600 bg-gray-50"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getTrendColor = (trend?: string) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div
      className={cn(
        `grid grid-cols-${cols} sm:grid-cols-${smCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols} gap-${gap}`,
        className
      )}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={animated ? { opacity: 0, y: 20 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={animated ? { delay: index * 0.1, duration: 0.5 } : undefined}
        >
          <Card className={cn("h-full", metric.className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              {metric.icon && (
                <div className={cn("p-2 rounded-lg", getColorClasses(metric.color))}>
                  {metric.icon}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Main Value */}
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  {metric.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {metric.badge}
                    </Badge>
                  )}
                </div>

                {/* Change/Trend */}
                {(metric.change !== undefined || metric.trend) && (
                  <div className={cn("flex items-center text-xs", getTrendColor(metric.trend))}>
                    {getTrendIcon(metric.trend)}
                    {metric.change !== undefined && (
                      <span className="ml-1">
                        {metric.change > 0 ? "+" : ""}{metric.change}%
                        {metric.changeLabel && ` ${metric.changeLabel}`}
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {metric.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Utility component for responsive stat cards
export function ResponsiveStatCard({
  title,
  value,
  icon,
  description,
  color = "blue",
  className
}: {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  color?: "blue" | "green" | "red" | "orange" | "purple" | "gray"
  className?: string
}) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600",
      gray: "from-gray-500 to-gray-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className={cn("bg-gradient-to-r text-white p-4", getColorClasses(color))}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            {icon && (
              <div className="opacity-80">
                {icon}
              </div>
            )}
          </div>
        </div>
        {description && (
          <div className="p-4">
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Utility component for responsive progress cards
export function ResponsiveProgressCard({
  title,
  value,
  max = 100,
  percentage,
  color = "blue",
  description,
  className
}: {
  title: string
  value: number
  max?: number
  percentage?: number
  color?: "blue" | "green" | "red" | "orange" | "purple"
  description?: string
  className?: string
}) {
  const calculatedPercentage = percentage || (value / max) * 100

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      red: "bg-red-600",
      orange: "bg-orange-600",
      purple: "bg-purple-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(calculatedPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn("h-2 rounded-full transition-all duration-300", getColorClasses(color))}
              style={{ width: `${Math.min(calculatedPercentage, 100)}%` }}
            />
          </div>
          
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
