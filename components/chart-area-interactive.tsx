"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"

// Sample dental clinic data
const chartData = [
  { date: "2024-01-01", appointments: 45, revenue: 4500, patients: 38 },
  { date: "2024-01-02", appointments: 52, revenue: 5200, patients: 42 },
  { date: "2024-01-03", appointments: 48, revenue: 4800, patients: 40 },
  { date: "2024-01-04", appointments: 61, revenue: 6100, patients: 51 },
  { date: "2024-01-05", appointments: 55, revenue: 5500, patients: 47 },
  { date: "2024-01-06", appointments: 67, revenue: 6700, patients: 58 },
  { date: "2024-01-07", appointments: 43, revenue: 4300, patients: 36 },
  { date: "2024-01-08", appointments: 58, revenue: 5800, patients: 49 },
  { date: "2024-01-09", appointments: 64, revenue: 6400, patients: 55 },
  { date: "2024-01-10", appointments: 59, revenue: 5900, patients: 51 },
  { date: "2024-01-11", appointments: 72, revenue: 7200, patients: 63 },
  { date: "2024-01-12", appointments: 68, revenue: 6800, patients: 59 },
  { date: "2024-01-13", appointments: 71, revenue: 7100, patients: 62 },
  { date: "2024-01-14", appointments: 65, revenue: 6500, patients: 56 },
  { date: "2024-01-15", appointments: 78, revenue: 7800, patients: 68 },
]

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("15d")
  const [metric, setMetric] = React.useState("appointments")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-01-15")
    let daysToSubtract = 15
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const maxValue = Math.max(...filteredData.map(item => item[metric as keyof typeof item] as number))

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Clinic Performance</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Track your clinic's key metrics over time
          </span>
          <span className="@[540px]/card:hidden">Clinic metrics</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointments">Appointments</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="patients">Patients</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15d">Last 15 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-[250px] w-full">
          <div className="flex h-full items-end justify-between gap-1 px-4">
            {filteredData.map((item, index) => {
              const value = item[metric as keyof typeof item] as number
              const height = (value / maxValue) * 200
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-400"
                    style={{ height: `${height}px` }}
                    title={`${formatDate(item.date)}: ${value}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} over {timeRange}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
